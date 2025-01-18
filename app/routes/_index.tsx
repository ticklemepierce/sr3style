import { Layout } from '~/src/components/Layout';
import { Box, HStack } from '@chakra-ui/react';
import { sharedMeta } from '~/src/utils/meta';
import { SetTypeCard } from '~/src/components/SetTypeCard';
import { SetType } from '~/src/types';

export const meta = sharedMeta;

// TODO add inverse
// TODO fix login
// TODO mobile layout
// TODO save generated piece map thing on user data or settings and use that instead of setTypeSpeffzMap

export default function Index() {
  return (
    <Layout>
      <Box px={10}>
        <HStack my={4} gap={4}>
          <SetTypeCard setType={SetType.EDGES} />
          <SetTypeCard setType={SetType.CORNERS} />
        </HStack>
      </Box>
    </Layout>
  );
}
