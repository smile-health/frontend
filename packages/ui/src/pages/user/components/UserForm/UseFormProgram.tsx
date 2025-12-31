import { useEffect, useMemo } from 'react'
import { InformationCircleIcon } from '@heroicons/react/24/outline'
import { Controller, useFormContext } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

import {
  FormControl,
  FormErrorMessage,
  FormLabel,
} from '#components/form-control'
import ProgramSelection from '#components/modules/ProgramSelection'
import { OptionType, ReactSelectAsync } from '#components/react-select'

import { ProgramWasteManagement } from '#constants/program'
import { loadCoreEntities } from '#services/entity'
import { TEntities } from '#types/entity'

import { getAuthTokenCookies } from '#utils/storage/auth'
import { getUserStorage } from '#utils/storage/user'
import { isUserWMS } from '#utils/user'
import cx from '#lib/cx'

import { CreateUserBody } from '../../user.service'

export type UseFormProgramValues = Pick<
  CreateUserBody,
  'program_ids' | 'integration_client_id' | 'beneficiaries_ids'
> & {
  entity?: (OptionType &
    Pick<TEntities, 'programs' | 'beneficiaries'>) | null
}

type Props = {
  isEdit?: boolean
}

export default function UseFormProgram({ isEdit }: Readonly<Props>) {
  const token = getAuthTokenCookies()
  const user = getUserStorage()
  const { t } = useTranslation(['common', 'user'])

  const {
    control,
    setValue,
    watch,
    formState: { defaultValues },
  } = useFormContext<UseFormProgramValues>()

  const { entity, program_ids, beneficiaries_ids } = watch()

  const isLoggedInUserWms = Boolean(token && isUserWMS(user))
  const wmsId = useMemo(
    () => (token ? ProgramWasteManagement(token).id : null),
    [token]
  )

  /**
   * Default values
   */
  const defaultEntity = defaultValues?.entity
  const isSameEntity = defaultEntity?.value === entity?.value

  const defaultProgramIds = (defaultValues?.program_ids ?? []) as number[]
  const defaultBeneficiariesIds =
    (defaultValues?.beneficiaries_ids ?? []) as number[]

  /**
   * Forbidden uncheck rules
   */
  const forbiddenUncheckIds = useMemo(() => {
    if (!isSameEntity) return []

    let result = [...defaultProgramIds]

    if (isLoggedInUserWms && wmsId && !result.includes(wmsId)) {
      result.push(wmsId)
    }

    return result
  }, [isSameEntity, defaultProgramIds, isLoggedInUserWms, wmsId])

  const forbiddenUncheckBeneficiariesIds = useMemo(() => {
    if (!isSameEntity) return []
    return [...defaultBeneficiariesIds]
  }, [isSameEntity, defaultBeneficiariesIds])

  /**
   * Always force WMS program for WMS user
   */
  useEffect(() => {
    if (!isLoggedInUserWms || !wmsId) return

    const currentProgramIds = program_ids ?? []

    if (!currentProgramIds.includes(wmsId)) {
      setValue('program_ids', [...currentProgramIds, wmsId])
    }
  }, [isLoggedInUserWms, wmsId, program_ids, setValue])

  return (
    <div className="ui-p-4 ui-border ui-border-neutral-300 ui-rounded ui-space-y-6">
      <h5 className="ui-font-bold">{t('programs')}</h5>

      {/* Entity */}
      <Controller
        name="entity"
        control={control}
        render={({
          field: { onChange, value, ...field },
          fieldState: { error },
        }) => (
          <FormControl>
            <FormLabel htmlFor="select-entity" required>
              {t('form.entity.label')}
            </FormLabel>

            <ReactSelectAsync
              {...field}
              data-testid="select-entity"
              value={value ?? null}
              isClearable
              debounceTimeout={300}
              placeholder={t('form.entity.placeholder')}
              loadOptions={loadCoreEntities as any}
              additional={{ page: 1 }}
              onChange={(option) => {
                onChange(option)
                setValue('program_ids', defaultProgramIds)
                setValue('beneficiaries_ids', defaultBeneficiariesIds)
              }}
            />

            {error?.message && (
              <FormErrorMessage>{error.message}</FormErrorMessage>
            )}
          </FormControl>
        )}
      />

      {/* Programs */}
      {entity ? (
        <ProgramSelection
          selected={program_ids || beneficiaries_ids || []}
          onChange={(ids) => setValue('program_ids', ids)}
          forbiddenUncheckIds={forbiddenUncheckIds}
          forbiddenUncheckBeneficiariesIds={
            forbiddenUncheckBeneficiariesIds
          }
          programList={entity.programs}
          beneficiariesList={entity.beneficiaries}
          isEnabledApi={false}
          withLayout={false}
          showWms
        />
      ) : (
        <div
          className={cx(
            'ui-flex ui-items-center ui-gap-2 ui-px-6 ui-py-2.5',
            'ui-bg-stone-100 ui-text-neutral-500',
            'ui-border ui-border-neutral-300 ui-rounded'
          )}
        >
          <InformationCircleIcon className="ui-size-4" />
          <p className="ui-text-sm">
            {t('user:form.entity.program')}
          </p>
        </div>
      )}
    </div>
  )
}
