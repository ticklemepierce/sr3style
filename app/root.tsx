import { useContext } from 'react';
import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  isRouteErrorResponse,
  useLoaderData,
  useRouteError,
} from '@remix-run/react';
import {
  ChakraProvider,
  Box,
  Heading,
  Text,
  Code,
  defaultSystem,
} from '@chakra-ui/react';
import { ServerStyleContext } from './src/context/server-style';
import WcaContextProvider from './src/context/wca';
import { getUserData } from './src/services/session.server';
import type { LoaderFunction } from '@remix-run/node';
import SessionContextProvider from './src/context/session';
import { ColorModeProvider } from '@chakra/color-mode';

// TODO only read these values out of process.env or context
const WCA_ORIGIN = 'https://api.worldcubeassociation.org';
const WCA_OAUTH_ORIGIN = 'https://worldcubeassociation.org';

interface DocumentProps {
  children: React.ReactNode;
  title?: string;
}

function Document({ children, title = 'App title' }: DocumentProps) {
  const serverStyleData = useContext(ServerStyleContext);

  return (
    <html lang={'en'} suppressHydrationWarning>
      <head>
        <meta charSet={'utf-8'} />
        <meta
          name={'viewport'}
          content={'width=device-width, initial-scale=1'}
        />
        <Meta />
        <title>{title}</title>
        <Links />
        {serverStyleData?.map(({ key, ids, css }) => (
          <style
            key={key}
            data-emotion={`${key} ${ids.join(' ')}`}
            dangerouslySetInnerHTML={{ __html: css }}
          />
        ))}
      </head>
      <body>
        <ChakraProvider value={defaultSystem}>
          <ColorModeProvider>{children}</ColorModeProvider>
        </ChakraProvider>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export const loader: LoaderFunction = async ({ request }) => ({
  wcaOrigin: WCA_ORIGIN,
  wcaOauthOrigin: WCA_OAUTH_ORIGIN,
  wcaOauthClientId: process.env.WCA_OAUTH_CLIENT_ID,
  userData: await getUserData(request),
});

export default function App() {
  const { userData, ...wcaContextValue } = useLoaderData<typeof loader>();

  return (
    <Document>
      <WcaContextProvider value={wcaContextValue}>
        <SessionContextProvider userData={userData}>
          <Outlet />
        </SessionContextProvider>
      </WcaContextProvider>
    </Document>
  );
}

export function ErrorBoundary() {
  const error = useRouteError();

  if (isRouteErrorResponse(error)) {
    return (
      <Document title={'Error!'}>
        <ChakraProvider value={defaultSystem}>
          <ColorModeProvider>
            <Box>
              <Heading as={'h1'} bg={'blue.500'}>
                {error.status} {error.statusText}
              </Heading>
              <Text>{error.data}</Text>
            </Box>
          </ColorModeProvider>
        </ChakraProvider>
      </Document>
    );
  } else if (error instanceof Error) {
    return (
      <Document title={'Error!'}>
        <ChakraProvider value={defaultSystem}>
          <ColorModeProvider>
            <Box>
              <Heading p={2} as={'h1'} bg={'red.500'}>
                Error
              </Heading>
              <Text p={4}>{error.message}</Text>
              <Heading p={2} as={'h2'} size={'sm'} bg={'red.500'}>
                Stack trace:
              </Heading>
              <Code w={'full'} p={4}>
                <pre>{error.stack}</pre>
              </Code>
            </Box>
          </ColorModeProvider>
        </ChakraProvider>
      </Document>
    );
  } else {
    return <Heading as={'h1'}>Something went wrong</Heading>;
  }
}
