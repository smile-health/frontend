import { OptionType } from '#components/react-select'
import { TFunction } from 'i18next'
import { FieldError, FieldPath, FieldValues } from 'react-hook-form'

export type PeriodOfStockTakingFormData = {
  id?: number
  month_period: OptionType
  year_period: OptionType
  period_range: {
    start_date: string
    end_date: string
  }
  status: number
}

export type PeriodOfStockTakingSubmitData = {
  id?: number
  month_period: number
  year_period: number
  start_date: string
  end_date: string
  status: number
}

export type TUseSubmitPeriodOfStockTakingReturnProps = {
  t: TFunction<['common', 'periodOfStockTaking']>
  language: string
  setError: <TFieldName extends FieldPath<FieldValues>>(
    name: TFieldName,
    error: FieldError,
    options?: {
      shouldFocus?: boolean
    }
  ) => void
}
