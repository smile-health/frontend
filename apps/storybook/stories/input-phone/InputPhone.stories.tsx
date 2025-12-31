import { InputPhone } from '@repo/ui/components/input-phone'
import type { Meta, StoryObj } from '@storybook/react'

const meta = {
  title: 'Forms/InputPhone',
  component: InputPhone,
} satisfies Meta<typeof InputPhone>

export default meta

type Story = StoryObj<typeof meta>

export const BasicUsage: Story = {
  args: {
    placeholder: 'Input phone',
  },
  render: (args) => {
    return <InputPhone {...args} />
  },
}

export const Variant: Story = {
  args: {},
  render: (args) => {
    return (
      <div className="flex space-x-5">
        <InputPhone {...args} variant="outline" placeholder="Outline" />
        <InputPhone {...args} variant="filled" placeholder="Filled" />
      </div>
    )
  },
}

export const Size: Story = {
  args: {},
  render: (args) => {
    return (
      <div className="space-y-4">
        <InputPhone {...args} size="sm" placeholder="Size sm" />
        <InputPhone {...args} size="md" placeholder="Size md" />
        <InputPhone {...args} size="lg" placeholder="Size lg" />
        <InputPhone {...args} size="xl" placeholder="Size xl" />
      </div>
    )
  },
}

export const Disabled: Story = {
  args: {
    disabled: true,
    placeholder: 'Input phone',
  },
  render: (args) => {
    return <InputPhone {...args} />
  },
}

export const WithMaxLimit: Story = {
  args: {
    limitMaxLength: true,
  },
  render: (args) => {
    return (
      <div className="w-full space-y-4">
        <InputPhone {...args} />

        <p className="text-gray-500">
          When limitMaxLength is true, it will automatically set max limit based
          on the country
        </p>
      </div>
    )
  },
}

export const Error: Story = {
  args: {
    error: true,
    placeholder: 'Input phone',
  },
  render: (args) => {
    return <InputPhone {...args} />
  },
}
