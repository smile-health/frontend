/* eslint-disable react-hooks/rules-of-hooks */
import React from 'react'
import { ReactSelect } from '@repo/ui/components/react-select'
import type { StoryObj } from '@storybook/react'

const meta = {
  title: 'Forms/ReactSelect',
}

export default meta

type Story = StoryObj<typeof meta>

const options = [
  { label: 'Option 1', value: '1' },
  { label: 'Option 2', value: '2' },
  { label: 'Option 3', value: '3' },
  { label: 'Option 4', value: '4' },
  { label: 'Option 5', value: '5' },
  { label: 'Option 6', value: '6' },
  { label: 'Option 7', value: '7' },
  { label: 'Option 8', value: '8' },
  { label: 'Option 9', value: '9' },
  { label: 'Option 10', value: '10' },
]

export const BasicUsage: Story = {
  render: () => {
    const [value, setValue] = React.useState<unknown>(null)
    return (
      <ReactSelect
        placeholder="Select Option"
        value={value}
        onChange={setValue}
        isClearable
        options={options}
      />
    )
  },
}

export const MultiSelect: Story = {
  render: () => {
    const [value, setValue] = React.useState<unknown>(null)

    return (
      <ReactSelect
        placeholder="Select Option"
        value={value}
        onChange={setValue}
        isClearable
        options={options}
        isMulti
        multiSelectCounterStyle="normal"
        multiSelectOptionStyle="normal"
      />
    )
  },
}

export const MultiSelectWithCheckbox: Story = {
  render: () => {
    const [value, setValue] = React.useState<unknown>(null)

    return (
      <ReactSelect
        placeholder="Select Option"
        value={value}
        onChange={setValue}
        isClearable
        options={options}
        isMulti
      />
    )
  },
}
