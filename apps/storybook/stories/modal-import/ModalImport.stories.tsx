/* eslint-disable react-hooks/rules-of-hooks */
import React, { useState } from 'react'
import { Button } from '@repo/ui/components/button'
import { ModalImport } from '@repo/ui/components/modules/ModalImport'
import type { StoryObj } from '@storybook/react'

const meta = {
  title: 'Forms/ModalImport',
}

export default meta

export const BasicUsage: StoryObj = {
  render: () => {
    const [open, setOpen] = useState(false)
    return (
      <div>
        <Button onClick={() => setOpen(!open)}>Import</Button>
        <ModalImport open={open} setOpen={setOpen} />
      </div>
    )
  },
}
