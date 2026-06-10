'use client';

import { useEffect } from 'react';
import { useFilterStore } from '@/store/useFilterStore';

export default function ScheduleInitializer({ idol }: { idol?: string }) {
  const setSelectedIdols = useFilterStore((s) => s.setSelectedIdols);

  useEffect(() => {
    if (idol) {
      setSelectedIdols([decodeURIComponent(idol)]);
    }
  }, [idol, setSelectedIdols]);

  return null;
}
