import { ErrorResult, SuccessResult } from "../runtimeType";
import { request } from "../api";
import {
  CreateEmployeePayload,
  Employee,
  UpdateEmployeePayload,
  transformEmployeeData,
} from "./helper";

export const getAllEmployees = async (): Promise<
  SuccessResult<any> | ErrorResult
> => {
  const response = await request({
    url: "/employees/",
    method: "GET",
  });

  if (response.remote === "success") {
    const employees = response.data.data;
    const transformedData = (Array.isArray(employees) ? employees : []).map(
      (employee: Employee) => transformEmployeeData(employee)
    );
    response.data.data = transformedData;
  }

  return response;
};

export const getEmployeeById = async (
  id: string
): Promise<SuccessResult<any> | ErrorResult> => {
  const response = await request({
    url: `/employees/${id}`,
    method: "GET",
  });

  return response;
};

export const createEmployee = async (
  payload: CreateEmployeePayload
): Promise<SuccessResult<any> | ErrorResult> => {
  const response = await request({
    url: "/employees/",
    method: "POST",
    data: payload,
  });

  return response;
};

export const updateEmployee = async (
  payload: UpdateEmployeePayload
): Promise<SuccessResult<any> | ErrorResult> => {
  const response = await request({
    url: "/employees/",
    method: "PUT",
    data: payload,
  });

  return response;
};

export const deleteEmployee = async (
  id: string
): Promise<SuccessResult<any> | ErrorResult> => {
  const response = await request({
    url: `/employees/${id}`,
    method: "DELETE",
  });

  return response;
};

export const getEmployeeEmployers = async (
  id: string
): Promise<SuccessResult<any> | ErrorResult> => {
  const response = await request({
    url: `/employees/${id}/employers`,
    method: "GET",
  });

  return response;
};

export const getEmployeeEmployerJobs = async (
  employeeId: string,
  employerId: string
): Promise<SuccessResult<any> | ErrorResult> => {
  const response = await request({
    url: `/employees/${employeeId}/employers/${employerId}/jobs`,
    method: "GET",
  });

  return response;
};
