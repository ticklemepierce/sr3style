import type { MetaFunction } from '@remix-run/node';
import { SetSelector } from '~/src/components/SetSelector';
import { ToReview } from '~/src/components/ToReview';
import { CORNERS, EDGES } from '~/src/utils/constants';
import { Settings as SettingsIcon } from '@mui/icons-material';
import { IconButton, Typography } from '@mui/material';
import { useState } from 'react';
import { SettingsModal } from '~/src/components/SettingsModal';

// https://remix.run/docs/en/main/route/meta
export const meta: MetaFunction = () => [
  { title: 'Remix Starter' },
  { name: 'description', content: 'Welcome to remix!' },
];


// TODO make summary show percentage in each state
// TODO show fraction of selected cases on set selectors
// TODO better loading components

// https://remix.run/docs/en/main/file-conventions/routes#basic-routes
export default function Index() {
  const [settingsModalOpen, setSettingsModalOpen] = useState(false);

  return (
    <>
      <IconButton style={{position: 'absolute', top: '15px', right: '15px' }} aria-label="Settings" onClick={() => setSettingsModalOpen(true)}>
        <SettingsIcon />
      </IconButton>
      <Typography variant="h4" component="h1" sx={{ my: 2 }}>
        SR 3style
      </Typography>
      <ToReview type={EDGES} />
      <ToReview type={CORNERS} />
      <SetSelector type={EDGES} />
      <SetSelector type={CORNERS} />
      <SettingsModal open={settingsModalOpen} handleClose={() => setSettingsModalOpen(false)} />
    </>
  );
}
