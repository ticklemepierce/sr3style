import { data } from '@remix-run/node';
import { em } from '../src/services/db.server';
import { User } from '~/entities/user.entity';
import { getSession } from '~/src/services/session.server';
import { LearningCase } from '~/entities/learning-case.entity';

export const action = async ({ request }: { request: Request }) => {
  const { subSet, setType, set } = await request.json();
  const session = await getSession(request.headers.get('Cookie'));

  const user = session.get('user');

  // TODO better validation
  if (!setType || !set || !user) {
    return data({ error: 'Missing required parameters' }, { status: 400 });
  }

  try {
    if (subSet) {
      const caseId = `${set}${subSet}`;

      const forkedEm = em.fork();
      const dbUser = await forkedEm.findOne(User, { wcaId: user.wca_id });
      const dbLearningCase = await forkedEm.findOne(LearningCase, {
        user: dbUser,
        caseId,
      });

      // TODO remove inverse
      if (dbLearningCase) {
        forkedEm.remove(dbLearningCase);
        await forkedEm.flush();
      }

      return { success: true, message: `Removed ${caseId}` };
    } else {
      const forkedEm = em.fork();
      const dbUser = await forkedEm.findOne(User, { wcaId: user.wca_id });
      const dbLearningCases = await forkedEm.find(LearningCase, {
        user: dbUser,
        caseId: { $like: `${set}%` },
      });

      // TODO remove inverses
      if (dbLearningCases) {
        forkedEm.remove(dbLearningCases);
        await forkedEm.flush();
      }
      return { success: true, message: `Removed set: ${set}` };
    }
  } catch (error) {
    console.error('Error in remove API:', error);
    return data({ error: 'Failed to remove items' }, { status: 500 });
  }
};
