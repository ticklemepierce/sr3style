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

const useCards = ({ userData }: { userData?: UserData }): CardManager => {
  const userLearningCases = userData?.isPremium
    ? userData.learningCases
    : store.get('learningCases');
  const initLearningCases = userLearningCases ?? DEFAULT_LEARNING_CASES;

  const [learningCases, setLearningCases] =
    useState<LearningCases>(initLearningCases);

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
    if (userData?.isPremium) {
      await patchLearningCase({
        recordLogItem,
        caseId,
        setType,
      });
    }
    setLearningCases((prev) => {
      const prevSetTypeCards = prev[setType];

      return {
        ...prev,
        [setType]: {
          ...prevSetTypeCards,
          [caseId]: recordLogItem,
        },
      };
    });
  };

  const removeCases = async ({
    learningCasesToRemove,
    setType,
  }: DeleteLearningCasesPayload) => {
    if (userData?.isPremium) {
      await deleteLearningCases({
        setType,
        learningCasesToRemove,
      });
    }
    setLearningCases((prev) => {
      const updatedLearningCases = { ...prev[setType] };
      learningCasesToRemove.forEach((caseId) => {
        delete updatedLearningCases[caseId];
      });

      return {
        ...prev,
        [setType]: updatedLearningCases,
      };
    });
  };

  const addCases = async ({
    caseIds,
    setType,
  }: {
    caseIds: string[];
    setType: SetType;
  }) => {
    const learningCasesToAdd = createLearningCasesIfNotExists({
      setType,
      caseIds,
    });
    if (Object.keys(learningCasesToAdd).length === 0) {
      throw new Error('Unexpectedly already had this subset');
    }
    if (userData?.isPremium) {
      await postLearningCases({
        setType,
        learningCasesToAdd,
      });
    }
    setLearningCases((prev) => {
      const prevSetTypeRecordLogMap = prev[setType];

      return {
        ...prev,
        [setType]: {
          ...prevSetTypeRecordLogMap,
          ...learningCasesToAdd[setType],
        },
      };
    });
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
