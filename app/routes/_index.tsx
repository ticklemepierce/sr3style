import type { MetaFunction } from '@remix-run/node';
import { SetSelector } from '~/src/components/SetSelector';
import { ToReview } from '~/src/components/ToReview';
import { Layout } from '~/src/components/Layout';
import { CORNERS, EDGES } from '~/src/utils/constants';
import { Box, HStack } from '@chakra-ui/react';

// https://remix.run/docs/en/main/route/meta
export const meta: MetaFunction = () => [
  { title: 'Remix Starter' },
  { name: 'description', content: 'Welcome to remix!' },
];

// TODO make summary show percentage in each state
// TODO show fraction of selected cases on set selectors
// TODO better loading components
// TODO add inverse for DB
// TODO get SSR working for premium
// TODO figure out better naming for cards and letters and sets and fsrsCard
// TODO settings modal
// TODO removePair/removeSet functionality
// TODO test local storage
// TODO improve summary UI
// TODO triage for unused deps/code

// https://remix.run/docs/en/main/file-conventions/routes#basic-routes
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
