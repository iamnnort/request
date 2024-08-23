import { AxiosError, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { stringify } from 'qs';
import { HttpMethods, HttpStatuses } from '../types';

type LoggerDto = {
  request?: InternalAxiosRequestConfig & Request;
  response?: AxiosResponse & Response;
  error?: AxiosError;
};

const makeType = (type: string) => {
  return `[${type}]`;
};

const makeUrl = (dto: LoggerDto = {}) => {
  const url =
    dto.request?.url ||
    dto.response?.config?.url ||
    dto.error?.response?.config.url;

  const params =
    dto.request?.params ||
    dto.response?.config?.params ||
    dto.error?.response?.config.params;

  if (!url) {
    return '';
  }

  if (params) {
    delete params['0'];
    return [url, stringify(params)].filter((_) => _).join('?');
  } else {
    return url;
  }
};

const makeMethod = (dto: LoggerDto = {}) => {
  const method =
    dto.request?.method ||
    dto.response?.config?.method ||
    dto.error?.response?.config.method;

  if (!method) {
    return HttpMethods.GET;
  }

  return method.toLowerCase() as HttpMethods;
};

const makeMethodText = (dto: LoggerDto = {}) => {
  const method =
    dto.request?.method ||
    dto.response?.config?.method ||
    dto.error?.response?.config.method;

  if (!method) {
    return '';
  }

  return method.toUpperCase();
};

const makeRequestData = (dto: LoggerDto = {}) => {
  const data =
    dto.request?.body ||
    dto.request?.data ||
    dto.response?.config?.data ||
    dto.error?.response?.config.data;

  if (!data) {
    return '';
  }

  if (typeof data === 'string') {
    return data;
  }

  return JSON.stringify(data);
};

const makeResponseData = (dto: LoggerDto = {}) => {
  const data = dto.response?.data || dto.error?.response?.data;

  if (!data) {
    return '';
  }

  if (typeof data === 'string') {
    return data;
  }

  return JSON.stringify(data);
};

const makeStatus = (dto: LoggerDto = {}) => {
  const status = dto.response?.status || dto.error?.response?.status;

  if (!status) {
    return HttpStatuses.INTERNAL_SERVER_ERROR;
  }

  return status as HttpStatuses;
};

const makeStatusText = (dto: LoggerDto = {}) => {
  const status = dto.response?.status || dto.error?.response?.status;

  if (!status) {
    return '';
  }

  const statusText =
    dto.response?.statusText || dto.error?.response?.statusText;

  if (statusText) {
    return `${status} ${statusText}`;
  }

  return `${status}`;
};

const makeResponse = <T>(dto: LoggerDto = {}) => {
  return {
    success: dto.error === undefined,
    status: makeStatus(dto),
    method: makeMethod(dto),
    data: makeResponseData(dto) as T,
  };
};

const logRequest = (request: InternalAxiosRequestConfig & Request) => {
  log([
    makeType('Request'),
    makeMethodText({ request }),
    makeUrl({ request }),
    makeRequestData({ request }),
  ]);
};

const logResponse = (response: AxiosResponse & Response) => {
  log([
    makeType('Response'),
    makeMethodText({ response }),
    makeUrl({ response }),
    makeRequestData({ response }),
    makeStatusText({ response }),
    makeResponseData({ response }),
  ]);
};

const logRequestError = (error: AxiosError) => {
  log([
    makeType('Error'),
    makeMethodText({ error }),
    makeUrl({ error }),
    makeRequestData({ error }),
    makeStatusText({ error }),
    makeResponseData({ error }),
  ]);
};

const log = (messageParts: string[]) => {
  const message = messageParts.filter((_) => _).join(' ');

  console.log(message);
};

export const loggerHelper = {
  makeType,
  makeUrl,
  makeMethod,
  makeMethodText,
  makeRequestData,
  makeResponseData,
  makeStatus,
  makeStatusText,
  makeResponse,
  logRequest,
  logResponse,
  logRequestError,
};
