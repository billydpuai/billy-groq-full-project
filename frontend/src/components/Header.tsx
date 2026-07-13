import React from 'react';
import { PageId } from '../App';
import { useIsMobile } from '../hooks/use-mobile';

const NAVY = '#003DA5';

interface Props {
  menuOpen: boolean;
  setMenuOpen: (v: boolean) => void;
  searchOpen: boolean;
  setSearchOpen: (v: boolean) => void;
  searchQuery: string;
  setSearchQuery: (v: string) => void;
  navigate: (page: PageId) => void;
}

const NAV_ITEMS: { label: string; page: PageId }[] = [
  { label: 'About',           page: 'about' },
  { label: 'Academics',       page: 'academics' },
  { label: 'Admission',       page: 'admission' },
  { label: 'Tuition & Aid',   page: 'tuition' },
  { label: 'Student Life',    page: 'student-life' },
  { label: 'University News', page: 'news' },
  { label: 'Giving',          page: 'giving' },
];

const SEARCH_LINKS: { label: string; page: PageId }[] = [
  { label: 'Financial Aid Overview',    page: 'tuition' },
  { label: 'Apply for Admission',       page: 'admission' },
  { label: 'Tuition & Fees',            page: 'tuition' },
  { label: 'Academic Programs',         page: 'academics' },
  { label: 'Student Life',              page: 'student-life' },
  { label: 'Housing & Dining',          page: 'student-life' },
  { label: 'About DePaul',              page: 'about' },
  { label: 'Scholarships',              page: 'tuition' },
  { label: 'Career Center',             page: 'student-life' },
  { label: 'International Students',    page: 'admission' },
  { label: 'Graduate Programs',         page: 'academics' },
  { label: 'Transfer Students',         page: 'admission' },
  { label: 'Colleges & Schools',        page: 'academics' },
  { label: 'Student Organizations',     page: 'student-life' },
  { label: 'University News',           page: 'news' },
  { label: 'FAFSA Information',         page: 'tuition' },
  { label: 'Visit DePaul',              page: 'admission' },
];

const resetBtn: React.CSSProperties = {
  background: 'none', border: 'none', padding: 0, cursor: 'pointer',
};

export function SiteHeader({ menuOpen, setMenuOpen, searchOpen, setSearchOpen, searchQuery, setSearchQuery, navigate }: Props) {
  const isMobile = useIsMobile();
  const filteredSearch = searchQuery.trim().length > 1
    ? SEARCH_LINKS.filter(l => l.label.toLowerCase().includes(searchQuery.toLowerCase()))
    : [];

  const closeSearch = () => {
    setSearchOpen(false);
    setSearchQuery('');
  };

  return (
    <>
      {/* ── Fixed top bar ── */}
      <header style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000,
        backgroundColor: NAVY, height: 72, padding: isMobile ? '0 16px' : '0 32px',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
      }}>
        <button
          onClick={() => navigate('home')}
          aria-label="DePaul University home"
          style={{ ...resetBtn, display: 'flex', alignItems: 'center' }}
        >
          <img
            src="/images/logo-white.svg"
            alt="DePaul University"
            height={38}
            style={{ display: 'block' }}
            onError={(e) => {
              const el = e.currentTarget as HTMLImageElement;
              el.style.display = 'none';
              const span = document.createElement('span');
              span.textContent = 'DEPAUL UNIVERSITY';
              span.style.cssText = "color:#fff;font-weight:bold;font-size:18px;letter-spacing:1.5px;font-family:'Rethink Sans',sans-serif";
              el.parentElement?.insertBefore(span, el);
            }}
          />
        </button>

        <nav aria-label="Top utility" style={{ display: 'flex', alignItems: 'center', gap: isMobile ? 12 : 20 }}>
          {!isMobile && (
            <button
              style={{ ...resetBtn, color: '#fff', fontSize: 14 }}
              onMouseEnter={e => ((e.currentTarget as HTMLElement).style.opacity = '0.8')}
              onMouseLeave={e => ((e.currentTarget as HTMLElement).style.opacity = '1')}
            >
              Request Info
            </button>
          )}
          <button
            style={{ backgroundColor: '#fff', color: NAVY, fontWeight: 700, fontSize: 14, padding: isMobile ? '9px 16px' : '10px 22px', borderRadius: 3, border: 'none', cursor: 'pointer' }}
            onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#f0f0f0')}
            onMouseLeave={e => (e.currentTarget.style.backgroundColor = '#fff')}
          >
            Apply
          </button>
          <button
            aria-label="Search"
            onClick={() => { setSearchOpen(true); }}
            style={{ ...resetBtn, color: '#fff', fontSize: 18 }}
          >
            🔍
          </button>
          <button
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
            aria-controls="site-nav-overlay"
            onClick={() => setMenuOpen(!menuOpen)}
            style={{ ...resetBtn, color: '#fff', fontSize: 22, userSelect: 'none' }}
          >
            {menuOpen ? '✕' : '☰'}
          </button>
        </nav>
      </header>

      {/* ── Search overlay ── */}
      {searchOpen && (
        <div style={{
          position: 'fixed', top: 72, left: 0, right: 0, zIndex: 1001,
          backgroundColor: '#fff', boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
          padding: isMobile ? '16px 20px' : '24px 120px',
        }}>
          <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', gap: 12, alignItems: isMobile ? 'stretch' : 'center', maxWidth: 800, margin: '0 auto' }}>
            {!isMobile && <span style={{ color: '#888', fontSize: 18, paddingLeft: 20 }}>🔍</span>}
            <input
              type="text"
              autoFocus
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter' && filteredSearch.length > 0) {
                  navigate(filteredSearch[0].page);
                  closeSearch();
                } else if (e.key === 'Escape') {
                  closeSearch();
                }
              }}
              placeholder="Search DePaul — programs, financial aid, admissions..."
              style={{
                flex: 1, border: `2px solid ${NAVY}`, borderRadius: 30,
                padding: '14px 24px', fontSize: 15, outline: 'none', color: '#333',
              }}
            />
            <div style={{ display: 'flex', gap: 12, justifyContent: isMobile ? 'flex-end' : 'flex-start' }}>
              <button
                onClick={() => { if (filteredSearch.length > 0) { navigate(filteredSearch[0].page); closeSearch(); } }}
                style={{ ...resetBtn, backgroundColor: NAVY, color: '#fff', fontWeight: 700, borderRadius: 30, padding: '14px 28px' }}
              >
                Search
              </button>
              <button
                aria-label="Close search"
                onClick={closeSearch}
                style={{ ...resetBtn, color: '#888', fontSize: 20 }}
              >
                ✕
              </button>
            </div>
          </div>

          {filteredSearch.length > 0 && (
            <div style={{
              maxWidth: 800, margin: '12px auto 0', backgroundColor: '#fff',
              border: '1px solid #eee', borderRadius: 12, boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
              overflow: 'hidden',
            }}>
              {filteredSearch.map((item, i) => (
                <div
                  key={item.label}
                  onClick={() => { navigate(item.page); closeSearch(); }}
                  style={{
                    padding: '14px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    cursor: 'pointer', borderBottom: i < filteredSearch.length - 1 ? '1px solid #f5f5f5' : 'none',
                    transition: 'background 0.15s',
                  }}
                  onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#E6ECF6')}
                  onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
                >
                  <span style={{ color: NAVY, fontSize: 15 }}>{item.label}</span>
                  <span style={{ color: '#888', fontSize: 12 }}>→</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ── Hamburger overlay ── */}
      {menuOpen && (
        <div
          id="site-nav-overlay"
          role="navigation"
          aria-label="Site navigation"
          style={{
            position: 'fixed', inset: 0, zIndex: 999, marginTop: 72,
            display: 'flex', flexDirection: 'column',
          }}
        >
          {/* Top section */}
          <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', flex: 1, overflow: 'auto' }}>

            {/* Left nav panel */}
            <nav
              aria-label="Primary navigation"
              style={{
                width: isMobile ? '100%' : 340, flexShrink: 0,
                backgroundColor: '#111827',
                padding: isMobile ? '32px 24px' : '48px 40px',
                display: 'flex', flexDirection: 'column', gap: 4,
                overflowY: isMobile ? 'visible' : 'auto',
              }}
            >
              {NAV_ITEMS.map(({ label, page }) => (
                <button
                  key={label}
                  onClick={() => navigate(page)}
                  style={{
                    ...resetBtn,
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    padding: '14px 8px',
                    borderBottom: '1px solid rgba(255,255,255,0.1)',
                    width: '100%', textAlign: 'left',
                    transition: 'background 0.15s',
                    borderRadius: 0,
                  }}
                  onMouseEnter={e => (e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.06)')}
                  onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
                  onFocus={e   => (e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.06)')}
                  onBlur={e    => (e.currentTarget.style.backgroundColor = 'transparent')}
                >
                  <span style={{ color: '#fff', fontSize: isMobile ? 22 : 28, fontWeight: 700 }}>{label}</span>
                  <span aria-hidden="true" style={{ color: '#fff', fontSize: 20 }}>›</span>
                </button>
              ))}
            </nav>

            {/* Right content panel */}
            {!isMobile && (
            <div style={{ flex: 1, backgroundColor: '#fff', padding: 48, overflowY: 'auto' }}>
              <span style={{
                backgroundColor: NAVY, color: '#fff', fontSize: 13, fontWeight: 700,
                padding: '6px 14px', borderRadius: 4, display: 'inline-block',
              }}>You major in your passion,</span>
              <h2 style={{ color: '#000', fontSize: 42, fontWeight: 700, marginTop: 20, lineHeight: 1.2 }}>
                We major in you
              </h2>
              <p style={{ color: '#555', fontSize: 16, marginTop: 16, lineHeight: 1.7 }}>
                We're dedicated to helping you become your best self through learning that connects
                classroom with hands-on practice and service.
              </p>
              <img
                src="https://dpu-p-001.sitecorecontenthub.cloud/api/public/content/9ee002e85f17478f9df0cfd40658da7e"
                alt="DePaul students on campus"
                style={{ width: '100%', height: 280, objectFit: 'cover', borderRadius: 8, marginTop: 24, display: 'block', backgroundColor: '#ddd' }}
              />
            </div>
            )}
          </div>

          {/* Bottom bar */}
          <div style={{
            backgroundColor: '#001E6E', padding: isMobile ? '16px 24px' : '16px 40px',
            display: 'flex', flexDirection: isMobile ? 'column' : 'row', gap: isMobile ? 16 : 0, justifyContent: 'space-between', alignItems: isMobile ? 'flex-start' : 'center',
            flexShrink: 0,
          }}>
            <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', gap: isMobile ? 10 : 24 }}>
              {['For Students', 'For Alumni', 'For Faculty & Staff'].map(l => (
                <button key={l} style={{ ...resetBtn, color: 'rgba(255,255,255,0.7)', fontSize: 14, transition: 'color 0.15s' }}
                  onMouseEnter={e => ((e.currentTarget as HTMLElement).style.color = '#fff')}
                  onMouseLeave={e => ((e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.7)')}
                  onFocus={e    => ((e.currentTarget as HTMLElement).style.color = '#fff')}
                  onBlur={e     => ((e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.7)')}
                >{l}</button>
              ))}
            </div>
            <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
              {['LinkedIn', 'TikTok', 'Instagram', 'Facebook', 'YouTube'].map(l => (
                <button key={l} style={{ ...resetBtn, color: 'rgba(255,255,255,0.6)', fontSize: 13, transition: 'color 0.15s' }}
                  onMouseEnter={e => ((e.currentTarget as HTMLElement).style.color = '#fff')}
                  onMouseLeave={e => ((e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.6)')}
                  onFocus={e    => ((e.currentTarget as HTMLElement).style.color = '#fff')}
                  onBlur={e     => ((e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.6)')}
                >{l}</button>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
