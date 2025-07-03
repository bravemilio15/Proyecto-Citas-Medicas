import React from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import esLocale from '@fullcalendar/core/locales/es';

const FullCalendarWrapper = ({ eventos }) => (
  <FullCalendar
    plugins={[dayGridPlugin]}
    initialView="dayGridMonth"
    locale={esLocale}
    events={eventos}
    height={600}
  />
);

export default FullCalendarWrapper;
