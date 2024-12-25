// app/services/session.server.ts
import { createCookieSessionStorage } from '@remix-run/node';
import { UserData, LearningCases } from '../types';
import { em } from '~/src/services/db.server';
import { User } from '~/entities/user.entity';

export const sessionStorage = createCookieSessionStorage({
  cookie: {
    name: '_session',
    sameSite: 'lax', // this helps with CSRF
    path: '/', // remember to add this so the cookie will work in all routes
    httpOnly: true, // for security reasons, make this cookie http only
    secrets: ['s3cr3t'], // TODO replace this with an actual secret
    secure: process.env.NODE_ENV === 'production', // enable this in prod only
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

  const learningCases = dbUser.learningCases.reduce((acc, set) => {
    if (!acc[set.setType]) {
      acc[set.setType] = {};
    }

    acc[set.setType][set.caseId] = {
      card: set.card,
      log: set.log,
    };

    return acc;
  }, {} as LearningCases);

  return {
    user,
    learningCases,
    settings: dbUser.settings,
    isPremium: dbUser.isComped,
  };
};
