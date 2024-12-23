import { Box, Flex, Heading, IconButton } from '@chakra-ui/react';
import { Avatar } from '@chakra/avatar';
import { ColorModeButton } from '@chakra/color-mode';
import { useSessionContext } from '~/src/context/session';
import {
  MenuRoot,
  MenuTrigger,
  MenuContent,
  MenuItem,
  MenuSeparator,
} from '@chakra/menu';
import { Button } from '@chakra/button';
import { Form } from '@remix-run/react';

export const NavBar = () => {
  const { userData } = useSessionContext();

  return (
    <Box bg={{ base: 'gray.100', _dark: 'gray.900' }} px={4}>
      <Flex h={16} alignItems={'center'} justifyContent={'space-between'}>
        <Heading size={'4xl'} as={'h1'} my={2}>
          SR 3style
        </Heading>

        <Flex alignItems={'center'} gap={5}>
          <ColorModeButton />

          {userData ? (
            <MenuRoot>
              <MenuTrigger asChild>
                <IconButton variant={'ghost'}>
                  <Avatar size={'sm'} src={userData.user.avatar.thumb_url} />
                </IconButton>
              </MenuTrigger>
              <MenuContent>
                <MenuItem value={'settings'} cursor={'pointer'}>
                  Settings
                </MenuItem>
                <MenuSeparator />
                <Form action={'/logout'} method={'post'}>
                  <MenuItem as={'button'} cursor={'pointer'} value={'sign-out'}>
                    Sign out
                  </MenuItem>
                </Form>
              </MenuContent>
            </MenuRoot>
          ) : (
            <Form
              action={`/auth`}
              method={'post'}
              className={'flex justify-center'}
            >
              <Button type={'submit'}>Sign in with WCA</Button>
            </Form>
          )}
        </Flex>
      </Flex>
    </Box>
  );
};
