import CustomError from '@/components/CustomError';
import { Provider } from '@/provider';
import { wrapper } from '@/redux/store';
import '@/styles/globals.css';
import withLocale from '@/utils/hocs/withLocale';
import { useOnlineStatus } from '@/utils/useOnlineStatus';
import '@repo/ui/styles.css';
import { NextPageContext } from 'next';
import { AppProps } from 'next/app';
import 'nprogress/nprogress.css';
import useTranslation from '../utils/hooks/useTranslation';

interface AppInitialProps {
  pageProps: {
    pathname: string;
    query: Record<string, string | string[]>;
    [key: string]: any; // Allow other dynamic page props
  };
}

const MyApp = ({ Component, pageProps }: AppProps) => {
  let { __, locale } = useTranslation();
  const isOnline = useOnlineStatus();

  return (
    <Provider locale={locale}>
      {isOnline ? (
        <Component {...pageProps} />
      ) : (
        <CustomError withLayout error="connection" />
      )}
    </Provider>
  );
};

MyApp.getInitialProps = async ({
  Component,
  ctx,
}: {
  Component: any;
  ctx: NextPageContext;
}): Promise<AppInitialProps> => {
  return {
    pageProps: {
      ...(Component.getInitialProps
        ? await Component.getInitialProps(ctx)
        : {}),
      pathname: ctx.pathname,
      query: ctx.query,
    },
  };
};

export default withLocale(wrapper.withRedux(MyApp));
