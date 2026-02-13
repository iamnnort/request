import pino from 'pino';
import { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';
import { BaseRequestConfig } from './types';
import { MessageBuilder } from './message-builder';

export class Logger {
  private config: BaseRequestConfig;

  private logger: pino.Logger;

  private level: string;

  constructor(config: BaseRequestConfig) {
    this.config = config;

    this.level = config.logLevel || 'info';

    this.logger = pino({
      name: config.name,
      level: this.level,
      transport: {
        target: 'pino-pretty',
        options: {
          colorize: false,
          ignore: 'time,pid,hostname',
        },
      },
    });
  }

  logRequest(request: AxiosRequestConfig) {
    const messageBuilder = new MessageBuilder(this.config, {
      request,
    });

    const message = messageBuilder.makeMethodText().makeUrl().makeRequestData().build();

    this.logger.debug(message);
  }

  logResponse(response: AxiosResponse, duration: number) {
    const messageBuilder = new MessageBuilder(this.config, {
      response,
      duration,
    });

    messageBuilder.makeMethodText().makeUrl().makeRequestData().makeStatusText();

    if (['trace', 'debug'].includes(this.level)) {
      messageBuilder.makeResponseDataText();
    }

    const message = messageBuilder.makeDuration().build();

    this.logger.info(message);
  }

  logError(error: AxiosError, duration: number) {
    const messageBuilder = new MessageBuilder(this.config, {
      error,
      duration,
    });

    messageBuilder.makeMethodText().makeUrl().makeRequestData().makeStatusText();

    if (['trace', 'debug'].includes(this.level)) {
      messageBuilder.makeResponseDataText();
    }

    const message = messageBuilder.makeDuration().build();

    this.logger.error(message);
  }

  makeResponse<T>(response: AxiosResponse) {
    const loggerMessageBuilder = new MessageBuilder(this.config, {
      response,
    });

    const responseData = loggerMessageBuilder.makeResponse<T>();

    return responseData;
  }

  makeErrorResponse<T>(error: AxiosError) {
    const loggerMessageBuilder = new MessageBuilder(this.config, {
      error,
    });

    const errorResponseData = loggerMessageBuilder.makeResponse<T>();

    return errorResponseData;
  }
}
