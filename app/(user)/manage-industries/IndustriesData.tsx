"use client";
import { SVG } from "@/app/components/icon";
import { IconButton, Stack } from "@mui/material";

export const COLUMS_DATA = [
  // {
  //   id: 1,
  //   name: "Id",
  //   key: "id",
  //   width: "45%",
  // },
  {
    id: 2,
    name: "Industry Name",
    key: "industry",
    width: "45%",
  },

  {
    id: 3,
    name: "Action",
    key: "action",
    width: "10%",
  },
];

export const ROW_DATA = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((item) => {
  return {
    id: "857845",

    industry: "Software",

    action: (
      <Stack
        direction="row"
        spacing={1}
        alignItems={"center"}
        sx={{
          "& .MuiButtonBase-root": {
            color: "#0096A4",
            "&:hover": {
              color: "#F1841D",
            },
          },
        }}
      >
        <IconButton>
          <SVG.Edit />
        </IconButton>

        <IconButton>
          <SVG.Delete />
        </IconButton>
      </Stack>
    ),
  };
});
