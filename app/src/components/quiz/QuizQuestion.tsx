import { useEffect, useRef, useState } from 'react';
import { Rating, RatingType } from 'ts-fsrs';
import { Question, SetType } from '~/src/types';
import { useFSRSContext } from '~/src/context/fsrs';
import { formatTime } from '~/src/utils/time';
import useTabActive from '~/src/hooks/use-tab-active';
import { useSessionContext } from '~/src/context/session';
import { Heading, Stack } from '@chakra-ui/react';
import { KeepAwake } from '~/src/components/KeepAwake';

export const QuizQuestion = ({
  question,
  onAdvance,
  setType,
  isPracticeMode = false,
}: {
  question: Question;
  isPracticeMode?: boolean;
  onAdvance: ({
    time,
    ratingType,
  }: {
    time: number;
    ratingType: RatingType;
  }) => void;
  setType: SetType;
}) => {
  const { f } = useFSRSContext();
  const { updateCase, settings } = useSessionContext();
  const [stopwatchTime, setStopwatchTime] = useState(0);
  const stopWatchStartTimeRef = useRef(Date.now());

  const stopwatchTimeRef = useRef(0);

  useEffect(() => {
    document.addEventListener('touchstart', rate, false);
    document.addEventListener('keydown', rate, false);
    return () => {
      document.removeEventListener('keydown', rate, false);
      document.removeEventListener('touchstart', rate, false);
    };
  }, []);

  useTabActive({
    onFocus: () => {
      const msElapsedSinceStart = Date.now() - stopWatchStartTimeRef.current;
      setStopwatchTime(msElapsedSinceStart);
      stopwatchTimeRef.current = msElapsedSinceStart;
    },
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setStopwatchTime((stopwatchTime) => stopwatchTime + 10);
      stopwatchTimeRef.current += 10;
    }, 10);

    return () => clearInterval(interval);
  }, []);

  const rate = () => {
    const timeForQuestion = stopwatchTimeRef.current;
    const timeRatio = Math.floor(
      timeForQuestion / (settings.targetTimeInSeconds * 1000),
    );

    let rating: Rating;

    switch (timeRatio) {
      case 0:
        rating = Rating.Easy;
        break;
      case 1:
        rating = Rating.Good;
        break;
      case 2:
        rating = Rating.Hard;
        break;
      default:
        rating = Rating.Again;
    }

    const recordLogItem = f!.repeat(question.recordLogItem.card, new Date())[
      rating
    ];

    if (!isPracticeMode) {
      updateCase!({
        recordLogItem,
        caseId: question.caseId,
        setType,
      });
    }

    onAdvance({
      time: timeForQuestion,
      ratingType: Rating[rating] as RatingType,
    });
  };

  return (
    <Stack alignItems={'center'}>
      <Heading size={'4xl'}>{question.caseId.toUpperCase()}</Heading>
      <Heading size={'4xl'}>{formatTime(stopwatchTime)}</Heading>
      <KeepAwake />
    </Stack>
  );
};
