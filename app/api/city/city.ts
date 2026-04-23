import { request } from "../api";
import { ErrorResult, SuccessResult } from "../runtimeType";
import {
  City,
  TransformCity,
  TransformCityForFilters,
  getAllCitiesType,
} from "./city.types";
import { transformCities } from "./helper";
import urlcat from "urlcat";
export const getCity = async (): Promise<
  SuccessResult<TransformCity[]> | ErrorResult
> => {
  const response = await request({
    url: "/cities/",
    method: "get",
  });
  if (response.remote === "success") {
    response.data.data = transformCities(response.data.data);
    return response;
  }
  return response;
};
export const getCitiesByFilter = async (
  payload: getAllCitiesType
): Promise<SuccessResult<TransformCityForFilters> | ErrorResult> => {
  const { searchValue, pageNo, recordPerPage } = payload;
  const url = urlcat("/cities/get_all_city", {
    searchValue,
    pageNo,
    recordPerPage,
  });

  const response = await request({
    url,
    method: "get",
  });
  if (response.remote === "success") {
    response.data.data.data = transformCities(response.data.data.result);
    response.data.data.data.count = response.data.data.data.count;
    return response;
  }

  return response;
};

export const addCity = async (
  data: City
): Promise<SuccessResult<TransformCity> | ErrorResult> => {
  const response = await request({
    url: "/cities/",
    method: "post",
    data,
  });
  return response;
};

export const editCity = async (
  payload: TransformCity
): Promise<SuccessResult<TransformCity> | ErrorResult> => {
  const response = await request({
    url: "/cities/",
    method: "put",
    data: payload,
  });
  return response;
};

export const editCityStatus = async (
  payload: {id:string, status:boolean}
): Promise<SuccessResult<TransformCity> | ErrorResult> => {
  const response = await request({
    url: "/cities/",
    method: "put",
    data: payload,
  });
  return response;
};

export const deleteCity = async (
  id: string
): Promise<SuccessResult<TransformCity> | ErrorResult> => {
  const response = await request({
    url: `/cities/${id}`,
    method: "delete",
  });
  return response;
};
