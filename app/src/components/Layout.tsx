import * as React from 'react';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import { FSRSProvider } from '../context/fsrs';
import { SettingsProvider } from '../context/settings';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SettingsProvider>
      <FSRSProvider>
        <Container maxWidth="sm">
          <Box>
            {children}
          </Box>
        </Container>
      </FSRSProvider>
    </SettingsProvider>
  );
}
