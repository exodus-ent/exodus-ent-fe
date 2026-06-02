'use client';

import { useEffect, useRef, useState } from 'react';
import { useScheduleStore } from '@/store/useScheduleStore';
import { useAuthStore } from '@/store/useAuthStore';

const CATEGORY_COLOR: Record<string, string> = {
  방송: 'bg-blue-100 text-blue-700',
  콘서트: 'bg-purple-100 text-purple-700',
  팬싸인회: 'bg-pink-100 text-pink-700',
  발매: 'bg-green-100 text-green-700',
};

export default function ScheduleModal() {
  const { selectedSchedule, isModalOpen, setIsModalOpen, setSelectedSchedule } =
    useScheduleStore();
  const { user } = useAuthStore();
  const [bookmarked, setBookmarked] = useState(false);
  const backdropRef = useRef<HTMLDivElement>(null);

  const close = () => {
    setIsModalOpen(false);
    setSelectedSchedule(null);
  };

  useEffect(() => {
    if (!isModalOpen) return;
    setBookmarked(false);

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isModalOpen]);

  // 스크롤 잠금
  useEffect(() => {
    document.body.style.overflow = isModalOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isModalOpen]);

  if (!isModalOpen || !selectedSchedule) return null;

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === backdropRef.current) close();
  };

  const dateTime = [
    selectedSchedule.date,
    selectedSchedule.time,
  ]
    .filter(Boolean)
    .join(' ');

  const colorClass =
    CATEGORY_COLOR[selectedSchedule.category] ?? 'bg-gray-100 text-gray-700';

  return (
    <div
      ref={backdropRef}
      onClick={handleBackdropClick}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm"
    >
      <div className="relative w-full max-w-md rounded-2xl bg-white shadow-xl">
        {/* 헤더 */}
        <div className="flex items-start justify-between border-b border-gray-100 px-6 py-5">
          <div className="flex-1 pr-4">
            <span className={`mb-2 inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${colorClass}`}>
              {selectedSchedule.category}
            </span>
            <h2 className="text-lg font-bold text-gray-900 leading-snug">
              {selectedSchedule.title}
            </h2>
            <p className="mt-0.5 text-sm text-indigo-600 font-medium">{selectedSchedule.idol}</p>
          </div>
          <button
            onClick={close}
            className="shrink-0 rounded-full p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
            aria-label="닫기"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* 본문 */}
        <div className="space-y-3 px-6 py-5">
          <InfoRow icon="📅" label="일시" value={dateTime || '-'} />
          <InfoRow icon="📍" label="장소" value={selectedSchedule.location ?? '-'} />
          {selectedSchedule.description && (
            <InfoRow icon="📝" label="설명" value={selectedSchedule.description} />
          )}
          {selectedSchedule.detailUrl && (
            <div className="flex items-start gap-3">
              <span className="text-base">🔗</span>
              <div>
                <p className="text-xs text-gray-400 mb-0.5">링크</p>
                <a
                  href={selectedSchedule.detailUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-indigo-600 underline hover:text-indigo-800"
                >
                  자세히 보기
                </a>
              </div>
            </div>
          )}
        </div>

        {/* 푸터 */}
        <div className="flex items-center justify-between border-t border-gray-100 px-6 py-4">
          {user ? (
            <button
              onClick={() => setBookmarked((prev) => !prev)}
              className={`flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                bookmarked
                  ? 'bg-indigo-600 text-white'
                  : 'border border-gray-300 text-gray-600 hover:bg-gray-50'
              }`}
            >
              <span>{bookmarked ? '★' : '☆'}</span>
              {bookmarked ? '북마크됨' : '북마크'}
            </button>
          ) : (
            <p className="text-xs text-gray-400">북마크는 로그인 후 이용하세요.</p>
          )}
          <button
            onClick={close}
            className="rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-200"
          >
            닫기
          </button>
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
        <p className="text-xs text-gray-400 mb-0.5">{label}</p>
        <p className="text-sm text-gray-800">{value}</p>
      </div>
    </div>
  );
}
