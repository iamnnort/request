export { HttpMethods, HttpStatuses } from '@iamnnort/config/http';

export type LoggerConfig = {
  name: string;
  level: LoggerLevels;
};

export enum LoggerLevels {
  FATAL = 'fatal',
  ERROR = 'error',
  WARN = 'warn',
  INFO = 'info',
  DEBUG = 'debug',
  TRACE = 'trace',
}
