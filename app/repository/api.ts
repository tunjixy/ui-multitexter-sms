import { HttpClient } from './http'
import { authApi } from './modules/auth'
import { userApi } from './modules/user'
import { contactApi } from './modules/contact'
import { paymentApi } from './modules/payment'
import { miscApi } from './modules/misc'
import { ReferralApi } from './modules/referral'

const http = new HttpClient()

export const apiClient = {
  auth: authApi(http),
  user: userApi(http),
  contact: contactApi(http),
  payment: paymentApi(http),
  misc: miscApi(http),
  referral: ReferralApi(http),
}
