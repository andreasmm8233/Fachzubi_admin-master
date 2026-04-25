"use client";
import { SVG } from "@/app/components/icon";
import { IconButton, Stack } from "@mui/material";

export const COLUMS_DATA = [
  {
    id: 1,
    name: "City",
    key: "industry",
  },
  {
    id: 2,
    name: "Start Time",
    key: "startTime",
  },
  {
    id: 3,
    name: "End Time",
    key: "endTime",
  },
  {
    id: 4,
    name: "Zip Code",
    key: "zipCode",
  },
  {
    id: 5,
    name: "Direction Link",
    key: "directionLink",
  },
  {
    id: 5,
    name: "Address",
    key: "address",
  },
  {
    id: 6,
    name: "QR Code",
    key: "qrCode",
  },
  {
    id: 7,
    name: "Status",
    key: "status",
  },
  {
    id: 8,
    name: "Action",
    key: "action",
    width: "10%",
  },
];

export const ROW_DATA = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((item) => {
  return {
    id: "1188990678",

    industry: "Gwalior",
  };
});
