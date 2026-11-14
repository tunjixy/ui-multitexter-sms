import { apiClient } from '@/repository/api'
import type { VerifiedSender } from '@/types/message'

export default function useSenderIds() {
  const senderIds = useState<VerifiedSender[] | null>('sender-ids', () => null)

  const fetchSenderIds = async () => {
    try {
      const response = await apiClient.message.fetchSenderId()
      senderIds.value = response.status === 1 ? (response.data ?? []) : []
    } catch {
      //
    }
  }

  return { senderIds, fetchSenderIds }
}
