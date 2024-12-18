import { Typography } from '@mui/material';
import { useEffect, useRef } from 'react';

export const QuizFeedback = ({
  isLastQuestion,
  isStartScreen,
  onAdvance,
}: {
  isLastQuestion: boolean;
  isStartScreen: boolean;
  onAdvance: Function;
}) => {
  const touchStarted = useRef(false);

  const handleSpacePress = (e: KeyboardEvent) => {
    if (e.key === ' ') {
      onAdvance();
    }
  };

  const handleTouchStart = () => (touchStarted.current = true);

  const handleTouchEnd = () => {
    if (!touchStarted.current) return;

    onAdvance();
  };

  const supportsTouch = 'ontouchstart' in window;

  useEffect(() => {
    document.addEventListener('keydown', handleSpacePress, false);
    document.addEventListener('touchstart', handleTouchStart, false);
    document.addEventListener('touchend', handleTouchEnd, false);
    return () => {
      document.removeEventListener('touchstart', handleTouchStart, false);
      document.removeEventListener('touchend', handleTouchEnd, false);
      document.removeEventListener('keydown', handleSpacePress, false);
    };
  }, []);

  const getCopy = () => {
    if (isStartScreen) {
      return 'start quiz';
    }
    if (isLastQuestion) {
      return 'view quiz summary';
    }
    return 'go to next question';
  };

  return (
    <Typography variant='h4' component='h1' sx={{ mb: 2 }}>
      {supportsTouch ? 'Tap screen' : `Press 'space'`} to {getCopy()}
    </Typography>
  );
};
