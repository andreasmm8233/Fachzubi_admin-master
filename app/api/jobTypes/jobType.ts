import { request } from "../api";
import { ErrorResult, SuccessResult } from "../runtimeType";
import { transformJobTypes } from "./helper"; // Import the appropriate helper function
import {
  TransformJobType,
  TransformJobTypeForFilters,
  getAllJobTypesType,
} from "./jobTypes.types";
import urlcat from "urlcat";

export const getJobTypes = async (): Promise<
  SuccessResult<TransformJobType[]> | ErrorResult
> => {
  const response = await request({
    url: "/job-type/",
    method: "get",
  });
  if (response.remote === "success") {
    response.data.data = transformJobTypes(response.data.data);
    return response;
  }
  return response;
};

export const getJobTypesByFilter = async (
  payload: getAllJobTypesType
): Promise<SuccessResult<TransformJobTypeForFilters> | ErrorResult> => {
  const { searchValue, pageNo, recordPerPage } = payload;
  const url = urlcat("/job-type/get_all_JobType", {
    searchValue,
    pageNo,
    recordPerPage,
  });

  const response = await request({
    url,
    method: "get",
  });
  if (response.remote === "success") {
    response.data.data.data = transformJobTypes(response.data.data.data);
    response.data.data.data.count = response.data.data.data.count;
    return response;
  }

  return response;
};

export const addJobType = async (
  name: string
): Promise<SuccessResult<TransformJobType> | ErrorResult> => {
  const response = await request({
    url: "/job-type/",
    method: "post",
    data: { name },
  });
  return response;
};

export const editJobType = async (
  payload: TransformJobType
): Promise<SuccessResult<TransformJobType> | ErrorResult> => {
  const response = await request({
    url: "/job-type/",
    method: "put",
    data: payload,
  });
  return response;
};

export const deleteJobType = async (
  id: string
): Promise<SuccessResult<TransformJobType> | ErrorResult> => {
  const response = await request({
    url: `/job-type/${id}`,
    method: "delete",
  });
  return response;
};

export const getJobTypeByName = async (
  jobTypeName: string
): Promise<SuccessResult<TransformJobType> | ErrorResult> => {
  const response = await request({
    url: `/job-type/find/${jobTypeName}`,
    method: "get",
  });

  if (response.remote === "success") {
    return response;
  }

  return response;
};
