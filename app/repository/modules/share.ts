import type { HttpClient } from '../http'
import { apiRoutes } from '../api-routes'
import type { SharedRes, ShareUnitReq, ShareUnitRes } from '@/types/share'

export const ShareApi = (http: HttpClient) => ({
  fetchSharedList: () => http.get<SharedRes>(apiRoutes.share.lists),
  transferUnit: (body: ShareUnitReq) =>
    http.post<ShareUnitRes>(apiRoutes.share.transfer, {
      recipient: body.to,
      amount: body.numberOfUnit,
    }),
})
