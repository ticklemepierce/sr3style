import {
  DeleteLearningCasesPayload,
  PatchLearningCasesPayload,
  PostLearningCasesPayload,
  SetType,
} from '~/src/types';
import { userRepo } from '~/src/services/db.server';
import {
  addLearningCases,
  removeLearningCases,
  updateLearningCase,
} from '~/src/utils/db';
import { getSession } from '~/src/services/session.server';
import { z, ZodError } from 'zod';

const learningCasesSchema = z
  .object({
    edges: z.any().optional(),
    corners: z.any().optional(),
    parities: z.any().optional(),
  })
  .transform((data) => ({
    edges: data.edges || {},
    corners: data.corners || {},
    parities: data.parities || {},
  }));
const postSchema = z.object({
  setType: z.nativeEnum(SetType),
  learningCasesToAdd: learningCasesSchema,
});
const patchSchema = z.object({
  setType: z.nativeEnum(SetType),
  caseId: z.string(),
  recordLogItem: z.object({
    card: z.object({
      due: z.string(),
      stability: z.number(),
      difficulty: z.number(),
      elapsed_days: z.number(),
      scheduled_days: z.number(),
      reps: z.number(),
      lapses: z.number(),
      state: z.number(),
      last_review: z.string().optional(),
    }),
    log: z.any(),
  }),
});
const deleteSchema = z.object({
  setType: z.nativeEnum(SetType),
  learningCasesToRemove: z.array(z.string()),
});

type Error = {
  errMessage: string;
  [key: string]: unknown;
};

const error = (error: Error, init?: ResponseInit) => {
  const jsonData = JSON.stringify(error);

  return new Response(jsonData, init);
};

export const action = async ({ request }: { request: Request }) => {
  try {
    const session = await getSession(request.headers.get('Cookie'));

    const sessionUser = session.get('user');
    const user = await userRepo.findOneOrFail({ wcaId: sessionUser.wca_id });

    const requestBody = await request.json();

    switch (request.method) {
      case 'POST': {
        const { setType, learningCasesToAdd }: PostLearningCasesPayload =
          postSchema.parse(requestBody);
        addLearningCases({
          setType,
          learningCasesToAdd,
          user,
        });
        return { message: 'Added successfully!' };
      }
      case 'PATCH': {
        const { setType, recordLogItem, caseId }: PatchLearningCasesPayload =
          patchSchema.parse(requestBody);
        updateLearningCase({
          setType,
          recordLogItem,
          caseId,
          user,
        });
        return { message: 'Updated successfully!' };
      }
      case 'DELETE': {
        const { setType, learningCasesToRemove }: DeleteLearningCasesPayload =
          deleteSchema.parse(requestBody);

        removeLearningCases({ setType, learningCasesToRemove, user });
        return { message: 'Removed successfully!' };
      }
      default: {
        return error({ errMessage: 'Unknown request method' }, { status: 405 });
      }
    }
  } catch (e) {
    if (e instanceof ZodError) {
      return error(
        { errMessage: 'Invalid request data', issues: e.flatten() },
        { status: 400 },
      );
    }

    return error({ errMessage: 'Something went wrong' }, { status: 500 });
  }
};
