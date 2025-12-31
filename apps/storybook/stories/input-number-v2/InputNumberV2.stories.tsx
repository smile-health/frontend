import { InputNumberV2 } from '@repo/ui/components/input-number-v2'
import type { Meta, StoryObj } from '@storybook/react'

const meta: Meta<typeof InputNumberV2> = {
  title: 'Forms/InputNumberV2',
  component: InputNumberV2,
} satisfies Meta<typeof InputNumberV2>

export default meta

type Story = StoryObj<typeof meta>

export const BasicUsage: Story = {
  args: {
    placeholder: 'Input Number',
  },
  render: (args) => {
    return (
      <InputNumberV2
        {...args}
        onValueChange={(values) => {
          console.log(values.floatValue)
          // you can do setValue() here
        }}
        // onValueChange is required !!!
      />
    )
  },
}

export const InputPriceUsage: Story = {
  args: {
    placeholder: 'Price Tag',
  },
  render: (args) => {
    return (
      <InputNumberV2
        {...args}
        isPriceTag
        currencyDisplay="code"
        // currencyDisplay -> 'code' prints IDR | 'symbol' prints Rp | 'narrowSymbol' printsRp | 'name' prints Indonesian Rupiah as suffix

        onValueChange={(values) => {
          console.log(values.floatValue)
          // you can do setValue() here
        }}
        // onValueChange is required !!!
      />
    )
  },
}
