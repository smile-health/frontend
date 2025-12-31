import { ColumnDef } from '@tanstack/react-table'
import dayjs from 'dayjs'
import { TFunction } from 'i18next'

import {
  TDashboardRabiesEntity,
  TVaccineSequence,
} from './dashboard-rabies.type'

export const VACCINE_METHOD = {
  INTRA_MUSCULAR: '1',
  INTRA_DERMAL: '2',
}

export const getMethodList = (t: TFunction<'dashboardRabies'>) => {
  return [
    {
      label: t('label.all'),
      value: '0',
    },
    {
      label: t('label.intra_muscular'),
      value: VACCINE_METHOD.INTRA_MUSCULAR,
    },
    {
      label: 'Intra Dermal',
      value: VACCINE_METHOD.INTRA_DERMAL,
    },
  ]
}

export const getGenderList = (t: TFunction<'dashboardRabies'>) => {
  return [
    {
      label: t('label.all'),
      value: '0',
    },
    {
      label: t('label.male'),
      value: '1',
    },
    {
      label: t('label.female'),
      value: '2',
    },
    {
      label: 'Undefined',
      value: '3',
    },
  ]
}

export const getCareCascadeTabs = (t: TFunction<'dashboardRabies'>) => {
  return [
    {
      key: 'all',
      label: t('label.all'),
      value: '',
    },
    {
      key: 'nik',
      label: t('label.nik'),
      value: '1',
    },
    {
      key: 'non-nik',
      label: t('label.non_nik'),
      value: '2',
    },
  ]
}

export const MONTHLY_PATIENT_DOSE_TABS = ['var', 'sar']

export const VACCINE_SEQUENCE = {
  VAR_I: 1,
  VAR_II: 2,
  VAR_III: 3,
  BOOSTER_I: 4,
  BOOSTER_II: 5,
  PRE_EXPOSURE_I: 6,
  PRE_EXPOSURE_II: 7,
  VAR_IV: 8,
}

export const VACCINE_SEQUENCE_COLOR = {
  prep1: '#680771',
  prep2: '#D86DCD',
  var1: '#004990',
  var2: '#1BA8DF',
  var3: '#0367FF',
  var8: '#6EB0FF',
  booster1: '#FFC002',
  booster2: '#FFDF79',
}

export const getVaccineSequenceLabel = (
  t: TFunction<'dashboardRabies'>,
  key: keyof TVaccineSequence
) => {
  const mappingLabel: Record<keyof TVaccineSequence, string> = {
    prep1: t('label.prep', { day: 0 }),
    prep2: t('label.prep', { day: 7 }),
    var1: t('label.pep', { day: 0 }),
    var2: t('label.pep', { day: 7 }),
    var3: t('label.pep', { day: '21/28' }),
    var8: t('label.pep', { day: 3 }),
    booster1: t('label.booster', { day: 0 }),
    booster2: t('label.booster', { day: 3 }),
  }

  return mappingLabel[key]
}

export const getDashboardRabiesEntityColumns = (
  t: TFunction<'dashboardRabies'>,
  formatNumber: (value?: number) => string
) => {
  const schema: Array<ColumnDef<TDashboardRabiesEntity>> = [
    {
      header: 'No.',
      accessorKey: 'row',
      size: 20,
      maxSize: 20,
    },
    {
      header: t('label.province'),
      accessorKey: 'province_name',
    },
    {
      header: t('label.regency'),
      accessorKey: 'regency_name',
    },
    {
      header: t('label.entity_name'),
      accessorKey: 'entity_name',
    },
    {
      header: t('label.patient_id'),
      accessorKey: 'patient_nik',
    },
    {
      header: t('label.material_name'),
      accessorKey: 'material_name',
    },
    {
      header: t('label.material_unit'),
      accessorKey: 'material_unit',
    },
    {
      header: t('label.material_category'),
      accessorKey: 'material_category',
    },
    {
      header: t('label.vaccine_type'),
      accessorKey: 'vaccine_type',
    },
    {
      header: t('label.quantity'),
      accessorKey: 'pieces',
      cell: ({ getValue }) => formatNumber(getValue<number>()),
    },
    {
      header: t('label.created_at'),
      accessorKey: 'actual_transaction_date',
      cell: ({ getValue }) => {
        const value = getValue<string>()
        return value ? dayjs(value).format('DD/MM/YYYY') : '-'
      },
    },
  ]

  return schema
}
