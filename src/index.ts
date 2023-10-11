import axios, { AxiosError, AxiosResponse } from "axios";
import qs from "qs";
import { config } from "./config";
import { BaseRequestConfig, RequestConfig } from "./index.types";

export const request = (baseRequestConfig: BaseRequestConfig) => {
  return <T>(requestConfig: RequestConfig) => {
    const handleSuccess = (response: AxiosResponse<T>) => {
      return response.data;
    };

    const handleError = (error: AxiosError) => {
      throw error.response?.data || error.response || new Error(error.message);
    };

    const { serializer, ...axiosConfig } = baseRequestConfig;
    const axiosRequest = axios.create(axiosConfig);

    return axiosRequest({
      ...requestConfig,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        ...requestConfig.headers,
      },
      paramsSerializer: (params) => {
        return qs.stringify(params, {
          arrayFormat: serializer?.array,
        });
      },
    })
      .then(handleSuccess)
      .catch(handleError);
  };
};

export const methods = config.methods;
export const statuses = config.statuses;

export type { BaseRequestConfig, RequestConfig } from "./index.types";
