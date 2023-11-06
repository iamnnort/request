import { stringify } from 'qs';
import { BaseRequestConfig, HttpMethods, RequestConfig } from '../types';
import { AxiosError, AxiosResponse } from 'axios';
import { loggerHelper } from './logger/logger';

export const makeUrl = (
  baseRequestConfig: BaseRequestConfig = {},
  requestConfig: RequestConfig = {},
) => {
  const urlParts = [
    baseRequestConfig.baseUrl,
    baseRequestConfig.url,
    ...(baseRequestConfig.urlParts || []),
    requestConfig.baseUrl,
    requestConfig.url,
    ...(requestConfig.urlParts || []),
  ].map((urlPart) => urlPart?.toString());

  const isSecureProtocol = urlParts.some(
    (urlPart) => urlPart?.includes('https'),
  );
  const protocol = isSecureProtocol ? 'https' : 'http';

  const actualUrlParts = urlParts
    .filter((urlPart) => urlPart)
    .map((urlPart) => {
      return urlPart?.replace(/(^(https?:\/\/|\/))/, '');
    });

  const url = [`${protocol}:/`, ...actualUrlParts].join('/');

  return url;
};

const makeHeaders = (
  baseRequestConfig: BaseRequestConfig = {},
  requestConfig: RequestConfig = {},
) => {
  return {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    ...baseRequestConfig.headers,
    ...requestConfig.headers,
  };
};

const makeSerializer = (baseRequestConfig: BaseRequestConfig = {}) => {
  return (params: any) => {
    return stringify(params, {
      arrayFormat: baseRequestConfig.serializer?.array,
    });
  };
};

const makeData = (
  baseRequestConfig: BaseRequestConfig = {},
  requestConfig: RequestConfig = {},
) => {
  if (requestConfig.method === HttpMethods.GET) {
    return undefined;
  }

  return {
    ...baseRequestConfig.data,
    ...requestConfig.data,
  };
};

const makeParams = (
  baseRequestConfig: BaseRequestConfig = {},
  requestConfig: RequestConfig = {},
) => {
  return {
    ...baseRequestConfig.params,
    ...requestConfig.params,
  };
};

const makeRequestConfig = (
  baseRequestConfig: BaseRequestConfig = {},
  requestConfig: RequestConfig = {},
) => {
  const config = {
    ...baseRequestConfig,
    ...requestConfig,
    url: makeUrl(baseRequestConfig, requestConfig),
    headers: makeHeaders(baseRequestConfig, requestConfig),
    data: makeData(baseRequestConfig, requestConfig),
    params: makeParams(baseRequestConfig, requestConfig),
    paramsSerializer: makeSerializer(baseRequestConfig),
  };

  if (baseRequestConfig.logger) {
    loggerHelper.logRequest(config as any);
  }

  return config;
};

const makeSuccessHandler = <T>(baseRequestConfig: BaseRequestConfig = {}) => {
  return (response: AxiosResponse<T>) => {
    if (baseRequestConfig.logger) {
      loggerHelper.logResponse(response as any);
    }

    return response.data;
  };
};

const makeErrorHandler = (baseRequestConfig: BaseRequestConfig = {}) => {
  return (error: AxiosError) => {
    if (baseRequestConfig.debug) {
      console.log('Error:', error);
    }

    if (baseRequestConfig.logger) {
      loggerHelper.logRequestError(error as any);
    }

    throw error.response?.data || error.response || new Error(error.message);
  };
};

export const requestHelper = {
  makeUrl,
  makeHeaders,
  makeSerializer,
  makeRequestConfig,
  makeSuccessHandler,
  makeErrorHandler,
};
