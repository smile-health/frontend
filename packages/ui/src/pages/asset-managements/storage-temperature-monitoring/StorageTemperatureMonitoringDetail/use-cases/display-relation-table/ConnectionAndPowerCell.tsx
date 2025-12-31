import { Battery50Icon, BoltIcon, WifiIcon } from '@heroicons/react/24/outline'
import cx from '#lib/cx'
import { MetricIndicator } from '#pages/asset-managements/components/MetricIndicator'
import { useTranslation } from 'react-i18next'

type ConnectionAndPowerCellProps = {
  log: {
    device_status?: number | null
    battery?: number | null
    signal?: number | null
    is_power_connected?: number | null
  } | null
  isWarehouse?: boolean
}

export const ConnectionAndPowerCell: React.FC<ConnectionAndPowerCellProps> = ({
  log,
  isWarehouse,
}) => {
  const { t } = useTranslation(['storageTemperatureMonitoringDetail'])
  if (!log) {
    return '-'
  }

  const deviceStatus = log.device_status
    ? {
        label: t(
          'storageTemperatureMonitoringDetail:relation_table.columns.connection_and_power.connection_status.online'
        ),
        color: 'ui-text-green-500',
      }
    : {
        label: t(
          'storageTemperatureMonitoringDetail:relation_table.columns.connection_and_power.connection_status.offline'
        ),
        color: 'ui-text-red-500',
      }

  const powerStatus = log.is_power_connected
    ? {
        label: t(
          'storageTemperatureMonitoringDetail:relation_table.columns.connection_and_power.power_status.connected'
        ),
        color: 'ui-text-green-500',
      }
    : {
        label: t(
          'storageTemperatureMonitoringDetail:relation_table.columns.connection_and_power.power_status.disconnected'
        ),
        color: 'ui-text-red-500',
      }

  return (
    <div className="ui-flex ui-flex-col ui-font-bold">
      <div className={cx('ui-text-sm', deviceStatus.color)}>
        {deviceStatus.label}
      </div>

      {!isWarehouse && (
        <>
          <MetricIndicator
            type="connection"
            icon={<Battery50Icon className="ui-w-4 ui-h-4" />}
            value={log.battery === null ? 'N/A' : log.battery}
            unit="%"
          />

          <MetricIndicator
            type="connection"
            icon={<WifiIcon className="ui-w-4 ui-h-4" />}
            value={log.signal === null ? 'N/A' : log.signal}
            unit="%"
          />
        </>
      )}

      <div
        className={cx(
          'ui-text-sm ui-flex ui-items-center ui-gap-1',
          powerStatus.color
        )}
      >
        <BoltIcon className="ui-w-4 ui-h-4" />
        {powerStatus.label}
      </div>
    </div>
  )
}
