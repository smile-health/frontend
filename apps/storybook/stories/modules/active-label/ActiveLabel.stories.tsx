import ActiveLabel from '@repo/ui/components/modules/ActiveLabel'
import { StoryObj } from '@storybook/react'

const meta = {
  title: 'Modules/Active Label',
}

export default meta

export const TypeActiveInactive: StoryObj = {
  render: () => {
    return (
      <div className="space-x-2">
        <ActiveLabel type="1" isActive />
        <ActiveLabel type="1" isActive={false} />
      </div>
    )
  },
}

export const TypeSuccessFailed: StoryObj = {
  render: () => {
    return (
      <div className="space-x-2">
        <ActiveLabel type="2" isActive />
        <ActiveLabel type="2" isActive={false} />
      </div>
    )
  },
}