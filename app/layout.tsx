import type { Metadata } from 'next';
import { Geist_Mono, Bebas_Neue, Noto_Sans_KR } from 'next/font/google';
import './globals.css';
import MSWProvider from '@/components/MSWProvider';
import Navbar from '@/components/common/Navbar';
import ScheduleModal from '@/components/schedule/ScheduleModal';
import AuthInitializer from '@/components/common/AuthInitializer';

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

const bebasNeue = Bebas_Neue({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-bebas-neue',
  display: 'swap',
});

const notoSansKR = Noto_Sans_KR({
  weight: ['300', '400', '500', '700'],
  subsets: ['latin'],
  display: 'swap',
  preload: false,
  variable: '--font-noto-kr',
});

export const metadata: Metadata = {
  title: '엑소더스Ent',
  description: '아티스트 스케줄 · 공연 후기 · 팬 커뮤니티',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ko"
      className={`${geistMono.variable} ${bebasNeue.variable} ${notoSansKR.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <AuthInitializer />
        <MSWProvider>
          <Navbar />
          <main className="flex-1">{children}</main>
          <ScheduleModal />
        </MSWProvider>
      </body>
    </html>
  );
}
