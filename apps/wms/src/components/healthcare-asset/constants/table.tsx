import { ButtonActionTable } from '@/components/ButtonActionTable';
import { isViewOnly } from '@/utils/getUserRole';
import { Badge } from '@repo/ui/components/badge';
import { ColumnDef } from '@tanstack/react-table';
import { TFunction } from 'i18next';
import { THealthcareAsset, WorkingStatusEnum } from '@/types/healthcare-asset';
import { getWorkingStatus } from './assetHealthcare';

type DataProps = {
  page: number;
  size: number;
};

export const columnsHealthcareAsset = (
  tHealthCare: TFunction<'healthcareAsset'>,
  { page, size }: DataProps
): ColumnDef<THealthcareAsset>[] => {
  return [
    {
      header: 'No.',
      accessorKey: 'no',
      id: 'no',
      size: 50,
      cell: ({ row: { index } }) => (page - 1) * size + (index + 1),
    },
    {
      header: tHealthCare('list.column.serial_number'),
      accessorKey: 'serial_number',
      id: 'serial_number',
      size: 900,
      enableSorting: false,
      cell: ({ row: { original } }) => {
        const assetModelName = original.asset_model?.name ?? '';
        const manufactureName = original.manufacture?.name ?? '';
        return `${original.serial_number} - ${assetModelName} - ${manufactureName}`;
      },
    },
    {
      header: tHealthCare('list.column.asset_type'),
      accessorKey: 'asset_type',
      id: 'asset_type',
      size: 500,
      enableSorting: false,
      cell: ({ row: { original } }) => original?.asset_type?.name ?? '-',
    },
    {
      header: tHealthCare('list.column.asset_status'),
      accessorKey: 'asset_status',
      id: 'asset_status',
      size: 500,
      enableSorting: false,
      cell: ({ row: { original } }) => original?.status?.name ?? '-',
    },
    {
      header: tHealthCare('list.column.working_status'),
      accessorKey: 'working_status',
      id: 'working_status',
      size: 500,
      enableSorting: false,
      cell: ({
        row: {
          original: { working_status },
        },
      }) => (
        <Badge
          key={working_status?.id}
          variant="light"
          rounded="xl"
          color={
            getWorkingStatus(tHealthCare)[
              working_status?.id as WorkingStatusEnum
            ]?.color
          }
        >
          {working_status?.name}
        </Badge>
      ),
    },

    {
      header: tHealthCare('list.column.action'),
      accessorKey: 'action',
      id: 'action',
      meta: {
        hidden: isViewOnly(),
      },
      size: 160,
      cell: ({ row: { original } }) => {
        return (
          <div className="ui-flex ui-gap-0.5">
            <ButtonActionTable
              id={original?.id}
              path={`healthcare-asset`}
              hidden={['activation', 'edit']}
            />
          </div>
        );
      },
    },
  ];
};
