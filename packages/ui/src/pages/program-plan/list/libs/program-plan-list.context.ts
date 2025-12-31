import { createContext } from 'react'

import { TProgramPlanData } from './program-plan-list.type'

type Props = {
  setPagination?: (value: { page?: number; paginate?: number }) => void
  page?: number
  openCreateModal?: boolean
  setOpenCreateModal?: (value: boolean) => void
  popUpDataRow?: TProgramPlanData | null
  setPopUpDataRow: (value: TProgramPlanData | null) => void
}
const ProgramPlanListContext = createContext<Props>({
  setPagination: () => {},
  page: 1,
  openCreateModal: false,
  setOpenCreateModal: () => {},
  popUpDataRow: null,
  setPopUpDataRow: () => {},
})

export default ProgramPlanListContext
