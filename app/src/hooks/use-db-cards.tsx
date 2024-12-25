import { useState } from 'react';
import { CardManager, LearningCases, SetType, UserData } from '../types';
import { setTypeSpeffzMap } from '../utils/constants';
import { RecordLogItem } from 'ts-fsrs';

const useDbCards = ({ userData }: { userData?: UserData }): CardManager => {
  const initLearningCases = userData?.learningCases ?? {
    edges: {},
    corners: {},
  };

  const [learningCases, setLearningCases] =
    useState<LearningCases>(initLearningCases);

  const addSubset = async ({
    setType,
    set,
    subSet,
  }: {
    setType: SetType;
    set: string;
    subSet: string;
  }) => {
    const response = await fetch(`/api/db-cards/add`, {
      method: 'POST',
      body: JSON.stringify({ subSet, setType, set }),
      headers: { 'Content-Type': 'application/json' },
    });
    const data = await response.json();
    if (data.success) {
      setLearningCases((prev) => {
        const prevSetTypeCards = prev[setType];

        return {
          ...prev,
          [setType]: {
            ...prevSetTypeCards,
            [`${set}${subSet}`]: { card: data.card },
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
    const response = await fetch(`/api/db-cards/add`, {
      method: 'POST',
      body: JSON.stringify({ setType, set }),
      headers: { 'Content-Type': 'application/json' },
    });
    const data = await response.json();

    if (data.success) {
      setLearningCases((prev) => {
        const updatedRecordLogItemMap = { ...prev[setType] };

        setTypeSpeffzMap[setType][set].forEach((subSet: string) => {
          const caseId = `${set}${subSet}`;
          updatedRecordLogItemMap[caseId] = data.recordLogItemMap[caseId];
        });

        return {
          ...prev,
          [setType]: updatedRecordLogItemMap,
        };
      });
    }
  };

  const removeSubset = async ({
    set,
    subSet,
    setType,
  }: {
    set: string;
    subSet: string;
    setType: SetType;
  }) => {
    const response = await fetch(`/api/db-cards/remove`, {
      method: 'POST',
      body: JSON.stringify({ subSet, setType, set }),
      headers: { 'Content-Type': 'application/json' },
    });
    const data = await response.json();

    if (data.success) {
      setLearningCases((prev) => {
        const updatedCards = { ...prev };
        delete prev[setType][`${set}${subSet}`];

        return updatedCards;
      });
    }
  };

  const removeSet = async ({
    setType,
    set,
  }: {
    setType: SetType;
    set: string;
  }) => {
    const response = await fetch(`/api/db-cards/remove`, {
      method: 'POST',
      body: JSON.stringify({ setType, set }),
      headers: { 'Content-Type': 'application/json' },
    });
    const data = await response.json();

    if (data.success) {
      setLearningCases((prev) => {
        const updatedCards = { ...prev[setType] };

        setTypeSpeffzMap[setType][set].forEach((subSet) => {
          delete updatedCards[`${set}${subSet}`];
        });

        return {
          ...prev,
          [setType]: updatedCards,
        };
      });
    }
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
    const response = await fetch(`/api/db-cards/update`, {
      method: 'POST',
      body: JSON.stringify({ setType, caseId, recordLogItem }),
      headers: { 'Content-Type': 'application/json' },
    });
    const data = await response.json();

    if (data.success) {
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

  return {
    learningCases,
    removeSubset,
    removeSet,
    updateCase,
    addSubset,
    addSet,
  };
};

export default useDbCards;
