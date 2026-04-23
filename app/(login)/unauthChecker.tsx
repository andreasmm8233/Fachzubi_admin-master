"use client";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { setIsLogin } from "../redux/auth/authSlice";
function AuthChecker() {
  const router = useRouter();
  const dispatch = useDispatch();
  const previousRoute: string = useSelector(
    (state: RootState) => state.currentRoute.route
  );
  useEffect(() => {
    if (window) {
      const token = localStorage.getItem("x-access");
      if (token) {
        dispatch(setIsLogin(true));
        if (previousRoute) {
          router.push(
            previousRoute === "/" || previousRoute === "/reset-password"
              ? "/dashboard"
              : previousRoute
          );
        }
      }
    }
  }, [dispatch, previousRoute, router]);
 
  return <div></div>;
}

export default AuthChecker;
