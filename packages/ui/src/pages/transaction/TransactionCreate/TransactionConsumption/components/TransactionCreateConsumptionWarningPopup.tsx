import React from 'react'
import { Button } from '#components/button'
import {
  Dialog,
  DialogCloseButton,
  DialogContent,
  DialogFooter,
  DialogHeader,
} from '#components/dialog'
import { useTranslation } from 'react-i18next'

type Props = {
  open: boolean
  description: string
  handleClose: () => void
  handleSubmit: () => void
}

const TransactionCreateConsumptionWarningPopup: React.FC<Props> = (props) => {
  const {
    open,
    handleClose,
    description,
    handleSubmit,
  } = props
  const { t } = useTranslation()

  return (
    <Dialog
      open={open}
      onOpenChange={handleClose}
      verticalCentered
      classNameOverlay="ui-z-[19]"
      className="ui-z-[19]"
    >
      <DialogCloseButton />
      <DialogHeader className="ui-text-center ui-text-xl">
        <p className="ui-text-xl ui-text-primary-800 ui-font-medium">
          {t('confirmation')}
        </p>
      </DialogHeader>
      <DialogContent>
        <p
          className="ui-text-primary-800 ui-text-base ui-text-justify"
          dangerouslySetInnerHTML={{ __html: description }}
        />
      </DialogContent>
      <DialogFooter className="ui-justify-center">
        <div className="ui-grid ui-grid-cols-2 ui-gap-4 ui-w-full">
          <Button
            id="btn-close-modal-confirmation"
            onClick={handleClose}
            variant="outline"
            type="button"
          >
            {t('cancel')}
          </Button>
          <Button
            id="btn-submit-modal-confirmation"
            onClick={() => {
              handleSubmit()
              handleClose()
            }}
            type="button"
          >
            {t('yes')}
          </Button>
        </div>
      </DialogFooter>
    </Dialog>
  )
}

export default TransactionCreateConsumptionWarningPopup
