'use client'

import Link from 'next/link'
import { Button } from '#components/button'
import { Checkbox } from '#components/checkbox'
import {
  FormControl,
  FormErrorMessage,
  FormLabel,
} from '#components/form-control'
import { Input } from '#components/input'
import useSmileRouter from '#hooks/useSmileRouter'
import { useTranslation } from 'react-i18next'

import { ActivityFormProps } from '../activity.type'
import { useActivityCreateEdit } from '../hooks/useActivityCreateEdit'

export default function ActivityForm({
  isEdit,
  defaultValues,
  pathBack,
}: Readonly<ActivityFormProps>) {
  const { t } = useTranslation(['common', 'activity'])
  const router = useSmileRouter()
  const { register, handleSubmit, errors, onValid } =
    useActivityCreateEdit({
      isEdit,
      defaultValues,
      pathBack,
    })

  return (
    <form
      onSubmit={handleSubmit(onValid)}
      className="ui-mt-6 ui-space-y-6 ui-max-w-form ui-mx-auto"
    >
      <div className="ui-p-4 ui-pb-4 ui-mt-6 ui-border ui-border-gray-300 ui-rounded">
        <div className="ui-mb-5 ui-font-bold ui-text-primary ui-text-dark-blue">
          {t('activity:title.information')}
        </div>
        <div className="ui-flex ui-flex-col ui-space-y-5">
          <FormControl>
            <FormLabel htmlFor="name" required>
              {t('activity:form.name.label')}
            </FormLabel>
            <Input
              {...register('name')}
              id="input-activity-name"
              placeholder={t('activity:form.name.placeholder')}
              type="text"
              error={!!errors?.name?.message}
            />
            <FormErrorMessage>{errors?.name?.message}</FormErrorMessage>
          </FormControl>
          <FormControl>
            <FormLabel required>{t('activity:form.process.label')}</FormLabel>
            <div className="ui-flex ui-gap-4">
              <Checkbox {...register('is_ordered_sales')} label="Top Down" />
              <Checkbox {...register('is_ordered_purchase')} label="Bottom Up" />
            </div>
            <FormErrorMessage>
              {errors?.is_ordered_sales?.message ??
                errors?.is_ordered_sales?.message}
            </FormErrorMessage>
          </FormControl>
          {/* open when protocol needed in next future feature */}
          {/* <FormControl>
            <FormLabel htmlFor="protocol" required>
              {t('activity:form.protocol.label')}
            </FormLabel>
            <ReactSelect
              {...register('protocol')}
              id="select-activity-protocol"
              placeholder={t('activity:form.protocol.placeholder')}
              options={activityProtocolOptions}
              onChange={(option: OptionType) => {
                setValue('protocol', option?.value)
              }}
              value={activityProtocolOptions?.find(
                (x) => x.value === watch('protocol')
              )}
              disabled
            />
          </FormControl> */}
        </div>
      </div>
      <div className="ui-flex ui-justify-end">
        <div className="ui-grid ui-grid-cols-2 ui-w-[300px] ui-gap-2">
          <Button asChild variant="outline">
            <Link href={pathBack ?? router.getAsLink('/v5/activity')}>
              {t('common:back')}
            </Link>
          </Button>
          <Button>{t('common:save')}</Button>
        </div>
      </div>
    </form>
  )
}
