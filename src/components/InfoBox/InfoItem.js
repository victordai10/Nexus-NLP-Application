import { useContext, useState } from "react";
import Typography from "@mui/material/Typography";
import { InfoBoxSharedContext } from "./InfoForm";
import TextField from "@mui/material/TextField";

export default function InfoItem(props) {
  const { editing, setEditing } = useContext(InfoBoxSharedContext);
  const [inputValue, setInputValue] = useState("");

  const handleChange = (event) => {
    setInputValue(event.target.value);
  };

  return (
    <div>
      {editing && (
        <div>
          <form>
            <Typography component="h3" variant="h7" sx={{ my: 4 }}>
              <TextField
                type="text"
                label={props.label}
                value={inputValue}
                onChange={handleChange}
              />
            </Typography>
          </form>
        </div>
      )}
      {!editing && (
        <div>
          <Typography display="inline" component="h3" variant="h7">
            {props.label}: </Typography>
          <Typography display="inline" component="h3" variant="body1">
            {inputValue}
          </Typography>
        </div>
      )}
    </div>
  );
}
