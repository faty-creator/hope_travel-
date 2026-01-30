
import React from 'react';
import { Trip } from './types';

export const TRIPS: Trip[] = [
  {
    id: '1',
    title: { fr: 'Désert de Merzouga', ar: 'صحراء مرزوكة', en: 'Merzouga Desert' },
    destination: 'Merzouga, Maroc',
    duration: { fr: '3 Jours / 2 Nuits', ar: '3 أيام / ليلتان', en: '3 Days / 2 Nights' },
    price: 1500,
    image: 'https://images.unsplash.com/photo-1542332213-31f87348057f?auto=format&fit=crop&q=80&w=800',
    description: {
      fr: 'Une aventure inoubliable au cœur du Sahara.',
      ar: 'مغامرة لا تنسى في قلب الصحراء الكبرى.',
      en: 'An unforgettable adventure in the heart of the Sahara.'
    },
    program: [
      { day: 1, title: { fr: 'Départ', ar: 'الذهاب', en: 'Departure' }, desc: { fr: 'Trajet vers le désert et coucher de soleil.', ar: 'الطريق نحو الصحراء ومشاهدة الغروب.', en: 'Travel to the desert and sunset viewing.' } },
      { day: 2, title: { fr: 'Dunes', ar: 'الكثبان الرملية', en: 'Dunes' }, desc: { fr: 'Balade en chameau et nuit sous les étoiles.', ar: 'ركوب الجمال وليلة تحت النجوم.', en: 'Camel ride and night under the stars.' } }
    ],
    included: [
      { fr: 'Transport climatisé', ar: 'نقل مكيف', en: 'AC Transport' },
      { fr: 'Demi-pension', ar: 'إقامة نصف شاملة', en: 'Half board' }
    ],
    notIncluded: [
      { fr: 'Dépenses personnelles', ar: 'مصاريف شخصية', en: 'Personal expenses' }
    ]
  },
  {
    id: '2',
    title: { fr: 'Montagnes de l\'Atlas', ar: 'جبال الأطلس', en: 'Atlas Mountains' },
    destination: 'Imlil, Maroc',
    duration: { fr: '1 Jour', ar: 'يوم واحد', en: '1 Day' },
    price: 350,
    image: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&q=80&w=800',
    description: {
      fr: 'Randonnée et grand air dans le Haut Atlas.',
      ar: 'المشي لمسافات طويلة والهواء النقي في الأطلس الكبير.',
      en: 'Hiking and fresh air in the High Atlas.'
    },
    program: [
      { day: 1, title: { fr: 'Sommets', ar: 'القمم', en: 'Peaks' }, desc: { fr: 'Randonnée guidée et déjeuner traditionnel.', ar: 'جولة مشي مع مرشد وغداء تقليدي.', en: 'Guided hike and traditional lunch.' } }
    ],
    included: [
      { fr: 'Guide local', ar: 'مرشد محلي', en: 'Local guide' },
      { fr: 'Déjeuner', ar: 'غداء', en: 'Lunch' }
    ],
    notIncluded: [
      { fr: 'Boissons', ar: 'مشروبات', en: 'Drinks' }
    ]
  },
  {
    id: '3',
    title: { fr: 'Escapade à Chefchaouen', ar: 'رحلة إلى شفشاون', en: 'Chefchaouen Escape' },
    destination: 'Chefchaouen, Maroc',
    duration: { fr: 'Week-end (2 Jours)', ar: 'نهاية الأسبوع (يومان)', en: 'Weekend (2 Days)' },
    price: 850,
    image: 'https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&q=80&w=800',
    description: {
      fr: 'Visitez la perle bleue du Nord.',
      ar: 'قم بزيارة الجوهرة الزرقاء في الشمال.',
      en: 'Visit the blue pearl of the North.'
    },
    program: [
      { day: 1, title: { fr: 'Médina', ar: 'المدينة القديمة', en: 'Medina' }, desc: { fr: 'Exploration de la ville bleue.', ar: 'استكشاف المدينة الزرقاء.', en: 'Exploration of the blue city.' } },
      { day: 2, title: { fr: 'Cascades', ar: 'الشلالات', en: 'Waterfalls' }, desc: { fr: 'Visite d\'Akchour.', ar: 'زيارة أقشور.', en: 'Visit to Akchour.' } }
    ],
    included: [
      { fr: 'Hébergement', ar: 'إقامة', en: 'Accommodation' },
      { fr: 'Transport', ar: 'نقل', en: 'Transport' }
    ],
    notIncluded: [
      { fr: 'Extras', ar: 'إضافات', en: 'Extras' }
    ]
  }
];

export const Icons = {
  Bus: () => <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24"><path d="M18 11V7a2 2 0 00-2-2H8a2 2 0 00-2 2v4a3 3 0 00-3 3v3h1a2 2 0 004 0h8a2 2 0 004 0h1v-3a3 3 0 00-3-3zM8 7h8v4H8V7zm11 11H5v-4a1 1 0 011-1h12a1 1 0 011 1v4z"/></svg>,
  Guide: () => <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2a5 5 0 105 5 5 5 0 00-5-5zm0 8a3 3 0 113-3 3 3 0 01-3 3zm9 11v-1a7 7 0 00-7-7h-4a7 7 0 00-7 7v1h2v-1a5 5 0 015-5h4a5 5 0 015 5v1h2z"/></svg>,
  Star: () => <svg className="w-5 h-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
};
