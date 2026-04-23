"use client";

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
import DashboardCard from "./dashboardCard";
import { GetCount } from "@/app/api/auth/auth.types";
import { useEffect, useState } from "react";
import CustomLoader from "@/app/components/SpinLoader";

const Dashboard = () => {
  const [dashboardData, setData] = useState<GetCount>();
  const [isLoading, setIsLoading] = useState(false);
  const handleGetCount = async () => {
    setIsLoading(true);
    const data = await getDashBoardData();
    if (data.remote === "success") {
      setData(data.data.data);
    }
    setIsLoading(false);
  };
  useEffect(() => {
    handleGetCount();
  }, []);
  return (
    <>
      <Title heading="Dashboard" />
      {isLoading ? (
        <CustomLoader />
      ) : (
        <Box>
          <Grid container spacing={3}>
            <DashboardCard
              id="1"
              title="Total Employer"
              count={Number(dashboardData?.employer) ?? 1}
            />
            <DashboardCard
              id="2"
              title="Total Jobs"
              count={Number(dashboardData?.jobs) ?? 1}
            />
            <DashboardCard id="3" title="Total Applications" count={Number(dashboardData?.application)} />

            <DashboardCard id="4" title="Total Appointments" count={Number(dashboardData?.appoinment)} />
          </Grid>
        </Box>
      )}
    </>
  );
};

export default Dashboard;
