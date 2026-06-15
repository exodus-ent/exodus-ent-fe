'use client';

import { Suspense, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { createClient } from '@/lib/supabase';
import { useAuthStore } from '@/store/useAuthStore';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get('redirect') ?? '/';
  const { setUser } = useAuthStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const supabase = createClient();
    const { data, error: authError } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });

    if (authError) {
      if (authError.code === 'email_not_confirmed') {
        setError('이메일 인증이 완료되지 않았습니다. 가입 시 받은 이메일에서 인증 링크를 클릭해주세요.');
      } else if (authError.code === 'invalid_credentials') {
        setError('이메일 또는 비밀번호가 올바르지 않습니다.');
      } else {
        setError(authError.message);
      }
      setLoading(false);
      return;
    }

    if (!data.user) {
      setError('로그인에 실패했습니다.');
      setLoading(false);
      return;
    }

    const { data: profile } = await supabase
      .from('profiles').select('is_admin').eq('id', data.user.id).maybeSingle();

    setUser({
      id: data.user.id,
      email: data.user.email ?? '',
      nickname: data.user.user_metadata?.nickname ?? data.user.email?.split('@')[0] ?? '사용자',
      avatarUrl: data.user.user_metadata?.avatar_url,
      isAdmin: profile?.is_admin === true || data.user.user_metadata?.isAdmin === true,
    });
    router.push(redirectTo);
  };

  const handleGoogleLogin = async () => {
    const supabase = createClient();
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    });
  };

  const handleKakaoLogin = async () => {
    const supabase = createClient();
    await supabase.auth.signInWithOAuth({
      provider: 'kakao',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
        scopes: 'profile_nickname profile_image',
      },
    });
  };

  return (
    <div className="flex min-h-[calc(100vh-3.5rem)] items-center justify-center bg-black px-4">
      <div className="w-full max-w-sm">
        <div className="border border-white/10 bg-[#111] px-8 py-10">
          <h1 className="font-bebas mb-1 text-center text-3xl tracking-[0.15em] text-white">LOGIN</h1>
          <p className="mb-8 text-center text-xs text-white/40">
            EXODUS <span className="text-[#CCFF00]">ENT</span>에 오신 걸 환영합니다
          </p>

          {/* 소셜 로그인 */}
          <div className="mb-6 flex flex-col gap-2.5">
            <button
              onClick={handleKakaoLogin}
              className="flex w-full items-center justify-center gap-2.5 bg-[#FEE500] px-4 py-2.5 text-sm font-bold text-black transition-opacity hover:opacity-90"
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 3C6.477 3 2 6.477 2 10.5c0 2.611 1.574 4.91 3.963 6.265L4.9 20.5l4.327-2.857C9.718 17.77 10.847 18 12 18c5.523 0 10-3.477 10-7.5S17.523 3 12 3z" />
              </svg>
              카카오로 로그인
            </button>
            <button
              onClick={handleGoogleLogin}
              className="flex w-full items-center justify-center gap-2.5 border border-white/15 bg-transparent px-4 py-2.5 text-sm font-medium text-white/70 transition-colors hover:border-white/30 hover:text-white"
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
              </svg>
              Google로 로그인
            </button>
          </div>

          <div className="mb-6 flex items-center gap-3">
            <hr className="flex-1 border-white/10" />
            <span className="text-xs text-white/30">또는</span>
            <hr className="flex-1 border-white/10" />
          </div>

          <form onSubmit={handleEmailLogin} className="space-y-4">
            <div>
              <label className="mb-1.5 block text-xs font-medium tracking-widest text-white/50 uppercase">이메일</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="email@example.com"
                required
                className="w-full border border-white/15 bg-[#1a1a1a] px-4 py-2.5 text-sm text-white outline-none transition-colors placeholder:text-white/25 focus:border-[#CCFF00]"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium tracking-widest text-white/50 uppercase">비밀번호</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full border border-white/15 bg-[#1a1a1a] px-4 py-2.5 text-sm text-white outline-none transition-colors placeholder:text-white/25 focus:border-[#CCFF00]"
              />
            </div>

            {error && (
              <p className="border border-red-500/20 bg-red-500/10 px-3 py-2 text-xs text-red-400">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#CCFF00] py-2.5 text-sm font-semibold text-black transition-colors hover:bg-[#b3e600] disabled:opacity-60"
            >
              {loading ? '로그인 중...' : '로그인'}
            </button>
          </form>

          <p className="mt-6 text-center text-xs text-white/40">
            계정이 없으신가요?{' '}
            <Link href="/signup" className="font-semibold text-[#CCFF00] hover:underline">
              회원가입
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}
