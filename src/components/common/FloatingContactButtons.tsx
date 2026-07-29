import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

export const FloatingContactButtons: React.FC = () => {
  const { t } = useTranslation();
  const [hovered, setHovered] = useState<'zalo' | 'messenger' | null>(null);

  const zaloLink = 'https://zalo.me/0376960193';
  const messengerLink = 'https://www.facebook.com/messages/t/alvin.tran.872661';

  const zaloTooltip = t('contactButtons.zalo', 'Chat qua Zalo');
  const messengerTooltip = t('contactButtons.messenger', 'Chat qua Messenger');

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3.5 items-end pointer-events-auto select-none">
      {/* Zalo Floating Button (Reduced by half: 64px) */}
      <div className="relative flex items-center group">
        {/* Tooltip Label */}
        <span
          className={`mr-3 px-3.5 py-2 rounded-lg text-xs font-semibold text-white bg-gray-900/90 backdrop-blur-md shadow-xl transition-all duration-300 pointer-events-none whitespace-nowrap border border-white/10 ${
            hovered === 'zalo'
              ? 'opacity-100 translate-x-0 scale-100'
              : 'opacity-0 translate-x-2 scale-95 md:group-hover:opacity-100 md:group-hover:translate-x-0 md:group-hover:scale-100'
          }`}
        >
          {zaloTooltip}
        </span>

        <a
          href={zaloLink}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Chat qua Zalo (0376960193)"
          onMouseEnter={() => setHovered('zalo')}
          onMouseLeave={() => setHovered(null)}
          className="relative flex items-center justify-center w-16 h-16 rounded-full bg-[#0068FF] text-white shadow-[0_8px_25px_rgba(0,104,255,0.4)] hover:shadow-[0_10px_30px_rgba(0,104,255,0.6)] hover:scale-110 active:scale-95 transition-all duration-300 group"
        >
          {/* Animated Pulse Outer Ring */}
          <span className="absolute -inset-1.5 rounded-full bg-[#0068FF]/40 animate-ping opacity-75 pointer-events-none" />

          {/* Icon (40px: w-10 h-10) */}
          <svg className="w-10 h-10 relative z-10" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="50" cy="50" r="50" fill="#0068FF" />
            <text x="50" y="60" fontSize="34" fontWeight="900" fill="#FFFFFF" textAnchor="middle" fontFamily="system-ui, -apple-system, sans-serif" letterSpacing="-1">Zalo</text>
          </svg>
        </a>
      </div>

      {/* Messenger Floating Button (Reduced by half: 64px) */}
      <div className="relative flex items-center group">
        {/* Tooltip Label */}
        <span
          className={`mr-3 px-3.5 py-2 rounded-lg text-xs font-semibold text-white bg-gray-900/90 backdrop-blur-md shadow-xl transition-all duration-300 pointer-events-none whitespace-nowrap border border-white/10 ${
            hovered === 'messenger'
              ? 'opacity-100 translate-x-0 scale-100'
              : 'opacity-0 translate-x-2 scale-95 md:group-hover:opacity-100 md:group-hover:translate-x-0 md:group-hover:scale-100'
          }`}
        >
          {messengerTooltip}
        </span>

        <a
          href={messengerLink}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Chat qua Messenger (alvin.tran.872661)"
          onMouseEnter={() => setHovered('messenger')}
          onMouseLeave={() => setHovered(null)}
          className="relative flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-[#0069FF] via-[#A033FF] to-[#FF5280] text-white shadow-[0_8px_25px_rgba(160,51,255,0.4)] hover:shadow-[0_10px_30px_rgba(160,51,255,0.6)] hover:scale-110 active:scale-95 transition-all duration-300 group"
        >
          {/* Animated Pulse Outer Ring */}
          <span className="absolute -inset-1.5 rounded-full bg-[#A033FF]/40 animate-ping opacity-75 pointer-events-none [animation-delay:0.75s]" />

          {/* Icon (40px: w-10 h-10) */}
          <svg className="w-10 h-10 relative z-10" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M50 14C30.118 14 14 28.847 14 47.168C14 57.608 19.204 66.985 27.332 73.03V86L39.467 79.336C42.784 80.258 46.297 80.759 49.904 80.759C69.786 80.759 85.904 65.912 85.904 47.591C85.904 29.27 69.786 14 49.904 14H50ZM31.332 55.842L43.539 42.913L55.388 55.842L72.275 37.887L60.068 50.816L48.219 37.887L31.332 55.842Z" fill="white" />
          </svg>
        </a>
      </div>
    </div>
  );
};

export default FloatingContactButtons;
