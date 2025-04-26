import { Layout } from '~/src/components/Layout';
import { Box, HStack } from '@chakra-ui/react';
import { sharedMeta } from '~/src/utils/meta';
import { SetTypeCard } from '~/src/components/SetTypeCard';
import { SetType } from '~/src/types';
import { ParityCard } from '~/src/components/ParityCard';

export const meta = sharedMeta;

// TODO support floating
// TODO tsconfig for tsnode
// TODO review "again" questions without regrading
// TODO test mode?
// TODO debug caching

export default function Index() {
  return (
    <Layout>
      <Box px={10}>
        <HStack
          my={4}
          gap={4}
          wrap={{ base: 'wrap' }}
          justifyContent={'center'}
        >
          <SetTypeCard setType={SetType.EDGES} />
          <SetTypeCard setType={SetType.CORNERS} />
          <ParityCard />
        </HStack>
      </Box>
    </Layout>
  );
}
