import { Button } from '@repo/ui/components/button'
import { Divider } from '@repo/ui/components/divider'
import type { Meta, StoryObj } from '@storybook/react'

const meta = {
  title: 'Misc/Divider',
  component: Divider,
} satisfies Meta<typeof Divider>

export default meta

type Story = StoryObj<typeof meta>

export const BasicUsage: Story = {
  args: {},
  render: () => {
    return (
      <div className="space-y-5">
        <Divider />
        <Divider position="center">
          <div className="text-sm text-gray-700">Center</div>
        </Divider>
        <Divider position="left">
          <div className="text-sm text-gray-700">Left</div>
        </Divider>
        <Divider position="right">
          <div className="text-sm text-gray-700">Right</div>
        </Divider>
        <Divider position="center" withGap={false}>
          <Button variant="default" size="sm">
            Read More
          </Button>
        </Divider>
      </div>
    )
  },
}
