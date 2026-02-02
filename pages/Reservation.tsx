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
  const [isHovered, setIsHovered] = useState(false);
  const [formStep, setFormStep] = useState(1);
  const totalSteps = 4;

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
  const [successMessage, setSuccessMessage] = useState('');

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

  const nextStep = () => {
    if (formStep < totalSteps) {
      setFormStep(formStep + 1);
      window.scrollTo(0, 0);
    }
  };

  const prevStep = () => {
    if (formStep > 1) {
      setFormStep(formStep - 1);
      window.scrollTo(0, 0);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
    const adminTemplateId = import.meta.env.VITE_EMAILJS_ADMIN_TEMPLATE_ID;
    const userTemplateId = import.meta.env.VITE_EMAILJS_USER_TEMPLATE_ID;
    const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

    try {
      if (serviceId && adminTemplateId && publicKey) {
        // 1. Send to Admin
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

        // 2. Send confirmation to User
        if (userTemplateId && formData.email) {
          try {
            await emailjs.send(serviceId, userTemplateId, {
              to_email: formData.email,
              user_name: formData.fullName,
              trip_name: formData.tripName,
              destination: formData.destination,
              phone: formData.phone,
            }, publicKey);
          } catch (userErr: any) {
            console.warn('Email client échoué:', userErr);
          }
        }
      } else {
        throw new Error("Configuration EmailJS manquante");
      }

      setLoading(false);
      setSuccessMessage(`Merci ${formData.fullName} ! Votre réservation pour ${formData.tripName} a été envoyée.`);
      setSubmitted(true);
      window.scrollTo(0, 0);
    } catch (err: any) {
      console.error('Erreur EmailJS:', err);
      setError(err?.text || err?.message || "Erreur d'envoi. Veuillez réessayer.");
      setLoading(false);
    }
  };

  // Icônes SVG inline pour éviter les erreurs d'import
  const Icons = {
    Check: () => (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
      </svg>
    ),
    User: () => (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
    ),
    Mail: () => (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
    Phone: () => (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
      </svg>
    ),
    MapPin: () => (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
    Calendar: () => (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
    ChevronDown: () => (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
      </svg>
    ),
    ChevronLeft: () => (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
      </svg>
    ),
    ChevronRight: () => (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
      </svg>
    ),
    Alert: () => (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.346 16.5c-.77.833.192 2.5 1.732 2.5z" />
      </svg>
    ),
    Clock: () => (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    )
  };

  if (submitted) {
    return (
      <div className="min-h-screen py-20 bg-gradient-to-br from-[#0a0f1d] via-[#0c1224] to-[#090e1a] flex items-center justify-center px-4 relative overflow-hidden">
        <div className="absolute top-1/4 left-10 w-72 h-72 bg-gradient-to-r from-yellow-400/10 to-orange-500/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-10 w-96 h-96 bg-gradient-to-l from-amber-500/5 to-transparent rounded-full blur-3xl"></div>
        
        <div className="relative z-10 max-w-lg w-full bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-lg border border-white/10 p-8 md:p-10 rounded-[2.5rem] shadow-2xl text-center">
          <div className="relative inline-block mb-8">
            <div className="absolute -inset-4 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full blur-2xl opacity-30 animate-pulse"></div>
            <div className="relative w-24 h-24 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mx-auto shadow-2xl">
              <Icons.Check />
            </div>
          </div>
          
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">
            Réservation Confirmée !
          </h2>
          
          <div className="space-y-4 mb-10">
            <p className="text-xl text-gray-200 font-medium">
              {successMessage}
            </p>
            <p className="text-gray-400">
              Notre équipe vous contactera dans les plus brefs délais pour finaliser votre réservation.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate('/trips')}
              className="px-6 py-3 rounded-2xl bg-gradient-to-r from-yellow-400/20 to-orange-500/20 border border-yellow-400/30 text-yellow-300 font-bold hover:from-yellow-400/30 hover:to-orange-500/30 transition-all duration-300"
            >
              Voir d'autres voyages
            </button>
            <button
              onClick={() => {
                setSubmitted(false);
                setFormStep(1);
              }}
              className="px-6 py-3 rounded-2xl bg-gradient-to-r from-yellow-400 to-orange-500 text-black font-bold hover:shadow-lg transition-all duration-300"
            >
              Nouvelle réservation
            </button>
          </div>
        </div>
      </div>
    );
  }

  const renderStep = () => {
    switch(formStep) {
      case 1:
        return (
          <div className="space-y-8">
            <h3 className="text-2xl font-bold text-white mb-6">Informations Personnelles</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <label className="text-sm font-bold text-gray-300 block uppercase tracking-wide">{t('form_name')}</label>
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                    <Icons.User />
                  </div>
                  <input
                    type="text"
                    name="fullName"
                    required
                    value={formData.fullName}
                    onChange={handleChange}
                    className="w-full bg-white/5 border-2 border-white/10 rounded-2xl pl-12 pr-6 py-4 text-white placeholder-gray-400 focus:border-yellow-400 focus:bg-white/10 outline-none transition-all duration-300"
                    placeholder="Votre nom complet"
                  />
                </div>
              </div>
              <div className="space-y-3">
                <label className="text-sm font-bold text-gray-300 block uppercase tracking-wide">{t('form_email')}</label>
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                    <Icons.Mail />
                  </div>
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full bg-white/5 border-2 border-white/10 rounded-2xl pl-12 pr-6 py-4 text-white placeholder-gray-400 focus:border-yellow-400 focus:bg-white/10 outline-none transition-all duration-300"
                    placeholder="email@exemple.com"
                  />
                </div>
              </div>
              <div className="space-y-3">
                <label className="text-sm font-bold text-gray-300 block uppercase tracking-wide">{t('form_phone')}</label>
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                    <Icons.Phone />
                  </div>
                  <input
                    type="tel"
                    name="phone"
                    required
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full bg-white/5 border-2 border-white/10 rounded-2xl pl-12 pr-6 py-4 text-white placeholder-gray-400 focus:border-yellow-400 focus:bg-white/10 outline-none transition-all duration-300"
                    placeholder="+212 619677877"
                  />
                </div>
              </div>
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-8">
            <h3 className="text-2xl font-bold text-white mb-6">Détails du Voyage</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <label className="text-sm font-bold text-gray-300 block uppercase tracking-wide">{t('form_dest')}</label>
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                    <Icons.MapPin />
                  </div>
                  <input
                    type="text"
                    name="destination"
                    required
                    value={formData.destination}
                    onChange={handleChange}
                    readOnly={!!tripId}
                    className={`w-full rounded-2xl pl-12 pr-6 py-4 text-white placeholder-gray-400 focus:border-yellow-400 outline-none transition-all duration-300 ${!!tripId
                      ? 'bg-white/10 border-2 border-white/10 cursor-not-allowed'
                      : 'bg-white/5 border-2 border-white/10 focus:border-yellow-400 focus:bg-white/10'
                    }`}
                    placeholder="Ex: Sahara"
                  />
                </div>
              </div>
              <div className="space-y-3">
                <label className="text-sm font-bold text-gray-300 block uppercase tracking-wide">{t('form_city')}</label>
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                    <Icons.Calendar />
                  </div>
                  <input
                    type="text"
                    name="tripName"
                    required
                    value={formData.tripName}
                    onChange={handleChange}
                    readOnly={!!tripId}
                    className={`w-full rounded-2xl pl-12 pr-6 py-4 text-white placeholder-gray-400 focus:border-yellow-400 outline-none transition-all duration-300 ${!!tripId
                      ? 'bg-white/10 border-2 border-white/10 cursor-not-allowed'
                      : 'bg-white/5 border-2 border-white/10 focus:border-yellow-400 focus:bg-white/10'
                    }`}
                    placeholder="Ex: Circuit Merzouga"
                  />
                </div>
              </div>
            </div>
          </div>
        );
      case 3:
        return (
          <div className="space-y-8">
            <h3 className="text-2xl font-bold text-white mb-6">Dates & Participants</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <label className="text-sm font-bold text-gray-300 block uppercase tracking-wide">{t('form_arrival')}</label>
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                    <Icons.Calendar />
                  </div>
                  <input
                    type="date"
                    name="arrivalDate"
                    required
                    value={formData.arrivalDate}
                    onChange={handleChange}
                    className="w-full bg-white/5 border-2 border-white/10 rounded-2xl pl-12 pr-6 py-4 text-white placeholder-gray-400 focus:border-yellow-400 focus:bg-white/10 outline-none transition-all duration-300"
                  />
                </div>
              </div>
              <div className="space-y-3">
                <label className="text-sm font-bold text-gray-300 block uppercase tracking-wide">{t('form_departure')}</label>
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                    <Icons.Calendar />
                  </div>
                  <input
                    type="date"
                    name="departureDate"
                    required
                    value={formData.departureDate}
                    onChange={handleChange}
                    className="w-full bg-white/5 border-2 border-white/10 rounded-2xl pl-12 pr-6 py-4 text-white placeholder-gray-400 focus:border-yellow-400 focus:bg-white/10 outline-none transition-all duration-300"
                  />
                </div>
              </div>
              <div className="space-y-3">
                <label className="text-sm font-bold text-gray-300 block uppercase tracking-wide">{t('form_adults')}</label>
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                    <Icons.User />
                  </div>
                  <select
                    name="adults"
                    value={formData.adults}
                    onChange={handleChange}
                    className="w-full bg-white/5 border-2 border-white/10 rounded-2xl pl-12 pr-6 py-4 text-white focus:border-yellow-400 focus:bg-white/10 outline-none transition-all duration-300 appearance-none"
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(n => <option key={n} value={n} className="bg-gray-900">{n} {n === 1 ? 'adulte' : 'adultes'}</option>)}
                  </select>
                  <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                    <Icons.ChevronDown />
                  </div>
                </div>
              </div>
              <div className="space-y-3">
                <label className="text-sm font-bold text-gray-300 block uppercase tracking-wide">{t('form_children')}</label>
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                    <Icons.User />
                  </div>
                  <select
                    name="children"
                    value={formData.children}
                    onChange={handleChange}
                    className="w-full bg-white/5 border-2 border-white/10 rounded-2xl pl-12 pr-6 py-4 text-white focus:border-yellow-400 focus:bg-white/10 outline-none transition-all duration-300 appearance-none"
                  >
                    {[0, 1, 2, 3, 4, 5].map(n => <option key={n} value={n} className="bg-gray-900">{n} {n === 1 ? 'enfant' : 'enfants'}</option>)}
                  </select>
                  <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                    <Icons.ChevronDown />
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      case 4:
        return (
          <div className="space-y-8">
            <h3 className="text-2xl font-bold text-white mb-6">Informations Complémentaires</h3>
            <div className="space-y-3">
              <label className="text-sm font-bold text-gray-300 block uppercase tracking-wide">{t('form_comments')}</label>
              <div className="relative group">
                <textarea
                  name="comments"
                  rows={4}
                  value={formData.comments}
                  onChange={handleChange}
                  className="w-full bg-white/5 border-2 border-white/10 rounded-2xl px-6 py-4 text-white placeholder-gray-400 focus:border-yellow-400 focus:bg-white/10 outline-none transition-all duration-300 resize-none"
                  placeholder="Veuillez préciser toute demande particulière (régime alimentaire, hébergement, etc.)..."
                />
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen py-20 bg-gradient-to-br from-[#0a0f1d] via-[#0c1224] to-[#090e1a] relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-yellow-400/5 to-transparent"></div>
      <div className="absolute top-1/4 right-0 w-96 h-96 bg-gradient-to-l from-amber-500/5 to-transparent rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-72 h-72 bg-gradient-to-r from-yellow-400/3 to-transparent rounded-full blur-3xl"></div>

      <div className="relative z-10 max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-block relative mb-6">
            <div className="absolute -inset-4 bg-gradient-to-r from-yellow-400/20 via-orange-500/15 to-amber-400/20 rounded-full blur-2xl"></div>
            <h1 className="relative text-4xl md:text-6xl font-bold mb-6 text-white">
              {t('btn_book_now')}
            </h1>
          </div>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Remplissez le formulaire ci-dessous pour réserver votre aventure inoubliable
          </p>
        </div>

        {/* Progress Steps */}
        <div className="flex justify-center mb-12">
          <div className="flex items-center gap-2 md:gap-4">
            {[...Array(totalSteps)].map((_, idx) => (
              <React.Fragment key={idx}>
                <div className="flex flex-col items-center">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg transition-all duration-500 ${
                    idx + 1 === formStep
                      ? 'bg-gradient-to-r from-yellow-400 to-orange-500 text-black scale-110 shadow-lg shadow-yellow-400/30'
                      : idx + 1 < formStep
                      ? 'bg-gradient-to-r from-yellow-400/30 to-orange-500/30 text-yellow-300'
                      : 'bg-white/10 text-gray-400'
                  }`}>
                    {idx + 1}
                  </div>
                  <span className="text-xs mt-2 text-gray-400 uppercase font-semibold tracking-wider">
                    {['Info', 'Voyage', 'Dates', 'Final'][idx]}
                  </span>
                </div>
                {idx < totalSteps - 1 && (
                  <div className={`w-16 h-1 rounded-full transition-all duration-500 ${
                    idx + 1 < formStep
                      ? 'bg-gradient-to-r from-yellow-400 to-orange-500'
                      : 'bg-white/10'
                  }`}></div>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Form Container */}
        <div className="bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-lg border border-white/10 rounded-[2.5rem] p-8 md:p-12 shadow-2xl mb-8">
          <form onSubmit={handleSubmit} className="space-y-8">
            {renderStep()}

            {error && (
              <div className="bg-gradient-to-r from-red-500/10 to-red-600/10 border border-red-400/20 p-4 rounded-2xl text-red-300 text-sm font-bold">
                <div className="flex items-center gap-2">
                  <Icons.Alert />
                  <span>{error}</span>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-8 border-t border-white/10">
              {formStep > 1 && (
                <button
                  type="button"
                  onClick={prevStep}
                  className="flex-1 bg-white/5 border-2 border-white/10 text-white px-8 py-4 rounded-2xl font-bold hover:bg-white/10 transition-all duration-300 flex items-center justify-center gap-2"
                >
                  <Icons.ChevronLeft />
                  Précédent
                </button>
              )}
              
              {formStep < totalSteps ? (
                <button
                  type="button"
                  onClick={nextStep}
                  className={`flex-1 bg-gradient-to-r from-yellow-400 to-orange-500 text-black px-8 py-4 rounded-2xl font-bold hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2 ${formStep === 1 ? 'sm:col-span-2' : ''}`}
                  onMouseEnter={() => setIsHovered(true)}
                  onMouseLeave={() => setIsHovered(false)}
                >
                  Suivant
                  <div className={`transform transition-transform duration-300 ${isHovered ? 'translate-x-1' : ''}`}>
                    <Icons.ChevronRight />
                  </div>
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={loading}
                  className={`flex-1 bg-gradient-to-r from-yellow-400 to-orange-500 text-black px-8 py-4 rounded-2xl font-bold hover:shadow-lg transition-all duration-300 ${loading ? 'opacity-50 cursor-not-allowed' : ''} flex items-center justify-center gap-2`}
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-black"></div>
                      Traitement...
                    </>
                  ) : (
                    <>
                      Finaliser la réservation
                      <Icons.Check />
                    </>
                  )}
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Info Box */}
        <div className="bg-gradient-to-r from-yellow-400/10 to-orange-500/10 backdrop-blur-lg border border-yellow-400/20 rounded-2xl p-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-r from-yellow-400/20 to-orange-500/20 flex items-center justify-center">
                <Icons.Phone />
              </div>
              <div>
                <h4 className="font-bold text-white">Besoin d'aide ?</h4>
                <p className="text-gray-400 text-sm">Appelez-nous au +212 619677877</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-r from-yellow-400/20 to-orange-500/20 flex items-center justify-center">
                <Icons.Clock />
              </div>
              <div>
                <h4 className="font-bold text-white">Réponse rapide</h4>
                <p className="text-gray-400 text-sm">Sous 24h maximum</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reservation;