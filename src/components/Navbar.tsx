import { useState } from 'react';
import { Search, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { NavTab } from '../types/cinema';

interface NavbarProps {
  activeTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  onOpenSearch: () => void;
  watchlistCount: number;
}

const NAV_ITEMS: Array<{ id: NavTab; label: string }> = [
  { id: 'discover', label: 'Discover' },
  { id: 'films', label: 'Films' },
  { id: 'series', label: 'Series' },
  { id: 'collections', label: 'Collections' },
  { id: 'watchlist', label: 'Watchlist' },
];

export function KDLogoMark() {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      className="h-6 w-6 shrink-0"
    >
      <rect
        x="1.5"
        y="3.5"
        width="21"
        height="17"
        rx="2.5"
        stroke="#D4AF6A"
        strokeWidth="1.35"
      />
      <path
        d="M7 8V16M7 12L11.2 8M7 12L11.2 16"
        stroke="#F5F2EB"
        strokeWidth="1.45"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M14 8V16H15.8C17.6 16 18.8 14.7 18.8 12C18.8 9.3 17.6 8 15.8 8H14Z"
        stroke="#D4AF6A"
        strokeWidth="1.45"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function Navbar({
  activeTab,
  onSelectTab,
  onOpenSearch,
  watchlistCount,
}: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNavClick = (tab: NavTab) => {
    onSelectTab(tab);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 border-b border-white/[0.07] bg-[#090A0B]/85 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-[1400px] items-center justify-between gap-8 px-5 sm:px-8 lg:px-10">
        {/* Zone 1: KD Movies Logo & Wordmark */}
        <button
          type="button"
          onClick={() => handleNavClick('discover')}
          className="inline-flex items-center gap-2.5 font-serif text-2xl font-medium tracking-tight text-[#F5F2EB] transition-opacity hover:opacity-85 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#D4AF6A] whitespace-nowrap shrink-0 cursor-pointer"
        >
          <KDLogoMark />
          <span>KD Movies</span>
        </button>

        {/* Zone 2: 5 concise single-line text nav links */}
        <nav
          aria-label="Primary navigation"
          className="hidden md:flex items-center gap-8"
        >
          {NAV_ITEMS.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleNavClick(item.id)}
                className={`relative py-1 text-[13.5px] font-medium tracking-[0.02em] transition-colors duration-200 whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#D4AF6A] ${
                  isActive
                    ? 'text-[#F5F2EB]'
                    : 'text-[#9C9A94] hover:text-[#F5F2EB]'
                }`}
              >
                <span>{item.label}</span>
                {item.id === 'watchlist' && watchlistCount > 0 && (
                  <span className="ml-1.5 text-[11px] font-normal text-[#D4AF6A] tabular-nums">
                    {watchlistCount}
                  </span>
                )}
                {isActive && (
                  <motion.span
                    layoutId="nav-active-underline"
                    transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                    className="absolute inset-x-0 -bottom-[1.15rem] h-[1.5px] bg-[#D4AF6A]"
                  />
                )}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: 1 primary action (Search) + mobile drawer trigger */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={onOpenSearch}
            className="inline-flex h-10 items-center gap-2.5 rounded-full border border-white/[0.12] bg-white/[0.04] px-4 text-[13px] font-medium text-[#F5F2EB] transition-all duration-200 hover:border-[#D4AF6A]/50 hover:bg-white/[0.08] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D4AF6A] whitespace-nowrap shrink-0 cursor-pointer"
          >
            <Search className="h-3.5 w-3.5 text-[#D4AF6A]" strokeWidth={1.75} />
            <span>Search</span>
            <span className="hidden lg:inline font-mono text-[11px] text-[#9C9A94]">
              ⌘K
            </span>
          </button>

          <button
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileMenuOpen}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/[0.1] text-[#F5F2EB] md:hidden cursor-pointer focus-visible:outline-2 focus-visible:outline-[#D4AF6A]"
          >
            {mobileMenuOpen ? (
              <X className="h-4 w-4" />
            ) : (
              <Menu className="h-4 w-4" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile navigation panel */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.nav
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            aria-label="Mobile navigation"
            className="overflow-hidden border-t border-white/[0.06] bg-[#0B0C0E] md:hidden"
          >
            <div className="flex flex-col px-5 py-3">
              {NAV_ITEMS.map((item) => {
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handleNavClick(item.id)}
                    className={`flex h-11 items-center justify-between border-b border-white/[0.05] text-sm font-medium last:border-none cursor-pointer ${
                      isActive ? 'text-[#D4AF6A]' : 'text-[#A8A6A0]'
                    }`}
                  >
                    <span>{item.label}</span>
                    {item.id === 'watchlist' && watchlistCount > 0 && (
                      <span className="text-xs tabular-nums text-[#D4AF6A]">
                        {watchlistCount}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
