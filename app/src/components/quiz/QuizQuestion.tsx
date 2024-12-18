import { useEffect, useRef, useState } from 'react';
import Typography from '@mui/material/Typography';
import { Rating } from 'ts-fsrs';
import { Question, SetType } from '~/src/types';
import { useFSRSContext } from '~/src/context/fsrs';
import { formatTime } from '~/src/utils/time';
import { DEFAULT_TARGET_TIME_IN_MS } from '~/src/utils/constants';
import useTabActive from '~/src/hooks/use-tab-active';
import useLocalStorageCards from '~/src/hooks/use-local-storage-cards';

export const QuizQuestion = ({ question, onAdvance, setType }: {question: Question, onAdvance: Function, setType: SetType }) => {
  const { f } = useFSRSContext();
  const { updateCard } = useLocalStorageCards({ setType });
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
    document.addEventListener("keydown", handleSpacePress, false);
    return () => {
      document.removeEventListener("keydown", handleSpacePress, false);
      document.removeEventListener('touchstart', rate, false);
    }
  }, []);

  useTabActive({
    onFocus: () => {
      const msElapsedSinceStart = Date.now() - stopWatchStartTimeRef.current;
      setStopwatchTime(msElapsedSinceStart);
      stopwatchTimeRef.current = msElapsedSinceStart;
    },
    onBlur: () => {} // TODO make optional
  })

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

    switch(timeRatio) {
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
        rating = Rating.Again
    }

    const newCard = f!.repeat(question.card, new Date())[rating];

    updateCard({ card: newCard, letterPair: question.pair });
    
    onAdvance({ time: timeForPair, rating });
  };

  return (
    <>
      <Typography variant="h1" component="h1" sx={{ mb: 2 }}>
        {question.pair.toUpperCase()}
      </Typography>
      <Typography variant="h2" component="p">
        {formatTime(stopwatchTime)}
      </Typography>
    </>
  );
}