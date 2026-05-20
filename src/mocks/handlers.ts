import { http, HttpResponse } from 'msw';

export const handlers = [
  // 스케줄 목록 조회
  http.get('/api/schedules', () => {
    return HttpResponse.json([
      {
        id: '1',
        title: '아이브 2026 월드투어 서울',
        date: '2026-05-15',
        time: '19:00',
        location: 'KSPO DOME, 서울',
        category: '콘서트',
        idol: '아이브',
      },
      {
        id: '2',
        title: 'BTS 팬미팅 2026',
        date: '2026-05-22',
        time: '18:00',
        location: '올림픽공원, 서울',
        category: '팬미팅',
        idol: 'BTS',
      },
      {
        id: '3',
        title: '뉴진스 팬싸인회',
        date: '2026-05-10',
        time: '14:00',
        location: '코엑스, 서울',
        category: '팬싸인회',
        idol: '뉴진스',
      },
    ]);
  }),

  // 스케줄 상세 조회
  http.get('/api/schedules/:id', ({ params }) => {
    return HttpResponse.json({
      id: params.id,
      title: '아이브 2026 월드투어 서울',
      date: '2026-05-15',
      time: '19:00',
      location: 'KSPO DOME, 서울',
      category: '콘서트',
      idol: '아이브',
      description: '아이브의 첫 번째 월드투어 서울 공연입니다.',
    });
  }),

  // 후기 목록 조회
  http.get('/api/schedules/:id/reviews', ({ params }) => {
    return HttpResponse.json([
      {
        id: '1',
        scheduleId: params.id,
        userId: 'user1',
        nickname: '팬심_123',
        rating: 5,
        content: '정말 최고의 공연이었어요!',
        createdAt: '2026-05-16',
      },
      {
        id: '2',
        scheduleId: params.id,
        userId: 'user2',
        nickname: '아이브러버',
        rating: 4,
        content: '무대 연출이 너무 예뻤어요.',
        createdAt: '2026-05-16',
      },
    ]);
  }),

  // 후기 작성
  http.post('/api/schedules/:id/reviews', () => {
    return HttpResponse.json(
      { message: '후기가 등록되었습니다.' },
      { status: 201 },
    );
  }),

  // 북마크 토글
  http.post('/api/bookmarks/:scheduleId', () => {
    return HttpResponse.json({ bookmarked: true });
  }),
];
