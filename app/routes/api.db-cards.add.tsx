import { setTypeSpeffzMap } from '~/src/utils/constants';
import { createEmptyCard } from 'ts-fsrs';
import { RecordLogItemMap, SetType } from '~/src/types';
import { userRepo } from '~/src/services/db.server';
import { addSubset, addSet } from '~/src/utils/db';
import { getSession } from '~/src/services/session.server';
import { data } from '@remix-run/node';

type RequestPayload = {
  subSet?: string;
  setType: SetType;
  set: string;
};

// TODO add inverse
export const action = async ({ request }: { request: Request }) => {
  const { subSet, setType, set }: RequestPayload = await request.json();
  const session = await getSession(request.headers.get('Cookie'));

  const user = session.get('user');
  // TODO better validation
  if (!setType || !set || !user) {
    return data({ error: 'Missing required parameters' }, { status: 400 });
  }

  try {
    if (subSet) {
      const caseId = `${set}${subSet}`;

      const card = createEmptyCard();

      await addSubset({
        caseId,
        setType,
        card,
        user: await userRepo.findOneOrFail({ wcaId: user.wca_id }),
      });

      return {
        success: true,
        message: `created ${caseId}`,
        card,
      };
    } else {
      const recordLogItemMap: RecordLogItemMap = setTypeSpeffzMap[setType][
        set
      ].reduce(
        (acc, subSet) => ({
          ...acc,
          [`${set}${subSet}`]: {
            card: createEmptyCard(),
          },
        }),
        {},
      );

      await addSet({
        setType,
        recordLogItemMap,
        user: await userRepo.findOneOrFail({ wcaId: user.wca_id }),
      });

      return {
        success: true,
        message: `created set: ${set}`,
        recordLogItemMap,
      };
    }
  } catch (error) {
    console.error('Error in add API:', error);
    return data({ error: 'Failed to add items' }, { status: 500 });
  }
};
