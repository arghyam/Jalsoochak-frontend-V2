import { describe, expect, it, jest, beforeAll } from '@jest/globals'
import { screen } from '@testing-library/react'
import { renderWithProviders } from '@/test/render-with-providers'
import type { EntityPerformance } from '../../types'
import { MetricPerformanceChart } from './metric-performance-chart'

jest.mock('./echarts-wrapper', () => ({
  EChartsWrapper: () => <div data-testid="echarts-wrapper" />,
}))

beforeAll(() => {
  class ResizeObserverMock {
    observe() {}
    unobserve() {}
    disconnect() {}
  }

  Object.defineProperty(globalThis, 'ResizeObserver', {
    writable: true,
    value: ResizeObserverMock,
  })

  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: (query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: () => {},
      removeListener: () => {},
      addEventListener: () => {},
      removeEventListener: () => {},
      dispatchEvent: () => false,
    }),
  })
})

const chartData: EntityPerformance[] = [
  {
    id: 's1',
    name: 'Andhra Pradesh',
    coverage: 52,
    regularity: 53,
    continuity: 0,
    quantity: 45,
    compositeScore: 58,
    status: 'needs-attention',
  },
  {
    id: 's2',
    name: 'Arunachal Pradesh',
    coverage: 86,
    regularity: 87,
    continuity: 0,
    quantity: 82,
    compositeScore: 79,
    status: 'good',
  },
]

describe('MetricPerformanceChart', () => {
  it('renders area+bar legends when area line is enabled', () => {
    renderWithProviders(
      <MetricPerformanceChart
        data={chartData}
        metric="quantity"
        yAxisLabel="Quantity"
        entityLabel="States/UTs"
        showAreaLine
        areaSeriesName="Demand"
        seriesName="Quantity"
      />
    )

    expect(screen.getAllByText('Quantity').length).toBeGreaterThanOrEqual(1)
    expect(screen.getByText('States/UTs')).toBeTruthy()
    expect(screen.getByText('Demand')).toBeTruthy()
    expect(screen.getAllByTestId('echarts-wrapper')).toHaveLength(2)
  })

  it('renders only metric legend when area line is disabled', () => {
    renderWithProviders(
      <MetricPerformanceChart
        data={chartData}
        metric="regularity"
        yAxisLabel="Regularity"
        seriesName="Regularity"
      />
    )

    expect(screen.getAllByText('Regularity').length).toBeGreaterThanOrEqual(1)
    expect(screen.queryByText('Demand')).toBeNull()
  })
})
