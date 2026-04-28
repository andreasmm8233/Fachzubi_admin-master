"use client";

import { Box, Button, Stack, Typography } from "@mui/material";
import { useRouter } from "next/navigation";
import BlockIcon from "@mui/icons-material/Block";

const NoPermissionPage = () => {
  const router = useRouter();

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "60vh",
      }}
    >
      <Stack
        direction="column"
        spacing={3}
        alignItems="center"
        sx={{ textAlign: "center" }}
      >
        <BlockIcon sx={{ fontSize: 80, color: "#0096A4" }} />
        <Typography
          variant="h4"
          sx={{ fontWeight: 700, color: "#333" }}
        >
          Access Denied
        </Typography>
        <Typography
          variant="body1"
          sx={{ fontSize: "18px", color: "#646464", maxWidth: 400 }}
        >
          You do not have permission to access this page. Please contact your
          administrator if you believe this is an error.
        </Typography>
        <Button
          variant="contained"
          onClick={() => router.push("/dashboard")}
          sx={{
            px: 6,
            py: 1.5,
            fontSize: "16px",
            backgroundColor: "#0096A4",
            "&:hover": { backgroundColor: "#007a85" },
          }}
        >
          Go to Dashboard
        </Button>
      </Stack>
    </Box>
  );
};

export default NoPermissionPage;
