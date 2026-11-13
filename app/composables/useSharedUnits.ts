import { apiClient } from '@/repository/api'
import type { Shared } from '@/types/share'

export default function useSharedUnits() {
  const shares = useState<Shared[] | null>('shared-units', () => null)
  const error = useState('shared-units-error', () => false)

  const fetchSharedUnits = async () => {
    try {
      error.value = false
      const response = await apiClient.share.fetchSharedList()
      shares.value = response.status === 1 ? (response.data ?? []) : []
    } catch {
      error.value = true
    }
  }

  return { shares, error, fetchSharedUnits }
}
