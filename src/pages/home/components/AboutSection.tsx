import { useTranslation } from 'react-i18next';
import ContactOrbit from '@/pages/contact/components/ContactOrbit';

export default function AboutSection() {
  const { t } = useTranslation();

  return (
    <section id="about" className="py-20 md:py-28" style={{ background: '#ffffff' }}>
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <div className="max-w-3xl mx-auto text-center mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#2C3E50]/20 bg-[#2C3E50]/5 mb-5">
            <span className="text-[#2C3E50] text-xs font-semibold">{t('about.badge')}</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-[#1C2526] mb-4">
            {t('about.title')} <span className="gradient-text">{t('about.titleHighlight')}</span>
          </h2>
        </div>

        {/* Bio next to interactive Orbit contact panel */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center mb-16">
          {/* Left — Bio (7 cols) */}
          <div className="lg:col-span-7 space-y-5">
            <p className="text-[#5A6A72] text-base leading-relaxed">
              {t('about.bio1')}
            </p>
            <p className="text-[#5A6A72] text-base leading-relaxed">
              {t('about.bio2')}
            </p>
            <p className="text-[#5A6A72] text-base leading-relaxed">
              {t('about.bio3')}
            </p>

            <div className="flex flex-wrap gap-2 pt-2">
              {(t('about.skills', { returnObjects: true }) as string[]).map((skill: string) => (
                <span key={skill} className="text-xs px-3 py-1.5 rounded-full border border-gray-200 text-[#5A6A72] bg-gray-50 hover:border-[#2C3E50]/30 hover:text-[#2C3E50] transition-colors cursor-default">
                  {skill}
                </span>
              ))}
            </div>
          </div>

          {/* Right — Orbit (5 cols) */}
          <div className="lg:col-span-5 flex justify-center">
            <ContactOrbit />
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 pt-10 border-t border-gray-100">
          {(t('about.stats', { returnObjects: true }) as Array<{ value: string; label: string; desc: string }>).map((stat) => (
            <div key={stat.label} className="card-light card-light-hover rounded-xl p-5 transition-all duration-300">
              <p className="text-2xl font-black gradient-text">{stat.value}</p>
              <p className="text-[#1C2526] text-sm font-semibold mt-1">{stat.label}</p>
              <p className="text-[#8A97A0] text-xs mt-0.5">{stat.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}