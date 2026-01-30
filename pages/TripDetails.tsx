
import { useState, useEffect } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { useLanguage, useCurrency } from '../App';
import { supabase } from '../lib/supabase';
import { Trip } from '../types';

const TripDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { t, lang } = useLanguage();
  const { formatPrice } = useCurrency();
  const [trip, setTrip] = useState<Trip | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchTrip(id);
    }
  }, [id]);

  const fetchTrip = async (tripId: string) => {
    try {
      const { data, error } = await supabase
        .from('trips')
        .select('*')
        .eq('id', tripId)
        .single();

      if (error) throw error;
      setTrip(data);
    } catch (error) {
      console.error('Error fetching trip:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!trip || loading) return;

    // Small timeout to ensure DOM is ready
    const timer = setTimeout(() => {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('active');
          }
        });
      }, { threshold: 0.1 });

      const reveals = document.querySelectorAll('.reveal');
      reveals.forEach(reveal => observer.observe(reveal));

      return () => observer.disconnect();
    }, 100);

    return () => clearTimeout(timer);
  }, [trip, loading]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-slate-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-500"></div>
      </div>
    );
  }

  if (!trip) return <Navigate to="/trips" />;

  return (
    <div className="pb-24 bg-white dark:bg-slate-900 transition-colors duration-300 min-h-screen">
      {/* Header Image */}
      <div className="h-[60vh] relative">
        <img
          src={trip.image}
          alt={trip.title[lang]}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center text-center p-4">
          <div className="max-w-4xl">
            <h1 className="text-4xl md:text-6xl font-black text-white mb-4 animate-fade-in-up">{trip.title[lang]}</h1>
            <p className="text-xl text-yellow-400 font-bold">{trip.destination}</p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-12">
          <section className="reveal">
            <h2 className="text-3xl font-black mb-6 border-b-4 border-yellow-400 inline-block pb-2 dark:text-white">Description</h2>
            <p className="text-gray-700 dark:text-gray-300 text-lg leading-relaxed whitespace-pre-wrap">
              {trip.description[lang]}
            </p>
          </section>

          <section className="reveal">
            <h2 className="text-3xl font-black mb-8 flex items-center dark:text-white">
              <span className="mr-3 rtl:mr-0 rtl:ml-3">📅</span>
              {t('program')}
            </h2>
            <div className="space-y-8 relative before:absolute before:left-4 before:top-2 before:bottom-2 before:w-1 before:bg-yellow-200 dark:before:bg-yellow-900/30 rtl:before:left-auto rtl:before:right-4">
              {trip.program.map((p, idx) => (
                <div key={idx} className="pl-12 rtl:pl-0 rtl:pr-12 relative group">
                  <div className="absolute left-0 rtl:left-auto rtl:right-0 top-1 w-9 h-9 yellow-bg rounded-full flex items-center justify-center font-bold text-black border-4 border-white dark:border-slate-800 shadow-sm transition group-hover:scale-110 group-hover:yellow-shadow">
                    {p.day}
                  </div>
                  <h3 className="text-xl font-bold mb-2 dark:text-white">{p.title[lang]}</h3>
                  <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{p.desc[lang]}</p>
                </div>
              ))}
            </div>
          </section>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 reveal">
            <section className="bg-green-50 dark:bg-green-900/10 p-8 rounded-3xl border border-green-100 dark:border-green-900/20">
              <h3 className="text-xl font-bold mb-6 flex items-center text-green-800 dark:text-green-400">
                <span className="mr-3 rtl:mr-0 rtl:ml-3">✅</span>
                {t('included')}
              </h3>
              <ul className="space-y-3">
                {trip.included.map((item, idx) => (
                  <li key={idx} className="flex items-start text-green-700 dark:text-green-300/80">
                    <span className="mr-2 rtl:mr-0 rtl:ml-2 mt-1">✓</span>
                    {item[lang]}
                  </li>
                ))}
              </ul>
            </section>

            <section className="bg-red-50 dark:bg-red-900/10 p-8 rounded-3xl border border-red-100 dark:border-red-900/20">
              <h3 className="text-xl font-bold mb-6 flex items-center text-red-800 dark:text-red-400">
                <span className="mr-3 rtl:mr-0 rtl:ml-3">❌</span>
                {t('not_included')}
              </h3>
              <ul className="space-y-3">
                {trip.not_included?.map((item, idx) => (
                  <li key={idx} className="flex items-start text-red-700 dark:text-red-300/80">
                    <span className="mr-2 rtl:mr-0 rtl:ml-2 mt-1">×</span>
                    {item[lang]}
                  </li>
                ))}
              </ul>
            </section>
          </div>
        </div>

        {/* Sidebar / Price & Booking */}
        <div className="lg:col-span-1">
          <div className="sticky top-28 bg-white dark:bg-slate-800 p-8 rounded-[2.5rem] shadow-xl border border-gray-100 dark:border-gray-700 reveal">
            <div className="mb-6 flex justify-between items-center">
              <span className="text-gray-500 dark:text-gray-400 font-medium">{t('duration_label')}</span>
              <span className="text-gray-900 dark:text-white font-black">
                {trip.duration_value ? `${trip.duration_value} ${t('days')}` : trip.duration?.[lang]}
              </span>
            </div>

            {trip.departure && (
              <div className="mb-6 flex justify-between items-center">
                <span className="text-gray-500 dark:text-gray-400 font-medium">Départ</span>
                <div className="text-right">
                  <span className="block text-gray-900 dark:text-white font-bold">
                    {new Date(trip.departure).toLocaleDateString(lang === 'ar' ? 'ar-MA' : 'fr-FR', {
                      day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit'
                    })}
                  </span>
                  {trip.departure_location && trip.departure_location[lang] && (
                    <span className="block text-sm text-yellow-600 font-medium">
                      📍 {trip.departure_location[lang]}
                    </span>
                  )}
                </div>
              </div>
            )}

            {trip.arrival_location && trip.arrival_location[lang] && (
              <div className="mb-6 flex justify-between items-center">
                <span className="text-gray-500 dark:text-gray-400 font-medium">{t('arrival_label') || 'Arrivée'}</span>
                <div className="text-right">
                  <span className="block text-gray-900 dark:text-white font-bold">
                    {trip.arrival_location[lang]}
                  </span>
                </div>
              </div>
            )}

            {trip.map_embed && (
              <div className="mb-8 overflow-hidden rounded-xl shadow-md border border-gray-100 dark:border-gray-700">
                <div
                  dangerouslySetInnerHTML={{ __html: trip.map_embed }}
                  className="w-full h-48 [&>iframe]:w-full [&>iframe]:h-full [&>iframe]:border-0"
                />
              </div>
            )}
            <div className="mb-8 pt-6 border-t border-gray-100 dark:border-gray-700">
              <span className="block text-gray-500 dark:text-gray-400 text-sm mb-1 uppercase tracking-widest font-bold">Prix par personne</span>
              <div className="flex items-baseline space-x-2 rtl:space-x-reverse">
                <span className="text-5xl font-black yellow-text tracking-tighter">
                  {formatPrice(trip.price, trip.price_currency)}
                </span>
              </div>
            </div>

            <div className="space-y-4">
              <Link
                to={`/reserve/${trip.id}`}
                className="block w-full text-center yellow-bg text-black py-5 rounded-2xl font-black text-xl shadow-lg hover:shadow-2xl transition transform hover:-translate-y-1 btn-glow"
              >
                {t('reserve_this')}
              </Link>
              <div className="flex items-center justify-center p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-xl text-yellow-800 dark:text-yellow-400 text-sm font-black border border-yellow-100 dark:border-yellow-900/30 uppercase tracking-wide">
                ⭐ {t('payment_on_arrival')}
              </div>
            </div>

            <div className="mt-8 pt-8 border-t border-gray-100 dark:border-gray-700 flex items-center justify-around opacity-60">
              <div className="text-center">
                <span className="block text-2xl mb-1">🛡️</span>
                <span className="text-[10px] uppercase font-black tracking-widest dark:text-white">Safe</span>
              </div>
              <div className="text-center">
                <span className="block text-2xl mb-1">🚐</span>
                <span className="text-[10px] uppercase font-black tracking-widest dark:text-white">Comfy</span>
              </div>
              <div className="text-center">
                <span className="block text-2xl mb-1">🌍</span>
                <span className="text-[10px] uppercase font-black tracking-widest dark:text-white">Global</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TripDetails;
