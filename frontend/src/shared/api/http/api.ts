import { ApiError } from './error';

const API_BASE = import.meta.env.DEV
  ? '/api/v1'
  : `${import.meta.env.VITE_API_BASE_URL}:${import.meta.env.VITE_API_PORT}`;

type RequestOptions = {
  params?: Record<string, string | undefined>;
  query?: string;
  body?: unknown;
  signal?: AbortSignal;
};

export class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string = API_BASE) {
    this.baseUrl = baseUrl;
  }

  private async request<T>(
    method: string,
    path: string,
    options: RequestOptions = {},
  ): Promise<T> {
    const url = this.buildUrl(path, options.params, options.query);
    const headers: Record<string, string> = {};

    if (options.body !== undefined) {
      headers['Content-Type'] = 'application/json';
    }

    const response = await fetch(url, {
      method,
      headers,
      credentials: 'include',
      body:
        options.body !== undefined ? JSON.stringify(options.body) : undefined,
      signal: options.signal,
    });

    if (!response.ok) {
      let message = `HTTP ${response.status}: ${response.statusText}`;
      let details: Record<string, unknown> | undefined;

      try {
        const errBody = (await response.json()) as Record<string, unknown>;
        if (typeof errBody.message === 'string') {
          message = errBody.message;
        }
        details = errBody;
      } catch {
        // тело не JSON — оставляем дефолтный message
      }

      throw new ApiError({ message, status: response.status, details });
    }

    // 204 No Content — пустой ответ
    if (response.status === 204) {
      return undefined as T;
    }

    const text = await response.text();
    if (!text) {
      return undefined as T;
    }

    return JSON.parse(text) as T;
  }

  private buildUrl(
    path: string,
    params?: Record<string, string | undefined>,
    query?: string,
  ): string {
    const url = new URL(`${this.baseUrl}${path}`, window.location.origin);

    if (query) {
      url.search = query;
    }

    if (params) {
      for (const [key, value] of Object.entries(params)) {
        if (value !== undefined) {
          url.searchParams.append(key, value);
        }
      }
    }

    return url.toString();
  }

  get<T>(path: string, options?: RequestOptions): Promise<T> {
    return this.request<T>('GET', path, options);
  }

  post<T>(path: string, options?: RequestOptions): Promise<T> {
    return this.request<T>('POST', path, options);
  }

  put<T>(path: string, options?: RequestOptions): Promise<T> {
    return this.request<T>('PUT', path, options);
  }

  patch<T>(path: string, options?: RequestOptions): Promise<T> {
    return this.request<T>('PATCH', path, options);
  }

  delete<T>(path: string, options?: RequestOptions): Promise<T> {
    return this.request<T>('DELETE', path, options);
  }
}
