import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export default function JoinUsSection() {
  const { i18n } = useTranslation();

  return (
    <section id="join-us" className="py-12 md:py-16 bg-gradient-to-r from-[#6B1D35] via-[#9B2A4C] to-[#1C2526] text-white relative overflow-hidden transition-colors">
      {/* Background glow effects */}
      <div className="absolute -top-16 -right-16 w-64 h-64 bg-rose-400/20 blur-3xl rounded-full pointer-events-none animate-pulse" />
      <div className="absolute -bottom-16 -left-16 w-64 h-64 bg-[#9B2A4C]/30 blur-3xl rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-8 p-8 md:p-12 rounded-3xl bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl">
          
          {/* Left Text */}
          <div className="space-y-3 text-center lg:text-left max-w-2xl">
            <span className="text-[10px] font-extrabold uppercase tracking-widest bg-white/20 text-white px-3 py-1 rounded-full border border-white/30">
              Partner With Us
            </span>
            
            <h2 className="text-2xl md:text-4xl font-black tracking-tight leading-tight">
              Đồng Hành & Phát Triển Cùng{' '}
              <span className="text-rose-300">AI Mastery</span>
            </h2>

            <p className="text-xs md:text-sm text-white/80 leading-relaxed">
              Bạn muốn bứt phá doanh số với chiến lược AI Marketing & Tự động hóa quy trình chuyên sâu? Hãy kết nối với chúng tôi để bắt đầu ngay hôm nay.
            </p>
          </div>

          {/* Right Action CTAs */}
          <div className="flex flex-col sm:flex-row items-center gap-4 shrink-0">
            <Link
              to="/contact"
              className="w-full sm:w-auto py-3.5 px-8 rounded-full bg-white text-[#9B2A4C] font-black text-xs uppercase tracking-wider shadow-lg hover:bg-gray-100 hover:scale-105 transition-all text-center"
            >
              Nhận Tư Vấn Ngay <i className="ri-arrow-right-line ml-1" />
            </Link>

            <Link
              to="/projects"
              className="w-full sm:w-auto py-3.5 px-6 rounded-full border border-white/40 text-white font-bold text-xs uppercase tracking-wider hover:bg-white/10 transition-all text-center"
            >
              Khám Phá Dự Án <i className="ri-lightbulb-line ml-1" />
            </Link>
          </div>

        </div>
      </div>
    </section>
  );
}
