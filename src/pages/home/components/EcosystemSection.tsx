import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export default function EcosystemSection() {
  const { t, i18n } = useTranslation();

  return (
    <section className="py-20 bg-[#F8F6F2] dark:!bg-[#0B0F17] relative overflow-hidden transition-colors border-b border-gray-200/50 dark:border-gray-800">
      {/* Visual background accents */}
      <div className="absolute inset-0 opacity-[0.03]" style={{ background: 'radial-gradient(circle at 10% 20%, #9B2A4C 0%, transparent 40%), radial-gradient(circle at 90% 80%, #6B1D35 0%, transparent 40%)' }}></div>
      
      <div className="max-w-7xl mx-auto px-4 md:px-6 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#9B2A4C]/20 bg-[#9B2A4C]/5 dark:border-rose-400/30 dark:bg-rose-400/10">
            <span className="text-[#9B2A4C] dark:text-rose-400 text-xs font-semibold">{t('ecosystem.badge')}</span>
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-[#1C2526] dark:text-white leading-tight">
            {t('ecosystem.title')} <span className="gradient-text">{t('ecosystem.titleHighlight')}</span>
          </h2>
          <p className="text-[#5A6A72] dark:text-gray-300 text-sm md:text-base leading-relaxed">
            {t('ecosystem.subtitle')}
          </p>
        </div>

        {/* Client & Developer Track Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          
          {/* Client Path Card */}
          <div className="bg-white dark:!bg-[#121722] rounded-3xl p-8 border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between group">
            <div className="space-y-6">
              {/* Header inside Card */}
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-white" style={{ background: '#9B2A4C' }}>
                  <i className="ri-user-shared-line text-xl" />
                </div>
                <div>
                  <span className="text-[10px] font-bold text-[#9B2A4C] dark:text-rose-400 uppercase tracking-wider">
                    {i18n.language === 'vi' ? 'Dành Cho Khách Hàng' : 'For Clients'}
                  </span>
                  <h3 className="text-lg md:text-xl font-bold text-[#1C2526] dark:text-white">{t('ecosystem.client.title')}</h3>
                </div>
              </div>

              <p className="text-xs text-[#5A6A72] dark:text-gray-300 leading-relaxed">
                {t('ecosystem.client.desc')}
              </p>

              {/* Steps */}
              <div className="space-y-3.5 pt-2">
                <h4 className="text-xs font-bold text-[#1C2526] dark:text-white uppercase tracking-wide">
                  {t('ecosystem.client.stepTitle')}
                </h4>
                <ul className="space-y-3">
                  <li className="flex items-start gap-2 text-xs text-[#5A6A72] dark:text-gray-300">
                    <span className="w-5 h-5 rounded-full bg-[#9B2A4C]/10 text-[#9B2A4C] flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">1</span>
                    <span>{t('ecosystem.client.step1')}</span>
                  </li>
                  <li className="flex items-start gap-2 text-xs text-[#5A6A72] dark:text-gray-300">
                    <span className="w-5 h-5 rounded-full bg-[#9B2A4C]/10 text-[#9B2A4C] flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">2</span>
                    <span>{t('ecosystem.client.step2')}</span>
                  </li>
                  <li className="flex items-start gap-2 text-xs text-[#5A6A72] dark:text-gray-300">
                    <span className="w-5 h-5 rounded-full bg-[#9B2A4C]/10 text-[#9B2A4C] flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">3</span>
                    <span>{t('ecosystem.client.step3')}</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="pt-8">
              <Link
                to="/contact"
                className="inline-flex items-center justify-center gap-2 w-full sm:w-auto text-xs font-bold text-white px-6 py-3 rounded-full hover:opacity-95 transition-opacity gradient-bg cursor-pointer text-center"
              >
                {t('ecosystem.client.cta')}
                <i className="ri-arrow-right-line" />
              </Link>
            </div>
          </div>

          {/* Partner & Solution Path Card */}
          <div className="bg-white dark:!bg-[#121722] rounded-3xl p-8 border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between group">
            <div className="space-y-6">
              {/* Header inside Card */}
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-white" style={{ background: '#6B1D35' }}>
                  <i className="ri-shake-hands-line text-xl" />
                </div>
                <div>
                  <span className="text-[10px] font-bold text-[#6B1D35] uppercase tracking-wider">
                    {i18n.language === 'vi' ? 'Dành Cho Doanh Nghiệp' : 'For Enterprises'}
                  </span>
                  <h3 className="text-lg md:text-xl font-bold text-[#1C2526] dark:text-white">
                    {i18n.language === 'vi' ? 'Tư Vấn Giải Pháp & Hợp Tác' : 'Consulting & Partnership'}
                  </h3>
                </div>
              </div>

              <p className="text-xs text-[#5A6A72] dark:text-gray-300 leading-relaxed">
                {i18n.language === 'vi'
                  ? 'Nhận thiết kế riêng giải pháp AI Marketing, tự động hóa quy trình n8n và tích hợp Web/App theo yêu cầu.'
                  : 'Get tailored AI Marketing solutions, n8n workflow automation, and custom Web/App integration.'}
              </p>

              {/* Steps */}
              <div className="space-y-3.5 pt-2">
                <h4 className="text-xs font-bold text-[#1C2526] dark:text-white uppercase tracking-wide">
                  {i18n.language === 'vi' ? 'Quy Trình Triển Khai' : 'Implementation Process'}
                </h4>
                <ul className="space-y-3">
                  <li className="flex items-start gap-2 text-xs text-[#5A6A72] dark:text-gray-300">
                    <span className="w-5 h-5 rounded-full bg-[#6B1D35]/10 text-[#6B1D35] flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">1</span>
                    <span>{i18n.language === 'vi' ? 'Khảo sát nhu cầu & tư vấn 1:1' : '1:1 Needs Assessment & Consulting'}</span>
                  </li>
                  <li className="flex items-start gap-2 text-xs text-[#5A6A72] dark:text-gray-300">
                    <span className="w-5 h-5 rounded-full bg-[#6B1D35]/10 text-[#6B1D35] flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">2</span>
                    <span>{i18n.language === 'vi' ? 'Xây dựng giải pháp & Demo kịch bản' : 'Solution Design & Demo Script'}</span>
                  </li>
                  <li className="flex items-start gap-2 text-xs text-[#5A6A72] dark:text-gray-300">
                    <span className="w-5 h-5 rounded-full bg-[#6B1D35]/10 text-[#6B1D35] flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">3</span>
                    <span>{i18n.language === 'vi' ? 'Bàn giao hệ thống & Đào tạo sử dụng' : 'System Handover & Staff Training'}</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="pt-8">
              <Link
                to="/contact"
                className="inline-flex items-center justify-center gap-2 w-full sm:w-auto text-xs font-bold text-[#1C2526] dark:text-white px-6 py-3 rounded-full border border-gray-200 dark:border-gray-700 hover:border-[#6B1D35]/40 transition-colors bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer text-center"
              >
                {i18n.language === 'vi' ? 'Đăng Ký Tư Vấn' : 'Book Consultation'}
                <i className="ri-arrow-right-line" />
              </Link>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
