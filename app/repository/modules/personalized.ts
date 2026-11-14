import type { HttpClient } from '../http'
import { apiRoutes } from '../api-routes'
import type {
  UploadTemplateRes,
  PreviewMessageReq,
  PreviewMessageRes,
  SendMessageReq,
  SendMessageRes,
} from '@/types/personalized'

export const PersonalizedApi = (http: HttpClient) => ({
  uploadTemplateFile: (formData: FormData) =>
    http.post<UploadTemplateRes>(apiRoutes.personalized.upload, formData),
  previewMessage: (body: PreviewMessageReq) =>
    http.post<PreviewMessageRes>(apiRoutes.personalized.preview, {
      fileurl: body.url,
      filename: body.filename,
      message: body.message,
    }),
  sendMessage: (body: SendMessageReq) =>
    http.post<SendMessageRes>(apiRoutes.personalized.send, {
      fileurl: body.fileUrl,
      filename: body.filename,
      message: body.message,
      displayname: body.displayname,
      forcednd: body.dnd,
    }),
})
