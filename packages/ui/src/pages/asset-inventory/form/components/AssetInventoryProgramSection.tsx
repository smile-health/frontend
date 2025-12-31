import {
  FormControl,
  FormErrorMessage,
  FormLabel,
} from '#components/form-control'
import { ReactSelect } from '#components/react-select'
import { useProgram } from '#hooks/program/useProgram'
import { Controller, useFormContext } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

type AssetInventoryProgramSectionProps = {
  errors: any
}

export const AssetInventoryProgramSection = ({
  errors,
}: AssetInventoryProgramSectionProps) => {
  const { t } = useTranslation(['common', 'assetInventory'])
  const { control } = useFormContext()
  const { data } = useProgram({
    isCore: true,
    isIncludeWasteManagement: true,
  })

  return (
    <div className="ui-w-full ui-grid ui-grid-cols-1 ui-gap-4 ui-border ui-rounded-md ui-p-6 ui-mb-6">
      <div className="ui-font-bold ui-text-primary ui-text-dark-blue">
        {t('assetInventory:form.title.program')}
      </div>
      <FormControl className="ui-w-full">
        <FormLabel htmlFor="program_ids">
          {t('assetInventory:columns.related_program.label')}
        </FormLabel>
        <Controller
          name="program_ids"
          control={control}
          render={({ field }) => (
            <ReactSelect
              {...field}
              key={`asset_program_ids__${field.value?.value}`}
              id="program_ids"
              isMulti
              isClearable
              options={data?.map((item) => ({
                value: item.id,
                label: item.name,
              }))}
              placeholder={t('assetInventory:type_to_search')}
              error={errors?.program_ids}
              multiSelectCounterStyle="card"
              multiSelectOptionStyle="normal"
            />
          )}
        />
        {errors?.program_ids?.message && (
          <FormErrorMessage>{errors?.program_ids?.message}</FormErrorMessage>
        )}
      </FormControl>
    </div>
  )
}
