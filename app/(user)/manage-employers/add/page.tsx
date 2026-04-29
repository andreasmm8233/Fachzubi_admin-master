"use client";
import React, { useEffect, useState } from "react";

import {
  Autocomplete,
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  IconButton,
  TextField,
} from "@mui/material";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { SVG } from "@/app/components/icon";
import Title from "@/app/components/title.components";
import { useRouter } from "next/navigation";
import { StyledManageForm } from "@/app/components/form.styled";
import { EmployerFormType } from "@/app/api/employer/employer.types";
import {
  addEmployer,
  getEmployerById,
  updateEmployerById,
} from "@/app/api/employer/employer";
import { TransformCity } from "@/app/api/city/city.types";
import { getCity } from "@/app/api/city/city";
import { TransformIndustry } from "@/app/api/industries/industries.types";
import { getIndustries } from "@/app/api/industries/industries";
import CustomLoader from "@/app/components/SpinLoader";
import ErrorAlert from "@/themes/overrides/errorAlert";
import { useFormik } from "formik";
import * as Yup from "yup";
import TextEditor from "../../manage-content/textEditor/textEditor";
import Cropper, { FileState } from "@/app/ulits/cropper";
const AddComponent = () => {
  const re =
    /^((ftp|http|https):\/\/)?(www.)?(?!.*(ftp|http|https|www.))[a-zA-Z0-9_-]+(\.[a-zA-Z]+)+((\/)[\w#]+)*(\/\w+\?[a-zA-Z0-9_]+=\w+(&[a-zA-Z0-9_]+=\w+)*)?$/gm;
  const route = useRouter();
  const [disable, setIsDisable] = useState(false);
  const [id, setId] = useState("");
  const [fileList, setFileList] = useState<FileState[]>([]);
  const [oldFile, setOldFile] = useState<string[]>([]);
  const getYouTubeEmbedUrl = (url: string) => {
    if (!url) return url;
    try {
      const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
      const match = url.match(regExp);
      return match && match[2].length === 11
        ? `https://www.youtube.com/embed/${match[2]}`
        : url;
    } catch (e) {
      return url;
    }
  };

  const validationSchema = Yup.object({
    industryName: Yup.object().test(
      "isImage",
      "invalid industry",
      (value: any) => {
        if (value.id && value.label) {
          return true;
        }
        return false;
      }
    ),
    // contactPerson: Yup.string().required("contact person is required"),
    // jobTitle: Yup.string().required("job title is required"),
    companyName: Yup.string().required("company name  is required"),
    email: Yup.string()
      .email("Invalid email address")
      .required("Email is required"),
    website: Yup.string()
      .matches(re, "URL is not valid")
      .required("website  is required"),
    // phoneNo: Yup.string()
    //   .min(9, "Minimum 9 digit is required")
    //   .required("phone number  is required"),
    // address: Yup.string().required("address is required"),
    // zipCode: Yup.string().required("zip code  is required"),
    // city: Yup.object().test("isCity", "city is required", (value: any) => {
    //   if (value.id && value.label) {
    //     return true;
    //   }
    //   return false;
    // }),
    companyLogo: Yup.mixed().test("isImage", "Company logo is required", (value) => {
      if (!value) {
        return false;
      }
      return true;
    }),
    // companyDescription: Yup.string().required(
    //   "company Description is required"
    // ),
    videoLink: Yup.array().of(Yup.string().matches(re, "URL is not valid")),
  });
  const formik = useFormik<EmployerFormType>({
    initialValues: {
      industryName: { id: "", label: "Select industry" },
      contactPerson: "",
      jobTitle: "",
      companyName: "",
      email: "",
      website: "",
      phoneNo: "+49",
      address: "",
      zipCode: "",
      city: { id: "", label: "Select City" },
      companyLogo: null,
      companyDescription: "",
      videoLink: [""],
    },
    validationSchema: validationSchema,

    onSubmit: async (values) => {
      if (values.phoneNo === "+49") {
        values.phoneNo = "";
      }
      setIsDisable(true);
      values.companyImages = fileList.map((item: any) => {
        return item.originFileObj;
      });
      values.removedFile = oldFile.filter((item) => {
        if (item !== "undefined" || item !== undefined) {
          return item;
        }
      });
      try {
        setIsLoading(true);
        if (id) {
          const data = await updateEmployerById(id, values);
          if (data.remote === "success") {
            route.push("/manage-employers");
          } else {
            const backendError = Object.values(data.error.errors.data);
            setError(
              extractErrorMessage(backendError) || "Something went wrong"
            );
          }
        } else {
          const response = await addEmployer(values);
          if (response.remote === "success") {
            route.push("/manage-employers");
          } else {
            const backendError = Object.values(response.error.errors.data);
            setError(
              extractErrorMessage(backendError) || "Something went wrong"
            );
          }
        }
        setIsLoading(false);
      } catch (error) {
        setIsLoading(false);
      }
      setIsDisable(false);
    },
  });
  const [city, setCity] = useState<TransformCity[]>([]);
  const [industries, setIndustries] = useState<TransformIndustry[]>([]);
  const [loading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  function extractErrorMessage(errorArray: any) {
    if (Array.isArray(errorArray) && errorArray.length > 0) {
      return errorArray.join(", ");
    }
    return false;
  }

  const addSkill = () => {
    formik.setValues({
      ...formik.values,
      videoLink: [...formik.values.videoLink, ""],
    });
  };
  const removeSkill = (index: number) => {
    const updatedLink = [...formik.values.videoLink];
    updatedLink.splice(index, 1);
    formik.setValues({ ...formik.values, videoLink: updatedLink });
  };

  const handleSkillChange = (
    index: number,
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const updatedLink = [...formik.values.videoLink];
    updatedLink[index] = event.target.value;
    formik.setValues({ ...formik.values, videoLink: updatedLink });
  };
  const getAllCity = async () => {
    const data = await getCity();
    if (data.remote === "success") {
      setCity(data.data.data);
    }
  };
  const getAllIndustries = async () => {
    const data = await getIndustries();
    if (data.remote === "success") {
      setIndustries(data.data.data);
    }
  };

  const getEmployerDetailByID = async (id: string) => {
    setIsLoading(true);
    const response = await getEmployerById(id);
    if (response.remote === "success") {
      const newImage = response?.data?.data?.companyImages?.map(
        (item: { imageId: string; path: string }, index: number) => {
          return {
            name: item.path,
            uid: item.imageId,
            url: process.env.NEXT_PUBLIC_BACKEND_IMAGE_URL + item.path,
          };
        }
      );
      setFileList(newImage);
      formik.setFieldValue("industryName", response.data.data.industryName);
      formik.setFieldValue("contactPerson", response.data.data.contactPerson);
      formik.setFieldValue("jobTitle", response.data.data.jobTitle);
      formik.setFieldValue("companyName", response.data.data.companyName);
      formik.setFieldValue("email", response.data.data.email);
      formik.setFieldValue("website", response.data.data.website);
      formik.setFieldValue("phoneNo", response.data.data.phoneNo);
      formik.setFieldValue("address", response.data.data.address);
      formik.setFieldValue("zipCode", response.data.data.zipCode);
      formik.setFieldValue(
        "city",
        response.data.data.city ? response.data.data.city : ""
      );
      formik.setFieldValue("companyLogo", response.data.data.companyLogo?.filepath || null);
      formik.setFieldValue(
        "companyDescription",
        response.data.data.companyDescription
      );
      formik.setFieldValue("videoLink", response.data.data.videoLink);
    }
    setIsLoading(false);
  };
  useEffect(() => {
    getAllCity();
    getAllIndustries();
  }, []);
  useEffect(() => {
    // Get query parameters from the URL
    const urlSearchParams = new URLSearchParams(window.location.search);
    const employerId = urlSearchParams.get("id");
    const newEmployer = urlSearchParams.get("new");
    if (newEmployer) {
      setIsDisable(true);
    } else {
      setIsDisable(false);
    }
    if (employerId) {
      setId(employerId);
      getEmployerDetailByID(employerId);
    }
  }, []);
  useEffect(() => {
    if (error) {
      const timeoutId = setTimeout(() => {
        setError("");
      }, 5000); // 5000 milliseconds = 5 seconds

      // Clear the timeout if the component unmounts before the 5 seconds
      return () => clearTimeout(timeoutId);
    }
  }, [error]);

  return (
    <>
      {loading && (
        <Box
          sx={{
            position: "fixed",
            left: 0,
            top: 0,
            right: 0,
            bottom: 0,
            zIndex: 10,
          }}
        >
          <CustomLoader />
        </Box>
      )}

      {error && <ErrorAlert severity="error" message={error} />}
      <Title
        heading={"Add Employer"}
        icon={
          <IconButton
            onClick={() => route.push("/manage-employers")}
            disableRipple={true}
          >
            <SVG.ArrowBack />
          </IconButton>
        }
      />
      <Card sx={{ borderRadius: "10px" }} elevation={0}>
        <CardContent>
          <StyledManageForm>
            <Grid container spacing={2}>
              <Grid item xs={12} lg={2}>
                <label>Industry</label>
              </Grid>
              <Grid
                item
                xs={12}
                lg={10}
                sx={{
                  "& .MuiAutocomplete-root .MuiOutlinedInput-root .MuiAutocomplete-input":
                  {
                    padding: "0px",
                  },
                }}
              >
                <Autocomplete
                  disablePortal
                  disabled={disable}
                  disableClearable={true}
                  fullWidth
                  id="combo-box-demo"
                  value={formik.values.industryName}
                  options={industries?.map((item) => {
                    return { id: item.id, label: item.name };
                  })}
                  onChange={(e, value: any) => {
                    console.log({ value });
                    if (value) {
                      formik.values.industryName.id = value.id;
                      formik.values.industryName.label = value.label;
                    }
                  }}
                  renderInput={(params) => <TextField {...params} label="" />}
                />
                {formik.touched.industryName && formik.errors.industryName && (
                  <div style={{ color: "red" }}>
                    {formik.errors.industryName as string}
                  </div>
                )}
              </Grid>

              <Grid item xs={12} lg={2}>
                <label>Contact Person</label>
              </Grid>
              <Grid item xs={12} lg={10}>
                <TextField
                  placeholder="Name of contact person"
                  disabled={disable}
                  type="text"
                  fullWidth
                  name="contactPerson"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.contactPerson}
                />
                {formik.touched.contactPerson &&
                  formik.errors.contactPerson && (
                    <div style={{ color: "red" }}>
                      {formik.errors.contactPerson}
                    </div>
                  )}
              </Grid>

              <Grid item xs={12} lg={2}>
                <label>Job Title</label>
              </Grid>
              <Grid item xs={12} lg={10}>
                <TextField
                  placeholder="Title of Job"
                  disabled={disable}
                  type="text"
                  fullWidth
                  name="jobTitle"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.jobTitle}
                />
                {formik.touched.jobTitle && formik.errors.jobTitle && (
                  <div style={{ color: "red" }}>{formik.errors.jobTitle}</div>
                )}
              </Grid>

              <Grid item xs={12} lg={2}>
                <label>Company Name</label>
              </Grid>
              <Grid item xs={12} lg={10}>
                <TextField
                  placeholder="Organization Name or Company Name"
                  disabled={disable}
                  type="text"
                  fullWidth
                  name="companyName"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.companyName}
                />
                {formik.touched.companyName && formik.errors.companyName && (
                  <div style={{ color: "red" }}>
                    {formik.errors.companyName}
                  </div>
                )}
              </Grid>

              <Grid item xs={12} lg={2}>
                <label>Email</label>
              </Grid>
              <Grid item xs={12} lg={10}>
                <TextField
                  placeholder="example@example.com"
                  disabled={disable}
                  type="email"
                  fullWidth
                  sx={{
                    "& .MuiFormHelperText-root": {
                      marginLeft: "5px",
                      color: "#FFA500",
                      fontWeight: "500",
                    },
                  }}
                  name="email"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.email}
                />
                {formik.touched.email && formik.errors.email && (
                  <div style={{ color: "red" }}>{formik.errors.email}</div>
                )}
              </Grid>

              <Grid item xs={12} lg={2}>
                <label>Website</label>
              </Grid>
              <Grid item xs={12} lg={10}>
                <TextField
                  placeholder="e.g, www.domain.com"
                  disabled={disable}
                  type="text"
                  fullWidth
                  name="website"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.website}
                />
                {formik.touched.website && formik.errors.website && (
                  <div style={{ color: "red" }}>{formik.errors.website}</div>
                )}
              </Grid>

              <Grid item xs={12} lg={2}>
                <label>Phone No.</label>
              </Grid>
              <Grid item xs={12} lg={10}>
                <PhoneInput
                  regions={"europe"}
                  disabled={disable}
                  showDropdown={false}
                  placeholder="Enter phone number"
                  onChange={(value, countrydata, event) => {
                    console.log({ value });
                    const temp = value.slice(2);
                    formik.setFieldValue("phoneNo", temp);
                    event.target.value = "+49" + temp;
                  }}
                  countryCodeEditable={false}
                  onBlur={(e) => {
                    e.target.name = "phoneNo";
                    formik.handleBlur(e);
                  }}
                  value={id ? "+49" + formik.values.phoneNo : "+49"}
                  onlyCountries={["de"]} // Allow only Germany
                />
                {formik.touched.phoneNo && formik.errors.phoneNo && (
                  <div style={{ color: "red" }}>{formik.errors.phoneNo}</div>
                )}
              </Grid>

              <Grid item xs={12} lg={2}>
                <label>Address</label>
              </Grid>
              <Grid item xs={12} lg={10}>
                <TextField
                  placeholder=""
                  disabled={disable}
                  type="text"
                  fullWidth
                  name="address"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.address}
                />
                {formik.touched.address && formik.errors.address && (
                  <div style={{ color: "red" }}>{formik.errors.address}</div>
                )}
              </Grid>

              <Grid item xs={12} lg={2}>
                <label>Zip Code</label>
              </Grid>
              <Grid item xs={12} lg={4.67}>
                <TextField
                  placeholder="474010"
                  disabled={disable}
                  type="number"
                  fullWidth
                  name="zipCode"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.zipCode}
                />
                {formik.touched.zipCode && formik.errors.zipCode && (
                  <div style={{ color: "red" }}>{formik.errors.zipCode}</div>
                )}
              </Grid>

              <Grid item xs={12} lg="auto">
                <label>City</label>
              </Grid>
              <Grid
                item
                xs={12}
                lg={4.67}
                sx={{
                  "& .MuiAutocomplete-root .MuiOutlinedInput-root .MuiAutocomplete-input":
                  {
                    padding: "0px",
                  },
                }}
              >
                <Autocomplete
                  disablePortal
                  disableClearable={true}
                  disabled={disable}
                  fullWidth
                  id="combo-box-demo"
                  value={formik.values.city}
                  options={city?.map((item) => {
                    return { id: item.id, label: item.name };
                  })}
                  onChange={(e, value: any) => {
                    if (value) {
                      formik.setFieldValue("city", value);
                    }
                  }}
                  renderInput={(params) => <TextField {...params} label="" />}
                />
                {formik.touched.city && formik.errors.city && (
                  <div style={{ color: "red" }}>city is required</div>
                )}
              </Grid>

              <Grid item xs={12} lg={2}>
                <label>Company Logo</label>
              </Grid>
              <Grid item xs={12} lg={10}>
                <TextField
                  placeholder="576557"
                  disabled={disable}
                  type="file"
                  fullWidth
                  helperText="recommend size 250x250px"
                  name="companyLogo"
                  inputProps={{ accept: "image/*" }}
                  onChange={(e: any) => {
                    formik.setFieldValue(
                      "companyLogo",
                      e.target.files![0] || null
                    );
                  }}
                />
                {formik.touched.companyLogo && formik.errors.companyLogo && (
                  <div style={{ color: "red" }}>CompanyLogo is Required</div>
                )}

                {formik.values.companyLogo && (
                  <Box sx={{ mt: 2 }}>
                    <div style={{ marginBottom: "8px", fontSize: "14px", color: "#646464" }}>
                      Logo Preview
                    </div>
                    <img
                      src={
                        typeof formik.values.companyLogo === "string"
                          ? `${process.env.NEXT_PUBLIC_BACKEND_IMAGE_URL}${formik.values.companyLogo}`
                          : formik.values.companyLogo instanceof File
                            ? URL.createObjectURL(formik.values.companyLogo)
                            : ""
                      }
                      alt="Company Logo Preview"
                      style={{ 
                        maxWidth: "100px", 
                        maxHeight: "100px", 
                        borderRadius: "8px", 
                        objectFit: "contain",
                        border: "1px solid #e0e0e0",
                        padding: "4px"
                      }}
                    />
                  </Box>
                )}
              </Grid>

              <Grid item xs={12} lg={2} sx={{ minHeight: "160px" }}>
                <label>Company Description</label>
              </Grid>
              <Grid item xs={12} lg={10}>
                <Box
                  sx={{
                    "& textarea": {
                      width: "100%",
                      height: "136px",
                      resize: "none",
                      borderRadius: "10px",
                      border: "1px solid #646464",
                      fontSize: "16px",
                      fontFamily: "'Poppins', sans-serif",
                      padding: "8px 12px",
                      outline: "none",
                      fontWeight: "500",
                    },
                    "& .ql-container.ql-snow": {
                      height: "230px",
                    },
                  }}
                >
                  <TextEditor
                    disabled={disable}
                    content={`${formik.values.companyDescription}`}
                    setContent={(txt) => {
                      formik.setFieldValue("companyDescription", txt);
                    }}
                  />
                </Box>
                {formik.touched.companyDescription &&
                  formik.errors.companyDescription && (
                    <div style={{ color: "red" }}>
                      {formik.errors.companyDescription}
                    </div>
                  )}
              </Grid>
              <Grid item xs={12} lg={2} sx={{ minHeight: "160px" }}>
                <label>Company Images</label>
              </Grid>
              <Grid item xs={12} lg={10}>
                {" "}
                <Box
                  sx={{
                    "& textarea": {
                      width: "100%",
                      height: "136px",
                      resize: "none",
                      borderRadius: "10px",
                      border: "1px solid #646464",
                      fontSize: "16px",
                      fontFamily: "'Poppins', sans-serif",
                      padding: "8px 12px",
                      outline: "none",
                      fontWeight: "500",
                    },
                  }}
                >
                  {" "}
                  <Cropper
                    disabled={disable}
                    fileList={fileList}
                    setFileList={setFileList}
                    setOldFile={setOldFile}
                  />
                </Box>
              </Grid>
              <Grid item xs={12} lg={2}>
                <label>YouTube link</label>
              </Grid>
              <Grid item xs={12} lg={10}>
                {formik.values.videoLink.map((link, index) => (
                  <>
                    <TextField
                      disabled={disable}
                      placeholder="Embed youtube video link"
                      type="text"
                      fullWidth
                      name={`videoLink[${index}]`}
                      onChange={(event: any) => handleSkillChange(index, event)}
                      value={link}
                    />
                    {formik.errors.videoLink &&
                      formik.errors.videoLink[index] && (
                        <div style={{ color: "red" }}>
                          {formik.errors.videoLink[index]}
                        </div>
                      )}
                    {link ? (
                      <Box sx={{ my: 2 }}>
                        <iframe
                          title="Preview"
                          width="200"
                          height="110"
                          src={getYouTubeEmbedUrl(link)}
                        ></iframe>
                      </Box>
                    ) : (
                      ""
                    )}
                    <Button
                      size="small"
                      onClick={() => removeSkill(index)}
                      disabled={disable}
                      variant="outlined"
                      sx={{ marginRight: "15px" }}
                    >
                      remove
                    </Button>
                  </>
                ))}

                <Button
                  variant="contained"
                  size="small"
                  onClick={addSkill}
                  disabled={disable}
                >
                  Add
                </Button>
              </Grid>
              {/* ---------------video field----------------- */}

              <Grid item xs={12}>
                <Box sx={{ textAlign: "right" }}>
                  <Button
                    variant="outlined"
                    disabled={disable}
                    onClick={() => {
                      formik.handleSubmit();
                    }}
                    sx={{ fontSize: "24px", fontWeight: 700 }}
                  >
                    <SVG.Save style={{ marginRight: "15px" }} />{" "}
                    <span>Save</span>
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </StyledManageForm>
        </CardContent>
      </Card>
    </>
  );
};

export default AddComponent;
