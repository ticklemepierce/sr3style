import { data } from '@remix-run/node';
import { em } from '../src/services/db.server';
import { User } from '~/entities/user.entity';
import { getSession } from '~/src/services/session.server';
import { LearningSet } from '~/entities/set.entity';

export const action = async ({ request }: { request: Request }) => {
  const { letter, setType, set } = await request.json();
  const session = await getSession(request.headers.get('Cookie'));

  const user = session.get('user');

  // TODO better validation
  if (!setType || !set || !user) {
    return data({ error: 'Missing required parameters' }, { status: 400 });
  }

  try {
    if (letter) {
      const letterPair = `${set}${letter}`;

      const forkedEm = em.fork();
      const dbUser = await forkedEm.findOne(User, { wcaId: user.wca_id });
      const dbLearningSet = await forkedEm.findOne(LearningSet, {
        user: dbUser,
        letterPair,
      });

      // TODO remove inverse
      if (dbLearningSet) {
        forkedEm.remove(dbLearningSet);
        await forkedEm.flush();
      }

      return { success: true, message: `Removed pair: ${letterPair}` };
    } else {
      const forkedEm = em.fork();
      const dbUser = await forkedEm.findOne(User, { wcaId: user.wca_id });
      const dbLearningSets = await forkedEm.find(LearningSet, {
        user: dbUser,
        letterPair: { $like: `${set}%` },
      });

      // TODO remove inverses
      if (dbLearningSets) {
        forkedEm.remove(dbLearningSets);
        await forkedEm.flush();
      }
      return { success: true, message: `Removed set: ${set}` };
    }
  } catch (error) {
    console.error('Error in remove API:', error);
    return data({ error: 'Failed to remove items' }, { status: 500 });
  }
};
