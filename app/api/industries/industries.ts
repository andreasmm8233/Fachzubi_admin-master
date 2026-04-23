import { request } from "../api";
import { ErrorResult, SuccessResult } from "../runtimeType";
import { transformIndustries } from "./helper";
import {
  TransformIndustry,
  TransformIndustryForFilters,
  getAllIndustriesType,
} from "./industries.types";
import urlcat from "urlcat";
export const getIndustries = async (): Promise<
  SuccessResult<TransformIndustry[]> | ErrorResult
> => {
  const response = await request({
    url: "/industries/",
    method: "get",
  });
  if (response.remote === "success") {
    response.data.data = transformIndustries(response.data.data);
    return response;
  }
  return response;
};

export const getIndustriesByFilter = async (
  payload: getAllIndustriesType
): Promise<SuccessResult<TransformIndustryForFilters> | ErrorResult> => {
  const { searchValue, pageNo, recordPerPage } = payload;
  const url = urlcat("/industries/get_all_Industry", {
    searchValue,
    pageNo,
    recordPerPage,
  });

  const response = await request({
    url,
    method: "get",
  });
  if (response.remote === "success") {
    response.data.data.data = transformIndustries(response.data.data.data);
    response.data.data.data.count = response.data.data.data.count;
    return response;
  }

  return response;
};

export const addIndustry = async (
  name: string
): Promise<SuccessResult<TransformIndustry> | ErrorResult> => {
  const response = await request({
    url: "/industries/",
    method: "post",
    data: { name },
  });
  return response;
};

export const EditIndustry = async (
  payload: TransformIndustry
): Promise<SuccessResult<TransformIndustry> | ErrorResult> => {
  const response = await request({
    url: "/industries/",
    method: "put",
    data: payload,
  });
  return response;
};
export const deleteIndustry = async (
  id: string
): Promise<SuccessResult<TransformIndustry> | ErrorResult> => {
  const response = await request({
    url: `/industries/${id}`,
    method: "delete",
  });
  return response;
};
