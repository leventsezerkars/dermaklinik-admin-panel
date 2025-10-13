import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";
import JwtService from "@/core/services/JwtService";
import SwalAlert from "../helpers/swalalert";
import store from "../../store";
import { Actions } from "@/store/enums/StoreEnums";

export interface ApiResponse<T = unknown> {
  result?: boolean;
  errorMessage?: string;
  message?: string;
  statusCode?: string;
  data?: any;
  totalCount?: number;
  hasNext?: boolean;
}

/**
 * @description service to call HTTP request via Axios
 */
class ApiService {
  /**
   * @description property to share vue instance
   */
  private static service: AxiosInstance;
  private static _config: AxiosRequestConfig = {
    baseURL:
      (import.meta.env && import.meta.env.VUE_APP_API_URL) ||
      process.env.VUE_APP_API_URL ||
      "https://your-production-api-url.com", // Buraya gerçek API URL'nizi yazın
    timeout: 30000,
  };
  /**
   * @description initialize vue axios
   */
  public static init() {
    ApiService.service = axios.create();
    ApiService.service.interceptors.request.use(
      this.requestInterceptor,
      this.errorInterceptor
    );
    ApiService.service.interceptors.response.use(
      this.successInterceptor,
      this.errorInterceptor
    );
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private static requestInterceptor(
    config: AxiosRequestConfig
  ): AxiosRequestConfig {
    const conf = config;
    const token = JwtService.getToken();

    if (!conf.headers) {
      conf.headers = {};
    }

    conf.headers.common["Accept"] = "*/*";
    conf.headers.common["Content-Type"] = "application/json";

    if (token) {
      conf.headers["Authorization"] = `Bearer ${token}`;
    }

    // Dil header'ı ekle
    const selectedLanguage = localStorage.getItem("selectedLanguage");
    if (selectedLanguage) {
      try {
        const language = JSON.parse(selectedLanguage);
        if (language.code) {
          conf.headers["Accept-Language"] = language.code;
        }
      } catch (error) {
        console.error("Dil bilgisi parse edilemedi:", error);
      }
    }

    return config;
  }

  private static successInterceptor<ApiResponse>(
    response: AxiosResponse<ApiResponse>
  ): AxiosResponse<ApiResponse> {
    return response;
  }

  private static errorInterceptor(error) {
    const err = error;
    const { status } = err.response;
    err.status = status;

    const errordata = err.response.data;
    console.log("API Error Details:", {
      status: status,
      response: err.response,
      statusText: err.response.statusText,
      data: errordata,
      config: {
        url: err.config?.url,
        method: err.config?.method,
        headers: err.config?.headers,
      },
    });
    if (!err.response) {
      return Promise.resolve({
        data: {
          result: false,
          errorMessage: "Beklenmeyen bir hata oluştu",
        },
      });
    }

    if (err.code === "ERR_NETWORK") {
      SwalAlert.toast("Servise Erişilemiyor.", "error");
      return Promise.resolve({
        data: {
          result: false,
          errorMessage: "Servise Erişilemiyor",
        },
      });
    }

    if (status == 403) {
      return Promise.resolve({
        data: {
          result: false,
          errorMessage: "Erişim izniniz olmayan bir istek attınız",
        },
      });
    }

    if (err.code === "ERR_BAD_RESPONSE" || status == 500) {
      SwalAlert.toast(errordata.errorMessage, "error");
      return Promise.resolve({
        data: {
          result: false,
          errorMessage:
            "Ulaşmaya çalıştığınız veri bulunamadı. " + errordata.errorMessage,
        },
      });
    }

    if (errordata.errors || errordata.status == 415) {
      SwalAlert.toast(errordata.title, "error");

      if (errordata.errors) {
        setTimeout(() => {
          SwalAlert.toast(JSON.stringify(errordata.errors), "error");
        }, 2000);
      }
    }

    if (status === 401) {
      return store
        .dispatch(Actions.LOGIN, {
          flow: "refreshToken",
          refreshToken: JwtService.getRefreshToken(),
        })
        .then(() => {
          if (!err.config._retry) {
            err.config._retry = true;
            return ApiService.service(err.config);
          } else {
            store.dispatch(Actions.LOGOUT, true);
          }
        })
        .catch(() => {
          store.dispatch(Actions.LOGOUT, true);
        });
    }

    SwalAlert.toast(errordata.errorMessage, "error");
    return Promise.resolve({
      data: {
        result: false,
        errorMessage: errordata.errorMessage,
      },
    });
  }

  // eslint-disable-next-line

  public static get<T>(
    url: string,
    customConfig: AxiosRequestConfig = {}
  ): Promise<AxiosResponse<ApiResponse<T>>> {
    return this.service.request<ApiResponse<T>>({
      ...this._config,
      url: url,
      method: "GET",
      ...customConfig,
    });
  }

  // eslint-disable-next-line
  public static delete<T>(
    url: string,
    data?: any,
    customConfig: AxiosRequestConfig = {}
  ): Promise<AxiosResponse<ApiResponse<T>>> {
    return this.service.request<ApiResponse<T>>({
      ...this._config,
      url: url,
      data: data,
      method: "DELETE",
      ...customConfig,
    });
  }

  // eslint-disable-next-line
  public static post<T>(
    url: string,
    data: any,
    customConfig: AxiosRequestConfig = {}
  ): Promise<AxiosResponse<ApiResponse<T>>> {
    return this.service.request<ApiResponse<T>>({
      ...this._config,
      url: url,
      data: data,
      method: "POST",
      ...customConfig,
    });
  }

  // eslint-disable-next-line
  public static put<T>(
    url: string,
    data: any,
    customConfig: AxiosRequestConfig = {}
  ): Promise<AxiosResponse<ApiResponse<T>>> {
    return this.service.request<ApiResponse<T>>({
      ...this._config,
      url: url,
      data: data,
      method: "PUT",
      ...customConfig,
    });
  }
  public static request<T>(
    url: string,
    data: any,
    method: string,
    customConfig: AxiosRequestConfig = {}
  ): Promise<AxiosResponse<T>> {
    return this.service.request<T>({
      ...this._config,
      url: url,
      data: data,
      method: method,
      ...customConfig,
    });
  }
}

export default ApiService;
