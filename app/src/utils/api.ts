import {
  AddOrRemoveSet,
  AddOrRemoveSubset,
  PostLearningCasesPayload,
  DeleteLearningCasesPayload,
  PatchLearningCasesPayload,
} from '../types';

export const removeSubset: AddOrRemoveSubset = async ({
  setType,
  set,
  subSet,
}) =>
  fetch(`/api/db-cards/remove`, {
    method: 'POST',
    body: JSON.stringify({ subSet, setType, set }),
    headers: { 'Content-Type': 'application/json' },
  });

export const removeSet: AddOrRemoveSet = async ({ setType, set }) =>
  fetch(`/api/db-cards/remove`, {
    method: 'POST',
    body: JSON.stringify({ setType, set }),
    headers: { 'Content-Type': 'application/json' },
  });

export const postLearningCases = async ({
  learningCasesToAdd,
  setType,
}: PostLearningCasesPayload) =>
  fetch(`/api/learning-cases`, {
    method: 'POST',
    body: JSON.stringify({ setType, learningCasesToAdd }),
    headers: { 'Content-Type': 'application/json' },
  });

export const deleteLearningCases = async ({
  learningCasesToRemove,
  setType,
}: DeleteLearningCasesPayload) =>
  fetch(`/api/learning-cases`, {
    method: 'DELETE',
    body: JSON.stringify({ setType, learningCasesToRemove }),
    headers: { 'Content-Type': 'application/json' },
  });

export const patchLearningCase = async ({
  recordLogItem,
  caseId,
  setType,
}: PatchLearningCasesPayload) =>
  fetch(`/api/learning-cases`, {
    method: 'PATCH',
    body: JSON.stringify({ setType, recordLogItem, caseId }),
    headers: { 'Content-Type': 'application/json' },
  });
