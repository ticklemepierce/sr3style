import { userRepo } from '~/src/services/db.server';
import { updateUserSettings } from '~/src/utils/db';
import { getSession } from '~/src/services/session.server';
import { data } from '@remix-run/node';
import { z, ZodError } from 'zod';

const settingsSchema = z.object({
  updatedSettings: z.object({
    autoAddInverse: z.boolean(),
  }),
});

export const action = async ({ request }: { request: Request }) => {
  try {
    const requestBody = await request.json();

    const { updatedSettings } = settingsSchema.parse(requestBody);
    const session = await getSession(request.headers.get('Cookie'));

    const user = session.get('user');

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
    if (error instanceof ZodError) {
      return data(
        { error: 'Invalid request data', issues: error.flatten() },
        { status: 400 },
      );
    }
    return data({ error: 'Something went wrong' }, { status: 500 });
  }
};
