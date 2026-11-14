import type { HttpClient } from '../http'
import { apiRoutes } from '../api-routes'
import type {
  DraftMessagesRes,
  DraftMessageRes,
  MessageDeleteRes,
  SentMessageRes,
  SentMessagesRes,
  ScheduledMessageRes,
  ScheduledMessagesRes,
  ScheduledStatusRes,
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
  fetchScheduledMessages: (page: number) =>
    http.get<ScheduledMessagesRes>(apiRoutes.message.scheduleds(page)),
  fetchScheduledMessage: (scheduledId: number) =>
    http.get<ScheduledMessageRes>(apiRoutes.message.scheduled(scheduledId)),
  deleteScheduledMessage: (scheduledId: number) =>
    http.post<MessageDeleteRes>(apiRoutes.message.deleteScheduled, {
      messageids: scheduledId,
    }),
  resumeScheduledMessage: (scheduledId: number) =>
    http.post<ScheduledStatusRes>(
      apiRoutes.message.resumeScheduled(scheduledId),
    ),
  pauseScheduledMessage: (scheduledId: number) =>
    http.post<ScheduledStatusRes>(
      apiRoutes.message.pauseScheduled(scheduledId),
    ),
})
