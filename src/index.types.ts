import { AxiosRequestConfig } from "axios";

export type BaseRequestConfig = AxiosRequestConfig & {
  serializer?: {
    array?: "indices" | "brackets" | "repeat" | "comma";
  };
};

export type RequestConfig = AxiosRequestConfig;
