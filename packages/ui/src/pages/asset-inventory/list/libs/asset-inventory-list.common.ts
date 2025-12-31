import { OptionType } from '#components/react-select'
import { BOOLEAN } from '#constants/common'
import { ENTITY_TYPE } from '#constants/entity'
import { USER_ROLE } from '#constants/roles'
import { hasPermission } from '#shared/permission/index'
import { RequestloginResponse } from '#types/auth'
import { isObject } from '#utils/object'

import {
  ListAssetParams,
  TAncientResponse,
  TAssetData,
} from './asset-inventory-list.types'

export const processParams = ({
  params,
  isExport = false,
}: {
  params: ListAssetParams | Omit<ListAssetParams, 'paginate' | 'page'>
  isExport: boolean
}) =>
  Object.entries(params).reduce((acc, [key, value]) => {
    if (isObject(value)) return { ...acc, [key]: (value as OptionType)?.value }
    if (isExport && ['paginate', 'page']?.includes(key)) return acc
    return { ...acc, [key]: value }
  }, {})

export const textGrouper = ({
  text1,
  text2 = null,
  separator = ', ',
}: {
  text1: string
  text2?: string | null
  separator?: string
}) => {
  if (!text2 || text2 === null) return text1
  return `${text1}${separator}${text2}`
}

export const thousandFormatter = ({
  value,
  locale = 'en-US',
}: {
  value: number
  locale: string
}) => {
  return new Intl.NumberFormat(locale).format(value) || ''
}

export const defineMinSize = (
  listDataExists: boolean,
  size: number,
  constantSize: number = 20
) => (listDataExists ? size : constantSize)

export const filterOfuser = (user: RequestloginResponse) => {
  const userData = user

  const isSuperAdmin = [USER_ROLE?.SUPERADMIN, USER_ROLE?.ADMIN]?.includes(
    userData?.role
  )
  const isDisabledProvinceByRole = !hasPermission('asset-inventory-view')
  const isDisabledRegencyByRole =
    !hasPermission('asset-inventory-view') &&
    Number(userData?.entity?.type) !== ENTITY_TYPE.PROVINSI

  const defaultProvince =
    !isSuperAdmin && Boolean(userData?.entity?.province?.id)
      ? {
          value: userData?.entity?.province?.id || '',
          label: userData?.entity?.province?.name || '',
        }
      : null
  const defaultRegency =
    !isSuperAdmin && Boolean(userData?.entity?.regency?.id)
      ? {
          value: userData?.entity?.regency?.id || '',
          label: userData?.entity?.regency?.name || '',
        }
      : null

  return {
    isSuperAdmin,
    isDisabledProvinceByRole,
    isDisabledRegencyByRole,
    defaultProvince,
    defaultRegency,
  }
}

export const overrrideResponse = (response: TAncientResponse) => ({
  item_per_page: Number(response?.perPage),
  total_item: response?.total,
  total_page: Math.ceil(response?.total / Number(response?.perPage)),
  page: Number(response?.page),
  list_pagination: [50, 100, 150, 200],
  data: response?.list,
  statusCode: response?.statusCode,
})

export const backgroundColor = (
  data: TAssetData,
  isNumberColumn: boolean = false
) => {
  const isColdStorage =
    Number(data?.asset_type?.is_coldstorage) === BOOLEAN.TRUE
  const capacityGross = data?.asset_model?.capacity_gross
  const capacityNett = data?.asset_model?.capacity_nett
  const otherCapacityGross = data?.other_capacity_gross
  const otherCapacityNett = data?.other_capacity_nett

  switch (true) {
    case isColdStorage &&
      !capacityGross &&
      !capacityNett &&
      !otherCapacityGross:
      return isNumberColumn ? 'ui-bg-red-500 ui-text-white' : 'ui-bg-red-100'
    case isColdStorage &&
      !capacityNett &&
      !otherCapacityNett &&
      (otherCapacityGross || otherCapacityNett):
      return isNumberColumn
        ? 'ui-bg-orange-500 ui-text-white'
        : 'ui-bg-orange-100'
    default:
      return 'ui-bg-white'
  }
}

export default {}
