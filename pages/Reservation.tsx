import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useLanguage } from '../App';
import { supabase } from '../lib/supabase';
import { Trip } from '../types';
import emailjs from '@emailjs/browser';

const Reservation: React.FC = () => {
  const { tripId } = useParams<{ tripId: string }>();
  const navigate = useNavigate();
  const { t, lang } = useLanguage();
  const [trip, setTrip] = useState<Trip | null>(null);

  const [formData, setFormData] = useState({
    destination: '',
    tripName: '',
    fullName: '',
    email: '',
    phone: '',
    arrivalDate: '',
    departureDate: '',
    adults: '1',
    children: '0',
    comments: ''
  });

  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (tripId) {
      fetchTrip(tripId);
    }
  }, [tripId]);

  const fetchTrip = async (id: string) => {
    try {
      const { data, error } = await supabase
        .from('trips')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      if (data) {
        setTrip(data);
        setFormData(prev => ({
          ...prev,
          destination: data.destination,
          tripName: data.title[lang]
        }));
      }
    } catch (err) {
      console.error('Error fetching trip for reservation:', err);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Simulation/Preparation for EmailJS
    // NOTE: You need to set these in your .env file to make it work
    const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
    const adminTemplateId = import.meta.env.VITE_EMAILJS_ADMIN_TEMPLATE_ID;
    const userTemplateId = import.meta.env.VITE_EMAILJS_USER_TEMPLATE_ID;
    const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

    try {
      console.log('--- ENVOI EMAILJS ---');
      console.log('Données à envoyer:', {
        admin_to: 'agourramfatimaezzahra0@gmail.com',
        user_to: formData.email,
        trip: formData.tripName
      });

      if (serviceId && adminTemplateId && publicKey) {
        // 1. Send to Admin (MANDATORY)
        console.log('Envoi à l\'Admin (Template:', adminTemplateId, ')...');
        const adminRes = await emailjs.send(serviceId, adminTemplateId, {
          to_email: 'agourramfatimaezzahra0@gmail.com',
          from_name: formData.fullName,
          from_email: formData.email,
          phone: formData.phone,
          destination: formData.destination,
          trip_name: formData.tripName,
          arrival: formData.arrivalDate,
          departure: formData.departureDate,
          adults: formData.adults,
          children: formData.children,
          message: formData.comments,
        }, publicKey);
        console.log('✅ Succès Admin:', adminRes);

        // 2. Send confirmation to User (OPTIONAL / SEPARATE CACHE)
        if (userTemplateId && formData.email) {
          try {
            console.log('Envoi au Client (Template:', userTemplateId, ')...');
            const userRes = await emailjs.send(serviceId, userTemplateId, {
              to_email: formData.email, // Check if this matches {{to_email}} in EmailJS
              user_name: formData.fullName,
              trip_name: formData.tripName,
              destination: formData.destination,
              phone: formData.phone,
            }, publicKey);
            console.log('✅ Succès Client:', userRes);
          } catch (userErr: any) {
            console.warn('⚠️ L\'email de confirmation client a échoué (mais l\'admin a reçu la sienne):', userErr);
          }
        }
      } else {
        throw new Error("Configuration EmailJS manquante dans le fichier .env");
      }

      setLoading(false);
      setSubmitted(true);
      window.scrollTo(0, 0);
    } catch (err: any) {
      console.error('❌ Erreur critique EmailJS:', err);
      setError(err?.text || err?.message || "Erreur d'envoi");
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen py-20 bg-gray-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white p-10 rounded-[2.5rem] shadow-2xl text-center animate-fade-in-up">
          <div className="w-24 h-24 yellow-bg rounded-full flex items-center justify-center mx-auto mb-8 animate-bounce">
            <svg className="w-12 h-12 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-3xl font-bold mb-4">{t('success_msg')}</h2>
          <p className="text-gray-600 mb-10">
            Une confirmation a été envoyée.
          </p>
          <button
            onClick={() => setSubmitted(false)}
            className="yellow-bg text-black px-8 py-3 rounded-full font-bold hover:shadow-lg transition"
          >
            Retour
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="py-20 bg-gray-50">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white p-8 md:p-12 rounded-[2.5rem] shadow-2xl border border-gray-100">
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-5xl font-bold mb-4">{t('btn_book_now')}</h1>
            <p className="text-gray-500">Remplissez le formulaire ci-dessous pour bloquer votre place.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700 block uppercase tracking-wide">{t('form_dest')}</label>
                <input
                  type="text"
                  name="destination"
                  required
                  value={formData.destination}
                  onChange={handleChange}
                  readOnly={!!tripId}
                  className={`w-full border-2 rounded-2xl px-6 py-4 outline-none transition ${!!tripId
                    ? 'bg-gray-100 border-gray-200 text-gray-500 cursor-not-allowed'
                    : 'bg-gray-50 border-gray-100 focus:border-yellow-400 focus:bg-white'
                    }`}
                  placeholder="Ex: Sahara"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700 block uppercase tracking-wide">{t('form_city')}</label>
                <input
                  type="text"
                  name="tripName"
                  required
                  value={formData.tripName}
                  onChange={handleChange}
                  readOnly={!!tripId}
                  className={`w-full border-2 rounded-2xl px-6 py-4 outline-none transition ${!!tripId
                    ? 'bg-gray-100 border-gray-200 text-gray-500 cursor-not-allowed'
                    : 'bg-gray-50 border-gray-100 focus:border-yellow-400 focus:bg-white'
                    }`}
                  placeholder="Ex: Circuit Merzouga"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="md:col-span-1 space-y-2">
                <label className="text-sm font-bold text-gray-700 block uppercase tracking-wide">{t('form_name')}</label>
                <input
                  type="text"
                  name="fullName"
                  required
                  value={formData.fullName}
                  onChange={handleChange}
                  className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl px-6 py-4 focus:border-yellow-400 focus:bg-white outline-none transition"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700 block uppercase tracking-wide">{t('form_email')}</label>
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl px-6 py-4 focus:border-yellow-400 focus:bg-white outline-none transition"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700 block uppercase tracking-wide">{t('form_phone')}</label>
                <input
                  type="tel"
                  name="phone"
                  required
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl px-6 py-4 focus:border-yellow-400 focus:bg-white outline-none transition"
                  placeholder="+212 619677877"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700 block uppercase tracking-wide">{t('form_arrival')}</label>
                <input
                  type="date"
                  name="arrivalDate"
                  required
                  value={formData.arrivalDate}
                  onChange={handleChange}
                  className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl px-6 py-4 focus:border-yellow-400 focus:bg-white outline-none transition"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700 block uppercase tracking-wide">{t('form_departure')}</label>
                <input
                  type="date"
                  name="departureDate"
                  required
                  value={formData.departureDate}
                  onChange={handleChange}
                  className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl px-6 py-4 focus:border-yellow-400 focus:bg-white outline-none transition"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700 block uppercase tracking-wide">{t('form_adults')}</label>
                <select
                  name="adults"
                  value={formData.adults}
                  onChange={handleChange}
                  className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl px-6 py-4 focus:border-yellow-400 focus:bg-white outline-none transition"
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(n => <option key={n} value={n}>{n}</option>)}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700 block uppercase tracking-wide">{t('form_children')}</label>
                <select
                  name="children"
                  value={formData.children}
                  onChange={handleChange}
                  className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl px-6 py-4 focus:border-yellow-400 focus:bg-white outline-none transition"
                >
                  {[0, 1, 2, 3, 4, 5].map(n => <option key={n} value={n}>{n}</option>)}
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 block uppercase tracking-wide">{t('form_comments')}</label>
              <textarea
                name="comments"
                rows={4}
                value={formData.comments}
                onChange={handleChange}
                className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl px-6 py-4 focus:border-yellow-400 focus:bg-white outline-none transition"
                placeholder="Veuillez préciser toute demande particulière..."
              ></textarea>
            </div>

            {error && (
              <p className="bg-red-50 text-red-600 p-4 rounded-xl text-sm font-bold animate-shake">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className={`w-full yellow-bg text-black py-6 rounded-2xl font-black text-xl shadow-xl hover:shadow-2xl transition transform ${loading ? 'opacity-50 cursor-not-allowed' : 'hover:-translate-y-1'}`}
            >
              {loading ? 'Traitement...' : t('form_submit')}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Reservation;
