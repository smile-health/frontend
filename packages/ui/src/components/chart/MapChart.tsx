import { useEffect, useRef } from 'react'
import { useQuery } from '@tanstack/react-query'
import { MapChart as EMapChart } from 'echarts/charts'
import {
  GeoComponent,
  TooltipComponent,
  VisualMapComponent,
} from 'echarts/components'
import * as echarts from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'

import { MapName, MapOptions } from './chart.type'

echarts.use([
  EMapChart,
  TooltipComponent,
  VisualMapComponent,
  GeoComponent,
  CanvasRenderer,
])

type Datum<T> = T & { value: number; name: string }

type Props<T> = Readonly<{
  data?: Datum<T>[]
  location?: MapName
  onClick?: (item: Datum<T>) => void
  color?: string[]
}>

async function getGeoMaps(map: string) {
  const res = await fetch(`/api/geomaps/${map}`)
  return await res.json()
}

export default function MapChart<T>({
  data,
  location = 'indonesia',
  onClick,
  color,
}: Props<T>) {
  const chartRef = useRef<HTMLDivElement | null>(null)
  const chartInstance = useRef<echarts.EChartsType | null>(null)
  const resizeObserver = useRef<ResizeObserver | null>(null)

  const { data: geoData } = useQuery({
    queryKey: ['geomaps', location],
    queryFn: () => getGeoMaps(location),
    enabled: !!location,
  })

  // 🔧 Chart option generator
  const getChartOption = (geoName: string): MapOptions => ({
    tooltip: {
      trigger: 'item',
      formatter: (params: any) => {
        const name = params.name ?? ''
        const value = params.value

        // kalau value null / undefined / NaN
        if (value == null || Number.isNaN(value)) {
          return name
        }

        return `${name}: ${value}`
      },
    },
    visualMap: {
      type: 'piecewise',
      splitNumber: 5,
      pieces: [
        { min: 90, label: '90-100%' },
        { min: 50, max: 89.99, label: '50-90%' },
        { min: 25, max: 49.99, label: '25-50%' },
        { min: 10, max: 24.99, label: '10-25%' },
        { min: 0.01, max: 9.99, label: '0-10%' },
      ],
      orient: 'horizontal',
      left: 'center',
      itemSymbol: 'circle',
      top: 0,
      itemWidth: 20,
      itemHeight: 14,
      itemGap: 16,
      textGap: 2,
      inRange: { color },
      outOfRange: { color: '#F3F4F6' },
      textStyle: {
        fontSize: 12,
      },
    },
    series: [
      {
        name: 'Location',
        type: 'map',
        map: geoName,
        selectedMode: false,
        itemStyle: {
          areaColor: '#F3F4F6',
          borderColor: '#073B4C',
        },
        label: {
          fontSize: 10,
          color: '#404040',
        },
        emphasis: {
          label: { show: false },
        },
        data,
      },
    ],
  })

  // 🔁 Init chart once
  useEffect(() => {
    if (!chartRef.current || chartInstance.current) return

    const chart = echarts.init(chartRef.current)
    chartInstance.current = chart

    // Auto resize
    resizeObserver.current = new ResizeObserver(() => chart.resize())
    resizeObserver.current.observe(chartRef.current)

    return () => {
      chart.dispose()
      chartInstance.current = null
      resizeObserver.current?.disconnect()
    }
  }, [])

  // 🧠 Rebind onClick listener when it changes
  useEffect(() => {
    const chart = chartInstance.current
    if (!chart || !onClick) return

    const handler = (params: any) => {
      const item = params?.data
      if (item?.id) onClick(item)
    }

    chart.on('click', handler)
    return () => {
      chart.off('click', handler)
    }
  }, [onClick])

  // ⚙️ Apply geo map and option when data changes
  useEffect(() => {
    if (!geoData || !chartInstance.current) return
    echarts.registerMap(location, geoData)
    chartInstance.current.setOption(getChartOption(location), true)
    chartInstance.current.resize()
  }, [geoData, location, data, color])

  return <div ref={chartRef} style={{ width: '100%', height: '100%' }} />
}
