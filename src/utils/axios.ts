import axios, { AxiosError } from "axios";
import { hostname } from "../consts";
import { getBrowserId } from "./fingerprint";
import { isDEV } from "../env";

import { DecodeEndToEnd, EncodeEndToEnd } from "./encryption";
import { IEndToEndRequest, IEndToEndResponse } from "../interfaces/EndToEnd";

const axiosInstance = axios.create();
axiosInstance.defaults.baseURL = hostname;

const errorHandling = (error: AxiosError) =>
  Promise.reject(
    (error.response && error.response.data) || "Something went wrong!"
  );
const axiosLogDebug = (on: string, info: any, status: string, data: any) => {
  if (isDEV) {
    info = info?.method ? info : info.config;
    const method = String(info.method).toUpperCase();
    const url = info.baseURL + info.url;
    console.log(`(${on}) ${method} ${url} "${status}"`, { data });
  }
};

axiosInstance.interceptors.request.use(
  async (request) => {
    if (!request.headers["Content-Type"]) {
      request.headers["Accept"] = "application/json";
      request.headers["Content-Type"] = "application/json";
    }
    if (!request.headers.Authorization) {
      const token = localStorage.getItem("token");
      if (token) {
        request.headers.Authorization = `Bearer ${token}`;
      }
    }
    const browser_id = await getBrowserId();
    request.headers["x-browser-id"] = browser_id;
    // Encrypting request body
    if (request.data && typeof request.data === "object") {
      const data = request.data;
      axiosLogDebug("request", request, "prepare", data);
      const _encrypt_ = await EncodeEndToEnd(browser_id, JSON.stringify(data));
      request.data = { _encrypt_ } as IEndToEndRequest;
    } else {
      axiosLogDebug("request", request, "prepare", {});
    }
    return request;
  },
  (error) => errorHandling(error)
);

axiosInstance.interceptors.response.use(
  // from server response
  async (response): Promise<any> => {
    const data = response.data as IEndToEndResponse;
    if (data?._encrypt_) {
      try {
        // Decrypting response data
        const browser_id = await getBrowserId();
        const decrypt = DecodeEndToEnd(browser_id, data._encrypt_);
        const data_decrypt = JSON.parse(decrypt);
        axiosLogDebug("response", response, "success", data);
        return {
          success: true,
          data: data_decrypt,
          headers: response?.headers || {},
          status: response?.status || null,
          message: "OK",
        };
      } catch (error) {
        axiosLogDebug("response", response, "error decrypt", {});
        return {
          success: false,
          data: null,
          headers: response?.headers || {},
          status: response?.status || null,
          message: "Error decrypting response",
        };
      }
    } else {
      axiosLogDebug("response", response, "success", response?.data || {});
    }
    return {
      success: true,
      data: response?.data,
      headers: response?.headers || {},
      status: response?.status || null,
      message: "OK",
    };
  },
  async (error) => {
    const message = error?.message;
    const response = error.response;
    const data = error?.response?.data as IEndToEndResponse;
    if (data) {
      if (data?._encrypt_) {
        const _encrypt_ = data._encrypt_;
        try {
          // Decrypting response data
          const browser_id = await getBrowserId();
          const decrypt = DecodeEndToEnd(browser_id, _encrypt_);
          const data = JSON.parse(decrypt);
          axiosLogDebug("response", error, "error", data);
          return {
            success: false,
            data,
            headers: response?.headers || {},
            status: response?.status || null,
            message: message || response?.statusText || null,
          };
        } catch (error) {
          console.log("data on error in try catch:", { error });
          return {
            success: false,
            data: null,
            headers: response?.headers || {},
            status: response?.status || null,
            message: "Error decrypting response",
          };
        }
      } else {
        axiosLogDebug("response", error, "error", data);
      }
    } else {
      axiosLogDebug("response", error, "error", {});
    }
    return {
      success: false,
      data,
      headers: response?.headers || {},
      status: response?.status || null,
      message: message || response?.statusText || null,
    };
  }
);

export default axiosInstance;
