'use client';

import { useRef, useState } from 'react';
import { createClient } from '@/lib/supabase';
import { useAuthStore } from '@/store/useAuthStore';
import type { Review } from './ReviewItem';

interface Props {
  scheduleId: string;
  editingReview?: Review | null;
  onSubmit: () => void;
  onCancel?: () => void;
}

export default function ReviewForm({ scheduleId, editingReview, onSubmit, onCancel }: Props) {
  const { user } = useAuthStore();
  const [rating, setRating] = useState(editingReview?.rating ?? 5);
  const [hoverRating, setHoverRating] = useState(0);
  const [content, setContent] = useState(editingReview?.content ?? '');
  const [newImages, setNewImages] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);

  if (!user) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;
    setError('');
    setLoading(true);

    const supabase = createClient();

    try {
      let reviewId: string;

      if (editingReview) {
        const { error: updateError } = await supabase
          .from('reviews')
          .update({ rating, content })
          .eq('id', editingReview.id);
        if (updateError) throw updateError;
        reviewId = editingReview.id;
      } else {
        const { data, error: insertError } = await supabase
          .from('reviews')
          .insert({
            schedule_id: scheduleId,
            user_id: user.id,
            nickname: user.nickname,
            rating,
            content,
          })
          .select('id')
          .single();
        if (insertError) throw insertError;
        reviewId = data.id;
      }

      for (const file of newImages) {
        const ext = file.name.split('.').pop();
        const path = `${user.id}/${reviewId}/${Date.now()}.${ext}`;
        const { error: uploadError } = await supabase.storage
          .from('review-images')
          .upload(path, file);
        if (uploadError) throw uploadError;
        const { data: urlData } = supabase.storage.from('review-images').getPublicUrl(path);
        await supabase.from('review_images').insert({ review_id: reviewId, url: urlData.publicUrl });
      }

      setContent('');
      setRating(5);
      setNewImages([]);
      onSubmit();
    } catch (err) {
      setError((err as Error).message ?? '오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-xl border border-indigo-100 bg-indigo-50/50 p-4"
    >
      <p className="mb-3 text-sm font-semibold text-gray-800">
        {editingReview ? '후기 수정' : '후기 작성'}
      </p>

      <div className="mb-3 flex items-center gap-1">
        {Array.from({ length: 5 }).map((_, i) => {
          const value = i + 1;
          return (
            <button
              key={i}
              type="button"
              onClick={() => setRating(value)}
              onMouseEnter={() => setHoverRating(value)}
              onMouseLeave={() => setHoverRating(0)}
              className={`text-2xl transition-colors ${
                value <= (hoverRating || rating) ? 'text-yellow-400' : 'text-gray-300'
              }`}
            >
              ★
            </button>
          );
        })}
        <span className="ml-1 self-center text-sm text-gray-500">{rating}점</span>
      </div>

      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="후기를 작성해주세요..."
        required
        rows={3}
        className="w-full resize-none rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm outline-none transition-colors placeholder:text-gray-400 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
      />

      <div className="mt-2">
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(e) => setNewImages(Array.from(e.target.files ?? []))}
        />
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          className="flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs text-gray-500 transition-colors hover:bg-gray-50"
        >
          <svg
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
            />
          </svg>
          이미지 첨부{newImages.length > 0 && ` (${newImages.length})`}
        </button>
        {newImages.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-2">
            {newImages.map((file, i) => (
              <div key={i} className="relative">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={URL.createObjectURL(file)}
                  alt={file.name}
                  className="h-16 w-16 rounded-lg object-cover"
                />
                <button
                  type="button"
                  onClick={() => setNewImages((prev) => prev.filter((_, idx) => idx !== i))}
                  className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] text-white"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {error && <p className="mt-2 text-xs text-red-500">{error}</p>}

      <div className="mt-3 flex justify-end gap-2">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="rounded-lg px-3 py-1.5 text-xs text-gray-500 hover:bg-gray-100"
          >
            취소
          </button>
        )}
        <button
          type="submit"
          disabled={loading}
          className="rounded-lg bg-indigo-600 px-4 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-indigo-700 disabled:opacity-60"
        >
          {loading ? '저장 중...' : editingReview ? '수정 완료' : '등록'}
        </button>
      </div>
    </form>
  );
}
