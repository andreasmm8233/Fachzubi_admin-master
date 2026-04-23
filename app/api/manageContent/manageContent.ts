import { request } from "../api";
import { ErrorResult, SuccessResult } from "../runtimeType";
import {
  ManageContentEditTypes,
  ManageContentTypes,
} from "./manageContent.Types";

export const getAllContents = async (): Promise<
  SuccessResult<ManageContentTypes> | ErrorResult
> => {
  const response = await request({
    url: "/manage_content/",
    method: "get",
  });
  return response;
};

export const EditContents = async (
  payload: ManageContentEditTypes
): Promise<SuccessResult<ManageContentEditTypes> | ErrorResult> => {
  const response = await request({
    url: "/manage_content/",
    method: "put",
    data: payload,
  });
  return response;
};
