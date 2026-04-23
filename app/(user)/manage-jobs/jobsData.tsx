"use client";

export const COLUMS_DATA = [
  // {
  //   id: 1,
  //   name: "Job Id",
  //   key: "id",
  // },

  {
    id: 2,
    name: "Date",
    key: "date",
  },
  {
    id: 1,
    name: "company Name",
    key: "company",
  },
  {
    id: 3,
    name: "Job Title",
    key: "jobTitle",
  },
  {
    id: 4,
    name: "Start Date",
    key: "startDate",
  },
  {
    id: 5,
    name: "Industry",
    key: "industry",
  },

  {
    id: 6,
    name: "City",
    key: "city",
  },
  {
    id: 7,
    name: "Applications",
    key: "applications",
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

export const ROW_DATA = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((item) => {
  return {
    id: "857845",
    date: "10/12/2023",
    jobtitle: "Manager",
    startdate: "26/12/2023",

    industry: "Software",
    city: "Morena",
    applications: "12",
    status: "Active",
  };
});
