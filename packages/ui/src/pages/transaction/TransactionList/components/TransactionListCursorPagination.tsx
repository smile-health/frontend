import React from 'react'
import { Button } from '#components/button'
import { ReactSelect, OptionType } from '#components/react-select'
import { PAGE_SIZE } from '#constants/common'
import { ICursorPaginatedResponse } from '#types/cursor-pagination'
import { useTranslation } from 'react-i18next'

import { useTransactionListCursorDataSimple } from '../hooks/useTransactionListCursorDataSimple'

type Props = {
  data?: ICursorPaginatedResponse<any>
}

const TransactionListCursorPagination: React.FC<Props> = ({ data }) => {
  const { t } = useTranslation(['common', 'transactionList'])
  const {
    limit,
    setLimit,
    goToNextPage,
    goToPreviousPage,
    goToFirstPage,
    hasNextPage,
    hasPreviousPage,
  } = useTransactionListCursorDataSimple()

  const limitOptions = PAGE_SIZE.map((size) => ({
    value: size,
    label: size.toString(),
  }))

  return (
    <div className="ui-flex ui-justify-between ui-items-center ui-gap-2 ui-mt-5">
      <div className="ui-flex ui-items-center ui-gap-2">
        <span className="ui-text-sm ui-font-medium ui-text-gray-700">
          Items per page
        </span>
        <ReactSelect
          id="cursor-pagination-limit"
          value={{
            value: limit,
            label: limit.toString(),
          }}
          options={limitOptions}
          onChange={(option: OptionType) => setLimit(Number(option?.value))}
          menuPosition="fixed"
          className="ui-w-20"
        />
      </div>

      <div className="ui-flex ui-items-center ui-gap-2">
        <span className="ui-text-sm ui-font-medium ui-text-gray-700">
          {data?.total ? `Total: ${data.total}` : ''}
        </span>
      </div>

      <div className="ui-flex ui-items-center ui-gap-1">
        <Button
          variant="outline"
          size="sm"
          onClick={goToFirstPage}
          disabled={!hasPreviousPage}
        >
          First
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={goToPreviousPage}
          disabled={!hasPreviousPage}
        >
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={goToNextPage}
          disabled={!hasNextPage}
        >
          Next
        </Button>
      </div>
    </div>
  )
}

export default TransactionListCursorPagination