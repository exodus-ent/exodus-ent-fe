'use client';

import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase';
import { useAuthStore } from '@/store/useAuthStore';
import { useScheduleStore } from '@/store/useScheduleStore';
import ReviewItem, { type Review } from '@/components/review/ReviewItem';
import ReviewForm from '@/components/review/ReviewForm';

type SortKey = 'latest' | 'rating';

interface ReviewWithSchedule extends Review {
  schedules: {
    id: string;
    title: string;
    idol: string;
    category: string;
    date: string;
    time?: string;
    location?: string;
    description?: string;
    thumbnail_url?: string;
    detail_url?: string;
  } | null;
}

export default function ReviewsPage() {
  const { user, isLoading: authLoading } = useAuthStore();
  const router = useRouter();
  const { setSelectedSchedule, setIsModalOpen } = useScheduleStore();
  const [reviews, setReviews] = useState<ReviewWithSchedule[]>([]);
  const [sort, setSort] = useState<SortKey>('latest');
  const [loading, setLoading] = useState(true);
  const [editingReview, setEditingReview] = useState<Review | null>(null);

  const fetchReviews = useCallback(async () => {
    setLoading(true);
    const supabase = createClient();
    const { data } = await supabase
      .from('reviews')
      .select('*, review_images(id, url), schedules(id, title, idol, category, date, time, location, description, thumbnail_url, detail_url)')
      .order(sort === 'latest' ? 'created_at' : 'rating', { ascending: false });

    setReviews(
      (data ?? []).map((r) => ({
        ...r,
        images: r.review_images as Review['images'],
        schedules: r.schedules ?? null,
      })),
    );
    setLoading(false);
  }, [sort]);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  const handleDelete = async (id: string) => {
    if (!confirm('후기를 삭제할까요?')) return;
    const supabase = createClient();
    await supabase.from('review_images').delete().eq('review_id', id);
    await supabase.from('reviews').delete().eq('id', id);
    await fetchReviews();
  };

  const openSchedule = (review: ReviewWithSchedule) => {
    const s = review.schedules;
    if (!s) return;
    setSelectedSchedule({
      id: s.id,
      title: s.title,
      idol: s.idol,
      category: s.category,
      date: s.date,
      time: s.time,
      location: s.location,
      description: s.description,
      thumbnailUrl: s.thumbnail_url,
      detailUrl: s.detail_url,
    });
    setIsModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-black">
      <div className="mx-auto max-w-3xl px-4 py-8">
        {/* 헤더 */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="font-bebas text-4xl tracking-[0.15em] text-white">REVIEWS</h1>
            <p className="mt-1 text-sm text-white/40">팬들이 남긴 생생한 후기를 확인해보세요.</p>
          </div>
          <div className="flex items-center gap-3">
            {/* 후기 작성 버튼: 비로그인 또는 일반 유저만 표시, 관리자 숨김 */}
            {!authLoading && !user?.isAdmin && (
              <button
                onClick={() => user ? router.push('/reviews/write') : router.push('/login')}
                className="rounded-lg bg-[#CCFF00] px-4 py-2 text-xs font-semibold text-black transition-colors hover:bg-[#b3e600]"
              >
                + 후기 작성
              </button>
            )}
            <div className="flex gap-1 border border-white/10 bg-[#111] p-1">
              {(['latest', 'rating'] as SortKey[]).map((key) => (
                <button
                  key={key}
                  onClick={() => setSort(key)}
                  className={`px-3 py-1.5 text-xs font-medium transition-colors ${
                    sort === key
                      ? 'bg-[#CCFF00] text-black'
                      : 'text-white/40 hover:text-white/70'
                  }`}
                >
                  {key === 'latest' ? '최신순' : '별점순'}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 목록 */}
        {loading ? (
          <div className="space-y-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-28 animate-pulse bg-white/5" />
            ))}
          </div>
        ) : reviews.length === 0 ? (
          <div className="border border-white/10 bg-[#111] p-12 text-center">
            <p className="text-sm text-white/40">아직 후기가 없어요. 첫 번째 후기를 남겨보세요!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {reviews.map((review) => (
              <div key={review.id} className="border border-white/10 bg-[#111]">
                {/* 스케줄 정보 */}
                {review.schedules && (
                  <button
                    onClick={() => openSchedule(review)}
                    className="flex w-full items-center gap-2 border-b border-white/5 px-4 py-2.5 text-left transition-colors hover:bg-white/5"
                  >
                    <span className="rounded-full bg-[#CCFF00]/10 px-2 py-0.5 text-xs font-medium text-[#CCFF00]">
                      {review.schedules.category}
                    </span>
                    <span className="flex-1 truncate text-xs font-medium text-white/70">
                      {review.schedules.title}
                    </span>
                    <span className="shrink-0 text-xs text-white/40">
                      {review.schedules.date}
                    </span>
                    <svg
                      className="h-3.5 w-3.5 shrink-0 text-white/30"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                )}

                {/* 후기 카드 */}
                <div className="p-4">
                  {editingReview?.id === review.id ? (
                    <ReviewForm
                      scheduleId={review.schedule_id}
                      editingReview={editingReview}
                      onSubmit={() => {
                        setEditingReview(null);
                        fetchReviews();
                      }}
                      onCancel={() => setEditingReview(null)}
                    />
                  ) : (
                    <ReviewItem
                      review={review}
                      currentUserId={user?.id}
                      isAdmin={user?.isAdmin ?? false}
                      onEdit={setEditingReview}
                      onDelete={handleDelete}
                    />
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
