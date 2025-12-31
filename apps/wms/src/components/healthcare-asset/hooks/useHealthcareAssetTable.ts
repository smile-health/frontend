import { UseFilter, useFilter } from '@repo/ui/components/filter';
import { parseAsInteger, useQueryStates } from 'nuqs';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { ColumnSort } from '@tanstack/react-table';

import { getReactSelectValue } from '@repo/ui/utils/react-select';
import { createFilterHealthcareAssetGroupSchema } from '../schema/HealthcareAssetSchemaList';
import { getAssetInventory } from '@/services/healthcare-asset';
import { getUserStorage } from '@/utils/storage/user';

export const useHealthcareAssetTable = () => {
  const {
    t,
    i18n: { language },
  } = useTranslation(['common', 'healthcareAsset']);
  const user = getUserStorage();

  const [pagination, setPagination] = useQueryStates(
    {
      page: parseAsInteger.withDefault(1),
      paginate: parseAsInteger.withDefault(10),
    },
    {
      history: 'push',
    }
  );
  const [sorting, setSorting] = useState<ColumnSort[]>([]);

  const filterSchema = useMemo<UseFilter>(
    () =>
      createFilterHealthcareAssetGroupSchema({
        t,
      }),
    [t]
  );
  const filter = useFilter(filterSchema);

  const {
    data: healthcareAssetDataSource,
    isFetching: isHealthcareAssetFetchingData,
    refetch: refetchHealthcareAsset,
  } = useQuery({
    queryKey: ['healthcare-asset', filter.query, pagination, language, sorting],
    queryFn: () => {
      const { search, workingStatusId, status } = filter.query;

      const params = {
        page: pagination.page || 1,
        paginate: pagination.paginate || 10,
        keyword: search,
        status: getReactSelectValue(status),
        working_status_id: getReactSelectValue(workingStatusId),
        health_center_id: user?.entity_id,
      };
      return getAssetInventory(params);
    },
    placeholderData: keepPreviousData,
  });

  const handleChangePage = (page: number) => setPagination({ page });

  const handleChangePaginate = (paginate: number) => {
    setPagination({ page: 1, paginate });
  };

  return {
    filter,
    handleChangePage,
    handleChangePaginate,
    setPagination,
    pagination,
    sorting,
    setSorting,
    healthcareAssetDataSource,
    isLoading: isHealthcareAssetFetchingData,
    refetchHealthcareAsset,
  };
};
