"use client";

import { useState } from "react";
import { Box, Button, Grid, Stack, TextField, FormLabel } from "@mui/material";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import { useFormik } from "formik";
import * as yup from "yup";
import dayjs from "dayjs";

const DEFAULT_QR_TARGET_BASE = "https://webzlab.site/jobs/";

const splitQrTargetUrl = (url?: string, fallbackName?: string) => {
  if (!url) {
    return {
      base: DEFAULT_QR_TARGET_BASE,
      cityName: fallbackName || "",
    };
  }

  const lastSlashIndex = url.lastIndexOf("/");
  if (lastSlashIndex === -1) {
    return {
      base: DEFAULT_QR_TARGET_BASE,
      cityName: fallbackName || "",
    };
  }

  return {
    base: url.slice(0, lastSlashIndex + 1),
    cityName: decodeURIComponent(url.slice(lastSlashIndex + 1)),
  };
};

const AddCities = (props: any) => {
  const qrTarget = splitQrTargetUrl(props.qrTargetUrl, props.name);
  const [randomDigits] = useState(() => Math.floor(1000 + Math.random() * 9000));
  const validationSchema = yup.object().shape({
    name: yup.string().required("City is required"),
    startTime: yup.date(),
    endTime: yup.date(),
    address: yup.string(),
    zipCode: yup.string(),
    directionLink: yup.string(),
    qrTargetCityName: yup
      .string()
      .required("QR city URL name is required")
      .matches(/^[a-zA-Z0-9-]+$/, "Use only letters, numbers, and hyphens"),
  });
  const convertToTimeDate = (timeString: string): Date | undefined => {
    const date = new Date(`2000-01-01 ${timeString}`);
    return isNaN(date.getTime()) ? undefined : date;
  };
  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      name: props.name || "",
      startTime: convertToTimeDate(props.startTime) || undefined,
      endTime: convertToTimeDate(props.endTime) || undefined,
      address: props.address || "",
      zipCode: props.zipCode || "",
      directionLink: props.directionLink || "",
      qrTargetBase: qrTarget.base,
      qrTargetCityName: qrTarget.cityName,
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      const { qrTargetBase, qrTargetCityName, ...cityValues } = values;
      props.handleClose({
        ...cityValues,
        qrTargetUrl: `${qrTargetBase}${encodeURIComponent(
          qrTargetCityName.trim()
        )}`,
      });
    },
  });

  return (

      <Box sx={{ p: 3 }}>
        <Stack direction={"column"} spacing={2}>
          <FormLabel>Add City</FormLabel>
          <TextField
            {...formik.getFieldProps("name")}
            onChange={(e) => {
              const value = e.target.value;
              formik.setFieldValue("name", value);
              if (!props.name) {
                const formattedName = value.toLowerCase().replace(/[^a-z0-9]/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, "");
                if (formattedName) {
                  formik.setFieldValue("qrTargetCityName", `${formattedName}-${randomDigits}`);
                } else {
                  formik.setFieldValue("qrTargetCityName", "");
                }
              }
            }}
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

          {props.role !== "employee" && (
            <>
              <FormLabel>QR Target URL City Name</FormLabel>
          <Stack direction={{ xs: "column", md: "row" }} spacing={1}>
            <TextField
              value={formik.values.qrTargetBase}
              disabled
              sx={{
                flex: 1,
                "& .MuiInputBase-root": {
                  border: "1px solid #646464 !important",
                  fontSize: "16px !important",
                  fontWeight: "500 !important",
                  "& .MuiInputBase-input": {
                    padding: "10px 12px ",
                  },
                },
              }}
              fullWidth
            />
            <TextField
              {...formik.getFieldProps("qrTargetCityName")}
              sx={{
                flex: 1,
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
              placeholder="city-name"
              autoComplete="off"
            />
          </Stack>
          {formik.touched.qrTargetCityName &&
            formik.errors.qrTargetCityName && (
              <div style={{ color: "red" }}>
                {formik.errors.qrTargetCityName as string}
              </div>
            )}
            </>
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
