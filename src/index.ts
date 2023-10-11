import axios, { AxiosError, AxiosResponse } from "axios";
import qs from "qs";
import { config } from "./config";
import { BaseRequestConfig, RequestConfig } from "./index.types";

export const request = (baseRequestConfig: BaseRequestConfig = {}) => {
  const { debug, serializer, ...restBaseRequestConfig } = baseRequestConfig;

  return <T>(requestConfig: RequestConfig = {}) => {
    const handleSuccess = (response: AxiosResponse<T>) => {
      return response.data;
    };

    const handleError = (error: AxiosError) => {
      if (debug) {
        console.log("Error:", error);
      }

      throw error.response?.data || error.response || new Error(error.message);
    };

    const withUrlConfig = (config: BaseRequestConfig) => {
      const url = [
        restBaseRequestConfig.baseUrl,
        restBaseRequestConfig.url,
        requestConfig.baseUrl,
        requestConfig.url,
      ]
        .filter((_) => _)
        .join("/");

      return {
        ...config,
        url,
      };
    };

    return axios
      .request(
        withUrlConfig({
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            ...restBaseRequestConfig.headers,
            ...requestConfig.headers,
          },
          paramsSerializer: (params) => {
            return qs.stringify(params, {
              arrayFormat: serializer?.array,
            });
          },
        })
      )
      .then(handleSuccess)
      .catch(handleError);
  };
};

export const makeDataSource = <T, SP, SR, C, U>(
  baseRequestConfig: BaseRequestConfig
) => {
  const dataSourceRequest = request(baseRequestConfig);

  async function search(request: SP = {} as SP) {
    return dataSourceRequest<SR>({
      method: methods.GET,
      ...request,
    });
  }

  async function get(id: any, request: SP = {} as SP) {
    return dataSourceRequest<T>({
      method: methods.GET,
      url: `/${id}`,
      ...request,
    });
  }

  async function create(request: C = {} as C) {
    return dataSourceRequest<T>({
      method: methods.POST,
      ...request,
    });
  }

  async function bulkCreate(request: C = {} as C) {
    return dataSourceRequest<T>({
      method: methods.POST,
      url: "/bulk",
      ...request,
    });
  }

  async function update(id: any, request: U = {} as U) {
    return dataSourceRequest<T>({
      method: methods.PUT,
      url: `/${id}`,
      ...request,
    });
  }

  async function remove(id: any, request: SP = {} as SP) {
    return dataSourceRequest<T>({
      method: methods.DELETE,
      url: `/${id}`,
      ...request,
    });
  }

  return {
    search,
    get,
    create,
    bulkCreate,
    update,
    remove,
  };
};

export const methods = config.methods;
export const statuses = config.statuses;

export type { BaseRequestConfig, RequestConfig } from "./index.types";
