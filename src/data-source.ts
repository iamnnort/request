import axios, { AxiosError, AxiosResponse } from 'axios';
import { RequestBuilder } from './builder';
import {
  BaseRequestConfig,
  HttpMethods,
  RequestConfig,
  RequestConfigParams,
} from './types';
import { loggerHelper } from './logger/logger';

export class RequestDataSource<
  Entity extends Record<string, any> = any,
  SearchParams extends RequestConfigParams = any,
  SearchResponse extends Record<string, any> = any,
  CreateParams extends RequestConfigParams = any,
  UpdateParams extends RequestConfigParams = any,
> {
  baseConfig: BaseRequestConfig;

  constructor(baseConfig: BaseRequestConfig) {
    this.baseConfig = baseConfig;
  }

  common<T>(requestConfig: RequestConfig) {
    const requestBuilder = new RequestBuilder({
      baseConfig: this.baseConfig,
      requestConfig,
    });

    const request = requestBuilder
      .makeContentType()
      .makeAuth()
      .makeUrl()
      .makeMethod()
      .makeParams()
      .makeData()
      .makeSerializer()
      .build();

    if (this.baseConfig.logger) {
      loggerHelper.logRequest(request as any);
    }

    return axios
      .request(request)
      .then((response: AxiosResponse<T>) => {
        if (this.baseConfig.logger) {
          loggerHelper.logResponse(response as any);
        }

        return response.data;
      })
      .catch((error: AxiosError) => {
        if (this.baseConfig.debug) {
          console.log('Error:', error);
        }

        if (this.baseConfig.logger) {
          loggerHelper.logRequestError(error as any);
        }

        throw (
          error.response?.data || error.response || new Error(error.message)
        );
      });
  }

  search(config: SearchParams = {} as SearchParams) {
    return this.common<SearchResponse>({
      ...config,
      method: HttpMethods.GET,
    });
  }

  get(id: number | string, config: SearchParams = {} as SearchParams) {
    return this.common<Entity>({
      ...config,
      method: HttpMethods.GET,
      url: id,
    });
  }

  create(config: CreateParams) {
    return this.common<Entity>({
      ...config,
      method: HttpMethods.POST,
    });
  }

  bulkCreate(config: CreateParams) {
    return this.common<Entity[]>({
      ...config,
      method: HttpMethods.POST,
      url: '/bulk',
      data: {
        bulk: config.data,
      },
    });
  }

  update(id: number | string, config: UpdateParams) {
    return this.common<Entity>({
      ...config,
      method: HttpMethods.PUT,
      url: id,
    });
  }

  bulkUpdate(config: UpdateParams) {
    return this.common<Entity[]>({
      ...config,
      method: HttpMethods.PUT,
      url: '/bulk',
      data: {
        bulk: config.data,
      },
    });
  }

  remove(id: number | string, config: SearchParams = {} as SearchParams) {
    return this.common<void>({
      ...config,
      method: HttpMethods.DELETE,
      url: id,
    });
  }
}
