import urlcat from "urlcat";
import { request } from "../api";
import { ErrorResult, SuccessResult } from "../runtimeType";

// An e-mail address signed up through the newsletter form on the website
export interface NewsletterSubscriber {
  _id: string;
  email: string;
  createdAt: string;
}

export interface NewsletterSubscriberList {
  subscribers: NewsletterSubscriber[];
  count: number; // number of pages
  total: number;
}

export const getNewsletterSubscribers = async (payload: {
  searchValue: string;
  pageNo: number;
  recordPerPage: string;
}): Promise<SuccessResult<NewsletterSubscriberList> | ErrorResult> => {
  return request({
    url: urlcat("/newsletter/", payload),
    method: "get",
  });
};

export const exportNewsletterSubscribers = async (): Promise<
  SuccessResult<{ subscribers: NewsletterSubscriber[] }> | ErrorResult
> => {
  return request({
    url: "/newsletter/export",
    method: "get",
  });
};

export const deleteNewsletterSubscriber = async (
  id: string
): Promise<SuccessResult<NewsletterSubscriber> | ErrorResult> => {
  return request({
    url: `/newsletter/${id}`,
    method: "delete",
  });
};
