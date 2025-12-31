import { AxiosError } from "axios"
import { useEffect, useState } from "react"
import { useFormContext } from "react-hook-form"
import { useTranslation } from "react-i18next"

import { toast } from "#components/toast"
import { OptionType } from "#components/react-select"

import { listColdStorages } from "../services"
import { ColdStorage, StockOpnameCreateForm } from "../types"

export const useStockOpnameEntityColdStorage = () => {
  const { t } = useTranslation('stockOpnameCreate')
  const [coldStorage, setColdStorage] = useState<ColdStorage | null>(null)
  const { control, watch, setValue } = useFormContext<StockOpnameCreateForm>()
  const { entity, new_opname_items } = watch()

  const handleFetchColdStorage = async (entityId: number) => {
    try {
      const response = await listColdStorages({ entity_id: entityId })

      if (response.list && response.list.length > 0) setColdStorage(response.list[0])
      else setColdStorage(null)
    } catch (error) {
      if (error instanceof AxiosError) {
        const { message } = error.response?.data as { message: string }

        toast.danger({ description: message })
      }
    }
  }

  const handleSetColdStorage = (entity: OptionType | null) => {
    if (!entity) setColdStorage(null)
    else handleFetchColdStorage(entity.value)
  }

  // uncomment in next feature
  // useEffect(() => {
  //   handleSetColdStorage(entity)
  // }, [entity])

  return {
    t,
    control,
    coldStorage,
    setValue,
    new_opname_items,
  }
}