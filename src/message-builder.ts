import { AxiosError, AxiosResponse, AxiosRequestConfig } from 'axios';
import { stringify } from 'qs';
import { BaseRequestConfig, HttpMethods, HttpStatuses } from './types';

export class MessageBuilder {
  private config: BaseRequestConfig;

  private printQueue: string[];

  private request?: AxiosRequestConfig;
  private response?: AxiosResponse;
  private error?: AxiosError;

  private duration?: number;

  constructor(
    config: BaseRequestConfig,
    options: {
      request?: AxiosRequestConfig;
      response?: AxiosResponse;
      error?: AxiosError;
      duration?: number;
    },
  ) {
    this.printQueue = [];
    this.config = config;
    this.request = options.request;
    this.response = options.response;
    this.error = options.error;
    this.duration = options.duration;
  }

  makeUrl() {
    const url = this.request?.url || this.response?.config?.url || this.error?.response?.config.url;

    const params = this.request?.params || this.response?.config?.params || this.error?.response?.config.params;

    if (url) {
      if (params) {
        delete params['0'];
        this.printQueue.push(
          [
            url,
            stringify(params, {
              arrayFormat: this.config.serializer?.array || 'brackets',
              skipNulls: true,
            }),
          ]
            .filter((_) => _)
            .join('?'),
        );
      } else {
        this.printQueue.push(url);
      }
    }

    return this;
  }

  makeMethodText() {
    const method = this.request?.method || this.response?.config?.method || this.error?.response?.config.method;

    if (method) {
      this.printQueue.push(method.toUpperCase());
    }

    return this;
  }

  makeRequestData() {
    const data = this.request?.data || this.response?.config?.data || this.error?.response?.config.data;

    if (data) {
      if (typeof data === 'string') {
        this.printQueue.push(data);

        return this;
      }

      if (Object.keys(data).length) {
        this.printQueue.push(JSON.stringify(data));

        return this;
      }
    }

    return this;
  }

  makeResponseDataText() {
    const data = this.response?.data || this.error?.response?.data;

    if (data) {
      if (typeof data === 'string') {
        this.printQueue.push(data);

        return this;
      }

      if (Object.keys(data).length) {
        this.printQueue.push(JSON.stringify(data));

        return this;
      }
    }

    return this;
  }

  makeStatusText() {
    const status = this.response?.status || this.error?.response?.status;

    if (status) {
      this.printQueue.push(`${status}`);

      const statusText = this.response?.statusText || this.error?.response?.statusText;

      if (statusText) {
        this.printQueue.push(statusText);
      }
    }

    return this;
  }

  makeDuration() {
    if (this.duration) {
      this.printQueue.push(`(${this.duration}ms)`);
    }

    return this;
  }

  build() {
    return this.printQueue.join(' ');
  }

  makeMethod() {
    const method = this.request?.method || this.response?.config?.method || this.error?.response?.config.method;

    if (!method) {
      return HttpMethods.GET;
    }

    return method.toLowerCase() as HttpMethods;
  }

  makeResponseData() {
    const data = this.response?.data || this.error?.response?.data;

    if (!data) {
      return '';
    }

    if (typeof data === 'string') {
      return data;
    }

    return JSON.stringify(data);
  }

  makeStatus() {
    const status = this.response?.status || this.error?.response?.status;

    if (!status) {
      return HttpStatuses.INTERNAL_SERVER_ERROR;
    }

    return status as HttpStatuses;
  }

  makeResponse<T>() {
    return {
      success: this.error === undefined,
      status: this.makeStatus(),
      method: this.makeMethod(),
      data: this.makeResponseData() as T,
    };
  }
}
