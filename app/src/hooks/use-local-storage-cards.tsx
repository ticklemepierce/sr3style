import { useLocalStorage } from 'usehooks-ts';
import { createEmptyCard, RecordLogItem } from 'ts-fsrs';
import { CardManager, LearningCases, SetType } from '../types';
import { setTypeSpeffzMap } from '../utils/constants';
import { useSessionContext } from '../context/session';

const useLocalStorageCards = (): CardManager => {
  const { settings } = useSessionContext();

  const [learningCases, setLearningCases] = useLocalStorage<LearningCases>(
    'learningCases',
    {} as LearningCases,
  );

  const addToCardsIfNotExists = async ({
    setType,
    caseId,
  }: {
    setType: SetType;
    caseId: string;
  }) => {
    const caseIdExists = !!learningCases[setType]?.[caseId];
    if (!caseIdExists) {
      const card = createEmptyCard();

      setLearningCases((prev) => {
        const prevSetTypeCards = prev[setType];

        return {
          ...prev,
          [setType]: {
            ...prevSetTypeCards,
            [caseId]: { card },
          },
        };
      });
    }
  };

  const addSet = async ({
    setType,
    set,
  }: {
    setType: SetType;
    set: string;
  }) => {
    await Promise.all(
      setTypeSpeffzMap[setType][set].map((subSet) =>
        addSubset({ setType, set, subSet }),
      ),
    );
  };

  const addSubset = async ({
    setType,
    set,
    subSet,
  }: {
    setType: SetType;
    set: string;
    subSet: string;
  }) => {
    await addToCardsIfNotExists({ setType, caseId: `${set}${subSet}` });
    if (settings?.autoAddInverse) {
      await addToCardsIfNotExists({ setType, caseId: `${subSet}${set}` });
    }
  };

  const removeSet = async ({
    setType,
    set,
  }: {
    setType: SetType;
    set: string;
  }) => {
    await Promise.all(
      setTypeSpeffzMap[setType][set].map((subSet) =>
        removeSubset({ setType, set, subSet }),
      ),
    );
  };

  const removeSubset = async ({
    setType,
    set,
    subSet,
  }: {
    setType: SetType;
    set: string;
    subSet: string;
  }) => {
    setLearningCases((prev) => {
      delete prev[setType][`${set}${subSet}`];

      return prev;
    });
  };

  const updateCase = async ({
    recordLogItem,
    caseId,
    setType,
  }: {
    recordLogItem: RecordLogItem;
    caseId: string;
    setType: SetType;
  }) => {
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

  return {
    learningCases,
    removeSubset,
    removeSet,
    updateCase,
    addSubset,
    addSet,
  };
};

export default useLocalStorageCards;
