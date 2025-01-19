import { Layout } from '~/src/components/Layout';
import { Box, HStack } from '@chakra-ui/react';
import { sharedMeta } from '~/src/utils/meta';
import { SetTypeCard } from '~/src/components/SetTypeCard';
import { SetType } from '~/src/types';

export const meta = sharedMeta;

// TODO support floating
// TODO tsconfig for tsnode
// TODO add buffer setting

export default function Index() {
  return (
    <Layout>
      <Box px={10}>
        <HStack
          my={4}
          gap={4}
          wrap={{ base: 'wrap', md: 'nowrap' }}
          justifyContent={'center'}
        >
          <SetTypeCard setType={SetType.EDGES} />
          <SetTypeCard setType={SetType.CORNERS} />
        </HStack>
      </Box>
    </Layout>
  );
}
