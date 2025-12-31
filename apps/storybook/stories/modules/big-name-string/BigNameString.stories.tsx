import BigNameString from '@repo/ui/components/modules/BigNameString'
import { StoryObj } from '@storybook/react'

const meta = {
  title: 'Modules/Big Name String',
}

export default meta

const value = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc id mauris vitae nibh ullamcorper efficitur in vitae enim. Quisque id sodales tellus. Phasellus accumsan feugiat consequat.'
export const BasicUsage: StoryObj = {
  render: () => {
    return (
      <div>
        <BigNameString name={value} limit={150} />
      </div>
    )
  },
}

export const WithoutLimit: StoryObj = {
  render: () => {
    return (
      <div>
        <BigNameString name={value} />
      </div>
    )
  },
}