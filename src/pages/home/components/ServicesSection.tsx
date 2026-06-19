import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ServiceShowcaseDispatcher, SERVICES_DATA } from '@/pages/services/ServicePage';

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
  const { t, i18n } = useTranslation();
  const [activeTab, setActiveTab] = useState<string>('web');

  const activeSvcInfo = SERVICES_ITEMS.find((s) => s.id === activeTab)!;
  const activeSvcData = SERVICES_DATA[activeTab];

  return (
    <section className="py-20 bg-[#F8F6F2] relative overflow-hidden" id="services">
      {/* Background shape */}
      <div className="absolute inset-0 opacity-[0.02]" style={{ background: 'radial-gradient(circle at 70% 30%, #9B2A4C 0%, transparent 60%)' }}></div>

      <div className="max-w-7xl mx-auto px-4 md:px-6 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#2C3E50]/20 bg-[#2C3E50]/5">
            <span className="text-[#2C3E50] text-xs font-semibold">{t('services.badge')}</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-[#1C2526] leading-tight">
            {t('services.title')} <span className="gradient-text">{t('services.titleHighlight')}</span>
          </h2>
          <p className="text-[#5A6A72] text-sm md:text-base leading-relaxed">
            {t('services.subtitle')}
          </p>
        </div>

        {/* Interactive Console Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Side: Services Tab Bar */}
          <div className="lg:col-span-4 flex flex-row lg:flex-col gap-2 overflow-x-auto lg:overflow-x-visible pb-4 lg:pb-0 scrollbar-none shrink-0 w-full">
            {SERVICES_ITEMS.map((svc) => {
              const isActive = svc.id === activeTab;
              return (
                <button
                  key={svc.id}
                  onClick={() => setActiveTab(svc.id)}
                  className={`w-auto lg:w-full flex items-center gap-3 px-5 py-4 rounded-2xl text-left font-bold text-xs whitespace-nowrap transition-all duration-300 border cursor-pointer select-none shrink-0 ${
                    isActive
                      ? 'bg-white text-[#1C2526] border-gray-200 shadow-md translate-x-1'
                      : 'bg-white/40 text-[#5A6A72] border-transparent hover:bg-white/80 hover:text-[#1C2526]'
                  }`}
                  style={{
                    borderLeft: isActive ? `4px solid ${svc.color}` : undefined
                  }}
                >
                  <div
                    className="w-8 h-8 rounded-xl flex items-center justify-center text-white text-md transition-transform duration-300"
                    style={{
                      backgroundColor: svc.color,
                      transform: isActive ? 'scale(1.05)' : 'scale(1)'
                    }}
                  >
                    <i className={svc.icon} />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs font-extrabold tracking-tight">{t(svc.titleKey)}</span>
                    <span className="text-[9px] text-gray-400 font-medium hidden lg:inline-block mt-0.5 max-w-[200px] truncate">
                      {t(svc.descKey)}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Right Side: Interactive split details and visual simulator */}
          <div className="lg:col-span-8 bg-white border border-gray-100 rounded-3xl p-6 md:p-8 shadow-xl relative overflow-hidden transition-all duration-300">
            {/* Top accent line matching the service theme color */}
            <div
              className="absolute top-0 left-0 right-0 h-1.5 transition-all duration-300"
              style={{ backgroundColor: activeSvcInfo.color }}
            />

            <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
              
              {/* Service Info / Specs (5 columns) */}
              <div className="xl:col-span-5 space-y-6">
                <div className="space-y-3">
                  <div
                    className="w-10 h-10 rounded-2xl flex items-center justify-center text-white"
                    style={{ backgroundColor: activeSvcInfo.color }}
                  >
                    <i className={`${activeSvcInfo.icon} text-lg`} />
                  </div>
                  <h3 className="text-xl font-bold text-[#1C2526] tracking-tight">{t(activeSvcInfo.titleKey)}</h3>
                  <p className="text-xs text-[#5A6A72] leading-relaxed">{t(activeSvcInfo.descKey)}</p>
                </div>

                <div className="h-px bg-gray-100" />

                {/* Tech Stack List */}
                {activeSvcData && (
                  <div className="space-y-2">
                    <h4 className="text-[10px] font-bold text-[#8A97A0] uppercase tracking-wider">
                      {t('services.techStack')}
                    </h4>
                    <div className="flex flex-wrap gap-1.5">
                      {activeSvcData.stack.map((item) => (
                        <span
                          key={item}
                          className="text-[10px] font-bold px-2 py-1 rounded-lg bg-[#F8F6F2]/70 text-[#2C3E50] border border-gray-100"
                        >
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Service core benefits */}
                {activeSvcData && (
                  <div className="space-y-3">
                    <h4 className="text-[10px] font-bold text-[#8A97A0] uppercase tracking-wider">
                      {t('services.whyUs')}
                    </h4>
                    <ul className="space-y-2.5">
                      {activeSvcData.whyUs.map((benefit, bIdx) => (
                        <li key={bIdx} className="flex items-start gap-2 text-[11px] text-[#5A6A72] leading-normal font-semibold">
                          <i className="ri-checkbox-circle-line text-xs shrink-0 mt-0.5" style={{ color: activeSvcInfo.color }} />
                          <span>{benefit}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-3 pt-4">
                  <Link
                    to={`/services/${activeTab}`}
                    className="text-center text-xs font-bold text-white px-5 py-3 rounded-xl hover:opacity-95 transition-all cursor-pointer shadow-sm flex-1"
                    style={{ background: activeSvcInfo.color }}
                  >
                    {t('services.bookService')}
                  </Link>
                  <Link
                    to={`/services/${activeTab}`}
                    className="text-center text-xs font-bold text-[#2C3E50] border border-gray-200 hover:border-gray-300 px-5 py-3 rounded-xl transition-all cursor-pointer bg-white"
                  >
                    {t('services.readMore')}
                  </Link>
                </div>
              </div>

              {/* Visual Live Simulator Frame (7 columns) */}
              <div className="xl:col-span-7 space-y-3">
                
                {/* Browser Mock Container */}
                <div className="bg-[#FAF9F6] border border-gray-100 rounded-2xl shadow-inner overflow-hidden flex flex-col p-1.5 min-h-[360px] relative">
                  
                  {/* macOS header dots */}
                  <div className="flex items-center gap-1.5 px-3 py-1.5 bg-[#F1EFEA] border-b border-gray-100/60 rounded-t-xl shrink-0">
                    <span className="w-2.5 h-2.5 rounded-full bg-red-400"></span>
                    <span className="w-2.5 h-2.5 rounded-full bg-yellow-400"></span>
                    <span className="w-2.5 h-2.5 rounded-full bg-green-400"></span>
                    <span className="text-[9px] text-[#8A97A0] font-bold uppercase tracking-wider ml-auto font-mono">
                      LIVE_SIMULATOR://{activeTab.toUpperCase()}_TEST
                    </span>
                  </div>

                  {/* Simulator Screen */}
                  <div className="p-3 bg-white rounded-b-xl flex-grow overflow-y-auto min-h-[300px]">
                    <ServiceShowcaseDispatcher serviceId={activeTab} />
                  </div>
                </div>

              </div>

            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
