import { LearningCase } from '~/entities/learning-case.entity';
import { RecordLogItem } from 'ts-fsrs';
import { RecordLogItemMap, SetType, Settings } from '../types';
import { em } from '~/src/services/db.server';
import { EntityManager } from '@mikro-orm/core';
import { User } from '~/entities/user.entity';

const createNewSet = async (
  forkedEm: EntityManager,
  newSetVals: Omit<LearningCase, 'id'>,
) => {
  const newSet = new LearningCase(newSetVals);

  await forkedEm.persist(newSet);

  return newSet;
};

export const addSubset = async (props: Omit<LearningCase, 'id'>) => {
  const forkedEm = em.fork();
  const newSet = createNewSet(forkedEm, props);

  await forkedEm.flush();

  return newSet;
};

export const addSet = async ({
  setType,
  recordLogItemMap,
  user,
}: {
  setType: SetType;
  recordLogItemMap: RecordLogItemMap;
  user: User;
}) => {
  const forkedEm = em.fork();

  const newSets = await Promise.all(
    Object.entries(recordLogItemMap).map(([caseId, recordLogItem]) => {
      console.log({ recordLogItem });
      return createNewSet(forkedEm, {
        caseId,
        setType,
        ...recordLogItem,
        user,
      });
    }),
  );
  await forkedEm.flush();

  return newSets;
};

export const updateCase = async ({
  caseId,
  setType,
  recordLogItem,
  user,
}: {
  caseId: string;
  setType: SetType;
  recordLogItem: RecordLogItem;
  user: User;
}) => {
  const forkedEm = em.fork();

  const entity = await forkedEm.findOne(LearningCase, {
    caseId,
    setType,
    user,
  });

  if (!entity) {
    throw new Error('Entity not found');
  }

  Object.assign(entity, {
    ...entity,
    ...recordLogItem,
  });

  await forkedEm.flush();

  return entity;
};

export const updateUserSettings = async ({
  updatedSettings,
  user,
}: {
  updatedSettings: Settings;
  user: User;
}) => {
  const forkedEm = em.fork();

  user.settings = updatedSettings;

  await forkedEm.persistAndFlush(user);

  return user.settings;
};
