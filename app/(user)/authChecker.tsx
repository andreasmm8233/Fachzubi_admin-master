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
const ADMIN_ONLY_ROUTES = ["/manage-employee", "/admin-setting", "/dashboard"];

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
        let targetRoute = previousRoute;
        if (previousRoute === "/" || previousRoute === "/reset-password") {
          targetRoute = "/dashboard";
          if (role === "employee") {
            const perms = permissions || ({} as EmployeePermissions);
            if (perms.manage_employers) targetRoute = "/manage-employers";
            else if (perms.manage_jobs) targetRoute = "/manage-jobs";
            else if (perms.manage_industries) targetRoute = "/manage-industries";
            else if (perms.job_types) targetRoute = "/manage-type-of-job";
            else if (perms.manage_cities) targetRoute = "/manage-cities";
            else if (perms.manage_content) targetRoute = "/manage-content/terms-and-conditions";
          }
        }
        
        if (pathname !== targetRoute && pathname === "/dashboard" && role === "employee") {
           router.push(targetRoute);
        } else if (pathname !== targetRoute && (previousRoute === "/" || previousRoute === "/reset-password")) {
           // If they came from login, and they are not on targetRoute, but wait!
           // The login page ALREADY pushed them to their correct route.
           // If we push again here based on previousRoute being "/", we might interrupt it.
           // Actually, if previousRoute is "/", it means they started on login.
           // They are currently on whatever login page pushed them to. We should NOT override it!
           // Only redirect if pathname is still "/" or something, which won't happen here because it's inside app/(user).
           // Let's just NOT redirect if previousRoute is "/" or "/reset-password" because login page handles it!
           // Wait, what if they reload the page on /manage-jobs? previousRoute becomes /manage-jobs.
           // Then we don't need to redirect them because they are already on /manage-jobs!
        }
      }
    }
  }, [isLogin, previousRoute, router, pathname, role, permissions]);

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
