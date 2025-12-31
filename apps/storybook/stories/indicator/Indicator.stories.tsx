import { CheckIcon, XMarkIcon } from '@heroicons/react/24/outline'
import { Indicator } from '@repo/ui/components/indicator'
import type { Meta, StoryObj } from '@storybook/react'

const meta = {
  title: 'Data Display/Indicator',
  component: Indicator,
} satisfies Meta<typeof Indicator>

export default meta

type Story = StoryObj<typeof meta>

export const BasicUsage: Story = {
  args: {},
  render: (args) => {
    return (
      <Indicator {...args}>
        <div className="rounded h-20 w-20  bg-gray-300"></div>
      </Indicator>
    )
  },
}

export const AnimatePing: Story = {
  args: {},
  render: (args) => {
    return (
      <Indicator {...args} animatePing>
        <div className="rounded h-20 w-20  bg-gray-300"></div>
      </Indicator>
    )
  },
}

export const Color: Story = {
  args: {},
  render: () => {
    return (
      <div className="flex flex-wrap gap-5">
        <Indicator color="primary">
          <div className="rounded h-20 w-20  bg-gray-300"></div>
        </Indicator>
        <Indicator color="secondary">
          <div className="rounded h-20 w-20  bg-gray-300"></div>
        </Indicator>
        <Indicator color="success">
          <div className="rounded h-20 w-20  bg-gray-300"></div>
        </Indicator>
        <Indicator color="danger">
          <div className="rounded h-20 w-20  bg-gray-300"></div>
        </Indicator>
        <Indicator color="warning">
          <div className="rounded h-20 w-20  bg-gray-300"></div>
        </Indicator>
        <Indicator color="info">
          <div className="rounded h-20 w-20  bg-gray-300"></div>
        </Indicator>
      </div>
    )
  },
}

export const Label: Story = {
  args: {},
  render: () => {
    return (
      <div className="div">
        <div className="flex flex-wrap gap-5">
          <Indicator label={0}>
            <div className="rounded h-20 w-20  bg-gray-300"></div>
          </Indicator>
          <Indicator label={1}>
            <div className="rounded h-20 w-20  bg-gray-300"></div>
          </Indicator>
          <Indicator label={10}>
            <div className="rounded h-20 w-20  bg-gray-300"></div>
          </Indicator>
          <Indicator label={99}>
            <div className="rounded h-20 w-20  bg-gray-300"></div>
          </Indicator>
          <Indicator label={1000}>
            <div className="rounded h-20 w-20  bg-gray-300"></div>
          </Indicator>
          <Indicator label={'99+'}>
            <div className="rounded h-20 w-20  bg-gray-300"></div>
          </Indicator>
          <Indicator label="New">
            <div className="rounded h-20 w-20  bg-gray-300"></div>
          </Indicator>
        </div>
      </div>
    )
  },
}

export const WithIcon: Story = {
  args: {},
  render: () => {
    return (
      <div className="flex flex-wrap gap-5">
        <Indicator
          color="success"
          label={<CheckIcon className="h-3 w-3 stroke-2"></CheckIcon>}
        >
          <div className="rounded h-20 w-20  bg-gray-300"></div>
        </Indicator>
        <Indicator
          color="danger"
          label={<XMarkIcon className="h-3 w-3 stroke-2"></XMarkIcon>}
        >
          <div className="rounded h-20 w-20  bg-gray-300"></div>
        </Indicator>
      </div>
    )
  },
}

export const Position: Story = {
  render: () => {
    return (
      <div className="space-y-5 p-10">
        <div className="flex flex-wrap gap-5">
          <Indicator label="top-left" position="top-left">
            <div className="rounded h-20 w-20 bg-gray-300"></div>
          </Indicator>
          <Indicator label="top-center" position="top-center">
            <div className="rounded h-20 w-20 bg-gray-300"></div>
          </Indicator>
          <Indicator label="top-right" position="top-right">
            <div className="rounded h-20 w-20 bg-gray-300"></div>
          </Indicator>
        </div>
        <div className="flex flex-wrap gap-5">
          <Indicator label="bottom-left" position="bottom-left">
            <div className="rounded h-20 w-20 bg-gray-300"></div>
          </Indicator>
          <Indicator label="bottom-center" position="bottom-center">
            <div className="rounded h-20 w-20 bg-gray-300"></div>
          </Indicator>
          <Indicator label="bottom-right" position="bottom-right">
            <div className="rounded h-20 w-20 bg-gray-300"></div>
          </Indicator>
        </div>
      </div>
    )
  },
}

export const Offset: Story = {
  render: () => {
    return (
      <div className="space-y-5">
        <div className="flex flex-wrap gap-5">
          <Indicator style={{ left: 15, top: 5 }} label={9} position="top-left">
            <div className="h-20 w-20 rounded-full  bg-gray-300"></div>
          </Indicator>
          <Indicator label={9} position="top-center">
            <div className="h-20 w-20 rounded-full  bg-gray-300"></div>
          </Indicator>
          <Indicator
            style={{ right: 15, top: 5 }}
            label={9}
            position="top-right"
          >
            <div className="h-20 w-20 rounded-full  bg-gray-300"></div>
          </Indicator>
        </div>
        <div className="flex flex-wrap gap-5">
          <Indicator
            style={{ left: 15, bottom: 5 }}
            label={9}
            position="bottom-left"
          >
            <div className="h-20 w-20 rounded-full  bg-gray-300"></div>
          </Indicator>
          <Indicator label={9} position="bottom-center">
            <div className="h-20 w-20 rounded-full  bg-gray-300"></div>
          </Indicator>
          <Indicator
            style={{ right: 15, bottom: 5 }}
            label={9}
            position="bottom-right"
          >
            <div className="h-20 w-20 rounded-full  bg-gray-300"></div>
          </Indicator>
        </div>
      </div>
    )
  },
}
