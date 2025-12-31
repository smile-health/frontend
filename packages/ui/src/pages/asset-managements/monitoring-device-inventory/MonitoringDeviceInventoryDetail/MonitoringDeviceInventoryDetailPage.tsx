import { useFeatureIsOn } from '@growthbook/growthbook-react'
import Meta from '#components/layouts/Meta'
import Container from '#components/layouts/PageContainer'
import useSmileRouter from '#hooks/useSmileRouter'
import Error403Page from '#pages/error/Error403Page'
import { generateMetaTitle } from '#utils/strings'
import { useTranslation } from 'react-i18next'

import { AssetInfoHeader } from './components/AssetInfoHeader'
import { BudgetSection } from './components/BudgetSection'
import { DeviceDetailInfo } from './components/DeviceDetailInfo'
import { EntitySection } from './components/EntitySection'
import { MonitoringDeviceInventoryDetailBox } from './components/MonitoringDeviceInventoryDetailBox'
import {
  MonitoringDeviceInventoryDetailConsumer,
  MonitoringDeviceInventoryDetailProvider,
} from './MonitoringDeviceInventoryDetailContext'
import { RelationTable } from './use-cases/display-relation-table/RelationTable'

type MonitoringDeviceInventoryDetailPageProps = Readonly<{
  isGlobal?: boolean
}>

export default function MonitoringDeviceInventoryDetailPage({
  isGlobal = false,
}: MonitoringDeviceInventoryDetailPageProps) {
  const isFeatureEnabled = useFeatureIsOn('monitoring_device_inventory')
  const { t } = useTranslation(['common', 'monitoringDeviceInventoryDetail'])
  const router = useSmileRouter()

  if (!isFeatureEnabled) return <Error403Page />

  return (
    <MonitoringDeviceInventoryDetailProvider isGlobal={isGlobal}>
      <MonitoringDeviceInventoryDetailConsumer>
        {() => {
          const pageTitle = t('monitoringDeviceInventoryDetail:page.title')

          return (
            <>
              <Meta title={generateMetaTitle(pageTitle)} />
              <Container
                title={pageTitle}
                withLayout
                backButton={{
                  label: t('common:back_to_list'),
                  show: true,
                  onClick: () =>
                    router.pushGlobal(
                      '/v5/global-asset/management/monitoring-device-inventory'
                    ),
                }}
              >
                <div className="ui-space-y-6">
                  <MonitoringDeviceInventoryDetailBox
                    className="space-y-6"
                    showMoreDetails
                    moreDetailsContent={
                      <div className="ui-space-y-4">
                        <EntitySection />
                        <BudgetSection />
                      </div>
                    }
                  >
                    <AssetInfoHeader />
                    <DeviceDetailInfo />
                  </MonitoringDeviceInventoryDetailBox>

                  <RelationTable />
                </div>
              </Container>
            </>
          )
        }}
      </MonitoringDeviceInventoryDetailConsumer>
    </MonitoringDeviceInventoryDetailProvider>
  )
}
