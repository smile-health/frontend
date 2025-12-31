import { useRouter } from 'next/router';
import { useTranslation } from 'react-i18next';

function getUrl(url: string, language: string, query?: Record<string, string>) {
  const normalizedUrl = url?.startsWith('/') ? url : `/${url}`;
  const languagePrefix = `/${language}`;

  const newUrl =
    normalizedUrl === languagePrefix ||
    normalizedUrl.startsWith(languagePrefix + '/')
      ? normalizedUrl
      : `${languagePrefix}${normalizedUrl}`;

  const searchParams = new URLSearchParams(query);
  let result = newUrl;

  if (searchParams.size) {
    result = `${result}?${searchParams.toString()}`;
  }

  return result;
}

export default function useWmsRouter() {
  const {
    i18n: { language },
  } = useTranslation();
  const router = useRouter();

  function createUrl() {
    return (url: string, query?: Record<string, string>) => {
      const normalizedUrl = url?.startsWith('/') ? url : `/${url}`;
      const languagePrefix = `/${language}`;

      const targetPath =
        normalizedUrl === languagePrefix ||
        normalizedUrl.startsWith(languagePrefix + '/')
          ? normalizedUrl
          : `${languagePrefix}${normalizedUrl}`;

      const [currentPath, currentQueryString] = router.asPath.split('?');

      const normalizedTargetPath = targetPath.replace(/\/$/, '') || '/';
      const normalizedCurrentPath = currentPath.replace(/\/$/, '') || '/';

      if (normalizedTargetPath === normalizedCurrentPath && !query) {
        const existingQuery: Record<string, string> = {};
        if (currentQueryString) {
          const params = new URLSearchParams(currentQueryString);
          params.forEach((value, key) => {
            existingQuery[key] = value;
          });
        }
        return getUrl(url, language, existingQuery);
      }

      return getUrl(url, language, query);
    };
  }

  function createRouterMethod(method: 'push' | 'replace') {
    const getUrlFn = createUrl();
    return (url: string, query?: Record<string, string>) =>
      router[method](getUrlFn(url, query));
  }

  return {
    ...router,
    getAsLink: createUrl(),
    push: createRouterMethod('push'),
    replace: createRouterMethod('replace'),
    nextRouter: router.push,
    nextReplace: router.replace,
  };
}
