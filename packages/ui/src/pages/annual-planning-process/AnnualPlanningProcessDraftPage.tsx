import AppLayout from '#components/layouts/AppLayout/AppLayout'
import Meta from '#components/layouts/Meta'
import { useMemo } from 'react'

import AnnualPlanningProcessForm from './components/AnnualPlanningProcessForm'
import AnnualPlanningProcessStepper from './components/AnnualPlanningProcessStepper'
import { AnnualPlanningProcessCreateContext } from './context/ContextProvider'
import { useAnnualPlanningProcessCreatePage } from './hooks/useAnnualPlanningProcessCreatePage'
import { useAnnualPlanningProcessPermission } from './hooks/useAnnualPlanningProcessPermission'

const AnnualPlanningProcessDraftPage: React.FC = () => {
  const {
    t,
    userTag,
    step,
    parentForm,
    updateForm,
    refetchUsageIndex,
    setStep,
  } = useAnnualPlanningProcessCreatePage({ isDraft: true })
  useAnnualPlanningProcessPermission('draft', parentForm?.area_program_plan?.status)

  const contextValue = useMemo(() => ({
    userTag,
    currentStep: step,
    parentForm,
    updateForm,
    isReview: false,
    isRevision: false,
    isDraft: true,
    refetchUsageIndex,
    setCurrentStep: setStep,
  }), [userTag, parentForm, step, updateForm, setStep])

  return (
    <AppLayout title={t('create.title')}>
      <Meta title={t('create.meta')} />

      <AnnualPlanningProcessCreateContext.Provider
        value={contextValue}
      >
        {/* Stepper Component */}
        <AnnualPlanningProcessStepper />
        {/* Form Component */}
        <AnnualPlanningProcessForm />
      </AnnualPlanningProcessCreateContext.Provider>
    </AppLayout>
  )
}

export default AnnualPlanningProcessDraftPage
