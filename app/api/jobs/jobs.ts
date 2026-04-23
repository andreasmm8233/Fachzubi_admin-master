import {
  Companies,
  NewJob,
  NewJobResponse,
} from "@/app/(user)/manage-jobs/add/page";
import { request } from "../api";
import { ErrorResult, SuccessResult } from "../runtimeType";
import { transformJobsData } from "./helper";
import { Job, JobWithCount, UpdateJob, getAllJobsType } from "./jobs.types";
import urlcat from "urlcat";
// Function to get all employers
export const getAllJobs = async (
  payload: getAllJobsType
): Promise<SuccessResult<JobWithCount> | ErrorResult> => {
  const { searchValue, pageNo, filter, recordPerPage } = payload;
  const url = urlcat("/job/", {
    searchValue,
    pageNo,
    filter,
    recordPerPage,
  });
  const response = await request({
    url,
    method: "get",
  });
  if (response.remote === "success") {
    response.data.data.data = transformJobsData(response.data.data.jobs);
    response.data.data.data.count = response.data.data.count;
    return response;
  }
  return response;
};

export const updateJob = async (payload: UpdateJob | NewJob) => {
  const formData = new FormData();
  Object.entries({
    ...payload,
    company: payload.company?.id,
    industryName: payload.industryName?.id,
    city: payload.city?.id,
  }).forEach(([key, value]) => {
    if (!value && value !== false && key !== "startDate") {
      return;
    }
    if (Array.isArray(value)) {
      value.forEach((item) => {
        formData.append(`${key}`, item);
      });
    } else {
      formData.append(key, value);
    }
  });
  const response = await request({
    url: `/job/${payload.id}`,
    method: "put",
    data: formData,
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response;
};

export const deleteJOb = async (id: string) => {
  const response = await request({
    url: `/job/${id}`,
    method: "delete",
  });
  return response;
};
export const addJob = async (payload: NewJob) => {
  const formData = new FormData();
  Object.entries({
    ...payload,
    company: payload.company.id,
    industryName: payload.industryName.id,
    city: payload?.city?.id,
  }).forEach(([key, value]) => {
    if (!value && key !== "startDate") {
      return;
    }
    if (Array.isArray(value)) {
      value.forEach((item) => {
        formData.append(`${key}`, item);
      });
    } else {
      formData.append(key, value);
    }
  });
  const response = await request({
    url: "/job/",
    method: "post",
    data: formData,
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response;
};

export const getJobDetailById = async (
  id: string
): Promise<SuccessResult<NewJobResponse> | ErrorResult> => {
  const response = await request({
    url: `/job/${id}`,
    method: "get",
  });
  return response;
};
