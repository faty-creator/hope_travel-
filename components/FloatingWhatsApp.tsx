
import React from 'react';

const FloatingWhatsApp: React.FC = () => {
  return (
    <a
      href="https://wa.me/212600000000"
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 bg-[#25D366] text-white p-4 rounded-full shadow-2xl hover:scale-110 transition transform duration-300 group"
    >
      <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12.031 6.172c-2.32 0-4.518.903-6.157 2.543-1.64 1.64-2.543 3.838-2.543 6.157 0 1.25.267 2.478.793 3.606l-1.042 3.804 3.893-1.022c1.082.522 2.274.798 3.511.798 2.32 0 4.518-.903 6.157-2.543 1.64-1.64 2.543-3.838 2.543-6.157 0-2.32-.903-4.518-2.543-6.157-1.64-1.64-3.838-2.543-6.157-2.543zm.001 13.911c-1.114 0-2.204-.263-3.18-.762l-.228-.116-2.36.62.63-2.298-.127-.202a6.972 6.972 0 01-1.066-3.692c0-3.858 3.14-6.998 6.998-6.998 3.858 0 6.998 3.14 6.998 6.998s-3.14 6.998-6.998 6.998z"/>
      </svg>
      <span className="absolute right-16 bottom-2 bg-white text-black text-sm font-bold px-3 py-1 rounded shadow-lg opacity-0 group-hover:opacity-100 transition duration-300 pointer-events-none whitespace-nowrap">
        Contactez-nous
      </span>
    </a>
  );
};

export default FloatingWhatsApp;
