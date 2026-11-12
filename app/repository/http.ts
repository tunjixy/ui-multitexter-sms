import type { FetchResponse } from 'ofetch'
import { COOKIE_NAMES, AUTH_COOKIE_OPTIONS } from './constant'

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'

export interface ApiOptions {
  body?: any
  headers?: Record<string, string>
  params?: Record<string, string>
  authorization?: string
  /* Set on endpoints that check submitted credentials (login, password reset…):
    a 401 there means the credentials were rejected, not that the session expired. */
  skipLogoutOn401?: boolean
}

export class HttpClient {
  private getBaseURL(): string {
    const config = useRuntimeConfig()
    return (config.public.BASE_URL as string) || ''
  }

  private getAuthToken(): string | null {
    try {
      const authTokenCookie = useCookie<string | null>(
        COOKIE_NAMES.AUTH_TOKEN,
        {
          default: () => null,
          ...AUTH_COOKIE_OPTIONS,
        },
      )
      return authTokenCookie.value || null
    } catch {
      return null
    }
  }

  private buildConfig(method: HttpMethod, options: ApiOptions): any {
    const config: any = {
      method,
      baseURL: this.getBaseURL(),
      headers: Object.fromEntries(
        Object.entries({
          'Content-Type': 'application/json',
          ...options.headers,
        }).filter(([_, value]) => value !== undefined),
      ) as Record<string, string>,
    }

    if (options.authorization) {
      config.headers['Authorization'] = options.authorization
    } else {
      const token = this.getAuthToken()
      if (token) {
        config.headers['Authorization'] = `Bearer ${token}`
      }
    }

    if (options.body) {
      config.body = options.body
    }

    if (options.params) {
      config.query = options.params
    }

    return config
  }

  private handleRequestError(error: any, options: ApiOptions) {
    const status = error?.response?.status ?? error?.statusCode
    if (status === 401 && !options.skipLogoutOn401) {
      navigateTo('/logout')
    }
  }

  /**
   * Resolves with the full FetchResponse so callers can read response headers
   * (e.g. pagination cursors). `$fetch` discards the Response, so anything
   * header-based has to go through `$fetch.raw`. The parsed body lives on
   * `response._data`.
   */
  async requestRaw<T>(
    method: HttpMethod,
    url: string,
    options: ApiOptions = {},
  ): Promise<FetchResponse<T>> {
    try {
      return (await $fetch.raw<T>(
        url,
        this.buildConfig(method, options),
      )) as FetchResponse<T>
    } catch (error: any) {
      this.handleRequestError(error, options)
      throw error
    }
  }

  async request<T>(
    method: HttpMethod,
    url: string,
    options: ApiOptions = {},
  ): Promise<T> {
    const response = await this.requestRaw<T>(method, url, options)
    return response._data as T
  }

  get<T>(url: string, options?: ApiOptions): Promise<T> {
    return this.request<T>('GET', url, options)
  }
  getRaw<T>(url: string, options?: ApiOptions): Promise<FetchResponse<T>> {
    return this.requestRaw<T>('GET', url, options)
  }
  post<T>(url: string, body?: any, options?: ApiOptions): Promise<T> {
    return this.request<T>('POST', url, { ...options, body })
  }
  patch<T>(url: string, body?: any, options?: ApiOptions): Promise<T> {
    return this.request<T>('PATCH', url, { ...options, body })
  }
  put<T>(url: string, body?: any, options?: ApiOptions): Promise<T> {
    return this.request<T>('PUT', url, { ...options, body })
  }
  delete<T>(url: string, body?: any, options?: ApiOptions): Promise<T> {
    return this.request<T>('DELETE', url, { ...options, body })
  }
}
