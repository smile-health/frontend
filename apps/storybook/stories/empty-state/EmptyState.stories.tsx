import { PlusIcon } from '@heroicons/react/24/outline'
import { Button } from '@repo/ui/components/button'
import { EmptyState } from '@repo/ui/components/empty-state'
import type { Meta, StoryObj } from '@storybook/react'

const meta = {
  title: 'Data Display/EmptyState',
  component: EmptyState,
} satisfies Meta<typeof EmptyState>

export default meta

type Story = StoryObj<typeof meta>

export const BasicUsage: Story = {
  args: {},
  render: (args) => {
    return (
      <EmptyState
        {...args}
        title="No project found"
        description="Your search did not match any project. Please try again or create project."
        primaryAction={
          <Button leftIcon={<PlusIcon className="h-5 w-5"></PlusIcon>}>
            Create project
          </Button>
        }
        secondaryAction={<Button variant="default">Clear search</Button>}
        withIcon
      ></EmptyState>
    )
  },
}

export const TitleAndDescription: Story = {
  args: {},
  render: (args) => {
    return (
      <EmptyState
        {...args}
        title="No project found"
        description="Your search did not match any project. Please try again or create project."
      ></EmptyState>
    )
  },
}

export const TitleOnly: Story = {
  args: {},
  render: (args) => {
    return <EmptyState {...args} title="No project found"></EmptyState>
  },
}

export const DescriptionOnly: Story = {
  args: {},
  render: (args) => {
    return (
      <EmptyState
        {...args}
        description="Your search did not match any project. Please try again or create project."
      ></EmptyState>
    )
  },
}
