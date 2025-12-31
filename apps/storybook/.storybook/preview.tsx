/* eslint-disable @typescript-eslint/no-unused-vars */
import { Provider } from '@repo/ui/provider'
import type { Preview } from '@storybook/react'

import '../stories/index.css'
import '@repo/ui/styles.css'

import React from 'react'

const preview: Preview = {
  decorators: [
    (Story, context) => {
      const body = document.querySelector('body')
      if (body) {
        // body.classList.remove('purple', 'sky', 'green', font.className)
        // body.classList.add(context.globals.primaryColor)
        // body.classList.add(font.className)
      }
      return (
        <Provider locale="en">
          <div style={{ fontFamily: 'Inter, sans-serif' }}>
            <Story />
          </div>
        </Provider>
      )
    },
  ],
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
}

export default preview
