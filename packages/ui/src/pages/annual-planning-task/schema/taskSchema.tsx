import { UseFilter } from '#components/filter'
import { KfaLevelEnum } from '#constants/material'
import { loadActivityOptions } from '#services/activity'
import { loadMaterial } from '#services/material'
import { getProgramStorage } from '#utils/storage/program'
import { TFunction } from 'i18next'
import * as yup from 'yup'

export const generateFilterListTaskSchema = (
  t: TFunction<['common', 'task']>
): UseFilter => {
  const program = getProgramStorage()

  return [
    {
      id: 'material',
      type: 'select-async-paginate',
      name: 'material',
      label: t('common:form.material.label'),
      className: '',
      placeholder: t('common:form.material.placeholder'),
      loadOptions: loadMaterial,
      additional: {
        page: 1,
        program_id: program?.id,
        material_level_id: KfaLevelEnum.KFA_92,
      },
      defaultValue: null,
    },
    {
      id: 'activity',
      type: 'select-async-paginate',
      name: 'activity',
      label: t('common:form.activity.label'),
      className: '',
      placeholder: t('common:form.activity.placeholder'),
      loadOptions: loadActivityOptions,
      additional: { page: 1 },
      defaultValue: null,
    },
  ]
}

export const formSchema = (t: TFunction<['common', 'task']>) =>
  yup.object().shape({
    activity: yup.object({
      value: yup.number().required(t('common:validation.required')),
      label: yup.string().required(t('common:validation.required')),
    }),
    material: yup.object({
      value: yup.number().required(t('common:validation.required')),
      label: yup.string().required(t('common:validation.required')),
    }),
    monthly_distribution: yup
      .array()
      .min(1, t('task:form.monthly_distribution.invalid'))
      .of(yup.number())
      .required(t('task:form.monthly_distribution.invalid')),
    amount_of_giving: yup
      .array(
        yup.object({
          group_target: yup
            .object({
              value: yup.number().required(),
              label: yup.string().required(),
            })
            .required(),
          number_of_doses: yup.string().required(),
          national_ip: yup
            .string()
            .matches(/^\d+(\.\d{1,2})?$/, t('task:form.national_ip.invalid'))
            .required(t('common:validation.required')),
          target_coverage: yup.array().of(
            yup
              .object({
                province_id: yup.number().required(),
                province_name: yup.string().required(),
                coverage_number: yup.number().required(),
              })
              .required()
          ),
        })
      )
      .min(1, t('task:form.amount_of_giving.invalid')),
  })

export const amountOfGivingSchema = (t: TFunction<['common', 'task']>) =>
  yup.object({
    amount_of_giving: yup
      .array()
      .of(
        yup.object({
          group_target: yup
            .object({
              value: yup.number(),
              label: yup.string(),
            })
            .nonNullable(t('common:validation.required'))
            .required(t('common:validation.required')),
          number_of_doses: yup
            .string()
            .required(t('common:validation.required')),
          national_ip: yup
            .string()
            .matches(/^\d+(\.\d{1,2})?$/, t('task:form.national_ip.invalid'))
            .required(t('common:validation.required')),
        })
      )
      .required(t('common:validation.required')),
  })
