import { AxiosRequestConfig } from 'axios';
import { HttpMethods, HttpStatuses, LoggerConfig } from './logger';
import { SerializerConfig } from './serializer';
import { SignerConfig } from './signer';

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

export type BaseRequestConfig = Pick<AxiosRequestConfig, 'auth' | 'headers' | 'timeout' | 'responseType'> & {
  baseUrl?: string;
  baseUrlName?: string;
  baseUrlMap?: Record<string, string>;
  url?: number | string;
  urlParts?: (number | string)[];
  bearerToken?: string;
  apiKey?: string;
  serializer?: Partial<SerializerConfig>;
  logger?: Partial<LoggerConfig>;
  signer?: Partial<SignerConfig>;
};

export type ResponseConfig = {
  raw?: boolean;
  bulkCallback?: (page: number) => Promise<void>;
};

export type Response<T = unknown> = {
  success: boolean;
  data?: T;
  errorCode?: string;
};

export type RawResponse<T = unknown> = {
  success: boolean;
  status: HttpStatuses;
  method: HttpMethods;
  data: T;
};
