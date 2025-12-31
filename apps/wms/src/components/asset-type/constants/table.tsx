import { ButtonActionTable } from '@/components/ButtonActionTable';
import { TAssetType } from '@/types/asset-type';
import { isViewOnly } from '@/utils/getUserRole';
import { ColumnDef } from '@tanstack/react-table';
import { TFunction } from 'i18next';

type DataProps = {
  page: number;
  size: number;
};

export const columnsAssetType = (
  t: TFunction<['common', 'assetType']>,
  { page, size }: DataProps
): ColumnDef<TAssetType>[] => [
  {
    header: 'No.',
    accessorKey: 'no',
    id: 'no',
    size: 50,
    cell: ({ row: { index } }) => (page - 1) * size + (index + 1),
  },
  {
    header: t('assetType:list.column.name'),
    accessorKey: 'name',
    id: 'name',
    size: 500,
    enableSorting: false,
    cell: ({ row: { original } }) => original.name ?? '-',
  },
  {
    header: t('assetType:list.column.description'),
    accessorKey: 'description',
    id: 'description',
    size: 500,
    enableSorting: false,
    cell: ({ row: { original } }) => original.description ?? '-',
  },
  {
    header: t('assetType:list.column.action'),
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
            path={'/asset-type'}
            hidden={['activation']}
          />
        </div>
      );
    },
  },
];
