import { useQuery } from '@tanstack/react-query'
import { CellContext } from '@tanstack/react-table'
import { Button } from '#components/button'
import { DataTable } from '#components/data-table'
import { Drawer, DrawerContent, DrawerHeader } from '#components/drawer'
import XMark from '#components/icons/XMark'
import { numberFormatter } from '#utils/formatter'
import { useTranslation } from 'react-i18next'

import { getVaccineSequenceLabel } from '../dashboard-rabies.constant'
import { getDashboardRabiesRegencies } from '../dashboard-rabies.service'
import {
  DashboardRabiesLocationParams,
  TVaccineSequence,
} from '../dashboard-rabies.type'

type Props = {
  open?: boolean
  onLeave?: VoidFunction
  sequences: Array<keyof TVaccineSequence>
  params: DashboardRabiesLocationParams
  province?: {
    id: number | null
    name: string
  }
}

export default function DashboardRabiesRegencyDrawer({
  open = false,
  onLeave,
  province,
  sequences,
  params,
}: Props) {
  const {
    t,
    i18n: { language },
  } = useTranslation('dashboardRabies')

  const {
    data: provinces,
    isLoading,
    isFetching,
  } = useQuery({
    queryKey: ['rabies-regency', params],
    queryFn: () => getDashboardRabiesRegencies(params),
    enabled: Boolean(province?.id),
  })

  const formatNumber = (value?: number) => {
    return numberFormatter(value ?? 0, language)
  }

  return (
    <Drawer
      open={open}
      closeOnOverlayClick={false}
      placement="bottom"
      size="full"
      sizeHeight="lg"
    >
      <DrawerHeader className="ui-text-center ui-relative">
        <h6 className="ui-text-xl ui-text-primary-800 ui-font-medium">
          {t('label.list_regency')}
        </h6>
        <Button
          variant="subtle"
          type="button"
          color="neutral"
          className="ui-absolute ui-top-1 ui-right-3"
          onClick={onLeave}
        >
          <XMark />
        </Button>
      </DrawerHeader>
      <DrawerContent className="ui-p-4 ui-space-y-6 ui-border-y ui-border-zinc-200">
        <div>
          <p className="ui-text-neutral-500">{t('label.province')}</p>
          <p className="ui-font-bold">{province?.name}</p>
        </div>

        <DataTable
          isSticky
          isLoading={isLoading || isFetching}
          className="ui-h-full ui-max-h-[331px]"
          columns={[
            {
              header: 'No.',
              accessorKey: 'row',
              size: 20,
              maxSize: 20,
            },
            {
              header: t('label.regency'),
              accessorKey: 'regency_name',
            },
            ...sequences.map((seq) => ({
              header: getVaccineSequenceLabel(t, seq),
              accessorKey: seq,
              cell: ({ getValue }: CellContext<unknown, unknown>) =>
                formatNumber(getValue<number>()),
              meta: {
                headerClassName: 'ui-text-center',
                cellClassName: 'ui-text-center',
              },
            })),
          ]}
          data={provinces?.data}
        />
      </DrawerContent>
    </Drawer>
  )
}
