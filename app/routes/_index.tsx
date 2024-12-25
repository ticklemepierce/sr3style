import { SetSelector } from '~/src/components/SetSelector';
import { ToReview } from '~/src/components/ToReview';
import { Layout } from '~/src/components/Layout';
import { CORNERS, EDGES } from '~/src/utils/constants';
import { Box, HStack } from '@chakra-ui/react';
import { sharedMeta } from '~/src/utils/meta';

export const meta = sharedMeta;

// TODO make summary show percentage in each state
// TODO show fraction of selected cases on set selectors
// TODO better loading components
// TODO add inverse for DB
// TODO get SSR working for premium
// TODO settings modal for local
// TODO triage for unused deps/code
// TODO restructure api code
// TODO better error handling on api responses

export default function Index() {
  return (
    <Layout>
      <Box px={10}>
        <HStack my={3}>
          <ToReview setType={EDGES} />
          <ToReview setType={CORNERS} />
        </HStack>
        <SetSelector setType={EDGES} />
        <SetSelector setType={CORNERS} />
      </Box>
    </Layout>
  );
}
