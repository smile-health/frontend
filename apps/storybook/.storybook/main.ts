import { dirname, join, resolve } from 'path'
import { createRequire } from 'node:module'
import { fileURLToPath } from 'node:url'
import type { StorybookConfig } from '@storybook/react-vite'
import { defineConfig } from 'vite'

const __dirname = dirname(fileURLToPath(import.meta.url))

const require = createRequire(import.meta.url)
function getAbsolutePath(value: string) {
  return dirname(require.resolve(join(value, 'package.json')))
}

const config: StorybookConfig = {
  stories: [
    '../stories/**/*.mdx',
    '../stories/**/*.stories.@(js|jsx|mjs|ts|tsx)',
  ],
  addons: [
    getAbsolutePath('@storybook/addon-links'),
    getAbsolutePath('@storybook/addon-essentials'),
    {
      name: getAbsolutePath('@storybook/addon-storysource'),
      options: {
        loaderOptions: {
          injectStoryParameters: true,
        },
      },
    },
  ],
  framework: {
    name: getAbsolutePath('@storybook/react-vite'),
    options: {},
  },

  core: {},

  async viteFinal(config) {
    // customize the Vite config here
    return {
      ...config,
      define: { 'process.env': {} },
      resolve: {
        alias: [
          {
            find: 'ui',
            replacement: resolve(dirname(fileURLToPath(import.meta.url)), '../../../packages/ui/'),
          },
          {
            find: 'next/router',
            replacement: 'next-router-mock',
          },
        ],
      },
    }
  },

  docs: {
    autodocs: 'tag',
  },
  typescript: {
    reactDocgen: 'react-docgen-typescript',
  },
}

export default config
