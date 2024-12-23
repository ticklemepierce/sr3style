import { LearningSet } from '~/entities/set.entity';
import { Card as FsrsCard } from 'ts-fsrs';
import { Card, SetType } from '../types';
import { em } from '~/src/services/db.server';
import { EntityManager } from '@mikro-orm/core';
import { User } from '~/entities/user.entity';

const createNewSet = async (
  forkedEm: EntityManager,
  { letterPair, setType, fsrsCard, user }: Omit<LearningSet, 'id'>,
) => {
  const newSet = new LearningSet();
  newSet.letterPair = letterPair;
  newSet.setType = setType;
  newSet.fsrsCard = fsrsCard;
  newSet.user = user;

  // Persist and flush directly within the forked EntityManager
  await forkedEm.persist(newSet);

  return newSet;
};

export const addPair = async (props: Omit<LearningSet, 'id'>) => {
  const forkedEm = em.fork();
  const newSet = createNewSet(forkedEm, props);

  await forkedEm.flush();

  return newSet;
};

export const addSet = async ({
  setType,
  cards,
  user,
}: {
  setType: SetType;
  cards: { letterPair: string; fsrsCard: FsrsCard }[];
  user: User;
}) => {
  const forkedEm = em.fork();

  const newSets = await Promise.all(
    cards.map(({ fsrsCard, letterPair }) =>
      createNewSet(forkedEm, {
        letterPair,
        setType,
        fsrsCard,
        user,
      }),
    ),
  );
  await forkedEm.flush();

  return newSets;
};

export const updatePair = async ({
  letterPair,
  setType,
  card,
  user,
}: {
  letterPair: string;
  setType: SetType;
  card: Card;
  user: User;
}) => {
  const forkedEm = em.fork();

  const entity = await forkedEm.findOne(LearningSet, {
    letterPair,
    setType,
    user,
  });

  if (!entity) {
    throw new Error('Entity not found');
  }

  console.log(card);

  // Apply updates
  Object.assign(entity, {
    ...entity,
    fsrsCard: card.fsrsCard,
    log: card.log,
  });

  // Save changes
  await forkedEm.flush();

  // const forkedEm = em.fork();

  // const newSets = await Promise.all(
  //   cards.map(({ fsrsCard, letterPair }) =>
  //     createNewSet(forkedEm, {
  //       letterPair,
  //       setType,
  //       fsrsCard,
  //       user,
  //     }),
  //   ),
  // );
  // await forkedEm.flush();

  return entity;
};
