import type { LoaderFunction } from '@remix-run/node';
import { useEffect } from 'react';
import { em } from '~/src/services/db.server';
import { redirect } from '@remix-run/node';

import { commitSession, getSession } from '~/src/services/session.server';
import { User } from '~/entities/user.entity';

const WCA_ORIGIN = 'https://api.worldcubeassociation.org';

export const loader: LoaderFunction = async ({ request }) => {
  const { searchParams } = new URL(request.url);

  if (!searchParams.size) {
    return null;
  }

  const accessToken = searchParams.get('access_token');
  // const expiresIn = searchParams.get('expires_in');

  const res = await fetch(
    `${WCA_ORIGIN}/me`,
    Object.assign(
      {},
      {
        headers: new Headers({
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        }),
      },
    ),
  );

  const data = await res.json();

  const session = await getSession(request.headers.get('Cookie'));

  session.set('accessToken', accessToken);
  session.set('user', data.me);

  const forkedEm = em.fork();

  const newUser = new User({ wcaId: data.me.wca_id });
  console.log({ newUser });
  // Persist and flush directly within the forked EntityManager
  await forkedEm.persist(newUser);

  await forkedEm.flush();

  // return json({ user });

  // const data = { error: session.get("error") };

  // const expiresIn = searchParams.get('expires_in');

  // const expiresInAdjusted = expiresIn ? parseInt(expiresIn, 10) - 15 : undefined;

  return redirect('/', {
    headers: {
      'Set-Cookie': await commitSession(session),
    },
  });
};

export default function Users() {
  useEffect(() => {
    const href = window.location.href;
    if (href.includes('#')) {
      window.location.href = href.replace('#', '?');
    }
  });
}
