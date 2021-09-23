import { Typography, makeStyles, Box } from '@material-ui/core';

// red '#f6dfc6'

const useStyles = makeStyles({
  statsticContainer: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  statisticItem: {
    display: 'flex',
    justifyContent: 'space-between',
    flexDirection: 'column',
    boxSizing: 'content-box',
    width: '90px',
    height: '90px',
    backgroundColor: 'yellow',
    padding: '5px',
    marginTop: '5px',
    marginBottom: '5px',
    marginRight: '10px',
    '&:last-child': {
      marginRight: '0px',
    },
  },
  statisticValue: {
    fontSize: '2em',
    textAlign: 'center',
  },
  statisticUnit: {
    textAlign: 'right',
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
      {props.users && (
        <Box className={classes.statisticItem} style={{ backgroundColor: '#d9b3d9' }}>
          <Typography>Personen</Typography>
          <Typography className={classes.statisticValue}>{props.users}</Typography>
          <Typography className={classes.statisticUnit}>&nbsp;</Typography>
        </Box>
      )}
      <Box className={classes.statisticItem} style={{ backgroundColor: '#f7eeb3' }}>
        {' '}
        <Typography>Suchzeit</Typography>
        <Typography className={classes.statisticValue}>{Math.round(props.duration / 60e3)}</Typography>
        <Typography className={classes.statisticUnit}>Min.</Typography>
      </Box>
      <Box className={classes.statisticItem} style={{ backgroundColor: '#bbdeeb' }}>
        <Typography>Strecke</Typography>
        <Typography className={classes.statisticValue}>{Math.round(props.distance * 1e3)}</Typography>
        <Typography className={classes.statisticUnit}>Meter</Typography>
      </Box>
      <Box className={classes.statisticItem} style={{ backgroundColor: '#c8e9d4' }}>
        <Typography>Abfall</Typography>
        <Typography className={classes.statisticValue}>{Math.round(props.collected * 1e2) / 1e2}</Typography>
        <Typography className={classes.statisticUnit}>Liter</Typography>
      </Box>
    </Box>
  );
}

export default StatisticGroup;
