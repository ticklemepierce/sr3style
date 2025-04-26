import { useEffect, useState } from 'react';
import {
  AddOrRemoveSet,
  AddOrRemoveSubset,
  CardManager,
  DeleteLearningCasesPayload,
  LearningCases,
  SetType,
  SetTypeLetterSchemeMap,
  UpdateCase,
  UserData,
} from '../types';
import { DEFAULT_LEARNING_CASES } from '../utils/constants';
import store from 'store2';
import { createEmptyCard } from 'ts-fsrs';
import {
  postLearningCases,
  deleteLearningCases,
  patchLearningCase,
} from '../utils/api';
import { showGenericErrorToast } from '../utils/toast';

const useCards = ({
  userData,
  setTypeLetterSchemeMap,
  autoAddInverse,
  autoRemoveInverse,
}: {
  userData?: UserData;
  setTypeLetterSchemeMap: SetTypeLetterSchemeMap;
  autoAddInverse: boolean;
  autoRemoveInverse: boolean;
}): CardManager => {
  const userLearningCases = userData?.isPremium
    ? userData.learningCases
    : undefined;
  const initLearningCases = userLearningCases;

  const [learningCases, setLearningCases] = useState<LearningCases | undefined>(
    initLearningCases,
  );

  useEffect(() => {
    if (userData?.isPremium) return;

    setLearningCases({
      ...DEFAULT_LEARNING_CASES,
      ...(store.get('learningCases') || {}),
    });
  }, [userData]);

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

  const removeSubset: AddOrRemoveSubset = async ({
    set,
    subSet,
    setType,
    isParity,
  }) => {
    await removeCases({
      learningCasesToRemove: [isParity ? subSet : `${set}${subSet}`],
      setType,
    });
  };

  const removeSet: AddOrRemoveSet = async ({ setType, set }) => {
    const learningCasesToRemove: string[] = [];
    setTypeLetterSchemeMap[setType][set].forEach((subSet) => {
      learningCasesToRemove.push(`${set}${subSet}`);
    });

    await removeCases({ learningCasesToRemove, setType });
  };

  const addSubset: AddOrRemoveSubset = async ({
    setType,
    set,
    subSet,
    isParity,
  }) => {
    await addCases({
      caseIds: [isParity ? subSet : `${set}${subSet}`],
      setType,
    });
  };

  const addSet: AddOrRemoveSet = async ({ setType, set }) => {
    const caseIds = setTypeLetterSchemeMap[setType][set].map(
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
      showGenericErrorToast();
    }
  };

  function reverseString(str: string): string {
    if (str.length === 2) {
      return str[1] + str[0];
    }
    throw new Error('Input string must be exactly 2 characters long');
  }
  const createInverses = (caseIds: string[]) =>
    caseIds.reduce((acc, id) => {
      acc.push(id);
      acc.push(reverseString(id));
      return acc;
    }, [] as string[]);

  const removeCases = async ({
    learningCasesToRemove,
    setType,
  }: DeleteLearningCasesPayload) => {
    try {
      learningCasesToRemove = autoRemoveInverse
        ? Array.from(new Set(createInverses(learningCasesToRemove)))
        : learningCasesToRemove;
      if (userData?.isPremium) {
        await deleteLearningCases({
          setType,
          learningCasesToRemove: autoRemoveInverse
            ? Array.from(new Set(createInverses(learningCasesToRemove)))
            : learningCasesToRemove,
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
      showGenericErrorToast();
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
        caseIds: autoAddInverse
          ? Array.from(new Set(createInverses(caseIds)))
          : caseIds,
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
    } catch (e) {
      console.error(e);
      showGenericErrorToast();
    }
  };

  const resetSetType = async ({ setType }: { setType: SetType }) => {
    setLearningCases((prev = {} as LearningCases) => ({
      ...prev,
      [setType]: {},
    }));
  };

  return {
    learningCases,
    removeSubset,
    removeSet,
    updateCase,
    addSubset,
    addSet,
    resetSetType,
  };
};

export default useCards;
