import {
  PostLearningCasesPayload,
  DeleteLearningCasesPayload,
  PatchLearningCasesPayload,
} from '../types';

const fetchWithErrorHandling = async (url: string, options: RequestInit) => {
  const response = await fetch(url, options);

  // Check if the response is not OK and throw an error
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(
      errorData.message || `Error ${response.status}: ${response.statusText}`,
    );
  }

  // Return the parsed response (or the raw response if needed)
  return response.json();
};

export const postLearningCases = async ({
  learningCasesToAdd,
  setType,
}: PostLearningCasesPayload) =>
  fetchWithErrorHandling(`/api/learning-cases`, {
    method: 'POST',
    body: JSON.stringify({ setType, learningCasesToAdd }),
    headers: { 'Content-Type': 'application/json' },
  });

export const deleteLearningCases = async ({
  learningCasesToRemove,
  setType,
}: DeleteLearningCasesPayload) =>
  fetchWithErrorHandling(`/api/learning-cases`, {
    method: 'DELETE',
    body: JSON.stringify({ setType, learningCasesToRemove }),
    headers: { 'Content-Type': 'application/json' },
  });

export const patchLearningCase = async ({
  recordLogItem,
  caseId,
  setType,
}: PatchLearningCasesPayload) =>
  fetchWithErrorHandling(`/api/learning-cases`, {
    method: 'PATCH',
    body: JSON.stringify({ setType, recordLogItem, caseId }),
    headers: { 'Content-Type': 'application/json' },
  });
