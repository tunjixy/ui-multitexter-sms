import type { HttpClient } from '../http'
import { apiRoutes } from '../api-routes'
import type { VerifyPaymentReq, VerifyPaymentRes } from '@/types/payment'

export const paymentApi = (http: HttpClient) => ({
  verify: (body: VerifyPaymentReq) =>
    http.post<VerifyPaymentRes>(apiRoutes.payment.verify, body),
  flutterWaveVerify: (body: VerifyPaymentReq) =>
    http.post<VerifyPaymentRes>(apiRoutes.payment.flutterWaveVerify, body),
})
