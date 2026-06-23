'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { createClient } from '@/lib/supabase';
import { useAuthStore } from '@/store/useAuthStore';
import { useScheduleStore } from '@/store/useScheduleStore';
import ReviewItem, { type Review } from '@/components/review/ReviewItem';
import ReviewForm from '@/components/review/ReviewForm';
import LoginRequired from '@/components/common/LoginRequired';

type Tab = 'reviews' | 'bookmarks' | 'profile';

interface BookmarkedSchedule {
  id: string;
  schedule_id: string;
  schedules: {
    id: string;
    title: string;
    date: string;
    time?: string;
    location?: string;
    category: string;
    idol: string;
    description?: string;
    thumbnail_url?: string;
    detail_url?: string;
  };
}

interface Profile {
  id: string;
  nickname: string;
  avatar_url?: string;
}

export default function MypagePage() {
  const { user, setUser } = useAuthStore();
  const { setSelectedSchedule, setIsModalOpen } = useScheduleStore();
  const [tab, setTab] = useState<Tab>('reviews');
  const [authChecked, setAuthChecked] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);

  // ── 내 후기 ──
  const [reviews, setReviews] = useState<Review[]>([]);
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const [editingReview, setEditingReview] = useState<Review | null>(null);

  // ── 북마크 ──
  const [bookmarks, setBookmarks] = useState<BookmarkedSchedule[]>([]);
  const [bookmarksLoading, setBookmarksLoading] = useState(false);

  // ── 프로필 수정 ──
  const [profile, setProfile] = useState<Profile | null>(null);
  const [nickname, setNickname] = useState('');
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileMsg, setProfileMsg] = useState('');
  const avatarRef = useRef<HTMLInputElement>(null);

  // 인증 확인
  useEffect(() => {
    createClient().auth.getUser().then(({ data }) => {
      setLoggedIn(!!data.user);
      setAuthChecked(true);
    });
  }, []);

  // 내 후기 로드
  const fetchReviews = useCallback(async () => {
    if (!user) return;
    setReviewsLoading(true);
    const supabase = createClient();
    const { data } = await supabase
      .from('reviews')
      .select('*, review_images(id, image_url)')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });
    setReviews((data ?? []).map((r) => ({ ...r, images: r.review_images as Review['images'] })));
    setReviewsLoading(false);
  }, [user]);

  // 북마크 로드
  const fetchBookmarks = useCallback(async () => {
    if (!user) return;
    setBookmarksLoading(true);
    const supabase = createClient();
    const { data } = await supabase
      .from('bookmarks')
      .select('id, schedule_id, schedules(*)')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });
    setBookmarks((data as unknown as BookmarkedSchedule[]) ?? []);
    setBookmarksLoading(false);
  }, [user]);

  // 프로필 로드
  const fetchProfile = useCallback(async () => {
    if (!user) return;
    const supabase = createClient();
    const { data } = await supabase
      .from('profiles')
      .select('id, nickname, avatar_url')
      .eq('id', user.id)
      .maybeSingle();
    if (data) {
      setProfile(data);
      setNickname(data.nickname ?? user.nickname);
      setAvatarPreview(data.avatar_url ?? null);
    } else {
      setNickname(user.nickname);
    }
  }, [user]);

  useEffect(() => {
    if (!authChecked || !user) return;
    if (tab === 'reviews') fetchReviews();
    if (tab === 'bookmarks') fetchBookmarks();
    if (tab === 'profile') fetchProfile();
  }, [tab, authChecked, user, fetchReviews, fetchBookmarks, fetchProfile]);

  const handleDeleteReview = async (id: string) => {
    if (!confirm('후기를 삭제할까요?')) return;
    const supabase = createClient();
    await supabase.from('review_images').delete().eq('review_id', id);
    await supabase.from('reviews').delete().eq('id', id);
    await fetchReviews();
  };

  const handleRemoveBookmark = async (scheduleId: string) => {
    if (!user) return;
    const supabase = createClient();
    await supabase.from('bookmarks').delete().eq('schedule_id', scheduleId).eq('user_id', user.id);
    setBookmarks((prev) => prev.filter((b) => b.schedule_id !== scheduleId));
  };

  const openScheduleModal = (bm: BookmarkedSchedule) => {
    const s = bm.schedules;
    setSelectedSchedule({
      id: s.id,
      title: s.title,
      date: s.date,
      time: s.time,
      location: s.location,
      category: s.category,
      idol: s.idol,
      description: s.description,
      thumbnailUrl: s.thumbnail_url,
      detailUrl: s.detail_url,
    });
    setIsModalOpen(true);
  };

  const handleProfileSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setProfileLoading(true);
    setProfileMsg('');
    const supabase = createClient();

    try {
      let avatarUrl = profile?.avatar_url;

      if (avatarFile) {
        const ext = avatarFile.name.split('.').pop();
        const path = `${user.id}/avatar.${ext}`;
        const { error: uploadError } = await supabase.storage
          .from('avatars')
          .upload(path, avatarFile, { upsert: true });
        if (uploadError) throw uploadError;
        const { data: urlData } = supabase.storage.from('avatars').getPublicUrl(path);
        avatarUrl = urlData.publicUrl;
      }

      await supabase
        .from('profiles')
        .upsert({ id: user.id, nickname, avatar_url: avatarUrl });

      setUser({ ...user, nickname, avatarUrl });
      setProfile((prev) => (prev ? { ...prev, nickname, avatar_url: avatarUrl } : prev));
      setAvatarFile(null);
      setProfileMsg('프로필이 저장되었습니다.');
    } catch (err) {
      setProfileMsg((err as Error).message ?? '오류가 발생했습니다.');
    } finally {
      setProfileLoading(false);
    }
  };

  if (!authChecked) {
    return (
      <div className="flex min-h-[calc(100vh-3.5rem)] items-center justify-center">
        <p className="text-sm text-gray-400">로딩 중...</p>
      </div>
    );
  }

  if (!loggedIn) {
    return <LoginRequired />;
  }

  const TABS: { key: Tab; label: string }[] = [
    { key: 'reviews', label: '내 후기' },
    { key: 'bookmarks', label: '북마크' },
    { key: 'profile', label: '프로필 수정' },
  ];

  return (
    <div className="min-h-screen bg-black">
      <div className="mx-auto max-w-5xl px-4 py-8">
        <h1 className="font-bebas mb-6 text-4xl tracking-[0.15em] text-white">MYPAGE</h1>

        <div className="flex gap-6">
          {/* 사이드바 */}
          <aside className="w-40 shrink-0">
            <nav className="sticky top-20 flex flex-col gap-1">
              {TABS.map(({ key, label }) => (
                <button
                  key={key}
                  onClick={() => setTab(key)}
                  className={`px-4 py-2.5 text-left text-sm font-medium transition-colors ${
                    tab === key
                      ? 'bg-[#CCFF00] text-black'
                      : 'text-white/50 hover:text-white'
                  }`}
                >
                  {label}
                </button>
              ))}
            </nav>
          </aside>

          {/* 콘텐츠 */}
          <main className="flex-1 min-w-0">
            {/* 내 후기 */}
            {tab === 'reviews' && (
              <section>
                <h2 className="mb-4 text-sm font-medium tracking-widest text-white/40 uppercase">내 후기</h2>
                {reviewsLoading ? (
                  <p className="text-sm text-white/40">불러오는 중...</p>
                ) : reviews.length === 0 ? (
                  <p className="border border-white/10 bg-[#111] p-6 text-center text-sm text-white/30">
                    작성한 후기가 없어요.
                  </p>
                ) : (
                  <div className="space-y-3">
                    {reviews.map((review) =>
                      editingReview?.id === review.id ? (
                        <ReviewForm
                          key={review.id}
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
                          key={review.id}
                          review={review}
                          currentUserId={user?.id}
                          onEdit={setEditingReview}
                          onDelete={handleDeleteReview}
                        />
                      ),
                    )}
                  </div>
                )}
              </section>
            )}

            {/* 북마크 */}
            {tab === 'bookmarks' && (
              <section>
                <h2 className="mb-4 text-sm font-medium tracking-widest text-white/40 uppercase">북마크한 스케줄</h2>
                {bookmarksLoading ? (
                  <p className="text-sm text-white/40">불러오는 중...</p>
                ) : bookmarks.length === 0 ? (
                  <p className="border border-white/10 bg-[#111] p-6 text-center text-sm text-white/30">
                    북마크한 스케줄이 없어요.
                  </p>
                ) : (
                  <div className="space-y-3">
                    {bookmarks.map((bm) => (
                      <div
                        key={bm.id}
                        className="flex items-center justify-between border border-white/10 bg-[#111] px-5 py-4"
                      >
                        <button
                          onClick={() => openScheduleModal(bm)}
                          className="flex-1 text-left"
                        >
                          <p className="text-sm font-semibold text-white">
                            {bm.schedules.title}
                          </p>
                          <p className="mt-0.5 text-xs text-[#CCFF00]">{bm.schedules.idol}</p>
                          <p className="mt-0.5 text-xs text-white/40">
                            {bm.schedules.date}
                            {bm.schedules.time && ` · ${bm.schedules.time}`}
                            {bm.schedules.location && ` · ${bm.schedules.location}`}
                          </p>
                        </button>
                        <button
                          onClick={() => handleRemoveBookmark(bm.schedule_id)}
                          className="ml-4 shrink-0 border border-white/15 px-3 py-1.5 text-xs text-white/40 transition-colors hover:border-red-500/30 hover:text-red-400"
                        >
                          삭제
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </section>
            )}

            {/* 프로필 수정 */}
            {tab === 'profile' && (
              <section>
                <h2 className="mb-4 text-sm font-medium tracking-widest text-white/40 uppercase">프로필 수정</h2>
                <form
                  onSubmit={handleProfileSave}
                  className="border border-white/10 bg-[#111] p-6"
                >
                  {/* 아바타 */}
                  <div className="mb-6 flex items-center gap-4">
                    <div className="relative">
                      {avatarPreview ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={avatarPreview}
                          alt="프로필 이미지"
                          className="h-16 w-16 rounded-full object-cover"
                        />
                      ) : (
                        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#CCFF00]/20 text-xl font-bold text-[#CCFF00]">
                          {(user?.nickname ?? '?')[0]}
                        </div>
                      )}
                    </div>
                    <div>
                      <input
                        ref={avatarRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0] ?? null;
                          setAvatarFile(file);
                          if (file) setAvatarPreview(URL.createObjectURL(file));
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => avatarRef.current?.click()}
                        className="border border-white/15 px-3 py-1.5 text-sm text-white/50 transition-colors hover:text-white"
                      >
                        이미지 변경
                      </button>
                    </div>
                  </div>

                  {/* 닉네임 */}
                  <div className="mb-5">
                    <label className="mb-1.5 block text-xs font-medium tracking-widest text-white/50 uppercase">닉네임</label>
                    <input
                      type="text"
                      value={nickname}
                      onChange={(e) => setNickname(e.target.value)}
                      required
                      className="w-full border border-white/15 bg-[#1a1a1a] px-4 py-2.5 text-sm text-white outline-none transition-colors placeholder:text-white/25 focus:border-[#CCFF00]"
                    />
                  </div>

                  {profileMsg && (
                    <p
                      className={`mb-4 px-3 py-2 text-sm ${
                        profileMsg.includes('저장')
                          ? 'border border-green-500/20 bg-green-500/10 text-green-400'
                          : 'border border-red-500/20 bg-red-500/10 text-red-400'
                      }`}
                    >
                      {profileMsg}
                    </p>
                  )}

                  <button
                    type="submit"
                    disabled={profileLoading}
                    className="w-full bg-[#CCFF00] py-2.5 text-sm font-semibold text-black transition-colors hover:bg-[#b3e600] disabled:opacity-60"
                  >
                    {profileLoading ? '저장 중...' : '저장'}
                  </button>
                </form>
              </section>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
