/* eslint-disable react-hooks/rules-of-hooks */
import React, { useState } from 'react'
import { Button } from '@repo/ui/components/button'
import { ModalConfirmation } from '@repo/ui/components/modules/ModalConfirmation'
import type { StoryObj } from '@storybook/react'

const meta = {
  title: 'Misc/ModalConfirmation',
}

export default meta

export const BasicUsage: StoryObj = {
  render: () => {
    const [open, setOpen] = useState(false)
    return (
      <div>
        <Button color="danger" onClick={() => setOpen(!open)}>
          Delete
        </Button>
        <ModalConfirmation
          open={open}
          setOpen={setOpen}
          description="Are you sure to delete this data ?"
        />
      </div>
    )
  },
}
