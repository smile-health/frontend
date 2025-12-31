import { createContext, PropsWithChildren, useContext, useMemo } from 'react'
import { useParams } from 'next/navigation'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from '#components/toast'
import useSmileRouter from '#hooks/useSmileRouter'
import { AxiosError } from 'axios'
import { useTranslation } from 'react-i18next'

import {
  deleteMonitoringDeviceInventory,
  getMonitoringDeviceInventoryDetail,
  updateMonitoringDeviceInventoryStatus,
  UpdateMonitoringDeviceInventoryStatusRequest,
} from './monitoring-device-inventory-detail.service'
import { MonitoringDeviceInventoryDetail } from './monitoring-device-inventory.type'

type ErrorResponse = {
  message: string
}

type MonitoringDeviceInventoryDetailContextValue = {
  data?: MonitoringDeviceInventoryDetail
  isLoading: boolean
  isError: boolean
  isDeleting: boolean
  isUpdatingStatus: boolean
  isGlobal: boolean
  refetch: () => void
  onDelete: () => void
  onUpdateStatus: (data: UpdateMonitoringDeviceInventoryStatusRequest) => void
}

export const MonitoringDeviceInventoryDetailContext = createContext<
  MonitoringDeviceInventoryDetailContextValue | undefined
>(undefined)

type MonitoringDeviceInventoryDetailProviderProps = PropsWithChildren & {
  isGlobal?: boolean
}

export const MonitoringDeviceInventoryDetailProvider = ({
  children,
  isGlobal = false,
}: MonitoringDeviceInventoryDetailProviderProps) => {
  const { t } = useTranslation(['common', 'monitoringDeviceInventory'])
  const router = useSmileRouter()
  const queryClient = useQueryClient()
  const params = useParams()
  const id = params.id as string

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['monitoring-device-inventory-detail', { id }],
    queryFn: () => getMonitoringDeviceInventoryDetail(id),
    enabled: !!id,
  })

  const { mutate: onDelete, isPending: isDeleting } = useMutation({
    mutationFn: () => deleteMonitoringDeviceInventory(id),
    onSuccess: () => {
      toast.success({
        description: t('common:message.success.delete', {
          type: t('monitoringDeviceInventory:monitoring_device'),
        }),
      })
      router.pushGlobal(
        isGlobal
          ? '/v5/global-asset/management/monitoring-device-inventory'
          : '/v5/asset-managements/monitoring-device-inventory'
      )
    },
    onError: (error) => {
      if (error instanceof AxiosError) {
        const response = error.response?.data as ErrorResponse
        toast.danger({
          description: response?.message || t('common:message.common.error'),
        })
      }
    },
  })

  const { mutate: onUpdateStatus, isPending: isUpdatingStatus } = useMutation({
    mutationFn: (data: UpdateMonitoringDeviceInventoryStatusRequest) =>
      updateMonitoringDeviceInventoryStatus(id, data),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ['monitoring-device-inventory-detail', { id }],
      })
      toast.success({
        description: t('common:message.success.update_status', {
          type: t('monitoringDeviceInventory:monitoring_device'),
        }),
      })
    },
    onError: (error) => {
      if (error instanceof AxiosError) {
        const response = error.response?.data as ErrorResponse
        toast.danger({
          description: response?.message || t('common:message.common.error'),
        })
      }
    },
  })

  const contextValue = useMemo(
    () => ({
      data,
      isLoading,
      isError,
      isDeleting,
      isUpdatingStatus,
      isGlobal,
      refetch,
      onDelete,
      onUpdateStatus,
    }),
    [
      data,
      isLoading,
      isError,
      isDeleting,
      isUpdatingStatus,
      isGlobal,
      refetch,
      onDelete,
      onUpdateStatus,
    ]
  )

  return (
    <MonitoringDeviceInventoryDetailContext.Provider value={contextValue}>
      {children}
    </MonitoringDeviceInventoryDetailContext.Provider>
  )
}

MonitoringDeviceInventoryDetailContext.displayName =
  'MonitoringDeviceInventoryDetailContext'

export const useMonitoringDeviceInventoryDetail = () => {
  const context = useContext(MonitoringDeviceInventoryDetailContext)

  if (!context) {
    throw new Error(
      'useMonitoringDeviceInventoryDetail must be used within a MonitoringDeviceInventoryDetailProvider'
    )
  }

  return context
}

export const MonitoringDeviceInventoryDetailConsumer = ({
  children,
}: {
  children: (
    value: MonitoringDeviceInventoryDetailContextValue
  ) => React.ReactNode
}) => {
  const monitoringDeviceInventoryDetail = useMonitoringDeviceInventoryDetail()
  return children(monitoringDeviceInventoryDetail)
}
