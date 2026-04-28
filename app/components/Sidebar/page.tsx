"use client";

import {
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";

import React, { useState, useMemo } from "react";
import { MENU_DATA, SidebarMenu } from "./helper";
import Link from "next/link";

import { usePathname } from "next/navigation";
import { SVG } from "../icon";
import { setIsLogin, setRole, setPermissions } from "@/app/redux/auth/authSlice";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/app/redux/store";
import { EmployeePermissions } from "@/app/api/manageEmployee/helper";

const SidebarMenu_Component = () => {
  const dispatch = useDispatch();
  const pathname = usePathname();
  const [openMenu, setOpenMenu] = useState<number | null>(null);

  const role = useSelector((state: RootState) => state.auth.role);
  const permissions = useSelector(
    (state: RootState) => state.auth.permissions
  );

  const filteredMenuData = useMemo(() => {
    // Admin sees everything
    if (!role || role === "admin") {
      return MENU_DATA;
    }

    // Employee — filter by permissions
    return MENU_DATA.filter((item: SidebarMenu) => {
      // Always show items with no permission restriction (Dashboard, Log Out)
      if (!item.permissionKey && !item.adminOnly) return true;

      // Hide admin-only items from employees
      if (item.adminOnly) return false;

      // Check permission key
      if (item.permissionKey && permissions) {
        return permissions[item.permissionKey as keyof EmployeePermissions] === true;
      }

      return false;
    });
  }, [role, permissions]);

  const handleMenu = (id: number) => {
    if (id === openMenu) {
      setOpenMenu(null);
    } else {
      setOpenMenu(id);
    }
  };
  return (
    <>
      <List>
        {filteredMenuData.map((item, index) => (
          <React.Fragment key={`parent-${index}`}>
            <ListItem
              key={`parent-${index}`}
              disablePadding
              sx={{ display: "block" }}
            >
              <ListItemButton
                autoFocus={false}
                disableRipple={true}
                {...(item.url ? { component: Link, href: `${item.url}` } : {})}
                sx={{
                  minHeight: 48,

                  px: 2.5,
                  py: 2,
                  "&.MuiListItemButton-root": {
                    fontSize: "16px",
                    fontWeight: 600,
                    color: pathname?.includes(`${item.url}`)
                      ? "#0096A4"
                      : "#646464",
                    "&:hover": {
                      background: "transparent",
                      color: "#0096A4",
                      "& .MuiListItemIcon-root": {
                        color: "#0096A4",
                      },
                    },
                    "& .MuiTypography-body1": {
                      fontWeight: 600,
                      whiteSpace: "nowrap",
                    },
                  },
                }}
                onClick={() => {
                  if (item.label === "Log Out") {
                    const remEmail = localStorage.getItem("rememberedEmail");
                    const remPass = localStorage.getItem("rememberedPassword");
                    localStorage.clear();
                    if (remEmail) localStorage.setItem("rememberedEmail", remEmail);
                    if (remPass) localStorage.setItem("rememberedPassword", remPass);

                    dispatch(setIsLogin(false));
                    dispatch(setRole(null));
                    dispatch(setPermissions(null));
                  }
                  if (item.children) {
                    handleMenu(item.id);
                  }
                }}
              >
                <ListItemIcon
                  key={item.url}
                  sx={{
                    minWidth: 0,
                    mr: 2,
                  }}
                >
                  <item.icon />
                </ListItemIcon>
                <ListItemText primary={item.label} />
                {item.children ? (
                  <ListItemIcon sx={{ minWidth: "auto", color: "inherit" }}>
                    <SVG.ArrowDown />
                  </ListItemIcon>
                ) : (
                  ""
                )}
              </ListItemButton>
            </ListItem>
            {openMenu === item.id ? (
              <>
                {item.children ? (
                  <ListItem sx={{ flexDirection: "column" }}>
                    {item.children.map((child, key) => {
                      return (
                        <ListItemButton
                          key={`child-${key}`}
                          sx={{
                            width: "100%",
                            color: "#646464",
                            "&.MuiListItemButton-root": {
                              fontSize: "16px",
                              fontWeight: 600,
                              color: pathname?.includes(`${child.url}`)
                                ? "#0096A4"
                                : "#646464",
                              "&:hover": {
                                background: "transparent",
                                color: "#0096A4",
                                "& .MuiListItemIcon-root": {
                                  color: "#0096A4",
                                },
                              },
                              "& .MuiTypography-body1": {
                                fontWeight: 600,
                              },
                            },
                          }}
                          component={Link}
                          href={`/manage-content/${child.url}`}
                        >
                          <ListItemIcon
                            sx={{ minWidth: "auto", color: "inherit" }}
                          >
                            <SVG.ArrowLeft />
                          </ListItemIcon>
                          <ListItemText key={child.id}>
                            {child.label}
                          </ListItemText>
                        </ListItemButton>
                      );
                    })}
                  </ListItem>
                ) : (
                  ""
                )}
              </>
            ) : (
              ""
            )}
          </React.Fragment>
        ))}
      </List>
    </>
  );
};
export default SidebarMenu_Component;
