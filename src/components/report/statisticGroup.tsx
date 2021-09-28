import { makeStyles, Box } from '@material-ui/core';
import StatisticItem from './statisticItem';

// red '#f6dfc6'

const useStyles = makeStyles({
  statsticContainer: {
    display: 'flex',
    flexWrap: 'wrap',
  },
});

interface StatisticGroupProps {
  users?: number;
  duration: number;
  distance: number;
  collected: number;
}

function StatisticGroup(props: StatisticGroupProps) {
  const classes = useStyles();

  return (
    <Box className={classes.statsticContainer}>
      {props.users !== undefined && <StatisticItem label={'Personen'} value={props.users} color="#d9b3d9" />}
      <StatisticItem label={'Suchzeit'} value={Math.round(props.duration / 60e3)} unit={'Min.'} color="#f7eeb3" />
      <StatisticItem label={'Strecke'} value={Math.round(props.distance * 1e3)} unit={'Meter'} color="#bbdeeb" />
      <StatisticItem label={'Abfall'} value={Math.round(props.collected * 1e2) / 1e2} unit={'Liter'} color="#c8e9d4" />
    </Box>
  );
}

export default StatisticGroup;
