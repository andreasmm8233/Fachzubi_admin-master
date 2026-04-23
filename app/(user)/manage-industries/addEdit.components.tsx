"use client";

import { Box, Button, Stack, TextField, Typography } from "@mui/material";
import { useFormik } from "formik";
import { useEffect } from "react";
import * as Yup from "yup";
interface Industry {
  name: string;
}

const validationSchema = Yup.object({
  name: Yup.string().required("Name is required"),
});

const AddEditIndustries = (props: any) => {
  const formik = useFormik<Industry>({
    initialValues: {
      name: props.name,
    },
    validationSchema: validationSchema,
    onSubmit: async () => {
      await props.handleClose();
    },
  });

  useEffect(()=>{
    if(formik.values.name){
      props.setName(formik.values.name)
    }
  },[formik.values.name]);

  return (
      <Box sx={{ p: 3 }}>
        <Stack direction={"column"} spacing={2}>
          <Typography variant="h3">Add Industries</Typography>

          <TextField
            sx={{
              "& .MuiInputBase-root": {
                border: "1px solid #646464 !important",
                fontSize: "16px !important",
                fontWeight: "500 !important",
                "& .MuiInputBase-input": {
                  padding: "10px 12px ",
                },
              },
              "& .MuiFormHelperText-root": {
                marginLeft: "5px",
                color: "#FFA500",
                fontWeight: "500",
              },
            }}
            fullWidth
            id="outlined-basic"
            placeholder="Industry Name"
            autoComplete="off"
            name="name"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.name}
          />
          {formik.touched.name && formik.errors.name && (
            <div style={{color:"red"}}>{formik.errors.name}</div>
          )}

          <Stack
            direction={"row"}
            spacing={2}
            sx={{ pt: 4, px: 4 }}
            justifyContent={"center"}
          >
            <Button
              fullWidth
              onClick={() => {
                console.log(formik.handleSubmit());
              }}
              variant="contained"
              disabled={props.loading}
            >
              {props.loading ? "Saving..." : "Save"}
            </Button>
            <Button
              fullWidth
              onClick={props.clearAllState}
              variant="contained"
              disabled={props.loading}
            >
              Cancel
            </Button>
          </Stack>
        </Stack>
      </Box>
  );
};
export default AddEditIndustries;
