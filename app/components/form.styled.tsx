import { styled } from "@mui/system";

export const StyledManageForm = styled("div")(() => ({
  "& .MuiInputBase-root": {
    border: "1px solid #646464 !important",
    fontSize: "16px !important",
    fontWeight: "500 !important",
    "& .MuiInputBase-input": {
      padding: "10px 12px ",
    },
  },
  "& label": {
    fontSize: "16px",
    fontWeight: 500,
    display: "block",
    marginTop: "11px",
  },
}));
