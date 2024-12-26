import {
  DeleteLearningCasesPayload,
  PatchLearningCasesPayload,
  PostLearningCasesPayload,
} from '~/src/types';
import { userRepo } from '~/src/services/db.server';
import {
  addLearningCases,
  removeLearningCases,
  updateLearningCase,
} from '~/src/utils/db';
import { getSession } from '~/src/services/session.server';
import { data } from '@remix-run/node';
import { z, ZodError } from 'zod';

const learningCasesSchema = z
  .object({
    edges: z.any().optional(),
    corners: z.any().optional(),
  })
  .transform((data) => ({
    edges: data.edges || {},
    corners: data.corners || {},
  }));
const postSchema = z.object({
  setType: z.enum(['edges', 'corners']),
  learningCasesToAdd: learningCasesSchema,
});
const patchSchema = z.object({
  setType: z.enum(['edges', 'corners']),
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
  setType: z.enum(['edges', 'corners']),
  learningCasesToRemove: z.array(z.string()),
});

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
      }
      case 'DELETE': {
        const { setType, learningCasesToRemove }: DeleteLearningCasesPayload =
          deleteSchema.parse(requestBody);

        removeLearningCases({ setType, learningCasesToRemove, user });
      }
      default: {
        return data({ error: 'Unknown request method' }, { status: 405 });
      }
    }
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
