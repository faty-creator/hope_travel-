
import React from 'react';
import { useLanguage } from '../App';

const About: React.FC = () => {
  const { t } = useLanguage();

  return (
    <div className="bg-white">
      {/* Modern Header Section */}
      <section className="relative h-[60vh] flex items-center overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&q=80&w=2000"
            alt="Adventure"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-transparent rtl:bg-gradient-to-l"></div>
        </div>
        <div className="max-w-7xl mx-auto px-4 relative z-10 w-full">
          <div className="max-w-2xl animate-fade-in-up">
            <span className="yellow-bg text-black px-4 py-1 rounded-full font-bold text-sm uppercase tracking-widest mb-4 inline-block">
              {t('nav_about')}
            </span>
            <h1 className="text-5xl md:text-8xl font-black text-white mb-6 leading-tight">
              Hope<span className="yellow-text">Travel</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 leading-relaxed font-light">
              {t('about_hero_desc')}
            </p>
          </div>
        </div>
      </section>

      {/* Mission & Values */}
      <section className="py-24 relative">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-20 items-center">
          <div>
            <h2 className="text-4xl md:text-5xl font-bold mb-8 relative inline-block">
              {t('mission_title')}
              <div className="absolute -bottom-2 left-0 w-full h-2 yellow-bg -z-10 opacity-60"></div>
            </h2>
            <p className="text-gray-600 text-lg leading-relaxed mb-6">
              {t('about_mission_p1')}
            </p>
            <p className="text-gray-600 text-lg leading-relaxed">
              {t('about_mission_p2')}
            </p>

            <div className="grid grid-cols-2 gap-6 mt-12">
              <div className="bg-gray-50 p-6 rounded-3xl border-b-4 border-yellow-400">
                <span className="block text-4xl font-black text-gray-900">10+</span>
                <span className="text-gray-500 uppercase text-xs font-bold tracking-widest">{t('about_exp_label')}</span>
              </div>
              <div className="bg-gray-50 p-6 rounded-3xl border-b-4 border-yellow-400">
                <span className="block text-4xl font-black text-gray-900">5k+</span>
                <span className="text-gray-500 uppercase text-xs font-bold tracking-widest">{t('about_clients_label')}</span>
              </div>
            </div>
          </div>
          <div className="relative">
            <div className="absolute -top-4 -left-4 w-24 h-24 yellow-bg rounded-3xl -z-10 animate-pulse"></div>
            <img
              src="https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&q=80&w=800"
              alt="Fleet"
              className="rounded-[3rem] shadow-2xl relative z-10 w-full h-[500px] object-cover"
            />
            <div className="absolute -bottom-10 -right-10 bg-white p-10 rounded-[2.5rem] shadow-2xl max-w-xs hidden lg:block z-20">
              <p className="text-gray-800 font-bold italic text-lg">
                "{t('about_quote')}"
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Our Team Section */}
      <section className="py-24 bg-gray-900 text-white overflow-hidden relative">
        <div className="absolute bottom-0 right-0 w-96 h-96 yellow-bg rounded-full blur-[150px] opacity-10"></div>
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">{t('team_title')}</h2>
            <div className="w-24 h-1 yellow-bg mx-auto mb-6"></div>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              {t('team_subtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
            {[
              { name: "Ahmed Mansouri", role: t('team_title'), img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400" }, // Note: Role needs specific keys if varied
              { name: "Sarah Alami", role: t('nav_trips'), img: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=400" },
              { name: "Youssef Karim", role: t('adv_guides'), img: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=400" },
              { name: "Leila Haddad", role: t('nav_contact'), img: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400" }
            ].map((member, i) => (
              <div key={i} className="group relative">
                <div className="relative h-96 rounded-[2rem] overflow-hidden mb-6">
                  <img
                    src={member.img}
                    alt={member.name}
                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition duration-500"></div>
                  <div className="absolute bottom-6 left-6 right-6 translate-y-10 group-hover:translate-y-0 transition duration-500 opacity-0 group-hover:opacity-100">
                    <div className="flex space-x-3 rtl:space-x-reverse">
                      <div className="w-10 h-10 rounded-full yellow-bg text-black flex items-center justify-center cursor-pointer hover:bg-white transition"><i className="fab fa-linkedin-in"></i></div>
                      <div className="w-10 h-10 rounded-full yellow-bg text-black flex items-center justify-center cursor-pointer hover:bg-white transition"><i className="fab fa-twitter"></i></div>
                    </div>
                  </div>
                </div>
                <h3 className="text-xl font-bold mb-1">{member.name}</h3>
                <p className="text-yellow-400 text-sm font-bold uppercase tracking-wider">{member.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Vision & Values Grid */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="p-12 rounded-[3rem] bg-gray-50 border border-transparent hover:border-yellow-400 transition duration-500">
              <div className="w-16 h-16 yellow-bg rounded-2xl flex items-center justify-center text-3xl mb-8">🛡️</div>
              <h3 className="text-2xl font-bold mb-4">{t('about_value_safety_title')}</h3>
              <p className="text-gray-600 leading-relaxed">{t('about_value_safety_desc')}</p>
            </div>
            <div className="p-12 rounded-[3rem] bg-gray-50 border border-transparent hover:border-yellow-400 transition duration-500">
              <div className="w-16 h-16 yellow-bg rounded-2xl flex items-center justify-center text-3xl mb-8">🤝</div>
              <h3 className="text-2xl font-bold mb-4">{t('about_value_trust_title')}</h3>
              <p className="text-gray-600 leading-relaxed">{t('about_value_trust_desc')}</p>
            </div>
            <div className="p-12 rounded-[3rem] bg-gray-50 border border-transparent hover:border-yellow-400 transition duration-500">
              <div className="w-16 h-16 yellow-bg rounded-2xl flex items-center justify-center text-3xl mb-8">✨</div>
              <h3 className="text-2xl font-bold mb-4">{t('about_value_comfort_title')}</h3>
              <p className="text-gray-600 leading-relaxed">{t('about_value_comfort_desc')}</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
