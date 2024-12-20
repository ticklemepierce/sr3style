import { json } from '@remix-run/node';
import { prisma } from '../src/services/db.server';
import { setTypeSpeffzMap } from '~/src/utils/constants';
import { createEmptyCard } from 'ts-fsrs';
import { SetType } from '~/src/types';
import { getOrm } from '~/src/services/db.server';
import { User } from '~/entities/user.entity';
import { LearningSet } from '~/entities/set.entity';
import { getSession } from '~/src/services/session.server';

type RequestPayload = {
  letter?: string;
  setType: SetType;
  set: string;
};

// TODO add inverse
export const action = async ({ request }: { request: Request }) => {
  const { letter, setType, set }: RequestPayload = await request.json();
  const session = await getSession(request.headers.get('Cookie'));

  const user = session.get('user');
  // TODO better validation
  if (!setType || !set) {
    return json({ error: 'Missing required parameters' }, { status: 400 });
  }

  try {
    if (letter) {
      const letterPair = `${set}${letter}`;

      // TODO remove inverse
      const card = JSON.stringify(createEmptyCard());

      // TODO get this logic into db.server
      const { em } = await getOrm();
      // const setRepo = em.getRepository(Set);
      const userRepo = em.fork().getRepository(User);

      // TODO make a helper somewhere
      const newSet = new LearningSet();
      newSet.letterPair = letterPair;
      newSet.setType = setType;
      newSet.fsrsCard = card;
      newSet.user = await userRepo.findOne({ wcaId: user.wca_id });

      const forkedEm = em.fork();

      await forkedEm.persist(newSet).flush();

      // await prisma.sets.upsert({
      //   where: {
      //     letterPair_setType: {
      //       letterPair,
      //       setType,
      //     },
      //   },
      //   update: {},
      //   create: {
      //     letterPair,
      //     setType,
      //     card,
      //   },
      // });

      return json({
        success: true,
        message: `created letter pair: ${letterPair}`,
        card,
      });
    } else {
      const created = await prisma.sets.createManyAndReturn({
        data: setTypeSpeffzMap[setType][set].map((letter: string) => ({
          letterPair: `${set}${letter}`,
          card: JSON.stringify(createEmptyCard()),
          setType,
        })),
        skipDuplicates: true, // Avoid errors if some records already exist
      });
      const cards = created.reduce(
        (acc, { letterPair, card }) => {
          acc[letterPair] = { card };
          return acc;
        },
        {} as Record<string, object>,
      );

      return json({ success: true, message: `created set: ${set}`, cards });
    }
  } catch (error) {
    console.error('Error in add API:', error);
    return json({ error: 'Failed to add items' }, { status: 500 });
  }
};
