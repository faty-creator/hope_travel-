
import React, { useState } from 'react';
import { useLanguage } from '../App';

const Contact: React.FC = () => {
  const { t } = useLanguage();
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Theoretical logic for sending email to administration
    console.log('--- ENVOI MESSAGE CONTACT ---');
    console.log('Destinataire: agourramfatimaezzahra0@gmail.com');

    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
      window.scrollTo(0, 0);
    }, 1500);
  };

  if (submitted) {
    return (
      <div className="min-h-screen py-20 bg-gray-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white p-10 rounded-[2.5rem] shadow-2xl text-center">
          <div className="w-20 h-20 yellow-bg rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold mb-4">{t('contact_success_title')}</h2>
          <p className="text-gray-600 mb-8">{t('contact_success_desc')}</p>
          <button onClick={() => setSubmitted(false)} className="yellow-bg text-black px-8 py-3 rounded-xl font-bold">{t('contact_ok')}</button>
        </div>
      </div>
    );
  }

  return (
    <div className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20 animate-fade-in">
          <h1 className="text-5xl font-bold mb-6">{t('nav_contact')}</h1>
          <p className="text-xl text-gray-500 max-w-2xl mx-auto">
            {t('contact_subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Contact Form */}
          <div className="bg-white p-10 rounded-[2.5rem] shadow-xl">
            <h2 className="text-2xl font-bold mb-8">{t('contact_form_title')}</h2>
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-sm font-bold text-gray-700 block mb-2">{t('form_name')}</label>
                  <input type="text" required className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:border-yellow-400 focus:bg-white outline-none transition" />
                </div>
                <div>
                  <label className="text-sm font-bold text-gray-700 block mb-2">{t('form_email')}</label>
                  <input type="email" required className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:border-yellow-400 focus:bg-white outline-none transition" />
                </div>
              </div>
              <div>
                <label className="text-sm font-bold text-gray-700 block mb-2">{t('contact_form_subject')}</label>
                <input type="text" required className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:border-yellow-400 focus:bg-white outline-none transition" />
              </div>
              <div>
                <label className="text-sm font-bold text-gray-700 block mb-2">{t('contact_form_message')}</label>
                <textarea rows={5} required className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:border-yellow-400 focus:bg-white outline-none transition"></textarea>
              </div>
              <button
                type="submit"
                disabled={loading}
                className={`w-full yellow-bg text-black py-5 rounded-2xl font-bold text-lg shadow-lg hover:shadow-2xl transition ${loading ? 'opacity-50' : ''}`}
              >
                {loading ? t('contact_btn_sending') : t('contact_btn_send')}
              </button>
            </form>
          </div>

          {/* Info & Map */}
          <div className="flex flex-col space-y-12">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
                <div className="w-12 h-12 yellow-bg flex items-center justify-center rounded-2xl mb-6 text-2xl">📞</div>
                <h3 className="font-bold mb-2">{t('contact_phone')}</h3>
                <p className="text-gray-500">{t('topbar_phone')}</p>
              </div>
              <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
                <div className="w-12 h-12 yellow-bg flex items-center justify-center rounded-2xl mb-6 text-2xl">💬</div>
                <h3 className="font-bold mb-2">{t('contact_whatsapp')}</h3>
                <p className="text-gray-500">+212 600 000 001</p>
              </div>
              <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
                <div className="w-12 h-12 yellow-bg flex items-center justify-center rounded-2xl mb-6 text-2xl">📧</div>
                <h3 className="font-bold mb-2">{t('form_email')}</h3>
                <p className="text-gray-500 text-xs">agourramfatimaezzahra0@gmail.com</p>
              </div>
              <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
                <div className="w-12 h-12 yellow-bg flex items-center justify-center rounded-2xl mb-6 text-2xl">📍</div>
                <h3 className="font-bold mb-2">{t('contact_address')}</h3>
                <p className="text-gray-500">{t('footer_address_city')}</p>
              </div>
            </div>

            <div className="h-64 rounded-[2.5rem] overflow-hidden shadow-lg border-8 border-white">
              <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d103607.67053224081!2d-8.090254583881107!3d31.634594989247148!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xdafee8d96179e51%3A0x5950b6534f87adb8!2sMarrakech!5e1!3m2!1sfr!2sma!4v1769986391059!5m2!1sfr!2sma" width="600" height="450" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
