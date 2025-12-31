import { Row } from '@tanstack/react-table'
import { DataTable } from '#components/data-table'
import {
  FormControl,
  FormErrorMessage,
  FormLabel,
} from '#components/form-control'
import Warning from '#components/icons/Warning'
import { Controller } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

import {
  AssetTypeTemperatureThresholds,
  CreateAssetTypeBody,
} from '../asset-type.type'
import useAssetTypeThresholdTableForm from '../hooks/useAssetTypeThresholdTableForm'

export default function AssetTypeThresholdSelection({
  defaultValues,
  isEdit,
  isAdjustable,
}: Readonly<{
  defaultValues?: CreateAssetTypeBody
  isEdit: boolean
  isAdjustable: boolean
}>) {
  const { t } = useTranslation('assetType')

  const {
    selectedTresholds,
    loadingTresholds,
    savedTresholds,
    handleCheck,
    tresholdData,
    control,
    schema,
  } = useAssetTypeThresholdTableForm({ defaultValues, isEdit, isAdjustable })

  return (
    <div>
      <Controller
        control={control}
        name="temperature_thresholds"
        render={({ fieldState: { error } }) => (
          <FormControl>
            <FormLabel required>
              {t('form.detail.temperature_threshold.label')}
            </FormLabel>
            <div className="ui-rounded ui-bg-slate-100 ui-px-4 ui-py-[9px] ui-flex ui-gap-2 ui-items-center">
              <Warning />
              <p className="ui-text-xs ui-font-normal">
                {t('form.detail.temperature_threshold.warning')}
              </p>
            </div>
            <DataTable
              isLoading={loadingTresholds}
              columns={schema}
              data={tresholdData}
              onClickRow={(row: Row<AssetTypeTemperatureThresholds>) => {
                const currentId = Number(row.id)
                const isSelected = selectedTresholds?.some(
                  (item) => item.id === currentId
                )
                if (isSelected) {
                  if (savedTresholds?.some((item) => item.id === currentId)) {
                    return
                  }
                }
                handleCheck(row?.original)
              }}
            />
            {error && <FormErrorMessage>{error.message}</FormErrorMessage>}
          </FormControl>
        )}
      />
    </div>
  )
}
