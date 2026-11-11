export type NetworkUpdateType = 'disruption' | 'restriction' | 'notice'

export interface NetworkUpdate {
  network: string
  type: NetworkUpdateType
  title: string
  message: string
  date: string
}
