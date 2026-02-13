import { AxiosRequestConfig } from 'axios';
import { stringify } from 'qs';
import { HttpMethods } from '@iamnnort/config/http';
import { BaseRequestConfig, RequestConfig } from './types';
import { SerializerArrayFormats } from './serializer';

export class RequestBuilder {
  baseRequestConfig: BaseRequestConfig;
  requestConfig: RequestConfig;

  config: AxiosRequestConfig;

  constructor(options: { baseRequestConfig: BaseRequestConfig; requestConfig: RequestConfig }) {
    this.baseRequestConfig = options.baseRequestConfig;
    this.requestConfig = options.requestConfig;

    this.config = {
      timeout: options.requestConfig.timeout || options.baseRequestConfig.timeout,
      responseType: options.requestConfig.responseType || options.baseRequestConfig.responseType,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        ...options.baseRequestConfig.headers,
        ...options.requestConfig.headers,
      },
    };
  }

  makeContentType() {
    if (this.requestConfig.multipart) {
      this.config = {
        ...this.config,
        headers: {
          ...this.config.headers,
          'Content-Type': 'multipart/form-data',
        },
      };

      return this;
    }

    if (this.requestConfig.urlencoded) {
      this.config = {
        ...this.config,
        headers: {
          ...this.config.headers,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      };

      return this;
    }

    if (this.requestConfig.xml) {
      this.config = {
        ...this.config,
        headers: {
          ...this.config.headers,
          'Content-Type': 'text/xml',
        },
      };

      return this;
    }

    return this;
  }

  makeAuth() {
    const auth = this.requestConfig.auth || this.baseRequestConfig.auth;

    if (auth) {
      this.config = {
        ...this.config,
        auth,
      };

      return this;
    }

    const bearerToken = this.requestConfig.bearerToken || this.baseRequestConfig.bearerToken;

    if (bearerToken) {
      this.config = {
        ...this.config,
        headers: {
          ...this.config.headers,
          Authorization: `Bearer ${bearerToken}`,
        },
      };

      return this;
    }

    const apiKey = this.requestConfig.apiKey || this.baseRequestConfig.apiKey;

    if (apiKey) {
      this.config = {
        ...this.config,
        headers: {
          ...this.config.headers,
          'x-api-key': apiKey,
        },
      };

      return this;
    }

    return this;
  }

  makeUrl() {
    const baseUrlMap = this.requestConfig.baseUrlMap || this.baseRequestConfig.baseUrlMap;
    const baseUrlName = this.requestConfig.baseUrlName || this.baseRequestConfig.baseUrlName;

    const urlParts = [
      baseUrlMap && baseUrlName ? baseUrlMap[baseUrlName] : this.baseRequestConfig.baseUrl,
      this.baseRequestConfig.url,
      ...(this.baseRequestConfig.urlParts || []),
      this.requestConfig.baseUrl,
      this.requestConfig.url,
      ...(this.requestConfig.urlParts || []),
    ].map((urlPart) => urlPart?.toString());

    const isSecureProtocol = urlParts.some((urlPart) => urlPart?.includes('https'));
    const protocol = isSecureProtocol ? 'https' : 'http';

    const actualUrlParts = urlParts
      .filter((urlPart) => urlPart)
      .map((urlPart) => {
        return urlPart?.replace(/^(https?:\/\/|\/)?(.*?)(\/?)$/, '$2');
      });

    const url = `${protocol}://${actualUrlParts.join('/')}`;

    this.config = {
      ...this.config,
      url,
    };

    return this;
  }

  makeMethod() {
    this.config = {
      ...this.config,
      method: this.requestConfig.method,
    };

    return this;
  }

  makeData() {
    if (this.requestConfig.method === HttpMethods.GET) {
      return this;
    }

    if (this.requestConfig.urlencoded) {
      this.config = {
        ...this.config,
        data: stringify(this.requestConfig.data),
      };

      return this;
    }

    this.config = {
      ...this.config,
      data: this.requestConfig.data,
    };

    return this;
  }

  makeParams() {
    this.config = {
      ...this.config,
      params: this.requestConfig.params,
    };

    return this;
  }

  makeSerializer() {
    this.config = {
      ...this.config,
      paramsSerializer: {
        serialize: (params: any) => {
          return stringify(params, {
            arrayFormat: this.baseRequestConfig.serializer?.arrayFormat || SerializerArrayFormats.BRACKETS,
            skipNulls: true,
          });
        },
      },
    };

    return this;
  }

  build() {
    return this.config;
  }
}
