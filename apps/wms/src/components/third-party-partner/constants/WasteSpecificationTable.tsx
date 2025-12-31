import { isViewOnly } from '@/utils/getUserRole';
import { Button } from '@repo/ui/components/button';
import { DataTable } from '@repo/ui/components/data-table';
import { ColumnDef } from '@tanstack/react-table';
import { useTranslation } from 'react-i18next';
import { getProviderTypeOptions } from '../utils/helper';

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
  const { t } = useTranslation(['thirdPartyPartner', 'common']);
  const wasteSpecificationColumns: ColumnDef<any>[] = [
    {
      header: 'No.',
      accessorKey: 'no',
      id: 'no',
      size: 50,
      cell: ({ row: { index } }) => index + 1,
    },
    {
      header: t('thirdPartyPartner:form.waste_characteristic.label'),
      accessorKey: 'waste_characteristic',
      id: 'waste_characteristic',
      size: 500,
      cell: ({ row: { original } }) => original.characteristicLabel || '-',
    },
    {
      header: t('thirdPartyPartner:list.column.partnership_type'),
      accessorKey: 'partnership_type',
      id: 'partnership_type',
      size: 200,
      cell: ({ row: { original } }) =>
        getProviderTypeOptions().find(
          (option) => option.value === original.providerType
        )?.label,
    },
    {
      header: t('common:action'),
      accessorKey: 'action',
      id: 'action',
      meta: {
        hidden: isViewOnly(),
      },
      size: 120,
      cell: ({ row: { index } }) => (
        <div className="ui-flex ui-gap-1">
          <Button
            onClick={() => onEdit(index)}
            type="button"
            variant="subtle"
            className="!ui-px-2"
            size="sm"
          >
            {t('common:edit')}
          </Button>
          <Button
            onClick={() => onRemove(index)}
            type="button"
            variant="subtle"
            className="!ui-px-2 ui-text-danger-500"
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
