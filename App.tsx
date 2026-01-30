
import React, { useState, useEffect, createContext, useContext } from 'react';
import { HashRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { Language } from './types';
import { translations } from './translations';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import FloatingWhatsApp from './components/FloatingWhatsApp';
import Home from './pages/Home';
import Trips from './pages/Trips';
import TripDetails from './pages/TripDetails';
import Reservation from './pages/Reservation';
import About from './pages/About';
import Contact from './pages/Contact';
import FAQ from './pages/FAQ';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import AdminTripForm from './pages/AdminTripForm';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';

export type Currency = 'MAD' | 'EUR' | 'USD';

interface LanguageContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  t: (key: string) => string;
}

interface ThemeContextType {
  isDark: boolean;
  toggleDark: () => void;
}

interface CurrencyContextType {
  currency: Currency;
  setCurrency: (c: Currency) => void;
  formatPrice: (price: number, sourceCurrency?: Currency) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);
const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) throw new Error('useLanguage must be used within a LanguageProvider');
  return context;
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used within a ThemeProvider');
  return context;
};

export const useCurrency = () => {
  const context = useContext(CurrencyContext);
  if (!context) throw new Error('useCurrency must be used within a CurrencyProvider');
  return context;
};

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

const RevealOnScroll = () => {
  const location = useLocation();
  useEffect(() => {
    const reveals = document.querySelectorAll('.reveal');
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
        }
      });
    }, { threshold: 0.1 });

    reveals.forEach(reveal => observer.observe(reveal));
    return () => observer.disconnect();
  }, [location]);
  return null;
};

const App: React.FC = () => {
  const [lang, setLang] = useState<Language>('fr');
  const [isDark, setIsDark] = useState(false);
  const [currency, setCurrency] = useState<Currency>('MAD');

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  const t = (key: string) => {
    return translations[key]?.[lang] || key;
  };

  const formatPrice = (price: number, sourceCurrency: Currency = 'MAD') => {
    const rates = {
      MAD: 1,
      EUR: 0.093,
      USD: 0.10
    };
    const symbols = {
      MAD: 'MAD',
      EUR: '€',
      USD: '$'
    };

    // Convert source to MAD first (since rates are based on MAD = 1)
    // Rate: 1 MAD = 0.093 EUR -> 1 EUR = 1/0.093 MAD

    let priceInMad = price;
    if (sourceCurrency !== 'MAD') {
      priceInMad = price / rates[sourceCurrency];
    }

    const converted = priceInMad * rates[currency];
    const rounded = Math.round(converted);

    if (currency === 'MAD') return `${rounded} MAD`;
    return `${symbols[currency]}${rounded}`;
  };

  const isRtl = lang === 'ar';

  return (
    <ThemeContext.Provider value={{ isDark, toggleDark: () => setIsDark(!isDark) }}>
      <LanguageContext.Provider value={{ lang, setLang, t }}>
        <CurrencyContext.Provider value={{ currency, setCurrency, formatPrice }}>
          <AuthProvider>
            <Router>
              <div className={`min-h-screen flex flex-col bg-gray-50 text-gray-900 ${isRtl ? 'font-arabic' : ''} ${isDark ? 'dark' : ''}`} dir={isRtl ? 'rtl' : 'ltr'}>
                <ScrollToTop />
                <RevealOnScroll />
                <Navbar />
                <main className="flex-grow">
                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/trips" element={<Trips />} />
                    <Route path="/trips/:id" element={<TripDetails />} />
                    <Route path="/reserve" element={<Reservation />} />
                    <Route path="/reserve/:tripId" element={<Reservation />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/contact" element={<Contact />} />
                    <Route path="/faq" element={<FAQ />} />

                    {/* Admin Routes */}
                    <Route path="/admin/login" element={<AdminLogin />} />
                    <Route path="/admin" element={
                      <ProtectedRoute>
                        <AdminDashboard />
                      </ProtectedRoute>
                    } />
                    <Route path="/admin/trips/new" element={
                      <ProtectedRoute>
                        <AdminTripForm />
                      </ProtectedRoute>
                    } />
                    <Route path="/admin/trips/:id/edit" element={
                      <ProtectedRoute>
                        <AdminTripForm />
                      </ProtectedRoute>
                    } />
                  </Routes>
                </main>
                <Footer />
                <FloatingWhatsApp />
              </div>
            </Router>
          </AuthProvider>
        </CurrencyContext.Provider>
      </LanguageContext.Provider>
    </ThemeContext.Provider>
  );
};

export default App;
