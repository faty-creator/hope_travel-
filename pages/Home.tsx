import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage, useCurrency } from '../App';
import { supabase } from '../lib/supabase';
import { Trip } from '../types';
import { Icons } from '../constants';

const TESTIMONIALS = [
  {
    text: "Un service impeccable, des paysages grandioses et une organisation parfaite.",
    author: "Fatima-Zahra",
    role: "Voyageuse régulière",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=400",
    rating: 5
  },
  {
    text: "Une expérience humaine incroyable. Le guide était passionné et le transport très confortable.",
    author: "Marc Lefebvre",
    role: "Touriste",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400",
    rating: 5
  },
  {
    text: "Meilleure agence pour découvrir le sud du Maroc. Je recommande vivement HopeTravel !",
    author: "Yassine Benali",
    role: "Aventurier",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=400",
    rating: 5
  }
];

const Home: React.FC = () => {
  const { t, lang } = useLanguage();
  const { formatPrice } = useCurrency();
  const [activeSlide, setActiveSlide] = useState(0);
  const [newsEmail, setNewsEmail] = useState('');
  const [newsSuccess, setNewsSuccess] = useState(false);
  const [featuredTrips, setFeaturedTrips] = useState<Trip[]>([]);
  const testimonialsRef = useRef<HTMLDivElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: 50, y: 50 });

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

  const handleMouseMove = (e: React.MouseEvent) => {
    if (testimonialsRef.current) {
      const rect = testimonialsRef.current.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      setMousePosition({
        x: Math.max(0, Math.min(100, x)),
        y: Math.max(0, Math.min(100, y))
      });
    }
  };

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
      <section className="relative h-[85vh] flex items-center justify-center overflow-hidden parallax" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=2000')" }}>
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

      {/* Testimonials - Version Compacte et Moderne */}
      <section 
        ref={testimonialsRef}
        className="relative py-20 bg-gradient-to-br from-[#0a0f1d] via-[#0c1224] to-[#090e1a] text-white overflow-hidden"
        onMouseMove={handleMouseMove}
      >
        {/* Effet de lumière interactive */}
        <div 
          className="pointer-events-none fixed inset-0 z-0 transition-opacity duration-300"
          style={{
            background: `radial-gradient(400px at ${mousePosition.x}% ${mousePosition.y}%, rgba(251, 191, 36, 0.1), transparent 50%)`,
          }}
        />

        <div className="relative z-10 max-w-5xl mx-auto px-4">
          {/* En-tête simplifié */}
          <div className="text-center mb-16 relative">
            <h2 className="text-3xl md:text-5xl font-black mb-4 bg-clip-text text-transparent bg-gradient-to-r from-yellow-200 via-amber-300 to-orange-300">
              {t('home_testimonials_title')}
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-yellow-400 via-orange-500 to-amber-400 mx-auto rounded-full"></div>
            <p className="text-gray-400 mt-4 max-w-2xl mx-auto">
              Ce que disent nos voyageurs
            </p>
          </div>

          {/* Conteneur de témoignages compact */}
          <div className="relative min-h-[400px] md:min-h-[350px]">
            {TESTIMONIALS.map((testimonial, idx) => {
              const translatedTestimonial = {
                text: idx === 0 ? t('home_testimonial_1_text') : idx === 1 ? t('home_testimonial_2_text') : t('home_testimonial_3_text'),
                role: idx === 0 ? t('home_testimonial_1_role') : idx === 1 ? t('home_testimonial_2_role') : t('home_testimonial_3_role'),
                author: testimonial.author,
                image: testimonial.image,
                rating: testimonial.rating
              };

              return (
                <div
                  key={idx}
                  className={`absolute inset-0 flex items-center justify-center transition-all duration-700 ease-out ${
                    idx === activeSlide
                      ? 'opacity-100 translate-x-0 scale-100 z-10'
                      : 'opacity-0 translate-x-full scale-95 pointer-events-none'
                  }`}
                >
                  {/* Carte plus petite et compacte */}
                  <div className="relative w-full max-w-2xl group">
                    {/* Carte principale */}
                    <div className="relative bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-xl rounded-2xl p-8 border border-white/10 shadow-xl overflow-hidden">
                      
                      {/* Points décoratifs subtils */}
                      <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-yellow-400/10 to-orange-500/10 rounded-full blur-xl" />
                      <div className="absolute bottom-0 left-0 w-20 h-20 bg-gradient-to-tr from-amber-500/5 to-transparent rounded-full blur-xl" />

                      {/* Citation compacte */}
                      <div className="relative">
                        <div className="absolute -top-4 -left-4 text-6xl text-yellow-400/10 font-serif">"</div>
                        
                        <blockquote className="relative text-xl md:text-2xl font-semibold leading-relaxed mb-8 pl-8 pr-4">
                          <span className="text-gray-100">
                            "{translatedTestimonial.text}"
                          </span>
                        </blockquote>

                        {/* Auteur compact */}
                        <div className="flex items-center gap-4">
                          {/* Avatar plus petit */}
                          <div className="relative">
                            <div className="relative w-16 h-16 rounded-full border-2 border-yellow-400/30 overflow-hidden bg-gradient-to-br from-gray-900 to-black shadow-lg">
                              <img
                                src={translatedTestimonial.image}
                                alt={translatedTestimonial.author}
                                className="w-full h-full object-cover"
                              />
                            </div>
                          </div>

                          <div className="flex-1">
                            <h4 className="text-lg font-bold mb-1 text-white">
                              {translatedTestimonial.author}
                            </h4>
                            <div className="flex items-center gap-2">
                              <div className="w-6 h-0.5 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full" />
                              <span className="text-sm font-medium uppercase tracking-wide text-gray-300">
                                {translatedTestimonial.role}
                              </span>
                              <div className="w-6 h-0.5 bg-gradient-to-r from-orange-500 to-yellow-400 rounded-full" />
                            </div>
                          </div>

                          {/* Rating compact */}
                          <div className="flex items-center gap-2 bg-white/5 px-3 py-2 rounded-lg">
                            <Icons.Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                            <span className="text-sm font-bold text-white">5.0</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Contrôles de navigation avec points au centre */}
          <div className="flex items-center justify-center gap-8 mt-12">
            {/* Flèche gauche */}
            <button
              onClick={() => setActiveSlide(prev => (prev - 1 + TESTIMONIALS.length) % TESTIMONIALS.length)}
              className="w-12 h-12 rounded-full bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/10 flex items-center justify-center hover:border-yellow-400/50 hover:scale-110 transition-all duration-300 group"
            >
              <svg className="w-5 h-5 text-gray-400 group-hover:text-yellow-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            {/* Points de navigation au centre */}
            <div className="flex gap-3">
              {TESTIMONIALS.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveSlide(idx)}
                  className="relative group"
                  aria-label={`Témoignage ${idx + 1}`}
                >
                  <div className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    idx === activeSlide 
                      ? 'bg-gradient-to-r from-yellow-400 to-orange-500 scale-125' 
                      : 'bg-gray-700 group-hover:bg-gray-600'
                  }`}>
                    {idx === activeSlide && (
                      <div className="absolute inset-0 rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 animate-ping opacity-75" />
                    )}
                  </div>
                </button>
              ))}
            </div>

            {/* Flèche droite */}
            <button
              onClick={() => setActiveSlide(prev => (prev + 1) % TESTIMONIALS.length)}
              className="w-12 h-12 rounded-full bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/10 flex items-center justify-center hover:border-yellow-400/50 hover:scale-110 transition-all duration-300 group"
            >
              <svg className="w-5 h-5 text-gray-400 group-hover:text-yellow-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          {/* Indicateur de progression compact */}
          <div className="mt-8">
            <div className="relative h-1 bg-white/5 rounded-full overflow-hidden max-w-xs mx-auto">
              <div 
                className="absolute top-0 left-0 h-full bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full transition-all duration-700 ease-out"
                style={{ width: `${((activeSlide + 1) / TESTIMONIALS.length) * 100}%` }}
              />
            </div>
          </div>
        </div>

        {/* Éléments décoratifs subtils */}
        <div className="absolute bottom-5 left-5 w-48 h-48 bg-gradient-to-tr from-yellow-400/3 to-transparent rounded-full blur-2xl" />
        <div className="absolute top-5 right-5 w-56 h-56 bg-gradient-to-bl from-orange-500/2 to-transparent rounded-full blur-2xl" />
      </section>
    </div>
  );
};

export default Home;