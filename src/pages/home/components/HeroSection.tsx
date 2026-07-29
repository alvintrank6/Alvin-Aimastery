import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export default function HeroSection() {
  const { t, i18n } = useTranslation();

  return (
    <section className="relative w-full overflow-hidden pt-28 md:pt-36 pb-16 md:pb-24 transition-colors duration-300">
      {/* Background radial glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-cyan-500/10 dark:bg-cyan-500/20 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute top-10 right-10 w-72 h-72 bg-[#9B2A4C]/10 dark:bg-[#9B2A4C]/20 blur-[100px] rounded-full pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-8">
        {/* Top Status Badge */}
        <div className="flex items-center gap-2 mb-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-bold tracking-wide shadow-sm">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            ● Available for work
          </div>
          <div className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-cyan-500/20 bg-cyan-500/5 text-cyan-700 dark:text-cyan-300 text-xs font-semibold">
            <i className="ri-map-pin-2-line text-cyan-500" />
            Hanoi, Vietnam
          </div>
        </div>

        {/* Hero Main Grid - Asymmetric Layout (Text Left - Image Center - Desc Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center mb-12">
          
          {/* Left Column (Title & Branding) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="text-xs font-bold uppercase tracking-widest text-[#9B2A4C] dark:text-cyan-400">
              Alvin Tran — Portfolio & Agency
            </div>
            
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-black tracking-tight leading-[0.95] text-[#1C2526] dark:text-white">
              AI MARKETING
              <span className="block text-[#9B2A4C] dark:text-cyan-400 font-extrabold mt-1">
                SPECIALIST
              </span>
            </h1>

            <p className="text-sm md:text-base font-semibold text-[#5A6A72] dark:text-gray-300 leading-relaxed max-w-md">
              {i18n.language === 'vi'
                ? 'Tối ưu hóa tăng trưởng doanh nghiệp bằng AI Marketing, Automation & Thiết kế Website cao cấp.'
                : 'Accelerating business growth with AI Marketing, Smart Automations & High-converting Web Design.'}
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Link
                to="/contact"
                className="gradient-bg dark:bg-gradient-to-r dark:from-rose-600 dark:to-pink-700 text-white font-bold px-7 py-3.5 rounded-full hover:scale-105 transition-all text-xs tracking-wider uppercase shadow-lg shadow-[#9B2A4C]/20 dark:shadow-rose-600/20"
              >
                Let's Talk <i className="ri-arrow-right-line ml-1" />
              </Link>
              <Link
                to="/projects"
                className="border border-gray-300 dark:border-gray-700 hover:border-[#9B2A4C] dark:hover:border-rose-400 text-[#1C2526] dark:text-white font-bold px-6 py-3.5 rounded-full transition-all text-xs tracking-wider uppercase"
              >
                {i18n.language === 'vi' ? 'Xem dự án' : 'View Projects'}
              </Link>
            </div>
          </div>

          {/* Center Column (Portrait Image with Interactive Overlay) */}
          <div className="lg:col-span-4 flex justify-center relative my-4 lg:my-0">
            <div className="relative group">
              {/* Outer decorative ring */}
              <div className="absolute -inset-3 rounded-3xl bg-gradient-to-tr from-[#9B2A4C]/20 via-cyan-400/20 to-emerald-400/20 blur-lg opacity-70 group-hover:opacity-100 transition-opacity" />

              {/* Main portrait image card */}
              <div className="relative w-64 h-80 sm:w-72 sm:h-96 rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-800 shadow-2xl bg-white dark:bg-[#131B2E]">
                <img
                  src="https://static.readdy.ai/image/f4782dda055a3841fcfd0612adf32078/077c27292c8b798fc81c07d472b5546d.jpeg"
                  alt="Alvin Tran - AI Marketing Specialist"
                  onError={(e) => {
                    e.currentTarget.src = 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80';
                  }}
                  className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                />
              </div>
            </div>
          </div>

          {/* Right Column (Value Proposition & Differentiators) */}
          <div className="lg:col-span-3 space-y-4 border-l border-gray-200 dark:border-gray-800 pl-0 lg:pl-6">
            <div className="p-4 rounded-2xl bg-white/60 dark:bg-[#131B2E]/60 border border-gray-100 dark:border-gray-800 shadow-sm backdrop-blur-md">
              <div className="flex items-center gap-2 text-[#9B2A4C] dark:text-cyan-400 font-bold text-xs mb-1">
                <i className="ri-magic-line" /> AI Automation
              </div>
              <p className="text-xs text-[#5A6A72] dark:text-gray-400 leading-relaxed">
                Tự động hóa quy trình chăm sóc khách hàng, Lead Generation & Workflow n8n/Make.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-white/60 dark:bg-[#131B2E]/60 border border-gray-100 dark:border-gray-800 shadow-sm backdrop-blur-md">
              <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-bold text-xs mb-1">
                <i className="ri-line-chart-line" /> Performance Ads & SEO
              </div>
              <p className="text-xs text-[#5A6A72] dark:text-gray-400 leading-relaxed">
                Tối ưu hóa chiến dịch truyền thông đa kênh & tăng tỷ lệ chuyển đổi ROI.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-white/60 dark:bg-[#131B2E]/60 border border-gray-100 dark:border-gray-800 shadow-sm backdrop-blur-md">
              <div className="flex items-center gap-2 text-amber-500 font-bold text-xs mb-1">
                <i className="ri-layout-4-line" /> Web & Mobile Systems
              </div>
              <p className="text-xs text-[#5A6A72] dark:text-gray-400 leading-relaxed">
                Thiết kế Landing page & Website doanh nghiệp tốc độ cao, chuẩn UX/UI.
              </p>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}