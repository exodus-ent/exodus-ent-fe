'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';
import { UserCircle2 } from 'lucide-react';
import { useAuthStore } from '@/store/useAuthStore';
import { createClient } from '@/lib/supabase';

const LEFT_LINKS = [
  { label: 'ARTISTS', href: '/artists' },
  { label: 'SCHEDULE', href: '/schedule' },
];

const RIGHT_LINKS_BASE = [{ label: 'REVIEW', href: '/reviews' }];
const MYPAGE_LINK = { label: 'MYPAGE', href: '/mypage' };

const ALL_LINKS_BASE = [...LEFT_LINKS, ...RIGHT_LINKS_BASE, MYPAGE_LINK];

function NavLink({ href, label, pathname, onClick }: { href: string; label: string; pathname: string; onClick?: () => void }) {
  const active = pathname === href || (href !== '/' && pathname.startsWith(href));
  return (
    <Link
      href={href}
      onClick={onClick}
      className={`text-xs font-medium tracking-[0.15em] transition-colors hover:text-[#CCFF00] ${
        active ? 'text-[#CCFF00]' : 'text-white/60'
      }`}
    >
      {label}
    </Link>
  );
}

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuthStore();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = async () => {
    await createClient().auth.signOut();
    logout();
    router.push('/');
  };

  const RIGHT_LINKS = user?.isAdmin ? RIGHT_LINKS_BASE : [...RIGHT_LINKS_BASE, MYPAGE_LINK];
  const ALL_LINKS = user?.isAdmin ? [...LEFT_LINKS, ...RIGHT_LINKS_BASE] : ALL_LINKS_BASE;

  return (
    <header className="sticky top-0 z-50 w-full bg-black border-b border-white/5">
      <div className="mx-auto h-16 max-w-7xl px-6 lg:px-8">
        {/* Desktop layout: left nav | center logo | right nav + auth */}
        <div className="relative flex h-full items-center justify-between md:justify-start">
          {/* Left nav */}
          <nav className="hidden items-center gap-8 md:flex">
            {LEFT_LINKS.map(({ label, href }) => (
              <NavLink key={href} href={href} label={label} pathname={pathname} />
            ))}
          </nav>

          {/* Center logo — absolute on desktop, static on mobile */}
          <Link
            href="/"
            className="font-bebas text-2xl tracking-widest text-white transition-colors hover:text-[#CCFF00] md:absolute md:left-1/2 md:-translate-x-1/2"
          >
            EXODUS <span className="text-[#CCFF00]">ENT</span>
          </Link>

          {/* Right nav + auth */}
          <div className="hidden flex-1 items-center justify-end gap-8 md:flex">
            {RIGHT_LINKS.map(({ label, href }) => (
              <NavLink key={href} href={href} label={label} pathname={pathname} />
            ))}
            <div className="ml-4 flex items-center gap-3 border-l border-white/10 pl-4">
              {user ? (
                <>
                  <Link href="/mypage" className="shrink-0">
                    {user.avatarUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={user.avatarUrl} alt={user.nickname} className="h-8 w-8 rounded-full object-cover" />
                    ) : (
                      <UserCircle2 className="h-8 w-8 text-white/40" />
                    )}
                  </Link>
                  <span className="text-xs text-white/50">
                    <span className="font-medium text-white">{user.nickname}</span>
                  </span>
                  <button
                    onClick={handleLogout}
                    className="text-xs tracking-[0.1em] text-white/40 transition-colors hover:text-white"
                  >
                    LOGOUT
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="text-xs tracking-[0.1em] text-white/50 transition-colors hover:text-white"
                  >
                    LOGIN
                  </Link>
                  <Link
                    href="/signup"
                    className="rounded-none border border-[#CCFF00] px-3 py-1.5 text-xs font-medium tracking-[0.1em] text-[#CCFF00] transition-colors hover:bg-[#CCFF00] hover:text-black"
                  >
                    JOIN
                  </Link>
                </>
              )}
            </div>
          </div>

          {/* Mobile hamburger */}
          <button
            className="ml-auto flex h-8 w-8 flex-col items-center justify-center gap-1.5 md:hidden"
            onClick={() => setMenuOpen((prev) => !prev)}
            aria-label="메뉴 열기"
          >
            <span className={`block h-px w-6 bg-white transition-transform duration-200 ${menuOpen ? 'translate-y-[7px] rotate-45' : ''}`} />
            <span className={`block h-px w-6 bg-white transition-opacity duration-200 ${menuOpen ? 'opacity-0' : ''}`} />
            <span className={`block h-px w-6 bg-white transition-transform duration-200 ${menuOpen ? '-translate-y-[7px] -rotate-45' : ''}`} />
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="border-t border-white/5 bg-black px-6 pb-6 md:hidden">
          <nav className="flex flex-col gap-4 pt-6">
            {ALL_LINKS.map(({ label, href }) => (
              <Link
                key={href}
                href={href}
                onClick={() => setMenuOpen(false)}
                className={`text-sm font-medium tracking-[0.15em] transition-colors hover:text-[#CCFF00] ${
                  pathname === href || (href !== '/' && pathname.startsWith(href))
                    ? 'text-[#CCFF00]'
                    : 'text-white/60'
                }`}
              >
                {label}
              </Link>
            ))}
          </nav>
          <div className="mt-6 flex flex-col gap-3 border-t border-white/5 pt-6">
            {user ? (
              <>
                <Link href="/mypage" onClick={() => setMenuOpen(false)} className="flex items-center gap-2.5">
                  {user.avatarUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={user.avatarUrl} alt={user.nickname} className="h-8 w-8 rounded-full object-cover" />
                  ) : (
                    <UserCircle2 className="h-8 w-8 text-white/40" />
                  )}
                  <span className="text-sm font-medium text-white">{user.nickname}</span>
                </Link>
                <button
                  onClick={() => { handleLogout(); setMenuOpen(false); }}
                  className="text-left text-sm tracking-[0.1em] text-white/40 hover:text-white"
                >
                  LOGOUT
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  onClick={() => setMenuOpen(false)}
                  className="text-sm tracking-[0.1em] text-white/60 hover:text-white"
                >
                  LOGIN
                </Link>
                <Link
                  href="/signup"
                  onClick={() => setMenuOpen(false)}
                  className="inline-block border border-[#CCFF00] px-4 py-2 text-center text-sm font-medium tracking-[0.1em] text-[#CCFF00] hover:bg-[#CCFF00] hover:text-black"
                >
                  JOIN
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
