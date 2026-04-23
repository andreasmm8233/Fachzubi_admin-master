export default function TextField() {
  return {
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiInputBase-root": {
            background: "#fff",
            border: "1px solid #0096A4",
            borderRadius: "10px",
            fontSize: "24px",
            fontWeight: 500,
            "&:hover": {
              background: "#fff",
            },

            "&:before": {
              display: "none",
            },
            "&:after": {
              display: "none",
            },
          },

          "& .MuiFormLabel-root": {
            fontSize: "14px",
            transform: "translate(12px, 20px) scale(1)",
            paddingLeft: "10px",
          },
          "& .MuiInputLabel-shrink": {
            transform: "translate(12px, 7px) scale(1)",
            textTransform: "uppercase",
            color: "#834331",
            fontSize: "14px",
            //   fontFamily: "Myriad Pro Semibold",
            letterSpacing: " 0.04em",
          },
          "& fieldset": {
            display: "none",
          },
        },
      },
    },
  };
}
