import type { HttpClient } from '../http'
import { apiRoutes } from '../api-routes'
import type {
  PaymentHistoryRes,
  TransactionHistoryRes,
  RechargeHistoryRes,
} from '~/types/history'

export const HistoryApi = (http: HttpClient) => ({
  fetchRechargeHistory: () =>
    http.get<RechargeHistoryRes>(apiRoutes.history.recharges),
  fetchPaymentHistory: () =>
    http.get<PaymentHistoryRes>(apiRoutes.history.payments),
  fetchTransactionHistory: () =>
    http.get<TransactionHistoryRes>(apiRoutes.history.transactions),
})
