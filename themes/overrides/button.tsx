// ==============================|| OVERRIDES - BUTTON ||============================== //

export default function Button() {
  const containedStyle = {
    "&.MuiButton-contained": {
      backgroundColor: "#0096A4",
      color: "#FFFFFF",
      borderRadius: "10px",
      boxShadow: "none",

      textTransform: "capitalize",

      "&:hover": {
        background: "#F1841D",
        color: "#fff",
        boxShadow: "none",
      },
      "&.Mui-disabled": {
        backgroundColor: "#B8BABE !important",
        color: "#FFFFFF !important",
      },
    },
  };

  const outlinedStyle = {
    "&.MuiButton-outlined": {
      borderRadius: "10px",
      boxShadow: "none",

      border: "1px solid #0096A4",

      color: "#0096A4",
      fontSize: "20px",
      background: "#fff",
      textTransform: "capitalize",

      "&:hover": { background: "#FDFBF4" },
      "&.Mui-disabled": {
        backgroundColor: "transparent",
        border: "1px solid #BDC5BE !important",
        color: "#BDC5BE !important",
      },
    },
  };

  // const textStyle = {};

  return {
    MuiButton: {
      defaultProps: {
        disableElevation: false,
      },
      styleOverrides: {
        root: {
          fontWeight: 500,
          fontSize: "20px",
          fontFamily: `'Poppins', sans-serif`,
          letterSpacing: "0.04em",
          borderRadius: "10px",
          color: "#0096A4",
        },
        contained: {
          ...containedStyle,
        },
        outlined: {
          ...outlinedStyle,
        },
        // text: {
        //   ...textStyle,
        // },
      },
    },
  };
}
