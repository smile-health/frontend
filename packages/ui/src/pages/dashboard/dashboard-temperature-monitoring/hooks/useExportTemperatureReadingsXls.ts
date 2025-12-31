import { useMutation } from '@tanstack/react-query'
import { OptionType } from '#components/react-select'
import { useSetLoadingPopupStore } from '#hooks/useSetLoading'
import { removeEmptyObject } from '#utils/object'

import {
  GetExcursionParams,
  WhoPqsStatus,
} from '../dashboard-temperature-monitoring.types'
import { temperatureMonitoringDashboardService } from '../services/dashboard-temperature-monitoring.service'

type ExcursionFilterState = {
  excursion_durations: OptionType[]
  temp_min_max: OptionType | null
  is_pqs: WhoPqsStatus | null
}

type Props = {
  params: GetExcursionParams
  excursionFilter: ExcursionFilterState
}

export default function useExportTemperatureReadingsXls({
  params,
  excursionFilter,
}: Props) {
  const apiParams = removeEmptyObject({
    from: params?.from?.toString(),
    to: params?.to?.toString(),
    province_id: params?.province_id,
    regency_id: params?.regency_id,
    entity_id: params?.entity_id,
    entity_tag_ids: params?.entity_tag_ids,
    type_ids: params?.type_ids,
    excursion_durations: excursionFilter.excursion_durations
      ?.map((d) => d.value)
      .join(','),
    temp_min_max: excursionFilter.temp_min_max?.value,
    is_pqs: excursionFilter.is_pqs ?? undefined,
  })

  const { mutate, isPending } = useMutation({
    mutationKey: ['temperature-readings-export-xls', apiParams],
    mutationFn: () =>
      temperatureMonitoringDashboardService.exportXls(apiParams),
  })

  useSetLoadingPopupStore(isPending)

  return {
    exportXls: mutate,
    isExporting: isPending,
  }
}
