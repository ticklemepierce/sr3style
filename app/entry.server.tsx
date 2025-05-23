import { PassThrough } from 'stream';

import createEmotionCache from '@emotion/cache';
import { CacheProvider as EmotionCacheProvider } from '@emotion/react';
import createEmotionServer from '@emotion/server/create-instance';
import { type EntryContext } from '@remix-run/node';
import { Response } from '@remix-run/web-fetch';
import { RemixServer } from '@remix-run/react';
import { isbot } from 'isbot';
import { renderToPipeableStream } from 'react-dom/server';

const ABORT_DELAY = 5000;

const handleRequest = (
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  remixContext: EntryContext,
) =>
  isbot(request.headers.get('user-agent'))
    ? handleBotRequest(
        request,
        responseStatusCode,
        responseHeaders,
        remixContext,
      )
    : handleBrowserRequest(
        request,
        responseStatusCode,
        responseHeaders,
        remixContext,
      );
export default handleRequest;

const handleBotRequest = (
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  remixContext: EntryContext,
) =>
  new Promise((resolve, reject) => {
    let didError = false;
    const emotionCache = createEmotionCache({ key: 'css' });

    const { pipe, abort } = renderToPipeableStream(
      <EmotionCacheProvider value={emotionCache}>
        <RemixServer context={remixContext} url={request.url} />
      </EmotionCacheProvider>,
      {
        onAllReady: () => {
          const reactBody = new PassThrough();
          const emotionServer = createEmotionServer(emotionCache);

          const bodyWithStyles = emotionServer.renderStylesToNodeStream();
          reactBody.pipe(bodyWithStyles);

          responseHeaders.set('Content-Type', 'text/html');

          const readableStream = new ReadableStream({
            start(controller) {
              bodyWithStyles.on('data', (chunk) => controller.enqueue(chunk));
              bodyWithStyles.on('end', () => controller.close());
              bodyWithStyles.on('error', (err) => controller.error(err));
            },
          });

          resolve(
            new Response(readableStream, {
              headers: responseHeaders,
              status: didError ? 500 : responseStatusCode,
            }),
          );

          pipe(reactBody);
        },
        onShellError: (error: unknown) => {
          reject(error);
        },
        onError: (error: unknown) => {
          didError = true;
          console.error(error);
        },
      },
    );

    setTimeout(abort, ABORT_DELAY);
  });

const handleBrowserRequest = (
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  remixContext: EntryContext,
) =>
  new Promise((resolve, reject) => {
    let didError = false;
    const emotionCache = createEmotionCache({ key: 'css' });

    const { pipe, abort } = renderToPipeableStream(
      <EmotionCacheProvider value={emotionCache}>
        <RemixServer context={remixContext} url={request.url} />
      </EmotionCacheProvider>,
      {
        onShellReady: () => {
          const reactBody = new PassThrough();
          const emotionServer = createEmotionServer(emotionCache);

          const bodyWithStyles = emotionServer.renderStylesToNodeStream();
          reactBody.pipe(bodyWithStyles);

          responseHeaders.set('Content-Type', 'text/html');

          const readableStream = new ReadableStream({
            start(controller) {
              bodyWithStyles.on('data', (chunk) => controller.enqueue(chunk));
              bodyWithStyles.on('end', () => controller.close());
              bodyWithStyles.on('error', (err) => controller.error(err));
            },
          });

          resolve(
            new Response(readableStream, {
              headers: responseHeaders,
              status: didError ? 500 : responseStatusCode,
            }),
          );

          pipe(reactBody);
        },
        onShellError: (error: unknown) => {
          reject(error);
        },
        onError: (error: unknown) => {
          didError = true;
          console.error(error);
        },
      },
    );

    setTimeout(abort, ABORT_DELAY);
  });
