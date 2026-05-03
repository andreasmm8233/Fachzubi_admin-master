"use client";

import {
  Box,
  Button,
  IconButton,
  InputAdornment,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import Image from "next/image";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import React, { useEffect, useState } from "react";
import { resetPassword } from "@/app/api/auth/auth";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import CustomLoader from "@/app/components/SpinLoader";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { setIsLogin } from "@/app/redux/auth/authSlice";
import { setCurrentRoute } from "@/app/redux/protectRoute/previousRouteSlice";

const ResetPassword = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const [showPassword, setShowPassword] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState(false);
  const [password, setPasswordValue] = useState("");
  const [confirmPasswordValue, setConfirmPasswordValue] = useState("");
  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const [loading, setIsLoading] = useState(false);
  const [token, setToken] = useState("");
  const handleClickConfirmShowPassword = () => {
    setConfirmPassword((show) => !show);
  };
  const [hideLogo, setHideLogo] = useState(false);

  useEffect(() => {
    const hideLogoDomain = process.env.NEXT_PUBLIC_HIDE_LOGO_DOMAIN;
    if (typeof window !== "undefined" && hideLogoDomain) {
      if (window.location.hostname === hideLogoDomain) {
        setHideLogo(true);
      }
    }
  }, []);
  const notifyError = (message: string) => {
    return toast.error(message);
  };

  const handlePasswordReset = async () => {
    if (confirmPasswordValue !== password) {
      notifyError("Password must match");
      return;
    }
    if (password.length < 8) {
      notifyError("Password must be 8 character");
      return;
    }
    setIsLoading(true);
    const data = await resetPassword(password, token);
    if (data.remote === "success") {
      localStorage.setItem("x-access", data.data.data.accessToken);
      localStorage.setItem("x-refresh", data.data.data.refreshToken);
      router.push("/dashboard");
      dispatch(setCurrentRoute("/dashboard"));
      dispatch(setIsLogin(true));
    } else {
      notifyError("Error updating password");
    }
    setIsLoading(false);
  };
  useEffect(() => {
    // Get the token parameter from the URL
    const urlSearchParams = new URLSearchParams(window.location.search);
    const token = urlSearchParams.get("token");

    // Check if token is present
    if (token) {
      setToken(token);
    } else {
      console.error("Token not found in the URL");
    }
  }, []); // Empty dependency array means this effect runs once when the component mounts

  return (
    <>
      {loading && <CustomLoader />}
      <Stack
        direction={"column"}
        spacing={0}
        justifyContent={"center"}
        alignItems={"center"}
        sx={{ minHeight: "100vh" }}
      >
        <Box>
          <Typography
            component={"h1"}
            sx={{ marginBottom: "25px", textAlign: "center" }}
          >
            {!hideLogo && (
              <Image src="/logo.png" alt="" width={253} height={37} />
            )}
          </Typography>

          <Typography
            variant="h3"
            sx={{ textAlign: "center", marginBottom: "25px" }}
          >
            Change Password
          </Typography>
          <Stack direction={"column"} spacing={3}>
            <TextField
              placeholder="password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => {
                setPasswordValue(e.target.value);
              }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword}
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              placeholder="confirm Password"
              type={confirmPassword ? "text" : "password"}
              value={confirmPasswordValue}
              onChange={(e) => {
                setConfirmPasswordValue(e.target.value);
              }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickConfirmShowPassword}
                    >
                      {confirmPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <Button
              variant="contained"
              onClick={handlePasswordReset}
              sx={{ fontSize: "32px", fontWeight: 700 }}
            >
              Sumbit
            </Button>
          </Stack>
        </Box>
      </Stack>
      <ToastContainer />
    </>
  );
};

export default ResetPassword;
