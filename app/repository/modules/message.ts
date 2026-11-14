import type { HttpClient } from '../http'
import { apiRoutes } from '../api-routes'
import type {
  DraftMessagesRes,
  DraftMessageRes,
  MessageDeleteRes,
  SentMessageRes,
  SentMessagesRes,
} from '@/types/message'

export const MessageApi = (http: HttpClient) => ({
  fetchDrafts: (page: number) =>
    http.get<DraftMessagesRes>(apiRoutes.message.drafts(page)),
  fetchDraft: (draftId: number) =>
    http.get<DraftMessageRes>(apiRoutes.message.draft(draftId)),
  deleteDraft: (draftId: number) =>
    http.post<MessageDeleteRes>(apiRoutes.message.deleteDraft(draftId)),
  fetchSentMessages: (page: number) =>
    http.get<SentMessagesRes>(apiRoutes.message.sents(page)),
  fetchSentMessage: (sentId: number) =>
    http.get<SentMessageRes>(apiRoutes.message.sent(sentId)),
  deleteSentMessage: (sentId: number) =>
    http.post<MessageDeleteRes>(apiRoutes.message.deleteSent, {
      messageids: sentId,
    }),
})
