import { AxiosError, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { MessageBuilder } from './builder';

export class LoggerService {
  context: string = '';

  constructor(context: string = '') {
    this.context = context;
  }

  log(message: string, context?: string) {
    const ctx = context || this.context || '';

    if (ctx) {
      return console.log(`[${ctx}] ${message}`);
    }

    return console.log(message);
  }

  logRequest(request: InternalAxiosRequestConfig) {
    const loggerMessageBuilder = new MessageBuilder();

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
    const loggerMessageBuilder = new MessageBuilder();

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
    const loggerMessageBuilder = new MessageBuilder();

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
    const loggerMessageBuilder = new MessageBuilder();

    const responseData = loggerMessageBuilder.setResponse(response).makeResponse<T>();

    return responseData;
  }

  makeErrorResponse<T>(error: AxiosError) {
    const loggerMessageBuilder = new MessageBuilder();

    const errorResponseData = loggerMessageBuilder.setError(error).makeResponse<T>();

    return errorResponseData;
  }
}
