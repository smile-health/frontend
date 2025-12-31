import LoadingPopup from '@repo/ui/components/modules/LoadingPopup'
import { useLoadingPopupStore } from '@repo/ui/store/loading.store'
import { Button } from '@repo/ui/components/button'
import { StoryObj } from '@storybook/react'

const meta = {
  title: 'Modules/Loading Popup',
}

export default meta

export const BasicUsage: StoryObj = {
  render: (args) => {
    const { setLoadingPopup } = useLoadingPopupStore()

    const handleShowLoading = () => {
      setLoadingPopup(true)

      setTimeout(() => setLoadingPopup(false), 3000)
    }

    return (
      <div>
        <Button {...args} variant="solid" onClick={handleShowLoading}>
          Show Loading
        </Button>
        <LoadingPopup />
      </div>
    )
  },
}