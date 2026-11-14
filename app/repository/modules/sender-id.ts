import type { HttpClient } from '../http'
import { apiRoutes } from '../api-routes'
import type {
  SenderIdRes,
  CreateSenderIdRes,
  DeleteSenderIdRes,
} from '@/types/sender-id'

export const SenderIdApi = (http: HttpClient) => ({
  fetchSenderIds: () => http.get<SenderIdRes>(apiRoutes.senderId.lists),
  createSenderId: (formData: FormData) =>
    http.post<CreateSenderIdRes>(apiRoutes.senderId.create, formData),
  updateSenderId: (formData: FormData, id: number) =>
    http.patch<CreateSenderIdRes>(apiRoutes.senderId.update(id), formData),
  deleteSenderId: (senderName: string) =>
    http.post<DeleteSenderIdRes>(apiRoutes.senderId.delete, {
      sender_name: senderName,
    }),
})
