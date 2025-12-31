import { getCurrencySymbol, numberFormatter } from '@/utils/formatter';
import { isViewOnly } from '@/utils/getUserRole';
import { Button } from '@repo/ui/components/button';
import { DataTable } from '@repo/ui/components/data-table';
import { ColumnDef } from '@tanstack/react-table';
import { useTranslation } from 'react-i18next';

interface WasteSpecificationTableProps {
  data: any[];
  onEdit: (index: number) => void;
  onRemove: (index: number) => void;
}

export const WasteSpecificationTable = ({
  data,
  onEdit,
  onRemove,
}: WasteSpecificationTableProps) => {
  const { t } = useTranslation(['partnership', 'common']);
  const wasteSpecificationColumns: ColumnDef<any>[] = [
    {
      header: 'No.',
      accessorKey: 'no',
      id: 'no',
      size: 50,
      cell: ({ row: { index } }) => index + 1,
    },
    {
      header: t('partnership:form.waste_type.label'),
      accessorKey: 'type',
      id: 'type',
      size: 200,
      cell: ({ row: { original } }) => original.typeLabel || '-',
    },
    {
      header: t('partnership:form.waste_group.label'),
      accessorKey: 'group',
      id: 'group',
      size: 200,
      cell: ({ row: { original } }) => original.groupLabel || '-',
    },
    {
      header: t('partnership:form.waste_characteristic.label'),
      accessorKey: 'characteristic',
      id: 'characteristic',
      size: 200,
      cell: ({ row: { original } }) => original.characteristicLabel || '-',
    },
    {
      header: t('partnership:list.column.price_kg'),
      accessorKey: 'pricePerKg',
      id: 'pricePerKg',
      size: 200,
      cell: ({ row: { original } }) =>
        getCurrencySymbol() +
        ' ' +
        numberFormatter(Number(original?.pricePerKg)),
    },
    {
      header: t('common:action'),
      accessorKey: 'action',
      id: 'action',
      meta: {
        hidden: isViewOnly(),
      },
      size: 100,
      cell: ({ row: { index } }) => (
        <div className="ui-flex">
          <Button
            onClick={() => onEdit(index)}
            type="button"
            variant="subtle"
            className="!ui-px-1"
            size="sm"
          >
            {t('common:edit')}
          </Button>
          <Button
            onClick={() => onRemove(index)}
            type="button"
            variant="subtle"
            className="!ui-px-1 ui-text-danger-500"
            size="sm"
          >
            {t('common:remove')}
          </Button>
        </div>
      ),
    },
  ];

  return <DataTable data={data} columns={wasteSpecificationColumns} />;
};
