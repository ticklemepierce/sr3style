import { Typography } from "@mui/material";
import { useEffect } from "react";
import { SetType } from "~/src/types";


export const QuizFeedback = ({ isLastQuestion, isStartScreen, onAdvance }: { isLastQuestion: boolean, isStartScreen: boolean, onAdvance: Function }) => {
  const handleSpacePress = (e: KeyboardEvent) => {
    if (e.key === ' ') {
      onAdvance();
    }
  };
  
  useEffect(() => {
    document.addEventListener("keydown", handleSpacePress, false);
    return () => document.removeEventListener("keydown", handleSpacePress, false);
  }, []);

  const getCopy = () => {
    if (isStartScreen) {
      return 'start quiz'
    }
    if (isLastQuestion) {
      return 'view quiz summary'
    }
    return 'go to next question';
  }
  
  return (
    <Typography variant="h4" component="h1" sx={{ mb: 2 }}>
      Press 'space' to {getCopy()}
    </Typography>
  );
}