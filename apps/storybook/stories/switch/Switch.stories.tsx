import { useState } from 'react'
import { Switch } from '@repo/ui/components/switch'
import type { Meta, StoryObj } from '@storybook/react'

const meta = {
  title: 'Forms/Switch',
  component: Switch,
} satisfies Meta<typeof Switch>

export default meta

type Story = StoryObj<typeof meta>

export const BasicUsage: Story = {
  args: {
    defaultChecked: false,
  },
  render: (args) => {
    return <Switch {...args} />
  },
}

export const State: Story = {
  args: {},
  render: (args) => {
    return (
      <div className="space-x-5">
        <Switch {...args} size="md" checked={false} label="unchecked"></Switch>
        <Switch
          {...args}
          id="switch-1"
          size="md"
          disabled
          label="disabled unchecked"
        ></Switch>

        <Switch {...args} size="md" checked label="checked"></Switch>

        <Switch
          {...args}
          size="md"
          checked
          disabled
          label="disable checked"
        ></Switch>
      </div>
    )
  },
}

export const Size: Story = {
  args: {},
  render: (args) => {
    return (
      <div className="grid gap-5">
        <Switch {...args} size="sm" label="sm label"></Switch>
        <Switch {...args} size="md" label="md label"></Switch>
        <Switch {...args} size="lg" label="lg label"></Switch>
        <Switch {...args} size="xl" label="xl label"></Switch>
      </div>
    )
  },
}

export const InnerLabel: Story = {
  args: {},
  render: (args) => {
    const [checked, setChecked] = useState([false, false, false, false])

    const handleChange = (index: number) => {
      const temp = [...checked]
      temp[index] = !temp[index]
      setChecked(temp)
    }

    return (
      <div className="grid gap-5">
        <Switch
          {...args}
          checked={checked[0]}
          size="sm"
          labelInside={{ on: 'On', off: 'Off' }}
          label="sm"
          onCheckedChange={() => handleChange(0)}
        ></Switch>
        <Switch
          {...args}
          checked={checked[1]}
          size="md"
          labelInside={{ on: 'On', off: 'Off' }}
          label="md"
          onCheckedChange={() => handleChange(1)}
        ></Switch>
        <Switch
          {...args}
          checked={checked[2]}
          size="lg"
          labelInside={{ on: 'On', off: 'Off' }}
          label="lg"
          onCheckedChange={() => handleChange(2)}
        ></Switch>
        <Switch
          {...args}
          checked={checked[3]}
          size="xl"
          labelInside={{ on: 'On', off: 'Off' }}
          label="XL"
          onCheckedChange={() => handleChange(3)}
        ></Switch>
      </div>
    )
  },
}
