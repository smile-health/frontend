import { OptionType } from '#components/react-select'
import { TCommonResponseList } from '#types/common'

export type TAddRTMDRelationPayload = {
  id: number
  sensor_qty?: number
  description?: string | null
}[]

export type TDefaultObject = {
  id?: string | number
  name?: string
}

export type TRelationResponse = TCommonResponseList & {
  statusCode: number
  data: TRelationData[]
}

export type TCreateLoggerSubmit = {
  monitoring_device: OptionType | null
  sensor_qty: OptionType | null
}

export type TCreateLoggerPayload = {
  id: number
  sensor_qty: number
}[]

export type TCreateWarehouseSubmit = {
  monitoring_device: OptionType | null
  description?: string | null
}

export type TCreateWarehousePayload = {
  id: number
  description?: string | null
}[]

export type TRelationData = {
  id: number
  sensor_qty: number
  serial_number: string
  asset_model: TDefaultObject
  asset_type: TDefaultObject
  manufacture: TDefaultObject
  description?: string | null
  latest_log: {
    temperature: number
    updated_at: string
    actual_time: string | null
    battery?: number | null
    device_status?: number | null
    humidity?: number | null
    is_power_connected?: number | null
    signal?: number | null
  }
}

export type TTemperatureThreshold = {
  min_temperature: number
  max_temperature: number
  is_active?: number | null
}
