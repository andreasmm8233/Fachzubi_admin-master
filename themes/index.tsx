"use client";
import { useCallback, useEffect, useMemo } from "react";
import { ThemeOptions, createTheme, ThemeProvider } from "@mui/material/styles";
import Typography from "./typography";
import ComponentsOverrides from "./overrides";
import { refreshAccessToken } from "@/app/api/auth/auth";
import { useDispatch, useSelector } from "react-redux";
import { getCurrentUser } from "@/app/api/user/user";
import { setCurrentUser } from "@/app/redux/user/userSlice";
import { setIsLoading, setIsLogin } from "@/app/redux/auth/authSlice";
import { RootState } from "@/app/redux/store";

interface ThemeCustomizationProps {
  children: React.ReactNode;
}

export default function ThemeCustomization({
  children,
}: ThemeCustomizationProps) {
  const dispatch = useDispatch();
  const fetchCurrentUser = async () => {
    try {
      const result = await getCurrentUser();
      if (result.remote === "success") {
        dispatch(setCurrentUser(result.data.data));
        dispatch(setIsLogin(true));
      } else {
        dispatch(setIsLogin(false));
        dispatch(setCurrentUser(null));
      }
    } catch (error) {
      console.error("Error in fetchCurrentUser:", error);
    }
    dispatch(setIsLoading(false));
  };
  useEffect(() => {
    // Function to refresh access token
    const refresh = async () => {
      try {
        const token = localStorage.getItem("x-refresh");
        if (!token) {
          localStorage.clear();
          console.error("Access token not found in local storage");
          return;
        }
        const result = await refreshAccessToken(token);
        if (result.remote === "success") {
          localStorage.setItem("x-access", result.data.data.accessToken);
        } else {
          dispatch(setIsLogin(false));
          localStorage.clear();
          console.error("Error refreshing access token:", result);
        }
      } catch (error) {
        console.error("Unexpected error refreshing access token:", error);
      }
    };

    // Call refresh function initially
    refresh();

    // Set up an interval to call the refresh function every 5 seconds
    const intervalId = setInterval(refresh, 10 * 60 * 1000);

    // Clean up the interval when the component is unmounted
    return () => clearInterval(intervalId);
  }, []);
  useEffect(() => {
    fetchCurrentUser();
  }, []);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const themeTypography = Typography(` 'Poppins', sans-serif`);
  const contrastText = "#fff";
  const themeOptions: ThemeOptions = useMemo(
    () => ({
      breakpoints: {
        values: {
          xs: 0,
          sm: 768,
          md: 1024,
          lg: 1266,
          xl: 1536,
        },
      },

      palette: {
        background: {
          default: "#ffffff",
        },
        // text: {
        //   primary: "#0096A4",
        // },
        primary: {
          main: "#F1841D",
          light: "#FDFBF4",
          gray: "#4B5563",
          darker: "#223C25",

          contrastText,
        },
        secondary: {
          main: "#A87B6F",
          light: "#E9CFC1",
          dark: "#B8BABE",
          contrastText,
        },
        info: {
          main: "#FDFBF4",
        },
      },

      typography: themeTypography,
    }),
    [themeTypography]
  );

  const themes = createTheme(themeOptions);
  themes.components = ComponentsOverrides();

  return <ThemeProvider theme={themes}>{children}</ThemeProvider>;
}
