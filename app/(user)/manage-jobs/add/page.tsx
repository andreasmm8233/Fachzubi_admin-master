"use client";
import React, { useState, useEffect, ChangeEvent } from "react";
import {
  Autocomplete,
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  IconButton,
  List,
  ListItem,
  TextField,
  Tooltip,
} from "@mui/material";
import { SVG } from "@/app/components/icon";
import Title from "@/app/components/title.components";
import { useRouter } from "next/navigation";
import { StyledManageForm } from "@/app/components/form.styled";
import { getCity } from "@/app/api/city/city";
import { getIndustries } from "@/app/api/industries/industries";
import { TransformIndustry } from "@/app/api/industries/industries.types";
import { TransformCity } from "@/app/api/city/city.types";
import { addJob, getJobDetailById, updateJob } from "@/app/api/jobs/jobs";
import ErrorAlert from "@/themes/overrides/errorAlert";
import CustomLoader from "@/app/components/SpinLoader";
import * as Yup from "yup";
import { useFormik } from "formik";
import TextEditor from "../../manage-content/textEditor/textEditor";
import CloseIcon from "@mui/icons-material/Close";
import FileCopyIcon from "@mui/icons-material/FileCopy";
import {
  getCompaniesByCityIdApi,
  getEmployerById,
} from "@/app/api/employer/employer";
import Cropper, { FileState } from "@/app/ulits/cropper";
import { getJobTypes } from "@/app/api/jobTypes/jobType";
import { TransformJobType } from "@/app/api/jobTypes/jobTypes.types";
export interface NewJob {
  city?: { id: string; label: string };
  company: { id: string; label: string };
  jobTitle: string;
  startDate: string | null;
  email: string;
  additionalEmail: string;
  address: string;
  zipCode: string;
  jobDescription: string;
  attachments?: any;
  status?: boolean;
  industryName: { id: string; label: string };
  id?: string;
  newCity?: string[];
  videoLink?: string[];
  jobsImages?: any;
  removedFile?: any;
  jobType?: any;
}

export interface NewJobResponse {
  city?: { _id: string; name: string };
  cityDetail?: { _id: string; name: string }[];
  company: { _id: string; companyName: string };
  jobTitle: string;
  startDate: string | null;
  email: string;
  additionalEmail: string;
  address: string;
  zipCode: string;
  jobDescription: string;
  attachments?: any;
  status: boolean;
  industryName: { _id: string; industryName: string };
  id?: string;
  videoLink?: string[];
  jobImages?: any;
  jobType?: string | any;
}

export interface Companies {
  _id: string;
  companyName: string;
}

type Documents = {
  _id: string;
  document: {
    _id: string;
    type: string;
    fileName: string;
    filepath: string;
  };
  __v: number;
};
const re =
  /^((ftp|http|https):\/\/)?(www.)?(?!.*(ftp|http|https|www.))[a-zA-Z0-9_-]+(\.[a-zA-Z]+)+((\/)[\w#]+)*(\/\w+\?[a-zA-Z0-9_]+=\w+(&[a-zA-Z0-9_]+=\w+)*)?$/gm;
const AddComponent: React.FC = () => {
  const route = useRouter();
  const [city, setCity] = useState<TransformCity[]>([]);
  const [companies, setCompanies] = useState<Companies[]>([]);
  const [industries, setIndustries] = useState<TransformIndustry[]>([]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [jobId, setJobId] = useState("");
  const [attachments, setAttachments] = useState<File[]>([]);
  const [action, setAction] = useState<string | boolean>("");
  const [documents, setDocuments] = useState<Documents[]>([]);
  const [deletedDocumentId, setDeletedDocumentId] = useState<string[]>([]);
  const [isCitySet, setIsCitySet] = useState(false);
  const [fileList, setFileList] = useState<FileState[]>([]);
  const [oldFile, setOldFile] = useState<string[]>([]);
  const [jobTypes, setJobTypes] = useState<TransformJobType[]>([]);

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
    videoLink: Yup.array().of(Yup.string().matches(re, "URL is not valid")),
    company: Yup.object().test(
      "isCompany",
      "company name is required",
      (value: any) => {
        if (value.id && value.label) {
          return true;
        }
        return false;
      }
    ),
    jobTitle: Yup.string().required("title is required"),
    email: Yup.string()
      .email("Invalid email address")
      .required("email is required"),
    additionalEmail: Yup.string().email("Invalid email address"),
    address: Yup.string().required("address is required"),
    zipCode: Yup.number().required("zip code is required"),
    jobType: Yup.string().required("jobType is required"),
    jobDescription: Yup.string()
      .min(1, "company Description is required")
      .required("company Description is required"),
    industryName: Yup.object().test(
      "isIndustry",
      "industry name is required",
      (value: any) => {
        if (value.id && value.label) {
          return true;
        }
        return false;
      }
    ),
    newCity: Yup.array().test("newCity", "city is required", (value: any) => {
      if (value.length) {
        return true;
      }
      return false;
    }),
  });
  const formik = useFormik<NewJob>({
    initialValues: {
      newCity: [],
      company: { id: "", label: "Select Company" },
      jobTitle: "",
      startDate: "",
      email: "",
      additionalEmail: "",
      address: "",
      zipCode: "",
      jobDescription: "",
      industryName: { id: "", label: "Select Industry" },
      videoLink: [],
      jobType: "",
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      setIsLoading(true);
      values.jobsImages = fileList.map((item: any) => {
        return item.originFileObj;
      });
      values.removedFile = oldFile.filter((item) => {
        if (item !== "undefined" || item !== undefined) {
          return item;
        }
      });
      values.jobType = values.jobType;
      try {
        if (jobId && !action) {
          const response = await updateJob({
            ...values,
            id: jobId,
            attachments,
            deletedAttachment: deletedDocumentId,
          });
          if (response.remote === "success") {
            route.push("/manage-jobs");
          } else {
            setError("Something went wrong");
          }
          setIsLoading(false);
        } else {
          const response = await addJob({
            ...values,
            attachments,
          });
          if (response.remote === "success") {
            route.push("/manage-jobs");
          }
          setIsLoading(false);
        }
      } catch (error) {
        setIsLoading(false);
      }
    },
  });

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

  const deleteDocumentHandler = async (id: string) => {
    setDeletedDocumentId([...deletedDocumentId, id]);
    setDocuments(documents.filter((data) => id !== data._id));
  };
  const getJobByIdHandler = async (id: string) => {
    setIsLoading(true);
    const response = await getJobDetailById(id);
    if (response.remote === "success") {
      const newImage = response?.data?.data?.jobImages?.map(
        (item: { _id: string; filepath: string }, index: number) => {
          return {
            name: item.filepath,
            uid: item._id,
            url: process.env.NEXT_PUBLIC_BACKEND_IMAGE_URL + item.filepath,
          };
        }
      );
      setFileList(newImage);
      if (response?.data?.data?.jobType) {
        formik.setFieldValue("jobType", response?.data?.data?.jobType);
      }
      const date = response?.data?.data?.startDate?.split("T")[0];
      const industryValue = response.data.data.industryName;

      if (response.data.data.videoLink) {
        formik.setFieldValue("videoLink", response.data.data.videoLink);
      }
      formik.setFieldValue(
        "newCity",
        response.data.data.cityDetail?.map((item) => {
          return item?._id;
        })
      );

      formik.setFieldValue("company", {
        id: response.data.data.company._id,
        label: response.data.data.company.companyName || "",
      });
      formik.setFieldValue("jobTitle", response.data.data.jobTitle);
      formik.setFieldValue("startDate", date);
      formik.setFieldValue(
        "additionalEmail",
        response.data.data.additionalEmail
      );
      formik.setFieldValue("email", response.data.data.email);
      formik.setFieldValue("address", response.data.data.address);
      formik.setFieldValue("zipCode", response.data.data.zipCode);
      formik.setFieldValue("jobDescription", response.data.data.jobDescription);
      formik.setFieldValue("industryName", {
        id: industryValue._id,
        label: industryValue.industryName || "",
      });
      setDocuments(response.data.data.attachments);
    }
    setIsLoading(false);
  };
  const handleSkillChange = (
    index: number,
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (formik.values.videoLink) {
      const updatedLink = [...formik.values.videoLink];
      updatedLink[index] = event.target.value;
      formik.setValues({ ...formik.values, videoLink: updatedLink });
    }
  };
  const removeSkill = (index: number) => {
    if (formik.values.videoLink) {
      const updatedLink = [...formik.values.videoLink];
      updatedLink.splice(index, 1);
      formik.setValues({ ...formik.values, videoLink: updatedLink });
    }
  };
  const addSkill = () => {
    if (formik.values.videoLink) {
      formik.setValues({
        ...formik.values,
        videoLink: [...formik.values.videoLink, ""],
      });
    }
  };
  const getAllJobTypes = async () => {
    const data = await getJobTypes();
    if (data.remote === "success") {
      setJobTypes(data.data.data);
    }
  };
  useEffect(() => {
    getAllIndustries();
    getAllCity();
    getAllJobTypes();
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
  useEffect(() => {
    const urlSearchParams = new URLSearchParams(window.location.search);
    const id = urlSearchParams.get("id");
    const action = urlSearchParams.get("action");
    if (id) {
      setJobId(id);
      getJobByIdHandler(id);
    }
    if (action) {
      setAction(action);
    }
  }, []);
  const getCompaniesByCityId = async (id: string[]) => {
    const response = await getCompaniesByCityIdApi(id);
    if (response.remote === "success") {
      setCompanies(response.data.data);
    }
  };

  const getCompaniesDetailed = async (id: string) => {
    setIsLoading(true);
    const response = await getEmployerById(id);
    if (response.remote === "success") {
      formik.setFieldValue("email", response.data.data.email);
      formik.setFieldValue("industryName", response.data.data.industryName);
      formik.setFieldValue("address", response.data.data.address);
      formik.setFieldValue("zipCode", response.data.data.zipCode);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    getCompaniesDetailed(formik.values.company.id);
  }, [isCitySet]);

  return (
    <>
      <Title
        heading={action === "show" ? "Job" : "Add Job"}
        icon={
          <IconButton
            onClick={() => route.push("/manage-jobs")}
            disableRipple={true}
          >
            <SVG.ArrowBack />
          </IconButton>
        }
      />
      <div style={{ pointerEvents: action === "show" ? "none" : "auto" }}>
        {isLoading && (
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

        <Card sx={{ borderRadius: "10px" }} elevation={0}>
          <CardContent>
            <StyledManageForm>
              <Grid container spacing={2}>
                <Grid item xs={12} lg={2}>
                  <label>City</label>
                </Grid>
                <Grid item xs={12} lg={10}>
                  {/* start------ */}
                  <Autocomplete
                    multiple
                    disablePortal={true}
                    disableClearable={true}
                    fullWidth
                    id="combo-box-demo"
                    value={formik.values.newCity?.map((value) => {
                      const newLocation = city.find((city) => {
                        return city.id === value;
                      });
                      return {
                        label: newLocation?.name || "",
                        id: newLocation?.id || value,
                      };
                    })}
                    onChange={(e, values) => {
                      const selectedCities = values.map(
                        (item) => item.id || ""
                      );
                      const filteredCities = selectedCities.filter(
                        (city, index, self) => {
                          return (
                            self.indexOf(city) === index &&
                            self.lastIndexOf(city) === index
                          );
                        }
                      );
                      if (filteredCities.length) {
                        getCompaniesByCityId(filteredCities);
                        formik.setFieldValue("newCity", filteredCities);
                        formik.setFieldValue("company", { id: "", label: "" });
                      } else {
                        formik.resetForm();
                      }
                    }}
                    options={city?.map((item) => {
                      return { id: item.id, label: item.name };
                    })}
                    renderInput={(params) => (
                      <TextField {...params} placeholder="Select City" />
                    )}
                  />
                  {formik.touched.newCity && formik.errors.newCity && (
                    <div style={{ color: "red" }}>
                      {formik.errors.newCity as string}
                    </div>
                  )}
                  {/* end------ */}
                </Grid>
                <Grid item xs={12} lg={2}>
                  <label>Company</label>
                </Grid>
                <Grid item xs={12} lg={10}>
                  <Autocomplete
                    disablePortal={true}
                    disableClearable={true}
                    fullWidth
                    id="combo-box-demo"
                    value={formik.values.company}
                    options={companies?.map((item) => {
                      return { id: item._id, label: item.companyName };
                    })}
                    onChange={(e, value: any) => {
                      if (value) {
                        formik.setFieldValue("company", value);
                        setIsCitySet(!isCitySet);
                      }
                    }}
                    renderInput={(params) => <TextField {...params} label="" />}
                  />
                  {formik.touched.company && formik.errors.company && (
                    <div style={{ color: "red" }}>
                      {formik.errors.company as string}
                    </div>
                  )}
                </Grid>
                <Grid item xs={12} lg={2}>
                  <label>Industries</label>
                </Grid>
                <Grid item xs={12} lg={10}>
                  <Autocomplete
                    disablePortal
                    fullWidth
                    disableClearable={true}
                    id="combo-box-demo"
                    value={formik.values.industryName}
                    options={industries?.map((item) => {
                      return { id: item.id, label: item.name };
                    })}
                    onChange={(e, value: any) => {
                      if (value) {
                        formik.values.industryName.id = value.id;
                        formik.values.industryName.label = value.label;
                      }
                    }}
                    renderInput={(params) => <TextField {...params} label="" />}
                  />
                  {formik.touched.industryName &&
                    formik.errors.industryName && (
                      <div style={{ color: "red" }}>
                        {formik.errors.industryName as string}
                      </div>
                    )}
                </Grid>

                <Grid item xs={12} lg={2}>
                  <label>Job Title</label>
                </Grid>
                <Grid item xs={12} lg={10}>
                  <TextField
                    placeholder="Project Manager"
                    type="text"
                    fullWidth
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.jobTitle}
                    name="jobTitle"
                  />
                  {formik.touched.jobTitle && formik.errors.jobTitle && (
                    <div style={{ color: "red" }}>{formik.errors.jobTitle}</div>
                  )}
                </Grid>
                <Grid item xs={12} lg={2}>
                  <label>Starting Date</label>
                </Grid>
                <Grid item xs={12} lg={10}>
                  <TextField
                    type="date"
                    fullWidth
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.startDate}
                    name="startDate"
                    InputProps={{
                      endAdornment: formik.values.startDate && (
                        <IconButton
                          aria-label="clear start date"
                          onClick={() => formik.setFieldValue("startDate", "")}
                        >
                          X
                        </IconButton>
                      ),
                    }}
                  />
                  {formik.touched.startDate && formik.errors.startDate && (
                    <div style={{ color: "red" }}>
                      {formik.errors.startDate}
                    </div>
                  )}
                </Grid>
                <Grid item xs={12} lg={2}>
                  <label>Email Id</label>
                </Grid>
                <Grid item xs={12} lg={10}>
                  <TextField
                    placeholder="Example@xyz.com"
                    type="email"
                    fullWidth
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.email}
                    name="email"
                  />
                  {formik.touched.email && formik.errors.email && (
                    <div style={{ color: "red" }}>{formik.errors.email}</div>
                  )}
                </Grid>
                <Grid item xs={12} lg={2}>
                  <label>Additional Email</label>
                </Grid>
                <Grid item xs={10}>
                  <TextField
                    placeholder="Example@xyz.com"
                    type="text"
                    fullWidth
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.additionalEmail}
                    name="additionalEmail"
                    sx={{
                      "& .MuiFormHelperText-root": {
                        marginLeft: "5px",
                        color: "#FFA500",
                        fontWeight: "500",
                      },
                    }}
                  />
                  {formik.touched.additionalEmail &&
                    formik.errors.additionalEmail && (
                      <div style={{ color: "red" }}>
                        {formik.errors.additionalEmail}
                      </div>
                    )}
                </Grid>
                <Grid item xs={12} lg={2}>
                  <label>Address</label>
                </Grid>
                <Grid item xs={10}>
                  <TextField
                    placeholder=""
                    type="text"
                    fullWidth
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.address}
                    name="address"
                  />
                  {formik.touched.address && formik.errors.address && (
                    <div style={{ color: "red" }}>{formik.errors.address}</div>
                  )}
                </Grid>
                <Grid item xs={12} lg={2}>
                  <label>Zip Code</label>
                </Grid>
                <Grid item xs={12} lg={10}>
                  <TextField
                    placeholder=""
                    type="number"
                    inputProps={{ maxLength: 8 }}
                    fullWidth
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.zipCode}
                    name="zipCode"
                  />
                  {formik.errors.zipCode ? (
                    <div style={{ color: "red" }}>{formik.errors.zipCode}</div>
                  ) : null}
                </Grid>
                <Grid item xs={12} lg={2}>
                  <label>Job Description</label>
                </Grid>
                <Grid item xs={12} lg={10}>
                  <Box
                    sx={{
                      "& textarea": {
                        width: "100%",
                        height: "80px",
                        resize: "none",
                        borderRadius: "10px",
                        border: "1px solid #646464",
                        fontSize: "16px",
                        fontFamily: "'Poppins', sans-serif",
                        padding: "8px 12px",
                        outline: "none",
                        minHeight: "136px",
                      },
                      "& .ql-container.ql-snow": {
                        height: "230px",
                      },
                    }}
                  >
                    <TextEditor
                      content={`${formik.values.jobDescription}`}
                      disabled={action === "show" ? true : false}
                      setContent={(txt) => {
                        formik.setFieldValue("jobDescription", txt);
                      }}
                    />
                  </Box>
                  {formik.touched.jobDescription &&
                    formik.errors.jobDescription && (
                      <div style={{ color: "red" }}>
                        {formik.errors.jobDescription}
                      </div>
                    )}
                </Grid>
                <Grid item xs={12} lg={2}>
                  <label>Attachments</label>
                </Grid>
                <Grid item xs={12} lg={10}>
                  <TextField
                    placeholder="select files"
                    type="file"
                    fullWidth
                    onChange={(e: ChangeEvent<HTMLInputElement>) => {
                      if (e.target.files) {
                        const files = Array.from(e.target.files);
                        setAttachments(files);
                      }
                    }}
                    inputProps={{ multiple: true, accept: ".pdf,.doc,.docx" }}
                  />
                  <List
                    component={"ul"}
                    sx={{ display: "flex", alignItems: "center" }}
                  >
                    {documents.map((document: Documents, index: number) => {
                      return (
                        <Tooltip
                          title={document.document.fileName}
                          key={document._id}
                        >
                          <ListItem
                            sx={{
                              mr: 1,
                              border: "1px solid #0096A4",
                              color: "#0096A4",
                              borderRadius: "5px",
                            }}
                            key={document._id}
                            secondaryAction={
                              <IconButton
                                edge="end"
                                aria-label="delete"
                                onClick={() =>
                                  deleteDocumentHandler(document._id)
                                }
                                sx={{ color: "#0096A4" }}
                              >
                                <CloseIcon />
                              </IconButton>
                            }
                          >
                            <a
                              href="/"
                              target="_blank"
                              style={{ display: "flex", alignItems: "center" }}
                            >
                              <FileCopyIcon sx={{ mr: 1 }} />{" "}
                              <span>
                                {document.document.fileName.length > 10
                                  ? document.document.fileName.slice(0, 10)
                                  : document.document.fileName}
                              </span>
                            </a>
                          </ListItem>
                        </Tooltip>
                      );
                    })}
                  </List>
                </Grid>

                <Grid item xs={12} lg={2}>
                  <label>YouTube link</label>
                </Grid>
                <Grid item xs={10}>
                  {formik.values.videoLink?.map(
                    (link: string, index: number) => (
                      <>
                        <TextField
                          placeholder="Embed youtube video link"
                          type="text"
                          fullWidth
                          name={`videoLink[${index}]`}
                          onChange={(event: any) =>
                            handleSkillChange(index, event)
                          }
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
                          variant="outlined"
                          sx={{ marginRight: "15px" }}
                        >
                          remove
                        </Button>
                      </>
                    )
                  )}

                  <Button variant="contained" size="small" onClick={addSkill}>
                    Add
                  </Button>
                </Grid>
                <Grid item xs={2} sx={{ minHeight: "160px" }}>
                  <label>Job Images</label>
                </Grid>
                <Grid item xs={10}>
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
                      disabled={false}
                      fileList={fileList}
                      setFileList={setFileList}
                      setOldFile={setOldFile}
                    />
                  </Box>
                </Grid>

                {/* strat */}

                <Grid item xs={12} lg={2}>
                  <label>Type of job</label>
                </Grid>
                <Grid item xs={12} lg={10}>
                  <Autocomplete
                    disablePortal
                    fullWidth
                    disableClearable={true}
                    id="combo-box-demo"
                    value={
                      jobTypes.find((item) => item.id === formik.values.jobType)
                        ? {
                            id: formik.values.jobType,
                            label:
                              jobTypes.find(
                                (item) => item.id === formik.values.jobType
                              )?.name || "",
                          }
                        : { id: "", label: "" }
                    }
                    onChange={(event, value) => {
                      formik.setFieldValue("jobType", value.id);
                    }}
                    options={jobTypes?.map((item) => {
                      return { id: item.id, label: item.name };
                    })}
                    renderInput={(params) => (
                      <TextField {...params} placeholder="Type of Job" />
                    )}
                  />
                  {formik.touched.jobType && formik.errors.jobType && (
                    <div style={{ color: "red" }}>
                      {formik.errors.jobType as string}
                    </div>
                  )}
                </Grid>

                {/* end */}

                <Grid item xs={12}>
                  <Box sx={{ textAlign: "right" }}>
                    <Button
                      variant="outlined"
                      onClick={() => {
                        formik.handleSubmit();
                      }}
                      disabled={action === "show" ? true : false}
                    >
                      <SVG.Save style={{ marginRight: "10px" }} /> Save
                    </Button>
                  </Box>
                </Grid>
              </Grid>
            </StyledManageForm>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default AddComponent;
