import { useQuery } from '@tanstack/react-query'
import { StackedLineChart } from '#components/chart'
import DashboardBox from '#pages/dashboard/components/DashboardBox'
import dayjs from 'dayjs'
import { useTranslation } from 'react-i18next'

import { handleMonthlyVaccineSequenceGroup } from '../dashboard-rabies.helper'
import { getMonthlyVaccineSequence } from '../dashboard-rabies.service'
import { DashboardRabiesWithAdditionalParams } from '../dashboard-rabies.type'
import DashboardRabiesLastUpdated from './DashboardRabiesLastUpdated'

export type Props = {
  enabled?: boolean
  params: DashboardRabiesWithAdditionalParams
}

export default function DashboardRabiesMonthlyVaccineSequenceChart({
  enabled,
  params,
}: Props) {
  const { t } = useTranslation('dashboardRabies')

  const {
    data: dataSource,
    isLoading,
    isFetching,
  } = useQuery({
    queryKey: ['rabies-monthly-vaccine-sequence', params],
    queryFn: () => getMonthlyVaccineSequence(params),
    enabled,
  })

  const labels = dataSource?.data?.map((item) => {
    return dayjs(`${item?.year}-${item?.month}`).format('MMM YYYY')
  })

  const vaccineSequence = handleMonthlyVaccineSequenceGroup(
    t,
    params?.vaccine_method
  )

  const series = vaccineSequence.map((vaccine) => {
    return {
      name: vaccine.label,
      data: dataSource?.data?.map((item) => item?.[vaccine.key]),
      color: vaccine.color,
    }
  })

  return (
    <div className="ui-space-y-4">
      <DashboardBox.Content
        className="ui-h-96"
        isEmpty={!dataSource?.data?.length}
        isLoading={isLoading || isFetching}
      >
        <StackedLineChart
          labels={labels ?? []}
          series={series ?? []}
          className="ui-text-start"
        />
      </DashboardBox.Content>
      <DashboardRabiesLastUpdated date={dataSource?.last_updated} />
    </div>
  )
}
