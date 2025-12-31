import { getPartnershipOperator } from '@/services/partnership-operator';
import { getPartnershipVehicle } from '@/services/partnership-vehicle';
import { toast } from '@repo/ui/components/toast';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import type { AxiosError } from 'axios';
import { useParams, usePathname } from 'next/navigation';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  getClassificationPartnership,
  getPartnershipDetail,
} from '../../../services/partnership';
import type { ErrorResponse } from '../../../types/common';
import type {
  GetClassificationPartnershipResponse,
  GetPartnershipDetailResponse,
} from '../../../types/partnership';

export const usePartnershipDetail = () => {
  const {
    i18n: { language },
  } = useTranslation();
  const params = useParams();
  const pathname = usePathname();

  const id = params?.id;
  const isNotEdit = !pathname.includes('/edit');

  // Partnership detail
  const {
    data: partnershipDetail,
    isError: isErrorPartnership,
    error: errorPartnership,
    isFetching: isFetchingPartnership,
  } = useQuery<GetPartnershipDetailResponse, AxiosError<ErrorResponse>>({
    queryKey: ['partnership-detail', id, language],
    queryFn: () => getPartnershipDetail(Number(id)),
    enabled: Boolean(id),
    placeholderData: keepPreviousData,
  });

  const partnershipConsumerId = partnershipDetail?.data?.consumerId;
  const providerId = partnershipDetail?.data?.providerId;

  const {
    data: classificationPartnership,
    isFetching: isFetchingClassificationPartnership,
  } = useQuery<GetClassificationPartnershipResponse, AxiosError<ErrorResponse>>(
    {
      queryKey: ['classification-partnership', id, language],
      queryFn: () => {
        const params = {
          page: 1,
          limit: 20,
          providerId: providerId,
        };
        return getClassificationPartnership(params);
      },
      enabled: Boolean(providerId),
      placeholderData: keepPreviousData,
    }
  );

  // Partnership Vehicle
  const {
    data: partnershipVehicleData,
    isError: isErrorVehicle,
    error: errorVehicle,
    isFetching: isFetchingVehicle,
  } = useQuery({
    queryKey: ['getVehicle', partnershipConsumerId, language],
    queryFn: () =>
      getPartnershipVehicle({
        page: 1,
        limit: 100,
      }),
    enabled: Boolean(partnershipConsumerId && isNotEdit),
    placeholderData: keepPreviousData,
  });

  // Partnership Operator
  const {
    data: partnershipOperatorData,
    isError: isErrorOperatorList,
    error: errorOperatorList,
    isFetching: isFetchingOperatorList,
  } = useQuery({
    queryKey: ['getPartnershipOperator', partnershipConsumerId, language],
    queryFn: () =>
      getPartnershipOperator({
        search: String(partnershipConsumerId),
        page: 1,
        limit: 100,
        providerId: providerId,
      }),
    enabled: Boolean(partnershipConsumerId && isNotEdit),
    placeholderData: keepPreviousData,
  });

  useEffect(() => {
    if (isErrorPartnership) {
      toast.danger({ description: errorPartnership?.message });
    }
    if (isErrorVehicle) {
      toast.danger({ description: errorVehicle?.message });
    }
    if (isErrorOperatorList) {
      toast.danger({ description: errorOperatorList?.message });
    }
  }, [
    isErrorPartnership,
    errorPartnership?.message,
    isErrorVehicle,
    errorVehicle?.message,
    isErrorOperatorList,
    errorOperatorList?.message,
  ]);

  return {
    partnershipDetail: partnershipDetail?.data,
    classificationPartnership: classificationPartnership?.data?.data ?? [],
    partnershipVehicleData: partnershipVehicleData?.data?.data ?? [],
    partnershipOperatorData: partnershipOperatorData?.data?.data ?? [],
    isLoading:
      isFetchingPartnership ||
      isFetchingVehicle ||
      isFetchingOperatorList ||
      isFetchingClassificationPartnership,
    isError: isErrorPartnership || isErrorVehicle,
    error: errorPartnership || errorVehicle,
  };
};
