"use client";
import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { useRouter } from "next/navigation";

function AuthChecker() {
  const isLogin = useSelector((state: RootState) => state.auth.isLogin);
  const previousRoute: string = useSelector(
    (state: RootState) => state.currentRoute.route
  );
  const router = useRouter();
  useEffect(() => {
    if (!isLogin) {
      router.push("/");
    } else {
      if (previousRoute) {
        router.push(
          previousRoute === "/" || previousRoute === "/reset-password"
            ? "/dashboard"
            : previousRoute
        );
      }
    }
  }, [isLogin, previousRoute, router]);

  return <div></div>;
}

export default AuthChecker;
