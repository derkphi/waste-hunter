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
  events?: number;
  duration: number;
  distance: number;
  collected: number;
}

function StatisticGroup(props: StatisticGroupProps) {
  const classes = useStyles();

  const useKm = props.distance > 1;
  const distance = useKm ? Math.round(props.distance * 100) / 100 : Math.round(props.distance * 1e3);

  const useHour = props.duration / 60e3 > 60;
  const duration = useHour ? Math.round(props.duration / 36e3) / 100 : Math.round(props.duration / 60e3);

  return (
    <Box className={classes.statsticContainer}>
      {props.users !== undefined && <StatisticItem label={'Personen'} value={props.users} color="#d9b3d9" />}
      {props.events !== undefined && <StatisticItem label={'Events'} value={props.events} color="#d9b3d9" />}
      <StatisticItem label={'Suchzeit'} value={duration} unit={useHour ? 'Stunden' : 'Minuten'} color="#f7eeb3" />
      <StatisticItem label={'Strecke'} value={distance} unit={useKm ? 'Kilometer' : 'Meter'} color="#bbdeeb" />
      <StatisticItem label={'Abfall'} value={Math.round(props.collected * 1e2) / 1e2} unit={'Liter'} color="#c8e9d4" />
    </Box>
  );
}

export default StatisticGroup;
