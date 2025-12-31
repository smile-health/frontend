/* eslint-disable react-hooks/rules-of-hooks */
import React from 'react'
import { ReactSelectAsync } from '@repo/ui/components/react-select'
import type { StoryObj } from '@storybook/react'
import type { GroupBase, OptionsOrGroups } from 'react-select'

const meta = {
  title: 'Forms/ReactSelectAsync',
}

export default meta

type Story = StoryObj<typeof meta>

type OptionType = {
  value: number
  label: string
}

const options: OptionType[] = []
for (let i = 0; i < 50; ++i) {
  options.push({
    value: i + 1,
    label: `Option ${i + 1}`,
  })
}

const sleep = (ms: number) =>
  new Promise((resolve) => {
    setTimeout(() => {
      resolve(undefined)
    }, ms)
  })

const loadOptions = async (
  search: string,
  prevOptions: OptionsOrGroups<OptionType, GroupBase<OptionType>>
) => {
  await sleep(1000)

  let filteredOptions: OptionType[]
  if (!search) {
    filteredOptions = options
  } else {
    const searchLower = search.toLowerCase()

    filteredOptions = options.filter(({ label }) =>
      label.toLowerCase().includes(searchLower)
    )
  }

  const hasMore = filteredOptions.length > prevOptions.length + 10
  const slicedOptions = filteredOptions.slice(
    prevOptions.length,
    prevOptions.length + 10
  )

  return {
    options: slicedOptions,
    hasMore,
  }
}

export const BasicUsage: Story = {
  render: () => {
    const [value, setValue] = React.useState<OptionType | null>(null)

    return (
      <ReactSelectAsync
        placeholder="Select Option"
        value={value}
        onChange={setValue}
        isClearable
        loadOptions={loadOptions}
      />
    )
  },
}

export const MultiSelect: Story = {
  render: () => {
    const [value, setValue] = React.useState<readonly OptionType[]>([])

    return (
      <ReactSelectAsync
        placeholder="Select Option"
        value={value}
        onChange={setValue}
        isClearable
        loadOptions={loadOptions}
        isMulti
        multiSelectCounterStyle="normal"
        multiSelectOptionStyle="normal"
      />
    )
  },
}

export const MultiSelectWithCheckbox: Story = {
  render: () => {
    const [value, setValue] = React.useState<readonly OptionType[]>([])

    return (
      <ReactSelectAsync
        placeholder="Select Option"
        value={value}
        onChange={setValue}
        isClearable
        loadOptions={loadOptions}
        isMulti
      />
    )
  },
}
