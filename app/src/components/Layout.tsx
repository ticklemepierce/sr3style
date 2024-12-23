import { ReactNode } from 'react';
import { NavBar } from '~/src/components/NavBar';

export const Layout = ({ children }: { children: ReactNode }) => {
  return (
    <>
      <NavBar />
      {children}
    </>
  );
};
