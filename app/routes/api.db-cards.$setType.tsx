import { json } from '@remix-run/node';
import { prisma } from '../src/services/db.server';
import { Cards } from '~/src/types';
import { Params, useParams } from '@remix-run/react';

export const loader = async ({ request }: { request: Request }) => {
  const { setType } = useParams<keyof Params>() as Params;

  try {
    const sets = await prisma.sets.findMany({ where: { setType } });

    const cards = sets.reduce((acc, { letterPair, card }) => {
      acc[letterPair] = { card: JSON.parse(card) };
      return acc;
    }, {} as Cards);

    return json(cards);
  } catch (error) {
    console.error('Error fetching cards:', error);
    return json({ error: 'Failed to fetch cards' }, { status: 500 });
  }
};
