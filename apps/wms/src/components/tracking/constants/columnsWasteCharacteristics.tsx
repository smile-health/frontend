import i18n from '@/locales/i18n';
import { TWasteTrackingCharacteristicsRow } from '@/types/tracking';
import { useFormatWasteBagWeight } from '@/utils/hooks/useFormatWeight';
import { mapWasteStatus } from '@/utils/mappingWasteStatus';
import { ColumnDef } from '@tanstack/react-table';
import { TFunction } from 'i18next';

export const ColumnsWasteCharacteristics = (
  t: TFunction<['common', 'tracking']>
): ColumnDef<TWasteTrackingCharacteristicsRow>[] => {
  const { formatWasteBagWeight, unit } = useFormatWasteBagWeight();
  return [
    {
      header: t(
        'tracking:list.column_waste_characteristics.waste_characteristic'
      ),
      accessorKey: 'waste_characteristic',
      id: 'waste_characteristic',
      size: 1000,
      meta: {
        rowSpan: (row) => row.original.rowSpan ?? 0,
        cellClassName: ({ original }) => (original.rowSpan ? '' : 'ui-hidden'),
      },
      cell: ({ row }) =>
        row.original.rowSpan ? (
          <>
            {i18n.language === 'id'
              ? row.original.wasteTypeName
              : row.original.wasteTypeNameEn}{' '}
            /{' '}
            {i18n.language === 'id'
              ? row.original.wasteGroupName
              : row.original.wasteGroupNameEn}{' '}
            /{' '}
            {i18n.language === 'id'
              ? row.original.wasteCharacteristicsName
              : row.original.wasteCharacteristicsNameEn}
          </>
        ) : null,
    },
    {
      header: t('tracking:list.column_waste_characteristics.waste_action'),
      accessorKey: 'waste_action',
      id: 'waste_action',
      size: 500,
      enableSorting: false,
      cell: ({ row }) =>
        mapWasteStatus(row.original.wasteStatus, row.original.disposalMethod),
    },
    {
      header: t('tracking:list.column_waste_characteristics.total_weight', {
        unit,
      }),
      accessorKey: 'total_weight',
      id: 'total_weight',
      size: 500,
      enableSorting: false,
      cell: ({ row }) => formatWasteBagWeight(row.original.totalWeightInKgs),
    },
    {
      header: t('tracking:list.column_waste_characteristics.average_weight', {
        unit,
      }),
      accessorKey: 'average_weight',
      id: 'average_weight',
      size: 500,
      enableSorting: false,
      cell: ({ row }) => formatWasteBagWeight(row.original.avgWeightPerDay),
    },
    {
      header: t('tracking:list.column_waste_characteristics.total_bag'),
      accessorKey: 'total_bag',
      id: 'total_bag',
      size: 500,
      enableSorting: false,
      cell: ({ row }) => row.original.totalWasteBag,
    },
    {
      header: t('tracking:list.column_waste_characteristics.average_bag', {
        unit,
      }),
      accessorKey: 'average_bag',
      id: 'average_bag',
      size: 500,
      enableSorting: false,
      cell: ({ row }) => row.original.avgWasteBagPerDay,
    },
  ];
};
