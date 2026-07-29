import Navbar from '@/components/feature/Navbar';
import Footer from '@/components/feature/Footer';
import { useTranslation } from 'react-i18next';

export default function AboutPage() {
  const { i18n } = useTranslation();

  return (
    <div className="min-h-screen pt-28 pb-12 transition-colors">
      <Navbar />
      <main className="max-w-5xl mx-auto px-4 md:px-8 space-y-12 pb-20 md:pb-28">
        {/* Header */}
        <div className="space-y-4 text-center max-w-2xl mx-auto">
          <span className="text-[10px] font-bold tracking-widest uppercase text-[#9B2A4C] dark:text-cyan-400 px-3.5 py-1 rounded-full bg-[#9B2A4C]/10 dark:bg-cyan-500/10 border border-[#9B2A4C]/20 dark:border-cyan-500/20">
            Hành Trình & Sự Nghiệp
          </span>
          <h1 className="text-3xl md:text-5xl font-black text-[#1C2526] dark:text-white">
            About <span className="text-[#9B2A4C] dark:text-cyan-400">Alvin Tran</span>
          </h1>
          <p className="text-sm text-[#5A6A72] dark:text-gray-400">
            Marketer, AI Automation Specialist & Communications Strategist tại AI Mastery.
          </p>
        </div>

        {/* Bio Detailed */}
        <div className="p-8 rounded-3xl bg-white dark:bg-[#131B2E] border border-gray-200 dark:border-gray-800 shadow-xl space-y-6">
          <h2 className="text-xl font-extrabold text-[#1C2526] dark:text-white">
            Giới Thiệu Bản Thân
          </h2>
          <p className="text-sm text-[#5A6A72] dark:text-gray-300 leading-relaxed">
            Tôi là <strong>Trần Vũ Quốc Anh (Alvin Tran)</strong>, hiện đang đảm nhiệm vai trò tư vấn truyền thông & giải pháp công nghệ tự động hóa tại AI Mastery. Với đam mê mãnh liệt dành cho công nghệ AI và truyền thông số, tôi tập trung vào việc thu hẹp khoảng cách giữa ý tưởng tiếp thị và các công cụ thực thi kỹ thuật.
          </p>
          <p className="text-sm text-[#5A6A72] dark:text-gray-300 leading-relaxed">
            Hành trình làm việc của tôi gắn liền với việc xây dựng phễu bán hàng tự động, chiến lược nội dung đa kênh, và tối ưu hóa hệ thống ERP Odoo 18 để giúp các doanh nghiệp nâng cao trải nghiệm khách hàng cũng như hiệu suất vận hành.
          </p>
        </div>

        {/* Experience Timeline */}
        <div className="space-y-6">
          <h2 className="text-2xl font-black text-[#1C2526] dark:text-white">
            Kinh Nghiệm Làm Việc & Dự Án
          </h2>

          <div className="space-y-4">
            <div className="p-6 rounded-2xl bg-white dark:bg-[#131B2E] border border-gray-200 dark:border-gray-800 shadow-md">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="text-base font-extrabold text-[#1C2526] dark:text-white">
                    Bộ Phận Kinh Doanh & AI Marketing
                  </h3>
                  <p className="text-xs text-[#9B2A4C] dark:text-cyan-400 font-bold">
                    AI Mastery
                  </p>
                </div>
                <span className="text-xs font-bold text-gray-400">2024 — Hiện tại</span>
              </div>
              <p className="text-xs text-[#5A6A72] dark:text-gray-300">
                Tư vấn giải pháp website, AI Chatbot và hệ thống quản trị Odoo ERP cho khách hàng doanh nghiệp.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white dark:bg-[#131B2E] border border-gray-200 dark:border-gray-800 shadow-md">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="text-base font-extrabold text-[#1C2526] dark:text-white">
                    Founder & Marketing Lead
                  </h3>
                  <p className="text-xs text-[#9B2A4C] dark:text-cyan-400 font-bold">
                    Senn Cosmetics & ByeBye Pimple
                  </p>
                </div>
                <span className="text-xs font-bold text-gray-400">2023 — 2024</span>
              </div>
              <p className="text-xs text-[#5A6A72] dark:text-gray-300">
                Quản lý vận hành kênh bán hàng online, chạy chiến dịch Performance Ads và tối ưu hóa quy trình tư vấn khách hàng.
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
