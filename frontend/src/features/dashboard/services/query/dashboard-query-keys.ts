import type { DashboardLevel } from '../../types'

export const dashboardQueryKeys = {
  all: ['dashboard'] as const,
  data: (level: DashboardLevel, entityId?: string) =>
    ['dashboard', 'data', level, entityId] as const,
}
