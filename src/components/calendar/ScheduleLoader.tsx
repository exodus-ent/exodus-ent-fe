'use client';

import { useEffect } from 'react';
import { useScheduleStore } from '@/store/useScheduleStore';

export default function ScheduleLoader() {
  const { setSchedules, setIsLoading } = useScheduleStore();

  useEffect(() => {
    setIsLoading(true);
    // MSW(개발) 또는 실제 API(운영) 둘 다 처리
    const load = () =>
      fetch('/api/schedules')
        .then((r) => r.json())
        .then((data) => {
          setSchedules(data);
          setIsLoading(false);
        })
        .catch(() => setIsLoading(false));

    // MSW service worker 등록 완료 후 fetch
    if (process.env.NODE_ENV === 'development') {
      // worker 등록까지 최대 1.5초 대기
      const timer = setTimeout(load, 300);
      return () => clearTimeout(timer);
    }
    load();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
}
