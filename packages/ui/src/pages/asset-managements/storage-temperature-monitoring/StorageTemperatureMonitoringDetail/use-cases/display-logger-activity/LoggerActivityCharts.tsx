import { useMemo } from 'react'
import { StackedLineChart } from '#components/chart'
import DashboardBox from '#pages/dashboard/components/DashboardBox'
import { formatDateWithoutTimezone } from '#utils/date'
import { numberFormatter } from '#utils/formatter'
import { LineSeriesOption } from 'echarts/charts'
import { useTranslation } from 'react-i18next'

import {
  humidityThreshold,
  LoggerActivityTab,
} from '../../storage-temperature-monitoring-detail.constants'
import { useStorageTemperatureMonitoringDetail } from '../../StorageTemperatureMonitoringDetailContext'

export const LoggerActivityCharts = () => {
  const {
    t,
    i18n: { language },
  } = useTranslation(['storageTemperatureMonitoringDetail'])
  const { data, sortedHistoryData, isLoadingHistory, activeTab } =
    useStorageTemperatureMonitoringDetail()

  const labels = useMemo(() => {
    const items = sortedHistoryData ?? []

    return items
      .map((item) =>
        formatDateWithoutTimezone(item.actual_time, 'DD/MM/YYYY HH:mm')
      )
      .sort((a, b) => a.localeCompare(b))
  }, [sortedHistoryData])

  const activeThreshold: any = useMemo(() => {
    if (activeTab === LoggerActivityTab.Humidity) {
      return {
        min: humidityThreshold.min,
        max: humidityThreshold.max,
        is_active: 1,
      }
    }

    const threshold = data?.asset_type?.temperature_thresholds?.find((t) => {
      if (t.is_active) {
        return {
          min: t?.min_temperature ?? 0,
          max: t?.max_temperature ?? 0,
          is_active: t?.is_active ?? 0,
        }
      }
    })

    return (
      threshold ?? {
        min: data?.other_min_temperature ?? 0,
        max: data?.other_max_temperature ?? 0,
        is_active: 1,
      }
    )
  }, [data, activeTab])

  const series: LineSeriesOption[] = useMemo(() => {
    const items = sortedHistoryData ?? []
    const measuredSeries: LineSeriesOption = {
      name:
        activeTab === LoggerActivityTab.Temperature
          ? t(
              'storageTemperatureMonitoringDetail:logger_activity.activity_table.columns.temperature'
            )
          : t(
              'storageTemperatureMonitoringDetail:logger_activity.activity_table.columns.humidity'
            ),
      data:
        activeTab === LoggerActivityTab.Temperature
          ? items.map((item) => Number(item?.temperature ?? 0))
          : items.map((item) => Number(item?.humidity ?? 0)),
      label: {
        show: true,
        formatter: (params: any) =>
          numberFormatter(Number(params?.value), language),
      },
      color:
        activeTab === LoggerActivityTab.Temperature ? '#7C3AED' : '#14B8A6',
    }

    const minValue = Number(
      activeThreshold?.min ?? activeThreshold?.min_temperature ?? 0
    )
    const maxValue = Number(
      activeThreshold?.max ?? activeThreshold?.max_temperature ?? 0
    )
    const lowerThresholdSeries: LineSeriesOption = {
      name: t(
        'storageTemperatureMonitoringDetail:logger_activity.chart.lower_threshold'
      ),
      data: labels.map(() => minValue),
      lineStyle: { type: 'dashed' },
      label: { show: false },
      color:
        activeTab === LoggerActivityTab.Temperature ? '#51a2ff' : '#F59E0B',
      symbol: 'none',
      showSymbol: false,
    }

    const upperThresholdSeries: LineSeriesOption = {
      name: t(
        'storageTemperatureMonitoringDetail:logger_activity.chart.upper_threshold'
      ),
      data: labels.map(() => maxValue),
      lineStyle: { type: 'dashed' },
      label: { show: false },
      color:
        activeTab === LoggerActivityTab.Temperature ? '#fb2c36' : '#EF4444',
      symbol: 'none',
      showSymbol: false,
    }

    return [measuredSeries, lowerThresholdSeries, upperThresholdSeries]
  }, [sortedHistoryData, activeThreshold, labels, language, t, activeTab])

  const isUseSlider = labels?.length > 8

  return (
    <DashboardBox.Root
      id={`${activeTab === LoggerActivityTab.Temperature ? 'temperature' : 'humidity'}-logger-activity-charts`}
    >
      <DashboardBox.Body>
        <DashboardBox.Config
          download={{
            targetElementId: `${activeTab === LoggerActivityTab.Temperature ? 'temperature' : 'humidity'}-logger-activity-charts`,
            fileName:
              `${activeTab === LoggerActivityTab.Temperature ? 'Temperature' : 'Humidity'} Logger Activity`.toUpperCase(),
          }}
          withDownloadAction={true}
          withRegionSection={false}
        />
        <DashboardBox.Content
          isLoading={isLoadingHistory}
          isEmpty={!series?.length}
        >
          <div className="ui-h-96">
            <StackedLineChart
              labels={labels}
              series={series}
              maxVisible={8}
              options={{
                tooltip: {
                  trigger: 'axis',
                  formatter: undefined,
                },
                legend: {
                  bottom: isUseSlider ? 60 : 20,
                  icon: 'circle',
                  textStyle: {
                    fontSize: 14,
                  },
                },
                grid: {
                  bottom: isUseSlider ? 100 : 60,
                },
                yAxis: {
                  axisLabel: {
                    formatter: (value: number) =>
                      numberFormatter(value, language),
                  },
                },
              }}
              className="ui-text-start"
            />
          </div>
        </DashboardBox.Content>
      </DashboardBox.Body>
    </DashboardBox.Root>
  )
}
