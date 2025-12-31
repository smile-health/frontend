import dayjs from 'dayjs'
import { TFunction } from 'i18next'
import * as Yup from 'yup'

export const periodOfStockTakingFormValidation = (
  t: TFunction<['common', 'periodOfStockTaking']>
) =>
  Yup.object().shape({
    month_period: Yup.object()
      .shape({
        value: Yup.string(),
        label: Yup.string(),
      })
      .required(t('common:validation.required')),
    year_period: Yup.object()
      .shape({
        value: Yup.string(),
        label: Yup.string(),
      })
      .required(t('common:validation.required')),
    period_range: Yup.object()
      .shape({
        start_date: Yup.string(),
        end_date: Yup.string(),
      })
      .nullable()
      .test({
        name: 'period-range-required',
        test: function (value) {
          const { path, createError } = this
          if (!!value?.start_date && !!value?.end_date) {
            return true
          }
          return createError({
            path,
            message: t('common:validation.required'),
          })
        },
      })
      .test({
        name: 'start-date-before-end-date',
        test: function (value) {
          const { path, createError } = this
          if (
            dayjs(value?.start_date).isBefore(dayjs(value?.end_date)) ||
            dayjs(value?.start_date).isSame(dayjs(value?.end_date))
          ) {
            return true
          }
          return createError({
            path,
            message: t(
              'periodOfStockTaking:validation.start_date_before_end_date'
            ),
          })
        },
      }),
  })

export default {}
