import { startTransition, StrictMode } from 'react';
import { RemixBrowser } from '@remix-run/react';
import { hydrateRoot } from 'react-dom/client';
import createEmotionCache from '@emotion/cache';
import { CacheProvider } from '@emotion/react';

const hydrate = () => {
  const emotionCache = createEmotionCache({ key: 'css' });

  startTransition(() => {
    hydrateRoot(
      document,
      <StrictMode>
        <CacheProvider value={emotionCache}>
          <RemixBrowser />
        </CacheProvider>
      </StrictMode>,
    );
  });
};

if (typeof requestIdleCallback === 'function') {
  requestIdleCallback(hydrate);
} else {
  // Safari doesn't support requestIdleCallback
  // https://caniuse.com/requestidlecallback
  setTimeout(hydrate, 1);
}
