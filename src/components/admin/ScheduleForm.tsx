'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase';

const CATEGORIES = ['방송', '콘서트', '팬싸인회', '발매'];

export interface ScheduleFormValues {
  title: string;
  idol: string;
  category: string;
  date: string;
  time: string;
  location: string;
  description: string;
  thumbnail_url: string;
  detail_url: string;
}

interface Props {
  mode: 'new' | 'edit';
  scheduleId?: string;
  defaultValues?: Partial<ScheduleFormValues>;
}

export default function ScheduleForm({ mode, scheduleId, defaultValues = {} }: Props) {
  const router = useRouter();
  const [form, setForm] = useState<ScheduleFormValues>({
    title: defaultValues.title ?? '',
    idol: defaultValues.idol ?? '',
    category: defaultValues.category ?? CATEGORIES[0],
    date: defaultValues.date ?? '',
    time: defaultValues.time ?? '',
    location: defaultValues.location ?? '',
    description: defaultValues.description ?? '',
    thumbnail_url: defaultValues.thumbnail_url ?? '',
    detail_url: defaultValues.detail_url ?? '',
  });
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(
    defaultValues.thumbnail_url ?? null,
  );
  const [idols, setIdols] = useState<{ id: string; name: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    createClient()
      .from('idols')
      .select('id, name')
      .order('name')
      .then(({ data }) => setIdols(data ?? []));
  }, []);

  const set = (key: keyof ScheduleFormValues) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => setForm((prev) => ({ ...prev, [key]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const supabase = createClient();

    try {
      let thumbnailUrl = form.thumbnail_url;

      if (thumbnailFile) {
        const ext = thumbnailFile.name.split('.').pop();
        const path = `thumbnails/${Date.now()}.${ext}`;
        const { error: uploadError } = await supabase.storage
          .from('schedule-thumbnails')
          .upload(path, thumbnailFile, { upsert: true });
        if (uploadError) throw uploadError;
        const { data: urlData } = supabase.storage
          .from('schedule-thumbnails')
          .getPublicUrl(path);
        thumbnailUrl = urlData.publicUrl;
      }

      const payload = {
        title: form.title,
        idol: form.idol,
        category: form.category,
        date: form.date,
        time: form.time || null,
        location: form.location || null,
        description: form.description || null,
        thumbnail_url: thumbnailUrl || null,
        detail_url: form.detail_url || null,
      };

      if (mode === 'new') {
        const { error: insertError } = await supabase.from('schedules').insert(payload);
        if (insertError) throw insertError;
      } else {
        const { error: updateError } = await supabase
          .from('schedules')
          .update(payload)
          .eq('id', scheduleId);
        if (updateError) throw updateError;
      }

      router.push('/admin');
    } catch (err) {
      setError((err as Error).message ?? '오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label className="mb-1.5 block text-xs font-medium tracking-widest text-white/50 uppercase">제목 *</label>
          <input
            value={form.title}
            onChange={set('title')}
            required
            placeholder="스케줄 제목"
            className="w-full border border-white/15 bg-[#1a1a1a] px-4 py-2.5 text-sm text-white outline-none transition-colors placeholder:text-white/25 focus:border-[#CCFF00]"
          />
        </div>

        <div>
          <label className="mb-1.5 block text-xs font-medium tracking-widest text-white/50 uppercase">아이돌 *</label>
          <select
            value={form.idol}
            onChange={set('idol')}
            required
            className="w-full border border-white/15 bg-[#1a1a1a] px-4 py-2.5 text-sm text-white outline-none transition-colors focus:border-[#CCFF00]"
          >
            <option value="">아이돌을 선택하세요</option>
            {idols.map((idol) => (
              <option key={idol.id} value={idol.name}>
                {idol.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-1.5 block text-xs font-medium tracking-widest text-white/50 uppercase">카테고리 *</label>
          <select
            value={form.category}
            onChange={set('category')}
            className="w-full border border-white/15 bg-[#1a1a1a] px-4 py-2.5 text-sm text-white outline-none transition-colors placeholder:text-white/25 focus:border-[#CCFF00]"
          >
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-1.5 block text-xs font-medium tracking-widest text-white/50 uppercase">날짜 *</label>
          <input
            type="date"
            value={form.date}
            onChange={set('date')}
            required
            className="w-full border border-white/15 bg-[#1a1a1a] px-4 py-2.5 text-sm text-white outline-none transition-colors placeholder:text-white/25 focus:border-[#CCFF00]"
          />
        </div>

        <div>
          <label className="mb-1.5 block text-xs font-medium tracking-widest text-white/50 uppercase">시간</label>
          <input
            type="time"
            value={form.time}
            onChange={set('time')}
            className="w-full border border-white/15 bg-[#1a1a1a] px-4 py-2.5 text-sm text-white outline-none transition-colors placeholder:text-white/25 focus:border-[#CCFF00]"
          />
        </div>

        <div className="sm:col-span-2">
          <label className="mb-1.5 block text-xs font-medium tracking-widest text-white/50 uppercase">장소</label>
          <input
            value={form.location}
            onChange={set('location')}
            placeholder="공연 장소"
            className="w-full border border-white/15 bg-[#1a1a1a] px-4 py-2.5 text-sm text-white outline-none transition-colors placeholder:text-white/25 focus:border-[#CCFF00]"
          />
        </div>

        <div className="sm:col-span-2">
          <label className="mb-1.5 block text-xs font-medium tracking-widest text-white/50 uppercase">설명</label>
          <textarea
            value={form.description}
            onChange={set('description')}
            rows={3}
            placeholder="스케줄 설명"
            className="w-full resize-none border border-white/15 bg-[#1a1a1a] px-4 py-2.5 text-sm text-white outline-none transition-colors placeholder:text-white/25 focus:border-[#CCFF00]"
          />
        </div>

        <div className="sm:col-span-2">
          <label className="mb-1.5 block text-xs font-medium tracking-widest text-white/50 uppercase">상세 URL</label>
          <input
            type="url"
            value={form.detail_url}
            onChange={set('detail_url')}
            placeholder="https://..."
            className="w-full border border-white/15 bg-[#1a1a1a] px-4 py-2.5 text-sm text-white outline-none transition-colors placeholder:text-white/25 focus:border-[#CCFF00]"
          />
        </div>

        {/* 썸네일 */}
        <div className="sm:col-span-2">
          <label className="mb-1.5 block text-xs font-medium tracking-widest text-white/50 uppercase">썸네일 이미지</label>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0] ?? null;
              setThumbnailFile(file);
              if (file) setThumbnailPreview(URL.createObjectURL(file));
            }}
          />
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="border border-white/15 px-4 py-2 text-sm text-white/60 transition-colors hover:border-white/30 hover:text-white"
            >
              이미지 선택
            </button>
            {thumbnailPreview && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={thumbnailPreview}
                alt="썸네일 미리보기"
                className="h-16 w-16 rounded-lg object-cover"
              />
            )}
          </div>
        </div>
      </div>

      {error && (
        <p className="border border-red-500/20 bg-red-500/10 px-3 py-2 text-sm text-red-400">{error}</p>
      )}

      <div className="flex justify-end gap-3 border-t border-white/10 pt-4">
        <button
          type="button"
          onClick={() => router.push('/admin')}
          className="border border-white/15 px-5 py-2.5 text-sm text-white/60 transition-colors hover:text-white"
        >
          취소
        </button>
        <button
          type="submit"
          disabled={loading}
          className="rounded-lg bg-[#CCFF00] px-5 py-2.5 text-sm font-semibold text-black transition-colors hover:bg-[#b3e600] disabled:opacity-60"
        >
          {loading ? '저장 중...' : mode === 'new' ? '등록' : '수정 완료'}
        </button>
      </div>
    </form>
  );
}
