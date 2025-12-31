import React, { useState } from 'react'
import { yupResolver } from '@hookform/resolvers/yup'
import { parseDate } from '@internationalized/date'
import { Checkbox } from '@repo/ui/components/checkbox'
import { Button } from '#components/button'
import { DateRangePicker } from '#components/date-picker'
import {
  FormControl,
  FormErrorMessage,
  FormLabel,
} from '#components/form-control'
import { OptionType, ReactSelect } from '#components/react-select'
import { BOOLEAN } from '#constants/common'
import { useSetLoadingPopupStore } from '#hooks/useSetLoading'
import useSmileRouter from '#hooks/useSmileRouter'
import dayjs from 'dayjs'
import { Controller, FormProvider, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

import { MONTH } from '../../list/libs/period-of-stock-taking-list.constants'
import { TPeriodOfStockTakingData } from '../../list/libs/period-of-stock-taking-list.type'
import { useSubmitPeriodOfStockTaking } from '../hooks/useSubmitPeriodOfStockTaking'
import {
  generatedMonthOptions,
  generatedYearOptions,
  internationalizedDateFromISO,
  processingForm,
} from '../libs/period-of-stock-taking-form.common'
import {
  PeriodOfStockTakingFormData,
  PeriodOfStockTakingSubmitData,
} from '../libs/period-of-stock-taking-form.type'
import { periodOfStockTakingFormValidation } from '../libs/period-of-stock-taking-form.validation-schema'
import PeriodOfStockTakingSubmitAndActivateConfirmation from './PeriodOfStockTakingSubmitAndActivateConfirmation'

type PeriodOfStockTakingFormProps = {
  data?: TPeriodOfStockTakingData | null
}

const PeriodOfStockTakingForm: React.FC<PeriodOfStockTakingFormProps> = ({
  data,
}) => {
  const {
    t,
    i18n: { language },
  } = useTranslation(['common', 'periodOfStockTaking'])

  const router = useSmileRouter()
  const { action } = router.query
  const methods = useForm({
    mode: 'onChange',
    defaultValues: {
      id: data?.id ? Number(data?.id) : null,
      month_period: data?.month_period
        ? generatedMonthOptions(language).find(
            (option) => Number(option.value) === Number(data?.month_period)
          )
        : null,
      year_period: data?.year_period
        ? generatedYearOptions().find(
            (option) => Number(option.value) === Number(data?.year_period)
          )
        : null,
      status: data?.status ?? 0,
      period_range: {
        start_date: data?.start_date
          ? internationalizedDateFromISO(dayjs(data?.start_date).toISOString())
          : null,
        end_date: data?.end_date
          ? internationalizedDateFromISO(dayjs(data?.end_date).toISOString())
          : null,
      },
    },
    resolver: yupResolver(periodOfStockTakingFormValidation(t)),
  })
  const {
    control,
    watch,
    setValue,
    handleSubmit,
    setError,
    trigger,
    formState: { errors },
  } = methods

  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false)

  const { submitPeriodOfStockTaking, pendingPeriodOfStockTaking } =
    useSubmitPeriodOfStockTaking({ t, language, setError })

  const onSubmit = (data: PeriodOfStockTakingFormData) => {
    const processedData = processingForm(data)
    submitPeriodOfStockTaking(processedData as PeriodOfStockTakingSubmitData)
  }

  const shouldConfirm =
    (action === 'edit' && watch('status') === BOOLEAN.FALSE) ||
    (action !== 'edit' && watch('status') === BOOLEAN.TRUE)

  useSetLoadingPopupStore(pendingPeriodOfStockTaking)

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <PeriodOfStockTakingSubmitAndActivateConfirmation
          open={isConfirmationOpen}
          setOpen={setIsConfirmationOpen}
          onSubmit={handleSubmit(onSubmit)}
        />
        <div className="ui-w-full ui-space-y-6 ui-max-w-form ui-mx-auto ui-border ui-border-neutral-300 ui-rounded-md ui-p-6">
          <h2 className="ui-text-lg ui-font-semibold ui-text-dark-teal ui-mb-6 ui-block">
            {t('periodOfStockTaking:form.stock_taking_period_details')}
          </h2>
          <FormControl className="ui-w-full ui-mb-6">
            <FormLabel htmlFor="month_period" required={action !== 'edit'}>
              {t('periodOfStockTaking:form.month')}
            </FormLabel>
            <Controller
              name="month_period"
              control={control}
              render={({ field }) => (
                <ReactSelect
                  {...field}
                  id="month_period"
                  isClearable
                  isSearchable
                  disabled={action === 'edit'}
                  value={
                    field.value
                      ? {
                          value: field.value?.value ?? null,
                          label:
                            generatedMonthOptions(language).find(
                              (option) =>
                                Number(option.value) ===
                                Number(field.value?.value)
                            )?.label ?? '',
                        }
                      : null
                  }
                  options={generatedMonthOptions(language)}
                  onChange={(option: OptionType) => {
                    field.onChange(option)
                    if (watch('year_period')?.value && option?.value) {
                      setValue(
                        'period_range.start_date',
                        internationalizedDateFromISO(
                          dayjs(
                            `${watch('year_period').value}-${option?.value}-25`
                          ).toISOString()
                        )
                      )
                      setValue(
                        'period_range.end_date',
                        internationalizedDateFromISO(
                          dayjs(
                            `${watch('year_period').value}-${option?.value + 1}-10`
                          ).toISOString()
                        )
                      )
                    }
                  }}
                  placeholder={t('periodOfStockTaking:form.select_month')}
                />
              )}
            />
            {errors?.month_period?.message && (
              <FormErrorMessage>
                {errors?.month_period?.message}
              </FormErrorMessage>
            )}
          </FormControl>
          <FormControl className="ui-w-full ui-mb-6">
            <FormLabel htmlFor="year_period" required={action !== 'edit'}>
              {t('periodOfStockTaking:form.year')}
            </FormLabel>
            <Controller
              name="year_period"
              control={control}
              render={({ field }) => (
                <ReactSelect
                  {...field}
                  id="year_period"
                  isClearable
                  isSearchable
                  disabled={action === 'edit'}
                  options={generatedYearOptions()}
                  onChange={(option: OptionType) => {
                    field.onChange(option)
                    if (watch('month_period')?.value && option?.value) {
                      setValue(
                        'period_range.start_date',
                        internationalizedDateFromISO(
                          dayjs(
                            `${option?.value}-${watch('month_period').value}-25`
                          ).toISOString()
                        )
                      )
                      setValue(
                        'period_range.end_date',
                        internationalizedDateFromISO(
                          dayjs(
                            `${option?.value}-${watch('month_period').value + 1}-10`
                          ).toISOString()
                        )
                      )
                    }
                  }}
                  placeholder={t('periodOfStockTaking:form.select_year')}
                />
              )}
            />
            {errors?.year_period?.message && (
              <FormErrorMessage>
                {errors?.year_period?.message}
              </FormErrorMessage>
            )}
          </FormControl>
          <FormControl className="ui-w-full ui-mb-6">
            <FormLabel htmlFor="period_range" required>
              {t('periodOfStockTaking:form.period_range')}
            </FormLabel>
            <DateRangePicker
              id="period_range_period"
              isDisabled={
                !watch('month_period')?.value || !watch('year_period')?.value
              }
              minValue={
                watch('year_period')?.value && watch('month_period')?.value
                  ? (() => {
                      const monthValue =
                        action !== 'edit'
                          ? watch('month_period')?.value
                          : MONTH.JANUARY
                      return parseDate(
                        `${watch('year_period')?.value}-${String(monthValue).padStart(2, '0')}-01`
                      )
                    })()
                  : undefined
              }
              maxValue={
                watch('year_period')?.value && watch('month_period')?.value
                  ? parseDate(`${watch('year_period')?.value + 1}-12-31`)
                  : undefined
              }
              value={{
                start: watch('period_range.start_date'),
                end: watch('period_range.end_date'),
              }}
              onChange={(value) => {
                setValue('period_range.start_date', value.start)
                setValue('period_range.end_date', value.end)
                trigger('period_range')
              }}
              onBlur={() => trigger('period_range')}
            />
            {errors?.period_range?.message && (
              <FormErrorMessage>
                {errors?.period_range?.message}
              </FormErrorMessage>
            )}
          </FormControl>
          <FormControl className="ui-w-full ui-mb-6">
            <FormLabel htmlFor="status">
              {t('periodOfStockTaking:form.period_activation')}
            </FormLabel>
            <Controller
              name="status"
              control={control}
              render={({ field }) => (
                <Checkbox
                  {...field}
                  id="status_period"
                  checked={field.value === BOOLEAN.TRUE}
                  onChange={(e) => {
                    field.onChange(
                      e.target.checked ? BOOLEAN.TRUE : BOOLEAN.FALSE
                    )
                  }}
                  className="ui-text-sm ui-font-normal"
                  label={t(
                    'periodOfStockTaking:form.activate_period_automatically'
                  )}
                />
              )}
            />
            {errors?.status?.message && (
              <FormErrorMessage>{errors?.status?.message}</FormErrorMessage>
            )}
          </FormControl>
        </div>
        <div className="ui-mt-2 ui-flex ui-justify-end ui-items-end ui-max-w-form ui-mx-auto ui-gap-4">
          <Button
            type="button"
            variant="outline"
            className="ui-mt-4 ui-w-40 ui-text-primary-500 hover:!ui-bg-gray-100"
            onClick={() => {
              router.push('/v5/period-of-stock-taking')
            }}
          >
            {t('common:back')}
          </Button>
          <Button
            type={shouldConfirm ? 'button' : 'submit'}
            variant="solid"
            className="ui-mt-4 ui-w-40 ui-bg-primary-500 ui-text-white hover:ui-bg-primary-600"
            onClick={() => {
              if (shouldConfirm) {
                setIsConfirmationOpen(true)
              }
            }}
          >
            {t('common:save')}
          </Button>
        </div>
      </form>
    </FormProvider>
  )
}

export default PeriodOfStockTakingForm
