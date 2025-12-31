import {
  TWasteTrackingCharacteristics,
  TWasteTrackingCharacteristicsRow,
} from '@/types/tracking';

export function transformWasteData(
  data: TWasteTrackingCharacteristics[] | undefined
): TWasteTrackingCharacteristicsRow[] {
  const facilityCount: Record<string, number> = {};
  data?.forEach((item) => {
    const wasteCharacteristicsName = item.wasteCharacteristicsName;
    facilityCount[wasteCharacteristicsName] =
      (facilityCount[wasteCharacteristicsName] || 0) + 1;
  });

  const result: TWasteTrackingCharacteristicsRow[] = [];
  const facilityProcessed: Record<string, boolean> = {};

  data?.forEach((item) => {
    const wasteCharacteristicsName = item.wasteCharacteristicsName;

    if (!facilityProcessed[wasteCharacteristicsName]) {
      facilityProcessed[wasteCharacteristicsName] = true;
      result.push({
        ...item,
        rowSpan: facilityCount[wasteCharacteristicsName],
        isLabel: true,
      });
    } else {
      result.push({
        ...item,
        rowSpan: 0,
        isLabel: false,
      });
    }
  });

  return result;
}

export function formatEnumType(value: string): string {
  if (!value) return '';
  return value
    .split('_')
    .map((word) => word[0] + word.slice(1).toLowerCase())
    .join(' ');
}
