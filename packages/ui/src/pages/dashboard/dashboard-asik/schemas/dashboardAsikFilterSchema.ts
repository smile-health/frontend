import { UseFilter } from '#components/filter'
import { OptionType } from '#components/react-select'
import { loadEntities, loadEntityTags } from '#services/entity'
import { loadProvinces, loadRegencies } from '#services/location'
import { getMaterialLevels, loadMaterial } from '#services/material'
import { hasPermission } from '#shared/permission/index'
import { getProgramStorage } from '#utils/storage/program'
import { getUserStorage } from '#utils/storage/user'
import dayjs from 'dayjs'
import { TFunction } from 'i18next'

import {
  defaultEntityTags,
  EntityTag,
  yearList,
} from '../../dashboard.constant'
import { getMaterialType, ROUTINE_ACTIVITY } from '../dashboard-asik.constant'

export default function dashboardAsikFilterSchema(
  t: TFunction<'dashboardAsik'>,
  tDashboard: TFunction<'dashboard'>,
  lang?: string
) {
  const firstJanuaryThisYear = dayjs().startOf('year').format('YYYY-MM-DD')
  const isManager = hasPermission('dashboard-manager-location-filter')
  const user = getUserStorage()
  const program = getProgramStorage()

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

  const currentYear = new Date().getFullYear()
  const years = yearList(currentYear)
  const materialType = getMaterialType(t)

  const defaultEntityTag = defaultEntityTags(tDashboard).filter((tag) => {
    return tag.value === EntityTag.Puskesmas
  })

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
      id: 'year',
      type: 'select',
      name: 'year',
      label: t('form.year.label'),
      options: years,
      isUsingReactQuery: false,
      isClearable: false,
      defaultValue: {
        label: currentYear.toString(),
        value: currentYear,
      },
    },
    {
      id: 'activity',
      type: 'select',
      name: 'activity',
      label: t('form.activity.label'),
      placeholder: t('form.activity.placeholder'),
      options: [ROUTINE_ACTIVITY],
      clearOnChangeFields: ['material'],
      isUsingReactQuery: false,
      disabled: true,
      defaultValue: ROUTINE_ACTIVITY,
    },
    {
      id: 'material-type',
      type: 'select',
      name: 'material_type',
      label: t('form.material.type.label'),
      placeholder: t('form.material.type.placeholder'),
      options: [materialType],
      clearOnChangeFields: ['material'],
      isUsingReactQuery: false,
      disabled: true,
      defaultValue: materialType,
    },
    {
      id: 'select-material-level',
      type: 'select',
      name: 'material_level',
      label: t('form.material.level.label'),
      placeholder: t('form.material.level.placeholder'),
      isClearable: false,
      clearOnChangeFields: ['material'],
      loadOptions: async () => {
        const response = await getMaterialLevels({
          page: 1,
          paginate: 50,
          enable_only: 1,
        })

        return response?.data?.map((item) => ({
          label: item?.name,
          value: item?.id,
        }))
      },
      defaultValue: {
        value: 3,
        label: t('data.material_level.trademark'),
      },
    },
    {
      id: 'select-material-name',
      type: 'select-async-paginate',
      name: 'material',
      label: t('form.material.name.label'),
      placeholder: t('form.material.name.placeholder'),
      loadOptions: loadMaterial,
      required: true,
      additional: ({ getReactSelectValue }) => ({
        page: 1,
        status: 1,
        activity_id: getReactSelectValue('activity'),
        material_type_ids: getReactSelectValue('material_type'),
        material_level_id: getReactSelectValue('material_level'),
        program_id: program?.id,
      }),
      defaultValue: null,
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
      label: t('form.regency.label'),
      placeholder: t('form.regency.placeholder'),
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
      label: t('form.health_facilities.label'),
      placeholder: t('form.health_facilities.placeholder'),
      loadOptions: loadEntities,
      clearOnChangeFields: ['entity_tags'],
      disabled: ({ getValue }) => {
        const entityTags = getValue('entity_tags') as OptionType[]
        return entityTags?.length > 0
      },
      additional: ({ getReactSelectValue }) => ({
        page: 1,
        is_vendor: 1,
        type_ids: 3,
        province_ids: getReactSelectValue('province'),
        regency_ids: getReactSelectValue('regency'),
      }),
      defaultValue: null,
    },
    {
      id: 'select-entity-tag',
      type: 'select-async-paginate',
      name: 'entity_tags',
      label: t('form.entity_tag.label'),
      placeholder: t('form.entity_tag.placeholder'),
      loadOptions: loadEntityTags,
      additional: { page: 1, lang },
      clearOnChangeFields: ['entity'],
      disabled: ({ getValue }) => {
        const entity = getValue('entity') as OptionType
        return !!entity?.value
      },
      isMulti: true,
      defaultValue: defaultEntityTag,
    },
  ] satisfies UseFilter
}
