import type { FetchResponse } from 'ofetch'
import { apiRoutes } from './api-routes'
import { COOKIE_NAMES, AUTH_COOKIE_OPTIONS } from './constant'

import type {
  ContactSalesReq,
  IntegrationRequestReq,
  ContactReq,
  ContactRes,
} from '@/types/contact'
import type { VerifyPaymentReq, VerifyPaymentRes } from '@/types/payment'
import type {
  UnsubscribeReq,
  UnsubscribeRes,
  SenderNameReq,
  SenderNameRes,
} from '@/types/misc'
import type {
  LoginReq,
  LoginRes,
  SignUpReq,
  SignUpRes,
  ForgotPasswordRes,
  ResetCodeCheckRes,
  ResetPasswordReq,
} from '@/types/auth'
import type {
  ActivateUserReq,
  ActivateUserRes,
  UserDetailRes,
  RequestVerificationLinkRes,
} from '@/types/user'

// HTTP Method types
export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'

// API request options
export interface ApiOptions {
  body?: any
  headers?: Record<string, string>
  params?: Record<string, string>
  authorization?: string
}

/* A 401 from these endpoints means the credentials the user submitted
  were rejected, not that their session expired, so we don't log the user out. */
const credentialCheckRoutes: string[] = [
  apiRoutes.auth.login,
  apiRoutes.auth.signup,
  apiRoutes.auth.forgotPassword,
  apiRoutes.auth.checkResetCode(''),
  apiRoutes.auth.resetPassword,
  apiRoutes.user.resendActivation,
]

/**
 * Type-safe API Client using Nuxt's $fetch
 */
export class ApiClient {
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
      const token = authTokenCookie.value
      return token || null
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

    // Use provided authorization or auto-inject from cookie
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

    return config
  }

  private handleRequestError(url: string, error: any) {
    if (error?.response?.status === 401 || error?.statusCode === 401) {
      const isCredentialCheckEndpoint = credentialCheckRoutes.some((route) =>
        url.startsWith(route),
      )

      if (!isCredentialCheckEndpoint) {
        navigateTo('/logout')
      }
    }
  }

  /**
   * Core request method
   */
  async request<T>(
    method: HttpMethod,
    url: string,
    options: ApiOptions = {},
  ): Promise<T> {
    try {
      return await $fetch<T>(url, this.buildConfig(method, options))
    } catch (error: any) {
      this.handleRequestError(url, error)
      throw error
    }
  }

  /**
   * Same as `request`, but resolves with the full FetchResponse so callers can
   * read response headers (e.g. pagination cursors). `$fetch` discards the
   * Response, so anything header-based has to go through `$fetch.raw`.
   * The parsed body lives on `response._data`.
   */
  async requestRaw<T>(
    method: HttpMethod,
    url: string,
    options: ApiOptions = {},
  ): Promise<FetchResponse<T>> {
    try {
      return await $fetch.raw<T>(url, this.buildConfig(method, options))
    } catch (error: any) {
      this.handleRequestError(url, error)
      throw error
    }
  }

  // Generic methods
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

  // Auth API methods
  auth = {
    login: (body: LoginReq): Promise<LoginRes> =>
      this.post<LoginRes>(apiRoutes.auth.login, body),
    signup: (body: SignUpReq): Promise<SignUpRes> =>
      this.post<SignUpRes>(apiRoutes.auth.signup, body),
    forgotPassword: (email: string): Promise<ForgotPasswordRes> =>
      this.post<ForgotPasswordRes>(apiRoutes.auth.forgotPassword, { email }),
    resetCodeCheck: (token: string): Promise<ResetCodeCheckRes> =>
      this.get<ResetCodeCheckRes>(apiRoutes.auth.checkResetCode(token)),
    resetPassword: (body: ResetPasswordReq): Promise<boolean> =>
      this.post<boolean>(apiRoutes.auth.resetPassword, body),
  }

  // User API methods
  user = {
    activate: (body: ActivateUserReq): Promise<RequestVerificationLinkRes> =>
      this.post<RequestVerificationLinkRes>(apiRoutes.user.activate, body),
    resendActivationCode: (email: string): Promise<ActivateUserRes> =>
      this.post<ActivateUserRes>(apiRoutes.user.resendActivation, { email }),
    detail: (options?: ApiOptions): Promise<UserDetailRes> =>
      this.post<UserDetailRes>(apiRoutes.user.detail, undefined, options),
  }

  // Contact API methods
  contact = {
    contactSales: (body: ContactSalesReq): Promise<ContactRes> =>
      this.post<ContactRes>(apiRoutes.contact.contactSales, body),
    integrationRequest: (body: IntegrationRequestReq): Promise<ContactRes> =>
      this.post<ContactRes>(apiRoutes.contact.request, body),
    sendFeedback: (body: ContactReq): Promise<ContactRes> =>
      this.post<ContactRes>(apiRoutes.contact.feedback, body),
  }

  // Payment API methods
  payment = {
    verify: (body: VerifyPaymentReq): Promise<VerifyPaymentRes> =>
      this.post<VerifyPaymentRes>(apiRoutes.payment.verify, body),
    flutterWaveVerify: (body: VerifyPaymentReq): Promise<VerifyPaymentRes> =>
      this.post<VerifyPaymentRes>(apiRoutes.payment.flutterWaveVerify, body),
  }

  // Misc API methods
  misc = {
    unsubscribe: (body: UnsubscribeReq): Promise<UnsubscribeRes> =>
      this.post<UnsubscribeRes>(apiRoutes.misc.unsubscribe, body),
    senderNameRequest: (body: SenderNameReq): Promise<SenderNameRes> =>
      this.post<SenderNameRes>(apiRoutes.misc.senderNameRequest, body),
  }
}

export const apiClient = new ApiClient()
