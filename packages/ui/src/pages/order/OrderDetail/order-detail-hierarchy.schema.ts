import { OptionType } from '#components/react-select'
import { Stock } from '#types/stock'
import { numberFormatter } from '#utils/formatter'
import { TFunction } from 'i18next'
import * as yup from 'yup'

import {
  orderDetailItemAddFormSchema,
  orderDetailItemEditFormSchema,
} from './order-detail.schema'
import {
  OrderDetailItem,
  OrderDetailItemMaterial,
  OrderDetailMappedOrderItem,
} from './order-detail.type'

const receiveSchema = (
  t: TFunction<['common', 'orderDetail']>,
  language: string,
  orderItemMaterial?: OrderDetailItemMaterial
) => {
  return yup.object({
    stock_id: yup.number().required(),
    received_qty: yup
      .number()
      .transform((value, originalValue) =>
        originalValue === '' ? null : value
      )
      .nullable()
      .test({
        name: 'cannot_be_higher_than_shipped_qty',
        test: function (value) {
          const { from, path } = this
          const receivesMatch = path.match(/receives\[(\d+)\]/)
          const currentIndex = receivesMatch ? parseInt(receivesMatch[1]) : 0
          const shippedQty =
            from?.[1]?.value?.receives?.[currentIndex]?._order_stock
              ?.shipped_qty

          if (!value || !shippedQty) return true

          return Number(value) === Number(shippedQty)
            ? true
            : this.createError({
                message: t('orderDetail:form.receive_qty.validation.equal', {
                  value: numberFormatter(shippedQty, language),
                }),
              })
        },
      })
      .test({
        name: 'must_multiply_of_multiplier',
        test: function () {
          const { received_qty } = this.parent

          const multiplier =
            orderItemMaterial?.consumption_unit_per_distribution_unit
          if (!received_qty || !multiplier) return true

          return Number(received_qty) % Number(multiplier) === 0
            ? true
            : this.createError({
                message: t(
                  'orderDetail:form.received_qty.validation.multiply',
                  {
                    value: numberFormatter(multiplier, language),
                  }
                ),
              })
        },
      })
      .typeError(t('common:validation.required'))
      .required(t('common:validation.required')),
  })
}

export const updateOrderStatusToPendingFromDraftFormSchema = (
  t: TFunction<['common', 'orderDetail']>,
  languange: string
) => {
  return yup.object({
    letter_number: yup.string().required(t('common:validation.required')),
  })
}

export const receiveChildSchema = (
  t: TFunction<['common', 'orderDetail']>,
  language: string,
  orderItemMaterial?: OrderDetailItemMaterial
) =>
  yup.object({
    id: yup.number().required(),
    receives: yup
      .array()
      .of(receiveSchema(t, language, orderItemMaterial))
      .required(),
  })

export const orderItemSchema = (
  t: TFunction<['common', 'orderDetail']>,
  language: string,
  activeBatchIndex?: number,
  orderItemMaterial?: OrderDetailItemMaterial
) =>
  yup.object({
    id: yup.number().required(),
    children: yup
      .array()
      .of(receiveChildSchema(t, language, orderItemMaterial))
      .required(),
  })

export const orderDetailReceivedHierarchyFormSchema = (
  t: TFunction<['common', 'orderDetail']>,
  language: string,
  activeBatchIndex?: number
) =>
  yup.object({
    order_items: yup
      .array()
      .of(orderItemSchema(t, language, activeBatchIndex))
      .required(),
    fulfilled_at: yup
      .string()
      .required(t('orderDetail:form.received_date.validation.required')),
  })

export const orderDetailHierarchyChildrenFormSchema = (
  t: TFunction<['common', 'orderDetail']>,
  language: string,
  data?: Stock | OrderDetailItem
) => {
  return yup.object({
    children: yup
      .array()
      .of(
        yup.object({
          ordered_qty: yup
            .mixed()
            .nullable()
            .test({
              name: 'must_multiply_of_multiplier',
              test: function () {
                const { ordered_qty } = this.parent

                const multiplier =
                  data?.material?.consumption_unit_per_distribution_unit

                if (!ordered_qty || !multiplier) return true

                return Number(ordered_qty) % Number(multiplier) === 0
                  ? true
                  : this.createError({
                      message: t(
                        'orderDetail:form.ordered_qty.validation.multiply',
                        {
                          value: numberFormatter(multiplier, language),
                        }
                      ),
                    })
              },
            }),
        })
      )
      .test(
        'at-least-one-filled',
        t('common:validation.required'),
        (_, context) => validateBatchItems(t, context, 'ordered_qty')
      ),
  })
}

export function validateBatchItems(
  t: TFunction<['common', 'orderDetail']>,
  context: yup.TestContext,
  type: string
) {
  const errors: yup.ValidationError[] = []

  const batch: any[] = context?.originalValue?.filter((val: any) => val?.[type])
  if (!batch?.length) return false

  batch.forEach((item: any, index) => {
    if (!item?.[type]) {
      errors.push(
        new yup.ValidationError(
          t('common:validation.required'),
          item?.[type],
          `${context?.path}.[${index}].${type}`
        )
      )
    }
  })
  return errors?.length > 0 ? new yup.ValidationError(errors) : true
}

export function validateOrderStockStatusId(
  t: TFunction<['common', 'orderDetail']>,
  context: yup.TestContext
) {
  const errors: yup.ValidationError[] = []
  const children: any[] = context?.originalValue || []

  const hasAtLeastOneFilled = children.some(
    (child: any) => child?.order_stock_status_id
  )

  if (!hasAtLeastOneFilled) {
    children.forEach((item: any, index) => {
      if (
        !item?.order_stock_status_id &&
        item?._child_detail?.material?.is_temperature_sensitive &&
        !children?.some((child: any) => child?.allocated_qty)
      ) {
        errors.push(
          new yup.ValidationError(
            t('common:validation.required'),
            item?.order_stock_status_id,
            `${context?.path}.[${index}].order_stock_status_id`
          )
        )
      }
    })
  }

  return errors?.length > 0 ? new yup.ValidationError(errors) : true
}

export const orderDetailHierarchyChildrenConfirmOrderSchema = (
  t: TFunction<['common', 'orderDetail']>,
  language: string,
  data?: Stock | OrderDetailItem
) => {
  return yup.object({
    order_items: yup.array().of(
      yup.object({
        id: yup.number().required(),
        confirmed_qty: yup
          .number()
          .typeError(t('orderDetail:form.confirmed_qty.validation.required'))
          .required(t('orderDetail:form.confirmed_qty.validation.required')),
        children: yup.array().of(
          yup.object({
            ordered_qty: yup
              .number()
              .typeError(t('orderDetail:form.ordered_qty.validation.required'))
              .notRequired()
              .test({
                name: 'must_multiply_of_multiplier',
                test: function (value) {
                  const multiplier =
                    data?.material?.consumption_unit_per_distribution_unit

                  if (!value || !multiplier) return true

                  return Number(value) % Number(multiplier) === 0
                    ? true
                    : this.createError({
                        message: t(
                          'orderDetail:form.ordered_qty.validation.multiply',
                          {
                            value: numberFormatter(multiplier, language),
                          }
                        ),
                      })
                },
              }),
          })
        ),
      })
    ),
  })
}

export const orderDetailAddHierarchyFormSchema = (
  t: TFunction<['common', 'orderDetail']>,
  language: string,
  stockData?: Stock
) => {
  return orderDetailItemAddFormSchema(t, language).concat(
    orderDetailHierarchyChildrenFormSchema(t, language, stockData)
  )
}

export const orderDetailEditHierarchyFormSchema = (
  t: TFunction<['common', 'orderDetail']>,
  language: string,
  orderItemData?: OrderDetailItem
) => {
  return orderDetailItemEditFormSchema(t, language).concat(
    orderDetailHierarchyChildrenFormSchema(t, language, orderItemData)
  )
}

export const orderDetailAllocateMaterial93FormSchema = (
  t: TFunction<['common', 'orderDetail']>
) => {
  return yup.array().of(
    yup.object({
      id: yup.number(),
      order_stock_status_id: yup.object().shape({
        label: yup.string(),
        value: yup.mixed(),
      }),
      allocations: yup
        .array()
        .of(
          yup.object({
            stock_id: yup.number(),
            allocated_qty: yup.number(),
          })
        )
        .test(
          'at-least-one-filled',
          t('orderDetail:table.trademark.validation.min_qty'),
          (_, context) => validateBatchItems(t, context, 'allocated_qty')
        ),
    })
  )
}

export const orderDetailAllocateHierarchyFormSchema = (
  t: TFunction<['common', 'orderDetail']>,
  language: string,
  orderItemData?: OrderDetailMappedOrderItem
) => {
  return yup.object({
    order_items: yup.array().of(
      yup.object({
        id: yup.number().required(),
        confirmed_qty: yup
          .number()
          .typeError(t('orderDetail:form.confirmed_qty.validation.required'))
          .required(t('orderDetail:form.confirmed_qty.validation.required')),
        children: orderDetailAllocateMaterial93FormSchema(t),
      })
    ),
  })
}

export const allocationsFormSchema = (
  t: TFunction<['common', 'orderDetail']>,
  language: string
) => {
  return yup.array().of(
    yup.object({
      allocated_qty: yup.number().test({
        name: 'cannot_be_higher_than_vendor_stock',
        test: function (value) {
          const { from, path } = this
          const allocationsMatch = path.match(/allocations\[(\d+)\]/)
          const currentIndex = allocationsMatch
            ? parseInt(allocationsMatch[1])
            : 0
          const vendorQty =
            from?.[1]?.value?.allocations?.[currentIndex]?._stock_detail
              ?.available_qty

          if (!value || !vendorQty) return true

          return Number(value) <= Number(vendorQty)
            ? true
            : this.createError({
                message: t(
                  'orderDetail:form.allocated_qty.validation.less_than',
                  {
                    value: numberFormatter(vendorQty, language),
                  }
                ),
              })
        },
      }),
    })
  )
}

export const orderDetailAllocateModalHierarchyFormSchema = (
  t: TFunction<['common', 'orderDetail']>,
  language: string
) => {
  return yup.object({
    id: yup.number().nullable(),
    confirmed_qty: yup.number().notRequired(),
    children: yup
      .array()
      .of(
        yup.object({
          id: yup.number().nullable(),
          order_stock_status_id: yup
            .object({
              label: yup.string(),
              value: yup.mixed(),
            })
            .nullable()
            .test({
              name: 'required',
              message: t('common:validation.required'),
              test: function (value, context) {
                const isTemperatureSensitive =
                  context?.parent?._child_of_detail_stock?.material
                    ?.is_temperature_sensitive

                if (!isTemperatureSensitive) return true

                return value && isTemperatureSensitive
              },
            }),
          allocations: allocationsFormSchema(t, language),
        })
      )
      .test(
        'at-least-one-filled',
        t('common:validation.required'),
        (_, context) => validateOrderStockStatusId(t, context)
      ),
  })
}

export const orderDetailAllocateDrawerHierarchyFormSchema = (
  t: TFunction<['common', 'orderDetail']>,
  language: string,
  childrenData?: any
) => {
  return yup.object({
    order_items: yup
      .array()
      .of(orderDetailAllocateModalHierarchyFormSchema(t, language)),
  })
}

export const orderDetailAllocateBatchModalHierarchyFormSchema = (
  t: TFunction<['common', 'orderDetail']>,
  language: string
) => {
  return yup.object({
    allocations: allocationsFormSchema(t, language),
  })
}
