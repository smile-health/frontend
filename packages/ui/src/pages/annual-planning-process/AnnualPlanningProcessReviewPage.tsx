import AppLayout from "#components/layouts/AppLayout/AppLayout"
import Meta from "#components/layouts/Meta"
import AnnualPlanningProcessStepper from "./components/AnnualPlanningProcessStepper"
import AnnualPlanningProcessReview from "./components/AnnualPlanningProcessReview"
import { useAnnualPlanningProcessReviewPage } from "./hooks/useAnnualPlanningProcessReviewPage"
import { AnnualPlanningProcessCreateContext } from "./context/ContextProvider"
import { useMemo } from "react"
import { useAnnualPlanningProcessPermission } from "./hooks/useAnnualPlanningProcessPermission"

const AnnualPlanningProcessReviewPage: React.FC = () => {
  const {
    t,
    userTag,
    step,
    parentForm,
    updateForm,
    setStep,
    refetchUsageIndex,
  } = useAnnualPlanningProcessReviewPage()
  useAnnualPlanningProcessPermission('review', parentForm?.area_program_plan?.status)

  const contextValue = useMemo(() => ({
    userTag,
    currentStep: step,
    parentForm,
    updateForm,
    isReview: true,
    isRevision: false,
    isDraft: false,
    setCurrentStep: setStep,
    refetchUsageIndex,
  }), [userTag, parentForm, step, updateForm, setStep, refetchUsageIndex])

  return (
    <AppLayout title={t('review.title')}>
      <Meta title={t('review.meta')} />

      <AnnualPlanningProcessCreateContext.Provider
        value={contextValue}
      >
        {/* Stepper Component */}
        <AnnualPlanningProcessStepper />
        {/* Review Component */}
        <AnnualPlanningProcessReview />
      </AnnualPlanningProcessCreateContext.Provider>
    </AppLayout>
  )
}

export default AnnualPlanningProcessReviewPage
