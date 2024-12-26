import {
  DeleteLearningCasesPayload,
  PostLearningCasesPayload,
} from '~/src/types';
import { userRepo } from '~/src/services/db.server';
import { addLearningCases, removeLearningCases } from '~/src/utils/db';
import { getSession } from '~/src/services/session.server';
import { data } from '@remix-run/node';
import { z, ZodError } from 'zod';

const learningCasesSchema = z
  .object({
    edges: z.any().optional(),
    corners: z.any().optional(),
  })
  .transform((data) => ({
    edges: data.edges || {}, // Set default
    corners: data.corners || {}, // Set default
  }));
const postPatchSchema = z.object({
  setType: z.enum(['edges', 'corners']),
  learningCasesToAdd: learningCasesSchema, // Adjust the schema to match `learningCasesToAdd` structure
});
const deleteSchema = z.object({
  setType: z.enum(['edges', 'corners']),
  learningCasesToRemove: z.array(z.string()),
});

// TODO add inverse
export const action = async ({ request }: { request: Request }) => {
  try {
    const session = await getSession(request.headers.get('Cookie'));

    const sessionUser = session.get('user');
    const user = await userRepo.findOneOrFail({ wcaId: sessionUser.wca_id });

    // Parse and validate the request body
    const requestBody = await request.json();

    // try {
    //   const requestBody = await request.json();

    //   if (method === 'POST') {
    //     validatedData = postSchema.parse(requestBody);
    //   } else if (method === 'PATCH') {
    //     validatedData = patchSchema.parse(requestBody);
    //   }
    // } catch (error) {
    //   console.error('Validation error:', error);
    //   return data({ error: 'Invalid request payload' }, { status: 400 });
    // }

    switch (request.method) {
      case 'POST': {
        const { setType, learningCasesToAdd }: PostLearningCasesPayload =
          postPatchSchema.parse(requestBody);
        addLearningCases({
          setType,
          learningCasesToAdd,
          user,
        });
      }
      // TODO patch
      // case 'PATCH': {
      //   const { setType, learningCasesToAdd }: PostLearningCasesPayload =
      //     await request.json();
      //   // TODO better validation
      //   if (!setType || !learningCasesToAdd || !user) {
      //     return data(
      //       { error: 'Missing required parameters' },
      //       { status: 400 },
      //     );
      //   }
      // }
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
      // Handle validation errors
      return data(
        { error: 'Invalid request data', issues: error.flatten() },
        { status: 400 },
      );
    }

    // Handle other unexpected errors
    return data({ error: 'Something went wrong' }, { status: 500 });
  }
};
