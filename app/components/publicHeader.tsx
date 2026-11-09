"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { Box, Button, Container, Stack } from "@mui/material";
import { RootState } from "@/app/redux/store";
import { shouldHideLogo } from "@/app/ulits/hideLogo";

const NAV_ITEMS = [
  { label: "Unternehmen", href: "/companies" },
  { label: "Jobs", href: "/jobs" },
];

// Shared header for the public companies/jobs pages. Like the rest of the
// branding, the logo stays hidden on white-label domains.
const PublicHeader = () => {
  const router = useRouter();
  const pathname = usePathname();
  const isLogin = useSelector((state: RootState) => state.auth.isLogin);
  // Hidden by default so the logo never flashes on white-label domains
  const [hideLogo, setHideLogo] = useState(true);

  useEffect(() => {
    setHideLogo(shouldHideLogo());
  }, []);

  return (
    <Box
      component="header"
      sx={{
        position: "sticky",
        top: 0,
        zIndex: 1100,
        backgroundColor: "rgba(255,255,255,0.92)",
        backdropFilter: "blur(10px)",
        borderBottom: "1px solid #edf2f7",
        boxShadow: "0 2px 12px rgba(0,0,0,0.04)",
      }}
    >
      <Container
        maxWidth="lg"
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 2,
          minHeight: { xs: 64, md: 76 },
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", minWidth: 0 }}>
          {!hideLogo && (
            <Link href="/companies" style={{ display: "flex" }}>
              <Box
                sx={{
                  position: "relative",
                  width: { xs: 118, sm: 150, md: 176 },
                  height: { xs: 40, sm: 51, md: 60 },
                }}
              >
                <Image
                  src="/unibonus-logo.png"
                  alt="UniBonus"
                  fill
                  sizes="176px"
                  style={{ objectFit: "contain", objectPosition: "left center" }}
                  priority
                />
              </Box>
            </Link>
          )}
        </Box>

        <Stack direction="row" alignItems="center" spacing={{ xs: 0.5, sm: 1 }}>
          {NAV_ITEMS.map((item) => {
            const active = pathname?.startsWith(item.href);
            return (
              <Button
                key={item.href}
                component={Link}
                href={item.href}
                sx={{
                  textTransform: "none",
                  fontWeight: 700,
                  fontSize: { xs: "0.85rem", sm: "0.95rem" },
                  px: { xs: 1.25, sm: 2 },
                  borderRadius: "999px",
                  color: active ? "#0096A4" : "#4a5568",
                  backgroundColor: active ? "rgba(0,150,164,0.1)" : "transparent",
                  "&:hover": {
                    backgroundColor: "rgba(0,150,164,0.08)",
                    color: "#0096A4",
                  },
                }}
              >
                {item.label}
              </Button>
            );
          })}
          <Button
            variant="contained"
            disableElevation
            onClick={() => router.push(isLogin ? "/dashboard" : "/")}
            sx={{
              textTransform: "none",
              fontWeight: 700,
              fontSize: { xs: "0.8rem", sm: "0.95rem" },
              px: { xs: 1.5, sm: 2.5 },
              borderRadius: "999px",
              whiteSpace: "nowrap",
              backgroundColor: "#F1841D",
              "&:hover": { backgroundColor: "#d9720f" },
            }}
          >
            {isLogin ? "Zum Dashboard" : "Zum Login"}
          </Button>
        </Stack>
      </Container>
    </Box>
  );
};

export default PublicHeader;
