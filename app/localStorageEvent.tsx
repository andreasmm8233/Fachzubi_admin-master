"use client";
import React, { useEffect } from "react";
import { setIsLogin, setRole, setPermissions } from "./redux/auth/authSlice";
import { useDispatch } from "react-redux";
import { setCurrentRoute } from "./redux/protectRoute/previousRouteSlice";

function LocalStorageEvent() {
  const dispatch = useDispatch();

  const checkLoginStatus = () => {
    const token = localStorage.getItem("x-access");
    dispatch(setIsLogin(!!token));

    const role = localStorage.getItem("x-role") as
      | "admin"
      | "employee"
      | null;
    dispatch(setRole(role));

    const permissionsStr = localStorage.getItem("x-permissions");
    if (permissionsStr) {
      try {
        dispatch(setPermissions(JSON.parse(permissionsStr)));
      } catch {
        dispatch(setPermissions(null));
      }
    } else {
      dispatch(setPermissions(null));
    }
  };

  useEffect(() => {
    dispatch(
      setCurrentRoute(window.location.pathname + window.location.search)
    );
    // Sync role/permissions on mount
    checkLoginStatus();

    window.addEventListener("storage", checkLoginStatus);
    return () => {
      window.removeEventListener("storage", checkLoginStatus);
    };
  }, []);

  return <></>;
}

export default LocalStorageEvent;
