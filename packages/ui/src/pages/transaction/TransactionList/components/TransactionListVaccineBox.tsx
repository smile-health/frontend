import React from 'react'
import { Protocol, Vaccination } from '#types/transaction'
import { useTranslation } from 'react-i18next'

import { generateVaccinationSchema } from '../helpers/transaction-list.detail'

type TransactionListVaccineBoxProps = {
  vaccination: Vaccination
  protocol: Protocol | undefined
}

const TransactionListVaccineBox: React.FC<TransactionListVaccineBoxProps> = ({
  vaccination,
  protocol,
}) => {
  const { t } = useTranslation(['common', 'transactionList'])

  return (
    <div aria-labelledby="header-vaccination">
      <section className="ui-border ui-border-zinc-300 ui-p-6 ui-rounded">
        <h5
          id="header-vaccination"
          className="ui-text-base ui-font-bold ui-text-dark-teal"
        >
          {t('transactionList:detail.vaccination.title')}
        </h5>
        <div
          className="content ui-overflow-hidden ui-space-y-1 ui-mt-6"
          id="content-vaccination"
        >
          {generateVaccinationSchema({ t, vaccination, protocol }).map(
            (vaccine, index) => (
              <div
                key={index?.toString()}
                className="ui-grid ui-grid-cols-[1fr_2fr]"
              >
                <h6 className="ui-text-dark-teal ui-text-base ui-font-medium">
                  {vaccine.label}
                </h6>
                <h6 className="ui-text-neutral-500 ui-text-base ui-font-medium">
                  : {vaccine.value}
                </h6>
              </div>
            )
          )}
        </div>
      </section>
    </div>
  )
}

export default TransactionListVaccineBox
