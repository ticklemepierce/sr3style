import { json } from '@remix-run/node';
import { prisma } from '../src/services/db.server';

export const action = async ({ request }: { request: Request }) => {
  const { letter, setType, set } = await request.json();

  if (!setType || !set) {
    return json({ error: 'Missing required parameters' }, { status: 400 });
  }

  try {
    if (letter) {
      const letterPair = `${set}${letter}`;

      // Remove a single letterPair
      // TODO remove inverse
      await prisma.sets.delete({
        where: {
          letterPair_setType: {
            letterPair,
            setType,
          },
        },
      });
      return json({ success: true, message: `Removed pair: ${letterPair}` });
    } else {
      // Remove all pairs in the set with a single query
      // TODO remove inverse
      await prisma.sets.deleteMany({
        where: {
          letterPair: {
            startsWith: set,
          },
          setType,
        },
      });
      return json({ success: true, message: `Removed set: ${set}` });
    }
  } catch (error) {
    console.error('Error in remove API:', error);
    return json({ error: 'Failed to remove items' }, { status: 500 });
  }
};
