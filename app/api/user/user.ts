import { request } from "../api";
import { ErrorResult, SuccessResult } from "../runtimeType";
import { CurrentUserResponseDto, UpdateProfileRequestDto } from "./user.type";

export async function getCurrentUser(): Promise<
  SuccessResult<CurrentUserResponseDto> | ErrorResult
> {
  const response = await request({
    url: "/user",
    method: "GET",
  });
  return response;
}
export async function updateProfile(data: UpdateProfileRequestDto) {
  const response = await request({
    url: "/user/update-profile", // Adjust the endpoint based on your API design
    method: "PUT", // You might use "PATCH" depending on your API
    data,
  });
  return response;
}
