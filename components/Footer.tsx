
import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../App';

const Footer: React.FC = () => {
  const { t } = useLanguage();

  const socials = [
    { id: 'whatsapp', icon: 'fab fa-whatsapp', url: 'https://wa.me/212619677877' },
    { id: 'instagram', icon: 'fab fa-instagram', url: 'https://instagram.com/hopetravel' },
    { id: 'tiktok', icon: 'fab fa-tiktok', url: 'https://tiktok.com/@hopetravel' },
    { id: 'facebook', icon: 'fab fa-facebook-f', url: 'https://facebook.com/hopetravel' }
  ];

  return (
    <footer className="bg-gray-900 text-white pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-12">
        <div className="col-span-1 md:col-span-2">
          <Link to="/" className="text-3xl font-bold yellow-text flex items-center space-x-2 mb-6">
            <span className="text-white">Hope</span><span>Travel</span>
          </Link>
          <p className="text-gray-400 max-w-sm mb-8 leading-relaxed">
            {t('footer_text')}
          </p>
          <div className="flex space-x-4 rtl:space-x-reverse">
            {socials.map((social) => (
              <a
                key={social.id}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 rounded-2xl bg-gray-800 flex items-center justify-center hover:yellow-bg hover:text-black transition transform hover:-translate-y-1 shadow-lg"
              >
                <i className={social.icon}></i>
                <span className="sr-only">{social.id}</span>
              </a>
            ))}
          </div>
        </div>

        <div>
          <h4 className="text-lg font-bold mb-6 yellow-text">{t('nav_trips')}</h4>
          <ul className="space-y-4">
            <li><Link to="/trips" className="text-gray-400 hover:text-white transition">{t('nav_trips')}</Link></li>
            <li><Link to="/about" className="text-gray-400 hover:text-white transition">{t('nav_about')}</Link></li>
            <li><Link to="/contact" className="text-gray-400 hover:text-white transition">{t('nav_contact')}</Link></li>
            <li><Link to="/reserve" className="text-gray-400 hover:text-white transition">{t('btn_book_now')}</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-lg font-bold mb-6 yellow-text">{t('nav_contact')}</h4>
          <ul className="space-y-4 text-gray-400">
            <li className="flex items-center rtl:flex-row-reverse">
              <span className="mr-3 rtl:mr-0 rtl:ml-3">📍</span>
              {t('footer_address_city')}
            </li>
            <li className="flex items-center rtl:flex-row-reverse">
              <span className="mr-3 rtl:mr-0 rtl:ml-3">📞</span>
              {t('topbar_phone')}
            </li>
            <li className="flex items-center rtl:flex-row-reverse">
              <span className="mr-3 rtl:mr-0 rtl:ml-3">📧</span>
              contact@hopetravel.com
            </li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16 pt-8 border-t border-gray-800 text-center text-gray-500 text-sm">
        &copy; {new Date().getFullYear()} HopeTravel. {t('footer_rights')}
      </div>
    </footer>
  );
};

export default Footer;
