export interface Coverage {
  country: string
  networkcount: number
}

export interface CoverageRes {
  data: Coverage[]
  status: number
}
