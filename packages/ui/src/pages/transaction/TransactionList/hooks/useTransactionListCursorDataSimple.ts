import { useMemo, useState } from 'react'
import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { useQueryStates, parseAsString, parseAsInteger } from 'nuqs'
import { TTransactionData } from '#types/transaction'
import { ICursorPaginatedResponse } from '#types/cursor-pagination'
import { useTranslation } from 'react-i18next'

import { listTransactionsCursor } from '../../transaction-cursor.services'

type UseTransactionListCursorDataReturn = {
  data?: ICursorPaginatedResponse<TTransactionData>
  isLoading: boolean
  error: any
  limit: number
  setLimit: (limit: number) => void
  cursor: string | null
  setCursor: (cursor: string | null) => void
  goToNextPage: () => void
  goToPreviousPage: () => void
  goToFirstPage: () => void
  hasNextPage: boolean
  hasPreviousPage: boolean
}

export function useTransactionListCursorDataSimple(): UseTransactionListCursorDataReturn {
  const [limit, setLimit] = useState(10)
  const [cursor, setCursor] = useState<string | null>(null)
  const [previousCursors, setPreviousCursors] = useState<string[]>([])
  
  const {
    i18n: { language },
  } = useTranslation()

  // Get filter parameters from URL - transaction cursor fields
  const [filterParams] = useQueryStates({
    // Basic search and status
    keyword: parseAsString.withDefault(''),
    status: parseAsString.withDefault(''),
    
    // Transaction cursor filter fields
    transaction_type_id: parseAsInteger,
    transaction_reason_id: parseAsInteger,
    entity_tag_id: parseAsInteger,
    primary_vendor_id: parseAsInteger,
    province_id: parseAsInteger,
    regency_id: parseAsInteger,
    customer_tag_id: parseAsInteger,
    entity_for_consumption: parseAsInteger,
    entity_id: parseAsInteger,
    entity_user_id: parseAsInteger,
    parent_material_id: parseAsInteger,
    activity_id: parseAsInteger,
    material_type_id: parseAsInteger,
    material_id: parseAsInteger,
    start_date: parseAsString,
    end_date: parseAsString,
    is_order: parseAsInteger,
    order_type: parseAsInteger,
  })

  const queryKey = useMemo(
    () => ['transactions-cursor-simple', { limit, cursor, ...filterParams }],
    [limit, cursor, filterParams]
  )

  const queryParams = useMemo(
    () => {
      // Remove undefined values from filter params
      const cleanFilterParams = Object.fromEntries(
        Object.entries(filterParams).filter(([_, value]) => value !== undefined && value !== null && value !== '')
      )
      
      return {
        limit,
        cursor,
        ...cleanFilterParams,
      }
    },
    [limit, cursor, filterParams]
  )

  const { data, isLoading, error } = useQuery({
    queryKey,
    queryFn: () => listTransactionsCursor(queryParams),
    placeholderData: keepPreviousData,
  })

  const goToNextPage = () => {
    if (data?.next_cursor) {
      if (cursor) {
        setPreviousCursors(prev => [...prev, cursor])
      }
      setCursor(data.next_cursor)
    }
  }

  const goToPreviousPage = () => {
    if (previousCursors.length > 0) {
      const newPreviousCursors = [...previousCursors]
      const previousCursor = newPreviousCursors.pop()
      setPreviousCursors(newPreviousCursors)
      setCursor(previousCursor || null)
    }
  }

  const goToFirstPage = () => {
    setCursor(null)
    setPreviousCursors([])
  }

  const hasNextPage = Boolean(data?.next_cursor)
  const hasPreviousPage = previousCursors.length > 0 || cursor !== null

  return {
    data,
    isLoading,
    error,
    limit,
    setLimit,
    cursor,
    setCursor,
    goToNextPage,
    goToPreviousPage,
    goToFirstPage,
    hasNextPage,
    hasPreviousPage,
  }
}