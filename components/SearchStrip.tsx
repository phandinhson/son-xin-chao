"use client";
import { useState, useEffect, useCallback } from "react";
import dynamic from "next/dynamic";

const SearchModal = dynamic(() => import("./SearchModal"), { ssr: false });

const QUICK_TAGS = ["SEO Organic", "Google Ads", "Facebook Ads", "Thiết kế Website", "Bảng giá"];

export default function SearchStrip() {
  const [searchOpen, setSearchOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if ((e.metaKey || e.ctrlKey) && e.key === "k") {
      e.preventDefault();
      setSearchOpen(true);
    }
  }, []);

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  return (
    <>
      <div
        className={`sticky top-16 z-40 transition-all duration-300 ${
          scrolled
            ? "shadow-md"
            : "shadow-none"
        }`}
      >
        {/* Gradient background strip */}
        <div className="bg-gradient-to-r from-blue-600 via-blue-500 to-violet-600 py-3 px-4">
          <div className="max-w-3xl mx-auto flex flex-col sm:flex-row items-center gap-3">

            {/* Search input trigger */}
            <button
              onClick={() => setSearchOpen(true)}
              className="w-full flex items-center gap-3 bg-white/15 hover:bg-white/25 backdrop-blur-sm border border-white/30 rounded-2xl px-4 py-2.5 text-left transition-all group"
            >
              <svg className="w-4 h-4 text-white/80 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <span className="text-white/70 text-sm flex-1">Tìm kiếm dịch vụ, bài viết, bảng giá...</span>
              <kbd className="hidden sm:inline-flex items-center gap-0.5 px-2 py-0.5 bg-white/20 border border-white/30 rounded-md text-[11px] text-white/70 font-mono">
                ⌘K
              </kbd>
            </button>

            {/* Quick tags — hidden on very small screens */}
            <div className="hidden md:flex items-center gap-2 flex-shrink-0">
              {QUICK_TAGS.slice(0, 3).map((tag) => (
                <button
                  key={tag}
                  onClick={() => setSearchOpen(true)}
                  className="px-3 py-1.5 bg-white/15 hover:bg-white/30 border border-white/25 rounded-full text-white text-xs font-medium transition-all whitespace-nowrap"
                >
                  {tag}
                </button>
              ))}
            </div>

          </div>

          {/* Mobile quick tags — scroll ngang, không tràn ra viewport */}
          <div className="md:hidden -mx-4 mt-2 overflow-x-auto scrollbar-hide">
            <div className="flex items-center gap-2 px-4 pb-1" style={{ width: "max-content" }}>
              {QUICK_TAGS.map((tag) => (
                <button
                  key={tag}
                  onClick={() => setSearchOpen(true)}
                  className="flex-shrink-0 px-3 py-1 bg-white/15 hover:bg-white/30 border border-white/25 rounded-full text-white text-xs font-medium transition-all"
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <SearchModal open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
