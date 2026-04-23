import { request } from "../api";
import { ErrorResult, SuccessResult } from "../runtimeType";
import { KeyData, Smtp } from "./admin.types";

export async function getSmtpSetting(): Promise<
  SuccessResult<Smtp> | ErrorResult
> {
  const response = await request({
    url: "/smtp", // Adjust the endpoint based on your backend route
    method: "get",
  });
  return response;
}
export async function updateSmtpSetting(
  smtpData: Smtp
): Promise<SuccessResult<Smtp> | ErrorResult> {
  const response = await request({
    url: "/smtp", // Adjust the endpoint based on your backend route
    method: "put", // You might use "patch" depending on your API
    data: smtpData,
  });
  return response;
}

export async function getManageKey(): Promise<
  SuccessResult<KeyData> | ErrorResult
> {
  const response = await request({
    url: "/manage_key", // Adjust the endpoint based on your backend route
    method: "get",
  });
  return response;
}

export async function updateManageKey(
  keyData: KeyData
): Promise<SuccessResult<KeyData> | ErrorResult> {
  const response = await request({
    url: "/manage_key",
    method: "put",
    data: keyData,
  });
  return response;
}
