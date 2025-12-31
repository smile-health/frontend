import {
  ArrowLeftOnRectangleIcon,
  Cog6ToothIcon,
} from '@heroicons/react/24/outline'
import {
  ContextMenuContent,
  ContextMenuGroup,
  ContextMenuItem,
  ContextMenuLabel,
  ContextMenuRoot,
  ContextMenuSeparator,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuTrigger,
} from '@repo/ui/components/context-menu'
import type { Meta, StoryObj } from '@storybook/react'

const meta = {
  title: 'Overlay/ContextMenu',
  component: ContextMenuRoot,
} satisfies Meta<typeof ContextMenuRoot>

export default meta

type Story = StoryObj<typeof meta>

export const BasicUsage: Story = {
  render: () => {
    return (
      <ContextMenuRoot>
        <ContextMenuTrigger>
          <div className="border bg-gray-50 flex h-56 w-full items-center justify-center border-gray-300 p-5">
            <div className="text-gray-600">Right Click Here...</div>
          </div>
        </ContextMenuTrigger>
        <ContextMenuContent>
          <ContextMenuGroup>
            <ContextMenuLabel>Application</ContextMenuLabel>
            <ContextMenuItem leftIcon={<Cog6ToothIcon className="h-5 w-5" />}>
              Account Settings
            </ContextMenuItem>
            <ContextMenuSub>
              <ContextMenuSubTrigger
                leftIcon={<Cog6ToothIcon className="h-5 w-5 " />}
              >
                More
              </ContextMenuSubTrigger>
              <ContextMenuSubContent>
                <ContextMenuItem
                  leftIcon={<Cog6ToothIcon className="h-5 w-5" />}
                >
                  Support
                </ContextMenuItem>
              </ContextMenuSubContent>
            </ContextMenuSub>
          </ContextMenuGroup>
          <ContextMenuSeparator></ContextMenuSeparator>
          <ContextMenuGroup>
            <ContextMenuLabel>Danger Zone</ContextMenuLabel>
            <ContextMenuItem leftIcon={<Cog6ToothIcon className="h-5 w-5" />}>
              License
            </ContextMenuItem>
            <ContextMenuItem
              disabled
              color="danger"
              leftIcon={
                <ArrowLeftOnRectangleIcon className="h-5 w-5"></ArrowLeftOnRectangleIcon>
              }
            >
              Sign out
            </ContextMenuItem>
          </ContextMenuGroup>
        </ContextMenuContent>
      </ContextMenuRoot>
    )
  },
}
