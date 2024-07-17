import type { MetaFunction } from '@remix-run/node';
import Typography from '@mui/material/Typography';
import { SetSelector } from '~/src/components/SetSelector';
import { ToReview } from '~/src/components/ToReview';
import { CORNERS, EDGES } from '~/src/utils/constants';
import { Link, useLoaderData } from "@remix-run/react"
import { getCardsReadyForReview } from '~/src/utils/cards';
import { Settings as SettingsIcon } from '@mui/icons-material';
import { Box, Button, IconButton } from '@mui/material';
import { useState } from 'react';
import { SettingsModal } from '~/src/components/SettingsModal';

// https://remix.run/docs/en/main/route/meta
export const meta: MetaFunction = () => [
  { title: 'Remix Starter' },
  { name: 'description', content: 'Welcome to remix!' },
];

export async function clientLoader() {
  return {
    [EDGES]: getCardsReadyForReview({ type: EDGES, shuffle: false }),
    [CORNERS]: getCardsReadyForReview({ type: CORNERS, shuffle: false })
  }
}

export function HydrateFallback() {
  return <h1>Loading...</h1>;
}


// TODO make summary show percentage in each state
// TODO show fraction of selected cases on set selectors
// TODO make the home screen update without refreshes (the new sets to review as well as auto-checking boxes added due to being inverses)


// https://remix.run/docs/en/main/file-conventions/routes#basic-routes
export default function Index() {
  const data = useLoaderData<typeof clientLoader>();
  const [settingsModalOpen, setSettingsModalOpen] = useState(false);

  return (
    <>
      <IconButton aria-label="Settings" onClick={() => setSettingsModalOpen(true)}>
        <SettingsIcon />
      </IconButton>
      <Typography variant="h4" component="h1" sx={{ my: 2 }}>
        Material UI Remix in TypeScript example
      </Typography>
      <ToReview cards={data[EDGES]} type={EDGES} />
      <ToReview cards={data[CORNERS]} type={CORNERS} />
      { Boolean(data[EDGES].length && data[CORNERS].length) && (
        <Box>
          <Link to={`/quiz/combined`}>      
            <Button>
              Start combined review
            </Button>
          </Link>
        </Box>
      )}
      <SetSelector type={EDGES} />
      <SetSelector type={CORNERS} />
      <SettingsModal open={settingsModalOpen} handleClose={() => setSettingsModalOpen(false)} />
    </>
  );
}
