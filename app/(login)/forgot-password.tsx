"use client";
import * as Yup from "yup";
import { Button, Dialog, Stack, TextField, Typography } from "@mui/material";
import { Box } from "@mui/system";
import React, { useEffect, useState } from "react";
import { getResetLink } from "../api/auth/auth";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useFormik } from "formik";
const ForgotPassword = (props: any) => {
  const [loading, setLoading] = useState(false);
  const initialValues = {
    email: "",
  };
  const validationSchema = Yup.object().shape({
    email: Yup.string().email("Invalid email").required("Email is required"),
  });
  const formik = useFormik({
    initialValues,
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      setLoading(true);
      const { email } = values;
      const response = await getResetLink(email);
      if (response.remote === "success") {
        success("Reset link sent successfully.");
      } else {
        error("Failed to send reset link. Please try again.");
      }
      setLoading(false);
      props.handleClose();
    },
  });
  const success = (message: string) => {
    return toast.info(message);
  };
  const error = (message: string) => {
    return toast.error(message);
  };

  return (
    <>
      <Dialog
        open={props.open}
        onClose={props.handleClose}
        maxWidth={"sm"}
        fullWidth
        sx={{
          "& .MuiDialog-paper": {
            borderRadius: "10px",
            border: "2px solid #0096A4",
          },
        }}
      >
        <Box
          sx={{
            padding: "35px 80px",
            "@media (max-width:768px)": { padding: "24px" },
          }}
        >
          <Typography
            sx={{ fontSize: "32px", fontWeight: 500, textAlign: "center" }}
          >
            Forgot Password
          </Typography>
          <Typography
            sx={{
              color: "rgba(0, 0, 0, 0.50)",
              fontSize: "20px",
              textAlign: "center",
              mb: 6,
              fontWeight: "500",
            }}
          >
            We are here to help you, Enter the email id to get reset link
          </Typography>
          <Stack direction={"column"} spacing={6}>
            <TextField
              fullWidth
              id="outlined-basic"
              placeholder="Registred Email id"
              autoComplete="off"
              {...formik.getFieldProps("email")}
            />
            {formik.touched.email && formik.errors.email && (
              <div style={{ color: "red" }}>{formik.errors.email}</div>
            )}
            <Box sx={{ px: { xs: 0, lg: 10 } }}>
              <Button
                fullWidth
                variant="contained"
                onClick={() => {
                  formik.handleSubmit();
                }}
                sx={{ fontSize: "32px", fontWeight: 700 }}
                disabled={loading}
              >
                {loading ? "Processing..." : "Confirm"}
              </Button>
            </Box>
          </Stack>
        </Box>
      </Dialog>
      <ToastContainer />
    </>
  );
};

export default ForgotPassword;
