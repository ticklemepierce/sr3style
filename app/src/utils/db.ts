import { LearningCase } from '~/entities/learning-case.entity';
import {
  DeleteLearningCasesPayload,
  PatchLearningCasesPayload,
  PostLearningCasesPayload,
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

export const updateLearningCase = async ({
  setType,
  recordLogItem,
  caseId,
  user,
}: PatchLearningCasesPayload & { user: User }) => {
  const forkedEm = em.fork();

  const learningCase = await forkedEm.findOneOrFail(LearningCase, {
    caseId,
    setType,
    user,
  });

  learningCase.card = recordLogItem.card;
  learningCase.log = recordLogItem.log;

  await forkedEm.flush();

  return learningCase;
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
