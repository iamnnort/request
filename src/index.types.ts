import { AxiosRequestConfig } from "axios";

export type RequestConfig = Omit<AxiosRequestConfig, "baseURL"> & {
  baseUrl?: string;
};

export type BaseRequestConfig = RequestConfig & {
  debug?: boolean;
  logger?: boolean;
  serializer?: {
    array?: "indices" | "brackets" | "repeat" | "comma";
  };
};
