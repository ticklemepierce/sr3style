import { ReactNode } from 'react';
import { useHydrated } from '../hooks/use-hydrated';

type ClientOnlyProps = {
  /**
   * You are encouraged to add a fallback that is the same dimensions
   * as the client rendered children. This will avoid content layout
   * shift which is disgusting
   */
  children: ReactNode;
  fallback?: ReactNode;
  isPremium?: boolean;
};

/**
 * Render the children only after the JS has loaded client-side. Use an optional
 * fallback component if the JS is not yet loaded.
 *
 * Example: Render a Chart component if JS loads, renders a simple FakeChart
 * component server-side or if there is no JS. The FakeChart can have only the
 * UI without the behavior or be a loading spinner or skeleton.
 * ```tsx
 * return (
 *   <ClientOnlyOrPremium fallback={<FakeChart />}>
 *     {() => <Chart />}
 *   </ClientOnlyOrPremium>
 * );
 * ```
 *
 */
export const ClientOnlyOrPremium = ({
  children,
  fallback = null,
  isPremium = false,
}: ClientOnlyProps) => {
  const isHydrated = useHydrated();

  // Render `children` if `isHydrated` or `forceRender` is true
  if (isHydrated || isPremium) {
    return <>{children}</>;
  }

  return <>{fallback}</>;
};
