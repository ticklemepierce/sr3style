import { useEffect, useState } from 'react';
import {
  AddOrRemoveSet,
  AddOrRemoveSubset,
  CardManager,
  DeleteLearningCasesPayload,
  LearningCases,
  SetType,
  UpdateCase,
  UserData,
} from '../types';
import { DEFAULT_LEARNING_CASES, setTypeSpeffzMap } from '../utils/constants';
import store from 'store2';
import { createEmptyCard } from 'ts-fsrs';
import {
  postLearningCases,
  deleteLearningCases,
  patchLearningCase,
} from '../utils/api';
import { toaster } from '@chakra/toaster';

const useCards = ({ userData }: { userData?: UserData }): CardManager => {
  const userLearningCases = userData?.isPremium
    ? userData.learningCases
    : undefined;
  const initLearningCases = userLearningCases;

  const [learningCases, setLearningCases] = useState<LearningCases | undefined>(
    initLearningCases,
  );

  useEffect(() => {
    if (userData?.isPremium) return;

    setLearningCases(store.get('learningCases') ?? DEFAULT_LEARNING_CASES);
  }, []);

  useEffect(() => {
    if (userData?.isPremium) return;

    store.set('learningCases', learningCases);
  }, [learningCases]);

  const createLearningCasesIfNotExists = ({
    setType,
    caseIds,
  }: {
    setType: SetType;
    caseIds: string[];
  }) => {
    if (!learningCases) {
      throw new Error('learningCases is unexpectedly undefined');
    }
    return caseIds.reduce((acc, caseId) => {
      if (!learningCases[setType]?.[caseId]) {
        if (!acc[setType]) {
          acc[setType] = {};
        }
        acc[setType][caseId] = {
          card: createEmptyCard(),
        };
      }
      return acc;
    }, {} as LearningCases);
  };

  const removeSubset: AddOrRemoveSubset = async ({ set, subSet, setType }) => {
    await removeCases({ learningCasesToRemove: [`${set}${subSet}`], setType });
  };

  const removeSet: AddOrRemoveSet = async ({ setType, set }) => {
    const learningCasesToRemove: string[] = [];
    setTypeSpeffzMap[setType][set].forEach((subSet) => {
      learningCasesToRemove.push(`${set}${subSet}`);
    });

    await removeCases({ learningCasesToRemove, setType });
  };

  const addSubset: AddOrRemoveSubset = async ({ setType, set, subSet }) => {
    await addCases({ caseIds: [`${set}${subSet}`], setType });
  };

  const addSet: AddOrRemoveSet = async ({ setType, set }) => {
    const caseIds = setTypeSpeffzMap[setType][set].map(
      (subSet) => `${set}${subSet}`,
    );
    await addCases({ caseIds, setType });
  };

  const updateCase: UpdateCase = async ({ recordLogItem, caseId, setType }) => {
    try {
      if (userData?.isPremium) {
        await patchLearningCase({
          recordLogItem,
          caseId,
          setType,
        });
      }
      setLearningCases((prev = {} as LearningCases) => {
        const prevSetTypeCards = prev[setType];

        return {
          ...prev,
          [setType]: {
            ...prevSetTypeCards,
            [caseId]: recordLogItem,
          },
        };
      });
    } catch {
      // TODO helper func
      toaster.create({
        title: 'We had a problem with your request.  Please try again later.',
        type: 'error',
      });
    }
  };

  const removeCases = async ({
    learningCasesToRemove,
    setType,
  }: DeleteLearningCasesPayload) => {
    try {
      if (userData?.isPremium) {
        await deleteLearningCases({
          setType,
          learningCasesToRemove,
        });
      }
      setLearningCases((prev = {} as LearningCases) => {
        const updatedLearningCases = { ...prev![setType] };
        learningCasesToRemove.forEach((caseId) => {
          delete updatedLearningCases[caseId];
        });

        return {
          ...prev,
          [setType]: updatedLearningCases,
        };
      });
    } catch {
      // TODO helper func
      toaster.create({
        title: 'We had a problem with your request.  Please try again later.',
        type: 'error',
      });
    }
  };

  const addCases = async ({
    caseIds,
    setType,
  }: {
    caseIds: string[];
    setType: SetType;
  }) => {
    try {
      const learningCasesToAdd = createLearningCasesIfNotExists({
        setType,
        caseIds,
      });
      if (Object.keys(learningCasesToAdd).length === 0) {
        throw new Error('Unexpectedly already had this subset');
      }
      if (!learningCases) {
        throw new Error('learningCases is unexpectedly undefined');
      }
      if (userData?.isPremium) {
        await postLearningCases({
          setType,
          learningCasesToAdd,
        });
      }
      setLearningCases((prev = {} as LearningCases) => {
        const prevSetTypeRecordLogMap = prev![setType];

        return {
          ...prev,
          [setType]: {
            ...prevSetTypeRecordLogMap,
            ...learningCasesToAdd[setType],
          },
        };
      });
    } catch {
      // TODO helper func
      toaster.create({
        title: 'We had a problem with your request.  Please try again later.',
        type: 'error',
      });
    }
  };

  return {
    learningCases,
    removeSubset,
    removeSet,
    updateCase,
    addSubset,
    addSet,
  };
};

export default useCards;
