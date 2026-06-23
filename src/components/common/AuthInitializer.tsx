'use client';

import { useEffect } from 'react';
import { createClient } from '@/lib/supabase';
import { useAuthStore } from '@/store/useAuthStore';

export default function AuthInitializer() {
  const { setUser, setIsLoading } = useAuthStore();

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(async ({ data }) => {
      if (!data.user) {
        setUser(null);
        setIsLoading(false);
        return;
      }
      const { data: profile } = await supabase
        .from('profiles')
        .select('is_admin, nickname, avatar_url')
        .eq('id', data.user.id)
        .maybeSingle();
      setUser({
        id: data.user.id,
        email: data.user.email ?? '',
        nickname: profile?.nickname ?? data.user.user_metadata?.nickname ?? data.user.email?.split('@')[0] ?? '사용자',
        avatarUrl: profile?.avatar_url ?? data.user.user_metadata?.avatar_url,
        isAdmin: profile?.is_admin === true || data.user.user_metadata?.isAdmin === true,
      });
      setIsLoading(false);
    });
  }, [setUser, setIsLoading]);

  return null;
}
