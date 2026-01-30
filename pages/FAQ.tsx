
import React from 'react';
// Added missing Link import from react-router-dom
import { Link } from 'react-router-dom';
import { useLanguage } from '../App';

const FAQ: React.FC = () => {
  const { t, lang } = useLanguage();

  const faqs = [
    {
      q: { fr: "Comment réserver un voyage ?", ar: "كيف يمكنني حجز رحلة؟", en: "How do I book a trip?" },
      a: { 
        fr: "Vous pouvez réserver directement sur notre site via la page 'Voyages' ou en nous contactant sur WhatsApp.",
        ar: "يمكنك الحجز مباشرة عبر موقعنا من خلال صفحة 'الرحلات' أو عبر التواصل معنا على واتساب.",
        en: "You can book directly on our website via the 'Trips' page or by contacting us on WhatsApp."
      }
    },
    {
      q: { fr: "Quels sont les modes de paiement ?", ar: "ما هي طرق الدفع؟", en: "What are the payment methods?" },
      a: { 
        fr: "Nous acceptons le paiement en espèces à l'arrivée, le virement bancaire ou le paiement sécurisé par carte.",
        ar: "نقبل الدفع نقداً عند الوصول، أو عبر التحويل البنكي، أو الدفع الآمن بالبطاقة.",
        en: "We accept cash on arrival, bank transfer, or secure card payment."
      }
    },
    {
      q: { fr: "Le transport est-il inclus ?", ar: "هل النقل متضمن؟", en: "Is transport included?" },
      a: { 
        fr: "Oui, tous nos voyages organisés incluent le transport dans des bus touristiques modernes et climatisés.",
        ar: "نعم، جميع رحلاتنا المنظمة تشمل النقل في حافلات سياحية حديثة ومكيفة.",
        en: "Yes, all our organized trips include transport in modern, air-conditioned tourist buses."
      }
    },
    {
      q: { fr: "Puis-je annuler ma réservation ?", ar: "هل يمكنني إلغاء حجزي؟", en: "Can I cancel my reservation?" },
      a: { 
        fr: "L'annulation est gratuite jusqu'à 48h avant le départ. Passé ce délai, des frais peuvent s'appliquer.",
        ar: "الإلغاء مجاني حتى 48 ساعة قبل المغادرة. بعد ذلك، قد يتم تطبيق رسوم.",
        en: "Cancellation is free up to 48 hours before departure. After this period, fees may apply."
      }
    }
  ];

  return (
    <div className="py-24 bg-gray-50 dark:bg-slate-900 min-h-screen">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-black mb-4 dark:text-white">{t('nav_faq')}</h1>
          <div className="w-24 h-2 yellow-bg mx-auto rounded-full"></div>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <details key={idx} className="faq-details bg-white dark:bg-slate-800 rounded-3xl shadow-md overflow-hidden transition-all duration-300 reveal" style={{transitionDelay: `${idx * 100}ms`}}>
              <summary className="flex items-center justify-between p-8 cursor-pointer font-bold text-lg dark:text-white hover:bg-gray-50 dark:hover:bg-slate-700 transition">
                <span>{faq.q[lang]}</span>
                <svg className="w-6 h-6 yellow-text transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" />
                </svg>
              </summary>
              <div className="p-8 pt-0 text-gray-600 dark:text-gray-300 leading-relaxed animate-fade-in-up">
                {faq.a[lang]}
              </div>
            </details>
          ))}
        </div>

        {/* QR Code Section */}
        <div className="mt-24 p-12 bg-white dark:bg-slate-800 rounded-[3rem] shadow-xl text-center reveal">
          <h2 className="text-2xl font-bold mb-4 dark:text-white">{t('brochure_title')}</h2>
          <p className="text-gray-500 dark:text-gray-400 mb-8">{t('brochure_desc')}</p>
          <div className="inline-block p-6 bg-gray-100 dark:bg-slate-700 rounded-3xl border-4 border-yellow-400">
            {/* Generating a placeholder QR Code using a public API */}
            <img 
              src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=https://hopetravel.ma/brochure.pdf`} 
              alt="QR Code Brochure" 
              className="w-48 h-48"
            />
          </div>
          <div className="mt-8">
             <Link to="/contact" className="text-yellow-600 dark:text-yellow-400 font-bold hover:underline">
               {t('nav_contact')} &rarr;
             </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FAQ;
