import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

interface PerkItem {
  title: string;
  desc: string;
  icon: string;
}

interface PositionItem {
  title: string;
  type: string;
  rate: string;
  skills: string[];
}

export default function CareersSection() {
  const { t } = useTranslation();

  const perks = t('careers.perks', { returnObjects: true }) as PerkItem[];
  const positions = t('careers.positions', { returnObjects: true }) as PositionItem[];

  return (
    <section id="careers" className="py-24 md:py-32 text-white relative overflow-hidden" style={{ background: '#1C2526' }}>
      {/* Dynamic Glowing Background Accents */}
      <div className="absolute inset-0 opacity-15" style={{
        background: 'radial-gradient(circle at 20% 35%, #9B2A4C 0%, transparent 40%), radial-gradient(circle at 80% 75%, #2C3E50 0%, transparent 40%)'
      }}></div>
      
      {/* Decorative Grid Lines Overlay */}
      <div className="absolute inset-0 opacity-[0.02]" style={{
        backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.1) 1px, transparent 1px)',
        backgroundSize: '40px 40px'
      }}></div>

      <div className="max-w-7xl mx-auto px-4 md:px-6 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-20 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/20 bg-white/5 backdrop-blur-md">
            <span className="w-1.5 h-1.5 rounded-full bg-[#9B2A4C] animate-pulse"></span>
            <span className="text-white/80 text-xs font-semibold uppercase tracking-wider">{t('careers.badge')}</span>
          </div>
          
          <h2 className="text-4xl md:text-5xl font-black leading-tight tracking-tight">
            {t('careers.title')} <br className="sm:hidden" />
            <span className="gradient-text">{t('careers.titleHighlight')}</span>
          </h2>
          
          <p className="text-gray-400 text-sm md:text-base leading-relaxed max-w-2xl mx-auto">
            {t('careers.subtitle')}
          </p>
        </div>

        {/* Benefits / Perks Grid */}
        <div className="mb-20">
          <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest text-center mb-10">
            {t('careers.perksTitle')}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {Array.isArray(perks) && perks.map((perk, index) => (
              <div
                key={index}
                className="bg-white/[0.02] border border-white/5 hover:border-[#9B2A4C]/30 hover:bg-white/[0.04] rounded-3xl p-6 transition-all duration-300 group shadow-lg relative overflow-hidden"
              >
                {/* Visual hover effect border bottom */}
                <div className="absolute bottom-0 left-0 w-0 h-1 bg-[#9B2A4C] group-hover:w-full transition-all duration-500" />
                
                <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-xl text-[#e9809c] mb-6 group-hover:scale-110 group-hover:bg-[#9B2A4C]/10 transition-all duration-300">
                  <i className={perk.icon} />
                </div>
                
                <h4 className="font-extrabold text-white text-base mb-2 group-hover:text-[#e9809c] transition-colors duration-200">
                  {perk.title}
                </h4>
                
                <p className="text-gray-400 text-xs leading-relaxed">
                  {perk.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Open Job Positions (Recruitment) */}
        <div>
          <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest text-center mb-10">
            {t('careers.positionsTitle')}
          </h3>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {Array.isArray(positions) && positions.map((pos, index) => (
              <div
                key={index}
                className="bg-white/[0.02] border border-white/5 hover:border-[#9B2A4C]/20 rounded-3xl p-6 transition-all duration-300 flex flex-col justify-between hover:shadow-2xl shadow-md group relative"
              >
                <div className="space-y-4">
                  {/* Title & Badge */}
                  <div className="space-y-2">
                    <span className="inline-block text-[9px] uppercase font-extrabold text-[#e9809c] bg-[#9B2A4C]/15 border border-[#9B2A4C]/25 px-2.5 py-0.5 rounded-md">
                      {pos.type}
                    </span>
                    <h4 className="font-extrabold text-white text-md leading-snug group-hover:text-[#e9809c] transition-colors">
                      {pos.title}
                    </h4>
                  </div>

                  {/* Rate details */}
                  <div className="flex items-center gap-2 text-xs text-gray-400 font-semibold">
                    <i className="ri-money-dollar-circle-line text-sm text-[#e9809c]" />
                    <span>{pos.rate}</span>
                  </div>

                  {/* Skills tags */}
                  <div className="flex flex-wrap gap-1.5 pt-2">
                    {pos.skills.map((skill, sIdx) => (
                      <span
                        key={sIdx}
                        className="bg-white/5 border border-white/10 text-gray-300 text-[9px] font-bold px-2 py-1 rounded-lg hover:bg-white/10 transition-colors cursor-default"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="h-px bg-white/5 my-6" />

                <div>
                  <Link
                    to="/developer/register"
                    className="w-full py-3 bg-white/5 border border-white/10 text-white rounded-xl text-xs font-bold text-center block hover:border-[#9B2A4C]/40 hover:bg-[#9B2A4C]/5 transition-all group-hover:scale-[1.02] cursor-pointer"
                  >
                    {t('developer.submitBtn')}
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Global Careers CTA Buttons */}
        <div className="flex flex-col items-center justify-center mt-16 pt-10 border-t border-white/5">
          <Link
            to="/developer/register"
            className="gradient-bg text-white font-bold px-8 py-4 rounded-full whitespace-nowrap hover:opacity-90 hover:shadow-[0_4px_25px_rgba(155,42,76,0.3)] hover:scale-[1.02] transition-all text-xs cursor-pointer text-center w-full sm:w-auto"
          >
            <i className="ri-team-line mr-2" />
            {t('careers.exploreBtn')}
          </Link>
        </div>

      </div>
    </section>
  );
}
