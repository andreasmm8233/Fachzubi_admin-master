"use client";
import React, { useEffect } from "react";
import { setIsLogin } from "./redux/auth/authSlice";
import { useDispatch } from "react-redux";
import { setCurrentRoute } from "./redux/protectRoute/previousRouteSlice";

function LocalStorageEvent() {
  const dispatch = useDispatch();

  const checkLoginStatus = () => {
    const token = localStorage.getItem("x-access");
    dispatch(setIsLogin(!!token));
  };
  useEffect(() => {
    dispatch(
      setCurrentRoute(window.location.pathname + window.location.search)
    );
    window.addEventListener("storage", checkLoginStatus);
    return () => {
      window.removeEventListener("storage", checkLoginStatus);
    };
  }, []);
  return <></>;
}

export default LocalStorageEvent;
