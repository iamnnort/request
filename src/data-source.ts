import axios, { AxiosError, AxiosResponse } from 'axios';
import { HttpMethods } from '@iamnnort/config/http';
import { RequestBuilder } from './builder';
import { Logger } from './logger/logger';
import { BaseRequestConfig, RequestConfig, RequestConfigParams, ResponseConfig, RawResponse } from './types';
import { PaginationResponse } from './pagination';

export class RequestDataSource<
  Entity extends Record<string, any> = any,
  SearchParams extends RequestConfigParams = any,
  SearchResponse extends Record<string, any> = any,
  CreateParams extends RequestConfigParams = any,
  UpdateParams extends RequestConfigParams = any,
> {
  baseRequestConfig: BaseRequestConfig;

  logger: Logger;

  constructor(baseRequestConfig: BaseRequestConfig) {
    this.baseRequestConfig = baseRequestConfig;

    this.logger = new Logger(this.baseRequestConfig.logger);
  }

  common<T>(requestConfig: RequestConfig, responseConfig?: ResponseConfig): Promise<T>;

  common<T>(
    requestConfig: RequestConfig,
    responseConfig: ResponseConfig & {
      raw: true;
    },
  ): Promise<RawResponse<T>>;

  common<T>(requestConfig: RequestConfig, responseConfig: ResponseConfig = {}) {
    const requestBuilder = new RequestBuilder({
      baseRequestConfig: this.baseRequestConfig,
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

    this.logger.logRequest(request);

    const startTime = Date.now();

    return axios
      .request(request)
      .then((response: AxiosResponse<T>) => {
        this.logger.logResponse(response, Date.now() - startTime);

        if (responseConfig.raw) {
          return this.logger.makeResponse<T>(response);
        }

        return response.data;
      })
      .catch((error: AxiosError) => {
        this.logger.logError(request, error, Date.now() - startTime);

        if (responseConfig.raw) {
          return this.logger.makeErrorResponse<T>(error);
        }

        throw error.response?.data || error.response || new Error(error.message);
      });
  }

  bulkCommon<T>(requestConfig: RequestConfig, responseConfig?: ResponseConfig): AsyncGenerator<T[]>;

  bulkCommon<T>(
    requestConfig: RequestConfig,
    responseConfig: ResponseConfig & {
      raw: true;
    },
  ): AsyncGenerator<PaginationResponse<T>>;

  async *bulkCommon<T>(requestConfig: RequestConfig, responseConfig: ResponseConfig = {}) {
    const { page, pageSize, bulkSize, ...searchDto } = requestConfig.params || {};

    const paginationDto = {
      page: page || 1,
      pageSize: pageSize || 30,
    };

    const maxPage = bulkSize ? paginationDto.page - 1 + bulkSize : null;

    let pagination = {
      total: 0,
      currentPage: 0,
      lastPage: 0,
      from: 0,
      to: 0,
      pageSize: 0,
    };

    do {
      const response = await this.common<PaginationResponse<T>>({
        ...requestConfig,
        params: {
          ...paginationDto,
          ...searchDto,
        },
      });

      pagination = response.pagination;

      if (!response.data?.length) {
        return;
      }

      if (responseConfig.raw) {
        yield response;
      } else {
        yield response.data;
      }

      paginationDto.page += 1;
    } while (pagination.currentPage !== pagination.lastPage && pagination.currentPage !== maxPage);

    if (pagination.currentPage !== pagination.lastPage) {
      if (responseConfig.bulkCallback) {
        await responseConfig.bulkCallback(paginationDto.page);
      }
    }
  }

  search(config: SearchParams = {} as SearchParams) {
    return this.common<SearchResponse>({
      ...config,
      method: HttpMethods.GET,
    });
  }

  bulkSearch(config: SearchParams = {} as SearchParams) {
    return this.bulkCommon<Entity>({
      ...config,
      method: HttpMethods.GET,
    });
  }

  async searchOne(config: SearchParams = {} as SearchParams) {
    const response = await this.common<SearchResponse>({
      ...config,
      method: HttpMethods.GET,
      params: {
        pageSize: 1,
        extended: true,
        strict: true,
        ...config.params,
      },
    });

    const data = response.data || [];

    return data[0] as Entity;
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

  bulkCreate(config: Omit<CreateParams, 'data'> & { data: CreateParams['data'][] }) {
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

  bulkUpdate(config: Omit<UpdateParams, 'data'> & { data: UpdateParams['data'][] }) {
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
