// import type { LoaderFunction } from "@remix-run/node";
// import { authenticator } from "~/services/auth.server";

// export const loader: LoaderFunction = ({ request }) => {
//   return authenticator.authenticate("wca", request, {
//     successRedirect: "/",
//     failureRedirect: "/401",
//   });
// };

import type { ActionFunction } from '@remix-run/node';
import { redirect } from '@remix-run/node';
import { destroySession, getSession } from '~/src/services/session.server';

export const action: ActionFunction = async ({ request }) => {
  const session = await getSession(request.headers.get('Cookie'));

  return redirect('/', {
    headers: {
      // use await on session functions
      'Set-Cookie': await destroySession(session),
    },
  });
};
