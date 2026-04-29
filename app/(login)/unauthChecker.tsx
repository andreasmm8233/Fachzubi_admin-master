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
          let targetRoute = previousRoute;
          if (previousRoute === "/" || previousRoute === "/reset-password") {
            const role = localStorage.getItem("x-role") || "admin";
            targetRoute = "/dashboard";
            if (role === "employee") {
              try {
                const perms = JSON.parse(localStorage.getItem("x-permissions") || "{}");
                if (perms.manage_employers) targetRoute = "/manage-employers";
                else if (perms.manage_jobs) targetRoute = "/manage-jobs";
                else if (perms.manage_industries) targetRoute = "/manage-industries";
                else if (perms.job_types) targetRoute = "/manage-type-of-job";
                else if (perms.manage_cities) targetRoute = "/manage-cities";
                else if (perms.manage_content) targetRoute = "/manage-content/terms-and-conditions";
              } catch (e) {}
            }
          }
          router.push(targetRoute);
        }
      }
    }
  }, [dispatch, previousRoute, router]);
 
  return <div></div>;
}

export default AuthChecker;
