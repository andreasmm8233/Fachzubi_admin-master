import { SVG } from "@/app/components/icon";
import { IconButton, Stack } from "@mui/material";

export const COLUMS_DATA = [
  // {
  //   id: 1,
  //   name: "id",
  //   key: "id",
  // },
  {
    id: 2,
    name: "Date",
    key: "date",
  },
  {
    id: 3,
    name: "Company Name",
    key: "companyName",
  },
  {
    id: 4,
    name: "Email",
    key: "email",
  },
  {
    id: 5,
    name: "Contact Person",
    key: "contact",
  },
  {
    id: 6,
    name: "Industry",
    key: "industry",
  },
  {
    id: 7,
    name: "City",
    key: "city",
  },
  {
    id: 8,
    name: "Status",
    key: "status",
  },
  {
    id: 9,
    name: "Action",
    key: "action",
  },
];

export const ROW_DATA = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(() => {
  return {
    id: "857845",
    date: "10/12/2023",
    companyname: "Digimonk Technologies",
    email: "akshay@digimonk.in",
    contact: "Anjali rajput",
    industry: "Software",
    city: "Morena",
    status: "Active",
  };
});
