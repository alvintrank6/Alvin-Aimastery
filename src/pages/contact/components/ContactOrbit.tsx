import { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';

interface Channel {
  id: string;
  label: string;
  value: string;
  href: string;
  icon: string;
}

const renderLogoSvg = (id: string, className: string = "w-full h-full") => {
  switch (id) {
    case 'facebook':
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="12" cy="12" r="12" fill="#1877F2"/>
          <path d="M14.5 12h-2.5v7h-3v-7h-1.5v-2.5h1.5v-1.8c0-2.5 1.5-3.8 3.7-3.8 1.1 0 2 .1 2.3.1v2.7h-1.6c-1.2 0-1.5.6-1.5 1.4v1.4h3l-.4 2.5z" fill="white"/>
        </svg>
      );
    case 'telegram':
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="12" cy="12" r="12" fill="#26A5E4"/>
          <path d="M5.5 11.5L19 6.3c.6-.2 1.2.2 1 .8l-2.3 10.7c-.2.7-.6.8-1.2.5l-3.5-2.6-1.7 1.6c-.2.2-.4.3-.6.3l.3-3.6 6.5-5.9c.3-.3-.1-.4-.4-.2L9.1 13.5 5.6 12.4c-.8-.2-.8-.8.1-1.1z" fill="white"/>
        </svg>
      );
    case 'zalo':
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="24" height="24" rx="5" fill="#0068FF"/>
          <path d="M12 5.5c-3.9 0-7 2.7-7 6 0 1.8 1.1 3.4 2.8 4.5-.2.6-.7 1.8-.8 2.2 0 0-.1.2 0 .2.1.1.2 0 .2 0l2.7-1.3c.7.2 1.4.3 2.1.3 3.9 0 7-2.7 7-6s-3.1-6-7-6z" fill="white"/>
          <text x="12" y="13.2" fontSize="4.5" fontWeight="900" fill="#0068FF" textAnchor="middle" fontFamily="system-ui, -apple-system, sans-serif" letterSpacing="-0.2">Zalo</text>
        </svg>
      );
    case 'email':
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="12" cy="12" r="12" fill="#ffffff" stroke="#e6e6e6" strokeWidth="0.5"/>
          <path d="M6 16.5V9c0-.6.4-1 1-1h2v5.5l3 2.2 3-2.2V8h2c.6 0 1 .4 1 1v7.5h-2.5v-5.5l-3.5 2.6-3.5-2.6v5.5H6z" fill="#DB4437"/>
        </svg>
      );
    case 'github':
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="12" cy="12" r="12" fill="#24292E"/>
          <path fillRule="evenodd" clipRule="evenodd" d="M12 5C8.1 5 5 8.1 5 12c0 3.1 2 5.8 4.8 6.7.3.1.5-.1.5-.3v-1.1c-1.9.4-2.4-.9-2.4-.9-.3-.8-.8-1-.8-1-.6-.4.1-.4.1-.4.7.1 1.1.7 1.1.7.6 1.1 1.6.8 2 .6.1-.5.3-.8.5-.9-1.5-.2-3.2-.8-3.2-3.4 0-.7.3-1.4.7-1.9-.1-.2-.3-.9.1-1.9 0 0 .6-.2 1.9.7a6.8 6.8 0 013.6 0c1.3-.9 1.9-.7 1.9-.7.4 1 .2 1.7.1 1.9.4.5.7 1.2.7 1.9 0 2.6-1.7 3.2-3.3 3.4.2.2.5.7.5 1.5v2.2c0 .2.2.4.5.3A7 7 0 0019 12c0-3.9-3.1-7-7-7z" fill="white"/>
        </svg>
      );
    case 'phone':
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="12" cy="12" r="12" fill="#4CAF50"/>
          <path d="M8.2 8.2c-.4.4-.5.9-.2 1.4.7 1.7 2.1 3.1 3.8 3.8.5.3 1 .2 1.4-.2l.9-.9c.3-.3.9-.3 1.2 0l1.9 1.9c.3.3.3.9 0 1.2l-.9.9c-.8.8-2 1-3 .5C10 15.6 7.4 13 6.2 9.7c-.5-1-.3-2.2.5-3l.9-.9c.3-.3.9-.3 1.2 0l1.9 1.9c.3.3.3.9 0 1.2l-.9.9z" fill="white"/>
        </svg>
      );
    default:
      return null;
  }
};

export default function ContactOrbit() {
  const { t } = useTranslation();
  const [activeIdx, setActiveIdx] = useState(0);
  const [rotationAngle, setRotationAngle] = useState(270); // Starts with GitHub (idx 0) at top
  const [isHovered, setIsHovered] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Unified brand colors from site design tokens:
  // Plum / Crimson: #9B2A4C
  // Navy / Charcoal: #2C3E50 & #1C2526
  // Beige Body Background: #F8F6F2
  const brandActiveColor = '#9B2A4C';
  const brandActiveGlow = 'rgba(155, 42, 76, 0.15)';

  const channels: Channel[] = [
    {
      id: 'github',
      label: 'GITHUB',
      value: 'alvintran95',
      href: 'https://github.com/alvintran95',
      icon: 'ri-github-fill'
    },
    {
      id: 'email',
      label: 'GMAIL',
      value: 'alvintrank95@example.com',
      href: 'mailto:alvintrank95@example.com',
      icon: 'ri-mail-fill'
    },
    {
      id: 'zalo',
      label: 'ZALO',
      value: '0376 960 193',
      href: 'https://zalo.me/0376960193',
      icon: 'ri-chat-3-fill'
    },
    {
      id: 'phone',
      label: 'PHONE',
      value: '+84 376 960 193',
      href: 'tel:+84376960193',
      icon: 'ri-phone-fill'
    },
    {
      id: 'facebook',
      label: 'FACEBOOK',
      value: 'Alvin Tran',
      href: 'https://www.facebook.com/alvin.tran.872661/',
      icon: 'ri-facebook-fill'
    },
    {
      id: 'telegram',
      label: 'TELEGRAM',
      value: '@alvintran95',
      href: 'https://t.me/alvintran95',
      icon: 'ri-telegram-fill'
    }
  ];

  const N = channels.length;

  const handleSelectChannel = (idx: number) => {
    setActiveIdx(idx);
    setRotationAngle(270 - idx * (360 / N));
  };

  // Auto rotation logic
  useEffect(() => {
    if (isHovered) {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      return;
    }

    timerRef.current = setInterval(() => {
      setActiveIdx((prev) => {
        const nextIdx = (prev + 1) % N;
        setRotationAngle(270 - nextIdx * (360 / N));
        return nextIdx;
      });
    }, 2000);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isHovered, N]);

  const activeChannel = channels[activeIdx];

  const radius = isMobile ? 120 : 170;
  const stageSize = isMobile ? 'w-[300px] h-[300px]' : 'w-[420px] h-[420px]';
  const trackSize = isMobile ? 'w-[240px] h-[240px]' : 'w-[340px] h-[340px]';
  const centerSize = isMobile ? 'w-[160px] h-[160px]' : 'w-[220px] h-[220px]';
  const centerCircleSize = isMobile ? 'w-20 h-20' : 'w-24 h-24';
  const activeLabelText = isMobile ? 'text-[10px]' : 'text-xs';
  const activeValueText = isMobile ? 'text-sm max-w-[150px]' : 'text-base max-w-[210px]';
  const buttonSize = isMobile ? 'w-11 h-11' : 'w-14 h-14';

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="relative flex flex-col items-center justify-center min-h-[320px] md:min-h-[440px] w-full transition-all duration-300"
    >
      {/* Subtle brand plum radial glow */}
      <div
        className="absolute inset-0 opacity-40 pointer-events-none transition-all duration-700"
        style={{
          background: `radial-gradient(circle at 50% 50%, ${brandActiveColor}0a 0%, transparent 65%)`
        }}
      />

      {/* Orbit Stage */}
      <div className={`relative flex items-center justify-center transition-all duration-500 ${stageSize}`}>
        {/* Dashed track in navy tone */}
        <div className={`absolute border border-dashed border-[#2C3E50]/15 rounded-full pointer-events-none transition-all duration-500 ${trackSize}`} />

        {/* Center Node Column */}
        <div className={`absolute z-10 flex flex-col items-center text-center justify-center transition-all duration-500 ${centerSize}`}>
          {/* Logo Circle with brand colors */}
          <a
            href={activeChannel.href}
            target="_blank"
            rel="noopener noreferrer"
            className={`rounded-full flex items-center justify-center border transition-all duration-500 cursor-pointer shadow-sm hover:scale-105 ${centerCircleSize}`}
            style={{
              backgroundColor: '#ffffff',
              borderColor: brandActiveColor,
              boxShadow: `0 0 20px ${brandActiveGlow}`
            }}
          >
            <i
              className={`${activeChannel.icon} transition-all duration-500 ${isMobile ? 'text-4xl' : 'text-5xl'}`}
              style={{ color: brandActiveColor }}
            />
          </a>

          {/* Platform Label */}
          <span
            className={`font-black uppercase tracking-widest mt-4 transition-all duration-500 ${activeLabelText}`}
            style={{ color: brandActiveColor }}
          >
            {activeChannel.label}
          </span>

          {/* Username / Phone link */}
          <a
            href={activeChannel.href}
            target="_blank"
            rel="noopener noreferrer"
            className={`font-bold text-[#1C2526] hover:text-[#9B2A4C] hover:underline transition-all mt-1 line-clamp-1 ${activeValueText}`}
            title={activeChannel.value}
          >
            {activeChannel.value}
          </a>

          {/* Hint */}
          <span className="text-[9px] text-[#8A97A0] mt-2 font-medium tracking-wide">
            {t('contact.orbitHint')}
          </span>
        </div>

        {/* Orbiting Platform Icons */}
        {channels.map((chan, idx) => {
          const isActive = idx === activeIdx;
          const angle = idx * (360 / N) + rotationAngle;
          const x = Math.cos((angle * Math.PI) / 180) * radius;
          const y = Math.sin((angle * Math.PI) / 180) * radius;

          return (
            <button
              key={chan.id}
              onClick={() => handleSelectChannel(idx)}
              className={`absolute rounded-full flex items-center justify-center border transition-all duration-700 cursor-pointer shadow-sm z-20 p-[3px] hover:scale-[1.08] group ${buttonSize}`}
              style={{
                transform: `translate(${x}px, ${y}px) scale(${isActive ? 1.15 : 1})`,
                backgroundColor: 'transparent',
                borderColor: isActive ? brandActiveColor : 'rgba(0, 0, 0, 0.05)',
                boxShadow: isActive ? `0 0 12px ${brandActiveGlow}` : 'none',
                opacity: isActive ? 1 : 0.75,
              }}
              onMouseEnter={(e) => {
                if (!isActive) {
                  e.currentTarget.style.opacity = '1';
                  e.currentTarget.style.borderColor = 'rgba(155, 42, 76, 0.2)';
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  e.currentTarget.style.opacity = '0.75';
                  e.currentTarget.style.borderColor = 'rgba(0, 0, 0, 0.05)';
                }
              }}
            >
              {renderLogoSvg(chan.id, "w-full h-full transition-transform duration-300 group-hover:scale-105")}
            </button>
          );
        })}
      </div>
    </div>
  );
}
