'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase';
import { useAuthStore } from '@/store/useAuthStore';

export default function SignupPage() {
  const router = useRouter();
  const { setUser } = useAuthStore();
  const [nickname, setNickname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirm) { setError('비밀번호가 일치하지 않습니다.'); return; }
    if (password.length < 6) { setError('비밀번호는 6자 이상이어야 합니다.'); return; }

    setLoading(true);

    const supabase = createClient();
    const { data, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { nickname, isAdmin: false } },
    });

    if (authError) {
      setError(authError.message);
      setLoading(false);
      return;
    }

    if (data.session && data.user) {
      setUser({
        id: data.user.id,
        email: data.user.email ?? '',
        nickname: nickname || (data.user.email?.split('@')[0] ?? '사용자'),
        isAdmin: false,
      });
      router.push('/');
      return;
    }

    setDone(true);
    setLoading(false);
  };

  if (done) {
    return (
      <div className="flex min-h-[calc(100vh-3.5rem)] items-center justify-center bg-black px-4">
        <div className="w-full max-w-sm border border-white/10 bg-[#111] px-8 py-10 text-center">
          <div className="mb-4 text-4xl">📧</div>
          <h2 className="mb-2 text-xl font-bold text-white">이메일을 확인해주세요</h2>
          <p className="mb-6 text-sm text-white/50">
            <span className="font-medium text-white/80">{email}</span>으로 인증 링크를 보냈습니다.
          </p>
          <Link
            href="/login"
            className="inline-block bg-[#CCFF00] px-6 py-2.5 text-sm font-semibold text-black hover:bg-[#b3e600]"
          >
            로그인으로 이동
          </Link>
        </div>
      </div>
    );
  }

  const inputClass = "w-full border border-white/15 bg-[#1a1a1a] px-4 py-2.5 text-sm text-white outline-none transition-colors placeholder:text-white/25 focus:border-[#CCFF00]";
  const labelClass = "mb-1.5 block text-xs font-medium tracking-widest text-white/50 uppercase";

  return (
    <div className="flex min-h-[calc(100vh-3.5rem)] items-center justify-center bg-black px-4">
      <div className="w-full max-w-sm">
        <div className="border border-white/10 bg-[#111] px-8 py-10">
          <h1 className="font-bebas mb-1 text-center text-3xl tracking-[0.15em] text-white">JOIN</h1>
          <p className="mb-8 text-center text-xs text-white/40">
            EXODUS <span className="text-[#CCFF00]">ENT</span> 계정을 만들어보세요
          </p>

          <form onSubmit={handleSignup} className="space-y-4">
            <div>
              <label className={labelClass}>닉네임</label>
              <input type="text" value={nickname} onChange={(e) => setNickname(e.target.value)}
                placeholder="닉네임을 입력하세요" required maxLength={20} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>이메일</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                placeholder="email@example.com" required className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>비밀번호</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}
                placeholder="6자 이상" required className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>비밀번호 확인</label>
              <input
                type="password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                placeholder="비밀번호 재입력"
                required
                className={`${inputClass} ${confirm && confirm !== password ? 'border-red-500/40 focus:border-red-500' : ''}`}
              />
              {confirm && confirm !== password && (
                <p className="mt-1 text-xs text-red-400">비밀번호가 일치하지 않습니다.</p>
              )}
            </div>

            {error && (
              <p className="border border-red-500/20 bg-red-500/10 px-3 py-2 text-xs text-red-400">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#CCFF00] py-2.5 text-sm font-semibold text-black transition-colors hover:bg-[#b3e600] disabled:opacity-60"
            >
              {loading ? '가입 중...' : '회원가입'}
            </button>
          </form>

          <p className="mt-6 text-center text-xs text-white/40">
            이미 계정이 있으신가요?{' '}
            <Link href="/login" className="font-semibold text-[#CCFF00] hover:underline">로그인</Link>
          </p>
          <p className="mt-2 text-center text-xs text-white/20">관리자 계정은 회원가입으로 생성할 수 없습니다.</p>
        </div>
      </div>
    </div>
  );
}
