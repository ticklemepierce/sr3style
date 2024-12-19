import * as React from 'react';
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useRouteError,
  isRouteErrorResponse,
} from '@remix-run/react';
import { withEmotionCache } from '@emotion/react';
import { unstable_useEnhancedEffect as useEnhancedEffect } from '@mui/material';
import theme from './src/theme';
import ClientStyleContext from './src/ClientStyleContext';
import Layout from './src/components/Layout';
import { useLoaderData } from '@remix-run/react';
import WcaContextProvider from './src/context/wca';
import { getUserData } from './src/services/session.server';
import type { LoaderFunction } from '@remix-run/node';
import SessionContextProvider from './src/context/session';

interface DocumentProps {
  children: React.ReactNode;
  title?: string;
}

const WCA_ORIGIN = 'https://api.worldcubeassociation.org';
const WCA_OAUTH_ORIGIN = 'https://worldcubeassociation.org';

export const loader: LoaderFunction = async ({ request }) => ({
  wcaOrigin: WCA_ORIGIN,
  wcaOauthOrigin: WCA_OAUTH_ORIGIN,
  wcaOauthClientId: process.env.WCA_OAUTH_CLIENT_ID,
  userData: await getUserData(request),
});

const Document = withEmotionCache(
  ({ children, title }: DocumentProps, emotionCache) => {
    const clientStyleData = React.useContext(ClientStyleContext);

    // Only executed on client
    useEnhancedEffect(() => {
      // re-link sheet container
      emotionCache.sheet.container = document.head;
      // re-inject tags
      const tags = emotionCache.sheet.tags;
      emotionCache.sheet.flush();
      tags.forEach((tag) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (emotionCache.sheet as any)._insertTag(tag);
      });
      // reset cache to reapply global styles
      clientStyleData.reset();
    }, []);

    return (
      <html lang={'en'}>
        <head>
          <meta charSet={'utf-8'} />
          <meta
            name={'viewport'}
            content={'width=device-width,initial-scale=1'}
          />
          <meta name={'theme-color'} content={theme.palette.primary.main} />
          {title ? <title>{title}</title> : null}
          <Meta />
          <Links />
          <link rel={'preconnect'} href={'https://fonts.googleapis.com'} />
          <link
            rel={'preconnect'}
            href={'https://fonts.gstatic.com'}
            crossOrigin={''}
          />
          <link
            rel={'stylesheet'}
            href={
              'https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap'
            }
          />
          <meta
            name={'emotion-insertion-point'}
            content={'emotion-insertion-point'}
          />
        </head>
        <body>
          {children}
          <ScrollRestoration />
          <Scripts />
          <LiveReload />
        </body>
      </html>
    );
  },
);

// https://remix.run/docs/en/main/route/component
// https://remix.run/docs/en/main/file-conventions/routes
export default function App() {
  const { userData, ...wcaContextValue } = useLoaderData<typeof loader>();

  return (
    <Document>
      <WcaContextProvider value={wcaContextValue}>
        <SessionContextProvider userData={userData}>
          <Layout>
            <Outlet />
          </Layout>
        </SessionContextProvider>
      </WcaContextProvider>
    </Document>
  );
}

// https://remix.run/docs/en/main/route/error-boundary
export function ErrorBoundary() {
  const error = useRouteError();

  if (isRouteErrorResponse(error)) {
    let message;
    switch (error.status) {
      case 401:
        message = (
          <p>
            Oops! Looks like you tried to visit a page that you do not have
            access to.
          </p>
        );
        break;
      case 404:
        message = (
          <p>Oops! Looks like you tried to visit a page that does not exist.</p>
        );
        break;

      default:
        throw new Error(error.data || error.statusText);
    }

    return (
      <Document title={`${error.status} ${error.statusText}`}>
        <Layout>
          <h1>
            {error.status}: {error.statusText}
          </h1>
          {message}
        </Layout>
      </Document>
    );
  }

  if (error instanceof Error) {
    console.error(error);
    return (
      <Document title={'Error!'}>
        <Layout>
          <div>
            <h1>There was an error</h1>
            <p>{error.message}</p>
            <hr />
            <p>
              Hey, developer, you should replace this with what you want your
              users to see.
            </p>
          </div>
        </Layout>
      </Document>
    );
  }

  return <h1>Unknown Error</h1>;
}
