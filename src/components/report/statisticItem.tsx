import { Typography, makeStyles, Box } from '@material-ui/core';

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
  label: string;
  value: number;
  unit?: string;
  color: string;
}

function StatisticItem(props: StatisticGroupProps) {
  const classes = useStyles();

  return (
    <Box className={classes.statisticItem} style={{ backgroundColor: props.color }}>
      <Typography>{props.label}</Typography>
      <Typography className={classes.statisticValue}>{props.value}</Typography>
      {props.unit ? (
        <Typography className={classes.statisticUnit}>{props.unit}</Typography>
      ) : (
        <Typography className={classes.statisticUnit}>&nbsp;</Typography>
      )}
    </Box>
  );
}

export default StatisticItem;
