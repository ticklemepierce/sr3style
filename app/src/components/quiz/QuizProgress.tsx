import { styled } from '@mui/material/styles';
import { linearProgressClasses } from '@mui/material/LinearProgress';
import { Grid, LinearProgress, Typography } from '@mui/material';

const BorderLinearProgress = styled(LinearProgress)(({ theme }) => ({
  height: 10,
  borderRadius: 5,
  // TODO colors
  [`&.${linearProgressClasses.colorPrimary}`]: {
    backgroundColor: theme.palette.grey[theme.palette.mode === 'light' ? 200 : 800],
  },
  [`& .${linearProgressClasses.bar}`]: {
    backgroundColor: theme.palette.mode === 'light' ? '#1a90ff' : '#308fe8',
  },
}));

export const QuizProgress = ({ questionNumber, totalQuestions }: { questionNumber: number,  totalQuestions: number}) => {
  return (
    <Grid
      container
      spacing={0}
      direction="column"
      textAlign="center"
      sx={{
        position: 'fixed',
        top: 25,
        left: '50%',
        transform: 'translateX(-50%)',
        width: '75vw',
      }}
    >
      <Grid>
        <BorderLinearProgress value={(questionNumber / totalQuestions) * 100} variant={'determinate'} />
      </Grid>
      <Grid>
        <Typography variant='subtitle1' component="p" sx={{ marginTop: '10px', fontWeight: 500 }}>
          {questionNumber} / {totalQuestions}
        </Typography>
      </Grid>
    </Grid>  
  );
}


// | 'h1'
// | 'h2'
// | 'h3'
// | 'h4'
// | 'h5'
// | 'h6'
// | 'subtitle1'
// | 'subtitle2'
// | 'body1'
// | 'body2'
// | 'caption'
// | 'button'
// | 'overline';


