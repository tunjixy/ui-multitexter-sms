import type { NetworkUpdate } from '@/types/network-status'

const entries: NetworkUpdate[] = [
  {
    network: 'Airtel Nigeria',
    type: 'notice',
    title: 'SMS delivery with fixed sender for Airtel',
    message:
      'Kindly be informed that all Airtel recipients will receive SMS with a fixed sender ID as determined by the network providers.',
    date: '2024-05-10',
  },
  {
    network: 'MTN Nigeria',
    type: 'disruption',
    title: 'Network instability',
    message:
      'Please be aware that the MTN Nigeria network is currently unstable. Consequently, there is a high chance that SMS messages sent to or from numbers on the MTN network may not be delivered successfully.',
    date: '2024-03-13',
  },
  {
    network: 'MTN Nigeria',
    type: 'restriction',
    title: 'Delivery restriction time',
    message:
      'Please be aware that any SMS sent to non-DND MTN numbers after 8pm will be delivered the next day by 8am. This restriction has been implemented by the network provider.',
    date: '2023-01-30',
  },
  {
    network: 'MTN Nigeria',
    type: 'notice',
    title: 'DND numbers to receive with numeric IDs',
    message:
      'Please be informed that all non-bank SMS sent to DND numbers will be delivered using a fixed numeric sender ID, unless your sender ID has already been registered with the NCC.',
    date: '2022-03-16',
  },
]

const updates = [...entries].sort((a, b) => b.date.localeCompare(a.date))

const formatDate = (date: string) =>
  new Date(`${date}T12:00:00Z`).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'Africa/Lagos',
  })

export default function useNetworkStatus() {
  return { updates, formatDate }
}
