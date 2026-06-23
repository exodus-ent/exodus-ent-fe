'use client';

import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import koLocale from '@fullcalendar/core/locales/ko';
import { useScheduleStore } from '@/store/useScheduleStore';
import { getIdolColor } from '@/lib/idolColor';

export default function Calendar() {
  const { schedules, isLoading, setSelectedSchedule, setIsModalOpen } = useScheduleStore();

  const events = schedules.map((schedule) => ({
    id: schedule.id,
    title: schedule.title,
    date: schedule.date,
    backgroundColor: getIdolColor(schedule.idol),
    borderColor: 'transparent',
    extendedProps: { ...schedule },
  }));

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleEventClick = (info: any) => {
    setSelectedSchedule(info.event.extendedProps);
    setIsModalOpen(true);
  };

  return (
    <div className="relative overflow-hidden border border-white/10 bg-[#111]">
      {/* 로딩 오버레이 */}
      {isLoading && (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-3 bg-black/80 backdrop-blur-sm">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#CCFF00]/20 border-t-[#CCFF00]" />
          <p className="text-sm text-white/50">스케줄 불러오는 중...</p>
        </div>
      )}

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
        // 한국어 로케일 "일" 접미사 제거 → 오늘 날짜 원이 숫자를 가리는 버그 수정
        dayCellContent={(args) => args.dayNumberText.replace('일', '')}
        noEventsText=""
      />

    </div>
  );
}
