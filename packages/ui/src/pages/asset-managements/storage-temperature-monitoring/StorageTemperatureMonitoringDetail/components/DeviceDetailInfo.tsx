import React, { ReactNode, useCallback, useMemo } from 'react'
import { RenderDetailValue } from '#components/modules/RenderDetailValue'
import { AssetManagementsOperationalStatusBadge } from '#pages/asset-managements/components/AssetManagementsOperationalStatusBadge'
import { TemperatureThreshold } from '#services/asset-type'
import { parseDateTime } from '#utils/date'
import { useTranslation } from 'react-i18next'
import { formatPhoneNumber } from 'react-phone-number-input'

import { useStorageTemperatureMonitoringDetail } from '../StorageTemperatureMonitoringDetailContext'
import ThresholdTable from '../use-cases/update-threshold/ThresholdTable'

export const DeviceDetailInfo = () => {
  const {
    t,
    i18n: { language },
  } = useTranslation(['storageTemperatureMonitoringDetail', 'assetManagements'])
  const {
    data,
    isLoading,
    onUpdateActiveThreshold,
    isUpdatingActiveThreshold,
  } = useStorageTemperatureMonitoringDetail()

  const handleContactPerson = useMemo(
    () =>
      data?.contact_persons?.map((item: any, index: number) => ({
        label: t('storageTemperatureMonitoringDetail:data.contact_person', {
          number: index + 1 === 1 ? '' : index + 1,
        }),
        value: `${item?.name ?? '-'} (${formatPhoneNumber(item?.phone) ?? '-'})`,
      })) ?? undefined,
    [data?.contact_persons, language]
  )

  const handleDetailOtherValue = useCallback(
    (
      primaryValue?: string | number | ReactNode | null,
      otherValue?: string | number | ReactNode | null,
      otherLabel?: string,
      otherInformation?: string | ReactNode
    ) => {
      if (primaryValue) {
        return primaryValue
      }
      if (otherValue) {
        return (
          <p>
            {otherValue}{' '}
            <span className="ui-text-gray-500">
              {t('assetManagements:columns.other_option', {
                option: otherLabel,
              })}
            </span>{' '}
            {otherInformation}
          </p>
        )
      }
      return '-'
    },
    [t, data]
  )

  const renderThreshold = useMemo(() => {
    const thresholds = data?.asset_type?.temperature_thresholds ?? []
    const singleThresholdValue = (min: number, max: number) => (
      <span className="ui-font-bold ui-text-dark-teal">
        (Min: {min}) - (Max: {max})
      </span>
    )
    const otherInformation = (
      <span className="ui-text-sm ui-text-[#787878]">
        {parseDateTime(data?.updated_at, 'YYYY/MM/DD HH:mm')}
      </span>
    )

    if (thresholds.length === 0) {
      const hasOther =
        data?.other_min_temperature || data?.other_max_temperature
      if (!hasOther) return '-'
      return handleDetailOtherValue(
        thresholds.length,
        singleThresholdValue(
          data?.other_min_temperature ?? 0,
          data?.other_max_temperature ?? 0
        ),
        t(
          'storageTemperatureMonitoringDetail:data.temperature_threshold.label'
        ),
        otherInformation
      )
    }

    if (thresholds.length === 1) {
      const th = thresholds[0]
      return (
        <div>
          {singleThresholdValue(th?.min_temperature, th?.max_temperature)}{' '}
          {otherInformation}
        </div>
      )
    }

    return (
      <div>
        <ThresholdTable
          tableHead={[
            t(
              'storageTemperatureMonitoringDetail:data.temperature_threshold.minimum'
            ),
            t(
              'storageTemperatureMonitoringDetail:data.temperature_threshold.maximum'
            ),
          ]}
          buttonLabels={[
            t(
              'storageTemperatureMonitoringDetail:data.temperature_threshold.button.change_threshold'
            ),
            t(
              'storageTemperatureMonitoringDetail:data.temperature_threshold.button.cancel'
            ),
            t(
              'storageTemperatureMonitoringDetail:data.temperature_threshold.button.save'
            ),
          ]}
          type="temperature_threshold"
          data={thresholds as TemperatureThreshold[]}
          onUpdateActiveThreshold={onUpdateActiveThreshold}
          isUpdatingActiveThreshold={isUpdatingActiveThreshold}
          otherInformation={otherInformation}
        />
      </div>
    )
  }, [data?.asset_type?.temperature_thresholds?.length])

  return (
    <div className="ui-border-b ui-border-gray-300 ui-pb-4">
      <RenderDetailValue
        data={[
          {
            label: t('storageTemperatureMonitoringDetail:data.asset_type'),
            value: handleDetailOtherValue(
              data?.asset_type?.name,
              data?.other_asset_type_name,
              t('storageTemperatureMonitoringDetail:data.asset_type')
            ),
          },
          {
            label: t(
              'storageTemperatureMonitoringDetail:data.temperature_threshold.label'
            ),
            value: renderThreshold,
          },
          ...(handleContactPerson ?? []),
          {
            label: t('storageTemperatureMonitoringDetail:data.production_year'),
            value: data?.production_year?.toString() ?? '-',
          },

          {
            label: t(
              'storageTemperatureMonitoringDetail:data.operational_status'
            ),
            value: data?.working_status?.id ? (
              <AssetManagementsOperationalStatusBadge
                working_status={data?.working_status}
              />
            ) : (
              '-'
            ),
          },
          {
            label: t('storageTemperatureMonitoringDetail:data.budget_source'),
            value: handleDetailOtherValue(
              data?.budget_source?.name,
              data?.other_budget_source_name,
              t('storageTemperatureMonitoringDetail:data.budget_source')
            ),
          },
          {
            label: t('storageTemperatureMonitoringDetail:data.budget_year'),
            value: data?.budget_year?.toString() ?? '-',
          },
        ]}
        loading={isLoading}
        skipEmptyValue={false}
      />
    </div>
  )
}
