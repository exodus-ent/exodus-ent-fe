'use client';

import { UserCircle2 } from 'lucide-react';

export interface ReviewImage {
  id: string;
  image_url: string;
}

export interface Review {
  id: string;
  schedule_id: string;
  user_id: string;
  nickname: string;
  avatar_url?: string;
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
    <div className="p-4">
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2.5">
          {review.avatar_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={review.avatar_url} alt={review.nickname} className="h-6 w-6 shrink-0 rounded-full object-cover" />
          ) : (
            <UserCircle2 className="h-6 w-6 shrink-0 text-white/40" />
          )}
          <div>
            <p className="text-sm font-medium text-white">{review.nickname}</p>
            <p className="text-xs text-white/40">{review.created_at.slice(0, 10)}</p>
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

      {review.images && review.images.length > 0 ? (
        <div className="mt-3 flex gap-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={review.images[0].image_url}
            alt="후기 이미지"
            className="h-24 w-24 shrink-0 rounded-lg object-cover"
          />
          <p className="text-sm leading-relaxed text-white/80">{review.content}</p>
        </div>
      ) : (
        <p className="mt-3 text-sm leading-relaxed text-white/80">{review.content}</p>
      )}

      {canDelete && (
        <div className="mt-3 flex justify-end gap-3 border-t border-white/5 pt-3">
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
            className="text-xs font-medium text-red-400 hover:underline"
          >
            삭제
          </button>
        </div>
      )}
    </div>
  );
}
