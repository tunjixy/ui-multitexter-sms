import type { HttpClient } from '../http'
import { apiRoutes } from '../api-routes'
import type {
  ContactSalesReq,
  IntegrationRequestReq,
  ContactReq,
  ContactRes,
} from '@/types/contact'

export const contactApi = (http: HttpClient) => ({
  contactSales: (body: ContactSalesReq) =>
    http.post<ContactRes>(apiRoutes.contact.contactSales, body),
  integrationRequest: (body: IntegrationRequestReq) =>
    http.post<ContactRes>(apiRoutes.contact.request, body),
  sendFeedback: (body: ContactReq) =>
    http.post<ContactRes>(apiRoutes.contact.feedback, body),
})
