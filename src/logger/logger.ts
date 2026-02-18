import pino from 'pino';
import { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';
import { HttpMessageBuilder, HttpMessageFormatter, HttpStatuses } from '@iamnnort/config/http';
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

    const formatter = new HttpMessageFormatter();

    this.logger = pino(
      {
        name: this.config.name,
        level: this.config.level,
        timestamp: false,
      },
      formatter.makeLogStream(),
    );
  }

  logRequest(request: AxiosRequestConfig) {
    const messageBuilder = new HttpMessageBuilder({
      request,
    });

    const message = messageBuilder.makeMethodText().makeUrlText().build();

    const data = {};

    const requestData = messageBuilder.makeRequestDataObj();

    if (Object.keys(requestData).length > 0) {
      data['request'] = requestData;
    }

    this.logger.debug(data, message);
  }

  logResponse(response: AxiosResponse, duration: number) {
    const messageBuilder = new HttpMessageBuilder({
      response,
      duration,
    });

    messageBuilder.makeMethodText().makeUrlText().makeStatusText();

    const data = {};

    const requestData = messageBuilder.makeRequestDataObj();

    if (Object.keys(requestData).length > 0) {
      data['request'] = requestData;
    }

    if ([LoggerLevels.TRACE, LoggerLevels.DEBUG].includes(this.config.level)) {
      const responseData = messageBuilder.makeResponseDataObj();

      if (Object.keys(responseData).length > 0) {
        data['response'] = responseData;
      }
    }

    const message = messageBuilder.makeDurationText().build();

    this.logger.info(data, message);
  }

  logError(request: AxiosRequestConfig, error: AxiosError, duration: number) {
    const messageBuilder = new HttpMessageBuilder({
      request,
      error,
      duration,
    });

    messageBuilder.makeMethodText().makeUrlText().makeStatusText();

    const data = {};

    const requestData = messageBuilder.makeRequestDataObj();

    if (Object.keys(requestData).length > 0) {
      data['request'] = requestData;
    }

    if ([LoggerLevels.TRACE, LoggerLevels.DEBUG].includes(this.config.level)) {
      const responseData = messageBuilder.makeResponseDataObj();

      if (Object.keys(responseData).length > 0) {
        data['response'] = responseData;
      }
    }

    const message = messageBuilder.makeDurationText().build();

    const status = messageBuilder.makeStatus();

    if (status >= HttpStatuses.INTERNAL_SERVER_ERROR) {
      this.logger.error(data, message);
    } else {
      this.logger.warn(data, message);
    }
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
