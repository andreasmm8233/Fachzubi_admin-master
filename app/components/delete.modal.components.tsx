"use client";

import {
  Button,
  Dialog,
  DialogActions,
  DialogTitle,
  Stack,
  Typography,
} from "@mui/material";
import { Box } from "@mui/system";
import React from "react";
import TaskAltIcon from "@mui/icons-material/TaskAlt";

const DeleteModal = (props: any) => {
  return (
    <>
      <Dialog
        open={props.open}
        onClose={props.handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        sx={{
          "& .MuiDialog-container": {
            "& .MuiPaper-root": {
              width: "100%",
              maxWidth: "450px", // Set your width here
              borderRadius: "10px",
            },
          },
        }}
      >
        <Box sx={{ p: 3, maxWidth: "450px", textAlign: "center" }}>
          <Stack
            direction={"column"}
            spacing={1}
            sx={{
              "& .MuiTypography-body1": { fontSize: "20px", fontWeight: "600" },
            }}
          >
            <Box>
              <TaskAltIcon sx={{ fontSize: "60px", color: "#0096A4" }} />
            </Box>
            <Typography variant="body1">Are you sure?</Typography>

            <Stack
              direction={"row"}
              spacing={2}
              sx={{ pt: 4, px: 4 }}
              justifyContent={"center"}
            >
              <Button
                fullWidth
                onClick={props.onConfirm}
                variant="contained"
                disabled={props.loading}
              >
                {props.loading ? "Deleting..." : "Ok"}
              </Button>
              <Button
                fullWidth
                onClick={props.handleClose}
                variant="outlined"
                disabled={props.loading}
              >
                cancel
              </Button>
            </Stack>
          </Stack>
        </Box>
      </Dialog>
    </>
  );
};

export default DeleteModal;
