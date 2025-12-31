import cx from '#lib/cx'

export type MetricIndicatorProps = {
  value?: number | string
  threshold?: {
    single_value?: number
    min_value?: number
    max_value?: number
  }
  unit?: string
  type?: 'temperature' | 'connection'
  icon?: React.ReactNode
}

export const MetricIndicator: React.FC<MetricIndicatorProps> = ({
  value,
  threshold,
  unit = '°C',
  type = 'temperature',
  icon,
}) => {
  if (value === null || value === undefined) return null

  // Handle connection type
  if (type === 'connection') {
    let color = Number(value) <= 20 ? 'ui-text-red-500' : 'ui-text-green-500'
    if (value === 'N/A') color = 'ui-text-gray-500'

    const displayUnit = value !== 'N/A' ? (unit ?? '') : ''
    return (
      <div
        className={cx(
          'ui-text-sm ui-font-bold ui-flex ui-items-center ui-gap-1',
          color
        )}
      >
        {icon}
        {value}
        {displayUnit}
      </div>
    )
  }

  // Handle temperature type
  if (threshold?.single_value) {
    const color =
      Number(value) > Number(threshold?.single_value)
        ? 'ui-text-red-500'
        : 'ui-text-green-500'
    return (
      <div
        className={cx(
          'ui-text-sm ui-font-bold ui-flex ui-items-center ui-gap-1',
          color
        )}
      >
        {icon}
        {value}
        {unit ?? ''}
      </div>
    )
  }

  if (
    Boolean(threshold?.min_value) &&
    Boolean(threshold?.max_value) &&
    !threshold?.single_value
  ) {
    let color: string

    if (Number(value) < Number(threshold?.min_value)) {
      color = 'ui-text-blue-400'
    } else if (Number(value) > Number(threshold?.max_value)) {
      color = 'ui-text-red-500'
    } else {
      color = 'ui-text-green-500'
    }

    return (
      <div
        className={cx(
          'ui-text-sm ui-font-bold ui-flex ui-items-center ui-gap-1',
          color
        )}
      >
        {icon}
        {value}
        {unit ?? ''}
      </div>
    )
  }

  return (
    <div className="ui-text-sm ui-font-bold ui-flex ui-items-center ui-gap-1">
      {icon}
      {value}
      {unit ?? ''}
    </div>
  )
}
