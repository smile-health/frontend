import React from 'react'
import { Button } from '#components/button'
import {
  Dialog,
  DialogCloseButton,
  DialogContent,
  DialogFooter,
  DialogHeader,
} from '#components/dialog'
import {
  FormControl,
  FormErrorMessage,
  FormLabel,
} from '#components/form-control'
import { OptionType, ReactSelect } from '#components/react-select'
import { TNotification } from '#types/notification'
import { useTranslation } from 'react-i18next'

import { useFinishedVaccine } from '../hooks/useFinishedVaccine'

type FinishedVaccineModalProps = {
  isOpen: boolean
  onClose: () => void
  notification: TNotification
}

export default function FinishedVaccineModal({
  isOpen,
  onClose,
  notification,
}: Readonly<FinishedVaccineModalProps>) {
  const { t } = useTranslation(['common', 'notification'])
  const {
    errors,
    setError,
    register,
    handleSubmit,
    stopNotification,
    setValue,
    watch,
    reset,
    reasons,
    isLoadingListReason,
  } = useFinishedVaccine(isOpen)

  const handleClose = () => {
    onClose()
    reset()
  }

  const handleStopNotification = () => {
    const data = {
      programId: notification.program.id,
      notification_id: notification.id,
      consumption_id: notification.data.consumption_id,
      reason_id: watch('reason'),
    }

    stopNotification(data, { onSuccess: handleClose })
  }

  return (
    <Dialog open={isOpen} size="md">
      <DialogCloseButton onClick={handleClose} />
      <DialogHeader className="ui-my-2">
        <h3 className="ui-text-center ui-text-xl ui-font-medium">
          {t('common:confirmation')}
        </h3>
      </DialogHeader>
      <div className="ui-h-1 ui-border-t ui-border-neutral-300" />
      <DialogContent className="ui-overflow-visible ui-my-2 ui-py-2 styled-scroll ui-scroll-pr-2">
        <p className="ui-font-normal ui-mx-4 ui-text-base ui-text-center ui-mb-5">
          {t('notification:finishedVaccine.description', {
            identityNumber: notification.data.identity_number || '',
          })}
        </p>
        <div className="ui-space-y-4">
          <FormControl>
            <FormLabel htmlFor="reaction-type" required>
              {t('notification:finishedVaccine.form.reason.label')}
            </FormLabel>
            <ReactSelect
              {...register('reason')}
              id="reason"
              placeholder={t(
                'notification:finishedVaccine.form.reason.placeholder'
              )}
              options={reasons || []}
              onChange={(option: OptionType) => {
                setValue('reason', option?.value)
                setError('reason', { message: '' })
              }}
              value={reasons?.find(
                (reason) => reason.value === watch('reason')
              )}
              isLoading={isLoadingListReason}
              error={!!errors?.reason?.message}
            />
            <FormErrorMessage>{errors?.reason?.message}</FormErrorMessage>
          </FormControl>
        </div>
      </DialogContent>
      <div className="ui-h-1 ui-border-t ui-border-neutral-300" />
      <DialogFooter>
        <div className="ui-grid ui-grid-cols-2 ui-gap-3 ui-w-full">
          <Button
            type="button"
            color="primary"
            variant="outline"
            onClick={handleClose}
          >
            {t('common:cancel')}
          </Button>
          <Button onClick={handleSubmit(handleStopNotification)}>
            {t('common:submit')}
          </Button>
        </div>
      </DialogFooter>
    </Dialog>
  )
}
