import axios from "axios";
import { config } from "./config";
import { BaseRequestConfig, RequestConfig } from "./types";
import { requestHelper } from "./helpers/request";

export function request(baseRequestConfig: BaseRequestConfig = {}) {
  return <T>(requestConfig: RequestConfig = {}) => {
    return axios
      .request(
        requestHelper.makeRequestConfig(baseRequestConfig, requestConfig)
      )
      .then(requestHelper.makeSuccessHandler<T>(baseRequestConfig))
      .catch(requestHelper.makeErrorHandler(baseRequestConfig));
  };
}

export function makeDataSource<T, SP, SR, C, U>(
  baseRequestConfig: BaseRequestConfig
) {
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

  async function bulkUpdate(request: C = {} as C) {
    return dataSourceRequest<T>({
      method: methods.PUT,
      url: "/bulk",
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
    bulkUpdate,
    remove,
    common: request,
  };
}

export function sleep(seconds: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, seconds * 1000);
  });
}

export const { methods, statuses } = config;

export type { BaseRequestConfig, RequestConfig } from "./types";
