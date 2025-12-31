import { removeEmptyObject } from '#utils/object'
import { getReactSelectValue } from '#utils/react-select'
import { TFunction } from 'i18next'

import {
  getVaccineSequenceLabel,
  VACCINE_METHOD,
  VACCINE_SEQUENCE,
  VACCINE_SEQUENCE_COLOR,
} from './dashboard-rabies.constant'
import {
  TCareCascade,
  TDashboardRabiesFilter,
  TVaccineSequence,
} from './dashboard-rabies.type'

export function handleFilter(filter: TDashboardRabiesFilter) {
  return removeEmptyObject({
    from: filter?.period?.start?.toString(),
    to: filter?.period?.end?.toString(),
    entity_tag_ids: getReactSelectValue(filter?.entity_tags),
    province_ids: getReactSelectValue(filter?.provinces),
    regency_ids: getReactSelectValue(filter?.regencies),
    entity_ids: getReactSelectValue(filter?.entities),
    vaccine_method:
      filter?.vaccine_method === '0' ? '' : filter?.vaccine_method,
    gender: filter?.gender === '0' ? '' : filter?.gender,
    identity_type: filter?.identity_type,
    vaccine: filter?.vaccine,
  })
}

export function handleCareCascadeDataChart(
  t: TFunction<'dashboardRabies'>,
  data: TCareCascade[],
  method?: string
) {
  const PREP1 = data?.find(
    (o) => o.sequence === VACCINE_SEQUENCE.PRE_EXPOSURE_I
  )
  const PREP2 = data?.find(
    (o) => o.sequence === VACCINE_SEQUENCE.PRE_EXPOSURE_II
  )
  const VAR1 = data?.find((o) => o.sequence === VACCINE_SEQUENCE.VAR_I)
  const VAR2 = data?.find((o) => o.sequence === VACCINE_SEQUENCE.VAR_II)
  const VAR3 = data?.find((o) => o.sequence === VACCINE_SEQUENCE.VAR_III)
  const VAR4 = data?.find((o) => o.sequence === VACCINE_SEQUENCE.VAR_IV)
  const BOOSTER1 = data?.find((o) => o.sequence === VACCINE_SEQUENCE.BOOSTER_I)
  const BOOSTER2 = data?.find((o) => o.sequence === VACCINE_SEQUENCE.BOOSTER_II)

  const labels = data?.map((item) => item?.title)

  return {
    labels,
    datasets: [
      {
        label: t('label.prevention_on_schedule'),
        data: [
          PREP1?.total ?? 0,
          PREP2?.on_schedule ?? 0,
          VAR1?.from_PrEP,
          method === VACCINE_METHOD.INTRA_MUSCULAR ? 0 : VAR4?.from_PrEP,
          VAR2?.from_PrEP,
          method === VACCINE_METHOD.INTRA_DERMAL ? 0 : VAR3?.from_PrEP,
          BOOSTER1?.from_PrEP,
          BOOSTER2?.from_PrEP,
        ],
        backgroundColor: '#680771',
      },
      {
        label: t('label.not_on_schedule'),
        data: [
          PREP1?.off_schedule ?? 0,
          PREP2?.off_schedule ?? 0,
          VAR1?.off_schedule ?? 0,
          method === VACCINE_METHOD.INTRA_MUSCULAR
            ? 0
            : (VAR4?.off_schedule ?? 0),
          VAR2?.off_schedule ?? 0,
          method === VACCINE_METHOD.INTRA_DERMAL
            ? 0
            : (VAR3?.off_schedule ?? 0),
          BOOSTER1?.off_schedule ?? 0,
          BOOSTER2?.off_schedule ?? 0,
        ],
        backgroundColor: '#D86DCD',
      },
      {
        label: t('label.post_on_schedule'),
        data: [
          0,
          0,
          VAR1?.from_PEP ?? 0,
          method === VACCINE_METHOD.INTRA_MUSCULAR
            ? 0
            : (VAR4?.on_schedule ?? 0),
          VAR2?.on_schedule ?? 0,
          method === VACCINE_METHOD.INTRA_DERMAL ? 0 : (VAR3?.on_schedule ?? 0),
          BOOSTER1?.from_PEP ?? 0,
          BOOSTER2?.from_PEP ?? 0,
        ],
        backgroundColor: '#004990',
      },
      {
        label: t('label.confirmed'),
        data: [
          PREP1?.stop ?? 0,
          PREP2?.stop ?? 0,
          VAR1?.stop ?? 0,
          method === VACCINE_METHOD.INTRA_MUSCULAR ? 0 : (VAR4?.stop ?? 0),
          VAR2?.stop ?? 0,
          method === VACCINE_METHOD.INTRA_DERMAL ? 0 : (VAR3?.stop ?? 0),
          BOOSTER1?.stop ?? 0,
          BOOSTER2?.stop ?? 0,
        ],
        backgroundColor: '#00B050',
      },
      {
        label: t('label.loss_to_follow_up'),
        data: [
          PREP1?.drop ?? 0,
          0,
          VAR1?.drop ?? 0,
          method === VACCINE_METHOD.INTRA_MUSCULAR ? 0 : (VAR4?.drop ?? 0),
          VAR2?.drop ?? 0,
          0,
          BOOSTER1?.drop ?? 0,
          BOOSTER2?.drop ?? 0,
        ],
        backgroundColor: '#EF476F',
      },
    ],
  }
}

export const handleVaccineSequence = (method?: string) => {
  const PrEP = ['prep1', 'prep2'] satisfies Array<keyof TVaccineSequence>
  const PEP1 = 'var1'
  const PEP2 = 'var2'
  const PEP3 = 'var3'
  const PEP4 = 'var8'
  const Booster = ['booster1', 'booster2'] satisfies Array<
    keyof TVaccineSequence
  >

  let PEP = [PEP1, PEP4, PEP2, PEP3] satisfies Array<keyof TVaccineSequence>

  if (method === VACCINE_METHOD.INTRA_MUSCULAR) {
    PEP = [PEP1, PEP2, PEP3] satisfies Array<keyof TVaccineSequence>
  }

  if (method === VACCINE_METHOD.INTRA_DERMAL) {
    PEP = [PEP1, PEP4, PEP2] satisfies Array<keyof TVaccineSequence>
  }

  return [...PrEP, ...PEP, ...Booster]
}

export const handleMonthlyVaccineSequenceGroup = (
  t: TFunction<'dashboardRabies'>,
  method?: string
) => {
  const sequences = handleVaccineSequence(method)

  return sequences.map((seq) => ({
    label: getVaccineSequenceLabel(t, seq),
    key: seq,
    color: VACCINE_SEQUENCE_COLOR[seq],
  }))
}
