import { HStack } from '@chakra-ui/react';
import { ProgressBar, ProgressRoot, ProgressValueText } from '@chakra/progress';

export const QuizProgress = ({
  questionNumber,
  totalQuestions,
}: {
  questionNumber: number;
  totalQuestions: number;
}) => {
  return (
    <ProgressRoot
      value={(questionNumber / totalQuestions) * 100}
      width={'100%'}
      mr={5}
      variant={'subtle'}
    >
      <HStack gap={'5'}>
        <ProgressBar flex={'1'} />
        <ProgressValueText>
          {questionNumber} / {totalQuestions}
        </ProgressValueText>
      </HStack>
    </ProgressRoot>
  );
};
