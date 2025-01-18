import type { ActionFunction } from '@remix-run/node';
import { redirect } from '@remix-run/node';
import { WCA_OAUTH_ORIGIN } from '~/src/utils/constants';

export const action: ActionFunction = async ({ request }) => {
  const { origin } = new URL(request.url);
  const params = new URLSearchParams({
    client_id: process.env.WCA_OAUTH_CLIENT_ID!,
    response_type: 'token',
    redirect_uri: `${origin}/auth/callback`,
    scope: 'public',
    state: 'foobar',
  });

  return redirect(`${WCA_OAUTH_ORIGIN}/oauth/authorize?${params.toString()}`);
};
