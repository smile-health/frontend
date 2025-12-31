import { numberFormatter } from '#utils/formatter'
import { TFunction } from 'i18next'
import * as yup from 'yup'

export function receiveItemSchema(
  t: TFunction<['common', 'orderDetail']>,
  language: string
) {
  return yup.object({
    id: yup.number().optional(),
    receives: yup.array().of(
      yup.object({
        received_qty: yup
          .number()
          .required(t('common:validation.required'))
          .test({
            name: 'must-equal-to-shipped-qty',
            test: function (value) {
              const formValues = this?.from?.[0].value
              const shippedQty =
                formValues?._order_item_stock?.allocated_qty ?? 0

              return value === shippedQty
                ? true
                : this.createError({
                    message: t(
                      'orderDetail:form.receive_qty.validation.equal',
                      {
                        value: numberFormatter(shippedQty, language),
                      }
                    ),
                  })
            },
          }),
        _order_item_stock: yup.object().shape({
          allocated_qty: yup.number().optional(),
        }),
      })
    ),
  })
}

export function receiveSchema(
  t: TFunction<['common', 'orderDetail']>,
  language: string
) {
  return yup.object({
    order_items: yup
      .array()
      .of(receiveItemSchema(t, language))
      .required(t('common:validation.required')),
    fulfilled_at: yup.string().required(t('common:validation.required')),
  })
}
