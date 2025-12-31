import { useCallback, useMemo } from 'react'
import { PlusIcon } from '@heroicons/react/24/solid'
import { ColumnDef, Row } from '@tanstack/react-table'
import { Button } from '#components/button'
import { DataTable } from '#components/data-table'
import { FormErrorMessage } from '#components/form-control'
import cx from '#lib/cx'
import { numberFormatter } from '#utils/formatter'
import dayjs from 'dayjs'
import { FieldErrors } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

import { ReceiveFormValues } from '../ReceiveForm/ReceiveForm'
import { ReceiveOrderItemsDrawerFormValues } from '../ReceiveOrderItemsDrawerForm/ReceiveOrderItemsDrawerForm'

export type ReceiveOrderItemsTableData = ReceiveOrderItemsDrawerFormValues

type ReceiveOrderItemsTableProps = {
  errors: FieldErrors<ReceiveFormValues>
  onRowClick: (row: Row<ReceiveOrderItemsTableData>) => void
  orderItems: ReceiveOrderItemsDrawerFormValues[]
  isLoading: boolean
}

export const ReceiveOrderItemsTable = ({
  errors,
  orderItems,
  onRowClick,
  isLoading,
}: ReceiveOrderItemsTableProps) => {
  const { t, i18n } = useTranslation(['common', 'orderDetail'])

  const renderActionColumn = useCallback(
    (row: Row<ReceiveOrderItemsTableData>) => {
      const index = row.index
      const orderItem = row.original._order_item
      const isOrderItemBatch = row.original._order_item?.order_stocks.some(
        (stock) => Boolean(stock.batch)
      )
      const receiveItems = row.original.receives
      const filledReceiveItems = receiveItems?.filter(
        (item) => Number(item.received_qty) > 0
      )
      const isFilled = filledReceiveItems?.length > 0
      const hasOrderStocks = Boolean(orderItem?.order_stocks)
      const error = errors.order_items?.[index]?.receives?.[0]?.received_qty

      const handleClick = () => {
        onRowClick(row)
      }

      return (
        <div className="space-y-2">
          {hasOrderStocks && (
            <div className="space-y-2">
              {filledReceiveItems?.map((item) => (
                <div key={item.stock_id} className="ui-text-sm">
                  {isOrderItemBatch && (
                    <>
                      <div>
                        {t('orderDetail:data.batch_code')}:{' '}
                        {item._order_item_stock?.batch?.code ?? '-'}
                      </div>
                      <div>
                        {t('orderDetail:data.expired_date')}:{' '}
                        {dayjs(item._order_item_stock?.batch?.expired_date)
                          .format('DD MMM YYYY')
                          .toUpperCase()}
                      </div>
                    </>
                  )}
                  <div>
                    {t('orderDetail:data.stock_from_activity')}:{' '}
                    {item._order_item_stock?.activity_name}
                  </div>
                  <div className="ui-font-semibold">
                    Qty: {numberFormatter(item.received_qty, i18n.language)}
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="ui-space-y-1">
            <Button
              size="sm"
              type="button"
              leftIcon={<PlusIcon className="ui-w-5 ui-text-dark-blue" />}
              variant="outline"
              onClick={handleClick}
            >
              {isFilled
                ? isOrderItemBatch
                  ? t('orderDetail:button.update_batch_quantity')
                  : t('orderDetail:button.update_quantity')
                : isOrderItemBatch
                  ? t('orderDetail:button.batch_quantity')
                  : t('orderDetail:button.quantity')}
            </Button>
            {error && <FormErrorMessage>{error?.message}</FormErrorMessage>}
          </div>
        </div>
      )
    },
    [orderItems, errors]
  )

  const columns: ColumnDef<ReceiveOrderItemsTableData>[] = useMemo(
    () => [
      {
        accessorKey: '_order_item.material.name',
        header: t('orderDetail:table.column.material_name'),
        size: 400,
      },
      {
        header: t('orderDetail:table.column.ordered'),
        cell: ({ row }) =>
          numberFormatter(
            row.original?._order_item?.ordered_qty,
            i18n.language
          ),
        meta: {
          cellClassName: 'ui-w-[400px]',
        },
      },
      {
        header: t('orderDetail:table.column.shipped'),
        cell: ({ row }) =>
          numberFormatter(
            row.original?._order_item?.shipped_qty,
            i18n.language
          ),
        meta: {
          cellClassName: 'ui-w-[400px]',
        },
      },
      {
        header: t('orderDetail:table.column.received'),
        cell: ({ row }) => renderActionColumn(row),
        meta: {
          cellClassName: 'ui-w-[400px]',
        },
      },
    ],
    [orderItems, errors]
  )

  return (
    <DataTable
      data={orderItems}
      columns={columns}
      isLoading={!orderItems || isLoading}
      bodyClassName={cx({ 'ui-h-56': !orderItems })}
    />
  )
}
