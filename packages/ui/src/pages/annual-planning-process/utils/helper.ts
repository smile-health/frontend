import { TFunction } from 'i18next'

import { GetDetailAnnualPlanningProcessResponse } from '../annual-planning-process.types'

export const generateAnnualPlanningDetail = (
  t: TFunction<['annualPlanningProcess', 'common']>,
  data?: GetDetailAnnualPlanningProcessResponse
) => {
  return [
    {
      label: t('common:form.province.label'),
      value: data?.province?.name ?? '-',
      id: 'detail-information-province-name',
    },
    {
      label: t('common:form.city.label'),
      value: data?.regency?.name ?? '-',
      id: 'detail-information-city-name',
    },
    {
      label: t('annualPlanningProcess:list.filter.program_plan.label'),
      value: data?.program_plan?.year ?? '-',
      id: 'detail-information-program-plan-year',
    },
  ]
}
