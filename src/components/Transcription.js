import React, { useState, useEffect } from "react";
import { Grid, Typography, Paper, Box } from "@mui/material";

const sampleConversation = [
  { speaker: "Person 1", message: "Hi, how are you?" },
  { speaker: "Person 2", message: "I'm doing great! How about you?" },
  { speaker: "Person 1", message: "I'm good too, thanks for asking." },
  { speaker: "Person 2", message: "What are you up to today?" },
  { speaker: "Person 1", message: "I'm working on a new project." },
  { speaker: "Person 2", message: "That sounds interesting! Good luck!" },
];

const Transcription = () => {
  const [transcript, setTranscript] = useState("");
  const [translation, setTranslation] = useState("");
  const [detectedLang, setDetectedLang] = useState("");


  useEffect(() => {
    const socket = new WebSocket("ws://localhost:8765");

    socket.addEventListener("message", (event) => {
      const data = JSON.parse(event.data);
      setTranscript(data.transcript);
      setTranslation(data.translation || "");
      setDetectedLang(data.detected_lang);
      console.log("transcript: ", transcript, "\ntranslation: ", translation, "\nlang: ", detectedLang);
    });

    socket.addEventListener("open", (event) => {
      console.log("WebSocket connection established");
      socket.send("start");
    });

    socket.addEventListener("error", (event) => {
      console.error("WebSocket error:", event);
    });

    socket.addEventListener("close", (event) => {
      console.log("WebSocket connection closed.");
    });
      
    return () => {
      socket.close();
    }
  }, []);

  return (
    // <Grid container spacing={2} direction="column">
    //   {sampleConversation.map((entry, index) => (
    //     <Grid item key={index}>
    //       <Paper
    //         sx={{
    //           padding: 2,
    //           backgroundColor: entry.speaker === "Person 1" ? "primary.light" : "secondary.light",
    //         }}
    //       >
    //         <Typography variant="subtitle1" fontWeight="bold">
    //           {entry.speaker}
    //         </Typography>
    //         <Typography variant="body1">{entry.message}</Typography>
    //       </Paper>
    //     </Grid>
    //   ))}
    // </Grid>
    <Box sx={{ flexGrow: 1, p: 3, }}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Typography variant="h4" gutterBottom>
            Real-time Transcription Display
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Typography variant="h5" gutterBottom>
            Detected Language: {detectedLang}
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Typography variant="body1" gutterBottom>
            Transcript:
          </Typography>
          <Typography variant="body2">{transcript}</Typography>
        </Grid>
        {translation && (
          <Grid item xs={12}>
            <Typography variant="body1" gutterBottom>
              Translation:
            </Typography>
            <Typography variant="body2">{translation}</Typography>
          </Grid>
        )}
      </Grid>
    </Box>
  );
};

export default Transcription;