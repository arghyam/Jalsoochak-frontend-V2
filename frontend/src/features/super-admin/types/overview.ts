export interface SuperAdminStats {
  totalStatesManaged: number
  activeStates: number
  inactiveStates: number
}

export interface IngestionDataPoint {
  month: string
  successfulIngestions: number
  failedIngestions: number
}

export interface WaterSupplyOutageData {
  /** State or district name shown on the X-axis under each bar. Prefer state for overview. */
  district: string
  /** When provided, used as the category label instead of district (e.g. state name). */
  state?: string
  electricityFailure: number
  pipelineLeak: number
  pumpFailure: number
  valveIssue: number
  sourceDrying: number
}

export interface SuperAdminOverviewData {
  stats: SuperAdminStats
  ingestionData: IngestionDataPoint[]
  waterSupplyOutages: WaterSupplyOutageData[]
}
