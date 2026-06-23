'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase';
import { useAuthStore } from '@/store/useAuthStore';

interface Idol {
  id: string;
  name: string;
}

interface Schedule {
  id: string;
  title: string;
  date: string;
  category: string;
}

export default function WriteReviewPage() {
  const router = useRouter();
  const { user } = useAuthStore();

  const [authChecked, setAuthChecked] = useState(false);
  const [idols, setIdols] = useState<Idol[]>([]);
  const [schedules, setSchedules] = useState<Schedule[]>([]);

  const [selectedIdol, setSelectedIdol] = useState('');
  const [selectedScheduleId, setSelectedScheduleId] = useState('');
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [content, setContent] = useState('');
  const [images, setImages] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    createClient().auth.getUser().then(({ data }) => {
      if (!data.user) {
        router.push('/login');
        return;
      }
      setAuthChecked(true);
    });
  }, [router]);

  useEffect(() => {
    createClient()
      .from('idols')
      .select('id, name')
      .order('name')
      .then(({ data }) => setIdols(data ?? []));
  }, []);

  useEffect(() => {
    if (!selectedIdol) {
      setSchedules([]);
      setSelectedScheduleId('');
      return;
    }
    createClient()
      .from('schedules')
      .select('id, title, date, category')
      .eq('idol', selectedIdol)
      .order('date', { ascending: false })
      .then(({ data }) => {
        setSchedules(data ?? []);
        setSelectedScheduleId('');
      });
  }, [selectedIdol]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() || !user) return;
    setError('');
    setLoading(true);

    const supabase = createClient();

    try {
      const { data, error: insertError } = await supabase
        .from('reviews')
        .insert({
          schedule_id: selectedScheduleId || null,
          user_id: user.id,
          nickname: user.nickname,
          rating,
          content,
        })
        .select('id')
        .single();
      if (insertError) throw insertError;

      for (const file of images) {
        const ext = file.name.split('.').pop();
        const path = `${user.id}/${data.id}/${Date.now()}.${ext}`;
        const { error: uploadError } = await supabase.storage
          .from('review-images')
          .upload(path, file);
        if (uploadError) throw uploadError;
        const { data: urlData } = supabase.storage.from('review-images').getPublicUrl(path);
        await supabase.from('review_images').insert({ review_id: data.id, image_url: urlData.publicUrl });
      }

      router.push('/reviews');
    } catch (err) {
      setError((err as Error).message ?? '오류가 발생했습니다.');
      setLoading(false);
    }
  };

  if (!authChecked) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black">
        <p className="text-sm text-white/40">로딩 중...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6">
        {/* 브레드크럼 */}
        <div className="mb-6 flex items-center gap-2 text-xs text-white/30">
          <Link href="/reviews" className="transition-colors hover:text-white/60">후기</Link>
          <span>/</span>
          <span className="text-white/60">후기 작성</span>
        </div>

        <h1 className="font-bebas mb-8 text-4xl tracking-[0.15em] text-white">WRITE REVIEW</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* 아이돌 선택 */}
          <div>
            <label className="mb-2 block text-xs font-semibold tracking-widest text-white/50 uppercase">
              아이돌 *
            </label>
            <select
              value={selectedIdol}
              onChange={(e) => setSelectedIdol(e.target.value)}
              required
              className="w-full rounded-none border border-white/10 bg-[#111] px-4 py-3 text-sm text-white outline-none transition-colors focus:border-[#CCFF00]"
            >
              <option value="">아이돌을 선택하세요</option>
              {idols.map((idol) => (
                <option key={idol.id} value={idol.name}>
                  {idol.name}
                </option>
              ))}
            </select>
          </div>

          {/* 스케줄 선택 */}
          {selectedIdol && (
            <div>
              <label className="mb-2 block text-xs font-semibold tracking-widest text-white/50 uppercase">
                스케줄 (선택)
              </label>
              {schedules.length === 0 ? (
                <p className="text-xs text-white/30">등록된 스케줄이 없습니다.</p>
              ) : (
                <select
                  value={selectedScheduleId}
                  onChange={(e) => setSelectedScheduleId(e.target.value)}
                  className="w-full rounded-none border border-white/10 bg-[#111] px-4 py-3 text-sm text-white outline-none transition-colors focus:border-[#CCFF00]"
                >
                  <option value="">스케줄 없음</option>
                  {schedules.map((s) => (
                    <option key={s.id} value={s.id}>
                      [{s.category}] {s.title} — {s.date}
                    </option>
                  ))}
                </select>
              )}
            </div>
          )}

          {/* 별점 */}
          <div>
            <label className="mb-2 block text-xs font-semibold tracking-widest text-white/50 uppercase">
              별점 *
            </label>
            <div className="flex items-center gap-1">
              {Array.from({ length: 5 }).map((_, i) => {
                const val = i + 1;
                return (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setRating(val)}
                    onMouseEnter={() => setHoverRating(val)}
                    onMouseLeave={() => setHoverRating(0)}
                    className={`text-3xl transition-colors ${
                      val <= (hoverRating || rating) ? 'text-[#CCFF00]' : 'text-white/15'
                    }`}
                  >
                    ★
                  </button>
                );
              })}
              <span className="ml-2 text-sm text-white/40">{rating}점</span>
            </div>
          </div>

          {/* 내용 */}
          <div>
            <label className="mb-2 block text-xs font-semibold tracking-widest text-white/50 uppercase">
              내용 *
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
              rows={6}
              placeholder="후기를 작성해주세요..."
              className="w-full resize-none rounded-none border border-white/10 bg-[#111] px-4 py-3 text-sm text-white outline-none transition-colors placeholder:text-white/20 focus:border-[#CCFF00]"
            />
          </div>

          {/* 이미지 업로드 */}
          <div>
            <label className="mb-2 block text-xs font-semibold tracking-widest text-white/50 uppercase">
              이미지 (선택)
            </label>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={(e) => setImages(Array.from(e.target.files ?? []))}
            />
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="flex items-center gap-2 border border-white/10 px-4 py-2.5 text-xs text-white/50 transition-colors hover:border-white/30 hover:text-white/70"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
              </svg>
              이미지 첨부{images.length > 0 && ` (${images.length})`}
            </button>
            {images.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {images.map((file, i) => (
                  <div key={i} className="relative">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={URL.createObjectURL(file)}
                      alt={file.name}
                      className="h-20 w-20 object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => setImages((prev) => prev.filter((_, idx) => idx !== i))}
                      className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs text-white"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {error && (
            <p className="rounded border border-red-500/30 bg-red-500/10 px-3 py-2 text-xs text-red-400">
              {error}
            </p>
          )}

          {/* 버튼 */}
          <div className="flex justify-end gap-3 border-t border-white/5 pt-6">
            <Link
              href="/reviews"
              className="px-5 py-2.5 text-sm text-white/40 transition-colors hover:text-white/70"
            >
              취소
            </Link>
            <button
              type="submit"
              disabled={loading}
              className="bg-[#CCFF00] px-6 py-2.5 text-sm font-semibold text-black transition-colors hover:bg-[#b3e600] disabled:opacity-60"
            >
              {loading ? '등록 중...' : '후기 등록'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
