'use client'

import { UseFilter } from '#components/filter'
import { loadAssetModel } from '#services/asset-model'
import { loadCoreEntities, loadEntityTags } from '#services/entity'
import { loadProvinces, loadRegencies } from '#services/location'
import { hasPermission } from '#shared/permission/index'
import { getUserStorage } from '#utils/storage/user'
import dayjs from 'dayjs'
import { TFunction } from 'i18next'

export default function dashboardTemperatureMonitoringFilterSchema(
  t: TFunction<'dashboardAssetTemperatureMonitoring'>,
  lang: string
) {
  const isManager = hasPermission('dashboard-manager-location-filter')
  const user = getUserStorage()

  const useInitialProvince = Boolean(user?.entity?.province)
  const useInitialRegency = Boolean(user?.entity?.regency)
  const isDisableProvince = isManager && useInitialProvince
  const isDisableRegency = isManager && useInitialRegency

  const provinceInitialOption = {
    label: user?.entity?.province?.name ?? '',
    value: user?.entity?.province?.id,
  }
  const regencyInitialOption = {
    label: user?.entity?.regency?.name ?? '',
    value: user?.entity?.regency?.id,
  }

  return [
    {
      id: 'date-range',
      type: 'date-range-picker',
      name: 'date',
      label: t('form.date.label'),
      maxRange: 31,
      defaultValue: {
        start: dayjs().subtract(1, 'month').format('YYYY-MM-DD'),
        end: dayjs().format('YYYY-MM-DD'),
      },
    },
    {
      id: 'select-province',
      type: 'select-async-paginate',
      name: 'province',
      label: t('form.province.label'),
      placeholder: t('form.province.placeholder'),
      loadOptions: loadProvinces,
      disabled: isDisableProvince,
      clearOnChangeFields: ['regency', 'entity'],
      additional: { page: 1 },
      defaultValue: useInitialProvince ? provinceInitialOption : null,
    },
    {
      id: 'select-regency',
      type: 'select-async-paginate',
      name: 'regency',
      label: t('form.city.label'),
      placeholder: t('form.city.placeholder'),
      disabled: ({ getValue }) => !getValue('province') || isDisableRegency,
      loadOptions: loadRegencies,
      clearOnChangeFields: ['entity'],
      additional: ({ getReactSelectValue }) => ({
        parent_id: getReactSelectValue('province'),
        page: 1,
      }),
      defaultValue: useInitialRegency ? regencyInitialOption : null,
    },
    {
      id: 'select-entity',
      type: 'select-async-paginate',
      name: 'entity',
      label: t('form.entity.label'),
      placeholder: t('form.entity.placeholder'),
      loadOptions: loadCoreEntities,
      disabled: ({ getValue }) => !getValue('province') || !getValue('regency'),
      additional: ({ getReactSelectValue }) => ({
        page: 1,
        province_id: getReactSelectValue('province'),
        regency_id: getReactSelectValue('regency'),
        type_ids: 3,
        is_vendor: 1,
      }),
      defaultValue: null,
    },
    {
      id: 'select-entity-tag',
      type: 'select-async-paginate',
      name: 'entity_tag',
      label: t('form.entity_tag.label'),
      placeholder: t('form.entity_tag.placeholder'),
      loadOptions: loadEntityTags,
      additional: { page: 1, lang, isGlobal: true },
      isMulti: true,
      defaultValue: null,
    },
    {
      id: 'select-asset-model',
      type: 'select-async-paginate',
      name: 'asset_model',
      label: t('form.asset_model.label'),
      placeholder: t('form.asset_model.placeholder'),
      loadOptions: loadAssetModel,
      additional: { page: 1, isGlobal: true },
      isMulti: true,
      defaultValue: null,
    },
  ] satisfies UseFilter
}
