import { Cog6ToothIcon } from '@heroicons/react/24/outline'
import {
  TabsLinkList,
  TabsLinkRoot,
  TabsLinkTrigger,
} from '@repo/ui/components/tabs-link'
import type { Meta, StoryObj } from '@storybook/react'

const meta = {
  title: 'Navigation/TabsLink',
  component: TabsLinkRoot,
} satisfies Meta<typeof TabsLinkRoot>

export default meta

type Story = StoryObj<typeof meta>

export const BasicUsage: Story = {
  args: {},
  render: (args) => {
    return (
      <TabsLinkRoot {...args} variant="default">
        <TabsLinkList>
          <TabsLinkTrigger active href="/">
            General
          </TabsLinkTrigger>
          <TabsLinkTrigger href="/">Account</TabsLinkTrigger>
          <TabsLinkTrigger href="/">Setting</TabsLinkTrigger>
        </TabsLinkList>
      </TabsLinkRoot>
    )
  },
}

export const Variant: Story = {
  args: {},
  render: (args) => {
    return (
      <div className="space-y-20">
        <TabsLinkRoot {...args} variant="default">
          <TabsLinkList>
            <TabsLinkTrigger active href="/">
              General
            </TabsLinkTrigger>
            <TabsLinkTrigger href="/">Account</TabsLinkTrigger>
            <TabsLinkTrigger href="/">Setting</TabsLinkTrigger>
          </TabsLinkList>
        </TabsLinkRoot>

        <TabsLinkRoot {...args} variant="pills">
          <TabsLinkList>
            <TabsLinkTrigger active href="/">
              General
            </TabsLinkTrigger>
            <TabsLinkTrigger href="/">Account</TabsLinkTrigger>
            <TabsLinkTrigger href="/">Setting</TabsLinkTrigger>
          </TabsLinkList>
        </TabsLinkRoot>
      </div>
    )
  },
}

export const Vertical: Story = {
  args: {
    orientation: 'vertical',
  },
  render: (args) => {
    return (
      <div className="space-y-20">
        <TabsLinkRoot {...args} variant="default">
          <TabsLinkList>
            <TabsLinkTrigger active href="/">
              General
            </TabsLinkTrigger>
            <TabsLinkTrigger href="/">Account</TabsLinkTrigger>
            <TabsLinkTrigger href="/">Setting</TabsLinkTrigger>
          </TabsLinkList>
        </TabsLinkRoot>

        <TabsLinkRoot {...args} variant="pills">
          <TabsLinkList>
            <TabsLinkTrigger active href="/">
              General
            </TabsLinkTrigger>
            <TabsLinkTrigger href="/">Account</TabsLinkTrigger>
            <TabsLinkTrigger href="/">Setting</TabsLinkTrigger>
          </TabsLinkList>
        </TabsLinkRoot>
      </div>
    )
  },
}

export const WithIcon: Story = {
  args: {
    orientation: 'horizontal',
  },
  render: (args) => {
    return (
      <div className="space-y-20">
        <TabsLinkRoot {...args} variant="default">
          <TabsLinkList>
            <TabsLinkTrigger
              href="/"
              leftSection={<Cog6ToothIcon className="h-5 w-5"></Cog6ToothIcon>}
            >
              Left Icon
            </TabsLinkTrigger>
            <TabsLinkTrigger
              href="/"
              rightSection={<Cog6ToothIcon className="h-5 w-5"></Cog6ToothIcon>}
            >
              Right Icon
            </TabsLinkTrigger>
            <TabsLinkTrigger
              href="/"
              active
              rightSection={
                <div className="flex items-center justify-center">
                  <div className="group-data-[state=active]:bg-primary-500 flex h-5 w-5 items-center justify-center rounded-full bg-gray-300 text-xs text-white">
                    <div>3</div>
                  </div>
                </div>
              }
            >
              Label
            </TabsLinkTrigger>
          </TabsLinkList>
        </TabsLinkRoot>

        <TabsLinkRoot {...args} variant="pills">
          <TabsLinkList>
            <TabsLinkTrigger
              href="/"
              leftSection={<Cog6ToothIcon className="h-5 w-5"></Cog6ToothIcon>}
            >
              Left Icon
            </TabsLinkTrigger>
            <TabsLinkTrigger
              href="/"
              rightSection={<Cog6ToothIcon className="h-5 w-5"></Cog6ToothIcon>}
            >
              Right Icon
            </TabsLinkTrigger>
            <TabsLinkTrigger
              href="/"
              active
              rightSection={
                <div className="flex items-center justify-center">
                  <div className="group-data-[state=active]:text-primary-500 flex h-5 w-5 items-center justify-center rounded-full bg-gray-300 text-xs leading-none text-white group-data-[state=active]:bg-white">
                    <div>3</div>
                  </div>
                </div>
              }
            >
              Label
            </TabsLinkTrigger>
          </TabsLinkList>
        </TabsLinkRoot>
      </div>
    )
  },
}
