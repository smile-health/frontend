import { FilterFormSchema, UseFilter } from '#components/filter'
import { BOOLEAN } from '#constants/common'
import { ENTITY_TYPE } from '#constants/entity'
import { loadActivityOptions } from '#services/activity'
import { loadEntities, loadEntityTags } from '#services/entity'
import { loadProvinces, loadRegencies } from '#services/location'
import { hasPermission } from '#shared/permission/index'
import { RequestloginResponse } from '#types/auth'
import { getUserStorage } from '#utils/storage/user'
import { TFunction } from 'i18next'

import { statusFilterOptions } from '../constants/status'
import { filterOfUser } from '../utils/util'

export type Params = {
  t: TFunction<['common', 'distributionDisposal']>
  queryKey: string
}

export const distributionDisposalFilterSchema = ({
  t,
  queryKey,
}: Params): UseFilter => {
  const hasGlobalPermission = hasPermission(
    'disposal-distribution-enable-select-entity'
  )

  const userEntity = getUserStorage()
  const { defaultProvince, defaultRegency } = filterOfUser(
    userEntity as RequestloginResponse
  )

  const mainFilter: FilterFormSchema[] = [
    {
      id: 'distribution_disposal__list__activity_id',
      type: 'select-async-paginate',
      name: 'activity_id',
      label: t('distributionDisposal:filter.label.activity'),
      placeholder: t('distributionDisposal:filter.placeholder.activity'),
      className: '',
      defaultValue: null,
      loadOptions: loadActivityOptions,
      additional: { page: 1 },
    },
    {
      id: 'distribution_disposal__list__date_range',
      type: 'date-range-picker',
      name: 'date_range',
      label: t('distributionDisposal:filter.label.shipment_date'),
      multicalendar: true,
      className: '',
      defaultValue: null,
    },
    {
      id: 'distribution_disposal__list__shipped_number',
      type: 'text',
      name: 'shipped_number',
      label: t('distributionDisposal:filter.label.search'),
      placeholder: t('distributionDisposal:filter.placeholder.search'),
      className: '',
      defaultValue: '',
    },
    {
      id: 'distribution_disposal__list__status',
      type: 'select',
      name: 'status',
      label: 'Status',
      placeholder: t('distributionDisposal:filter.placeholder.status'),
      className: '',
      defaultValue: null,
      options: statusFilterOptions(t),
    },
    {
      id: 'transaction__list__entity_tag_id',
      type: 'select-async-paginate',
      name: 'entity_tag_id',
      isMulti: false,
      label: t('distributionDisposal:filter.label.entity_tag'),
      placeholder: t('distributionDisposal:filter.placeholder.entity_tag'),
      hidden: queryKey === 'all',
      className: '',
      defaultValue: null,
      loadOptions: loadEntityTags,
      additional: { page: 1 },
    },
    {
      id: 'distribution_disposal__list__primary_vendor_id',
      type: 'select-async-paginate',
      name: 'primary_vendor_id',
      hidden: !hasGlobalPermission || queryKey === 'all',
      label: t('distributionDisposal:filter.label.primary_vendor'),
      placeholder: t('distributionDisposal:filter.placeholder.primary_vendor'),
      className: '',
      defaultValue: null,
      loadOptions: loadEntities,
      clearOnChangeFields: ['entity_id'],
      additional: () => ({
        page: 1,
        nonbasic_type: BOOLEAN.TRUE,
        type_ids: ENTITY_TYPE.PRIMARY_VENDOR.toString(),
      }),
    },
    {
      id: 'distribution__disposal__select_province',
      type: 'select-async-paginate',
      name: 'province_id',
      label: t('distributionDisposal:filter.label.province'),
      placeholder: t('distributionDisposal:filter.placeholder.province'),
      loadOptions: loadProvinces,
      hidden: queryKey === 'all',
      clearOnChangeFields: ['regency_id', 'entity_id'],
      disabled: !!defaultProvince,
      additional: {
        page: 1,
      },
      defaultValue: defaultProvince,
    },
    {
      id: 'distribution__disposal__select_regency',
      type: 'select-async-paginate',
      name: 'regency_id',
      label: t('distributionDisposal:filter.label.city'),
      placeholder: t('distributionDisposal:filter.placeholder.city'),
      hidden: queryKey === 'all',
      loadOptions: loadRegencies,
      clearOnChangeFields: ['entity_id'],
      disabled: ({ getReactSelectValue }) =>
        !getReactSelectValue('province_id') || !!defaultRegency,
      additional: ({ getReactSelectValue }: { getReactSelectValue: any }) => ({
        page: 1,
        ...(getReactSelectValue('province_id') && {
          parent_id: getReactSelectValue('province_id'),
        }),
      }),
      defaultValue: defaultRegency,
    },
    {
      id: 'distribution__disposal__select_entity',
      type: 'select-async-paginate',
      name: 'entity_id',
      label: t('distributionDisposal:filter.label.primary_health_care'),
      placeholder: t(
        'distributionDisposal:filter.placeholder.primary_health_care'
      ),
      className: '',
      defaultValue: null,
      loadOptions: loadEntities,
      hidden: queryKey === 'all',
      clearOnChangeFields: ['primary_vendor_id'],
      disabled: ({ getReactSelectValue }) =>
        !getReactSelectValue('regency_id') && hasGlobalPermission,
      additional: ({ getReactSelectValue }: { getReactSelectValue: any }) => ({
        page: 1,
        province_ids: getReactSelectValue('province_id')?.toString() ?? null,
        regency_ids: getReactSelectValue('regency_id')?.toString() ?? null,
        type_ids: ENTITY_TYPE.FASKES.toString(),
        is_vendor: BOOLEAN.TRUE,
      }),
    },
  ]

  return mainFilter
}
