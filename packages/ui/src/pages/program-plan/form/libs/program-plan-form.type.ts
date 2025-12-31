import { OptionType } from '#components/react-select'
import { TFunction } from 'i18next'

export type ProgramPlanSubmitData = {
  year: number
  approach_id: number
}

export type ProgramPlanSubmitForm = {
  year: OptionType
}

export type TUseSubmitProgramPlanReturnProps = {
  t: TFunction<['common', 'programPlan']>
}
