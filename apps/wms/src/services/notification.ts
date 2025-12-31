import { TCommonFilter } from '@/types/common';
import {
  GetNotificationCountResponse,
  GetNotificationResponse,
} from '@/types/notification';
import { handleAxiosResponse } from '@/utils/api';
import axios from 'src/lib/axios';

export type GetNotificationParams = TCommonFilter;

export type GetNotificationCountParams = {
  forSuperAdmin?: boolean;
  forAdmin?: boolean;
  forOperator?: boolean;
};

export async function getNotification(
  params: GetNotificationParams
): Promise<GetNotificationResponse> {
  const response = await axios.get('/notification', {
    params,
  });

  return handleAxiosResponse<GetNotificationResponse>(response);
}

export async function requestReadById(id: number) {
  const response = await axios.patch(`/notification/${id}/read`);

  return response?.data;
}

export async function requestReadAllNotification() {
  const response = await axios.patch(`/notification/read`);

  return response?.data;
}

export async function getNotificationCount(
  params: GetNotificationCountParams
): Promise<GetNotificationCountResponse> {
  const response = await axios.get(`/notification/count`, {
    params,
  });

  return response?.data;
}
