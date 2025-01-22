import { Layout } from '~/src/components/Layout';
import { Box, Text } from '@chakra-ui/react';
// import { Box, HStack } from '@chakra-ui/react';
import { sharedMeta } from '~/src/utils/meta';
// import { SetTypeCard } from '~/src/components/SetTypeCard';
// import { SetType } from '~/src/types';

export const meta = sharedMeta;

// TODO support floating
// TODO tsconfig for tsnode

export default function Index() {
  return (
    <Layout>
      <Box px={10}>
        <Text>Hello World</Text>
        {/* <HStack
          my={4}
          gap={4}
          wrap={{ base: 'wrap', md: 'nowrap' }}
          justifyContent={'center'}
        >
          <SetTypeCard setType={SetType.EDGES} />
          <SetTypeCard setType={SetType.CORNERS} />
        </HStack> */}
      </Box>
    </Layout>
  );
}
