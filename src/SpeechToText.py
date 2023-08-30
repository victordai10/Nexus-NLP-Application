import asyncio
import websockets
import queue
import re
import sys
import os
os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = "C:/Users/VD5693/Desktop/first-net-app/credentials/basic-zenith-392719-06f739fc7837.json"
from google.cloud import speech
from langdetect import detect
from googletrans import Translator
import pyaudio
import json

translator = Translator()
# Audio recording parameters
RATE = 16000
CHUNK = int(RATE / 10)  # 100ms

class MicrophoneStream:
    """Opens a recording stream as a generator yielding the audio chunks."""

    def __init__(self: object, rate: int = RATE, chunk: int = CHUNK) -> None:
        """The audio -- and generator -- is guaranteed to be on the main thread."""
        self._rate = rate
        self._chunk = chunk

        # Create a thread-safe buffer of audio data
        self._buff = queue.Queue()
        self.closed = True

    def __enter__(self: object) -> object:
        self._audio_interface = pyaudio.PyAudio()
        self._audio_stream = self._audio_interface.open(
            format=pyaudio.paInt16,
            # The API currently only supports 1-channel (mono) audio
            # https://goo.gl/z757pE
            channels=1,
            rate=self._rate,
            input=True,
            frames_per_buffer=self._chunk,
            # Run the audio stream asynchronously to fill the buffer object.
            # This is necessary so that the input device's buffer doesn't
            # overflow while the calling thread makes network requests, etc.
            stream_callback=self._fill_buffer,
        )

        self.closed = False

        return self

    def __exit__(
        self: object,
        type: object,
        value: object,
        traceback: object,
    ) -> None:
        """Closes the stream, regardless of whether the connection was lost or not."""
        self._audio_stream.stop_stream()
        self._audio_stream.close()
        self.closed = True
        # Signal the generator to terminate so that the client's
        # streaming_recognize method will not block the process termination.
        self._buff.put(None)
        self._audio_interface.terminate()

    def _fill_buffer(
        self: object,
        in_data: object,
        frame_count: int,
        time_info: object,
        status_flags: object,
    ) -> object:
        """Continuously collect data from the audio stream, into the buffer.

        Args:
            in_data: The audio data as a bytes object
            frame_count: The number of frames captured
            time_info: The time information
            status_flags: The status flags

        Returns:
            The audio data as a bytes object
        """
        self._buff.put(in_data)
        return None, pyaudio.paContinue

    def generator(self: object) -> object:
        """Generates audio chunks from the stream of audio data in chunks.

        Args:
            self: The MicrophoneStream object

        Returns:
            A generator that outputs audio chunks.
        """
        while not self.closed:
            # Use a blocking get() to ensure there's at least one chunk of
            # data, and stop iteration if the chunk is None, indicating the
            # end of the audio stream.
            chunk = self._buff.get()
            if chunk is None:
                return
            data = [chunk]

            # Now consume whatever other data's still buffered.
            while True:
                try:
                    chunk = self._buff.get(block=False)
                    if chunk is None:
                        return
                    data.append(chunk)
                except queue.Empty:
                    break

            yield b"".join(data)


async def start_server(websocket, path):
    print("Client connected")

    # Set up Google Cloud Speech client
    language_code = "en-US"
    client = speech.SpeechClient()
    speaker_diarization_config = speech.SpeakerDiarizationConfig(
        enable_speaker_diarization=True,
        min_speaker_count=1,
        max_speaker_count=2,
    )
    config = speech.RecognitionConfig(
        encoding=speech.RecognitionConfig.AudioEncoding.LINEAR16,
        sample_rate_hertz=RATE,
        language_code=language_code,
        diarization_config=speaker_diarization_config,
    )

    streaming_config = speech.StreamingRecognitionConfig(
        config=config, interim_results=True, enable_speaker_diarization=True
    )

    # Start audio streaming
    with MicrophoneStream(RATE, CHUNK) as stream:
        audio_generator = stream.generator()
        requests = (
            speech.StreamingRecognizeRequest(audio_content=content)
            for content in audio_generator
        )

        responses = client.streaming_recognize(streaming_config, requests)

        for response in responses:
            if not response.results:
                continue

            result = response.results[0]
            if not result.alternatives:
                continue

            transcript = result.alternatives[0].transcript

            # Detect the language
            detected_lang = detect(transcript)

            # Check if speaker diarization is enabled and parse speaker information
            speaker_info = ""
            if result.result_end_time.seconds:
                speaker_tag = result.result_index
                speaker_info = f"Speaker {speaker_tag}:"

            # Display interim results
            overwrite_chars = " " * (num_chars_printed - len(transcript))

            if not result.is_final:
                sys.stdout.write(speaker_info + transcript + overwrite_chars + "\r")
                sys.stdout.flush()

            else:
                print(speaker_info + transcript + overwrite_chars)

                # Speaker diarization labels
                speaker_labels = response.results[0].alternatives[0].words
                speakers = []
                current_speaker = 1
                for word_info in speaker_labels:
                    if word_info.speaker_tag == current_speaker:
                        speakers.append(word_info.word)
                    else:
                        speakers[-1] += " " + word_info.word
                        current_speaker = word_info.speaker_tag

                # Translate to English if the detected language is not English
                translation = ""
                if detected_lang != "en":
                    translation = translator.translate(transcript, src=detected_lang, dest="en").text
                    print(f"Detect Language: {detected_lang}")
                    print(f"Translation: {translation}")

                # Send data to the React frontend through the WebSocket
                data = {
                    "transcript": transcript,
                    "translation": translation,
                    "detected_lang": detected_lang,
                    "speakers": speakers
                }
                await websocket.send(json.dumps(data))

            num_chars_printed = 0

    print("Client disconnected")

def main():
    asyncio.get_event_loop().run_until_complete(
        websockets.serve(start_server, "localhost", 8765)
    )
    asyncio.get_event_loop().run_forever()

if __name__ == "__main__":
    main()