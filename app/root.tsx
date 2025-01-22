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
import { getUserData } from './src/services/session.server';
import type { LoaderFunction } from '@remix-run/node';
import SessionContextProvider from './src/context/session';
import { ColorModeProvider } from '@chakra/color-mode';

interface DocumentProps {
  children: React.ReactNode;
}

function Document({ children }: DocumentProps) {
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
  userData: await getUserData(request),
});

export default function App() {
  const { userData } = useLoaderData<typeof loader>();

  return (
    <Document>
      <SessionContextProvider userData={userData}>
        <Outlet />
      </SessionContextProvider>
    </Document>
  );
}

export function ErrorBoundary() {
  const error = useRouteError();

  if (isRouteErrorResponse(error)) {
    return (
      <Document>
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
      <Document>
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
