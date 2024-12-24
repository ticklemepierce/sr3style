import { useEffect, useRef, useState } from 'react';
import { Rating } from 'ts-fsrs';
import { Question, SetType } from '~/src/types';
import { useFSRSContext } from '~/src/context/fsrs';
import { formatTime } from '~/src/utils/time';
import { DEFAULT_TARGET_TIME_IN_MS } from '~/src/utils/constants';
import useTabActive from '~/src/hooks/use-tab-active';
import { useSessionContext } from '~/src/context/session';
import { Heading, Stack } from '@chakra-ui/react';

export const QuizQuestion = ({
  question,
  onAdvance,
  // TODO updateCard

  setType,
}: {
  question: Question;
  onAdvance: ({ time, rating }: { time: number; rating: number }) => void;
  setType: SetType;
}) => {
  const { f } = useFSRSContext();
  const { updateCard } = useSessionContext();
  const [stopwatchTime, setStopwatchTime] = useState(0);
  const stopWatchStartTimeRef = useRef(Date.now());

  const stopwatchTimeRef = useRef(0);

  const handleSpacePress = (e: KeyboardEvent) => {
    if (e.key === ' ') {
      rate();
    }
  };

  useEffect(() => {
    document.addEventListener('touchstart', rate, false);
    document.addEventListener('keydown', handleSpacePress, false);
    return () => {
      document.removeEventListener('keydown', handleSpacePress, false);
      document.removeEventListener('touchstart', rate, false);
    };
  }, []);

  useTabActive({
    onFocus: () => {
      const msElapsedSinceStart = Date.now() - stopWatchStartTimeRef.current;
      setStopwatchTime(msElapsedSinceStart);
      stopwatchTimeRef.current = msElapsedSinceStart;
    },
    onBlur: () => {}, // TODO make optional
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setStopwatchTime((stopwatchTime) => stopwatchTime + 10);
      stopwatchTimeRef.current += 10;
    }, 10);

    return () => clearInterval(interval);
  }, []);

  const rate = () => {
    const timeForPair = stopwatchTimeRef.current;
    const timeRatio = Math.floor(timeForPair / DEFAULT_TARGET_TIME_IN_MS);

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

    const newCard = f!.repeat(question.card.fsrsCard, new Date())[rating];

    const { card: fsrsCard, ...rest } = newCard;

    updateCard!({
      card: { fsrsCard, ...rest },
      letterPair: question.pair,
      setType,
    });

    onAdvance({ time: timeForPair, rating });
  };

  return (
    <Stack alignItems={'center'}>
      <Heading size={'4xl'}>{question.pair.toUpperCase()}</Heading>
      <Heading size={'4xl'}>{formatTime(stopwatchTime)}</Heading>
    </Stack>
  );
};
