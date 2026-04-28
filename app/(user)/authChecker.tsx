"use client";
import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { useRouter, usePathname } from "next/navigation";
import { EmployeePermissions } from "../api/manageEmployee/helper";

// Maps route prefixes to the permission key required to access them
const ROUTE_PERMISSION_MAP: Record<string, keyof EmployeePermissions> = {
  "/manage-employers": "manage_employers",
  "/manage-jobs": "manage_jobs",
  "/manage-industries": "manage_industries",
  "/manage-type-of-job": "job_types",
  "/manage-cities": "manage_cities",
  "/manage-content": "manage_content",
};

// Routes that only admin can access (no permission key, admin-only)
const ADMIN_ONLY_ROUTES = ["/manage-employee", "/admin-setting"];

function AuthChecker() {
  const isLogin = useSelector((state: RootState) => state.auth.isLogin);
  const role = useSelector((state: RootState) => state.auth.role);
  const permissions = useSelector(
    (state: RootState) => state.auth.permissions
  );
  const previousRoute: string = useSelector(
    (state: RootState) => state.currentRoute.route
  );
  const router = useRouter();
  const pathname = usePathname();

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

  // Permission-based route protection for employees
  useEffect(() => {
    if (!isLogin || !pathname || role === "admin" || !role) return;

    // Check admin-only routes
    const isAdminOnly = ADMIN_ONLY_ROUTES.some((route) =>
      pathname.startsWith(route)
    );
    if (isAdminOnly) {
      router.push("/no-permission");
      return;
    }

    // Check permission-gated routes
    for (const [routePrefix, permKey] of Object.entries(ROUTE_PERMISSION_MAP)) {
      if (pathname.startsWith(routePrefix)) {
        if (!permissions || !permissions[permKey]) {
          router.push("/no-permission");
        }
        return;
      }
    }
  }, [isLogin, pathname, role, permissions, router]);

  return <div></div>;
}

export default AuthChecker;
