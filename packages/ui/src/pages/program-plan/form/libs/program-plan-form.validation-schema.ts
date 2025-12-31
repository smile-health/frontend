import { TFunction } from 'i18next'
import * as Yup from 'yup'

export const programPlanFormValidation = (
  t: TFunction<['common', 'programPlan']>
) =>
  Yup.object().shape({
    year: Yup.object()
      .shape({
        value: Yup.string(),
        label: Yup.string(),
      })
      .required(t('common:validation.required')),
  })

export default {}
