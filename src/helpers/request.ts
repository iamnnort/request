import { stringify } from "qs";
import { BaseRequestConfig, RequestConfig } from "../index.types";
import { AxiosError, AxiosResponse } from "axios";
import { loggerHelper } from "./logger";

const makeUrl = (
  baseRequestConfig: BaseRequestConfig = {},
  requestConfig: RequestConfig = {}
) => {
  const urlParts = [
    baseRequestConfig.baseUrl,
    baseRequestConfig.url,
    requestConfig.baseUrl,
    requestConfig.url,
  ];

  const isSecureProtocol = urlParts.some((urlPart) =>
    urlPart?.includes("https")
  );
  const protocol = isSecureProtocol ? "https" : "http";

  const actualUrlParts = urlParts
    .filter((urlPart) => urlPart)
    .map((urlPart) => {
      return urlPart?.replace(/(^(https?:\/\/|\/))/, "");
    });

  const url = [`${protocol}:/`, ...actualUrlParts].join("/");

  return url;
};

const makeHeaders = (
  baseRequestConfig: BaseRequestConfig = {},
  requestConfig: RequestConfig = {}
) => {
  return {
    Accept: "application/json",
    "Content-Type": "application/json",
    ...baseRequestConfig.headers,
    ...requestConfig.headers,
  };
};

const makeSerializer = (baseRequestConfig: BaseRequestConfig = {}) => {
  return (params: any) => {
    return stringify(params, {
      arrayFormat: baseRequestConfig.serializer?.array,
    });
  };
};

const makeRequestConfig = (
  baseRequestConfig: BaseRequestConfig = {},
  requestConfig: RequestConfig = {}
) => {
  const config = {
    ...baseRequestConfig,
    ...requestConfig,
    url: makeUrl(baseRequestConfig, requestConfig),
    headers: makeHeaders(baseRequestConfig, requestConfig),
    paramsSerializer: makeSerializer(baseRequestConfig),
  };

  if (baseRequestConfig.logger) {
    loggerHelper.logRequest(config as any);
  }

  return config;
};

const makeSuccessHandler = <T>(baseRequestConfig: BaseRequestConfig = {}) => {
  return (response: AxiosResponse<T>) => {
    if (baseRequestConfig.logger) {
      loggerHelper.logResponse(response as any);
    }

    return response.data;
  };
};

const makeErrorHandler = (baseRequestConfig: BaseRequestConfig = {}) => {
  return (error: AxiosError) => {
    if (baseRequestConfig.debug) {
      console.log("Error:", error);
    }

    if (baseRequestConfig.logger) {
      loggerHelper.logRequestError(error as any);
    }

    throw error.response?.data || error.response || new Error(error.message);
  };
};

export const requestHelper = {
  makeUrl,
  makeHeaders,
  makeSerializer,
  makeRequestConfig,
  makeSuccessHandler,
  makeErrorHandler,
};