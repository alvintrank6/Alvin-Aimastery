import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Navbar from '@/components/feature/Navbar';
import Footer from '@/components/feature/Footer';

export default function RegisterSelection() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [hoveredIndex, setHoveredIndex] = useState<string | null>(null);

  const options = [
    {
      id: 'client',
      title: t('auth.clientBooking'),
      desc: t('auth.clientBookingDesc'),
      icon: 'ri-calendar-todo-line',
      path: '/contact', // Customers go to booking form/contact
      color: '#9B2A4C',
      bgHover: 'rgba(155, 42, 76, 0.05)',
      borderColor: 'rgba(155, 42, 76, 0.15)'
    },
    {
      id: 'freelancer',
      title: t('auth.partnerReg'),
      desc: t('auth.partnerRegDesc'),
      icon: 'ri-team-line',
      path: '/developer/register', // Freelancers go to outsource register
      color: '#2C3E50',
      bgHover: 'rgba(44, 62, 80, 0.05)',
      borderColor: 'rgba(44, 62, 80, 0.15)'
    }
  ];

  return (
    <div className="min-h-screen flex flex-col justify-between" style={{ background: '#F8F6F2' }}>
      <Navbar />

      <main className="pt-24 pb-16 flex-grow flex items-center justify-center px-4">
        <div className="max-w-xl w-full bg-white rounded-3xl p-6 md:p-8 border border-gray-100 shadow-xl relative overflow-hidden">
          {/* Top colored accent line */}
          <div className="absolute top-0 left-0 right-0 h-1.5 gradient-bg" />

          {/* Heading */}
          <div className="text-center space-y-2 mb-8">
            <h1 className="text-2xl md:text-3xl font-black text-[#1C2526]">{t('auth.registerTitle')}</h1>
            <p className="text-xs md:text-sm text-[#5A6A72] max-w-sm mx-auto">{t('auth.registerSubtitle')}</p>
          </div>

          {/* Registration options */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
            {options.map((opt) => {
              const isHovered = hoveredIndex === opt.id;
              return (
                <button
                  key={opt.id}
                  onClick={() => navigate(opt.path)}
                  onMouseEnter={() => setHoveredIndex(opt.id)}
                  onMouseLeave={() => setHoveredIndex(null)}
                  className="p-6 rounded-2xl border text-left flex flex-col justify-between h-48 transition-all hover:scale-[1.02] cursor-pointer group hover:shadow-md"
                  style={{
                    borderColor: isHovered ? opt.color : opt.borderColor,
                    backgroundColor: isHovered ? opt.bgHover : '#ffffff',
                  }}
                >
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center text-lg font-bold transition-all"
                    style={{
                      backgroundColor: `${opt.color}15`,
                      color: opt.color,
                    }}
                  >
                    <i className={opt.icon} />
                  </div>
                  <div className="space-y-1 mt-4">
                    <h3
                      className="text-sm font-bold text-[#1C2526] transition-colors"
                      style={{ color: isHovered ? opt.color : '#1C2526' }}
                    >
                      {opt.title}
                    </h3>
                    <p className="text-[10px] text-[#8A97A0] leading-relaxed">
                      {opt.desc}
                    </p>
                  </div>
                  <div className="w-full flex justify-end pt-2 text-[10px] font-bold text-[#8A97A0] group-hover:text-[#1C2526] transition-colors">
                    <i className="ri-arrow-right-line text-sm" style={{ color: opt.color }} />
                  </div>
                </button>
              );
            })}
          </div>

          <div className="h-px bg-gray-100 mb-6" />

          {/* Footer prompt */}
          <div className="text-center text-xs text-[#5A6A72]">
            <span>{t('admin.currentRole').split(' ')[0]} </span>
            <button
              onClick={() => navigate('/login')}
              className="text-[#9B2A4C] hover:underline font-bold cursor-pointer"
            >
              {t('portals.signIn')}
            </button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
