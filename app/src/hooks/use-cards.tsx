import { useEffect, useState } from 'react';
import { CardManager, LearningCases, SetType, UserData } from '../types';
import { DEFAULT_LEARNING_CASES, setTypeSpeffzMap } from '../utils/constants';
import store from 'store2';
import { createEmptyCard, RecordLogItem } from 'ts-fsrs';
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

  // TODO better types
  const removeSubset = async ({
    set,
    subSet,
    setType,
  }: {
    set: string;
    subSet: string;
    setType: SetType;
  }) => {
    await removeCases({ learningCasesToRemove: [`${set}${subSet}`], setType });
  };

  // TODO better types
  const removeSet = async ({
    setType,
    set,
  }: {
    setType: SetType;
    set: string;
  }) => {
    const learningCasesToRemove: string[] = [];
    setTypeSpeffzMap[setType][set].forEach((subSet) => {
      learningCasesToRemove.push(`${set}${subSet}`);
    });

    await removeCases({ learningCasesToRemove, setType });
  };

  // TODO better types
  const addSubset = async ({
    setType,
    set,
    subSet,
  }: {
    setType: SetType;
    set: string;
    subSet: string;
  }) => {
    await addCases({ caseIds: [`${set}${subSet}`], setType });
  };

  // TODO better types
  const addSet = async ({
    setType,
    set,
  }: {
    setType: SetType;
    set: string;
  }) => {
    const caseIds = setTypeSpeffzMap[setType][set].map(
      (subSet) => `${set}${subSet}`,
    );
    await addCases({ caseIds, setType });
  };

  // TODO better types
  const updateCase = async ({
    recordLogItem,
    caseId,
    setType,
  }: {
    recordLogItem: RecordLogItem;
    caseId: string;
    setType: SetType;
  }) => {
    if (userData?.isPremium) {
      await patchLearningCase({
        recordLogItem,
        caseId,
        setType,
      });

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
    }
  };

  // TODO better types
  const removeCases = async ({
    learningCasesToRemove,
    setType,
  }: {
    learningCasesToRemove: string[];
    setType: SetType;
  }) => {
    if (userData?.isPremium) {
      await deleteLearningCases({
        setType,
        learningCasesToRemove,
      });

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
    }
  };

  // TODO better types
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
