import { ScrollArea } from '@repo/ui/components/scroll-area'
import type { Meta, StoryObj } from '@storybook/react'

const meta = {
  title: 'Misc/ScrollArea',
  component: ScrollArea,
} satisfies Meta<typeof ScrollArea>

export default meta

type Story = StoryObj<typeof meta>

export const VerticalScroll: Story = {
  args: {},
  render: () => {
    const tags = Array.from({ length: 50 }).map(
      (_, i, a) => `v1.2.0-beta.${a.length - i}`
    )
    return (
      <div className="flex items-center space-x-4">
        <ScrollArea className="h-72 border w-48 rounded-md">
          <div className="p-4">
            <h4 className="mb-4 text-sm font-medium leading-none">Tags</h4>
            {tags.map((tag) => (
              <>
                <div key={tag} className="text-sm">
                  {tag}
                </div>
              </>
            ))}
          </div>
        </ScrollArea>
      </div>
    )
  },
}

export const HorizontalScroll: Story = {
  args: {},
  render: () => {
    const tags = Array.from({ length: 10 }).map(
      (_, i, a) => `v1.2.0-beta.${a.length - i}`
    )
    return (
      <div className="flex items-center space-x-4">
        <ScrollArea className="h-72 border w-48 rounded-md">
          <div className="flex gap-3 p-3">
            {tags.map((item) => {
              return (
                <div key={item} className="rounded h-20 w-20 bg-gray-300"></div>
              )
            })}
          </div>
        </ScrollArea>
      </div>
    )
  },
}

export const MultipleScroll: Story = {
  args: {},
  render: () => {
    const tags = Array.from({ length: 10 }).map(
      (_, i, a) => `v1.2.0-beta.${a.length - i}`
    )
    return (
      <div className="flex items-center space-x-4">
        <ScrollArea className="h-72 border w-48 rounded-md">
          <div className="p-4">
            <h4 className="mb-4 text-sm font-medium leading-none">Tags</h4>
            {tags.map((tag) => (
              <>
                <div key={tag} className="text-sm">
                  {tag}
                </div>
              </>
            ))}
          </div>
          <div className="flex gap-3 p-3">
            {tags.map((item) => {
              return (
                <div key={item} className="rounded h-20 w-20 bg-gray-300"></div>
              )
            })}
          </div>
        </ScrollArea>
      </div>
    )
  },
}
