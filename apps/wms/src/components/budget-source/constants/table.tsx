import { ButtonActionTable } from '@/components/ButtonActionTable';
import { TBudgetSource } from '@/types/budget-source';
import { isViewOnly } from '@/utils/getUserRole';
import { ColumnDef } from '@tanstack/react-table';
import { TFunction } from 'i18next';

type DataProps = {
  page: number;
  size: number;
};

export const columnsBudgetSource = (
  t: TFunction<['common', 'budgetSource']>,
  { page, size }: DataProps
): ColumnDef<TBudgetSource>[] => [
  {
    header: 'No.',
    accessorKey: 'no',
    id: 'no',
    size: 50,
    cell: ({ row: { index } }) => (page - 1) * size + (index + 1),
  },
  {
    header: t('budgetSource:list.column.name'),
    accessorKey: 'name',
    id: 'name',
    size: 500,
    enableSorting: false,
    cell: ({ row: { original } }) => original.name ?? '-',
  },
  {
    header: t('budgetSource:list.column.description'),
    accessorKey: 'description',
    id: 'description',
    size: 500,
    enableSorting: false,
    cell: ({ row: { original } }) => original.description ?? '-',
  },
  {
    header: t('budgetSource:list.column.action'),
    accessorKey: 'action',
    id: 'action',
    meta: {
      hidden: isViewOnly(),
    },
    size: 160,
    cell: ({ row: { original } }) => {
      return (
        <div className="ui-flex">
          <ButtonActionTable
            id={original?.id}
            path={'/budget-source'}
            hidden={['activation']}
          />
        </div>
      );
    },
  },
];
