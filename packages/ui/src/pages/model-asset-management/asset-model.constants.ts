export const capacityFields = (temperatureThresholds: number[]) => [
  {
    id: 'capacities5',
    label: 'capacities5',
    category: '+5',
    temperature_threshold_id: temperatureThresholds[0],
  },
  {
    id: 'capacitiesMin20',
    label: 'capacitiesMin20',
    category: '-20',
    temperature_threshold_id: temperatureThresholds[1],
  },
  {
    id: 'capacitiesMin86',
    label: 'capacitiesMin86',
    category: '-86',
    temperature_threshold_id: temperatureThresholds[2],
  },
]

export const ordinalWords = {
  1: '1st',
  2: '2nd',
  3: '3rd',
}

export enum PopupImportType {
  ModelAssetCceWithPqs = 'model_asset_cce_with_pqs',
  ModelAssetCceWithoutPqs = 'model_asset_cce_without_pqs',
  ModelAssetNonCce = 'model_asset_non_cce',
}

export const IMPORT_CONFIGS = [
  {
    id: 'btn-import-model-asset-cce-with-pqs',
    type: 'model_asset_cce_with_pqs',
    templateType: 1,
  },
  {
    id: 'btn-import-model-asset-cce-without-pqs',
    type: 'model_asset_cce_without_pqs',
    templateType: 2,
  },
  {
    id: 'btn-import-model-asset-non-cce',
    type: 'model_asset_non_cce',
    templateType: 3,
  },
] as const
