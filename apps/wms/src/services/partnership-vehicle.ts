import { TCommonFilter } from '@/types/common';

import {
  CreatePartnershipVehicleInput,
  GetPartnershipVehicleDetailResponse,
  GetPartnershipVehicleMapResponse,
  GetPartnershipVehicleResponse,
  UpdatePartnershipVehicleInput,
} from '@/types/partnership-vehicle';
import { handleAxiosResponse } from '@/utils/api';
import axios from 'src/lib/axios';

export type GetPartnershipVehicleParams = TCommonFilter & {
  search?: string;
};

export async function getPartnershipVehicleMap(
  params: GetPartnershipVehicleParams
): Promise<GetPartnershipVehicleMapResponse> {
  const response = await axios.get('/partnership-vehicle-map', {
    params,
  });

  return handleAxiosResponse<GetPartnershipVehicleMapResponse>(response);
}

export async function getPartnershipVehicle(
  params: GetPartnershipVehicleParams
): Promise<GetPartnershipVehicleResponse> {
  const response = await axios.get('/partner-vehicle', {
    params,
  });

  return handleAxiosResponse<GetPartnershipVehicleResponse>(response);
}

export async function getPartnershipVehicleDetail(
  id: number
): Promise<GetPartnershipVehicleDetailResponse> {
  const response = await axios.get(`/partner-vehicle/${id}`, {
    cleanParams: true,
  });

  return response?.data;
}
export async function createPartnershipVehicle(
  data: CreatePartnershipVehicleInput
) {
  const response = await axios.post('/partner-vehicle', data);

  return response?.data;
}

export async function updatePartnershipVehicle(
  id: number,
  body: UpdatePartnershipVehicleInput
) {
  const data = { ...body };
  const response = await axios.put(`/partner-vehicle/${id}`, data);

  return response?.data;
}

export async function deletePartnershipVehicle(id: number) {
  const response = await axios.delete(`partner-vehicle/${id}`, {
    cleanParams: true,
  });

  return response?.data;
}
