"use client";

import { Box, Button, Grid, Stack, TextField, FormLabel } from "@mui/material";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import { useFormik } from "formik";
import * as yup from "yup";
import dayjs from "dayjs";

const AddCities = (props: any) => {
  const validationSchema = yup.object().shape({
    name: yup.string().required("City is required"),
    startTime: yup.date(),
    endTime: yup.date(),
    address: yup.string(),
    zipCode: yup.string(),
    directionLink: yup.string()
  });
  const convertToTimeDate = (timeString: string): Date | undefined => {
    const date = new Date(`2000-01-01 ${timeString}`);
    return isNaN(date.getTime()) ? undefined : date;
  };
  const formik = useFormik({
    initialValues: {
      name: props.name || "",
      startTime: convertToTimeDate(props.startTime) || undefined,
      endTime: convertToTimeDate(props.endTime) || undefined,
      address: props.address || "",
      zipCode: props.zipCode || "",
      directionLink: props.directionLink || "",
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      props.handleClose(values);
    },
  });

  return (

      <Box sx={{ p: 3 }}>
        <Stack direction={"column"} spacing={2}>
          <FormLabel>Add City</FormLabel>
          <TextField
            {...formik.getFieldProps("name")}
            value={formik.values.name}
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
            placeholder="Add city"
            autoComplete="off"
            // helperText="dd"
          />
          {formik.touched.name && formik.errors.name && (
            <div style={{ color: "red" }}>{formik.errors.name as string}</div>
          )}
          <Box>
            <Grid container spacing={2}>
              <Grid item xs={12} lg={6}>
                <FormLabel>Start Time</FormLabel>
                <Box
                  sx={{
                    "& .MuiTextField-root": {
                      minWidth: "100% ! important",
                    },
                    "& .MuiInputBase-root": {
                      border: "1px solid #646464 !important",
                      fontSize: "16px !important",
                      fontWeight: "500 !important",
                      "& .MuiInputBase-input": { padding: "10px 12px" },
                    },
                  }}
                >
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DemoContainer components={["TimePicker"]}>
                      <TimePicker
                        value={dayjs(
                          formik.values.startTime ? formik.values.startTime : ""
                        )}
                        onChange={(selectedTime) =>
                          formik.setFieldValue("startTime", selectedTime)
                        }
                      />
                    </DemoContainer>
                  </LocalizationProvider>
                  {formik.touched.startTime && formik.errors.startTime && (
                    <div style={{ color: "red" }}>
                      {formik.errors.startTime as string}
                    </div>
                  )}
                </Box>
              </Grid>
              <Grid item xs={12} lg={6}>
                <FormLabel>End Time</FormLabel>
                <Box
                  sx={{
                    "& .MuiTextField-root": {
                      minWidth: "100% ! important",
                    },
                    "& .MuiInputBase-root": {
                      border: "1px solid #646464 !important",
                      fontSize: "16px !important",
                      fontWeight: "500 !important",
                      "& .MuiInputBase-input": { padding: "10px 12px" },
                    },
                  }}
                >
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DemoContainer components={["TimePicker"]}>
                      <TimePicker
                        value={dayjs(
                          formik.values.endTime ? formik.values.endTime : ""
                        )}
                        onChange={(selectedTime) =>
                          formik.setFieldValue("endTime", selectedTime)
                        }
                      />
                    </DemoContainer>
                  </LocalizationProvider>
                  {formik.touched.endTime && formik.errors.endTime && (
                    <div style={{ color: "red" }}>
                      {formik.errors.endTime as string}
                    </div>
                  )}
                </Box>
              </Grid>
            </Grid>
          </Box>

          <FormLabel>Address</FormLabel>
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
            {...formik.getFieldProps("address")}
            value={formik.values.address}
            fullWidth
            id="outlined-basic"
            placeholder="Address"
            autoComplete="off"
          />
          {formik.touched.address && formik.errors.address && (
            <div style={{ color: "red" }}>
              {formik.errors.address as string}
            </div>
          )}
          <FormLabel>zipCode</FormLabel>
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
            {...formik.getFieldProps("zipCode")}
            fullWidth
            id="outlined-basic"
            placeholder="zipCode"
            autoComplete="off"
            // helperText="dd"
          />
          {formik.touched.zipCode && formik.errors.zipCode && (
            <div style={{ color: "red" }}>
              {formik.errors.zipCode as string}
            </div>
          )}

          <FormLabel>Direction Link</FormLabel>
          <TextField
            {...formik.getFieldProps("directionLink")}
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
            placeholder="Direction Link"
            autoComplete="off"
          />
          {formik.touched.directionLink && formik.errors.directionLink && (
            <div style={{ color: "red" }}>
              {formik.errors.directionLink as string}
            </div>
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
                formik.handleSubmit();
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
export default AddCities;
