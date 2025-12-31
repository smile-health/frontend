import axios from '#lib/axios'
import { handleAxiosResponse } from '#utils/api'
import { ITransactionCursorPaginationParams, TransactionCursorPaginatedResponse } from '#types/cursor-pagination'
import { TTransactionData } from '#types/transaction'

// Process params for cursor pagination API call
const processParams = ({ params }: { params: ITransactionCursorPaginationParams }) => {
  const processedParams: Record<string, any> = { ...params }

  // Convert date range to start_date and end_date if provided
  if (params.start_date) {
    processedParams.start_date = params.start_date
  }
  if (params.end_date) {
    processedParams.end_date = params.end_date
  }

  // Remove undefined values
  Object.keys(processedParams).forEach(key => {
    if (processedParams[key] === undefined || processedParams[key] === null) {
      delete processedParams[key]
    }
  })

  return processedParams
}

export const listTransactionsCursor = async (params: ITransactionCursorPaginationParams) => {
  const processedParams = processParams({ params })
  
  const fetchTransactionList = await axios.get('/main/transactions/cursor', {
    params: processedParams,
    cleanParams: true,
  })

  // Add serial numbers to the data
  const resultData = fetchTransactionList?.data?.data?.map(
    (item: TTransactionData, index: number) => ({
      ...item,
      si_no: index + 1,
    })
  ) ?? []

  const result = {
    ...fetchTransactionList,
    data: {
      ...fetchTransactionList?.data,
      data: resultData,
    },
  }

  return handleAxiosResponse<TransactionCursorPaginatedResponse>(result)
}

export const exportTransactionsCursor = async (
  params: Omit<ITransactionCursorPaginationParams, 'limit' | 'cursor'>
) => {
  const processedParams = processParams({ params: params as ITransactionCursorPaginationParams })
  
  const responseExportTransaction = await axios.get('/main/transactions/cursor/xls', {
    params: processedParams,
    cleanParams: true,
  })

  return responseExportTransaction?.data
}