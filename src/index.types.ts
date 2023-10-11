import { AxiosRequestConfig } from "axios";

export type BaseRequestConfig = AxiosRequestConfig & {
  debug: boolean;
  serializer?: {
    array?: "indices" | "brackets" | "repeat" | "comma";
  };
};

export type RequestConfig = AxiosRequestConfig;
