
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
            src="data:image/webp;base64,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"
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
