import { HttpClient } from './http'
import { authApi } from './modules/auth'
import { userApi } from './modules/user'
import { contactApi } from './modules/contact'
import { paymentApi } from './modules/payment'
import { miscApi } from './modules/misc'
import { ReferralApi } from './modules/referral'
import { AlertApi } from './modules/alert'
import { HistoryApi } from './modules/history'
import { BirthdayApi } from './modules/birthday'
import { ProfileApi } from './modules/profile'
import { PhonebookApi } from './modules/phonebook'
import { ShareApi } from './modules/share'
import { ReportApi } from './modules/report'
import { MessageApi } from './modules/message'
import { PersonalizedApi } from './modules/personalized'
import { SenderIdApi } from './modules/sender-id'

const http = new HttpClient()

export const apiClient = {
  auth: authApi(http),
  user: userApi(http),
  contact: contactApi(http),
  payment: paymentApi(http),
  misc: miscApi(http),
  referral: ReferralApi(http),
  alert: AlertApi(http),
  history: HistoryApi(http),
  birthday: BirthdayApi(http),
  profile: ProfileApi(http),
  phonebook: PhonebookApi(http),
  share: ShareApi(http),
  report: ReportApi(http),
  message: MessageApi(http),
  personalized: PersonalizedApi(http),
  senderId: SenderIdApi(http),
}
