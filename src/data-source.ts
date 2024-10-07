import axios, { AxiosError, AxiosResponse } from 'axios';
import { RequestBuilder } from './builder';
import {
  BaseRequestConfig,
  HttpMethods,
  RequestConfig,
  RequestConfigParams,
  ResponseConfig,
  RawResponse,
  Pagination,
  PaginationResponse,
} from './types';
import { loggerHelper } from './logger/logger';

export class RequestDataSource<
  Entity extends Record<string, any> = any,
  SearchParams extends RequestConfigParams = any,
  SearchResponse extends Record<string, any> = any,
  CreateParams extends RequestConfigParams = any,
  UpdateParams extends RequestConfigParams = any,
> {
  baseRequestConfig: BaseRequestConfig;

  constructor(baseRequestConfig: BaseRequestConfig) {
    this.baseRequestConfig = baseRequestConfig;
  }

  common<T>(requestConfig: RequestConfig): Promise<T>;

  common<T>(
    requestConfig: RequestConfig,
    responseConfig: ResponseConfig,
  ): Promise<RawResponse<T>>;

  common<T>(requestConfig: RequestConfig, responseConfig: ResponseConfig = {}) {
    const requestBuilder = new RequestBuilder({
      baseConfig: this.baseRequestConfig,
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

    if (this.baseRequestConfig.logger) {
      loggerHelper.logRequest(request as any);
    }

    return axios
      .request(request)
      .then((response: AxiosResponse<T>) => {
        if (this.baseRequestConfig.logger) {
          loggerHelper.logResponse(response as any);
        }

        if (responseConfig.raw) {
          return loggerHelper.makeResponse<T>({ response } as any);
        }

        return response.data;
      })
      .catch((error: AxiosError) => {
        if (this.baseRequestConfig.debug) {
          console.log('Error:', error);
        }

        if (this.baseRequestConfig.logger) {
          loggerHelper.logRequestError(error as any);
        }

        if (responseConfig.raw) {
          return loggerHelper.makeResponse<T>({ error } as any);
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

  async *bulkSearch(
    config: SearchParams = {} as SearchParams,
  ): AsyncGenerator<Entity[]> {
    let pagination: Pagination = {
      total: 0,
      currentPage: config.params?.page || 0,
      lastPage: 0,
      from: 0,
      to: 0,
      pageSize: config.params?.pageSize || 30,
    };

    do {
      const response = await this.common<PaginationResponse<Entity>>({
        ...config,
        method: HttpMethods.GET,
        params: {
          ...config.params,
          page: pagination.currentPage + 1,
          pageSize: pagination.pageSize,
        },
      });

      if (!response.data?.length) {
        return [];
      }

      yield response.data;

      pagination = response.pagination;
    } while (pagination.currentPage !== pagination.lastPage);
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
