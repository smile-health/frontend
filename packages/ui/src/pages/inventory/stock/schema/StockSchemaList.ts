import { FilterFormSchema, UseFilter } from '#components/filter'
import { OptionType } from '#components/react-select'
import { ENTITY_TYPE } from '#constants/entity'
import { loadActivityOptions } from '#services/activity'
import { loadBatch } from '#services/batch'
import { loadEntities, loadEntityTags } from '#services/entity'
import { loadProvinces, loadRegencies } from '#services/location'
import { loadMaterialType } from '#services/material'
import { TFunction } from 'i18next'

import { loadMaterial } from '../services/stock'
import { KfaLevelEnum } from '#constants/material'

type Params = {
  t: TFunction<['stock', 'common']>
  isHierarchical: boolean
  optionUserEntity: OptionType[]
  isManager: boolean
  entityType: number
  initialFilter: {
    province: { value: number; label: string } | null
    regency: { value: number; label: string } | null
  }
}
export const createFilterSchema = ({
  t,
  isHierarchical,
  optionUserEntity,
  isManager,
  entityType,
  initialFilter,
}: Params): UseFilter => [
  {
    id: 'select-activity',
    type: 'select-async-paginate',
    name: 'activity_id',
    label: t('stock:filter.label.activity'),
    placeholder: t('stock:filter.placeholder.activity'),
    className: '',
    defaultValue: null,
    loadOptions: loadActivityOptions,
    additional: { page: 1 },
  },
  {
    id: 'select-material-type',
    type: 'select-async-paginate',
    name: 'material_type_id',
    label: t('stock:filter.label.material_type'),
    placeholder: t('stock:filter.placeholder.material_type'),
    className: '',
    defaultValue: null,
    loadOptions: loadMaterialType,
    additional: { page: 1 },
  },
  {
    id: 'select-material',
    type: 'select-async-paginate',
    name: 'material_id',
    isMulti: true,
    label: isHierarchical
      ? t('stock:filter.label.material_hirearchy')
      : 'Material',
    placeholder: t('stock:filter.placeholder.material'),
    className: '',
    defaultValue: null,
    clearOnChangeFields: ['batch_ids'],
    loadOptions: loadMaterial,
    additional: {
      page: 1,
      material_level_id: isHierarchical ? KfaLevelEnum.KFA_92 : KfaLevelEnum.KFA_93,
    },
  },
  {
    id: 'select-batch',
    type: 'select-async-paginate',
    name: 'batch_ids',
    isMulti: true,
    label: 'Batch',
    placeholder: t('stock:filter.placeholder.batch'),
    className: '',
    defaultValue: null,
    loadOptions: loadBatch,
    additional: ({ getReactSelectValue }: { getReactSelectValue: any }) => ({
      page: 1,
      ...(getReactSelectValue('material_id') && {
        material_ids: getReactSelectValue('material_id'),
        material_level_id: isHierarchical ? '2' : '3',
      }),
    }),
  },
  {
    id: 'date-range-picker',
    type: 'date-range-picker',
    name: 'date_range',
    withPreset: true,
    multicalendar: true,
    label: t('stock:filter.label.expired_date'),
    className: '',
    defaultValue: null,
  },
  {
    id: 'select-entity-user',
    type: 'select',
    name: 'entity_user_id',
    label: t('stock:filter.label.entity'),
    placeholder: t('stock:filter.placeholder.entity'),
    className: '',
    defaultValue: null,
    options: optionUserEntity,
    clearOnChangeFields: ['entity_id', 'primary_vendor_id'],
  },
  {
    id: 'select-entity-tag',
    type: 'select-async-paginate',
    name: 'entity_tag_id',
    label: t('stock:filter.label.entity_tag'),
    placeholder: t('stock:filter.placeholder.entity_tag'),
    className: '',
    defaultValue: null,
    loadOptions: loadEntityTags,
    additional: { page: 1 },
  },
  ...(!isManager
    ? [
        {
          id: 'select-primary-vendor',
          type: 'select-async-paginate',
          name: 'primary_vendor_id',
          label: t('stock:filter.label.primary_vendor'),
          placeholder: t('stock:filter.placeholder.primary_vendor'),
          className: '',
          defaultValue: null,
          loadOptions: loadEntities,
          clearOnChangeFields: ['entity_id', 'entity_user_id'],
          additional: () => ({
            page: 1,
            type_ids: ENTITY_TYPE.PRIMARY_VENDOR,
          }),
        } as FilterFormSchema,
      ]
    : []),
  {
    id: 'select-province',
    type: 'select-async-paginate',
    name: 'province_id',
    label: t('stock:filter.label.province'),
    placeholder: t('stock:filter.placeholder.province'),
    disabled: () => entityType >= ENTITY_TYPE.PROVINSI && isManager,
    loadOptions: loadProvinces,
    clearOnChangeFields: ['regency_id', 'entity_id'],
    additional: { page: 1 },
    defaultValue: initialFilter.province,
  },
  {
    id: 'select-regency',
    type: 'select-async-paginate',
    name: 'regency_id',
    label: t('stock:filter.label.city'),
    placeholder: t('stock:filter.placeholder.city'),
    loadOptions: loadRegencies,
    disabled: ({ getReactSelectValue }) =>
      !getReactSelectValue('province_id') ||
      (entityType >= ENTITY_TYPE.KOTA && isManager),
    clearOnChangeFields: ['entity_id'],
    additional: ({ getReactSelectValue }: { getReactSelectValue: any }) => ({
      page: 1,
      ...(getReactSelectValue('province_id') && {
        parent_id: getReactSelectValue('province_id'),
      }),
    }),
    defaultValue: initialFilter.regency,
  },
  {
    id: 'select-health-center',
    type: 'select-async-paginate',
    name: 'entity_id',
    label: t('stock:filter.label.primary_health_care'),
    placeholder: t('stock:filter.placeholder.primary_health_care'),
    className: '',
    defaultValue: null,
    loadOptions: loadEntities,
    additional: ({ getReactSelectValue }: { getReactSelectValue: any }) => ({
      page: 1,
      type_ids: ENTITY_TYPE.FASKES,
      is_vendor: 1,
      ...(getReactSelectValue('province_id') && {
        province_ids: getReactSelectValue('province_id'),
      }),
      ...(getReactSelectValue('regency_id') && {
        regency_ids: getReactSelectValue('regency_id'),
      }),
    }),
    clearOnChangeFields: ['primary_vendor_id', 'entity_user_id'],
  },
]
