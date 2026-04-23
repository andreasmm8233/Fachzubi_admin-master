"use client";

import {
  AppBar,
  Avatar,
  Box,
  IconButton,
  Menu,
  MenuItem,
  Stack,
  Toolbar,
  Typography,
} from "@mui/material";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { SVG } from "../components/icon";
import SidebarMenu from "../components/Sidebar/page";
import AuthChecker from "./authChecker";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [isToggle, setIsToggle] = useState(true);
  const loading = useSelector((state: RootState) => state.auth.loading);
  const handleToggle = () => {
    setIsToggle(!isToggle);
  };

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <AppBar
        position="static"
        sx={{
          background: "#fff",
          color: "#000",
          boxShadow: "none",
          padding: "19px 18px",
        }}
      >
        {!loading && <AuthChecker />}
        <Toolbar
          sx={{ minHeight: "auto !important", padding: "0px !important" }}
        >
          <Typography
            variant="h6"
            sx={{
              mr: 2,
              width: isToggle ? "259px" : "37px",
              display: "flex",
              alignItems: "center",
            }}
          >
            <Image
              src={isToggle ? "/logo.png" : "/fevicon.png"}
              alt=""
              width={isToggle ? 210 : 28}
              height={isToggle ? 28 : 30.7}
            />
          </Typography>
          <Box sx={{ flexGrow: 1 }}>
            <IconButton
              size="large"
              edge="start"
              color="inherit"
              aria-label="menu"
              sx={{ mr: 2 }}
              onClick={() => handleToggle()}
            >
              <SVG.Menu />
            </IconButton>
          </Box>
          {/* <div>
            <Stack
              direction={"row"}
              spacing={1}
              alignItems={"center"}
              onClick={handleMenu}
            >
              <Avatar
                sx={{ background: "#0096A4", height: "45px", width: "45px" }}
              >
                A
              </Avatar>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="25"
                height="25"
                viewBox="0 0 25 25"
                fill="none"
              >
                <path
                  d="M6.25 9.375L12.5 15.625L18.75 9.375"
                  stroke="#646464"
                  strokeWidth="1.69167"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </Stack>
            <Menu
              id="menu-appbar"
              anchorEl={anchorEl}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "right",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              open={Boolean(anchorEl)}
              onClose={handleClose}
            >
              <MenuItem onClick={handleClose}>Profile</MenuItem>
              <MenuItem onClick={handleClose}>My account</MenuItem>
            </Menu>
          </div> */}
        </Toolbar>
      </AppBar>
      <Box sx={{ display: "flex", height: "100%" }}>
        {isToggle ? (
          <Box
            sx={{
              width: "259px",
              p: 0,
              transition: "all 0.5s",
              flexShrink: "0",
            }}
          >
            <SidebarMenu />
          </Box>
        ) : (
          ""
        )}
        <Box
          sx={{
            flexGrow: 1,
            p: 3,
            pt: 2,
            background: "#F1F1F1",
            minHeight: "calc(100vh - 65px)",
            overflow: "hidden",
          }}
        >
          {children}
        </Box>
      </Box>
    </>
  );
}
