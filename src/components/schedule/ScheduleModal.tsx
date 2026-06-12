'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { useScheduleStore } from '@/store/useScheduleStore';
import { useAuthStore } from '@/store/useAuthStore';
import { useBookmark } from '@/hooks/useBookmark';
import { createClient } from '@/lib/supabase';
import ReviewList from '@/components/review/ReviewList';

const CATEGORY_COLOR: Record<string, string> = {
  방송: 'bg-blue-100 text-blue-700',
  콘서트: 'bg-purple-100 text-purple-700',
  팬싸인회: 'bg-pink-100 text-pink-700',
  발매: 'bg-green-100 text-green-700',
};

export default function ScheduleModal() {
  const { selectedSchedule, isModalOpen, setIsModalOpen, setSelectedSchedule, schedules, setSchedules } =
    useScheduleStore();
  const { user } = useAuthStore();
  const { bookmarked, toggle: toggleBookmark } = useBookmark(
    isModalOpen ? (selectedSchedule?.id ?? null) : null,
  );
  const backdropRef = useRef<HTMLDivElement>(null);

  const close = () => {
    setIsModalOpen(false);
    setSelectedSchedule(null);
  };

  const handleDelete = async () => {
    if (!selectedSchedule || !confirm('스케줄을 삭제할까요?')) return;
    const supabase = createClient();
    const { error } = await supabase.from('schedules').delete().eq('id', selectedSchedule.id);
    if (!error) {
      setSchedules(schedules.filter((s) => s.id !== selectedSchedule.id));
      close();
    }
  };

  useEffect(() => {
    if (!isModalOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isModalOpen]);

  useEffect(() => {
    document.body.style.overflow = isModalOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [isModalOpen]);

  if (!isModalOpen || !selectedSchedule) return null;

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === backdropRef.current) close();
  };

  const dateTime = [selectedSchedule.date, selectedSchedule.time].filter(Boolean).join(' ');
  const colorClass = CATEGORY_COLOR[selectedSchedule.category] ?? 'bg-gray-100 text-gray-700';

  return (
    <div
      ref={backdropRef}
      onClick={handleBackdropClick}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm"
    >
      <div className="relative flex max-h-[90vh] w-full max-w-lg flex-col border border-white/10 bg-[#111] shadow-xl">
        {/* 헤더 */}
        <div className="flex shrink-0 items-start justify-between border-b border-white/10 px-6 py-5">
          <div className="flex-1 pr-4">
            <span
              className={`mb-2 inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${colorClass}`}
            >
              {selectedSchedule.category}
            </span>
            <h2 className="text-lg font-bold leading-snug text-white">
              {selectedSchedule.title}
            </h2>
            <p className="mt-0.5 text-sm font-medium text-[#CCFF00]">{selectedSchedule.idol}</p>
          </div>
          <button
            onClick={close}
            className="shrink-0 rounded-full p-1.5 text-white/40 hover:bg-white/10 hover:text-white"
            aria-label="닫기"
          >
            <svg
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* 본문 (스크롤) */}
        <div className="flex-1 overflow-y-auto px-6 py-5 [&::-webkit-scrollbar]:hidden">
          <div className="space-y-3">
            <InfoRow icon="📅" label="일시" value={dateTime || '-'} />
            <InfoRow icon="📍" label="장소" value={selectedSchedule.location ?? '-'} />
            {selectedSchedule.description && (
              <InfoRow icon="📝" label="설명" value={selectedSchedule.description} />
            )}
            {selectedSchedule.detailUrl && (
              <div className="flex items-start gap-3">
                <span className="text-base">🔗</span>
                <div>
                  <p className="mb-0.5 text-xs text-gray-400">링크</p>
                  <a
                    href={selectedSchedule.detailUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-[#CCFF00] underline hover:text-[#CCFF00]"
                  >
                    자세히 보기
                  </a>
                </div>
              </div>
            )}
          </div>

          {/* 후기 섹션 */}
          <div className="mt-6 border-t border-white/10 pt-6">
            <ReviewList scheduleId={selectedSchedule.id} />
          </div>
        </div>

        {/* 푸터 */}
        <div className="flex shrink-0 items-center justify-between border-t border-white/10 px-6 py-4">
          {user ? (
            <button
              onClick={toggleBookmark}
              className={`flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                bookmarked
                  ? 'bg-[#CCFF00] text-black'
                  : 'border border-gray-300 text-gray-600 hover:bg-gray-50'
              }`}
            >
              <span>{bookmarked ? '★' : '☆'}</span>
              {bookmarked ? '북마크됨' : '북마크'}
            </button>
          ) : (
            <p className="text-xs text-white/30">북마크는 로그인 후 이용하세요.</p>
          )}
          <div className="flex items-center gap-2">
            {user?.isAdmin && selectedSchedule && (
              <>
                <Link
                  href={`/admin/schedule/${selectedSchedule.id}/edit`}
                  onClick={close}
                  className="border border-white/15 px-3 py-1.5 text-xs font-medium text-white/60 transition-colors hover:bg-white/10"
                >
                  수정
                </Link>
                <button
                  onClick={handleDelete}
                  className="border border-red-500/20 px-3 py-1.5 text-xs font-medium text-red-400 transition-colors hover:bg-red-500/10"
                >
                  삭제
                </button>
              </>
            )}
            <button
              onClick={close}
              className="bg-white/10 px-4 py-2 text-sm font-medium text-white/70 transition-colors hover:bg-white/15"
            >
              닫기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function InfoRow({ icon, label, value }: { icon: string; label: string; value: string }) {
  return (
    <div className="flex items-start gap-3">
      <span className="text-base">{icon}</span>
      <div>
        <p className="mb-0.5 text-xs text-white/40">{label}</p>
        <p className="text-sm text-white/80">{value}</p>
      </div>
    </div>
  );
}
