
import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useLanguage, useTheme, useCurrency, Currency } from '../App';
import { Language } from '../types';

const Navbar: React.FC = () => {
  const { lang, setLang, t } = useLanguage();
  const { isDark, toggleDark } = useTheme();
  const { currency, setCurrency } = useCurrency();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCurrencyOpen, setIsCurrencyOpen] = useState(false);
  const [isLangOpen, setIsLangOpen] = useState(false);
  const location = useLocation();
  
  const currencyRef = useRef<HTMLDivElement>(null);
  const langRef = useRef<HTMLDivElement>(null);

  const navLinks = [
    { name: t('nav_home'), path: '/' },
    { name: t('nav_trips'), path: '/trips' },
    { name: t('nav_about'), path: '/about' },
    { name: t('nav_contact'), path: '/contact' },
    { name: t('nav_faq'), path: '/faq' },
  ];

  const languages: { code: Language; label: string; flag: string }[] = [
    { code: 'fr', label: 'Français', flag: '🇫🇷' },
    { code: 'ar', label: 'العربية', flag: '🇲🇦' },
    { code: 'en', label: 'English', flag: '🇬🇧' },
  ];

  const currencies: Currency[] = ['MAD', 'EUR', 'USD'];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (currencyRef.current && !currencyRef.current.contains(event.target as Node)) {
        setIsCurrencyOpen(false);
      }
      if (langRef.current && !langRef.current.contains(event.target as Node)) {
        setIsLangOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="sticky top-0 z-50 transition-all duration-300">
      {/* Small Top Bar */}
      <div className="bg-white dark:bg-slate-800 border-b border-gray-100 dark:border-slate-700 py-1.5 overflow-hidden transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-center text-[10px] md:text-xs font-bold text-slate-800 dark:text-slate-300 space-y-1 sm:space-y-0 tracking-tight uppercase">
            <div className="flex items-center space-x-5 rtl:space-x-reverse">
              <a href="tel:+212537712108" className="flex items-center hover:yellow-text transition-colors duration-200">
                <span className="text-yellow-500 mr-1.5 rtl:mr-0 rtl:ml-1.5">📞</span> {t('topbar_phone')}
              </a>
              <span className="hidden sm:inline-block opacity-20">|</span>
              <div className="flex items-center">
                <span className="text-yellow-500 mr-1.5 rtl:mr-0 rtl:ml-1.5">🕒</span> {t('topbar_hours')}
              </div>
            </div>
            <div className="hidden md:block opacity-50 font-black tracking-widest text-[9px]">
              {t('payment_on_arrival')}
            </div>
          </div>
        </div>
      </div>

      <nav className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-md shadow-sm transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 md:h-20">
            {/* Logo */}
            <div className="flex items-center">
              <Link to="/" className="text-xl md:text-2xl font-bold yellow-text flex items-center space-x-2">
                <span className="text-gray-900 dark:text-white">Hope</span><span>Travel</span>
              </Link>
            </div>

            {/* Desktop Menu */}
            <div className="hidden lg:flex items-center space-x-6 rtl:space-x-reverse">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`transition duration-300 font-bold text-sm tracking-wide ${
                    location.pathname === link.path ? 'yellow-text' : 'hover:yellow-text text-gray-700 dark:text-gray-300'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
              
              <div className="h-8 w-[1px] bg-gray-200 dark:bg-gray-700 mx-2"></div>

              {/* Compact Currency Switcher (Icon Style) */}
              <div className="relative" ref={currencyRef}>
                <button
                  onClick={() => setIsCurrencyOpen(!isCurrencyOpen)}
                  className={`w-10 h-10 md:w-12 md:h-12 rounded-full flex flex-col items-center justify-center transition-all duration-300 border-2 ${
                    isCurrencyOpen 
                      ? 'yellow-bg border-yellow-400 text-black shadow-lg scale-110' 
                      : 'bg-gray-50 dark:bg-slate-800 border-gray-100 dark:border-slate-700 text-gray-700 dark:text-gray-300 hover:yellow-border'
                  }`}
                >
                  <span className="text-[10px] font-black leading-none">{currency}</span>
                  <svg className={`w-3 h-3 mt-0.5 transition-transform ${isCurrencyOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                
                {isCurrencyOpen && (
                  <div className="absolute top-full right-0 mt-3 w-32 bg-white dark:bg-slate-800 rounded-3xl shadow-2xl py-2 border border-gray-100 dark:border-gray-700 animate-fade-in-up overflow-hidden">
                    {currencies.map((c) => (
                      <button
                        key={c}
                        onClick={() => {
                          setCurrency(c);
                          setIsCurrencyOpen(false);
                        }}
                        className={`w-full text-left px-6 py-3 text-sm font-bold transition hover:bg-gray-50 dark:hover:bg-slate-700 ${
                          currency === c ? 'yellow-text bg-yellow-50/50 dark:bg-yellow-900/10' : 'text-gray-600 dark:text-gray-400'
                        }`}
                      >
                        {c}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Compact Language Switcher (Icon Style) */}
              <div className="relative" ref={langRef}>
                <button
                  onClick={() => setIsLangOpen(!isLangOpen)}
                  className={`w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center transition-all duration-300 border-2 ${
                    isLangOpen 
                      ? 'yellow-bg border-yellow-400 text-black shadow-lg scale-110' 
                      : 'bg-gray-50 dark:bg-slate-800 border-gray-100 dark:border-slate-700 text-gray-700 dark:text-gray-300 hover:yellow-border'
                  }`}
                >
                  <span className="text-xs font-black">{lang.toUpperCase()}</span>
                </button>
                
                {isLangOpen && (
                  <div className="absolute top-full right-0 mt-3 w-40 bg-white dark:bg-slate-800 rounded-3xl shadow-2xl py-2 border border-gray-100 dark:border-gray-700 animate-fade-in-up overflow-hidden">
                    {languages.map((l) => (
                      <button
                        key={l.code}
                        onClick={() => {
                          setLang(l.code);
                          setIsLangOpen(false);
                        }}
                        className={`w-full flex items-center justify-between px-6 py-3 text-sm font-bold transition hover:bg-gray-50 dark:hover:bg-slate-700 ${
                          lang === l.code ? 'yellow-text bg-yellow-50/50 dark:bg-yellow-900/10' : 'text-gray-600 dark:text-gray-400'
                        }`}
                      >
                        <span>{l.label}</span>
                        <span className="text-xs opacity-50">{l.code.toUpperCase()}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Theme Toggle (Icon Style) */}
              <button 
                onClick={toggleDark}
                className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-gray-50 dark:bg-slate-800 border-2 border-gray-100 dark:border-slate-700 flex items-center justify-center hover:yellow-border transition shadow-sm"
                title="Toggle Dark Mode"
              >
                {isDark ? '☀️' : '🌙'}
              </button>
              
              <Link
                to="/reserve"
                className="yellow-bg text-black px-8 py-3 rounded-full font-black text-sm shadow hover:shadow-xl transition transform hover:-translate-y-1 btn-glow uppercase tracking-wider"
              >
                {t('btn_book_now')}
              </Link>
            </div>

            {/* Mobile Menu Actions */}
            <div className="lg:hidden flex items-center space-x-2 rtl:space-x-reverse">
              <button
                onClick={() => setIsCurrencyOpen(!isCurrencyOpen)}
                className="w-10 h-10 rounded-full bg-gray-100 dark:bg-slate-800 flex items-center justify-center font-black text-[10px]"
              >
                {currency}
              </button>
              <button onClick={toggleDark} className="w-10 h-10 flex items-center justify-center">
                {isDark ? '☀️' : '🌙'}
              </button>
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-gray-600 dark:text-gray-300 focus:outline-none p-2"
              >
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {isMenuOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.3} d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.3} d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu Content */}
        {isMenuOpen && (
          <div className="lg:hidden bg-white dark:bg-slate-900 border-t border-gray-100 dark:border-gray-800 pb-8 animate-fade-in shadow-2xl overflow-y-auto max-h-[80vh]">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setIsMenuOpen(false)}
                className="block px-6 py-4 text-lg font-black hover:bg-yellow-50 dark:hover:bg-gray-800 hover:yellow-text border-b border-gray-50 dark:border-gray-800"
              >
                {link.name}
              </Link>
            ))}
            
            <div className="px-6 py-6 space-y-6">
              <div className="p-5 bg-slate-50 dark:bg-slate-800 rounded-3xl text-center space-y-2 border border-gray-100 dark:border-slate-700">
                <p className="text-xs font-black uppercase tracking-widest yellow-text">{t('topbar_phone')}</p>
                <p className="text-[10px] font-bold text-gray-500 uppercase">{t('topbar_hours')}</p>
              </div>

              <div>
                <p className="text-xs font-black uppercase tracking-widest text-gray-400 mb-3 ml-1">Devise</p>
                <div className="flex space-x-2 rtl:space-x-reverse">
                  {currencies.map(c => (
                    <button 
                      key={c}
                      onClick={() => setCurrency(c)}
                      className={`flex-grow py-3 rounded-2xl font-black border-2 transition ${currency === c ? 'yellow-border yellow-bg text-black shadow-md' : 'border-gray-100 dark:border-gray-700 dark:text-white bg-gray-50 dark:bg-slate-800'}`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-xs font-black uppercase tracking-widest text-gray-400 mb-3 ml-1">Langue</p>
                <div className="flex space-x-2 rtl:space-x-reverse">
                  {languages.map(l => (
                    <button 
                      key={l.code}
                      onClick={() => setLang(l.code)}
                      className={`flex-grow py-3 rounded-2xl font-black border-2 transition ${lang === l.code ? 'yellow-border yellow-bg text-black shadow-md' : 'border-gray-100 dark:border-gray-700 dark:text-white bg-gray-50 dark:bg-slate-800'}`}
                    >
                      {l.code.toUpperCase()}
                    </button>
                  ))}
                </div>
              </div>

              <Link
                to="/reserve"
                onClick={() => setIsMenuOpen(false)}
                className="block w-full text-center yellow-bg text-black px-6 py-5 rounded-[2rem] font-black text-xl shadow-xl active:scale-95 transition-transform"
              >
                {t('btn_book_now')}
              </Link>
            </div>
          </div>
        )}
      </nav>
    </div>
  );
};

export default Navbar;
