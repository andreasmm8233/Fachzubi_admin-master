// ==============================|| DEFAULT THEME - TYPOGRAPHY  ||============================== //

import { TypographyOptions } from "@mui/material/styles/createTypography";

const Typography = (fontFamily: string): TypographyOptions => ({
  htmlFontSize: 16,
  fontFamily,
  fontWeightLight: 300,
  fontWeightRegular: 400,
  fontWeightMedium: 500,
  fontWeightBold: 600,
  h1: {
    fontWeight: 600,
    fontSize: "52px",
    lineHeight: 1.21,
  },
  h2: {
    fontWeight: 700,
    fontSize: "40px",
    lineHeight: 1.27,
  },
  h3: {
    fontWeight: 600,
    fontSize: "36px",
    lineHeight: 1.33,
  },
  h4: {
    fontWeight: 600,
    fontSize: "28px",
    lineHeight: 1.4,
  },
  h5: {
    fontSize: "22px",
    lineHeight: 1.5,
  },
  h6: {
    fontSize: "18px",
    lineHeight: 1.57,
  },
  caption: {
    fontWeight: 600,
    fontSize: "12px",
    lineHeight: 1.66,
  },
  body1: {
    fontSize: "16px",
    lineHeight: 1.5,
  },
  body2: {
    fontSize: "13px",
    lineHeight: "16px",
  },
  subtitle1: {
    fontSize: "0.875rem",
    fontWeight: 600,
    lineHeight: 1.57,
  },
  subtitle2: {
    fontSize: "14px",
    fontWeight: 400,
  },
  overline: {
    lineHeight: 1.66,
  },
  button: {
    textTransform: "capitalize",
  },
});

export default Typography;
