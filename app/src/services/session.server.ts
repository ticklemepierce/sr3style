import { createCookieSessionStorage } from '@remix-run/node';
import { UserData } from '../types';
import { em } from '~/src/services/db.server';
import { User } from '~/entities/user.entity';
import { DEFAULT_LEARNING_CASES } from '../utils/constants';

export const sessionStorage = createCookieSessionStorage({
  cookie: {
    name: '_session',
    sameSite: 'lax',
    path: '/',
    httpOnly: true,
    secrets: [process.env.SESSION_SECRET!],
    secure: process.env.NODE_ENV === 'production',
  },
});

export const { getSession, commitSession, destroySession } = sessionStorage;

export const getUserData = async (
  request: Request,
): Promise<UserData | undefined> => {
  const session = await getSession(request.headers.get('Cookie'));

  const user = session.get('user');
  if (!user) return;

  const forkedEm = em.fork();
  const dbUser = await forkedEm.findOne(
    User,
    { wcaId: user.wca_id },
    { populate: ['*'] },
  );

  if (!dbUser) return;

  const isPremium = dbUser.isComped;
  if (!isPremium) return { user, isPremium };

  console.log(dbUser);

  const learningCases = dbUser.learningCases.reduce((acc, set) => {
    if (!acc[set.setType]) {
      acc[set.setType] = {};
    }

    acc[set.setType][set.caseId] = {
      card: set.card,
      log: set.log,
    };

    return acc;
  }, DEFAULT_LEARNING_CASES);

  console.log({ learningCases });

  return {
    user,
    learningCases,
    settings: dbUser.settings,
    isPremium,
  };
};
