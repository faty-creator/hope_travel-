
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage, useCurrency } from '../App';
import { supabase } from '../lib/supabase';
import { Trip } from '../types';
import { Icons, TRIPS } from '../constants';

const TESTIMONIALS = [
  {
    text: "Un service impeccable, des paysages grandioses et une organisation parfaite.",
    author: "Fatima-Zahra",
    role: "Voyageuse régulière",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200"
  },
  {
    text: "Une expérience humaine incroyable. Le guide était passionné et le transport très confortable.",
    author: "Marc Lefebvre",
    role: "Touriste",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200"
  },
  {
    text: "Meilleure agence pour découvrir le sud du Maroc. Je recommande vivement HopeTravel !",
    author: "Yassine Benali",
    role: "Aventurier",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200"
  }
];

const Home: React.FC = () => {
  const { t, lang } = useLanguage();
  const { formatPrice } = useCurrency();
  const [activeSlide, setActiveSlide] = useState(0);
  const [newsEmail, setNewsEmail] = useState('');
  const [newsSuccess, setNewsSuccess] = useState(false);
  const [featuredTrips, setFeaturedTrips] = useState<Trip[]>([]);

  useEffect(() => {
    fetchFeaturedTrips();
  }, []);

  const fetchFeaturedTrips = async () => {
    try {
      const { data } = await supabase
        .from('trips')
        .select('*')
        .limit(3)
        .order('created_at', { ascending: false });

      if (data) {
        setFeaturedTrips(data);
        // Trigger reveal animation
        setTimeout(() => {
          window.dispatchEvent(new Event('scroll'));
        }, 100);
      }
    } catch (error) {
      console.error('Error fetching featured trips:', error);
    }
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % TESTIMONIALS.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const handleNewsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newsEmail) {
      setNewsSuccess(true);
      setNewsEmail('');
      setTimeout(() => setNewsSuccess(false), 5000);
    }
  };

  return (
    <div className="overflow-hidden">
      {/* Parallax Hero Section */}
      <section className="relative h-[85vh] flex items-center justify-center overflow-hidden parallax" style={{ backgroundImage: "url('https://www.pexels.com/download/video/34889526/')" }}>
        <div className="absolute inset-0 bg-black/40 dark:bg-black/60"></div>

        <div className="relative z-10 text-center text-white px-4 max-w-4xl animate-fade-in-up">
          <h1 className="text-4xl md:text-7xl font-bold mb-6 drop-shadow-lg leading-tight">
            {t('hero_title')}
          </h1>
          <p className="text-lg md:text-2xl mb-10 text-gray-100 drop-shadow-md">
            {t('hero_subtitle')}
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/trips"
              className="yellow-bg text-black px-10 py-4 rounded-full text-xl font-bold shadow-2xl hover:bg-white transition transform hover:scale-105 btn-glow"
            >
              {t('btn_see_trips')}
            </Link>
            <Link
              to="/reserve"
              className="bg-white/20 backdrop-blur-md text-white border-2 border-white px-10 py-4 rounded-full text-xl font-bold hover:bg-white hover:text-black transition transform hover:scale-105"
            >
              {t('btn_book_now')}
            </Link>
          </div>
        </div>
      </section>

      {/* Advantages Section with Reveal */}
      <section className="py-24 bg-white dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-5xl font-bold text-center mb-16 reveal">{t('adv_title')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              { icon: <Icons.Guide />, title: t('adv_guides'), text: t('home_adv_guides_desc') },
              { icon: <Icons.Bus />, title: t('adv_transport'), text: t('home_adv_transport_desc') },
              { icon: <Icons.Star />, title: t('adv_prices'), text: t('home_adv_prices_desc') }
            ].map((adv, i) => (
              <div key={i} className="text-center p-8 rounded-2xl bg-gray-50 dark:bg-slate-800 border border-transparent hover:yellow-border hover:bg-white dark:hover:bg-slate-700 transition duration-500 shadow-sm hover:shadow-xl reveal" style={{ transitionDelay: `${i * 100}ms` }}>
                <div className="yellow-bg text-black w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 transform rotate-3 btn-glow">
                  {adv.icon}
                </div>
                <h3 className="text-xl font-bold mb-4 dark:text-white">{adv.title}</h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{adv.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-24 bg-yellow-400">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-black text-black mb-4">{t('newsletter_title')}</h2>
          <p className="text-black/80 text-lg mb-10">{t('newsletter_subtitle')}</p>
          <form onSubmit={handleNewsSubmit} className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto">
            <input
              type="email"
              placeholder={t('newsletter_placeholder')}
              required
              value={newsEmail}
              onChange={(e) => setNewsEmail(e.target.value)}
              className="flex-grow px-6 py-4 rounded-full border-none focus:ring-4 focus:ring-black outline-none text-black font-medium"
            />
            <button type="submit" className="bg-black text-white px-8 py-4 rounded-full font-bold hover:bg-gray-800 transition transform hover:scale-105 active:scale-95">
              {t('newsletter_btn')}
            </button>
          </form>
          {newsSuccess && (
            <p className="mt-4 font-bold text-black animate-bounce">{t('newsletter_success')}</p>
          )}
        </div>
      </section>

      {/* Featured Trips */}
      <section className="py-24 bg-gray-50 dark:bg-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-12 reveal">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-2 dark:text-white">{t('featured_trips')}</h2>
              <div className="w-20 h-2 yellow-bg rounded"></div>
            </div>
            <Link to="/trips" className="text-yellow-600 font-bold hover:underline hidden sm:block">
              {t('btn_see_trips')} &rarr;
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredTrips.map((trip, i) => (
              <div key={trip.id} className="bg-white dark:bg-slate-900 rounded-3xl overflow-hidden shadow-lg group hover:shadow-2xl transition duration-500 flex flex-col h-full" style={{ transitionDelay: `${i * 100}ms` }}>
                <div className="relative h-64 overflow-hidden">
                  <img
                    src={trip.image}
                    alt={trip.title[lang]}
                    className="w-full h-full object-cover transition duration-700 group-hover:scale-110"
                  />
                  <div className="absolute top-4 right-4 yellow-bg text-black text-sm font-bold px-4 py-1 rounded-full shadow-md">
                    {formatPrice(trip.price, trip.price_currency)}
                  </div>
                </div>
                <div className="p-8 flex flex-col flex-grow">
                  <h3 className="text-2xl font-bold mb-2 group-hover:yellow-text transition dark:text-white">{trip.title[lang]}</h3>
                  <p className="text-gray-500 text-sm mb-4 flex items-center">
                    <span className="mr-2">📍</span> {trip.destination}
                  </p>
                  <p className="text-gray-600 dark:text-gray-400 line-clamp-2 mb-6 flex-grow">
                    {trip.description[lang]}
                  </p>
                  <Link
                    to={`/trips/${trip.id}`}
                    className="block text-center border-2 yellow-border yellow-text py-3 rounded-xl font-bold hover:yellow-bg hover:text-black transition"
                  >
                    {t('details')}
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-32 bg-[#0a0f1d] dark:bg-[#020617] text-white overflow-hidden relative reveal">
        <div className="max-w-6xl mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <div className="flex justify-center space-x-1 mb-6">
              {[1, 2, 3, 4, 5].map(n => <Icons.Star key={n} />)}
            </div>
            <h2 className="text-3xl md:text-5xl font-black mb-4">{t('home_testimonials_title')}</h2>
            <div className="w-20 h-1 yellow-bg mx-auto"></div>
          </div>

          <div className="relative min-h-[450px] md:min-h-[400px]">
            {TESTIMONIALS.map((testimonial, idx) => {
              const translatedTestimonial = {
                text: idx === 0 ? t('home_testimonial_1_text') : idx === 1 ? t('home_testimonial_2_text') : t('home_testimonial_3_text'),
                role: idx === 0 ? t('home_testimonial_1_role') : idx === 1 ? t('home_testimonial_2_role') : t('home_testimonial_3_role'),
                author: testimonial.author,
                image: testimonial.image
              };

              return (
                <div
                  key={idx}
                  className={`absolute inset-0 flex flex-col items-center justify-center transition-all duration-700 ease-in-out transform ${idx === activeSlide
                    ? 'opacity-100 translate-y-0 scale-100'
                    : 'opacity-0 translate-y-8 scale-95 pointer-events-none'
                    }`}
                >
                  <div className="bg-[#111827]/80 dark:bg-slate-900/50 backdrop-blur-xl border border-white/5 p-10 md:p-16 rounded-[3rem] shadow-2xl text-center max-w-4xl w-full">
                    <blockquote className="text-2xl md:text-4xl font-bold mb-12 italic leading-relaxed text-gray-100">
                      "{translatedTestimonial.text}"
                    </blockquote>

                    <div className="flex flex-col items-center space-y-4">
                      <div className="relative">
                        <div className="absolute inset-0 yellow-bg rounded-full blur-lg opacity-20 animate-pulse"></div>
                        <div className="relative w-24 h-24 rounded-full border-4 border-yellow-400 overflow-hidden shadow-2xl mb-4">
                          <img
                            src={translatedTestimonial.image}
                            alt={translatedTestimonial.author}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </div>

                      <div className="flex flex-col items-center">
                        <h4 className="text-2xl font-black text-white mb-1">{translatedTestimonial.author}</h4>
                        <div className="flex items-center space-x-2 text-yellow-400 font-bold uppercase tracking-widest text-sm">
                          <span className="w-6 h-[2px] bg-yellow-400"></span>
                          <span>{translatedTestimonial.role}</span>
                          <span className="w-6 h-[2px] bg-yellow-400"></span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex justify-center mt-12 space-x-4 rtl:space-x-reverse">
            {TESTIMONIALS.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setActiveSlide(idx)}
                className={`h-2 rounded-full transition-all duration-500 ease-out ${idx === activeSlide ? 'yellow-bg w-12' : 'bg-gray-700 w-3 hover:bg-gray-500'
                  }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
        </div>

        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-gray-50 dark:from-slate-800 to-transparent opacity-10"></div>
        <div className="absolute top-1/2 left-0 w-[600px] h-[600px] yellow-bg rounded-full blur-[180px] opacity-[0.05] -translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] yellow-bg rounded-full blur-[150px] opacity-[0.03] translate-x-1/2 translate-y-1/2 pointer-events-none"></div>
      </section>
    </div>
  );
};

export default Home;
