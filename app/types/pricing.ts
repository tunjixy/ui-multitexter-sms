export interface Price {
  id: number
  title: string
  minimum_units: number
  maximum_units: number
  price: number
  currency: string
}

export interface PriceRes {
  data: Price[]
  status: number
}
