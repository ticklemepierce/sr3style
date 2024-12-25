import { data } from '@remix-run/node';
import { SetType } from '~/src/types';
import { getSession } from '~/src/services/session.server';
import { updateCase } from '~/src/utils/db';
import { userRepo } from '~/src/services/db.server';
import { RecordLogItem } from 'ts-fsrs';

type RequestPayload = {
  caseId: string;
  setType: SetType;
  recordLogItem: RecordLogItem;
};

export const action = async ({ request }: { request: Request }) => {
  const { caseId, setType, recordLogItem }: RequestPayload =
    await request.json();

  const session = await getSession(request.headers.get('Cookie'));

  const user = session.get('user');

  // TODO better validation
  if (!setType || !caseId || !user) {
    return data({ error: 'Missing required parameters' }, { status: 400 });
  }
  try {
    await updateCase({
      caseId,
      setType,
      recordLogItem,
      user: await userRepo.findOneOrFail({ wcaId: user.wca_id }),
    });

    return {
      success: true,
      message: `updated ${caseId}`,
    };
  } catch (error) {
    console.error('Error in update API:', error);
    return data({ error: 'Failed to update items' }, { status: 500 });
  }
};
