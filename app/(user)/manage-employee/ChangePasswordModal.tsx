"use client";

import {
  Button,
  Dialog,
  FormLabel,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { Box } from "@mui/system";
import { useFormik } from "formik";
import * as yup from "yup";
import { useEffect } from "react";

const validationSchema = yup.object().shape({
  password: yup
    .string()
    .min(8, "Password must be at least 8 characters")
    .required("Password is required"),
  confirm_password: yup
    .string()
    .oneOf([yup.ref("password")], "Passwords must match")
    .required("Confirm password is required"),
});

interface ChangePasswordModalProps {
  open: boolean;
  employeeName?: string;
  loading: boolean;
  handleClose: () => void;
  onConfirm: (password: string, confirmPassword: string) => void;
}

const ChangePasswordModal = (props: ChangePasswordModalProps) => {
  const formik = useFormik({
    initialValues: { password: "", confirm_password: "" },
    validationSchema,
    onSubmit: (values) => {
      props.onConfirm(values.password, values.confirm_password);
    },
  });

  useEffect(() => {
    if (!props.open) formik.resetForm();
  }, [props.open]);

  return (
    <Dialog
      open={props.open}
      onClose={props.loading ? undefined : props.handleClose}
      sx={{
        "& .MuiDialog-container": {
          "& .MuiPaper-root": {
            width: "100%",
            maxWidth: "450px",
            borderRadius: "10px",
          },
        },
      }}
    >
      <Box component="form" onSubmit={formik.handleSubmit} sx={{ p: 3 }}>
        <Stack direction={"column"} spacing={2}>
          <Typography sx={{ fontSize: "20px", fontWeight: "600" }}>
            Change Password
          </Typography>
          {props.employeeName && (
            <Typography sx={{ color: "#646464" }}>
              {props.employeeName}
            </Typography>
          )}
          <Box>
            <FormLabel>New Password</FormLabel>
            <TextField
              {...formik.getFieldProps("password")}
              type="password"
              fullWidth
              placeholder="Password (min 8 characters)"
              autoComplete="new-password"
            />
            {formik.touched.password && formik.errors.password && (
              <div style={{ color: "red", marginTop: 4 }}>
                {formik.errors.password}
              </div>
            )}
          </Box>
          <Box>
            <FormLabel>Confirm Password</FormLabel>
            <TextField
              {...formik.getFieldProps("confirm_password")}
              type="password"
              fullWidth
              placeholder="Confirm Password"
              autoComplete="new-password"
            />
            {formik.touched.confirm_password &&
              formik.errors.confirm_password && (
                <div style={{ color: "red", marginTop: 4 }}>
                  {formik.errors.confirm_password}
                </div>
              )}
          </Box>
          <Stack direction={"row"} spacing={2} sx={{ pt: 2 }}>
            <Button
              fullWidth
              type="submit"
              variant="contained"
              disabled={props.loading}
            >
              {props.loading ? "Updating..." : "Update"}
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
  );
};

export default ChangePasswordModal;
