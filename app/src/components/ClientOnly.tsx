import { ReactNode, FC } from 'react';
import { useHydrated } from '../hooks/use-hydrated';
import { Skeleton } from '@chakra/skeleton';

type ClientOnlyProps = {
  /**
   * You are encouraged to add a fallback that is the same dimensions
   * as the client rendered children. This will avoid content layout
   * shift which is disgusting
   */
  children: ReactNode;
  fallback?: ReactNode;
};

// TODO replace with Chakra https://www.chakra-ui.com/docs/components/client-only

export const ClientOnly: FC<ClientOnlyProps> = ({
  children,
  fallback = <Skeleton height={'20px'} />,
}) => {
  const isHydrated = useHydrated();

  return isHydrated ? children : fallback;
};
