import axios from '#lib/axios'
import { handleAxiosResponse } from '#utils/api'

import { processPayload } from '../form/libs/program-plan-form.common'
import { ProgramPlanSubmitForm } from '../form/libs/program-plan-form.type'
import { processParams } from '../list/libs/program-plan-list.common'
import {
  ListProgramPlanParams,
  ListProgramPlanResponse,
  TProgramPlanData,
} from '../list/libs/program-plan-list.type'

export const listProgramPlan = async (params: ListProgramPlanParams) => {
  const processedParams = processParams({ params, isExport: false })
  const fetchProgramPlanList = await axios.get(
    '/main/annual-planning/program-plans',
    {
      params: processedParams,
      cleanParams: true,
    }
  )

  const resultData =
    fetchProgramPlanList?.data?.data?.map(
      (item: TProgramPlanData, index: number) => ({
        ...item,
        si_no: index + 1 + ((params?.page ?? 1) - 1) * (params?.paginate ?? 10),
      })
    ) ?? []

  const result = {
    ...fetchProgramPlanList,
    data: {
      ...fetchProgramPlanList?.data,
      data: resultData,
    },
  }

  return handleAxiosResponse<ListProgramPlanResponse>(result)
}

export const detailProgramPlan = async (
  id: number
): Promise<TProgramPlanData> => {
  const fetchProgramPlanDetail = await axios.get(
    `/main/annual-planning/program-plans/${id}`
  )

  const resultData = fetchProgramPlanDetail?.data

  return resultData
}

export const loadProgramPlan = async (
  keyword: string,
  _: unknown,
  additional: {
    page: number
    lang?: string
  }
) => {
  const params = {
    keyword,
    page: additional.page,
    paginate: 10,
  }

  const result = await listProgramPlan(params)

  if (result?.statusCode === 204) {
    return {
      options: [],
      hasMore: false,
    }
  }

  return {
    options: result?.data ?? [],
    hasMore: result?.data?.length > 0,
  }
}

export const markFinalProgramPlan = async (id: number) => {
  const response = await axios.put(`/main/annual-planning/program-plans/${id}`)
  return handleAxiosResponse<TProgramPlanData>(response)
}

export const createProgramPlan = async (rawData: ProgramPlanSubmitForm) => {
  const data = processPayload(rawData)
  const response = await axios.post(
    '/main/annual-planning/program-plans',
    data,
    {
      cleanBody: true,
    }
  )
  return response?.data as TProgramPlanData
}
