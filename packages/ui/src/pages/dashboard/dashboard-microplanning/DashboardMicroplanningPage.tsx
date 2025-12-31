import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { Button } from '#components/button'
import { Dialog, DialogFooter, DialogHeader } from '#components/dialog'
import { useFilter, UseFilter } from '#components/filter'
import Meta from '#components/layouts/Meta'
import Container from '#components/layouts/PageContainer'

import { generateMetaTitle } from '#utils/strings'
import { useSetLoadingPopupStore } from '#hooks/useSetLoading'

import DashboardBox from '../components/DashboardBox'
import DashboardFilter from '../components/DashboardFilter'
import DashboardMicroplanningTabs from '../components/DashboardMicroplanningTabs'

import dashboardMicroplanningFilterSchema from './schemas/dashboardMicroplanningFilterSchema'
import useChartVaccineData from './hooks/useChartVaccineData'
import useGetTargetConsumptionVaccineDataTable from './hooks/useGetTargetConsumptionVaccineDataTable'
import useGetTotalTargetDataTable from './hooks/useGetTotalTargetDataTable'
import useExportMicroplanning from './hooks/useExportMicroplanning'

import {
  MicroplanningDashboardType,
  microplanningRegionTabs,
} from './dashboard-microplanning.constant'

export default function DashboardMicroplanningPage() {
  /* ================= translation ================= */
  const {
    t,
    i18n: { language },
  } = useTranslation('dashboardMicroplanning')
  const { t: tDashboard } = useTranslation('dashboard')

  /* ================= state ================= */
  const [openInformation, setOpenInformation] = useState(false)
  const [submitKey, setSubmitKey] = useState(0)
  const tabs = useStateRecord()

  /* ================= filter ================= */
  const filterSchema = useMemo<UseFilter>(
    () => dashboardMicroplanningFilterSchema(t, true),
    [t, language],
  )

  const filter = useFilter(filterSchema)

  /* ================= export ================= */
  const exportMicroplanningDashboard = useExportMicroplanning(
    filter.query,
    tabs.tab,
    submitKey,
  )

  /* ================= chart ================= */
  const chartData = {
    consumptionVaccine: useChartVaccineData(
      filter.query,
      tabs.tab,
      submitKey,
    ),
  }

  /* ================= table ================= */
  const vaccineTable = useGetTargetConsumptionVaccineDataTable(
    filter.query,
    tabs.tab,
    submitKey,
  )

  const totalTargetTable = useGetTotalTargetDataTable(
    filter.query,
    tabs.tab1,
    submitKey,
  )

  const tableData = {
    vaccine: buildTableData(vaccineTable),
    totalTarget: buildTableData(totalTargetTable),
  }

  /* ================= loading ================= */
  const isLoading =
    chartData.consumptionVaccine.isLoading ||
    vaccineTable.isLoading ||
    totalTargetTable.isLoading

  useSetLoadingPopupStore(isLoading)

  /* ================= render ================= */
  return (
    <Container title={t('title.page')} withLayout>
      <Meta title={generateMetaTitle(t('title.page'))} />

      <DashboardBox.Provider
        filter={filter.query}
        colorClass="ui-bg-gray-100"
        onDownloadAsCSV={() => { }}
      >
        {/* Information Dialog */}
        <Dialog
          open={openInformation}
          onOpenChange={setOpenInformation}
          className="ui-z-20"
          scrollBehavior="inside"
        >
          <DialogHeader className="ui-text-center">
            {t('title.page')}
          </DialogHeader>
          <DialogFooter className="ui-grid ui-grid-cols-1">
            <Button
              variant="outline"
              onClick={() => setOpenInformation(false)}
            >
              {tDashboard('close')}
            </Button>
          </DialogFooter>
        </Dialog>

        {/* Filter */}
        <DashboardFilter
          filter={filter}
          onExport={exportMicroplanningDashboard.onExport}
          onSubmit={() => setSubmitKey((prev) => prev + 1)}
        />

        {/* Target Consumption Vaccination */}
        <DashboardMicroplanningTabs<MicroplanningDashboardType>
          id="dashboard-target-consumption-vaccination"
          title={t('title.dashboard.target-consumption-vaccination')}
          subtitle={t(
            'subtitle.dashboard.target-consumption-vaccination',
          )}
          tabList={microplanningRegionTabs(t)}
          setTab={tabs.setTab}
          defaultActiveTab={MicroplanningDashboardType.Province}
          targetConsumptionVaccinationData={
            chartData.consumptionVaccine
          }
          dataTable={tableData.vaccine}
          appearance
          filter={filter.query}
        />

        {/* Total Target */}
        <DashboardMicroplanningTabs<MicroplanningDashboardType>
          id="dashboard-total-target"
          title={t('title.dashboard.total-target')}
          subtitle={t('subtitle.dashboard.total-target')}
          tabList={microplanningRegionTabs(t)}
          setTab={tabs.setTab1}
          defaultActiveTab={MicroplanningDashboardType.Province}
          dataTable={tableData.totalTarget}
          filter={filter.query}
        />
      </DashboardBox.Provider>
    </Container>
  )
}

/* ================= helpers ================= */

function useStateRecord() {
  const [tab, setTab] = useState(
    MicroplanningDashboardType.Province,
  )
  const [tab1, setTab1] = useState(
    MicroplanningDashboardType.Province,
  )

  return { tab, setTab, tab1, setTab1 }
}

function buildTableData(table: any) {
  return {
    name: table.name,
    dataSource: table.dataSource,
    columns: table.columns,
    pagination: {
      page: table.page,
      paginate: table.paginate,
      total: table.total,
      onChangePage: table.handleChangePage,
      onChangePaginate: table.handleChangePaginate,
    },
  }
}
