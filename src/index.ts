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

    const getConfig = (): RequestConfig => {
      const urlParts = [];

      if (baseRequestConfig.baseURL) {
        urlParts.push(baseRequestConfig.baseURL);
      }

      if (baseRequestConfig.url) {
        urlParts.push(baseRequestConfig.url);
      }

      if (requestConfig.baseURL) {
        urlParts.push(requestConfig.baseURL);
      }

      if (requestConfig.url) {
        urlParts.push(requestConfig.url);
      }

      const url = urlParts.join("/").replace("//", "/");

      return {
        ...baseRequestConfig,
        ...requestConfig,
        baseURL: "",
        url,
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          ...baseRequestConfig.headers,
          ...requestConfig.headers,
        },
        paramsSerializer: (params) => {
          return qs.stringify(params, {
            arrayFormat: baseRequestConfig.serializer?.array,
          });
        },
      };
    };

    return axios.request(getConfig()).then(handleSuccess).catch(handleError);
  };
};

export const makeDataSource = <T, SP, SR, C, U>(
  baseRequestConfig: BaseRequestConfig
) => {
  const dataSourceRequest = request(baseRequestConfig);

  abstract class DataSource {
    public static url: string;

    public static async search(request: SP = {} as SP) {
      return dataSourceRequest<SR>({
        method: methods.GET,
        ...request,
      });
    }

    public static async get(id: any, request: SP = {} as SP) {
      return dataSourceRequest<T>({
        method: methods.GET,
        url: `/${id}`,
        ...request,
      });
    }

    public static async create(request: C = {} as C) {
      return dataSourceRequest<T>({
        method: methods.POST,
        ...request,
      });
    }

    public static async bulkCreate(request: C = {} as C) {
      return dataSourceRequest<T>({
        method: methods.POST,
        url: "/bulk",
        ...request,
      });
    }

    public static async update(id: any, request: U = {} as U) {
      return dataSourceRequest<T>({
        method: methods.PUT,
        url: `/${id}`,
        ...request,
      });
    }

    public static async remove(id: any, request: SP = {} as SP) {
      return dataSourceRequest<T>({
        method: methods.DELETE,
        url: `/${id}`,
        ...request,
      });
    }
  }

  return DataSource;
};

export const methods = config.methods;
export const statuses = config.statuses;

export type { BaseRequestConfig, RequestConfig } from "./index.types";
