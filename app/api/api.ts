import axios, { AxiosError, AxiosRequestConfig } from "axios";
import urlcat from "urlcat";
import { ErrorResult, SuccessResult } from "./runtimeType";

// Check for required environment variable
if (process.env.NEXT_PUBLIC_API_BASE_URL === undefined) {
  throw new Error("NEXT_PUBLIC_API_BASE_URL is not set");
}

export function exists(json: any, key: string) {
  const value = json[key];
  return value !== undefined;
}

function createAxiosInstance(baseUrl: string) {
  return axios.create({
    baseURL: urlcat(baseUrl, "/api/v1"),
    headers: {
      "Content-Type": "application/json",
    },
  });
}

export async function request(
  config: AxiosRequestConfig
): Promise<SuccessResult<any> | ErrorResult> {
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "";
  const axiosInstance = createAxiosInstance(baseUrl);

  try {
    if (!config.headers) {
      config.headers = {};
    }
    if (!config.headers["Content-Type"]) {
      config.headers["Content-Type"] = "application/json";
    }
    if (tokenStore.getRequestHeaderToken()) {
      config.headers[
        "Authorization"
      ] = `Bearer ${tokenStore.getRequestHeaderToken()}`;
    }

    const response = await axiosInstance.request({ ...config });
    return {
      remote: "success",
      data: response.data,
    };
  } catch (error: any) {
    if (error.response) {
      const axiosError = error as AxiosError | any;
      let errorMessage =
        axiosError.response?.data?.message || "Something went wrong";
      let errorCode = axiosError.response?.status;
      let errorData = axiosError.response?.data?.data || null;

      return {
        remote: "failure",
        error: {
          status: errorCode,
          errors: {
            message: errorMessage,
            data: errorData,
          },
        },
      };
    }
    throw error;
  }
}

class TokenStore {
  nativeToken: null | string = null;

  getRequestHeaderToken = (tokenOverride?: string) =>
    tokenOverride
      ? tokenOverride
      : process.env.IS_REACT_NATIVE
      ? this.nativeToken
      : typeof window !== "undefined"
      ? window.localStorage.getItem("x-access")
      : undefined;
}

export const tokenStore = new TokenStore();
export function BaseAPI() {
  throw new Error("Function not implemented.");
}
