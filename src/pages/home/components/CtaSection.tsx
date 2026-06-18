import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export default function CtaSection() {
  const { t } = useTranslation();

  return (
    <section className="relative py-24 md:py-32 overflow-hidden" style={{ background: '#F8F6F2' }}>
      {/* Background accents */}
      <div className="absolute inset-0 opacity-[0.03]" style={{ background: 'radial-gradient(ellipse at 50% 50%, #2C3E50 0%, transparent 60%)' }}></div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 md:px-6 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#2C3E50]/20 bg-[#2C3E50]/5 mb-6">
          <span className="text-[#2C3E50] text-xs font-semibold">{t('cta.badge')}</span>
        </div>

        <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-[#1C2526] mb-6 leading-tight">
          {t('cta.title')}<br />
          <span className="gradient-text">{t('cta.titleHighlight')}</span>
        </h2>
        <p className="text-[#5A6A72] text-base md:text-lg mb-10 max-w-xl mx-auto leading-relaxed">
          {t('cta.description')}
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            to="/contact"
            className="gradient-bg text-white font-semibold px-8 py-4 rounded-full whitespace-nowrap hover:opacity-90 transition-opacity text-sm cursor-pointer"
          >
            {t('cta.primaryBtn')}
          </Link>
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
            className="border border-gray-200 text-[#1C2526] font-semibold px-8 py-4 rounded-full whitespace-nowrap hover:border-[#2C3E50]/30 hover:text-[#2C3E50] transition-all text-sm cursor-pointer"
          >
            {t('cta.secondaryBtn')}
          </Link>
        </div>
        <p className="text-[#8A97A0] text-xs mt-6">
          {t('cta.replyNote')}
        </p>
      </div>
    </section>
  );
}