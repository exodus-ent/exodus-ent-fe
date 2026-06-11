'use client';

export interface ReviewImage {
  id: string;
  url: string;
}

export interface Review {
  id: string;
  schedule_id: string;
  user_id: string;
  nickname: string;
  rating: number;
  content: string;
  created_at: string;
  images?: ReviewImage[];
}

interface Props {
  review: Review;
  currentUserId?: string;
  isAdmin?: boolean;
  onEdit: (review: Review) => void;
  onDelete: (id: string) => void;
}

export default function ReviewItem({ review, currentUserId, isAdmin = false, onEdit, onDelete }: Props) {
  const isOwner = !!currentUserId && currentUserId === review.user_id;
  const canDelete = isAdmin || isOwner;
  const canEdit = isOwner && !isAdmin;

  return (
    <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#CCFF00]/20 text-xs font-semibold text-[#CCFF00]">
            {review.nickname[0]}
          </div>
          <div>
            <p className="text-sm font-medium text-gray-900">{review.nickname}</p>
            <p className="text-xs text-gray-400">{review.created_at.slice(0, 10)}</p>
          </div>
        </div>
        <div className="flex shrink-0">
          {Array.from({ length: 5 }).map((_, i) => (
            <span
              key={i}
              className={`text-sm ${i < review.rating ? 'text-yellow-400' : 'text-gray-200'}`}
            >
              ★
            </span>
          ))}
        </div>
      </div>

      <p className="mt-3 text-sm leading-relaxed text-gray-700">{review.content}</p>

      {review.images && review.images.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-2">
          {review.images.map((img) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              key={img.id}
              src={img.url}
              alt="후기 이미지"
              className="h-20 w-20 rounded-lg object-cover"
            />
          ))}
        </div>
      )}

      {canDelete && (
        <div className="mt-3 flex justify-end gap-3 border-t border-gray-50 pt-3">
          {canEdit && (
            <button
              onClick={() => onEdit(review)}
              className="text-xs font-medium text-[#CCFF00] hover:underline"
            >
              수정
            </button>
          )}
          <button
            onClick={() => onDelete(review.id)}
            className="text-xs font-medium text-red-500 hover:underline"
          >
            삭제
          </button>
        </div>
      )}
    </div>
  );
}
