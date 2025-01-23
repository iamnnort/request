import { AxiosError, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { MessageBuilder } from './builder';
import { BaseRequestConfig } from '@src/types';

export class LoggerService {
  private config: BaseRequestConfig;

  constructor(config: BaseRequestConfig) {
    this.config = config;
  }

  log(message: string, context?: string) {
    const ctx = context || this.config.name || '';

    if (ctx) {
      return console.log(`[${ctx}] ${message}`);
    }

    return console.log(message);
  }

  logRequest(request: InternalAxiosRequestConfig) {
    const loggerMessageBuilder = new MessageBuilder(this.config);

    const message = loggerMessageBuilder
      .setRequest(request)
      .makeType('Request')
      .makeMethodText()
      .makeUrl()
      .makeRequestData()
      .build();

    return this.log(message);
  }

  logResponse(response: AxiosResponse) {
    const loggerMessageBuilder = new MessageBuilder(this.config);

    const message = loggerMessageBuilder
      .setResponse(response)
      .makeType('Response')
      .makeMethodText()
      .makeUrl()
      .makeRequestData()
      .makeStatusText()
      .makeResponseDataText()
      .build();

    return this.log(message);
  }

  logRequestError(error: AxiosError) {
    const loggerMessageBuilder = new MessageBuilder(this.config);

    const message = loggerMessageBuilder
      .setError(error)
      .makeType('Error')
      .makeMethodText()
      .makeUrl()
      .makeRequestData()
      .makeStatusText()
      .makeResponseDataText()
      .build();

    return this.log(message);
  }

  makeResponse<T>(response: AxiosResponse) {
    const loggerMessageBuilder = new MessageBuilder(this.config);

    const responseData = loggerMessageBuilder.setResponse(response).makeResponse<T>();

    return responseData;
  }

  makeErrorResponse<T>(error: AxiosError) {
    const loggerMessageBuilder = new MessageBuilder(this.config);

    const errorResponseData = loggerMessageBuilder.setError(error).makeResponse<T>();

    return errorResponseData;
  }
}
