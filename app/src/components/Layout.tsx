import * as React from 'react';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import { FSRSProvider } from '../context/fsrs';
import { SettingsProvider } from '../context/settings';
import { useSearchParams } from '@remix-run/react';

export default function Layout({ children }: { children: React.ReactNode }) {
  const [searchParams] = useSearchParams();

  const debugMode = searchParams.get('debugMode');

  return (
    <SettingsProvider debugMode={debugMode === '1' || debugMode === 'true'}>
      {/* TODO move settings to Session */}
      <FSRSProvider>
        <Container maxWidth={'sm'}>
          <Box>{children}</Box>
        </Container>
      </FSRSProvider>
    </SettingsProvider>
  );
}
