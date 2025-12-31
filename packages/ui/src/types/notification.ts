import { TProgram } from './program'

export type TNotification = {
  id: number
  user_id: number
  message: string
  province_id: number
  regency_id: number
  entity_id: number
  type: {
    type: string
    title: string
  }
  program: TProgram
  media: string
  title: string
  read_at: string | null
  mobile_phone: string | null
  action_url: string | null
  download_url: string | null
  patient_id: string | null
  created_at: string
  updated_at: string
  user: User
  entity: Entity
  patient: string | null
  data: any
}

export type User = {
  id: number
  username: string | null
  firstname: string | null
  lastname: string | null
  role: number
  entity_id: number
}

export type Entity = {
  id: number
  name: string
}

export type GetNotificationResponse = {
  data: TNotification[]
  page: number
  total_item: number
  item_per_page: number
  total_page: number
  list_pagination: number[]
}

export type ReasonStopNotification = {
  id: number
  title: string
  protocol_id: number
}

export type GetNotificationReasonResponse = {
  data: ReasonStopNotification[]
  page: number
  total_item: number
  item_per_page: number
  total_page: number
  list_pagination: number[]
}

export type PayloadStopNotification = {
  notification_id: number
  consumption_id: number
  reason_id: number
}
