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

    if (password !== confirm) {
      setError('비밀번호가 일치하지 않습니다.');
      return;
    }
    if (password.length < 6) {
      setError('비밀번호는 6자 이상이어야 합니다.');
      return;
    }

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

    // 이메일 인증이 비활성화된 경우 세션이 즉시 반환됨
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

    // 이메일 인증 필요
    setDone(true);
    setLoading(false);
  };

  if (done) {
    return (
      <div className="flex min-h-[calc(100vh-3.5rem)] items-center justify-center bg-gray-50 px-4">
        <div className="w-full max-w-sm rounded-2xl bg-white px-8 py-10 text-center shadow-sm border border-gray-200">
          <div className="mb-4 text-4xl">📧</div>
          <h2 className="mb-2 text-xl font-bold text-gray-900">이메일을 확인해주세요</h2>
          <p className="mb-6 text-sm text-gray-500">
            <span className="font-medium text-gray-700">{email}</span>으로 인증 링크를 보냈습니다.
            메일을 확인한 뒤 로그인해주세요.
          </p>
          <Link
            href="/login"
            className="inline-block rounded-xl bg-indigo-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700"
          >
            로그인으로 이동
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-[calc(100vh-3.5rem)] items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-sm">
        <div className="rounded-2xl bg-white px-8 py-10 shadow-sm border border-gray-200">
          <h1 className="mb-1 text-center text-2xl font-bold text-gray-900">회원가입</h1>
          <p className="mb-8 text-center text-sm text-gray-500">
            엑소더스<span className="font-semibold text-indigo-600">Ent</span> 계정을 만들어보세요
          </p>

          <form onSubmit={handleSignup} className="space-y-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">닉네임</label>
              <input
                type="text"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                placeholder="닉네임을 입력하세요"
                required
                maxLength={20}
                className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm outline-none transition-colors placeholder:text-gray-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">이메일</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="email@example.com"
                required
                className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm outline-none transition-colors placeholder:text-gray-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">비밀번호</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="6자 이상"
                required
                className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm outline-none transition-colors placeholder:text-gray-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">비밀번호 확인</label>
              <input
                type="password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                placeholder="비밀번호 재입력"
                required
                className={`w-full rounded-xl border px-4 py-2.5 text-sm outline-none transition-colors placeholder:text-gray-400 focus:ring-2 ${
                  confirm && confirm !== password
                    ? 'border-red-400 focus:border-red-400 focus:ring-red-100'
                    : 'border-gray-300 focus:border-indigo-500 focus:ring-indigo-100'
                }`}
              />
              {confirm && confirm !== password && (
                <p className="mt-1 text-xs text-red-500">비밀번호가 일치하지 않습니다.</p>
              )}
            </div>

            {error && (
              <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-indigo-600 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-indigo-700 disabled:opacity-60"
            >
              {loading ? '가입 중...' : '회원가입'}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-500">
            이미 계정이 있으신가요?{' '}
            <Link href="/login" className="font-semibold text-indigo-600 hover:underline">
              로그인
            </Link>
          </p>

          <p className="mt-3 text-center text-xs text-gray-400">
            관리자 계정은 회원가입으로 생성할 수 없습니다.
          </p>
        </div>
      </div>
    </div>
  );
}
