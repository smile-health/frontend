import { useQuery } from '@tanstack/react-query'
import { StackedBar } from '#components/chart'
import DashboardBox from '#pages/dashboard/components/DashboardBox'
import { formatNumberShort } from '#utils/formatter'
import dayjs from 'dayjs'
import { useTranslation } from 'react-i18next'

import { getMonthlyPatientDose } from '../dashboard-rabies.service'
import { MonthlyPatientDoseParams } from '../dashboard-rabies.type'
import DashboardRabiesLastUpdated from './DashboardRabiesLastUpdated'

export type Props = {
  enabled?: boolean
  params: MonthlyPatientDoseParams
}

export default function DashboardRabiesMonthlyPatientDoseChart({
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
    queryKey: ['rabies-monthly-patient-dose', params],
    queryFn: () => getMonthlyPatientDose(params),
    enabled,
  })

  const labels = dataSource?.data?.map((item) => {
    return dayjs(`${item?.year}-${item?.month}`).format('MMM YYYY')
  })

  const chartData = {
    labels,
    datasets: [
      {
        label: t('label.total_patient'),
        data: dataSource?.data?.map((item) => item?.total_patient),
        backgroundColor: '#06B051',
      },
      {
        label: t('label.total_dose'),
        data: dataSource?.data?.map((item) => item?.total_dose),
        backgroundColor: '#1BA8DF',
      },
    ],
  }

  return (
    <div className="ui-space-y-4">
      <DashboardBox.Content
        className="ui-h-96"
        isEmpty={!dataSource?.data?.length}
        isLoading={isLoading || isFetching}
      >
        <StackedBar
          data={chartData}
          isStacked={false}
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
                anchor: 'end',
                align: 'end',
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
