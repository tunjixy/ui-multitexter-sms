import type { HttpClient } from '../http'
import { apiRoutes } from '../api-routes'
import type {
  UnsubscribeReq,
  UnsubscribeRes,
  SenderNameReq,
  SenderNameRes,
} from '@/types/misc'

export const miscApi = (http: HttpClient) => ({
  unsubscribe: (body: UnsubscribeReq) =>
    http.post<UnsubscribeRes>(apiRoutes.misc.unsubscribe, body),
  senderNameRequest: (body: SenderNameReq) =>
    http.post<SenderNameRes>(apiRoutes.misc.senderNameRequest, body),
})
