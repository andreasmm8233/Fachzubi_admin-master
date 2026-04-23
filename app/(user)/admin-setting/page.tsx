"use client";

import React, { useEffect, useState } from "react";
import * as Yup from "yup";
import { useFormik } from "formik";
import {
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
} from "@mui/material";
import { SVG } from "@/app/components/icon";
import Title from "@/app/components/title.components";
import { Stack } from "@mui/system";
import { StyledManageForm } from "@/app/components/form.styled";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import Visibility from "@mui/icons-material/Visibility";
import {
  getManageKey,
  getSmtpSetting,
  updateManageKey,
  updateSmtpSetting,
} from "@/app/api/adminSetting/admin";
import { Smtp } from "@/app/api/adminSetting/admin.types";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useSelector } from "react-redux";
import { RootState } from "@/app/redux/store";
import { UpdateProfileRequestDto } from "@/app/api/user/user.type";
import { updateProfile } from "@/app/api/user/user";
import CustomLoader from "@/app/components/SpinLoader";
const AdminSetting = () => {
  const [loading, setIsLoading] = useState(true);
  const [loadingUserUpdate, setLoadingUserUpdate] = useState(false);
  const [loadingKeyUpdate, setLoadingKeyUpdate] = useState(false);
  const [loadingSmtpUpdate, setLoadingSmtpUpdate] = useState(false);
  const [showPassword, setShowPassword] = React.useState(false);
  const [newShowPassword, setNewShowPassword] = React.useState(false);
  const [confirmShowPassword, setConfirmShowPassword] = React.useState(false);
  const [smtpShowPassword, setSmtpShowPassword] = React.useState(false);
  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const currentUser = useSelector((state: RootState) => state.user.data);
  const initialValues = {
    adminName: currentUser?.username || "",
    email: currentUser?.email || "",
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  };
  const validationSchemaKeyInitialValues = {
    hostKey: "",
    portKey: "",
    pushNotificationKey: "",
  };
  const validationSchemaKey = Yup.object().shape({
    hostKey: Yup.string().required("Manage Host Key is required"),
    portKey: Yup.string().required("Manage Port Key is required"),
    pushNotificationKey: Yup.string().required(
      "Manage Push Notification Key is required"
    ),
  });

  const validationSchemaPassword = Yup.object().shape({
    adminName: Yup.string().required("Admin Name is required"),
    email: Yup.string().email("Invalid email").required("Email is required"),
    oldPassword: Yup.string().required("Old Password is required"),
    newPassword: Yup.string().required("New Password is required"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("newPassword")], "Passwords must match")
      .required("Confirm Password is required"),
  });
  const validationSchemaSMTP = Yup.object().shape({
    service: Yup.string().required("service is required"),
    smtpHost: Yup.string().required("SMTP Host is required"),
    smtpPort: Yup.number().required("SMTP Port is required"),
    smtpUsername: Yup.string()
      .email("Invalid email")
      .required("SMTP Username is required"),
    smtpPassword: Yup.string().required("SMTP Password is required"),
    smtpEncryption: Yup.string().required("SMTP Encryption is required"),
    formAddress: Yup.string()
      .email("Invalid email")
      .required("Form Address is required"),
  });

  const formik = useFormik({
    initialValues,
    validationSchema: validationSchemaPassword,
    onSubmit: async (values) => {
      setLoadingUserUpdate(true);
      const { email, oldPassword, newPassword, adminName } = values;
      const updateProfileData: UpdateProfileRequestDto = {
        username: adminName,
        email,
        password: newPassword,
        oldPassword,
      };
      const data = await updateProfile(updateProfileData);
      if (data.remote === "success") {
        const notify = () => toast.info("Profile updated successfully!");
        notify();
      } else {
        const notify = () => toast.error("Invalid old password !");
        notify();
      }
      setLoadingUserUpdate(false);
    },
  });
  const formicForKey = useFormik({
    initialValues: validationSchemaKeyInitialValues,
    validationSchema: validationSchemaKey,
    onSubmit: async (values) => {
      setLoadingKeyUpdate(true);
      const { hostKey, portKey, pushNotificationKey } = values;

      const manageKeyData = {
        hostKey: hostKey,
        portKey: portKey,
        pushNotificationKey: pushNotificationKey,
      };
      const data = await updateManageKey(manageKeyData);
      if (data.remote === "success") {
        const notify = () => toast.info("Manage key updated successfully!");
        notify();
      } else {
        const notify = () => toast.error("Error updating manage key");
        notify();
      }
      setLoadingKeyUpdate(false);
    },
  });
  const formicSMTP = useFormik({
    initialValues: {
      smtpHost: "",
      smtpPort: "",
      smtpUsername: "",
      smtpPassword: "",
      smtpEncryption: "",
      formAddress: "",
      service: "",
    },
    validationSchema: validationSchemaSMTP,
    onSubmit: async (values) => {
      setLoadingSmtpUpdate(true);
      const {
        smtpHost,
        smtpPort,
        smtpUsername,
        smtpPassword,
        smtpEncryption,
        formAddress,
        service,
      } = values;

      const smtpData: Smtp = {
        host: smtpHost,
        userName: smtpUsername,
        encryption: smtpEncryption,
        port: smtpPort, // Convert the port to a number if needed
        password: smtpPassword,
        address: formAddress,
        service: service,
      };
      const data = await updateSmtpSetting(smtpData);
      if (data.remote === "success") {
        const notify = () => toast.info("SMTP settings updated successfully!");
        notify();
      } else {
        const notify = () => toast.error("Error updating SMTP settings");
        notify();
      }
      setLoadingSmtpUpdate(false);
    },
  });
  const fetchSmtpSettings = async () => {
    setIsLoading(true);
    try {
      const smtpSettingsResponse = await getSmtpSetting();
      if (smtpSettingsResponse.remote === "success") {
        const { host, port, userName, password, encryption, address, service } =
          smtpSettingsResponse.data.data;
        formicSMTP.setValues({
          smtpHost: host || "",
          smtpPort: port || "",
          smtpUsername: userName || "",
          smtpPassword: password || "",
          smtpEncryption: encryption || "",
          formAddress: address || "",
          service: service || "",
        });
      } else {
        console.error("Error fetching SMTP settings:", smtpSettingsResponse);
      }
    } catch (error) {
      console.error("Error fetching SMTP settings:", error);
    }
  };
  const fetchManageKey = async () => {
    try {
      const manageKeyResponse = await getManageKey();
      if (manageKeyResponse.remote === "success") {
        const { hostKey, portKey, pushNotificationKey } =
          manageKeyResponse.data.data;
        formicForKey.setValues({
          hostKey: hostKey || "",
          portKey: portKey || "",
          pushNotificationKey: pushNotificationKey || "",
        });
      } else {
        console.error("Error fetching manage key:", manageKeyResponse);
      }
    } catch (error) {
      console.error("Error fetching manage key:", error);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchSmtpSettings();
  }, []);

  useEffect(() => {
    fetchManageKey();
  }, []);
  useEffect(() => {
    if (currentUser) {
      formik.setValues({
        adminName: currentUser?.username || "",
        email: currentUser?.email || "",
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    }
  }, [currentUser, currentUser?.username, currentUser?.email]);
  return (
    <>
      {" "}
      {loading && <CustomLoader />}
      <Title heading="Admin Settings" />
      <StyledManageForm>
        <Stack direction={"column"} spacing={3}>
          <Box>
            <Card elevation={0} sx={{ borderRadius: "10px" }}>
              <Typography
                variant="h4"
                sx={{
                  color: "#000",
                  fontFamily: "Poppins",
                  fontSize: "30px",
                  fontStyle: "normal",
                  fontWeight: 400,
                  lineHeight: "normal",
                  letterSpacing: "1px",
                  margin: "15px",
                }}
              >
                Manage Password
              </Typography>
              <CardContent>
                <Grid container spacing={2} alignItems={"center"}>
                  <Grid item xs={12} lg={2}>
                    <label>Admin Name</label>
                  </Grid>
                  <Grid item xs={12} lg={10}>
                    <TextField
                      placeholder="Admin Name Eg. John"
                      type="text"
                      fullWidth
                      {...formik.getFieldProps("adminName")}
                    />
                    {formik.touched.adminName && formik.errors.adminName && (
                      <div style={{ color: "red" }}>
                        {formik.errors.adminName}
                      </div>
                    )}
                  </Grid>

                  <Grid item xs={12} lg={2}>
                    <label>Email Id</label>
                  </Grid>
                  <Grid item xs={12} lg={10}>
                    <TextField
                      placeholder="example@gmail.com"
                      type="email"
                      fullWidth
                      {...formik.getFieldProps("email")}
                    />
                    {formik.touched.email && formik.errors.email && (
                      <div style={{ color: "red" }}>{formik.errors.email}</div>
                    )}
                  </Grid>

                  <Grid item xs={12} lg={2}>
                    <label>Old Password</label>
                  </Grid>
                  <Grid item xs={12} lg={10}>
                    <TextField
                      fullWidth
                      placeholder="........"
                      type={showPassword ? "text" : "password"}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              aria-label="toggle password visibility"
                              onClick={handleClickShowPassword}
                            >
                              {showPassword ? (
                                <VisibilityOff />
                              ) : (
                                <Visibility />
                              )}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                      {...formik.getFieldProps("oldPassword")}
                    />
                    {formik.touched.oldPassword &&
                      formik.errors.oldPassword && (
                        <div style={{ color: "red" }}>
                          {formik.errors.oldPassword}
                        </div>
                      )}
                  </Grid>

                  <Grid item xs={12} lg={2}>
                    <label>New Password</label>
                  </Grid>
                  <Grid item xs={12} lg={10}>
                    <TextField
                      placeholder="........"
                      fullWidth
                      type={newShowPassword ? "text" : "password"}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              aria-label="toggle password visibility"
                              onClick={() => {
                                setNewShowPassword(!newShowPassword);
                              }}
                            >
                              {showPassword ? (
                                <VisibilityOff />
                              ) : (
                                <Visibility />
                              )}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                      {...formik.getFieldProps("newPassword")}
                    />
                    {formik.touched.newPassword &&
                      formik.errors.newPassword && (
                        <div style={{ color: "red" }}>
                          {formik.errors.newPassword}
                        </div>
                      )}
                  </Grid>

                  <Grid item xs={12} lg={2}>
                    <label>Confirm Password</label>
                  </Grid>
                  <Grid item xs={12} lg={10}>
                    <TextField
                      fullWidth
                      placeholder="........"
                      type={confirmShowPassword ? "text" : "password"}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              aria-label="toggle password visibility"
                              onClick={() => {
                                setConfirmShowPassword(!confirmShowPassword);
                              }}
                            >
                              {showPassword ? (
                                <VisibilityOff />
                              ) : (
                                <Visibility />
                              )}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                      {...formik.getFieldProps("confirmPassword")}
                    />
                    {formik.touched.confirmPassword &&
                      formik.errors.confirmPassword && (
                        <div style={{ color: "red" }}>
                          {formik.errors.confirmPassword}
                        </div>
                      )}
                  </Grid>

                  <Grid item xs={12}>
                    <Box sx={{ textAlign: "right" }}>
                      <Button
                        variant="outlined"
                        disabled={loadingUserUpdate}
                        onClick={() => {
                          formik.handleSubmit();
                        }}
                      >
                        <SVG.Save style={{ marginRight: "10px" }} />{" "}
                        {loadingUserUpdate ? "Saving" : "Save"}
                      </Button>
                    </Box>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Box>
          <Box>
            <Card elevation={0} sx={{ borderRadius: "10px" }}>
              <Typography
                variant="h4"
                sx={{
                  color: "#000",
                  fontFamily: "Poppins",
                  fontSize: "30px",
                  fontStyle: "normal",
                  fontWeight: 400,
                  lineHeight: "normal",
                  letterSpacing: "1px",
                  margin: "15px",
                }}
              >
                {" "}
                Manage Key{" "}
              </Typography>
              <CardContent>
                <Grid container spacing={2} alignItems={"center"}>
                  <Grid item xs={12} lg={2}>
                    <label>Manage Host Key</label>
                  </Grid>
                  <Grid item xs={12} lg={10}>
                    <TextField
                      placeholder="Fachzubi.de"
                      type="text"
                      fullWidth
                      {...formicForKey.getFieldProps("hostKey")}
                      error={
                        formicForKey.touched.hostKey &&
                        Boolean(formicForKey.errors.hostKey)
                      }
                      helperText={
                        formicForKey.touched.hostKey &&
                        formicForKey.errors.hostKey
                      }
                    />
                  </Grid>
                  <Grid item xs={12} lg={2}>
                    <label>Manage Port Key</label>
                  </Grid>
                  <Grid item xs={12} lg={10}>
                    <TextField
                      placeholder="Fachzubi.de"
                      type="text"
                      fullWidth
                      {...formicForKey.getFieldProps("portKey")}
                      error={
                        formicForKey.touched.portKey &&
                        Boolean(formicForKey.errors.portKey)
                      }
                      helperText={
                        formicForKey.touched.portKey &&
                        formicForKey.errors.portKey
                      }
                      sx={{
                        "& .MuiFormHelperText-root": {
                          marginLeft: "5px",
                          color: "#FFA500",
                          fontWeight: "500",
                        },
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} lg={2}>
                    <label>Manage Push Notification Key</label>
                  </Grid>
                  <Grid item xs={12} lg={10}>
                    <TextField
                      placeholder="Fachzubi.de"
                      type="text"
                      fullWidth
                      {...formicForKey.getFieldProps("pushNotificationKey")}
                      error={
                        formicForKey.touched.pushNotificationKey &&
                        Boolean(formicForKey.errors.pushNotificationKey)
                      }
                      helperText={
                        formicForKey.touched.pushNotificationKey &&
                        formicForKey.errors.pushNotificationKey
                      }
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Box sx={{ textAlign: "right" }}>
                      <Button
                        onClick={() => {
                          formicForKey.handleSubmit();
                        }}
                        disabled={loadingKeyUpdate}
                        variant="outlined"
                      >
                        <SVG.Save style={{ marginRight: "10px" }} />{" "}
                        {loadingKeyUpdate ? "Saving" : "Save"}
                      </Button>
                    </Box>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Box>
          <Box>
            <Card elevation={0} sx={{ borderRadius: "10px" }}>
              <Typography
                variant="h4"
                sx={{
                  color: "#000",
                  fontFamily: "Poppins",
                  fontSize: "30px",
                  fontStyle: "normal",
                  fontWeight: 400,
                  lineHeight: "normal",
                  letterSpacing: "1px",
                  margin: "15px",
                }}
              >
                SMTP Settings
              </Typography>
              <CardContent>
                <form onSubmit={formicSMTP.handleSubmit}>
                  <Grid container spacing={2} alignItems={"center"}>
                    {/* start */}
                    <Grid item xs={12} lg={6}>
                      <label>Service</label>
                      <TextField
                        placeholder="Service"
                        type="text"
                        fullWidth
                        {...formicSMTP.getFieldProps("service")}
                      />
                      {formicSMTP.touched.service &&
                        formicSMTP.errors.smtpHost && (
                          <div style={{ color: "red" }}>
                            {formicSMTP.errors.service}
                          </div>
                        )}
                    </Grid>
                    {/* End */}

                    <Grid item xs={12} lg={6}>
                      <label>SMTP Host</label>
                      <TextField
                        placeholder="fachzubi.de"
                        type="text"
                        fullWidth
                        {...formicSMTP.getFieldProps("smtpHost")}
                      />
                      {formicSMTP.touched.smtpHost &&
                        formicSMTP.errors.smtpHost && (
                          <div style={{ color: "red" }}>
                            {formicSMTP.errors.smtpHost}
                          </div>
                        )}
                    </Grid>

                    <Grid item xs={12} lg={6}>
                      <label>SMTP Port</label>
                      <TextField
                        placeholder="222"
                        type="number"
                        fullWidth
                        {...formicSMTP.getFieldProps("smtpPort")}
                      />
                      {formicSMTP.touched.smtpPort &&
                        formicSMTP.errors.smtpPort && (
                          <div style={{ color: "red" }}>
                            {formicSMTP.errors.smtpPort}
                          </div>
                        )}
                    </Grid>

                    <Grid item xs={12} lg={6}>
                      <label>SMTP Username</label>
                      <TextField
                        placeholder="contact@Fachzubi.de"
                        type="email"
                        fullWidth
                        {...formicSMTP.getFieldProps("smtpUsername")}
                        onBlur={() =>
                          formicSMTP.setFieldTouched("smtpUsername", true)
                        }
                      />
                      {formicSMTP.touched.smtpUsername &&
                        formicSMTP.errors.smtpUsername && (
                          <div style={{ color: "red" }}>
                            {formicSMTP.errors.smtpUsername}
                          </div>
                        )}
                    </Grid>

                    <Grid item xs={12} lg={6}>
                      <label>SMTP Password</label>
                      <TextField
                        placeholder="........"
                        fullWidth
                        type={smtpShowPassword ? "text" : "password"}
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position="end">
                              <IconButton
                                aria-label="toggle password visibility"
                                onClick={() => {
                                  setSmtpShowPassword(!smtpShowPassword);
                                }}
                              >
                                {showPassword ? (
                                  <VisibilityOff />
                                ) : (
                                  <Visibility />
                                )}
                              </IconButton>
                            </InputAdornment>
                          ),
                        }}
                        {...formicSMTP.getFieldProps("smtpPassword")}
                        onBlur={() =>
                          formicSMTP.setFieldTouched("smtpPassword", true)
                        }
                      />
                      {formicSMTP.touched.smtpPassword &&
                        formicSMTP.errors.smtpPassword && (
                          <div style={{ color: "red" }}>
                            {formicSMTP.errors.smtpPassword}
                          </div>
                        )}
                    </Grid>

                    <Grid item xs={12} lg={6}>
                      <label>SMTP Encryption</label>
                      <TextField
                        placeholder="XYZ"
                        type="text"
                        fullWidth
                        {...formicSMTP.getFieldProps("smtpEncryption")}
                      />
                      {formicSMTP.touched.smtpEncryption &&
                        formicSMTP.errors.smtpEncryption && (
                          <div style={{ color: "red" }}>
                            {formicSMTP.errors.smtpEncryption}
                          </div>
                        )}
                    </Grid>

                    <Grid item xs={12} lg={6}>
                      <label>Form Address</label>
                      <TextField
                        placeholder="contact@Fachzubi.de"
                        type="email"
                        fullWidth
                        {...formicSMTP.getFieldProps("formAddress")}
                      />
                      {formicSMTP.touched.formAddress &&
                        formicSMTP.errors.formAddress && (
                          <div style={{ color: "red" }}>
                            {formicSMTP.errors.formAddress}
                          </div>
                        )}
                    </Grid>

                    <Grid item xs={12}>
                      <Box sx={{ textAlign: "right" }}>
                        <Button
                          variant="outlined"
                          type="submit"
                          disabled={loadingSmtpUpdate}
                        >
                          <SVG.Save style={{ marginRight: "10px" }} />{" "}
                          {loadingSmtpUpdate ? "Saving" : "Save"}
                        </Button>
                      </Box>
                    </Grid>
                  </Grid>
                </form>
              </CardContent>
            </Card>
          </Box>
        </Stack>
      </StyledManageForm>
      <ToastContainer />
    </>
  );
};
export default AdminSetting;
