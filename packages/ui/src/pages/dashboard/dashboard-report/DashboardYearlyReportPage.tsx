import { useMemo, useState } from 'react'
import { DataTable } from '#components/data-table'
import { useFilter, UseFilter } from '#components/filter'
import Meta from '#components/layouts/Meta'
import Container from '#components/layouts/PageContainer'
import { usePermission } from '#hooks/usePermission'
import { generateMetaTitle } from '#utils/strings'
import { useTranslation } from 'react-i18next'

import DashboardReportFilter from './components/DashboardReportFilter'
import { handleFilter, handleTableColumns } from './dashboard-report.helper'
import useDashboardReport from './hooks/useDashboardReport'
import dashboardReportFilterSchema from './schemas/dashboardReportFilterSchema'

export default function DashboardYearlyReportPage() {
  usePermission('dashboard-yearly-report-view')
  const { t } = useTranslation('dashboardReport')

  const [enabled, setEnabled] = useState(false)

  const filterSchema = useMemo<UseFilter>(
    () => dashboardReportFilterSchema(t, 'yearly'),
    [t]
  )

  const filter = useFilter(filterSchema)

  const date = filter?.query?.date?.value
    ? {
        start: `${filter?.query?.date?.value}-01-01`,
        end: `${filter?.query?.date?.value}-12-31`,
      }
    : undefined

  const params = handleFilter({
    ...filter?.query,
    period: 'annual',
    date,
  })

  const paramsExportAll = handleFilter({
    ...filter?.watch(),
    period: 'annual',
    date,
  })

  const { data, isLoading, onExport, onExportAll } = useDashboardReport({
    params,
    paramsExportAll,
    enabled,
    type: 'annual',
  })

  return (
    <Container title={t('title.yearly')} withLayout>
      <Meta title={generateMetaTitle(t('title.yearly'))} />
      <div className="ui-space-y-6">
        <DashboardReportFilter
          filter={filter}
          onSubmit={() => setEnabled(true)}
          onExport={onExport}
          onExportAll={onExportAll}
        />
        <div className="ui-relative -ui-z-10">
          <DataTable
            isLoading={isLoading}
            data={data}
            columns={handleTableColumns(t)}
          />
        </div>
      </div>
    </Container>
  )
}
