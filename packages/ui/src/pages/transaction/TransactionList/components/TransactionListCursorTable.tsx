import React, { useContext } from 'react'
import { DataTable } from '#components/data-table'
import { ICursorPaginatedResponse } from '#types/cursor-pagination'
import { TProgram } from '#types/program'
import { TTransactionData } from '#types/transaction'
import { useTranslation } from 'react-i18next'

import TransactionListContext from '../helpers/transaction-list.context'
import { MainColumn } from './TransactionListColumn'
import TransactionListDetailDialog from './TransactionListDetailDialog'
import TransactionListCursorPagination from './TransactionListCursorPagination'

type Props = {
  data?: ICursorPaginatedResponse<TTransactionData>
}

const TransactionListCursorTable: React.FC<Props> = ({ data }): JSX.Element => {
  const { t, i18n } = useTranslation(['common', 'transactionList'])
  const { program } = useContext(TransactionListContext)

  return (
    <>
      <TransactionListDetailDialog />
      <DataTable
        id="transaction__cursor__list__table"
        data={data?.data}
        columns={MainColumn({
          t,
          locale: i18n.language,
          program: program as TProgram,
        })}
      />
      <TransactionListCursorPagination data={data} />
      <style>{`
        #transaction__cursor__list__table {
          tr:hover {
            background-color: #f5f5f5;
          }
          td {
            vertical-align: top !important;
          }
        }
      `}</style>
    </>
  )
}

export default TransactionListCursorTable