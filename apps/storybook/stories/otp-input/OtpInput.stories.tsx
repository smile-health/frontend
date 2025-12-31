/* eslint-disable react-hooks/rules-of-hooks */
import React from 'react'
import { OtpInput } from '@repo/ui/components/otp-input'
import type { Meta, StoryObj } from '@storybook/react'

const meta = {
  title: 'Forms/OtpInput',
  component: OtpInput,
} satisfies Meta<typeof OtpInput>

export default meta

type Story = StoryObj<typeof meta>

export const BasicUsage: Story = {
  args: {
    numInputs: 5,
  },
  render: (args) => {
    const [value, setValue] = React.useState('')
    return <OtpInput {...args} value={value} onChange={setValue} />
  },
}

export const Error: Story = {
  args: {},
  render: (args) => {
    const [value, setValue] = React.useState('')
    return <OtpInput {...args} error value={value} onChange={setValue} />
  },
}

export const Disabled: Story = {
  args: {},
  render: (args) => {
    const [value, setValue] = React.useState('')
    return <OtpInput {...args} disabled value={value} onChange={setValue} />
  },
}
