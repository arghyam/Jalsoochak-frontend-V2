import { useDashboardQuery } from '../services/query/use-dashboard-query'
import type { DashboardLevel } from '../types'

export function useDashboardData(level: DashboardLevel, entityId?: string) {
  return useDashboardQuery(level, entityId)
}
