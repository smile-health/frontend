import AppLayout from '#components/layouts/AppLayout/AppLayout'
import Meta from '#components/layouts/Meta'
import { useMemo } from 'react'

import AnnualPlanningProcessRevision from './components/AnnualPlanningProcessRevision'
import AnnualPlanningProcessStepper from './components/AnnualPlanningProcessStepper'
import { AnnualPlanningProcessCreateContext } from './context/ContextProvider'
import { useAnnualPlanningProcessRevisionPage } from './hooks/useAnnualPlanningProcessRevisionPage'
import { useAnnualPlanningProcessPermission } from './hooks/useAnnualPlanningProcessPermission'

const AnnualPlanningProcessRevisionPage: React.FC = () => {
  const {
    t,
    userTag,
    step,
    parentForm,
    updateForm,
    refetchUsageIndex,
    setStep,
  } = useAnnualPlanningProcessRevisionPage()
  useAnnualPlanningProcessPermission('revision', parentForm?.area_program_plan?.status)

  const contextValue = useMemo(() => ({
    userTag,
    currentStep: step,
    parentForm,
    updateForm,
    isReview: false,
    isRevision: true,
    isDraft: false,
    refetchUsageIndex,
    setCurrentStep: setStep
  }), [userTag, parentForm, step, updateForm, setStep, refetchUsageIndex])

  return (
    <AppLayout title={t('revision.title')}>
      <Meta title={t('revision.meta')} />

      <AnnualPlanningProcessCreateContext.Provider
        value={contextValue}
      >
        {/* Stepper Component */}
        <AnnualPlanningProcessStepper />
        {/* Revision Component */}
        <AnnualPlanningProcessRevision />
      </AnnualPlanningProcessCreateContext.Provider>
    </AppLayout>
  )
}

export default AnnualPlanningProcessRevisionPage
