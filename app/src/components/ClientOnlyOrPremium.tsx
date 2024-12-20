import { ReactNode } from 'react';
import { useHydrated } from '../hooks/use-hydrated';
import { useSessionContext } from '../context/session';
import { LinearProgress } from '@mui/material';

type ClientOnlyProps = {
  /**
   * You are encouraged to add a fallback that is the same dimensions
   * as the client rendered children. This will avoid content layout
   * shift which is disgusting
   */
  children: ReactNode;
  fallback?: ReactNode;
};

export const ClientOnlyOrPremium = ({
  children,
  fallback = <LinearProgress />,
}: ClientOnlyProps) => {
  const isHydrated = useHydrated();
  const { userData } = useSessionContext();

  // Render `children` if `isHydrated` or `forceRender` is true
  if (isHydrated || userData?.isPremium) {
    return children;
  }

  return fallback;
};
