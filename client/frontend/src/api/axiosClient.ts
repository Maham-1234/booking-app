import axios from "axios";
import type {
  AxiosError,
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
} from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api";

class ApiClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      withCredentials: true,
      headers: {
        "Content-Type": "application/json",
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    this.client.interceptors.request.use(
      (config: AxiosRequestConfig) => {
        console.log(`${config.method?.toUpperCase()} ${config.url}`);
        return config;
      },
      (error: AxiosError) => {
        console.error("Request Error:", error);
        return Promise.reject(error);
      }
    );

    this.client.interceptors.response.use(
      (response: AxiosResponse) => {
        console.log(
          `${response.config.method?.toUpperCase()} ${response.config.url} - ${
            response.status
          }`
        );
        return response;
      },
      (error: AxiosError) => {
        console.error(
          `${error.response?.config?.method?.toUpperCase()} ${
            error.response?.config?.url
          } - ${error.response?.status}`
        );

        if (error && error.response) {
          const originalRequest = error.config;
          const status = error.response.status;

          if (status === 401) {
            const requestUrl = originalRequest.url || "";

            if (requestUrl.endsWith("/auth/profile")) {
              return Promise.reject(error);
            } else if (requestUrl.endsWith("/login")) {
              //  show toast for invalid credentials
              return Promise.reject(error);
            } else {
              window.location.href = "/login";
              return Promise.reject(error);
            }
          }

          // // Handle other status errors
          // const message =
          //   (error.response.data as any)?.message || error.message;
          // window.location.href = `/error?status=${status}&message=${encodeURIComponent(
          //   message
          // )}`;

          return Promise.reject(error);
        }

        return Promise.reject(error); // fallback
      }
    );
  }

  async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.get<T>(url, config);
    return response.data;
  }
  async post<T, D = unknown>(
    url: string,
    data?: D,
    config?: AxiosRequestConfig
  ): Promise<T> {
    const response = await this.client.post<T>(url, data, config);
    return response.data;
  }

  async put<T, D = unknown>(
    url: string,
    data?: D,
    config?: AxiosRequestConfig
  ): Promise<T> {
    const response = await this.client.put<T>(url, data, config);
    return response.data;
  }

  async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.delete<T>(url, config);
    return response.data;
  }

  async upload<T>(
    url: string,
    formData: FormData,
    config?: AxiosRequestConfig
  ): Promise<T> {
    const response = await this.client.post<T>(url, formData, {
      ...config,
      headers: {
        "Content-Type": "multipart/form-data",
        ...config?.headers,
      },
    });
    return response.data;
  }
}

export const apiClient = new ApiClient();
