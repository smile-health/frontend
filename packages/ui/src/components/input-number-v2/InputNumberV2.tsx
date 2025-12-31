'use client'

import { MAX_LIMIT_DIGIT_NUMBER } from '#constants/common'
import { useTranslation } from 'react-i18next'
import { NumberFormatBase, NumericFormatProps } from 'react-number-format'

import { Input, InputProps } from '../input/Input'

type InputNumberV2Props = NumericFormatProps &
  InputProps & {
    isPriceTag?: boolean
    isPlainFormat?: boolean
    currencyDisplay?: 'code' | 'symbol' | 'name' | 'narrowSymbol'
    limit?: number
  }

export const InputNumberV2 = ({
  isPriceTag,
  isPlainFormat = false,
  currencyDisplay = 'code',
  limit = MAX_LIMIT_DIGIT_NUMBER,
  ...props
}: InputNumberV2Props) => {
  const { i18n } = useTranslation()

  const format = (numStr: number | string) => {
    if (numStr === '') return ''
    return new Intl.NumberFormat(i18n.language, {
      style: isPriceTag ? 'currency' : 'decimal',
      currency: process.env.CURRENCY ?? 'IDR',
      currencyDisplay,
      maximumFractionDigits: 0,
    }).format(numStr as number)
  }

  return (
    <NumberFormatBase
      {...props}
      customInput={Input}
      format={isPlainFormat ? undefined : format}
      isAllowed={(values) => values.value.length <= limit}
    />
  )
}
