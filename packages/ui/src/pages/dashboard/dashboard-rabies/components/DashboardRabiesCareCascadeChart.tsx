import { useQuery } from '@tanstack/react-query'
import { StackedBar } from '#components/chart'
import DashboardBox from '#pages/dashboard/components/DashboardBox'
import { formatNumberShort } from '#utils/formatter'
import { useTranslation } from 'react-i18next'

import { handleCareCascadeDataChart } from '../dashboard-rabies.helper'
import { getCareCascade } from '../dashboard-rabies.service'
import { CareCascadeParams } from '../dashboard-rabies.type'
import DashboardRabiesLastUpdated from './DashboardRabiesLastUpdated'

export type Props = {
  enabled?: boolean
  params: CareCascadeParams
}

export default function DashboardRabiesCareCascadeChart({
  enabled,
  params,
}: Props) {
  const {
    t,
    i18n: { language },
  } = useTranslation('dashboardRabies')

  const {
    data: dataSource,
    isLoading,
    isFetching,
  } = useQuery({
    queryKey: ['rabies-care-cascade', params],
    queryFn: () => getCareCascade(params),
    enabled,
  })

  const chartData = handleCareCascadeDataChart(
    t,
    dataSource?.data ?? [],
    params?.vaccine_method
  )

  return (
    <div className="ui-space-y-4">
      <DashboardBox.Content
        className="ui-h-96"
        isEmpty={!dataSource?.data?.length}
        isLoading={isLoading || isFetching}
      >
        <StackedBar
          data={chartData}
          options={{
            scales: {
              y: {
                grace: '10%',
                ticks: {
                  callback(tickValue: number) {
                    return formatNumberShort(tickValue, language)
                  },
                },
              },
            },
            plugins: {
              legend: {
                display: true,
              },
              datalabels: {
                display: false,
              },
              tooltip: {
                callbacks: {
                  label: function (context) {
                    const label = context?.dataset?.label
                    const value = context.parsed.y ?? context.raw
                    return `${label}: ${formatNumberShort(value, language)}`
                  },
                },
              },
            },
          }}
        />
      </DashboardBox.Content>
      <DashboardRabiesLastUpdated date={dataSource?.last_updated} />
    </div>
  )
}
