import { defaultLocale } from './config';
import { isLocale } from './types';

export function getInitialLocale(): string {
  const localSetting = localStorage.getItem(
    process.env.STORAGE_PREFIX + 'APP_LOCALE'
  );

  if (localSetting && isLocale(localSetting)) {
    return localSetting;
  }

  return defaultLocale;
}
