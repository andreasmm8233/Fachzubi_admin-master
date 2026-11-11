import urlcat from "urlcat";
import { request } from "../api";
import { ErrorResult, SuccessResult } from "../runtimeType";

// A message sent through the contact form on the website (/kontakt)
export interface ContactQuery {
  _id: string;
  companyName: string;
  email: string;
  phoneNo: string;
  description?: string;
  createdAt: string;
}

export interface ContactQueryList {
  queries: ContactQuery[];
  count: number; // number of pages
  total: number;
}

export const getContactQueries = async (payload: {
  searchValue: string;
  pageNo: number;
  recordPerPage: string;
}): Promise<SuccessResult<ContactQueryList> | ErrorResult> => {
  return request({
    url: urlcat("/contact/", payload),
    method: "get",
  });
};

export const deleteContactQuery = async (
  id: string
): Promise<SuccessResult<ContactQuery> | ErrorResult> => {
  return request({
    url: `/contact/${id}`,
    method: "delete",
  });
};
