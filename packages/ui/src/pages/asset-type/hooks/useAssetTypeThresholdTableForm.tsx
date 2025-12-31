import { useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { ColumnDef } from '@tanstack/react-table'
import { Checkbox } from '#components/checkbox'
import { DataTable } from '#components/data-table'
import { Radio } from '#components/radio'
import { numberFormatter } from '#utils/formatter'
import { useFormContext } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

import { getAssetTypeTemperatureTresholds } from '../asset-type.service'
import {
  AssetTypeTemperatureThresholds,
  CreateAssetTypeBody,
  DetailAssetTypeResponse,
} from '../asset-type.type'

const useAssetTypeThresholdTableForm = ({
  defaultValues,
  isEdit,
  isAdjustable,
}: {
  defaultValues?: CreateAssetTypeBody
  isEdit: boolean
  isAdjustable: boolean
}) => {
  const {
    t,
    i18n: { language },
  } = useTranslation(['assetType', 'common'])
  const { control, setValue, watch } = useFormContext<CreateAssetTypeBody>()

  const isWarehouse = watch('is_cce_warehouse')

  const selectedTresholds = watch('temperature_thresholds')
  const savedTresholds = defaultValues?.temperature_thresholds

  const { data, isLoading: loadingTresholds } = useQuery({
    queryKey: ['asset-type-temperature-thresholds'],
    queryFn: () =>
      getAssetTypeTemperatureTresholds({
        page: 1,
        paginate: 10,
        is_predefined: isWarehouse ? 2 : 1,
      }),
  })

  const classRow = (item: AssetTypeTemperatureThresholds) => {
    const isSaved = Boolean(
      savedTresholds?.filter((treshold) => treshold.id === Number(item.id))
        ?.length
    )
    if (isSaved || (isEdit && !isAdjustable)) {
      return 'ui-bg-neutral-100 ui-cursor-not-allowed'
    }
    return ''
  }

  const handleUncheck = (
    itemId: number,
    value: any,
    onChange: (...event: any[]) => void
  ) => {
    const filtered = value?.filter((val: any) => val?.id !== itemId)
    onChange(filtered)
  }

  const handleCheck = (row: AssetTypeTemperatureThresholds) => {
    const currentId = Number(row.id)
    const selected = selectedTresholds || []
    const isSelected = selected.some((item) => item.id === currentId)

    if (isSelected) {
      handleUncheck(currentId, selectedTresholds, (val: any) =>
        setValue('temperature_thresholds', val)
      )
      return
    }
    if (isAdjustable) {
      return setValue('temperature_thresholds', [
        ...selected,
        { id: currentId },
      ])
    }
    if (!isEdit) {
      return setValue('temperature_thresholds', [{ id: currentId }])
    }
    return null
  }

  const schema: ColumnDef<AssetTypeTemperatureThresholds>[] = useMemo(
    () => [
      {
        header: '',
        accessorKey: 'selection',
        meta: { cellClassName: ({ original }) => classRow(original) },
        cell: ({ row }) => {
          const statusChecked = Boolean(
            selectedTresholds?.filter(
              (treshold) => treshold.id === Number(row.original.id)
            )?.length
          )
          const isSaved = Boolean(
            savedTresholds?.filter(
              (treshold) => treshold.id === Number(row.original.id)
            )?.length
          )
          if (isAdjustable) {
            return (
              <Checkbox
                checked={statusChecked}
                disabled={isEdit && isSaved}
                value={statusChecked ? 1 : 0}
                onChange={() => {
                  handleCheck(row.original)
                }}
              />
            )
          }
          return (
            <Radio
              checked={statusChecked}
              disabled={(isEdit && isSaved) || (isEdit && !isAdjustable)}
              value={statusChecked ? 1 : 0}
              onChange={() => {
                handleCheck(row.original)
              }}
            />
          )
        },
      },
      {
        header: t('form.detail.temperature_threshold.column.min_temperature'),
        accessorKey: 'min_temperature',
        size: 350,
        meta: { cellClassName: ({ original }) => classRow(original) },
        cell: ({ row }) => {
          return `${numberFormatter(row.original.min_temperature, language)} °C`
        },
      },
      {
        header: t('form.detail.temperature_threshold.column.max_temperature'),
        accessorKey: 'max_temperature',
        size: 350,
        meta: { cellClassName: ({ original }) => classRow(original) },
        cell: ({ row }) => {
          return `${numberFormatter(row.original.max_temperature, language)} °C`
        },
      },
    ],
    [selectedTresholds, savedTresholds]
  )

  const generateAssetUtilization = (detail?: DetailAssetTypeResponse) => {
    const hasTreshold = detail?.temperature_thresholds?.length ?? 0
    return [
      {
        label: t('form.detail.label.is_cce_equipment'),
        value: detail?.name ?? '-',
      },
      {
        label: t('form.detail.label.temperature_threshold'),
        value: hasTreshold ? (
          <div className="ui-grid ui-grid-cols-3">
            <DataTable columns={schema} data={data?.data} />
          </div>
        ) : (
          '-'
        ),
      },
    ]
  }

  return {
    tresholdData: data?.data,
    selectedTresholds,
    loadingTresholds,
    savedTresholds,
    schema,
    control,
    watch,
    handleCheck,
    handleUncheck,
    generateAssetUtilization,
  }
}

export default useAssetTypeThresholdTableForm
