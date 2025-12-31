import { UseFormSetValue, UseFormClearErrors } from 'react-hook-form'

export const clearField = ({
  setValue,
  name,
  resetValue = null,
  clearErrors,
}: {
  setValue: UseFormSetValue<any>
  name: string | string[]
  resetValue?: null | unknown[]
  clearErrors?: UseFormClearErrors<any>
}): void => {
  if (Array.isArray(name)) {
    name.forEach((item, index) => {
      if (Array.isArray(resetValue)) {
        setValue(item, resetValue?.[index])
        clearErrors?.(item)
      } else {
        setValue(item, resetValue)
        clearErrors?.(item)
      }
    })
  } else {
    setValue(name, resetValue)
    clearErrors?.(name)
  }
}
