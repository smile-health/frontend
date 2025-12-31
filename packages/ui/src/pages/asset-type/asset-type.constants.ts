import { TFunction } from 'i18next'

export const assetTypeIsCCEEquipment = (t: TFunction<['assetType']>) => [
  {
    id: 1,
    name: t('form.detail.is_cce_equipment.radio.yes'),
  },
  {
    id: 0,
    name: t('form.detail.is_cce_equipment.radio.no'),
  },
]
