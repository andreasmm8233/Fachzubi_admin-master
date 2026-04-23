"use client";

import { Dialog } from "@mui/material";
interface Props {
  open: boolean;
  handleClose: () => void;
  children: React.ReactNode;
  maxWidth?: string;
}

const IModal = (props: Props) => {
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
              maxWidth: props.maxWidth, // Set your width here
              borderRadius: "10px",
            },
          },
        }}
      >
        {props.children}
      </Dialog>
    </>
  );
};
export default IModal;
