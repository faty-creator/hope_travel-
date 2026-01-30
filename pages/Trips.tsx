
import React, { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage, useCurrency } from '../App';
import { supabase } from '../lib/supabase';
import { Trip } from '../types';

const Trips: React.FC = () => {
  const { t, lang } = useLanguage();
  const { formatPrice } = useCurrency();
  const [searchQuery, setSearchQuery] = useState('');
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTrips();
  }, []);

  const fetchTrips = async () => {
    try {
      const { data, error } = await supabase
        .from('trips')
        .select('*');

      if (error) throw error;
      setTrips(data || []);
    } catch (error) {
      console.error('Error fetching trips:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredTrips = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();
    if (!query) return trips;

    return trips.filter((trip) => {
      const title = trip.title[lang]?.toLowerCase() || '';
      const destination = trip.destination?.toLowerCase() || '';
      const description = trip.description[lang]?.toLowerCase() || '';

      return title.includes(query) || destination.includes(query) || description.includes(query);
    });
  }, [searchQuery, lang, trips]);

  useEffect(() => {
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
  }, [filteredTrips]);

  const topDestinations = useMemo(() => {
    const counts: Record<string, number> = {};
    trips.forEach(t => {
      if (t.destination) {
        counts[t.destination] = (counts[t.destination] || 0) + 1;
      }
    });
    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8)
      .map(entry => ({ name: entry[0], count: entry[1] }));
  }, [trips]);

  const recentTrip = useMemo(() => {
    if (trips.length === 0) return null;
    return [...trips].sort((a, b) => {
      const dateA = a.created_at ? new Date(a.created_at).getTime() : 0;
      const dateB = b.created_at ? new Date(b.created_at).getTime() : 0;
      return dateB - dateA;
    })[0];
  }, [trips]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-slate-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-500"></div>
      </div>
    );
  }

  return (
    <div className="py-20 bg-gray-50 dark:bg-slate-900 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 animate-fade-in">
          <h1 className="text-4xl md:text-6xl font-black mb-6 dark:text-white">{t('nav_trips')}</h1>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto text-lg mb-10">
            Découvrez nos aventures sélectionnées avec soin à travers tout le royaume.
          </p>

          {/* Search Bar with Glow */}
          <div className="max-w-2xl mx-auto relative group reveal">
            <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none rtl:left-auto rtl:right-0 rtl:pr-6">
              <svg className="h-6 w-6 text-gray-400 group-focus-within:yellow-text transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t('search_placeholder')}
              className="block w-full pl-16 pr-6 py-5 bg-white dark:bg-slate-800 border-2 border-transparent rounded-[2rem] shadow-lg focus:outline-none focus:border-yellow-400 dark:text-white transition-all text-lg rtl:pl-6 rtl:pr-16 btn-glow"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute inset-y-0 right-0 pr-6 flex items-center text-gray-400 hover:text-gray-600 rtl:right-auto rtl:left-0 rtl:pl-6"
              >
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        </div>

        {filteredTrips.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 mb-24">
            {filteredTrips.map((trip, i) => (
              <div key={trip.id} className="bg-white dark:bg-slate-800 rounded-[2rem] overflow-hidden shadow-md hover:shadow-2xl transition duration-500 transform hover:-translate-y-2 group reveal" style={{ transitionDelay: `${i * 100}ms` }}>
                <div className="relative h-72">
                  <img
                    src={trip.image}
                    alt={trip.title[lang]}
                    className="w-full h-full object-cover transition duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                  <div className="absolute bottom-6 left-6 right-6 flex justify-between items-end text-white">
                    <div className="rtl:text-right">
                      <h3 className="text-2xl font-bold mb-1">{trip.title[lang]}</h3>
                      <p className="text-sm opacity-80">
                        {trip.duration_value ? `${trip.duration_value} ${t('days')}` : trip.duration?.[lang]}
                      </p>
                    </div>
                    <div className="yellow-bg text-black font-bold px-4 py-1 rounded-lg text-lg">
                      {formatPrice(trip.price, trip.price_currency)}
                    </div>
                  </div>
                </div>
                <div className="p-8">
                  <p className="text-gray-600 dark:text-gray-400 mb-8 leading-relaxed h-20 overflow-hidden line-clamp-3">
                    {trip.description[lang]}
                  </p>
                  <div className="flex space-x-3 rtl:space-x-reverse">
                    <Link
                      to={`/trips/${trip.id}`}
                      className="flex-grow text-center bg-gray-900 dark:bg-slate-700 text-white py-4 rounded-2xl font-bold hover:bg-gray-800 dark:hover:bg-slate-600 transition"
                    >
                      {t('details')}
                    </Link>
                    <Link
                      to={`/reserve/${trip.id}`}
                      className="w-16 h-16 yellow-bg flex items-center justify-center rounded-2xl hover:bg-yellow-400 transition"
                    >
                      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white dark:bg-slate-800 rounded-[2.5rem] shadow-sm border border-gray-100 dark:border-gray-700 mb-24 reveal">
            <div className="text-6xl mb-6">🔍</div>
            <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">{t('no_results')}</h3>
            <button
              onClick={() => setSearchQuery('')}
              className="text-yellow-600 dark:text-yellow-400 font-bold hover:underline"
            >
              {t('reset_search')}
            </button>
          </div>
        )}

        {/* Interactive Destinations Map UI */}
        <div className="bg-white dark:bg-slate-800 p-10 rounded-[3rem] shadow-xl reveal">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
            <h2 className="text-3xl font-bold dark:text-white">Nos Destinations Favorites</h2>
            <div className="flex flex-wrap gap-2">
              {topDestinations.map((dest, idx) => (
                <button
                  key={idx}
                  onClick={() => setSearchQuery(dest.name)}
                  className="px-4 py-2 rounded-full text-sm font-bold bg-yellow-100 text-yellow-800 hover:bg-yellow-400 hover:text-black transition flex items-center space-x-2 rtl:space-x-reverse"
                >
                  <span>{dest.name}</span>
                  <span className="bg-yellow-200 text-yellow-900 px-2 py-0.5 rounded-full text-[10px]">{dest.count}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="h-[400px] md:h-[500px] rounded-[2rem] overflow-hidden border-8 border-gray-100 dark:border-gray-700 relative">
            <iframe
              title="Google Map Destinations"
              src={`https://maps.google.com/maps?q=${encodeURIComponent(topDestinations[0]?.name || 'Maroc')}&t=&z=6&ie=UTF8&iwloc=&output=embed`}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen={true}
              loading="lazy"
              className="grayscale dark:invert transition-all duration-500"
            ></iframe>

            {(recentTrip || topDestinations.length > 0) && (
              <div className="absolute top-4 left-4 bg-white dark:bg-slate-900 p-4 rounded-2xl shadow-lg z-10 max-w-[240px] hidden md:block border border-yellow-400 animate-fade-in shadow-2xl">
                {topDestinations.length > 0 && (
                  <div className="mb-4 pb-4 border-b border-gray-100 dark:border-gray-700">
                    <p className="text-xs font-bold yellow-text uppercase mb-2">Destination Phare</p>
                    <p className="text-sm dark:text-white">
                      <b>{topDestinations[0].name}</b> est votre destination la plus plébiscitée avec {topDestinations[0].count} voyages !
                    </p>
                  </div>
                )}
                {recentTrip && (
                  <div>
                    <p className="text-xs font-bold yellow-text uppercase mb-2">Dernière mise à jour</p>
                    <p className="text-sm dark:text-white">
                      Nouvelle aventure vers <b>{recentTrip.destination}</b> !
                    </p>
                    <Link
                      to={`/trips/${recentTrip.id}`}
                      className="inline-block mt-2 text-xs font-bold hover:underline"
                    >
                      Voir les détails &rarr;
                    </Link>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Trips;
