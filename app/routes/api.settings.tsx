import { userRepo } from '~/src/services/db.server';
import { updateUserSettings } from '~/src/utils/db';
import { getSession } from '~/src/services/session.server';
import { data } from '@remix-run/node';
import { z, ZodError } from 'zod';
import { Face, Color, CornerPiece, EdgePiece } from '~/src/types';

const settingsSchema = z.object({
  updatedSettings: z.object({
    autoAddInverse: z.boolean(),
    letterScheme: z
      .record(z.nativeEnum(CornerPiece).or(z.nativeEnum(EdgePiece)), z.string())
      .transform((x) => x as typeof x extends Partial<infer T> ? T : never),
    orientation: z
      .record(z.nativeEnum(Face), z.nativeEnum(Color))
      .transform((x) => x as typeof x extends Partial<infer T> ? T : never),
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
