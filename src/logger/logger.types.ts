export { HttpMethods, HttpStatuses } from '@iamnnort/config/http';

export type LoggerConfig = {
  name: string;
  level: LoggerLevels;
  redactedKeys: string[];
  redactedValues: string[];
};

export type LoggerLogConfig = {
  duration?: number;
  redactedValues?: string[];
};

export enum LoggerLevels {
  FATAL = 'fatal',
  ERROR = 'error',
  WARN = 'warn',
  INFO = 'info',
  DEBUG = 'debug',
  TRACE = 'trace',
}
