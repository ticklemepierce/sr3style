import { Layout } from '~/src/components/Layout';
import { CORNERS, EDGES } from '~/src/utils/constants';
import { Box, HStack } from '@chakra-ui/react';
import { sharedMeta } from '~/src/utils/meta';
import { SetTypeCard } from '~/src/components/SetTypeCard';

export const meta = sharedMeta;

// TODO add inverse

export default function Index() {
  return (
    <Layout>
      <Box px={10}>
        <HStack my={4} gap={4}>
          <SetTypeCard setType={EDGES} />
          <SetTypeCard setType={CORNERS} />
        </HStack>
      </Box>
    </Layout>
  );
}
