import { SetSelector } from '~/src/components/SetSelector';
import { ToReview } from '~/src/components/ToReview';
import { Layout } from '~/src/components/Layout';
import { CORNERS, EDGES } from '~/src/utils/constants';
import { Box, HStack } from '@chakra-ui/react';
import { sharedMeta } from '~/src/utils/meta';

export const meta = sharedMeta;

// TODO better loading components
// TODO add inverse for DB
// TODO get SSR working for premium
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
