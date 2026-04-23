import urlcat from "urlcat";
import { request } from "../api"; // Replace with the actual file path where the request function is defined
import { ErrorResult, SuccessResult } from "../runtimeType";
import { AccessTokensResponseDto } from "../models/AccessTokensResponse";
import { GetCount, LoginRequestDto, LoginResponseDto } from "./auth.types";

export async function refreshAccessToken(
  token: string
): Promise<SuccessResult<AccessTokensResponseDto> | ErrorResult> {
  const response = await request({
    url: "/auth/refresh-access-token",
    method: "post",
    data: { token },
  });

  return response;
}
export async function loginUser(
  loginRequest: LoginRequestDto
): Promise<SuccessResult<LoginResponseDto> | ErrorResult> {
  const response = await request({
    url: "/auth/login-user",
    method: "POST",
    data: loginRequest,
  });
  return response;
}
export async function getResetLink(email: string) {
  const response = await request({
    url: `/user/reset-link/${email}`,
    method: "get",
  });
  return response;
}
export async function resetPassword(
  password: string,
  token: string
): Promise<SuccessResult<LoginResponseDto> | ErrorResult> {
  const response = await request({
    url: `/user/reset-password/`,
    method: "put",
    data: { password, token },
  });
  return response;
}

export async function getDashBoardData(): Promise<
  SuccessResult<GetCount> | ErrorResult
> {
  const response = await request({
    url: `/user/dashboard/`,
    method: "get",
  });
  return response;
}
