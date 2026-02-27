import { useRef, useEffect } from 'react'
import * as echarts from 'echarts'
import type { EChartsOption } from 'echarts'

interface EChartsWrapperProps {
  option: EChartsOption
  className?: string
  height?: string | number
  onChartReady?: (chart: echarts.ECharts) => void
}

export function EChartsWrapper({
  option,
  className,
  height = '400px',
  onChartReady,
}: EChartsWrapperProps) {
  const chartRef = useRef<HTMLDivElement>(null)
  const chartInstanceRef = useRef<echarts.ECharts | null>(null)

  useEffect(() => {
    if (!chartRef.current) return

    if (!chartInstanceRef.current) {
      chartInstanceRef.current = echarts.init(chartRef.current)
      onChartReady?.(chartInstanceRef.current)
    }

    const chart = chartInstanceRef.current
    chart.setOption(option, true)
  }, [option, onChartReady])

  useEffect(() => {
    const chart = chartInstanceRef.current
    if (!chart) return

    const handleResize = () => {
      chart.resize()
    }
    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  useEffect(() => {
    const chart = chartInstanceRef.current
    if (!chart || !chartRef.current) return

    const resizeObserver = new ResizeObserver(() => {
      chart.resize()
    })

    resizeObserver.observe(chartRef.current)

    return () => {
      resizeObserver.disconnect()
    }
  }, [])

  useEffect(() => {
    return () => {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.dispose()
        chartInstanceRef.current = null
      }
    }
  }, [])

  return (
    <div
      ref={chartRef}
      className={className}
      style={{
        width: '100%',
        height: typeof height === 'number' ? `${height}px` : height,
      }}
    />
  )
}
