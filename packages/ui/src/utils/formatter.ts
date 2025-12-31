export function getCurrencySymbol(locale: string) {
  return (0)
    .toLocaleString(locale, {
      style: 'currency',
      currency: process.env.CURRENCY,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    })
    .replace(/\d/g, '')
    .trim()
}

export function numberFormatter(
  value: number | undefined | null,
  locale: string,
  type?: 'normal' | 'decimal'
) {
  if (value === undefined) return '-'
  if (type === 'decimal') {
    return value
      ? new Intl.NumberFormat(locale, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        }).format(value)
      : '0'
  }
  return value ? new Intl.NumberFormat(locale).format(value) : '0'
}

export function formatNumberShort(value: number, language = 'en') {
  const isId = language === 'id'
  const abs = Math.abs(value)

  const trim = (n: number) =>
    Number.isInteger(n) ? String(n) : n.toFixed(2).replace(/\.?0+$/, '')

  if (abs >= 1_000_000) {
    const v = abs / 1_000_000
    return (value < 0 ? '-' : '') + trim(v) + (isId ? 'jt' : 'M')
  }

  if (abs >= 1_000) {
    const v = abs / 1_000
    return (value < 0 ? '-' : '') + trim(v) + (isId ? 'rb' : 'k')
  }

  return String(value)
}

export const getBackgroundStock = (stock: number, min: number, max: number) => {
  if (!stock) return 'ui-bg-red-50'
  if (stock < min) return 'ui-bg-warning-50'
  if (!min || !max || (min <= stock && stock <= max)) return 'ui-bg-green-50'
  if (stock > max) return 'ui-bg-blue-50'
  return 'ui-bg-white'
}

export const formatPhoneNumber = (phoneNumber?: string | null) => {
  if (!phoneNumber) return null
  const cleaned = ('' + phoneNumber).replace(/\D/g, '')
  const match = /^(\d{2})(\d{3})(\d{4})(\d{4})$/.exec(cleaned)
  if (match) {
    return `+${match[1]} ${match[2]} ${match[3]} ${match[4]}`
  }
  return phoneNumber
}
