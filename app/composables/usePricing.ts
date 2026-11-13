import { apiClient } from '@/repository/api'
import type { Price } from '@/types/pricing'

export const sortPrices = (list: Price[]) =>
  [...list].sort((a, b) => a.minimum_units - b.minimum_units)

export default function usePricing() {
  const prices = useState<Price[] | null>('prices', () => null)
  const priceNotes = [
    'The minimum payment is ₦500 via bank deposit and transfer. Any payment less than this will not be considered.',
    'Please note that 2 units are charged per SMS page to all networks except T2',
  ]

  const fetchPrices = async () => {
    if (prices.value?.length) return
    try {
      const response = await apiClient.payment.fetchPrices()
      prices.value = response.status === 1 ? sortPrices(response.data) : []
    } catch {
      prices.value = []
    }
  }

  return {
    prices,
    priceNotes,
    fetchPrices,
  }
}
