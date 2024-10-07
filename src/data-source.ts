import axios, { AxiosError, AxiosResponse } from 'axios';
import { RequestBuilder } from './builder';
import {
  BaseRequestConfig,
  HttpMethods,
  RequestConfig,
  RequestConfigParams,
  ResponseConfig,
  RawResponse,
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

  async *bulkSearch(config: SearchParams = {} as SearchParams) {
    const paginationConfig = {
      currentPage: 0,
      lastPage: 0,
      pageSize: 30,
    };

    do {
      const { data, pagination } = await this.search({
        ...config,
        params: {
          ...config.params,
          page: paginationConfig.currentPage + 1,
          pageSize: paginationConfig.pageSize,
        },
      });

      if (!data.length) {
        return [];
      }

      yield data;

      paginationConfig.currentPage = pagination.currentPage;
      paginationConfig.lastPage = pagination.lastPage;
    } while (paginationConfig.currentPage !== paginationConfig.lastPage);
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
