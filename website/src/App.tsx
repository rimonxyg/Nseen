import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { ScrollToTop } from './components/ui/ScrollToTop';
import { Home } from './pages/Home';
import { Privacy } from './pages/Privacy';
import { Terms } from './pages/Terms';
import { setSeo } from './lib/seo';

export function App() {
  const [lang, setLang] = useState<'en' | 'bn'>('en');

  useEffect(() => {
    // Detect language preference
    try {
      const savedLang = localStorage.getItem('nseen_lang');
      if (savedLang === 'en' || savedLang === 'bn') {
        setLang(savedLang);
      } else if (typeof navigator !== 'undefined' && navigator.language && navigator.language.startsWith('bn')) {
        setLang('bn');
      }
    } catch {
      // Ignore localStorage errors in private mode
    }

    setSeo();
  }, []);

  const handleToggleLang = () => {
    const nextLang = lang === 'en' ? 'bn' : 'en';
    setLang(nextLang);
    try {
      localStorage.setItem('nseen_lang', nextLang);
    } catch {
      // Ignore
    }
  };

  return (
    <BrowserRouter>
      <div className={`min-h-screen bg-obsidian text-text-primary ${lang === 'bn' ? 'font-bengali' : 'font-sans'}`}>
        {/* Skip to Content Link for Screen Readers */}
        <a href="#main-content" className="skip-link">
          Skip to main content
        </a>

        {/* Global Navigation */}
        <Navbar lang={lang} onToggleLang={handleToggleLang} />

        {/* App Routes */}
        <Routes>
          <Route path="/" element={<Home lang={lang} onToggleLang={handleToggleLang} />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="*" element={<Home lang={lang} onToggleLang={handleToggleLang} />} />
        </Routes>

        {/* Global Footer */}
        <Footer lang={lang} />

        {/* Sticky Move to Top Button */}
        <ScrollToTop />
      </div>
    </BrowserRouter>
  );
}

export default App;
