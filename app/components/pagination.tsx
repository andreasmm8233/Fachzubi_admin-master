"use client";
import * as React from "react";
import usePagination from "@mui/material/usePagination";
import { styled } from "@mui/material/styles";
import { Box, MenuItem, Select, SelectChangeEvent, Stack } from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";

const List = styled("ul")({
  listStyle: "none",
  padding: 0,
  margin: 0,
  display: "flex",
});

export default function UsePagination({
  pageCount,
  setRecordPerPage,
  recordPerPage,
  setPageNo,
  pageNo,
}: {
  pageCount: number;
  setRecordPerPage: (payload: string) => void;
  recordPerPage: string;
  setPageNo: (payload: number) => void;
  pageNo: number;
}) {
  const { items } = usePagination({
    count: pageCount,
  });

  const handleChange = (event: SelectChangeEvent) => {
    setPageNo(1);
    setRecordPerPage(event.target.value);
  };
  const handlePageChange = (selectedPage: number) => {
    setPageNo(selectedPage);
  };
  return (
    <Box sx={{ display: "flex", alignItems: "center", mt: 2 }}>
      <Stack direction={"row"} spacing={2} alignItems={"center"}>
        <Select
          IconComponent={KeyboardArrowDownIcon}
          value={recordPerPage}
          onChange={handleChange}
          sx={{
            "& fieldset": { display: "none" },
          }}
          size="small"
        >
          <MenuItem value={5}>5</MenuItem>
          <MenuItem value={10}>10</MenuItem>
          <MenuItem value={25}>25</MenuItem>
          <MenuItem value={30}>30</MenuItem>
        </Select>
        <Box sx={{ color: "#646464", fontSize: "20px" }}>Records Per Page</Box>
      </Stack>
      <Box
        sx={{
          flexGrow: 1,
          display: "inline-flex",
          justifyContent: "flex-end",
          "&.pagination_demo li": {
            "&:last-child": {
              "& button": {
                borderRadius: "0px 9px 9px 0px",
              },
            },
            "&:first-child": {
              "& button": {
                borderRadius: "9px 0px 0px 9px",
              },
            },
          },
        }}
        className="pagination_demo"
      >
        <List sx={{ alignItems: "center" }}>
          {items.map(({ page, type, selected, ...item }, index) => {
            let children = null;

            if (type === "start-ellipsis" || type === "end-ellipsis") {
              children = "…";
            } else if (type === "page") {
              children = (
                <button
                  type="button"
                  style={{
                    fontWeight: pageNo === page ? "bold" : undefined,
                    color: pageNo === page ? "#fff" : "#646464",
                    fontSize: "20px",
                    background: pageNo === page ? "#0096A4" : undefined,
                    border: "0px",
                    padding: "8px 10px",
                    width: "50px",
                    height: "50px",
                    cursor: "pointer",
                  }}
                  {...item}
                >
                  {page}
                </button>
              );
            } else {
              children = (
                <button
                  type="button"
                  {...item}
                  className="nextprv"
                  style={{ height: "50px" }}
                >
                  {type}
                </button>
              );
            }

            return (
              <li
                key={index}
                onClick={() => {
                  handlePageChange(page || 1);
                }}
              >
                {children}
              </li>
            );
          })}
        </List>
      </Box>
    </Box>
  );
}
