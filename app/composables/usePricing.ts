import type { Price } from '@/types/pricing'

export default function usePricing() {
  const prices = useState<Price[] | null>('prices', () => null)
  const priceNotes = [
    'The minimum payment is ₦500 via bank deposit and transfer. Any payment less than this will not be considered.',
    'Please note that 2 units are charged per SMS page to all networks except T2',
  ]

  return {
    prices,
    priceNotes,
  }
}
