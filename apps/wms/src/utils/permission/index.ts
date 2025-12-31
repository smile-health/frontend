import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import { getUserRoleString } from '../getUserRole';
import { getUserStorage } from '../storage/user';
import { rolePermission } from './config';
import { FeatureName } from './features';

export function hasPermission(featureName: FeatureName) {
  const user = getUserStorage();
  const userRole = getUserRoleString();

  if (!userRole) {
    return false;
  }

  if (!user?.user_is_active || !user?.entity_is_active) {
    return false;
  }

  if (
    user?.view_only &&
    user?.entity?.type &&
    [1, 2, 5].includes(user.entity.type)
  ) {
    const blockedFeatures = [
      'homepage-view',
      'transaction-view',
      'tracking-view',
      'logbook-view',
      'manual-scale-view',
    ];

    if (blockedFeatures.includes(featureName)) {
      return false;
    }
  }

  const rolePermissions = rolePermission[userRole];
  return rolePermissions ? rolePermissions[featureName] !== undefined : false;
}

export function usePermission(featureName: FeatureName) {
  const router = useRouter();
  const user = getUserStorage();

  const {
    i18n: { language },
  } = useTranslation();

  useEffect(() => {
    const has = hasPermission(featureName);

    if (user && !has) {
      router.replace(`/${language}/403`);
    }
  }, [user, featureName, language, router]);
}
