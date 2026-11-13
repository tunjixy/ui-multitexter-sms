import type { HttpClient } from '../http'
import { apiRoutes } from '../api-routes'
import type {
  UnitPriceReq,
  UnitPriceRes,
  BuyUnitRes,
  VerifyPaymentReq,
  VerifyPaymentRes,
} from '@/types/payment'
import type { PriceRes } from '@/types/pricing'

export const paymentApi = (http: HttpClient) => ({
  fetchPrices: () => http.get<PriceRes>(apiRoutes.payment.prices),
  calculateUnitPrice: (body: UnitPriceReq) =>
    http.post<UnitPriceRes>(apiRoutes.payment.calculateUnit, {
      unit: body.unit,
      payment_gateway: body.paymentGateway,
    }),
  purchaseUnit: (body: UnitPriceReq) =>
    http.post<BuyUnitRes>(apiRoutes.payment.purchaseUnit, {
      unit: body.unit,
      payment_gateway: body.paymentGateway,
    }),
  verify: (body: VerifyPaymentReq) =>
    http.post<VerifyPaymentRes>(apiRoutes.payment.verify, body),
  flutterWaveVerify: (body: VerifyPaymentReq) =>
    http.post<VerifyPaymentRes>(apiRoutes.payment.flutterWaveVerify, body),
})
