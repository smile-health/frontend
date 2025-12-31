import CustomError from '@repo/ui/components/modules/CustomError'
import { StoryObj } from '@storybook/react'

const meta = {
  title: 'Modules/Custom Error',
}

export default meta

export const Error403: StoryObj = {
  render: () => {
    return (
      <div>
        <CustomError error="403" />
      </div>
    )
  },
}

export const Error404Data: StoryObj = {
  render: () => {
    return (
      <div>
        <CustomError error="404_data" />
      </div>
    )
  },
}

export const Error404Pages: StoryObj = {
  render: () => {
    return (
      <div>
        <CustomError error="404_pages" />
      </div>
    )
  },
}

export const Error500: StoryObj = {
  render: () => {
    return (
      <div>
        <CustomError error="500" />
      </div>
    )
  },
}

export const Error502: StoryObj = {
  render: () => {
    return (
      <div>
        <CustomError error="502" />
      </div>
    )
  },
}

export const Error504: StoryObj = {
  render: () => {
    return (
      <div>
        <CustomError error="504" />
      </div>
    )
  },
}

export const ErrorConnection: StoryObj = {
  render: () => {
    return (
      <div>
        <CustomError error="connection" />
      </div>
    )
  },
}