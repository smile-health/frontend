import { useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { BOOLEAN } from '#constants/common'
import { useLoadingPopupStore } from '#store/loading.store'
import { useTranslation } from 'react-i18next'

import { exportStorageTemperatureMonitoring } from '../../storage-temperature-monitoring-list.service'
import { useStorageTemperatureMonitoringList } from '../../StorageTemperatureMonitoringListContext'
import { useListFilter } from '../filter/useListFilter'

const useListExport = () => {
  const { i18n } = useTranslation()
  const { setLoadingPopup } = useLoadingPopupStore()

  const storageTemperatureMonitoringList = useStorageTemperatureMonitoringList()
  const isWarehouse = storageTemperatureMonitoringList?.isWarehouse

  const filter = useListFilter()

  const warehouseParams = {
    ...filter.params,
    is_warehouse: BOOLEAN.TRUE,
  }

  const { refetch, isLoading, isFetching } = useQuery({
    queryKey: [
      i18n.language,
      'storage-temperature-monitoring-export',
      isWarehouse ? warehouseParams : filter.params,
    ],
    queryFn: () =>
      exportStorageTemperatureMonitoring(
        isWarehouse ? warehouseParams : filter.params
      ),
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
