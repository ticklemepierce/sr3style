/// <reference types="@remix-run/dev" />
/// <reference types="@remix-run/node/globals" />

import 'ts-fsrs';

declare module 'ts-fsrs' {
  interface RecordLogItem {
    card: Card;
    log?: ReviewLog;
  }
}
