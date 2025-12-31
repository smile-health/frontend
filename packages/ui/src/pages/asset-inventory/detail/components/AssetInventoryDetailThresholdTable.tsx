import React, { useMemo } from 'react'
import { useParams, usePathname } from 'next/navigation'
import { CheckCircleIcon } from '@heroicons/react/24/outline'
import { ColumnDef } from '@tanstack/react-table'
import { DataTable } from '#components/data-table'
import cx from '#lib/cx'
import { TCapacity } from '#services/asset-model'
import { TemperatureThreshold } from '#services/asset-type'
import { numberFormatter } from '#utils/formatter'
import { useTranslation } from 'react-i18next'

const CheckIconCell: React.FC = () => (
  <CheckCircleIcon className="ui-text-green-500 ui-w-5 ui-h-5" />
)

const renderCheckIconCell = (isActive: boolean) => {
  const activeCell = isActive ? <CheckIconCell /> : null
  return activeCell
}

type AssetInventoryDetailThresholdTableProps = {
  data: TemperatureThreshold[] | TCapacity[]
  tableHead: string[]
  type: 'temperature_threshold' | 'capacity'
}

const AssetInventoryDetailThresholdTable: React.FC<
  AssetInventoryDetailThresholdTableProps
> = ({ data, tableHead, type }) => {
  const {
    t,
    i18n: { language },
  } = useTranslation(['common', 'assetInventory'])
  const params = useParams()
  const pathname = usePathname().split('/').pop()
  const isEditPage =
    (Boolean(params?.id) && pathname === 'edit') || pathname === 'create'

  const classRow = (item: TemperatureThreshold) => {
    const isActive = item?.is_active
    if (!isActive) {
      return 'ui-bg-neutral-100 ui-cursor-not-allowed'
    }
    return ''
  }

  const handleThresholdActiveStyling = (
    item: TemperatureThreshold,
    isActive: boolean
  ) => {
    return cx('ui-bg-white', { [classRow(item)]: isActive })
  }

  const columns: ColumnDef<TCapacity>[] = useMemo(() => {
    const isCapacity = type === 'capacity'
    const isThresholdActive = !isEditPage && !isCapacity
    const metrics = isCapacity ? t('common:litre') : '°C'
    return [
      {
        accessorKey: tableHead?.[0] ?? '',
        header: tableHead?.[0] ?? '',
        meta: {
          cellClassName: ({ original }) =>
            handleThresholdActiveStyling(
              original as TemperatureThreshold,
              isThresholdActive
            ),
        },
        cell: ({ row }) => {
          return `${
            numberFormatter(
              isCapacity
                ? row?.original?.net_capacity
                : row.original.min_temperature,
              language
            ) ?? '-'
          } ${metrics}`
        },
      },
      {
        accessorKey: tableHead?.[1] ?? '',
        header: tableHead?.[1] ?? '',
        meta: {
          cellClassName: ({ original }) =>
            handleThresholdActiveStyling(
              original as TemperatureThreshold,
              isThresholdActive
            ),
        },
        cell: ({ row }) => {
          return `${
            numberFormatter(
              isCapacity
                ? row?.original?.gross_capacity
                : row.original.max_temperature,
              language
            ) ?? '-'
          } ${metrics}`
        },
      },
      ...(isThresholdActive
        ? ([
            {
              accessorKey: ' ',
              header: ' ',
              meta: {
                cellClassName: ({ original }) =>
                  handleThresholdActiveStyling(
                    original as TemperatureThreshold,
                    isThresholdActive
                  ),
              },
              cell: ({ row }) => {
                return renderCheckIconCell(
                  Boolean(row?.original?.is_active ?? 0)
                )
              },
            },
          ] as ColumnDef<TCapacity>[])
        : []),
    ]
  }, [type])

  return (
    <div
      className={cx('ui-border-none ui-rounded-sm ui-border ui-bg-white', {
        'ui-table !ui-w-full': isEditPage,
      })}
    >
      <div className="ui-bg-gray-100 ui-table-header-group">
        <DataTable columns={columns} data={data} />
      </div>
    </div>
  )
}

export default AssetInventoryDetailThresholdTable
