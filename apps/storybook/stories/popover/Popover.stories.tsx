import { Button } from '@repo/ui/components/button'
import {
  PopoverArrow,
  PopoverContent,
  PopoverRoot,
  PopoverTrigger,
} from '@repo/ui/components/popover'
import type { StoryObj } from '@storybook/react'

const meta = {
  title: 'Overlay/Popover',
  parameters: {
    layout: 'centered',
  },
}

export default meta

export const BasicUsage: StoryObj = {
  render: () => {
    return (
      <PopoverRoot>
        <PopoverTrigger>
          <Button variant="default">Click Me</Button>
        </PopoverTrigger>
        <PopoverContent>
          <PopoverArrow></PopoverArrow>
          <div className="w-56 ">This Content can by anything</div>
        </PopoverContent>
      </PopoverRoot>
    )
  },
}

export const WithoutArrow: StoryObj = {
  render: () => {
    return (
      <PopoverRoot>
        <PopoverTrigger>
          <Button variant="default">Click Me</Button>
        </PopoverTrigger>
        <PopoverContent sideOffset={5}>
          <div className="w-56 ">This Content can by anything</div>
        </PopoverContent>
      </PopoverRoot>
    )
  },
}
