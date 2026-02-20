import { useQuery } from '@tanstack/react-query'
import { dashboardApi } from '../api/dashboard-api'
import type { DashboardData, DashboardLevel } from '../../types'
import { dashboardQueryKeys } from './dashboard-query-keys'

export function useDashboardQuery(level: DashboardLevel, entityId?: string) {
  return useQuery<DashboardData>({
    queryKey: dashboardQueryKeys.data(level, entityId),
    queryFn: () => dashboardApi.getDashboardData({ level, entityId }),
  })
}
