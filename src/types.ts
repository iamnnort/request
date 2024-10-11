import { AxiosRequestConfig } from 'axios';

export type RequestParams = Pick<AxiosRequestConfig, 'params' | 'data'>;

export type RequestConfigParams = Pick<AxiosRequestConfig, 'params' | 'data'>;

export type RequestConfig = Omit<AxiosRequestConfig, 'baseURL' | 'url'> & {
  baseUrl?: string;
  baseUrlName?: string;
  baseUrlMap?: Record<string, string>;
  url?: number | string;
  urlParts?: (number | string)[];
  bearerToken?: string;
  apiKey?: string;
  urlencoded?: boolean;
  multipart?: boolean;
  xml?: boolean;
};

export type BaseRequestConfig = Pick<AxiosRequestConfig, 'auth' | 'headers' | 'timeout'> & {
  name?: string;
  baseUrl?: string;
  baseUrlName?: string;
  baseUrlMap?: Record<string, string>;
  url?: number | string;
  urlParts?: (number | string)[];
  bearerToken?: string;
  apiKey?: string;
  debug?: boolean;
  logger?: boolean;
  serializer?: {
    array?: 'indices' | 'brackets' | 'repeat' | 'comma';
  };
};

export type ResponseConfig = {
  raw?: boolean;
};

export type RawResponse<T> = {
  success: boolean;
  status: HttpStatuses;
  method: HttpMethods;
  data: T;
};

export enum HttpMethods {
  GET = 'get',
  POST = 'post',
  PUT = 'put',
  DELETE = 'delete',
}

export enum HttpStatuses {
  OK = 200,
  CREATED = 201,
  ACCEPTED = 202,
  NO_CONTENT = 204,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  CONFLICT = 409,
  INTERNAL_SERVER_ERROR = 500,
}

export type Pagination = {
  total: number;
  currentPage: number;
  lastPage: number;
  from: number;
  to: number;
  pageSize: number;
};

export type PaginationResponse<T> = {
  data: T[];
  pagination: Pagination;
};
