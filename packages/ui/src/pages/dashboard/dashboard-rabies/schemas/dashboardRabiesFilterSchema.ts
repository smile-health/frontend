import { UseFilter } from '#components/filter'
import { loadEntities, loadEntityTags } from '#services/entity'
import { loadProvinces, loadRegencies } from '#services/location'
import { hasPermission } from '#shared/permission/index'
import { getUserStorage } from '#utils/storage/user'
import dayjs from 'dayjs'
import { TFunction } from 'i18next'

export default function dashboardRabiesFilterSchema(
  t: TFunction<'dashboardRabies'>,
  tDashboard: TFunction<'dashboard'>,
  lang?: string
) {
  const firstJanuaryThisYear = dayjs().startOf('year').format('YYYY-MM-DD')
  const isManager = hasPermission('dashboard-manager-location-filter')
  const user = getUserStorage()

  const useInitialProvince = Boolean(user?.entity?.province)
  const useInitialRegency = Boolean(user?.entity?.regency)
  const isDisableProvince = isManager && useInitialProvince
  const isDisableRegency = isManager && useInitialRegency
  const provinceInitialOption = {
    label: user?.entity?.province?.name ?? '',
    value: Number(user?.entity?.province?.id),
  }

  const regencyInitialOption = {
    label: user?.entity?.regency?.name ?? '',
    value: Number(user?.entity?.regency?.id),
  }

  return [
    {
      id: 'period',
      type: 'date-range-picker',
      name: 'period',
      label: t('form.period.label'),
      clearable: false,
      withPreset: true,
      multicalendar: true,
      defaultValue: {
        start: firstJanuaryThisYear,
        end: dayjs().format('YYYY-MM-DD'),
      },
    },
    {
      id: 'select-entity-tag',
      type: 'select-async-paginate',
      name: 'entity_tags',
      label: t('form.entity_tag.label'),
      placeholder: t('form.entity_tag.placeholder'),
      loadOptions: loadEntityTags,
      additional: { page: 1, lang },
      isMulti: true,
      defaultValue: null,
    },
    {
      id: 'select-province',
      type: 'select-async-paginate',
      name: 'provinces',
      label: t('form.province.label'),
      placeholder: t('form.province.placeholder'),
      loadOptions: loadProvinces,
      disabled: isDisableProvince,
      clearOnChangeFields: ['regency', 'entity'],
      isMulti: true,
      additional: { page: 1 },
      defaultValue: useInitialProvince ? [provinceInitialOption] : null,
    },
    {
      id: 'select-regency',
      type: 'select-async-paginate',
      name: 'regencies',
      label: t('form.regency.label'),
      placeholder: t('form.regency.placeholder'),
      disabled: ({ getValue }) => !getValue('province') || isDisableRegency,
      loadOptions: loadRegencies,
      isMulti: true,
      clearOnChangeFields: ['entity'],
      additional: ({ getReactSelectValue }) => ({
        parent_id: getReactSelectValue('province'),
        page: 1,
      }),
      defaultValue: useInitialRegency ? [regencyInitialOption] : null,
    },
    {
      id: 'select-entity',
      type: 'select-async-paginate',
      name: 'entities',
      label: t('form.health_facilities.label'),
      placeholder: t('form.health_facilities.placeholder'),
      loadOptions: loadEntities,
      isMulti: true,
      disabled: ({ getValue }) => !getValue('regency'),
      additional: ({ getReactSelectValue }) => ({
        page: 1,
        is_vendor: 1,
        type_ids: 3,
        province_ids: getReactSelectValue('province'),
        regency_ids: getReactSelectValue('regency'),
      }),
      defaultValue: null,
    },
  ] satisfies UseFilter
}
