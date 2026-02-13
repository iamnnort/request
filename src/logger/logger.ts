import pino from 'pino';
import { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';
import { HttpMessageBuilder } from '@iamnnort/config/http';
import { LoggerConfig, LoggerLevels } from './logger.types';

export class Logger {
  private logger: pino.Logger;

  private config: Required<LoggerConfig>;

  constructor(config: Partial<LoggerConfig> = {}) {
    this.config = {
      name: '',
      level: LoggerLevels.INFO,
      ...config,
    };

    this.logger = pino({
      name: this.config.name,
      level: this.config.level,
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
    const messageBuilder = new HttpMessageBuilder({
      request,
    });

    const message = messageBuilder.makeMethodText().makeUrlText().makeRequestDataText().build();

    this.logger.debug(message);
  }

  logResponse(response: AxiosResponse, duration: number) {
    const messageBuilder = new HttpMessageBuilder({
      response,
      duration,
    });

    messageBuilder.makeMethodText().makeUrlText().makeRequestDataText().makeStatusText();

    if ([LoggerLevels.TRACE, LoggerLevels.DEBUG].includes(this.config.level)) {
      messageBuilder.makeResponseDataText();
    }

    const message = messageBuilder.makeDurationText().build();

    this.logger.info(message);
  }

  logError(request: AxiosRequestConfig, error: AxiosError, duration: number) {
    const messageBuilder = new HttpMessageBuilder({
      request,
      error,
      duration,
    });

    messageBuilder.makeMethodText().makeUrlText().makeRequestDataText().makeStatusText();

    if ([LoggerLevels.TRACE, LoggerLevels.DEBUG].includes(this.config.level)) {
      messageBuilder.makeResponseDataText();
    }

    const message = messageBuilder.makeDurationText().build();

    this.logger.error(message);
  }

  makeResponse<T>(response: AxiosResponse) {
    const loggerMessageBuilder = new HttpMessageBuilder({
      response,
    });

    const responseData = loggerMessageBuilder.makeResponse<T>();

    return responseData;
  }

  makeErrorResponse<T>(error: AxiosError) {
    const loggerMessageBuilder = new HttpMessageBuilder({
      error,
    });

    const errorResponseData = loggerMessageBuilder.makeResponse<T>();

    return errorResponseData;
  }
}
