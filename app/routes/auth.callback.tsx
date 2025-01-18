import type { LoaderFunction } from '@remix-run/node';
import { useEffect } from 'react';
import { em } from '~/src/services/db.server';
import { redirect } from '@remix-run/node';

import { commitSession, getSession } from '~/src/services/session.server';
import { User } from '~/entities/user.entity';
import { WCA_ORIGIN } from '~/src/utils/constants';

export const loader: LoaderFunction = async ({ request }) => {
  const { searchParams } = new URL(request.url);

  if (!searchParams.size) {
    return null;
  }

  const accessToken = searchParams.get('access_token');

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
  await forkedEm.persist(newUser);
  await forkedEm.flush();

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
