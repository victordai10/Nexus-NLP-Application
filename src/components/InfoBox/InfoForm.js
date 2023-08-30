import { createContext, useState } from "react";
import SwitchingButton from "./SwitchingButton";
import InfoItem from "./InfoItem";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import EditIcon from "@mui/icons-material/Edit";
import Button from "@mui/material/Button";


const InfoBoxSharedContext = createContext();

export default function InfoBox(props) {
  const [editing, setEditing] = useState(false);

  return (
    <Grid
      item
      xs={12}
      sm={8}
      md={5}
      component={Paper}
      elevation={6}
      square
      sx={{
        borderRadius: 2.0,
        m: "10px",
        padding: "10px",
        backgroundColor: "#8bc6da",
        position: "relative",
        width: "100%",
        borderRadius: 2.0,
        cursor: "pointer",
        transition: "all 0.3s",
        ":hover": {
          backgroundColor: "white",
          transform: "scale(1.05)",
          transition: "all 0.3s",
        },
      }}>
      <Box
        sx={{
          my: 8,
          mx: 4,
          // display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}>
        <EditIcon
          sx={{
            position: "absolute", // Add 'position: absolute'
            top: "16px", // Add 'top' property
            right: "16px", // Add 'right' property
            width: "27px",
            height: "27px",
          }}
        />
        <Grid>
          <Typography component="h2" variant="h7">
            {props.title}
          </Typography>
          <InfoBoxSharedContext.Provider value={{ editing, setEditing }}>
            <SwitchingButton label1="Edit" label2="Done" />
            <InfoItem label="Name" />
            <InfoItem label="Location" />
            <InfoItem label="Phone #" />
          </InfoBoxSharedContext.Provider>
        </Grid>
      </Box>
    </Grid>

    // <div>
    //   <Typography component="h2" variant="h7">
    //     {props.title}
    //   </Typography>
    //   <InfoBoxSharedContext.Provider value={{ editing, setEditing }}>
    //     <SwitchingButton label1="Edit" label2="Done" />
    //     <InfoItem label="Name" />
    //     <InfoItem label="Location" />
    //     <InfoItem label="Phone #" />
    //   </InfoBoxSharedContext.Provider>
    // </div>
  );
}

export {InfoBoxSharedContext};