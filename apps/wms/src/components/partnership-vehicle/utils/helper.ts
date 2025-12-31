import { TPartnershipVehicle } from '@/types/partnership-vehicle';
import { vehicleTypes } from '../constants/partnershipVehicle';

export function handleDefaultValuePartnershipVehicle(
  defaultValue?: TPartnershipVehicle
) {
  return {
    vehicleType: defaultValue?.vehicleType,
    vehicleNumber: defaultValue?.vehicleNumber,
    capacityInKgs: defaultValue?.capacityInKgs,
    entity: defaultValue?.entityId
      ? {
          value: defaultValue?.entityId,
          label: defaultValue?.entityName ?? '',
        }
      : null,
  };
}

export function getVehicleTypeLabel(value: string) {
  return vehicleTypes.find((x) => x.value === value)?.label ?? '-';
}
