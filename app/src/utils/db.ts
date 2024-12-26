import { LearningCase } from '~/entities/learning-case.entity';
import { RecordLogItem } from 'ts-fsrs';
import {
  DeleteLearningCasesPayload,
  PostLearningCasesPayload,
  RecordLogItemMap,
  SetType,
  Settings,
} from '../types';
import { em } from '~/src/services/db.server';
import { EntityManager } from '@mikro-orm/core';
import { User } from '~/entities/user.entity';

const createNewLearningCase = async (
  forkedEm: EntityManager,
  newLearningCaseVals: Omit<LearningCase, 'id'>,
) => {
  const newLearningCase = new LearningCase(newLearningCaseVals);

  await forkedEm.persist(newLearningCase);

  return newLearningCase;
};

export const removeLearningCases = async ({
  learningCasesToRemove,
  setType,
  user,
}: DeleteLearningCasesPayload & {
  user: User;
}) => {
  const forkedEm = em.fork();
  const dbLearningCases = await forkedEm.find(LearningCase, {
    user,
    setType,
    caseId: { $in: learningCasesToRemove },
  });

  forkedEm.remove(dbLearningCases);

  await forkedEm.flush();
};

export const addLearningCases = async ({
  setType,
  learningCasesToAdd,
  user,
}: PostLearningCasesPayload & { user: User }) => {
  const forkedEm = em.fork();
  const addedLearningCases = await Promise.all(
    Object.entries(learningCasesToAdd[setType]).map(
      async ([caseId, { card, log }]) =>
        createNewLearningCase(forkedEm, {
          caseId,
          setType,
          card,
          log,
          user,
        }),
    ),
  );

  await forkedEm.flush();

  return addedLearningCases;
};

export const addSubset = async (props: Omit<LearningCase, 'id'>) => {
  const forkedEm = em.fork();
  const newSet = createNewLearningCase(forkedEm, props);

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
      return createNewLearningCase(forkedEm, {
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
