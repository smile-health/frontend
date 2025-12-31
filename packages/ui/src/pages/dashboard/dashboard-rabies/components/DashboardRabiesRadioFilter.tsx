import { FormControl, FormLabel } from '#components/form-control'
import { Radio, RadioGroup } from '#components/radio'
import { useTranslation } from 'react-i18next'

import { getGenderList, getMethodList } from '../dashboard-rabies.constant'

type Props = {
  activeMethod: string
  onChangeMethod: (method: string) => void
  activeGender: string
  onChangeGender: (gender: string) => void
}

export default function DashboardRabiesRadioFilter({
  activeMethod,
  onChangeMethod,
  activeGender,
  onChangeGender,
}: Props) {
  const { t } = useTranslation('dashboardRabies')
  const methodList = getMethodList(t)
  const genderList = getGenderList(t)

  return (
    <div className="ui-grid ui-grid-cols-2 ui-gap-4">
      <FormControl className="ui-border ui-border-neutral-300 ui-rounded ui-p-3 ui-bg-white">
        <FormLabel>{t('label.method')}</FormLabel>
        <RadioGroup>
          {methodList.map((m) => (
            <Radio
              key={'method' + m.label}
              label={m.label}
              value={m.value}
              checked={m.value === activeMethod}
              onChange={(e) => onChangeMethod(e.target.value)}
            />
          ))}
        </RadioGroup>
      </FormControl>
      <FormControl className="ui-border ui-border-neutral-300 ui-rounded ui-p-3 ui-bg-white">
        <FormLabel>{t('label.gender')}</FormLabel>
        <RadioGroup>
          {genderList.map((g) => (
            <Radio
              key={'gender' + g.label}
              label={g.label}
              value={g.value}
              checked={g.value === activeGender}
              onChange={(e) => onChangeGender(e.target.value)}
            />
          ))}
        </RadioGroup>
      </FormControl>
    </div>
  )
}
