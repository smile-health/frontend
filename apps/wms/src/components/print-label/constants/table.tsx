import { TPrintLabel } from '@/types/print-label';
import { SourceType } from '@/types/waste-source';
import { isSanitarian, isViewOnly } from '@/utils/getUserRole';
import { ColumnDef } from '@tanstack/react-table';
import { TFunction } from 'i18next';

import { ButtonActionTable } from '@/components/ButtonActionTable';
import {
  getInternalTreatmentOptions,
  getSourceTypeOptions,
} from '@/components/waste-source/utils/helper';
import i18n from '@/locales/i18n';
import { Button } from '@repo/ui/components/button';
import { Checkbox } from '@repo/ui/components/checkbox';
import dayjs from 'dayjs';

type DataProps = {
  page: number;
  size: number;
  handleDeletePrintLabel?: (id: number) => void;
};

export const columnsPrintLabel = (
  t: TFunction<['common', 'printLabel']>,
  {
    handleDeletePrintLabel,
    setRowSelection,
  }: DataProps & {
    setRowSelection?: React.Dispatch<
      React.SetStateAction<Record<string, boolean>>
    >;
  }
): ColumnDef<TPrintLabel>[] => [
  {
    header: ({ table }) => {
      if (!setRowSelection) return null;

      const allSelected = table
        .getRowModel()
        .rows.every((r) => r.getIsSelected());
      const someSelected = table
        .getRowModel()
        .rows.some((r) => r.getIsSelected());

      return (
        <Checkbox
          checked={allSelected}
          indeterminate={!allSelected && someSelected}
          onChange={() =>
            table
              .getRowModel()
              .rows.forEach((r) => r.toggleSelected(!allSelected))
          }
        />
      );
    },
    id: 'select',
    size: 50,
    enableSorting: false,
    cell: ({ row }) => {
      if (!setRowSelection) return null;

      return (
        <Checkbox
          checked={row.getIsSelected()}
          onChange={row.getToggleSelectedHandler()}
        />
      );
    },
  },
  {
    header: t('printLabel:list.column.source_type'),
    accessorKey: 'source_type',
    id: 'source_type',
    size: 500,
    enableSorting: false,
    cell: ({ row: { original } }) => {
      const options = getSourceTypeOptions();
      const source = options.find(
        (s) => s.value === original?.wasteSource?.sourceType
      );
      return <span>{source?.label ?? '-'}</span>;
    },
  },
  {
    header: t('printLabel:list.column.waste_source'),
    accessorKey: 'waste_source',
    id: 'waste_source',
    size: 500,
    enableSorting: false,
    cell: ({ row: { original } }) => {
      const {
        sourceType,
        internalTreatmentName,
        externalHealthcareFacilityName,
        internalSourceName,
      } = original?.wasteSource ?? {};

      switch (sourceType) {
        case SourceType.INTERNAL:
          return internalSourceName ?? '-';
        case SourceType.EXTERNAL:
          return externalHealthcareFacilityName ?? '-';
        case SourceType.INTERNAL_TREATMENT:
          if (!internalTreatmentName) return '-';
          const treatment = getInternalTreatmentOptions().find(
            (option) => option.value === internalTreatmentName
          );
          return treatment?.label ?? internalTreatmentName;
        default:
          return '-';
      }
    },
  },
  {
    header: t('printLabel:list.column.waste_characteristic'),
    accessorKey: 'waste_characteristic',
    id: 'waste_characteristic',
    size: 500,
    enableSorting: false,
    cell: ({ row: { original } }) =>
      (i18n.language === 'id'
        ? original?.wasteClassification?.wasteCharacteristics?.name
        : original?.wasteClassification?.wasteCharacteristics?.nameEn) ?? '-',
  },
  {
    header: t('printLabel:list.column.total_label'),
    accessorKey: 'total_label',
    id: 'total_label',
    size: 500,
    enableSorting: false,
    cell: ({ row: { original } }) => original?.labelCount ?? '-',
  },
  {
    header: t('printLabel:list.column.updated_at'),
    accessorKey: 'updated_at',
    id: 'updated_at',
    size: 500,
    enableSorting: false,
    cell: ({ row: { original } }) => {
      return (
        <div className="ui-flex ui-flex-col ui-gap-0.5">
          <p>{original.userName}</p>
          <p>
            {original.updatedAt
              ? dayjs(original.updatedAt).format('DD/MM/YYYY')
              : '-'}
          </p>
        </div>
      );
    },
  },
  {
    header: t('printLabel:list.column.action'),
    accessorKey: 'action',
    id: 'action',
    meta: {
      hidden: isViewOnly() || isSanitarian(),
    },
    size: 160,
    cell: ({ row: { original } }) => {
      return (
        <div className="ui-flex ui-gap-0.5">
          <ButtonActionTable
            id={original?.id}
            path={`print-label`}
            hidden={['detail', 'activation']}
          />
          <Button
            onClick={() =>
              handleDeletePrintLabel && handleDeletePrintLabel(original.id)
            }
            type="button"
            variant="subtle"
            className="!ui-px-1.5 ui-text-danger-500"
          >
            {t('common:remove')}
          </Button>
        </div>
      );
    },
  },
];
