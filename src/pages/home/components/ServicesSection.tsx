import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

interface ServiceItem {
  id: string;
  icon: string;
  titleKey: string;
  descKey: string;
  color: string;
}

const SERVICES_ITEMS: ServiceItem[] = [
  { id: 'web', icon: 'ri-global-line', titleKey: 'services.list.web.title', descKey: 'services.list.web.desc', color: '#9B2A4C' },
  { id: 'chatbot', icon: 'ri-chat-voice-line', titleKey: 'services.list.chatbot.title', descKey: 'services.list.chatbot.desc', color: '#2C3E50' },
  { id: 'landing', icon: 'ri-layout-4-line', titleKey: 'services.list.landing.title', descKey: 'services.list.landing.desc', color: '#A8B5A0' },
  { id: 'workflow', icon: 'ri-git-merge-line', titleKey: 'services.list.workflow.title', descKey: 'services.list.workflow.desc', color: '#D97706' },
  { id: 'email', icon: 'ri-mail-send-line', titleKey: 'services.list.email.title', descKey: 'services.list.email.desc', color: '#2563EB' },
  { id: 'n8n', icon: 'ri-terminal-window-line', titleKey: 'services.list.n8n.title', descKey: 'services.list.n8n.desc', color: '#EF4444' },
  { id: 'app', icon: 'ri-smartphone-line', titleKey: 'services.list.app.title', descKey: 'services.list.app.desc', color: '#7C3AED' },
];

export default function ServicesSection() {
  const { t } = useTranslation();

  return (
    <section className="py-20 bg-[#F8F6F2] relative overflow-hidden" id="services">
      {/* Background shape */}
      <div className="absolute inset-0 opacity-[0.02]" style={{ background: 'radial-gradient(circle at 70% 30%, #9B2A4C 0%, transparent 60%)' }}></div>

      <div className="max-w-7xl mx-auto px-4 md:px-6 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#2C3E50]/20 bg-[#2C3E50]/5">
            <span className="text-[#2C3E50] text-xs font-semibold">{t('services.badge')}</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-[#1C2526] leading-tight">
            {t('services.title')} <span className="gradient-text">{t('services.titleHighlight')}</span>
          </h2>
          <p className="text-[#5A6A72] text-sm md:text-base leading-relaxed">
            From custom high-converting web applications and AI-driven support bots to complete workflow pipelines, we build custom solutions tailored directly to your business logic.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {SERVICES_ITEMS.map((svc) => (
            <div
              key={svc.id}
              className="bg-white rounded-3xl p-6 border border-[#2C3E50]/5 shadow-sm hover:shadow-xl hover:border-[#9B2A4C]/20 transition-all duration-300 flex flex-col justify-between group relative overflow-hidden"
            >
              {/* Highlight strip on hover */}
              <div
                className="absolute top-0 left-0 w-full h-1 transform -translate-y-full group-hover:translate-y-0 transition-transform duration-300"
                style={{ backgroundColor: svc.color }}
              />

              <div className="space-y-4">
                <div
                  className="w-10 h-10 rounded-2xl flex items-center justify-center text-white"
                  style={{ backgroundColor: svc.color }}
                >
                  <i className={`${svc.icon} text-lg`} />
                </div>
                <div>
                  <h3 className="font-bold text-[#1C2526] text-sm group-hover:text-[#9B2A4C] transition-colors duration-200">
                    {t(svc.titleKey)}
                  </h3>
                  <p className="text-xs text-[#5A6A72] mt-2 leading-relaxed line-clamp-3">
                    {t(svc.descKey)}
                  </p>
                </div>
              </div>

              <div className="pt-6">
                <Link
                  to={`/services/${svc.id}`}
                  className="inline-flex items-center gap-1 text-xs font-bold text-[#9B2A4C] hover:underline"
                >
                  {t('services.readMore')}
                  <i className="ri-arrow-right-line group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
