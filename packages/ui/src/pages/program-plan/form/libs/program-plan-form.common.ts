import { OptionType } from '#components/react-select'
import { TFunction } from 'i18next'

import { PROGRAM_PLAN_APPROACH } from './program-plan-form.constant'
import { ProgramPlanSubmitForm } from './program-plan-form.type'

const LIMIT_YEAR = 100

export const generatedYearOptions = (
  yearsDisabled: number[] = [],
  t?: TFunction
): Array<OptionType> => {
  const nextYear = new Date().getFullYear() + LIMIT_YEAR
  const startYear = new Date().getFullYear()
  const options = []

  for (let i = startYear; i <= nextYear; i++) {
    const year = t ? `${i.toString()} (${t('status.active')})` : i.toString()
    options.push({
      value: i,
      label: yearsDisabled.includes(i) ? year : i.toString(),
      isDisabled: yearsDisabled.includes(i),
    })
  }

  return options
}

export const processPayload = (data: ProgramPlanSubmitForm) => {
  return {
    year: data.year.value?.toString() ?? '',
    approach_id: PROGRAM_PLAN_APPROACH.VACCINATION,
  }
}
