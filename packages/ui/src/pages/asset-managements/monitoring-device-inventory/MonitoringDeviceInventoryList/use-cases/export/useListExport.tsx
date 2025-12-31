import { useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useLoadingPopupStore } from '#store/loading.store'
import { useTranslation } from 'react-i18next'

import { exportMonitoringDeviceInventoryList } from '../../monitoring-device-inventory-list.service'
import { useListFilter } from '../filter/useListFilter'

const useListExport = () => {
  const { i18n } = useTranslation()
  const { setLoadingPopup } = useLoadingPopupStore()

  const filter = useListFilter()

  const { refetch, isLoading, isFetching } = useQuery({
    queryKey: [
      i18n.language,
      'monitoring-device-inventory-export',
      filter.params,
    ],
    queryFn: () => exportMonitoringDeviceInventoryList(filter.params),
    enabled: false,
  })

  useEffect(() => {
    setLoadingPopup(isLoading || isFetching)
  }, [setLoadingPopup, isLoading, isFetching])

  return {
    fetch: () => refetch(),
    isLoading: isLoading || isFetching,
  }
}

export default useListExport
