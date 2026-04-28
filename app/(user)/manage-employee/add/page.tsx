"use client";

import {
  Box,
  Button,
  Grid,
  Stack,
  TextField,
  FormLabel,
  FormControlLabel,
  Switch,
  Paper,
  Typography,
} from "@mui/material";
import { useFormik } from "formik";
import * as yup from "yup";
import { createEmployee } from "@/app/api/manageEmployee/employee";
import { DEFAULT_PERMISSIONS } from "@/app/api/manageEmployee/helper";
import { StyledManageForm } from "@/app/components/form.styled";
import Title from "@/app/components/title.components";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { SVG } from "@/app/components/icon";
import Link from "next/link";

const PERMISSION_LABELS: Record<string, string> = {
  manage_jobs: "Manage Jobs",
  manage_cities: "Manage Cities",
  manage_employers: "Manage Employers",
  manage_industries: "Manage Industries",
  job_types: "Job Types",
  manage_content: "Manage Content",
};

const validationSchema = yup.object().shape({
  first_name: yup.string().required("First name is required"),
  last_name: yup.string().required("Last name is required"),
  email: yup
    .string()
    .email("Enter a valid email")
    .required("Email is required"),
  password: yup
    .string()
    .min(8, "Password must be at least 8 characters")
    .required("Password is required"),
  confirm_password: yup
    .string()
    .oneOf([yup.ref("password")], "Passwords must match")
    .required("Confirm password is required"),
});

const AddEmployeePage = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const formik = useFormik({
    initialValues: {
      first_name: "",
      last_name: "",
      email: "",
      password: "",
      confirm_password: "",
      permissions: { ...DEFAULT_PERMISSIONS },
    },
    validationSchema,
    onSubmit: async (values) => {
      setLoading(true);
      const payload = {
        first_name: values.first_name,
        last_name: values.last_name,
        email: values.email,
        password: values.password,
        confirm_password: values.confirm_password,
        permissions: values.permissions,
      };

      const response = await createEmployee(payload);
      if (response.remote === "success") {
        toast.success("Employee created successfully!");
        setTimeout(() => {
          router.push("/manage-employee");
        }, 1000);
      } else {
        const errorMsg =
          response.remote === "failure"
            ? response.error?.errors?.message || "Error creating employee"
            : "Error creating employee";
        toast.error(errorMsg);
      }
      setLoading(false);
    },
  });

  return (
    <>
      <Stack
        direction={"row"}
        alignItems={"center"}
        spacing={1}
        sx={{ mb: 2 }}
      >
        <Link href="/manage-employee">
          <SVG.ArrowBack
            style={{ cursor: "pointer", width: 24, height: 24 }}
          />
        </Link>
        <Title heading="Add Employee" />
      </Stack>
      <StyledManageForm>
        <Paper sx={{ p: 4, borderRadius: "10px" }}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <FormLabel>First Name</FormLabel>
              <TextField
                {...formik.getFieldProps("first_name")}
                fullWidth
                placeholder="First Name"
                autoComplete="off"
              />
              {formik.touched.first_name && formik.errors.first_name && (
                <div style={{ color: "red", marginTop: 4 }}>
                  {formik.errors.first_name}
                </div>
              )}
            </Grid>
            <Grid item xs={12} md={6}>
              <FormLabel>Last Name</FormLabel>
              <TextField
                {...formik.getFieldProps("last_name")}
                fullWidth
                placeholder="Last Name"
                autoComplete="off"
              />
              {formik.touched.last_name && formik.errors.last_name && (
                <div style={{ color: "red", marginTop: 4 }}>
                  {formik.errors.last_name}
                </div>
              )}
            </Grid>
            <Grid item xs={12}>
              <FormLabel>Email</FormLabel>
              <TextField
                {...formik.getFieldProps("email")}
                fullWidth
                placeholder="Email"
                autoComplete="off"
              />
              {formik.touched.email && formik.errors.email && (
                <div style={{ color: "red", marginTop: 4 }}>
                  {formik.errors.email}
                </div>
              )}
            </Grid>
            <Grid item xs={12} md={6}>
              <FormLabel>Password</FormLabel>
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
            </Grid>
            <Grid item xs={12} md={6}>
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
            </Grid>

            <Grid item xs={12}>
              <Typography
                variant="h6"
                sx={{ fontWeight: 600, mt: 1, mb: 1, fontSize: "18px" }}
              >
                Permissions
              </Typography>
              <Grid container spacing={2}>
                {Object.entries(PERMISSION_LABELS).map(([key, label]) => (
                  <Grid item xs={12} sm={6} md={4} key={key}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={
                            formik.values.permissions[
                              key as keyof typeof DEFAULT_PERMISSIONS
                            ]
                          }
                          onChange={(e) =>
                            formik.setFieldValue(
                              `permissions.${key}`,
                              e.target.checked
                            )
                          }
                          sx={{
                            "& .MuiSwitch-switchBase.Mui-checked": {
                              color: "#0096A4",
                            },
                            "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track":
                              {
                                backgroundColor: "#0096A4",
                              },
                          }}
                        />
                      }
                      label={label}
                    />
                  </Grid>
                ))}
              </Grid>
            </Grid>
          </Grid>

          <Stack
            direction={"row"}
            spacing={2}
            sx={{ pt: 4 }}
            justifyContent={"center"}
          >
            <Button
              onClick={() => formik.handleSubmit()}
              variant="contained"
              disabled={loading}
              sx={{
                px: 6,
                backgroundColor: "#0096A4",
                "&:hover": { backgroundColor: "#007a85" },
              }}
            >
              {loading ? "Saving..." : "Save"}
            </Button>
            <Button
              onClick={() => router.push("/manage-employee")}
              variant="outlined"
              disabled={loading}
              sx={{
                px: 6,
                borderColor: "#0096A4",
                color: "#0096A4",
                "&:hover": {
                  borderColor: "#007a85",
                  color: "#007a85",
                },
              }}
            >
              Cancel
            </Button>
          </Stack>
        </Paper>
      </StyledManageForm>
      <ToastContainer />
    </>
  );
};

export default AddEmployeePage;
