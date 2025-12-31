import { useState } from 'react'
import { InformationCircleIcon } from '@heroicons/react/24/solid'
import { TabsContent, TabsList, TabsRoot, TabsTrigger } from '#components/tabs'
import DashboardBox from '#pages/dashboard/components/DashboardBox'
import { useTranslation } from 'react-i18next'

import DashboardRabiesCareCascadeChart from '../components/DashboardRabiesCareCascadeChart'
import DashboardRabiesRadioFilter from '../components/DashboardRabiesRadioFilter'
import { getCareCascadeTabs } from '../dashboard-rabies.constant'
import { handleFilter } from '../dashboard-rabies.helper'
import { TDashboardRabiesFilter, TInformation } from '../dashboard-rabies.type'

type Props = {
  enabled?: boolean
  filter: TDashboardRabiesFilter
  setInformation: (information: TInformation) => void
}

export default function DashboardRabiesCareCascade({
  filter,
  enabled = false,
  setInformation,
}: Props) {
  const { t } = useTranslation('dashboardRabies')

  const [method, setMethod] = useState<string>('0')
  const [gender, setGender] = useState<string>('0')

  const tabs = getCareCascadeTabs(t)

  return (
    <DashboardBox.Root id="dashboard-rabies-care-cascade">
      <DashboardBox.Header bordered size="small">
        <div className="ui-flex ui-justify-center ui-items-center ui-gap-1.5">
          <h4>
            <strong>{t('title.care_cascade')}</strong>
          </h4>

          <button
            onClick={() =>
              setInformation({
                title: t('title.care_cascade'),
                details: t('details.care_cascade', {
                  returnObjects: true,
                }),
              })
            }
          >
            <InformationCircleIcon className="ui-size-5" />
          </button>
        </div>
      </DashboardBox.Header>
      <div className="ui-relative ui-p-4 ui-bg-gray-50 ui-rounded-b-[inherit] ui-space-y-4">
        <DashboardRabiesRadioFilter
          activeMethod={method}
          activeGender={gender}
          onChangeMethod={setMethod}
          onChangeGender={setGender}
        />
        <TabsRoot variant="pills" defaultValue="all" align="stretch">
          <TabsList className="ui-grid-cols-3 ui-grow ui-mb-2">
            {tabs?.map((item) => (
              <TabsTrigger
                key={item?.key}
                value={item?.key}
                className="ui-justify-center ui-text-sm ui-px-2 ui-h-10"
              >
                {item?.label}
              </TabsTrigger>
            ))}
          </TabsList>
          {tabs?.map((item) => {
            const params = handleFilter({
              ...filter,
              vaccine_method: method,
              gender,
              identity_type: item?.value,
            })

            return (
              <TabsContent key={item?.key} value={item?.key}>
                <DashboardBox.Body bordered rounded>
                  <DashboardBox.Config
                    download={{
                      targetElementId: 'dashboard-rabies-care-cascade',
                      fileName: `Dashboard Rabies - ${t('title.care_cascade')}`,
                    }}
                  />
                  <DashboardRabiesCareCascadeChart
                    params={params}
                    enabled={enabled}
                  />
                </DashboardBox.Body>
              </TabsContent>
            )
          })}
        </TabsRoot>
      </div>
    </DashboardBox.Root>
  )
}
