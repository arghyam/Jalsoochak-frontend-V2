import { describe, expect, it, jest } from '@jest/globals'
import { screen } from '@testing-library/react'
import { renderWithProviders } from '@/test/render-with-providers'
import type { DashboardData } from '../types'
import { CentralDashboard } from './central-dashboard'
import { useDashboardData } from '../hooks/use-dashboard-data'

jest.mock('react-router-dom', () => ({
  useNavigate: () => jest.fn(),
}))

jest.mock('../hooks/use-dashboard-data', () => ({
  useDashboardData: jest.fn(),
}))

jest.mock('./filters/dashboard-filters', () => ({
  DashboardFilters: () => <div data-testid="dashboard-filters" />,
}))

jest.mock('./kpi-card', () => ({
  KPICard: ({ title }: { title: string }) => <div>{title}</div>,
}))

jest.mock('./charts', () => ({
  IndiaMapChart: () => <div data-testid="india-map-chart" />,
}))

jest.mock('./screens/dashboard-body', () => ({
  DashboardBody: () => <div data-testid="dashboard-body" />,
}))

jest.mock('./tables', () => ({
  AllStatesTable: () => <div data-testid="all-states-table" />,
}))

const mockDashboardData: DashboardData = {
  level: 'central',
  kpis: {
    totalSchemes: 100,
    totalRuralHouseholds: 1000,
    functionalTapConnections: 800,
  },
  mapData: [
    {
      id: 'st-1',
      name: 'Alpha',
      coverage: 65,
      regularity: 72,
      continuity: 0,
      quantity: 54,
      compositeScore: 64,
      status: 'needs-attention',
    },
  ],
  demandSupply: [{ period: 'Jan', demand: 100, supply: 90 }],
  imageSubmissionStatus: [{ label: 'On time', value: 80 }],
  photoEvidenceCompliance: [
    {
      id: 'pe-1',
      name: 'Operator 1',
      village: 'Village 1',
      lastSubmission: '2026-02-20',
      readingValue: '123',
    },
  ],
  pumpOperators: [{ label: 'Active', value: 12 }],
  waterSupplyOutages: [
    {
      district: 'District 1',
      electricityFailure: 1,
      pipelineLeak: 1,
      pumpFailure: 1,
      valveIssue: 1,
      sourceDrying: 1,
    },
  ],
  topPerformers: [],
  worstPerformers: [],
  regularityData: [],
  continuityData: [],
}

describe('CentralDashboard', () => {
  it('renders Overall Performance table panel for central view', () => {
    ;(useDashboardData as jest.Mock).mockReturnValue({
      data: mockDashboardData,
      isLoading: false,
      error: null,
    })

    renderWithProviders(<CentralDashboard />)

    expect(screen.getByText('Overall Performance')).toBeTruthy()
    expect(screen.getByTestId('all-states-table')).toBeTruthy()
    expect(screen.queryByText('Core Metrics')).toBeNull()
  })
})
