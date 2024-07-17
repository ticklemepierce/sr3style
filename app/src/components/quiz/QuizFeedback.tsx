import { Typography } from "@mui/material";
import { useEffect } from "react";
import { SetType } from "~/src/types";


export const QuizFeedback = ({ isLastQuestionOfType, isStartScreen, onAdvance, isCombinedQuiz, type, nextType, isLastSet }: { isLastQuestionOfType: boolean, isStartScreen: boolean, onAdvance: Function, isCombinedQuiz: boolean, type: SetType, nextType: SetType, isLastSet: boolean, }) => {
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
    if (isCombinedQuiz) {
      if (isStartScreen) {
        return `start reviewing ${type}`
      }
      if (isLastQuestionOfType) {
        if (isLastSet) {
          return 'view quiz summary'
        } else {
          return `proceed to ${nextType}`
        }
      }
    }
    else {
      if (isStartScreen) {
        return 'start quiz'
      }
      if (isLastQuestionOfType) {
        return 'view quiz summary'
      }
    }
    return 'go to next question';
  }
  
  return (
    <>
      {isCombinedQuiz && isLastQuestionOfType && (
        <Typography variant="h4" component="h1" sx={{ mb: 2 }}>
          Finished reviewing {type}!
        </Typography>
      )} 
      <Typography variant="h4" component="h1" sx={{ mb: 2 }}>
        Press 'space' to {getCopy()}
      </Typography>      
    </>
  );
}