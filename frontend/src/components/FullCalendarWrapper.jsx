import React from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import esLocale from '@fullcalendar/core/locales/es';

const FullCalendarWrapper = ({ events }) => (
  <FullCalendar
    plugins={[dayGridPlugin]}
    initialView="dayGridMonth"
    locale={esLocale}
    events={events}
    height={600}
  />
);

export default FullCalendarWrapper;
