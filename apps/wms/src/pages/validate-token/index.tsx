'use client';

import { checkToken } from '@/redux/actions/auth';
import { ROLE_LABEL } from '@/types/roles';
import { getUserRoleString } from '@/utils/getUserRole';
import { Spinner } from '@repo/ui/components/spinner';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';

const ValidateToken = () => {
  const { i18n: locale } = useTranslation();
  const lang = locale.language;
  const router = useRouter();

  const dispatch = useDispatch();
  const auth = useSelector((state: any) => state.auth);

  useEffect(() => {
    const { token } = router.query;

    if (typeof token === 'string') {
      dispatch(checkToken(token, lang));
    } else {
      window.location.replace(
        `${process.env.NEXT_PUBLIC_URL_FE_SMILE}/${lang}/v5/login`
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.query]);

  useEffect(() => {
    if (!auth.isProcessCheckToken) {
      if (auth.data_login !== null) {
        setTimeout(() => {
          const isAdminTP =
            getUserRoleString() === ROLE_LABEL.THIRD_PARTY_ADMIN;

          if (isAdminTP) {
            router.replace('/');
          } else {
            router.replace(`${lang}/transaction-monitoring`);
          }
        }, 1500);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [auth]);

  return (
    <div className="ui-h-screen ui-w-full ui-flex ui-items-center ui-justify-center">
      <Spinner className="ui-h-8 ui-w-8" />
    </div>
  );
};

export default ValidateToken;
