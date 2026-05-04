import {
  Employer,
  EmployerFormType,
  EmployerWithIndustriesTypeAndId,
} from "./employer.types";
import { ErrorResult, SuccessResult } from "../runtimeType";
import { request } from "../api";
import {
  PartialUpdateEmployerType,
  TransformedRowDataWithCount,
  UpdateEmployerType,
  getAllEmployerType,
  transFormSignalApiData,
  transformApiData,
} from "./helper";
import urlcat from "urlcat";
import { Companies } from "@/app/(user)/manage-jobs/add/page";
export const getAllEmployers = async (
  payload: getAllEmployerType
): Promise<SuccessResult<TransformedRowDataWithCount> | ErrorResult> => {
  const { searchValue, pageNo, filter, recordPerPage } = payload;
  const url = urlcat("/employer/", {
    searchValue,
    pageNo,
    filter,
    recordPerPage,
  });

  const response = await request({
    url,
    method: "GET",
  });

  if (response.remote === "success") {
    const transformedData = response.data.data.employers.map(
      (employer: Employer) => transformApiData(employer)
    );
    response.data.data.data = transformedData;
    return response;
  } else {
    return response;
  }
};
export const editEmployer = async (
  payload: UpdateEmployerType | PartialUpdateEmployerType
): Promise<SuccessResult<UpdateEmployerType> | ErrorResult> => {
  const formData = new FormData();

  // Convert each field in payload to form data
  for (const key in payload) {
    if (payload.hasOwnProperty(key)) {
      // @ts-ignore
      formData.append(key, payload[key]);
    }
  }
  const response = await request({
    url: `/employer/${payload.id}`,
    method: "put",
    data: payload,
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response;
};
export const deleteEmployer = async (id: string) => {
  const url = urlcat("/employer/", {
    id,
  });
  const response = await request({
    url,
    method: "delete",
  });
  return response;
};
export const addEmployer = async (
  payload: EmployerWithIndustriesTypeAndId | EmployerFormType
): Promise<SuccessResult<EmployerFormType> | ErrorResult> => {
  const formData = new FormData();

  // Convert each field in payload to form data
  for (const key in payload) {
    if (payload.hasOwnProperty(key)) {
      // @ts-ignore
      if (!payload[key]) {
        // @ts-ignore
        delete payload[key];
      }
      // @ts-ignore
      formData.append(key, payload[key]);
    }
  }
  const response = await request({
    url: "/employer/",
    method: "post",
    data: {
      ...payload,
      videoLink: JSON.stringify(payload.videoLink),
      industryName: payload?.industryName?.id,
      city: payload.city.id,
    },
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response;
};
export const getEmployerById = async (
  id: string
): Promise<SuccessResult<EmployerWithIndustriesTypeAndId> | ErrorResult> => {
  const response = await request({
    url: `/employer/${id}`,
    method: "get",
  });
  if (response.remote === "success") {
    response.data.data = {
      ...transFormSignalApiData(response.data.data.data),
      companyImages: response?.data?.data?.images,
    };
    // response.data.data.companyImages = response?.data?.data?.images;
  }
  return response;
};

export const updateEmployerById = async (
  id: string,
  updatedData: EmployerFormType | EmployerWithIndustriesTypeAndId
): Promise<SuccessResult<EmployerWithIndustriesTypeAndId> | ErrorResult> => {
  const formData = new FormData();

  Object.entries({
    ...updatedData,
    industryName: updatedData.industryName.id,
    city: updatedData.city.id,
  }).forEach(([key, value]) => {
    if (!value) {
      return;
    }
    // @ts-ignore

    if (Array.isArray(value)) {
      value.forEach((item) => {
        formData.append(`${key}`, item);
      });
    } else {
      formData.append(key, value);
    }
  });
  const response = await request({
    url: `/employer/${id}`,
    method: "put",
    data: formData,
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response;
};

export const getCompaniesByCityIdApi = async (
  id: string[]
): Promise<SuccessResult<Companies[]> | ErrorResult> => {
  const response = await request({
    url: `/employer/get-employer-by-city-id/${id}`,
    method: "get",
  });
  return response;
};

export const getAllPublicEmployers = async (
  payload: getAllEmployerType
): Promise<SuccessResult<any> | ErrorResult> => {
  const { searchValue, pageNo, filter, recordPerPage, letter } = payload;
  const queryParams: any = {};
  if (searchValue) queryParams.searchValue = searchValue;
  if (pageNo) queryParams.pageNo = pageNo;
  if (filter) queryParams.filter = filter;
  if (recordPerPage) queryParams.recordPerPage = recordPerPage;
  if (letter) queryParams.letter = letter;

  const url = urlcat("/employer/get-all-emp-frontend", queryParams);

  const response = await request({
    url,
    method: "GET",
  });

  return response;
};

export const getPublicCompanyDetail = async (
  companyId: string
): Promise<SuccessResult<any> | ErrorResult> => {
  const response = await request({
    url: `/employer/company-Detail/${companyId}`,
    method: "GET",
  });
  return response;
};
