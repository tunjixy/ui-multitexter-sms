import type { HttpClient } from '../http'
import { apiRoutes } from '../api-routes'
import type { ReferralRes, CommissionRes } from '@/types/referral'

export const ReferralApi = (http: HttpClient) => ({
  fetchReferrals: () => http.get<ReferralRes>(apiRoutes.referral.referrals),
  fetchCommissions: () =>
    http.get<CommissionRes>(apiRoutes.referral.commissions),
})
