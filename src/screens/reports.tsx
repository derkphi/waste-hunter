import React, { useEffect, useState } from 'react';
import Info from '../components/info';
import { getReportEvents, EventWithStatistic } from '../components/report/reportHelper';
import ReportCard from '../components/report/reportCard';

// red '#f6dfc6'

export default function Reports() {
  const [events, setEvents] = useState<EventWithStatistic[]>([]);

  useEffect(() => {
    getReportEvents().then((reportEvents) => setEvents(reportEvents));
  }, []);

  return events.length ? (
    <>
      {events.map((event) => (
        <ReportCard event={event} />
      ))}
    </>
  ) : (
    <Info text="Kein Bericht vorhanden." />
  );
}
