'use client';

import { useCallback, useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase';
import { useAuthStore } from '@/store/useAuthStore';
import ReviewItem, { type Review } from './ReviewItem';
import ReviewForm from './ReviewForm';

type SortKey = 'latest' | 'rating';

interface Props {
  scheduleId: string;
}

export default function ReviewList({ scheduleId }: Props) {
  const { user } = useAuthStore();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [sort, setSort] = useState<SortKey>('latest');
  const [loading, setLoading] = useState(true);
  const [editingReview, setEditingReview] = useState<Review | null>(null);

  const fetchReviews = useCallback(async () => {
    setLoading(true);
    const supabase = createClient();
    const { data } = await supabase
      .from('reviews')
      .select('*, review_images(id, url)')
      .eq('schedule_id', scheduleId)
      .order(sort === 'latest' ? 'created_at' : 'rating', { ascending: false });

    setReviews(
      (data ?? []).map((r) => ({ ...r, images: r.review_images as Review['images'] })),
    );
    setLoading(false);
  }, [scheduleId, sort]);

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

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold text-gray-800">
          후기 <span className="text-indigo-600">{reviews.length}</span>개
        </p>
        <div className="flex gap-1 rounded-lg bg-gray-100 p-1">
          {(['latest', 'rating'] as SortKey[]).map((key) => (
            <button
              key={key}
              onClick={() => setSort(key)}
              className={`rounded-md px-2.5 py-1 text-xs font-medium transition-colors ${
                sort === key
                  ? 'bg-white text-indigo-600 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {key === 'latest' ? '최신순' : '별점순'}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <p className="py-4 text-center text-sm text-gray-400">불러오는 중...</p>
      ) : reviews.length === 0 ? (
        <p className="py-4 text-center text-sm text-gray-400">
          아직 후기가 없어요. 첫 번째 후기를 남겨보세요!
        </p>
      ) : (
        <div className="space-y-3">
          {reviews.map((review) =>
            editingReview?.id === review.id ? (
              <ReviewForm
                key={review.id}
                scheduleId={scheduleId}
                editingReview={editingReview}
                onSubmit={() => {
                  setEditingReview(null);
                  fetchReviews();
                }}
                onCancel={() => setEditingReview(null)}
              />
            ) : (
              <ReviewItem
                key={review.id}
                review={review}
                currentUserId={user?.id}
                onEdit={setEditingReview}
                onDelete={handleDelete}
              />
            ),
          )}
        </div>
      )}

      {user && !editingReview && (
        <div className="pt-2">
          <ReviewForm scheduleId={scheduleId} onSubmit={fetchReviews} />
        </div>
      )}

      {!user && (
        <p className="py-2 text-center text-xs text-gray-400">
          후기 작성은 로그인 후 이용하세요.
        </p>
      )}
    </div>
  );
}
