import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export default function HeroSection() {
  const { t } = useTranslation();

  return (
    <section className="relative w-full" style={{ background: '#F8F6F2' }}>
      {/* Subtle gradient background */}
      <div className="absolute inset-0 opacity-[0.4]" style={{ background: 'radial-gradient(ellipse at 70% 20%, rgba(44,62,80,0.06) 0%, transparent 50%)' }}></div>
      <div className="absolute inset-0 opacity-[0.3]" style={{ background: 'radial-gradient(ellipse at 20% 80%, rgba(168,181,160,0.05) 0%, transparent 50%)' }}></div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-8 pt-20 md:pt-24 pb-12 md:pb-16 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Left — Text content */}
          <div>
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#2C3E50]/20 bg-[#2C3E50]/5 mb-4">
              <span className="text-[#2C3E50] text-xs font-semibold tracking-wide">{t('hero.badge')}</span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black leading-tight mb-3 text-[#1C2526]">
              {t('hero.name')} <span className="gradient-text">{t('hero.surname')}</span>
            </h1>

            <p className="text-[#5A6A72] text-base md:text-lg font-medium mb-4">
              {t('hero.role')}
            </p>

            <p className="text-[#5A6A72] text-sm md:text-base leading-relaxed max-w-lg mb-6">
              {t('hero.bio')}
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
              <Link
                to="/"
                state={{ scrollTo: 'projects' }}
                onClick={(e) => {
                  const el = document.getElementById('projects');
                  if (el) {
                    e.preventDefault();
                    el.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
                className="gradient-bg text-white font-semibold px-7 py-3 rounded-full whitespace-nowrap hover:opacity-90 transition-all text-sm cursor-pointer"
              >
                {t('hero.ctaPrimary')}
              </Link>
              <Link
                to="/contact"
                className="border border-gray-200 text-[#1C2526] font-semibold px-7 py-3 rounded-full whitespace-nowrap hover:border-[#2C3E50]/30 hover:text-[#2C3E50] transition-all text-sm cursor-pointer"
              >
                {t('hero.ctaSecondary')}
              </Link>
            </div>
          </div>

          {/* Right — Portrait */}
          <div className="relative flex justify-center lg:justify-end">
            <div className="relative">
              {/* Decorative circle behind */}
              <div className="absolute -inset-4 rounded-full opacity-10" style={{ background: 'linear-gradient(135deg, #2C3E50, #A8B5A0)' }}></div>
              <div className="relative w-64 h-64 md:w-72 md:h-72 lg:w-80 lg:h-80 rounded-2xl overflow-hidden card-light border border-gray-100 shadow-sm">
                <img
                  src="https://static.readdy.ai/image/f4782dda055a3841fcfd0612adf32078/077c27292c8b798fc81c07d472b5546d.jpeg"
                  alt="Alvin Tran - Marketer and AI Automation Specialist"
                  className="w-full h-full object-cover object-top"
                />
              </div>

              {/* Floating badge */}
              <div className="absolute -bottom-4 -left-4 card-light rounded-xl px-4 py-3 shadow-sm border border-gray-100">
                <p className="text-[#1C2526] text-xs font-semibold">{t('hero.locationLabel')}</p>
                <p className="text-[#5A6A72] text-xs">{t('hero.locationValue')}</p>
              </div>

              {/* Floating badge 2 */}
              <div className="absolute -top-3 -right-3 card-light rounded-xl px-4 py-2 shadow-sm border border-gray-100">
                <p className="text-[#2C3E50] text-xs font-bold">{t('hero.openToWork')}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="relative z-10 flex flex-col items-center gap-1 pb-6">
        <div className="w-px h-6 bg-gradient-to-b from-transparent to-gray-300"></div>
        <i className="ri-arrow-down-line text-gray-400 text-sm"></i>
      </div>
    </section>
  );
}