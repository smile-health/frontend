import { Button } from '#components/button'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
} from '#components/dialog'
import { H5 } from '#components/heading'
import { Trans, useTranslation } from 'react-i18next'

type Props = Readonly<{
  open?: boolean
  setOpen?: (open: boolean) => void
}>

export default function DashboardStockTakingInformation({
  open,
  setOpen,
}: Props) {
  const { t } = useTranslation('dashboardStockTaking')
  const { t: tDashboard } = useTranslation('dashboard')
  const tableDescription = t('information.item.description', {
    returnObjects: true,
  })

  return (
    <Dialog open={open} onOpenChange={setOpen} size="lg">
      <DialogHeader className="ui-text-center">
        {t('information.title')}
      </DialogHeader>
      <DialogContent className="ui-space-y-3">
        <p>{t('information.description')}</p>
        <div className="ui-space-y-1">
          <H5>{t('information.item.title')}</H5>
          <ul className="ui-list-disc ui-pl-8">
            {tableDescription?.map((item) => (
              <li key={item}>
                <Trans
                  components={{
                    bold: <strong />,
                  }}
                >
                  {item}
                </Trans>
              </li>
            ))}
          </ul>
        </div>
      </DialogContent>
      <DialogFooter className="ui-grid ui-grid-cols-1">
        <Button variant="outline" onClick={() => setOpen?.(!open)}>
          {tDashboard('close')}
        </Button>
      </DialogFooter>
    </Dialog>
  )
}
