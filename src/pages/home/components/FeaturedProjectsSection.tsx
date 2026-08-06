import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { PRODUCT_DEMO_HTML } from '@/pages/projects/demoData';

export default function FeaturedProjectsSection() {
  const { i18n } = useTranslation();
  const [activeDemoModal, setActiveDemoModal] = useState<any | null>(null);
  const [viewportMode, setViewportMode] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');

  const openDemoInNewTab = (productId: string) => {
    const htmlContent = PRODUCT_DEMO_HTML[productId];
    if (htmlContent) {
      const newWindow = window.open('', '_blank');
      if (newWindow) {
        newWindow.document.open();
        newWindow.document.write(htmlContent);
        newWindow.document.close();
      }
    }
  };

  const [customProjectsList] = useState<any[]>(() => {
    try {
      const saved = localStorage.getItem('custom_projects');
      if (saved) return JSON.parse(saved);
    } catch {}
    return [];
  });

  const baseProjects = [
    {
      id: 'senn-cosmetics',
      title: 'Cosmetics Co. — AI E-Commerce & Growth System',
      tag: 'AI Marketing & E-Commerce',
      desc: 'Hệ thống tự động hóa bán hàng & tiếp thị mỹ phẩm ứng dụng AI Chatbot tư vấn da và kịch bản chốt đơn tự động.',
      stats: '+210% Doanh thu Online',
      tech: ['AI Chatbot', 'Meta Ads', 'Shopify', 'Automation'],
      img: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&auto=format&fit=crop&q=80',
      demoUrl: 'https://lamphongtech.vn/san-pham-mau.html',
    },
    {
      id: 'odoo-hrm-mobile',
      title: 'Odoo 18 HR & Attendance Mobile API System',
      tag: 'Enterprise ERP & Mobile App',
      desc: 'Hệ thống API di động kết nối Odoo 18 hỗ trợ chấm công khuôn mặt, định vị GPS & quản lý KPI cho nhân sự.',
      stats: 'Hơn 500+ nhân sự sử dụng',
      tech: ['Odoo 18', 'Python API', 'Flutter', 'PostgreSQL'],
      img: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=800&auto=format&fit=crop&q=80',
      demoUrl: 'https://lamphongtech.vn/san-pham-mau.html',
    },
    {
      id: 'landmark-real-estate',
      title: 'Landmark Estates — Cổng Thông Tin Bất Động Sản',
      tag: 'Real Estate Portal',
      desc: 'Giao diện sang trọng, tích hợp Virtual Tour 360, bộ lọc dự án theo khu vực, giá bán & form nhận thông báo ưu đãi.',
      stats: '3.5x ROAS',
      tech: ['Virtual Tour 360', 'React', 'Tailwind', 'Lead Gen'],
      img: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&auto=format&fit=crop&q=80',
      demoUrl: 'https://lamphongtech.vn/san-pham-mau.html',
    },
  ];

  const mappedCustom = customProjectsList.map((cp: any) => ({
    id: cp.id,
    title: cp.title || cp.name || 'Dự Án Mới',
    tag: cp.badge || cp.catName || 'Dự Án Mới',
    desc: cp.desc || cp.description || '',
    stats: `${cp.priceLabel || 'Giá từ'} ${cp.price || ''}`,
    tech: Array.isArray(cp.tags)
      ? cp.tags
      : typeof cp.tags === 'string'
      ? cp.tags.split(',').map((t: string) => t.trim())
      : ['AI System'],
    img: cp.img || cp.image || 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&auto=format&fit=crop&q=80',
    demoUrl: cp.demoUrl || 'https://lamphongtech.vn/san-pham-mau.html',
  }));

  const projects = [...mappedCustom, ...baseProjects];

  return (
    <section id="projects" className="py-20 md:py-28 border-t border-gray-200/60 dark:border-gray-800/60 transition-colors">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
          <div className="space-y-2">
            <span className="text-[10px] font-bold tracking-widest uppercase text-[#9B2A4C] dark:text-rose-400 px-3 py-1 rounded-full bg-[#9B2A4C]/10 dark:bg-rose-400/10 border border-[#9B2A4C]/20 dark:border-rose-400/30">
              Featured Case Studies
            </span>
            <h2 className="text-3xl md:text-5xl font-black text-[#1C2526] dark:text-white tracking-tight">
              Dự án <span className="text-[#9B2A4C] dark:text-rose-400">Tiêu Biểu</span>
            </h2>
            <p className="text-sm text-[#5A6A72] dark:text-gray-400 max-w-lg">
              Các dự án thực chiến ứng dụng AI, tiếp thị số & tự động hóa mang lại giá trị chuyển đổi cao.
            </p>
          </div>

          <Link
            to="/projects"
            className="inline-flex items-center gap-2 text-xs font-bold text-[#9B2A4C] dark:text-rose-400 hover:underline uppercase tracking-wider shrink-0"
          >
            {i18n.language === 'vi' ? 'Xem tất cả dự án' : 'View All Projects'}
            <i className="ri-arrow-right-line" />
          </Link>
        </div>

        {/* Projects Grid (3 Featured Projects) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {projects.map((item) => (
            <div
              key={item.id}
              className="group rounded-3xl bg-white dark:bg-[#131B2E] border border-gray-200 dark:border-gray-800 shadow-xl overflow-hidden hover:shadow-2xl hover:border-[#9B2A4C]/30 dark:hover:border-rose-400/30 transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                {/* Thumbnail Image */}
                <div className="relative h-52 overflow-hidden bg-gray-100 dark:bg-gray-800">
                  <img
                    src={item.img}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  
                  <span className="absolute top-4 left-4 text-[10px] font-extrabold uppercase tracking-wider bg-white/90 dark:bg-[#0B0F17]/90 text-[#1C2526] dark:text-white px-3 py-1 rounded-full backdrop-blur-md">
                    {item.tag}
                  </span>

                  <span className="absolute bottom-3 right-3 text-[11px] font-black bg-[#9B2A4C] text-white px-2.5 py-1 rounded-lg shadow-md">
                    {item.stats}
                  </span>

                  {/* Interactive Overlay */}
                  <div className="absolute inset-0 bg-[#9B2A4C]/20 dark:bg-rose-500/20 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <button
                      onClick={() => setActiveDemoModal(item)}
                      className="py-2 px-5 rounded-full bg-white text-[#9B2A4C] dark:bg-rose-500 dark:text-white font-extrabold text-xs shadow-xl hover:scale-110 transition-transform flex items-center gap-1.5 cursor-pointer"
                    >
                      <i className="ri-play-circle-line text-base" />
                      Xem Demo Trực Tiếp
                    </button>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 space-y-3">
                  <h3 className="text-base font-extrabold text-[#1C2526] dark:text-white group-hover:text-[#9B2A4C] dark:group-hover:text-rose-400 transition-colors line-clamp-2">
                    {item.title}
                  </h3>

                  <p className="text-xs text-[#5A6A72] dark:text-gray-400 leading-relaxed line-clamp-3">
                    {item.desc}
                  </p>

                  {/* Tech stack tags */}
                  <div className="flex flex-wrap gap-1.5 pt-2">
                    {item.tech.map((t, idx) => (
                      <span
                        key={idx}
                        className="text-[10px] font-bold text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 px-2.5 py-1 rounded-md"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Card Footer Actions */}
              <div className="p-6 pt-0 flex items-center justify-between border-t border-gray-100 dark:border-gray-800/80 mt-4">
                <button
                  onClick={() => setActiveDemoModal(item)}
                  className="text-xs font-bold text-[#9B2A4C] dark:text-rose-400 inline-flex items-center gap-1 hover:gap-2 transition-all cursor-pointer"
                >
                  Xem demo trực tiếp <i className="ri-play-circle-line" />
                </button>

                <span
                  onClick={() => setActiveDemoModal(item)}
                  className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-400 group-hover:bg-[#9B2A4C] group-hover:text-white dark:group-hover:bg-[#9B2A4C] dark:group-hover:text-white transition-colors cursor-pointer"
                >
                  <i className="ri-arrow-right-up-line" />
                </span>
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* ===== INTERACTIVE LIVE DEMO MODAL ===== */}
      {activeDemoModal && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex flex-col items-center justify-center p-4 md:p-6 animate-fadeIn">
          {/* Modal Container */}
          <div className="w-full max-w-6xl h-[88vh] bg-[#0D0D14] rounded-2xl border border-gray-800 shadow-2xl flex flex-col overflow-hidden">
            
            {/* macOS Styled Top Header */}
            <div className="px-4 py-3 bg-[#1A1A2E] border-b border-gray-800 flex items-center justify-between gap-4 shrink-0">
              
              {/* Dots */}
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-red-500 inline-block" />
                <span className="w-3 h-3 rounded-full bg-amber-400 inline-block" />
                <span className="w-3 h-3 rounded-full bg-emerald-500 inline-block" />
              </div>

              {/* URL Address Bar */}
              <div className="flex-1 max-w-md bg-gray-900 border border-gray-800 rounded-lg px-3 py-1 text-center font-mono text-xs text-gray-300 truncate">
                🔒 https://demo.aimastery.vn/{activeDemoModal.id}
              </div>

              {/* Actions & Viewport Switcher */}
              <div className="flex items-center gap-2">
                {/* Viewport switch */}
                <div className="hidden sm:flex rounded-lg bg-gray-900 p-0.5 border border-gray-800 text-[10px] font-bold">
                  <button
                    onClick={() => setViewportMode('desktop')}
                    className={`px-2.5 py-1 rounded transition-colors ${
                      viewportMode === 'desktop' ? 'bg-[#9B2A4C] text-white' : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    Desktop
                  </button>
                  <button
                    onClick={() => setViewportMode('tablet')}
                    className={`px-2.5 py-1 rounded transition-colors ${
                      viewportMode === 'tablet' ? 'bg-[#9B2A4C] text-white' : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    Tablet
                  </button>
                  <button
                    onClick={() => setViewportMode('mobile')}
                    className={`px-2.5 py-1 rounded transition-colors ${
                      viewportMode === 'mobile' ? 'bg-[#9B2A4C] text-white' : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    Mobile
                  </button>
                </div>

                <button
                  onClick={() => openDemoInNewTab(activeDemoModal.id)}
                  className="px-3 py-1 rounded-lg border border-[#9B2A4C]/40 text-[#9B2A4C] dark:text-rose-400 hover:bg-[#9B2A4C]/10 text-xs font-bold transition-all flex items-center gap-1 cursor-pointer"
                >
                  Mở tab mới ↗
                </button>

                <button
                  onClick={() => setActiveDemoModal(null)}
                  className="w-8 h-8 rounded-full bg-gray-800 text-gray-300 hover:bg-red-500 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
                >
                  ✕
                </button>
              </div>

            </div>

            {/* Interactive Demo Iframe Canvas */}
            <div className="flex-1 bg-gray-900 flex justify-center items-center overflow-hidden p-2 relative">
              <div
                className={`h-full transition-all duration-300 bg-white rounded-lg overflow-hidden shadow-2xl ${
                  viewportMode === 'desktop'
                    ? 'w-full'
                    : viewportMode === 'tablet'
                    ? 'w-[768px]'
                    : 'w-[375px]'
                }`}
              >
                <iframe
                  srcDoc={PRODUCT_DEMO_HTML[activeDemoModal.id] || `<html><body style="display:flex;align-items:center;justify-content:center;height:100vh;font-family:sans-serif;background:#0d0d14;color:#fff;"><h2>Đang tải demo cho ${activeDemoModal.title}...</h2></body></html>`}
                  title={`Live Demo - ${activeDemoModal.title}`}
                  className="w-full h-full border-none"
                />
              </div>
            </div>

          </div>
        </div>
      )}
    </section>
  );
}
