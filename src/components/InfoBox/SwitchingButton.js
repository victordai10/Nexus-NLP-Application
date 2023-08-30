import { useContext, useState } from "react";
import { InfoBoxSharedContext } from "./InfoForm";

export default function SwitchingButton(props) {
  const { editing, setEditing } = useContext(InfoBoxSharedContext);
  const [buttonLabel, setButtonLabel] = useState(props.label1);

  const handleClick = () => {
    setEditing(!editing);
    if (buttonLabel === props.label1) {
      setButtonLabel(props.label2);
    } else {
      setButtonLabel(props.label1);
    }
  };

  return (
    <div>
      <button onClick={handleClick}>{buttonLabel}</button>
    </div>
  );
}
