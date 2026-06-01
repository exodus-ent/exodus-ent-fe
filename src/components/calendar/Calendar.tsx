'use client';

import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import koLocale from '@fullcalendar/core/locales/ko';
import { useScheduleStore } from '@/store/useScheduleStore';

export default function Calendar() {
  const { schedules, setSelectedSchedule, setIsModalOpen } = useScheduleStore();

  const events = schedules.map((schedule) => ({
    id: schedule.id,
    title: `${schedule.idol} ${schedule.title}`,
    date: schedule.date,
    extendedProps: { ...schedule },
  }));

  const handleEventClick = (info: any) => {
    setSelectedSchedule(info.event.extendedProps);
    setIsModalOpen(true);
  };

  return (
    <div className="rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden">
      <FullCalendar
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        locale={koLocale}
        events={events}
        eventClick={handleEventClick}
        headerToolbar={{
          left: 'prev,next today',
          center: 'title',
          right: '',
        }}
        height="auto"
        eventClassNames="cursor-pointer"
      />
    </div>
  );
}
