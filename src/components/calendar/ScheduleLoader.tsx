'use client';

import { useEffect } from 'react';
import { createClient } from '@/lib/supabase';
import { useScheduleStore } from '@/store/useScheduleStore';

export default function ScheduleLoader() {
  const { setSchedules, setIsLoading } = useScheduleStore();

  useEffect(() => {
    setIsLoading(true);
    createClient()
      .from('schedules')
      .select('id, title, idol, category, date, time, location, description, thumbnail_url, detail_url')
      .order('date')
      .then(({ data }) => {
        setSchedules(
          (data ?? []).map((r) => ({
            id: r.id,
            title: r.title,
            idol: r.idol,
            category: r.category,
            date: r.date,
            time: r.time ?? undefined,
            location: r.location ?? undefined,
            description: r.description ?? undefined,
            thumbnailUrl: r.thumbnail_url ?? undefined,
            detailUrl: r.detail_url ?? undefined,
          })),
        );
        setIsLoading(false);
      })
      .catch(() => setIsLoading(false));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
}
