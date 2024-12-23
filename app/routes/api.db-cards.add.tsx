import { setTypeSpeffzMap } from '~/src/utils/constants';
import { createEmptyCard } from 'ts-fsrs';
import { SetType } from '~/src/types';
import { userRepo } from '~/src/services/db.server';
import { addPair, addSet } from '~/src/utils/db';
import { getSession } from '~/src/services/session.server';
import { data } from '@remix-run/node';

type RequestPayload = {
  letter?: string;
  setType: SetType;
  set: string;
};

// TODO remove learningSet
// TODO add inverse
export const action = async ({ request }: { request: Request }) => {
  const { letter, setType, set }: RequestPayload = await request.json();
  const session = await getSession(request.headers.get('Cookie'));

  const user = session.get('user');
  // TODO better validation
  if (!setType || !set || !user) {
    return data({ error: 'Missing required parameters' }, { status: 400 });
  }

  try {
    if (letter) {
      const letterPair = `${set}${letter}`;

      const card = createEmptyCard();

      await addPair({
        letterPair,
        setType,
        fsrsCard: card,
        user: await userRepo.findOneOrFail({ wcaId: user.wca_id }),
      });

      return {
        success: true,
        message: `created letter pair: ${letterPair}`,
        card,
      };
    } else {
      const cards = setTypeSpeffzMap[setType][set].map((letter: string) => ({
        letterPair: `${set}${letter}`,
        fsrsCard: createEmptyCard(),
      }));

      await addSet({
        setType,
        cards,
        user: await userRepo.findOneOrFail({ wcaId: user.wca_id }),
      });

      return {
        success: true,
        message: `created set: ${set}`,
        cards: cards.reduce(
          (acc, { letterPair, fsrsCard }) => {
            acc[letterPair] = fsrsCard;
            return acc;
          },
          {} as Record<string, object>,
        ),
      };
    }
  } catch (error) {
    console.error('Error in add API:', error);
    return data({ error: 'Failed to add items' }, { status: 500 });
  }
};
