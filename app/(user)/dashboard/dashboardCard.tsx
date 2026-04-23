import React from "react";
import { getDashBoardData } from "@/app/api/auth/auth";
import Title from "@/app/components/title.components";
import {
  Avatar,
  Box,
  Card,
  CardContent,
  Grid,
  Stack,
  Typography,
} from "@mui/material";
export interface Dashboard {
  id: string;
  title: string;
  count: number | string;
}
const DashboardCard = ({ id, title, count }: Dashboard) => {
  return (
    <Grid item xs={12} lg={6} key={id}>
      <Card
        sx={{
          borderRadius: "10px",
          boxShadow: "0px 4px 4px 0px rgba(0, 0, 0, 0.25)",
        }}
      >
        <CardContent>
          <Stack direction={"row"} alignItems={"center"} spacing={2}>
            <Typography variant="h4" sx={{ fontWeight: 500 }}>
              {title}
            </Typography>
            <Box
              sx={{
                flexGrow: 1,
                justifyContent: "flex-end",
                display: "flex",
              }}
            >
              <Avatar
                sx={{
                  width: "70px",
                  height: "70px",
                  background: "#0096A4",
                  fontSize: "24px",
                }}
              >
                {count}
              </Avatar>
            </Box>
          </Stack>
        </CardContent>
      </Card>
    </Grid>
  );
};

export default DashboardCard;
