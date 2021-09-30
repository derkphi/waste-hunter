import React, { useEffect, useState } from 'react';
import { Card, CardHeader, CardContent } from '@mui/material';
import StatisticGroup from './statisticGroup';
import { getReportEvents, EventWithStatistic } from './reportHelper';

interface GroupStatistic {
  duration: number;
  distance: number;
  collected: number;
}

const statisticInit: GroupStatistic = { duration: 0, distance: 0, collected: 0 };

function StatisticCard() {
  const [statistic, setStatistic] = useState(statisticInit);
  useEffect(() => {
    getReportEvents().then((events) => {
      const stat = { ...statisticInit };
      setStatistic(
        events.reduce((s: GroupStatistic, e: EventWithStatistic) => {
          return {
            duration: s.duration + e.duration,
            distance: s.distance + e.distance,
            collected: s.collected + e.collected,
          };
        }, stat)
      );
    });
  }, []);

  return (
    <Card>
      <CardHeader title="Gruppenerfolg seit Gründung" />
      <CardContent>
        <StatisticGroup duration={statistic.duration} distance={statistic.distance} collected={statistic.collected} />
      </CardContent>
    </Card>
  );
}

export default StatisticCard;
