import Meta from '#components/layouts/Meta'
import { useTranslation } from 'react-i18next'

import AnnualPlanningTaskFormContainer from './components/AnnualPlanningTaskFormContainer'
import TaskForm from './components/TaskForm'

export default function AnnualPlanningEditTaskPage() {
  const { t } = useTranslation(['common', 'task'])
  return (
    <AnnualPlanningTaskFormContainer title={t('task:edit.title')}>
      <Meta title={`SMILE | ${t('task:edit.title')}`} />

      <TaskForm isEdit />
    </AnnualPlanningTaskFormContainer>
  )
}
