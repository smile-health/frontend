/**
 * Next.js Configuration
 *
 * Includes Firebase Cloud Messaging service worker build configuration
 * to inject environment variables at build time.
 */

const webpack = require('webpack')

module.exports = {
  env: {
    SITE_TITLE: process.env.SITE_TITLE,
    STORAGE_PREFIX: process.env.STORAGE_PREFIX,
    CAPTCHA_SITE_KEY: process.env.CAPTCHA_SITE_KEY,
    CAPTCHA_SECRET_KEY: process.env.CAPTCHA_SECRET_KEY,
    API_URL: process.env.API_URL,
    API_URL_ALT: process.env.API_URL_ALT,
    API_AUTH_URL: process.env.API_AUTH_URL,
    API_ASSET_URL: process.env.API_ASSET_URL,
    API_REPORT_URL: process.env.API_REPORT_URL,
    API_ETL: process.env.API_ETL,
    DEVICE_TYPE: process.env.DEVICE_TYPE,
    DATE_FORMAT: process.env.DATE_FORMAT,
    DATE_TIME_FORMAT: process.env.DATE_TIME_FORMAT,
    API_BIG_DATA_URL: process.env.API_BIG_DATA_URL,
    API_URL_V5: process.env.API_URL_V5,
    CURRENCY: process.env.CURRENCY,
    URL_WMS: process.env.URL_WMS,
    GEOJSON_MAPS_URL: process.env.GEOJSON_MAPS_URL,
    GROWTHBOOK_API_HOST: process.env.GROWTHBOOK_API_HOST,
    GROWTHBOOK_CLIENT_KEY: process.env.GROWTHBOOK_CLIENT_KEY,
    ASSET_VENDOR_TYPE_COMMUNICATION_PROVIDER: process.env.ASSET_VENDOR_TYPE_COMMUNICATION_PROVIDER,
    KESLING_PROGRAM_ID: process.env.KESLING_PROGRAM_ID,
    MAX_HUMIDITY_THRESHOLD: process.env.MAX_HUMIDITY_THRESHOLD,
    MIN_HUMIDITY_THRESHOLD: process.env.MIN_HUMIDITY_THRESHOLD,
  },
  transpilePackages: ['@repo/ui'],
  output: 'standalone',
  eslint: {
    ignoreDuringBuilds: true,
  },

  // Webpack configuration for Firebase service worker injection
  webpack: (config, { isServer, nextRuntime }) => {
    // Only modify client-side webpack config
    if (!isServer) {
      // Inject Firebase config into service worker via DefinePlugin
      // This replaces the %PLACEHOLDER% values in firebase-messaging-sw.js
      config.plugins.push(
        new webpack.DefinePlugin({
          'self.__FIREBASE_API_KEY__': JSON.stringify(process.env.NEXT_PUBLIC_FIREBASE_API_KEY || ''),
          'self.__FIREBASE_AUTH_DOMAIN__': JSON.stringify(process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || ''),
          'self.__FIREBASE_PROJECT_ID__': JSON.stringify(process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || ''),
          'self.__FIREBASE_STORAGE_BUCKET__': JSON.stringify(process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || ''),
          'self.__FIREBASE_MESSAGING_SENDER_ID__': JSON.stringify(process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || ''),
          'self.__FIREBASE_APP_ID__': JSON.stringify(process.env.NEXT_PUBLIC_FIREBASE_APP_ID || ''),
          'self.__FIREBASE_MEASUREMENT_ID__': JSON.stringify(process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || ''),
          'self.__FIREBASE_VAPID_KEY__': JSON.stringify(process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY || ''),
        })
      )
    }

    // Handle service worker files specially
    config.module.rules.push({
      test: /firebase-messaging-sw\.js$/,
      use: [
        {
          loader: 'string-replace-loader',
          options: {
            multiple: [
              {
                search: '%NEXT_PUBLIC_FIREBASE_API_KEY%',
                replace: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || '',
                flags: 'g',
              },
              {
                search: '%NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN%',
                replace: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || '',
                flags: 'g',
              },
              {
                search: '%NEXT_PUBLIC_FIREBASE_PROJECT_ID%',
                replace: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || '',
                flags: 'g',
              },
              {
                search: '%NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID%',
                replace: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '',
                flags: 'g',
              },
              {
                search: '%NEXT_PUBLIC_FIREBASE_APP_ID%',
                replace: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || '',
                flags: 'g',
              },
            ],
          },
        },
      ],
    })

    return config
  },

  // Headers for service worker scope
  async headers() {
    return [
      {
        source: '/firebase-messaging-sw.js',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=0, must-revalidate',
          },
          {
            key: 'Service-Worker-Allowed',
            value: '/',
          },
        ],
      },
    ]
  },

  // Rewrites if needed
  async rewrites() {
    return []
  },
}
