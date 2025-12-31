import { yupResolver } from '@hookform/resolvers/yup'
import { useMutation } from '@tanstack/react-query'
import { toast } from '#components/toast'
import useSmileRouter from '#hooks/useSmileRouter'
import { ErrorResponse } from '#types/common'
import { getProgramStorage } from '#utils/storage/program'
import { getUserStorage } from '#utils/storage/user'
import { AxiosError } from 'axios'
import { SubmitHandler, useFieldArray, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

import { MaterialCompanions } from '../../order.type'
import { handleBodyRequest } from '../order-create-distribution.helper'
import {
  createOrderDistribution,
  CreateOrderDistributionBody,
} from '../order-create-distribution.service'
import {
  TFormatBatch,
  TOrderFormValues,
} from '../order-create-distribution.type'
import orderCreateDistributionSchema from '../schemas/orderCreateDistributionSchema'

type Params = {
  onShowConfirmation: VoidFunction
  onShowModalCompanion: (show: boolean) => void
}

export default function useOrderCreateDistribution({
  onShowConfirmation,
  onShowModalCompanion,
}: Params) {
  const user = getUserStorage()
  const userProgram = getProgramStorage()
  const router = useSmileRouter()

  const { t: tCommon } = useTranslation()
  const { t } = useTranslation('orderDistribution')

  const methods = useForm<TOrderFormValues>({
    resolver: yupResolver(orderCreateDistributionSchema(t)),
    mode: 'onChange',
    defaultValues: {
      vendor: {
        label: user?.entity?.name,
        value: userProgram?.entity_id,
      },
      required_date: null,
      order_items: [],
    },
  })

  const order_items = methods.watch('order_items')

  const list = order_items?.flatMap(
    (item) => item?.material?.companions
  ) as MaterialCompanions[]

  const companionList = Array.from(
    new Map(list?.map((item) => [item?.id, item])).values()
  )

  const { append, remove } = useFieldArray({
    control: methods.control,
    name: 'order_items',
  })

  const onCheckIsValid = async () => {
    const isValid = await methods.trigger()
    if (isValid && companionList?.length) onShowModalCompanion(true)
    else if (isValid) onShowConfirmation()
  }

  const onSubmit: SubmitHandler<TOrderFormValues> = (formData) => {
    const body = handleBodyRequest(formData)

    mutations.mutate(body)
  }

  const onSetOrderItems = (index: number, batch: TFormatBatch[]) => {
    methods.setValue(`order_items.${index}.batch`, batch, {
      shouldValidate: true,
    })

    methods.clearErrors(`order_items.${index}`)
  }

  const mutations = useMutation({
    mutationFn: (data: CreateOrderDistributionBody) =>
      createOrderDistribution(data),
    onSuccess: (data) => {
      toast.success({
        description: tCommon('message.success.create', {
          type: t('info.message.new_distribution')?.toLowerCase(),
        }),
      })
      router.push(`/v5/order/${data?.id}`)
    },
    onError: (error) => {
      if (error instanceof AxiosError) {
        const response = error.response?.data as ErrorResponse
        toast.danger({ description: response.message })
      }
    },
  })

  return {
    methods,
    append,
    remove,
    onSubmit,
    companionList,
    onCheckIsValid,
    onSetOrderItems,
    isPendingMutateOrder: mutations.isPending,
  }
}
