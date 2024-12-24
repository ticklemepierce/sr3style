import { ReactNode, FC } from 'react';
import { ClientOnly as ChakraClientOnly, Skeleton } from '@chakra-ui/react';

type ClientOnlyProps = {
  /**
   * You are encouraged to add a fallback that is the same dimensions
   * as the client rendered children. This will avoid content layout
   * shift which is disgusting
   */
  children: ReactNode;
  fallback?: ReactNode;
};

// TODO refactor away in favor of Skeleton with loading prop for localStorage users
// premium users should be able to fully SSR
export const ClientOnly: FC<ClientOnlyProps> = ({
  children,
  fallback = <Skeleton height={'20px'} />,
}) => <ChakraClientOnly fallback={fallback}>{children}</ChakraClientOnly>;
