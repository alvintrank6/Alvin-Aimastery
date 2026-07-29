import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import JoinUsSection from '@/pages/home/components/JoinUsSection';

export default function Footer() {
  const { t } = useTranslation();

  const services = [
    { name: 'Website Design', id: 'web' },
    { name: 'AI Chatbots', id: 'chatbot' },
    { name: 'Landing Pages', id: 'landing' },
    { name: 'Workflow Automations', id: 'workflow' },
    { name: 'Email Automations', id: 'email' },
    { name: 'n8n Cloud Sync', id: 'n8n' },
    { name: 'Mobile Apps', id: 'app' },
  ];

  return (
    <>
      {/* Embedded Join Us Section right above footer */}
      <JoinUsSection />

      <footer className="border-t border-gray-200 dark:border-gray-800 pt-14 pb-8 bg-white dark:bg-[#0B0F17] transition-colors">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-10 mb-12">
            {/* Left info column */}
            <div className="md:col-span-4 space-y-4">
              <span className="font-bold text-lg text-[#1C2526] dark:text-white">Alvin Tran</span>
              <p className="text-[#5A6A72] dark:text-gray-400 text-xs leading-relaxed max-w-xs">
                {t('footer.description')}
              </p>
              <div className="flex items-center gap-3 mt-4">
                <a
                  href="https://www.facebook.com/alvin.tran.872661/"
                  target="_blank"
                  rel="nofollow noopener noreferrer"
                  className="w-8 h-8 flex items-center justify-center rounded-full border border-gray-200 dark:border-gray-800 text-[#5A6A72] dark:text-gray-300 hover:text-[#9B2A4C] dark:hover:text-cyan-400 hover:border-[#9B2A4C]/30 transition-all cursor-pointer"
                  aria-label="Facebook"
                >
                  <i className="ri-facebook-fill text-sm" />
                </a>
                <a
                  href="https://www.instagram.com/alvintran_95/"
                  target="_blank"
                  rel="nofollow noopener noreferrer"
                  className="w-8 h-8 flex items-center justify-center rounded-full border border-gray-200 dark:border-gray-800 text-[#5A6A72] dark:text-gray-300 hover:text-[#9B2A4C] dark:hover:text-cyan-400 hover:border-[#9B2A4C]/30 transition-all cursor-pointer"
                  aria-label="Instagram"
                >
                  <i className="ri-instagram-line text-sm" />
                </a>
              </div>
            </div>

            {/* Center Column: navigation */}
            <div className="md:col-span-2 space-y-4">
              <h4 className="text-[#1C2526] dark:text-white text-xs font-bold uppercase tracking-wider">{t('footer.navTitle')}</h4>
              <ul className="space-y-2.5 text-xs font-semibold text-[#5A6A72] dark:text-gray-400">
                <li>
                  <Link to="/" className="hover:text-[#9B2A4C] dark:hover:text-cyan-400 transition-colors">Home</Link>
                </li>
                <li>
                  <Link to="/about" className="hover:text-[#9B2A4C] dark:hover:text-cyan-400 transition-colors">About</Link>
                </li>
                <li>
                  <Link to="/projects" className="hover:text-[#9B2A4C] dark:hover:text-cyan-400 transition-colors">Projects</Link>
                </li>
                <li>
                  <Link to="/prompts" className="hover:text-[#9B2A4C] dark:hover:text-cyan-400 transition-colors">Prompt Hub</Link>
                </li>
                <li>
                  <Link to="/contact" className="hover:text-[#9B2A4C] dark:hover:text-cyan-400 transition-colors">Contact</Link>
                </li>
              </ul>
            </div>

            {/* Center Column: Services */}
            <div className="md:col-span-3 space-y-4">
              <h4 className="text-[#1C2526] dark:text-white text-xs font-bold uppercase tracking-wider">{t('navbar.services')}</h4>
              <ul className="space-y-2.5 text-xs font-semibold text-[#5A6A72] dark:text-gray-400">
                {services.map(svc => (
                  <li key={svc.id}>
                    <Link to={`/services/${svc.id}`} className="hover:text-[#9B2A4C] dark:hover:text-cyan-400 transition-colors">
                      {t(`services.list.${svc.id}.title` as any)}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Right Column: Contact details */}
            <div className="md:col-span-3 space-y-4">
              <h4 className="text-[#1C2526] dark:text-white text-xs font-bold uppercase tracking-wider">{t('footer.contactTitle')}</h4>
              <ul className="space-y-3 text-[#5A6A72] dark:text-gray-400 text-xs font-semibold">
                <li className="flex items-center gap-2">
                  <i className="ri-phone-line text-[#9B2A4C] dark:text-cyan-400 text-sm" />
                  {t('footer.phone')}
                </li>
                <li className="flex items-center gap-2">
                  <i className="ri-map-pin-line text-[#9B2A4C] dark:text-cyan-400 text-sm" />
                  {t('footer.address')}
                </li>
                <li className="flex items-center gap-2">
                  <i className="ri-mail-line text-[#9B2A4C] dark:text-cyan-400 text-sm" />
                  {t('footer.email')}
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-100 dark:border-gray-800 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-[#8A97A0] dark:text-gray-500 text-[10px] font-bold uppercase tracking-wider">{t('footer.copyright')}</p>
            <p className="text-[#8A97A0] dark:text-gray-500 text-[10px] font-bold uppercase tracking-wider">{t('footer.designedBy')}</p>
          </div>
        </div>
      </footer>
    </>
  );
}