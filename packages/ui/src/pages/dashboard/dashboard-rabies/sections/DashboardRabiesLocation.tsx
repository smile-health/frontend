import { useEffect, useMemo, useState } from 'react'
import { InformationCircleIcon } from '@heroicons/react/24/solid'
import { useQuery } from '@tanstack/react-query'
import { CellContext } from '@tanstack/react-table'
import { Button } from '#components/button'
import { DataTable } from '#components/data-table'
import DashboardBox from '#pages/dashboard/components/DashboardBox'
import { numberFormatter } from '#utils/formatter'
import { useTranslation } from 'react-i18next'

import DashboardRabiesLastUpdated from '../components/DashboardRabiesLastUpdated'
import DashboardRabiesRadioFilter from '../components/DashboardRabiesRadioFilter'
import DashboardRabiesRegencyDrawer from '../components/DashboardRabiesRegencyDrawer'
import { getVaccineSequenceLabel } from '../dashboard-rabies.constant'
import { handleFilter, handleVaccineSequence } from '../dashboard-rabies.helper'
import { getDashboardRabiesProvinces } from '../dashboard-rabies.service'
import {
  TDashboardRabiesFilter,
  TInformation,
  TProvinceGrandTotal,
  TProvinceItem,
} from '../dashboard-rabies.type'

type Props = {
  enabled?: boolean
  filter: TDashboardRabiesFilter
  setInformation: (information: TInformation) => void
}

type TColWidth = Record<keyof TProvinceItem, number>

export default function DashboardRabiesLocation({
  enabled,
  filter,
  setInformation,
}: Props) {
  const {
    t,
    i18n: { language },
  } = useTranslation('dashboardRabies')

  const [method, setMethod] = useState<string>('0')
  const [gender, setGender] = useState<string>('0')
  const [colWidths, setColWidths] = useState<TColWidth>({} as TColWidth)
  const [selectedProvince, setSelectedProvince] = useState({
    id: null,
    name: '',
  })

  const params = handleFilter({
    ...filter,
    vaccine_method: method,
    gender,
  })

  const {
    data: provinces,
    isLoading,
    isFetching,
  } = useQuery({
    queryKey: ['rabies-province', params],
    queryFn: () =>
      getDashboardRabiesProvinces({ ...params, page: 1, paginate: 1000 }),
    enabled: enabled,
  })

  const formatNumber = (value?: number) => {
    return numberFormatter(value ?? 0, language)
  }

  const sequences = useMemo(() => handleVaccineSequence(method), [method])
  const provinceItemKeys = useMemo(() => {
    return [...sequences, 'total_patient'] as Array<keyof TProvinceItem>
  }, [sequences])

  useEffect(() => {
    const widths = provinceItemKeys?.reduce((acc, curr) => {
      return {
        ...acc,
        [curr]: document.getElementById(curr)?.offsetWidth ?? 0,
      }
    }, {} as TColWidth)

    setColWidths({
      ...widths,
      province_name: document.getElementById('province_name')?.offsetWidth ?? 0,
    })
  }, [provinceItemKeys, provinces])

  return (
    <DashboardBox.Root id="dashboard-rabies-location">
      <DashboardBox.Header bordered size="small">
        <div className="ui-flex ui-justify-center ui-items-center ui-gap-1.5">
          <h4>
            <strong>{t('title.location')}</strong>
          </h4>

          <button
            onClick={() =>
              setInformation({
                title: t('title.location'),
                description: t('description.location'),
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
        <DashboardBox.Body padded={false} rounded>
          <DashboardRabiesRegencyDrawer
            key={JSON.stringify(selectedProvince)}
            open={Boolean(selectedProvince?.id)}
            params={{
              ...params,
              page: 1,
              paginate: 1000,
              ...(Boolean(selectedProvince?.id) && {
                province_ids: String(selectedProvince?.id),
              }),
            }}
            sequences={sequences}
            province={selectedProvince}
            onLeave={() =>
              setSelectedProvince({
                id: null,
                name: '',
              })
            }
          />
          <DashboardBox.Content>
            <DataTable
              isSticky
              isLoading={isLoading || isFetching}
              className="ui-h-[500px]"
              columns={[
                {
                  header: 'No.',
                  accessorKey: 'row',
                  size: 20,
                  maxSize: 20,
                },
                {
                  header: t('label.province'),
                  accessorKey: 'province_name',
                },
                ...sequences.map((seq) => ({
                  header: getVaccineSequenceLabel(t, seq),
                  accessorKey: seq,
                  cell: ({ getValue }: CellContext<unknown, unknown>) =>
                    formatNumber(getValue<number>()),
                })),
                {
                  header: t('label.total_patient'),
                  accessorKey: 'total_patient',
                  cell: ({ getValue }) => formatNumber(getValue<number>()),
                },
                {
                  header: '',
                  accessorKey: 'province_id',
                  cell: ({ row: { original } }) => {
                    return (
                      <Button
                        variant="subtle"
                        onClick={() =>
                          setSelectedProvince({
                            id: original?.province_id,
                            name: original?.province_name,
                          })
                        }
                      >
                        {t('label.view_detail')}
                      </Button>
                    )
                  },
                },
              ]}
              data={provinces?.data}
            />
            <div className="ui-relative ui-p-4 ui-bg-slate-200 -ui-translate-y-1 ui-border ui-border-neutral-300 ui-rounded ui-rounded-t-none ui-flex ui-items-center">
              <strong
                style={{
                  width: provinces?.grand_total
                    ? colWidths?.province_name
                    : 250,
                }}
              >
                {t('label.grand_total')}
              </strong>
              {!!provinces?.grand_total &&
                provinceItemKeys?.map((key) => (
                  <strong
                    key={key}
                    className="ui-px-4"
                    style={{ width: colWidths?.[key] }}
                  >
                    {formatNumber(
                      provinces?.grand_total?.[key as keyof TProvinceGrandTotal]
                    )}
                  </strong>
                ))}
            </div>
            <DashboardRabiesLastUpdated date={provinces?.last_updated} />
          </DashboardBox.Content>
        </DashboardBox.Body>
      </div>
    </DashboardBox.Root>
  )
}
