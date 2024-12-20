import { json } from '@remix-run/node';
import { prisma } from '../src/services/db.server';
import { SetType } from '~/src/types';

type RequestPayload = {
  letterPair: string;
  setType: SetType;
  card: {
    card: string;
    log: string;
  };
};

export const action = async ({ request }: { request: Request }) => {
  const {
    letterPair,
    setType,
    card: payloadCard,
  }: RequestPayload = await request.json();

  const { card, log } = payloadCard;

  // TODO better validation
  if (!setType || !letterPair) {
    return json({ error: 'Missing required parameters' }, { status: 400 });
  }

  console.log({ card });

  try {
    await prisma.sets.update({
      where: {
        letterPair_setType: {
          letterPair,
          setType,
        },
      },
      data: { log },
    });

    return json({
      success: true,
      message: `updated letter pair: ${letterPair}`,
    });
  } catch (error) {
    console.error('Error in update API:', error);
    return json({ error: 'Failed to update items' }, { status: 500 });
  }
};
