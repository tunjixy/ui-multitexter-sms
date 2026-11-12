import type { HttpClient } from '../http'
import { apiRoutes } from '../api-routes'
import type {
  LoginReq,
  LoginRes,
  SignUpReq,
  SignUpRes,
  ForgotPasswordRes,
  ResetCodeCheckRes,
  ResetPasswordReq,
} from '@/types/auth'

const credentialCheck = { skipLogoutOn401: true }

export const authApi = (http: HttpClient) => ({
  login: (body: LoginReq) =>
    http.post<LoginRes>(apiRoutes.auth.login, body, credentialCheck),
  signup: (body: SignUpReq) =>
    http.post<SignUpRes>(apiRoutes.auth.signup, body, credentialCheck),
  forgotPassword: (email: string) =>
    http.post<ForgotPasswordRes>(
      apiRoutes.auth.forgotPassword,
      { email },
      credentialCheck,
    ),
  resetCodeCheck: (token: string) =>
    http.get<ResetCodeCheckRes>(
      apiRoutes.auth.checkResetCode(token),
      credentialCheck,
    ),
  resetPassword: (body: ResetPasswordReq) =>
    http.post<boolean>(apiRoutes.auth.resetPassword, body, credentialCheck),
})
