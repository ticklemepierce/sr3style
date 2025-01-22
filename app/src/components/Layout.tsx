import { ReactNode } from 'react';
// import { NavBar } from '~/src/components/NavBar';
import { Toaster } from '@chakra/toaster';

export const Layout = ({ children }: { children: ReactNode }) => {
  return (
    <>
      {/* <NavBar /> */}
      {children}
      <Toaster />
    </>
  );
};
