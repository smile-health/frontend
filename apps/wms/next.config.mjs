/** @type {import('next').NextConfig} */
const nextConfig = {
  basePath: '/wms',
  env: {
    SITE_TITLE: process.env.SITE_TITLE,
    STORAGE_PREFIX: process.env.STORAGE_PREFIX,
    CAPTCHA_SITE_KEY: process.env.CAPTCHA_SITE_KEY,
    CAPTCHA_SECRET_KEY: process.env.CAPTCHA_SECRET_KEY,
    API_URL: process.env.API_URL,
    API_URL_V5: process.env.API_URL_V5,
    DEVICE_TYPE: process.env.DEVICE_TYPE,
    DATE_FORMAT: process.env.DATE_FORMAT,
    DATE_TIME_FORMAT: process.env.DATE_TIME_FORMAT,
    FUSIONCHART_LICENSE: process.env.FUSIONCHART_LICENSE,
    FIREBASE_API_KEY: process.env.FIREBASE_API_KEY,
    FIREBASE_AUTH_DOMAIN: process.env.FIREBASE_AUTH_DOMAIN,
    FIREBASE_DATABASE_URL: process.env.FIREBASE_DATABASE_URL,
    FIREBASE_PROJECT_ID: process.env.FIREBASE_PROJECT_ID,
    FIREBASE_STORAGE_BUCKET: process.env.FIREBASE_STORAGE_BUCKET,
    FIREBASE_MESSAGING_SENDER_ID: process.env.FIREBASE_MESSAGING_SENDER_ID,
    FIREBASE_APP_ID: process.env.FIREBASE_APP_ID,
    FIREBASE_MEASUREMENT_ID: process.env.FIREBASE_MEASUREMENT_ID,
    CURRENCY: process.env.CURRENCY,
    TEMPERATURE_UNIT: process.env.TEMPERATURE_UNIT,
    NEXT_PUBLIC_URL_FE_SMILE: process.env.NEXT_PUBLIC_URL_FE_SMILE,
    NEXT_PUBLIC_URL_DASHBOARD_EXECUTIVE:
      process.env.NEXT_PUBLIC_URL_DASHBOARD_EXECUTIVE,
    NEXT_PUBLIC_DASHBOARD_EXECUTIVE_MENU:
      process.env.NEXT_PUBLIC_DASHBOARD_EXECUTIVE_MENU,
    URL_WMS: process.env.URL_WMS,
    KESLING_PATH: process.env.KESLING_PATH,
  },
  transpilePackages: ['@repo/ui'],
  output: 'standalone',
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
