import React, { useState } from 'react';
import { SiteHeader } from './components/Header';
import { HomePage } from './pages/HomePage';
import { AboutPage } from './pages/AboutPage';
import { AcademicsPage } from './pages/AcademicsPage';
import { AdmissionPage } from './pages/AdmissionPage';
import { TuitionPage } from './pages/TuitionPage';
import { StudentLifePage } from './pages/StudentLifePage';
import { NewsPage } from './pages/NewsPage';
import { GivingPage } from './pages/GivingPage';
import { BillyWidget } from './components/BillyWidget';

export type PageId = 'home' | 'about' | 'academics' | 'admission' | 'tuition' | 'student-life' | 'news' | 'giving';

export default function App() {
  const [currentPage, setCurrentPage] = useState<PageId>('home');
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const navigate = (page: PageId) => {
    setCurrentPage(page);
    setMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'home':        return <HomePage navigate={navigate} />;
      case 'about':       return <AboutPage navigate={navigate} />;
      case 'academics':   return <AcademicsPage navigate={navigate} />;
      case 'admission':   return <AdmissionPage navigate={navigate} />;
      case 'tuition':     return <TuitionPage navigate={navigate} />;
      case 'student-life':return <StudentLifePage navigate={navigate} />;
      case 'news':        return <NewsPage navigate={navigate} />;
      case 'giving':      return <GivingPage navigate={navigate} />;
      default:            return <HomePage navigate={navigate} />;
    }
  };

  return (
    <div style={{ fontFamily: 'system-ui, -apple-system, sans-serif', overflowX: 'hidden' }}>
      <SiteHeader
        menuOpen={menuOpen}
        setMenuOpen={setMenuOpen}
        searchOpen={searchOpen}
        setSearchOpen={setSearchOpen}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        navigate={navigate}
      />
      {renderPage()}
      <BillyWidget />
    </div>
  );
}
