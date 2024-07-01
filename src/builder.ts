import { AxiosRequestConfig } from 'axios';
import { stringify } from 'qs';

import { BaseRequestConfig, HttpMethods, RequestConfig } from './types';

export class RequestBuilder {
  baseConfig: BaseRequestConfig;
  requestConfig: RequestConfig;
  config: AxiosRequestConfig;

  constructor(params: {
    baseConfig: BaseRequestConfig;
    requestConfig: RequestConfig;
  }) {
    this.baseConfig = params.baseConfig;
    this.requestConfig = params.requestConfig;
    this.config = {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        ...params.baseConfig.headers,
        ...params.requestConfig.headers,
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
    const auth = this.requestConfig.auth || this.baseConfig.auth;

    if (auth) {
      this.config = {
        ...this.config,
        auth,
      };

      return this;
    }

    const bearerToken =
      this.requestConfig.bearerToken || this.baseConfig.bearerToken;

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

    return this;
  }

  makeUrl() {
    const baseUrlMap =
      this.requestConfig.baseUrlMap || this.baseConfig.baseUrlMap;
    const baseUrlName =
      this.requestConfig.baseUrlName || this.baseConfig.baseUrlName;

    const urlParts = [
      baseUrlMap && baseUrlName
        ? baseUrlMap[baseUrlName]
        : this.baseConfig.baseUrl,
      this.baseConfig.url,
      ...(this.baseConfig.urlParts || []),
      this.requestConfig.baseUrl,
      this.requestConfig.url,
      ...(this.requestConfig.urlParts || []),
    ].map((urlPart) => urlPart?.toString());

    const isSecureProtocol = urlParts.some(
      (urlPart) => urlPart?.includes('https'),
    );
    const protocol = isSecureProtocol ? 'https' : 'http';

    const actualUrlParts = urlParts
      .filter((urlPart) => urlPart)
      .map((urlPart) => {
        return urlPart?.replace(/^(https?:\/\/|\/)|\/$/, '');
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
      paramsSerializer: (params: any) => {
        return stringify(params, {
          arrayFormat: this.baseConfig.serializer?.array,
        });
      },
    };

    return this;
  }

  build() {
    return this.config;
  }
}
