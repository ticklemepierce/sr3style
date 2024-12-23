import { data } from '@remix-run/node';
import { Card, SetType } from '~/src/types';
import { getSession } from '~/src/services/session.server';
import { updatePair } from '~/src/utils/db';
import { userRepo } from '~/src/services/db.server';

type RequestPayload = {
  letterPair: string;
  setType: SetType;
  card: Card;
};

export const action = async ({ request }: { request: Request }) => {
  const { letterPair, setType, card }: RequestPayload = await request.json();

  const session = await getSession(request.headers.get('Cookie'));

  const user = session.get('user');

  // TODO better validation
  if (!setType || !letterPair || !user) {
    return data({ error: 'Missing required parameters' }, { status: 400 });
  }
  try {
    await updatePair({
      letterPair,
      setType,
      card,
      user: await userRepo.findOneOrFail({ wcaId: user.wca_id }),
    });

    return {
      success: true,
      message: `updated letter pair: ${letterPair}`,
    };
  } catch (error) {
    console.error('Error in update API:', error);
    return data({ error: 'Failed to update items' }, { status: 500 });
  }
};
