import { defaultResponse } from '#constants/response'
import { AxiosResponse } from 'axios'

export type AxiosResponseWithStatusCode<Data> = Data & {
  statusCode: number
}

export function handleAxiosResponse<Data>(
  response: AxiosResponse<Data>,
  otherDefaultResponse?: Data
): AxiosResponseWithStatusCode<Data> {
  const statusCode = response?.status
  const isEmpty = statusCode === 204
  const defaultData = otherDefaultResponse ?? defaultResponse

  return {
    ...(isEmpty ? (defaultData as Data) : response?.data),
    statusCode,
  }
}
