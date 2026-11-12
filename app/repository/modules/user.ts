import type { ApiOptions, HttpClient } from '../http'
import { apiRoutes } from '../api-routes'
import type {
  ActivateUserReq,
  ActivateUserRes,
  UserDetailRes,
  RequestVerificationLinkRes,
} from '@/types/user'

export const userApi = (http: HttpClient) => ({
  activate: (body: ActivateUserReq) =>
    http.post<RequestVerificationLinkRes>(apiRoutes.user.activate, body),
  resendActivationCode: (email: string) =>
    http.post<ActivateUserRes>(
      apiRoutes.user.resendActivation,
      { email },
      { skipLogoutOn401: true },
    ),
  detail: (options?: ApiOptions) =>
    http.post<UserDetailRes>(apiRoutes.user.detail, undefined, options),
})
