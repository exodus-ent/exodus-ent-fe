import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase';
import { useAuthStore } from '@/store/useAuthStore';

export function useBookmark(scheduleId: string | null) {
  const { user } = useAuthStore();
  const router = useRouter();
  const [bookmarked, setBookmarked] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user || !scheduleId) {
      setBookmarked(false);
      return;
    }
    const supabase = createClient();
    supabase
      .from('bookmarks')
      .select('id')
      .eq('schedule_id', scheduleId)
      .eq('user_id', user.id)
      .maybeSingle()
      .then(({ data }) => setBookmarked(!!data));
  }, [user, scheduleId]);

  const toggle = async () => {
    if (!user) {
      router.push('/login');
      return;
    }
    if (!scheduleId || loading) return;
    setLoading(true);

    const next = !bookmarked;
    setBookmarked(next); // 낙관적 업데이트 — 즉시 UI 반영

    const supabase = createClient();
    if (!next) {
      await supabase
        .from('bookmarks')
        .delete()
        .eq('schedule_id', scheduleId)
        .eq('user_id', user.id);
    } else {
      await supabase.from('bookmarks').insert({ schedule_id: scheduleId, user_id: user.id });
    }
    setLoading(false);
  };

  return { bookmarked, toggle, loading };
}
