import { Settings } from '~/src/types';
import { userRepo } from '~/src/services/db.server';
import { updateUserSettings } from '~/src/utils/db';
import { getSession } from '~/src/services/session.server';
import { data } from '@remix-run/node';

type RequestPayload = {
  updatedSettings: Settings;
};

export const action = async ({ request }: { request: Request }) => {
  const { updatedSettings }: RequestPayload = await request.json();
  const session = await getSession(request.headers.get('Cookie'));

  const user = session.get('user');
  // TODO better validation
  if (!updatedSettings || !user) {
    return data({ error: 'Missing required parameters' }, { status: 400 });
  }

  try {
    const newSettings = await updateUserSettings({
      updatedSettings,
      user: await userRepo.findOneOrFail({ wcaId: user.wca_id }),
    });

    return {
      success: true,
      message: `updated settings`,
      settings: newSettings,
    };
  } catch (error) {
    console.error('Error in add API:', error);
    return data({ error: 'Failed to add items' }, { status: 500 });
  }
};
