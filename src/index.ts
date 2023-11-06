import axios from 'axios';
import { BaseRequestConfig, HttpMethods, RequestConfig } from './types';
import { requestHelper } from './helpers/request';

export * from './types';

export function request(baseRequestConfig: BaseRequestConfig = {}) {
  return <T>(requestConfig: RequestConfig = {}) => {
    return axios
      .request(
        requestHelper.makeRequestConfig(baseRequestConfig, requestConfig),
      )
      .then(requestHelper.makeSuccessHandler<T>(baseRequestConfig))
      .catch(requestHelper.makeErrorHandler(baseRequestConfig));
  };
}

export function makeDataSource<T, SP, SR, C, U>(
  baseRequestConfig: BaseRequestConfig,
) {
  const dataSourceRequest = request(baseRequestConfig);

  async function search(request: SP = {} as SP) {
    return dataSourceRequest<SR>({
      method: HttpMethods.GET,
      ...request,
    });
  }

  async function get(id: any, request: SP = {} as SP) {
    return dataSourceRequest<T>({
      method: HttpMethods.GET,
      url: `/${id}`,
      ...request,
    });
  }

  async function create(request: C = {} as C) {
    return dataSourceRequest<T>({
      method: HttpMethods.POST,
      ...request,
    });
  }

  async function bulkCreate(request: C = {} as C) {
    return dataSourceRequest<T>({
      method: HttpMethods.POST,
      url: '/bulk',
      ...request,
    });
  }

  async function update(id: any, request: U = {} as U) {
    return dataSourceRequest<T>({
      method: HttpMethods.PUT,
      url: `/${id}`,
      ...request,
    });
  }

  async function bulkUpdate(request: C = {} as C) {
    return dataSourceRequest<T>({
      method: HttpMethods.PUT,
      url: '/bulk',
      ...request,
    });
  }

  async function remove(id: any, request: SP = {} as SP) {
    return dataSourceRequest<T>({
      method: HttpMethods.DELETE,
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
    common: request(baseRequestConfig),
  };
}

export function sleep(seconds: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, seconds * 1000);
  });
}

export { makeUrl } from './helpers/request';
