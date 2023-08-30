import "../App.css";

import React, { useState, useContext } from "react";

import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Checkbox from "@mui/material/Checkbox";
import CssBaseline from "@mui/material/CssBaseline";
import FormControlLabel from "@mui/material/FormControlLabel";
import Grid from "@mui/material/Grid";
import Link from "@mui/material/Link";
import Paper from "@mui/material/Paper";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import EditIcon from "@mui/icons-material/Edit";
import InfoBox from "./InfoBox/InfoForm";

import Transcription from "./Transcription";

const HomeScreen = () => {
  return (
    <div
      sx={{
        maxHeight: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <CssBaseline />
      <Grid
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          mb: "5%",
        }}
      >
        {/* <Typography component="h1" variant="h7">
          NEXUS
        </Typography> */}
      </Grid>
      
      {/* Parent container */}
      <Grid
        container
        spacing={2}
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          // flexDirection: 'column',
        }}
      >
        {/* first column */}
        <Grid
          item
          xs={12}
          sm={6}
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
            width: "50%",
          }}
        >
          {/* Caller Info Box */}
          <InfoBox title="Caller Info" />
              
          {/* Emergency Info Box */}
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
              position: "relative",
              width: "80%",
              borderRadius: 2.0,
              cursor: "pointer",
              transition: "all 0.3s",
              ":hover": {
                backgroundColor: "primary.dark",
                transform: "scale(1.05)",
                transition: "all 0.3s",
              },
            }}
          >
            <Box
              sx={{
                my: 8,
                mx: 4,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
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
                  Emergency Details
                </Typography>

                <Typography component="h3" variant="h7">
                  Ambulance #s:
                </Typography>
                <Typography component="h3" variant="h7">
                  Police #s:
                </Typography>
                <Typography component="h3" variant="h7">
                  Emergency Contact:
                </Typography>

                <Typography component="h3" variant="h7">
                  Emergency Type:
                </Typography>

                {/* <TextField
                    id="outlined-basic"
                    label="Outlined"
                    variant="outlined"
                  /> */}
              </Grid>
            </Box>
          </Grid>
        </Grid>
        {/* second column */}
        <Grid
          item
          xs={12}
          sm={6}
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
            width: "75%",
            backgroundColor: "white",
            borderRadius: 2.0,
            padding: "1%"
          }}
        >
          <Transcription />
        </Grid>
      </Grid>
    </div>
  );
};
export default HomeScreen;
