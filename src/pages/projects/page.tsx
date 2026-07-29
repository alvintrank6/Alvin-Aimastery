import { useState } from 'react';
import Navbar from '@/components/feature/Navbar';
import Footer from '@/components/feature/Footer';
import { PRODUCT_DEMO_HTML } from './demoData';

export interface SampleProduct {
  id: string;
  title: string;
  catId: string;
  catName: string;
  badge: 'Website' | 'E-Commerce' | 'Web App' | 'Landing Page';
  isHot?: boolean;
  price: string;
  priceLabel?: string;
  desc: string;
  tags: string[];
  demoTime: string;
  delivery: string;
  img: string;
  demoUrl: string;
}

export const SAMPLE_PRODUCTS: SampleProduct[] = [
  {
    id: 'cosmetics-co',
    title: 'Cosmetics Co. — Website Mỹ Phẩm & Skincare Thuần Chay',
    catId: 'my-pham',
    catName: 'Mỹ phẩm & Skincare',
    badge: 'E-Commerce',
    isHot: true,
    price: '3.500.000',
    priceLabel: 'Giá từ',
    desc: 'Tối ưu phễu đặt hàng nhanh, tích hợp chọn sản phẩm, giỏ hàng, chọn thuộc tính da & Zalo OA thông báo tự động.',
    tags: ['React 19', 'Next.js', 'TailwindCSS', 'Zalo ZNS'],
    demoTime: 'Có sẵn',
    delivery: '24h - 48h',
    img: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&auto=format&fit=crop&q=80',
    demoUrl: 'https://lamphongtech.vn/san-pham-mau.html',
  },
  {
    id: 'landmark-real-estate',
    title: 'Landmark Estates — Cổng Thông Tin Bất Động Sản Cao Cấp',
    catId: 'bat-dong-san',
    catName: 'Bất động sản',
    badge: 'Website',
    isHot: true,
    price: '4.500.000',
    priceLabel: 'Giá từ',
    desc: 'Giao diện sang trọng, tích hợp Virtual Tour 360, bộ lọc dự án theo khu vực, giá bán & form nhận thông báo ưu đãi.',
    tags: ['Interactive Map', 'Virtual 360', 'Lead Gen', 'SEO Top'],
    demoTime: 'Có sẵn',
    delivery: '2 - 3 ngày',
    img: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&auto=format&fit=crop&q=80',
    demoUrl: 'https://lamphongtech.vn/san-pham-mau.html',
  },
  {
    id: 'odoo-hrm-mobile',
    title: 'Odoo 18 ERP & Mobile Attendance Dashboard',
    catId: 'doanh-nghiep',
    catName: 'Doanh nghiệp & AI',
    badge: 'Web App',
    isHot: true,
    price: 'Thỏa thuận',
    priceLabel: 'Báo giá',
    desc: 'Hệ thống Dashboard chấm công AI khuôn mặt, GPS location & quản lý chỉ số KPI nhân sự chuyên nghiệp.',
    tags: ['Odoo 18', 'Python API', 'Flutter', 'PostgreSQL'],
    demoTime: 'Có sẵn',
    delivery: 'Theo quy mô',
    img: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=800&auto=format&fit=crop&q=80',
    demoUrl: 'https://lamphongtech.vn/san-pham-mau.html',
  },
  {
    id: 'aura-beauty-spa',
    title: 'Aura Beauty Spa — Landing Page Đặt Lịch Chăm Sóc Da',
    catId: 'spa',
    catName: 'Spa & Thẩm mỹ',
    badge: 'Landing Page',
    price: '2.900.000',
    priceLabel: 'Giá trọn gói',
    desc: 'Landing page tỷ lệ chuyển đổi cao, tích hợp form đặt lịch hẹn chọn chi nhánh, giờ khám & tự động nhắc SMS/Zalo.',
    tags: ['Booking System', 'Zalo Mini App', 'CRO 18%'],
    demoTime: 'Có sẵn',
    delivery: '24h',
    img: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=800&auto=format&fit=crop&q=80',
    demoUrl: 'https://lamphongtech.vn/san-pham-mau.html',
  },
  {
    id: 'gourmet-bistro',
    title: 'Gourmet Bistro — Website Nhà Hàng & Menu Gọi Món QR',
    catId: 'nha-hang',
    catName: 'Nhà hàng & F&B',
    badge: 'Website',
    price: '3.200.000',
    priceLabel: 'Giá từ',
    desc: 'Thực đơn điện tử quét mã QR gọi món tại bàn, đặt bàn trực tuyến & tự động gửi hóa đơn tạm tính qua Zalo/Email.',
    tags: ['QR Menu', 'Table Booking', 'POS Sync'],
    demoTime: 'Có sẵn',
    delivery: '1 - 2 ngày',
    img: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&auto=format&fit=crop&q=80',
    demoUrl: 'https://lamphongtech.vn/san-pham-mau.html',
  },
  {
    id: 'edumaster-lms',
    title: 'EduMaster — Nền Tảng Đào Tạo & Khóa Học Trực Tuyến',
    catId: 'giao-duc',
    catName: 'Giáo dục & Khóa học',
    badge: 'Web App',
    price: '4.200.000',
    priceLabel: 'Giá từ',
    desc: 'Hệ thống bán khóa học video, học trực tuyến, làm bài test trắc nghiệm tự động chấm điểm & cấp chứng chỉ.',
    tags: ['LMS Engine', 'Video DRM', 'Payment Gateway'],
    demoTime: 'Có sẵn',
    delivery: '3 ngày',
    img: 'https://images.unsplash.com/photo-1501504905252-473c47e087f8?w=800&auto=format&fit=crop&q=80',
    demoUrl: 'https://lamphongtech.vn/san-pham-mau.html',
  },
];

export const CATEGORIES = [
  { id: 'all', name: 'Tất cả danh mục' },
  { id: 'my-pham', name: 'Mỹ phẩm & Skincare' },
  { id: 'bat-dong-san', name: 'Bất động sản' },
  { id: 'doanh-nghiep', name: 'Doanh nghiệp & AI' },
  { id: 'spa', name: 'Spa & Thẩm mỹ' },
  { id: 'nha-hang', name: 'Nhà hàng & F&B' },
  { id: 'giao-duc', name: 'Giáo dục & Khóa học' },
];

export default function ProjectsPage() {
  const [selectedCat, setSelectedCat] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeDemoModal, setActiveDemoModal] = useState<SampleProduct | null>(null);
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

  const filteredProducts = SAMPLE_PRODUCTS.filter((prod) => {
    const matchesCat = selectedCat === 'all' || prod.catId === selectedCat;
    const matchesSearch =
      prod.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prod.desc.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prod.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCat && matchesSearch;
  });

  return (
    <div className="min-h-screen pt-28 pb-12 transition-colors">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 md:px-8 space-y-12 pb-20 md:pb-28">
        
        {/* Hero Section */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-[#9B2A4C]/20 bg-[#9B2A4C]/10 dark:bg-cyan-500/10 dark:border-cyan-500/20 text-[#9B2A4C] dark:text-cyan-400 text-xs font-bold uppercase tracking-widest">
            <span className="w-2 h-2 rounded-full bg-[#9B2A4C] dark:bg-cyan-400 animate-pulse" />
            Portfolio & Showcase
          </div>

          <h1 className="text-3xl md:text-5xl font-black text-[#1C2526] dark:text-white leading-tight">
            Sản Phẩm Mẫu – <span className="text-[#9B2A4C] dark:text-cyan-400">Thực Chiến 20+ Ngành Nghề</span>
          </h1>

          <p className="text-sm md:text-base text-[#5A6A72] dark:text-gray-400 leading-relaxed">
            Bộ sưu tập website, ứng dụng và giải pháp tự động hóa thực tế. Mỗi sản phẩm được thiết kế chuẩn UX/UI, tối ưu tốc độ và sẵn sàng trải nghiệm xem demo trực tiếp.
          </p>

          {/* Stats Bar */}
          <div className="pt-4 grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-2xl mx-auto">
            <div className="p-3 rounded-2xl bg-white dark:bg-[#131B2E] border border-gray-200 dark:border-gray-800 shadow-sm text-center">
              <div className="text-xl md:text-2xl font-black text-[#9B2A4C] dark:text-cyan-400">150+</div>
              <div className="text-[10px] font-bold text-gray-500 dark:text-gray-400">Dự án hoàn thành</div>
            </div>
            <div className="p-3 rounded-2xl bg-white dark:bg-[#131B2E] border border-gray-200 dark:border-gray-800 shadow-sm text-center">
              <div className="text-xl md:text-2xl font-black text-[#9B2A4C] dark:text-cyan-400">20+</div>
              <div className="text-[10px] font-bold text-gray-500 dark:text-gray-400">Ngành nghề</div>
            </div>
            <div className="p-3 rounded-2xl bg-white dark:bg-[#131B2E] border border-gray-200 dark:border-gray-800 shadow-sm text-center">
              <div className="text-xl md:text-2xl font-black text-[#9B2A4C] dark:text-cyan-400">98%</div>
              <div className="text-[10px] font-bold text-gray-500 dark:text-gray-400">Khách hài lòng</div>
            </div>
            <div className="p-3 rounded-2xl bg-white dark:bg-[#131B2E] border border-gray-200 dark:border-gray-800 shadow-sm text-center">
              <div className="text-xl md:text-2xl font-black text-[#9B2A4C] dark:text-cyan-400">5★</div>
              <div className="text-[10px] font-bold text-gray-500 dark:text-gray-400">Đánh giá trung bình</div>
            </div>
          </div>
        </div>

        {/* Main Layout Grid: Left Sidebar Categories + Right Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Sidebar: Categories Filter */}
          <aside className="lg:col-span-3 bg-white dark:bg-[#131B2E] border border-gray-200 dark:border-gray-800 rounded-3xl p-5 shadow-xl space-y-4 lg:sticky lg:top-28">
            <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-800 pb-3">
              <span className="text-xs font-black uppercase tracking-wider text-[#1C2526] dark:text-white flex items-center gap-2">
                <i className="ri-filter-3-line text-[#9B2A4C] dark:text-cyan-400" />
                Danh Mục Ngành Nghề
              </span>
              <span className="text-[10px] font-bold text-gray-400 bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded-full">
                {CATEGORIES.length - 1} ngành
              </span>
            </div>

            <div className="flex flex-row lg:flex-col gap-1.5 overflow-x-auto lg:overflow-x-visible pb-2 lg:pb-0 scrollbar-none">
              {CATEGORIES.map((cat) => {
                const isActive = selectedCat === cat.id;
                const count =
                  cat.id === 'all'
                    ? SAMPLE_PRODUCTS.length
                    : SAMPLE_PRODUCTS.filter((p) => p.catId === cat.id).length;

                return (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCat(cat.id)}
                    className={`w-auto lg:w-full flex items-center justify-between px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                      isActive
                        ? 'bg-[#9B2A4C] text-white dark:bg-cyan-500 dark:text-black shadow-md'
                        : 'bg-gray-50 dark:bg-gray-900 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                    }`}
                  >
                    <span>{cat.name}</span>
                    <span
                      className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ml-2 ${
                        isActive
                          ? 'bg-white/20 text-white dark:bg-black/20 dark:text-black'
                          : 'bg-gray-200 dark:bg-gray-800 text-gray-500'
                      }`}
                    >
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
          </aside>

          {/* Right Main Content */}
          <main className="lg:col-span-9 space-y-6">
            
            {/* Toolbar (Search & Count) */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-white dark:bg-[#131B2E] border border-gray-200 dark:border-gray-800 shadow-md">
              <div className="text-xs font-semibold text-gray-600 dark:text-gray-400">
                Hiển thị <strong className="text-[#1C2526] dark:text-white font-black">{filteredProducts.length}</strong> sản phẩm mẫu
              </div>

              {/* Search Box */}
              <div className="relative w-full sm:w-72">
                <i className="ri-search-line absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
                <input
                  type="text"
                  placeholder="Tìm theo tên, công nghệ..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-xs text-[#1C2526] dark:text-white focus:outline-none focus:border-[#9B2A4C] dark:focus:border-cyan-400"
                />
              </div>
            </div>

            {/* Product Cards Grid */}
            {filteredProducts.length === 0 ? (
              <div className="p-12 text-center rounded-3xl bg-white dark:bg-[#131B2E] border border-gray-200 dark:border-gray-800 space-y-3">
                <i className="ri-inbox-line text-4xl text-gray-400" />
                <h3 className="text-base font-extrabold text-[#1C2526] dark:text-white">Không tìm thấy sản phẩm nào</h3>
                <p className="text-xs text-gray-500">Thử tìm kiếm với từ khóa khác hoặc thay đổi danh mục lọc.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map((prod) => (
                  <div
                    key={prod.id}
                    className="group rounded-3xl bg-white dark:bg-[#131B2E] border border-gray-200 dark:border-gray-800 shadow-xl overflow-hidden hover:shadow-2xl hover:border-[#9B2A4C]/30 dark:hover:border-cyan-500/30 transition-all duration-300 flex flex-col justify-between"
                  >
                    <div>
                      {/* Thumbnail Header */}
                      <div className="relative h-48 overflow-hidden bg-gray-100 dark:bg-gray-800">
                        <img
                          src={prod.img}
                          alt={prod.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80" />

                        {/* Badge Label */}
                        <span className="absolute top-3 left-3 text-[10px] font-extrabold uppercase tracking-wider bg-black/70 text-white px-2.5 py-1 rounded-full backdrop-blur-md border border-white/20">
                          {prod.badge}
                        </span>

                        {prod.isHot && (
                          <span className="absolute top-3 right-3 text-[10px] font-black uppercase tracking-wider bg-emerald-500 text-white px-2.5 py-0.5 rounded-full shadow-md animate-pulse">
                            MỚI
                          </span>
                        )}

                        {/* Interactive Overlay on Hover */}
                        <div className="absolute inset-0 bg-[#9B2A4C]/20 dark:bg-cyan-500/20 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <button
                            onClick={() => setActiveDemoModal(prod)}
                            className="py-2 px-5 rounded-full bg-white text-[#9B2A4C] dark:bg-cyan-400 dark:text-black font-extrabold text-xs shadow-xl hover:scale-110 transition-transform flex items-center gap-1.5 cursor-pointer"
                          >
                            <i className="ri-[#play-circle-line] text-base" />
                            Xem Demo Trực Tiếp
                          </button>
                        </div>
                      </div>

                      {/* Card Content */}
                      <div className="p-5 space-y-2.5">
                        <div className="text-[10px] font-bold uppercase tracking-wider text-[#9B2A4C] dark:text-cyan-400">
                          {prod.catName}
                        </div>

                        <h3 className="text-sm font-extrabold text-[#1C2526] dark:text-white leading-snug line-clamp-2 group-hover:text-[#9B2A4C] dark:group-hover:text-cyan-400 transition-colors">
                          {prod.title}
                        </h3>

                        <p className="text-xs text-[#5A6A72] dark:text-gray-400 leading-relaxed line-clamp-2">
                          {prod.desc}
                        </p>

                        {/* Tags */}
                        <div className="flex flex-wrap gap-1 pt-1">
                          {prod.tags.map((t, idx) => (
                            <span
                              key={idx}
                              className="text-[9px] font-bold text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded-md"
                            >
                              #{t}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Card Footer: Price & Live Demo Button */}
                    <div className="p-5 pt-3 border-t border-gray-100 dark:border-gray-800/80 flex items-center justify-between gap-2">
                      <div>
                        {prod.priceLabel && (
                          <div className="text-[9px] font-bold text-gray-400">{prod.priceLabel}</div>
                        )}
                        <div className="text-sm font-black text-[#9B2A4C] dark:text-cyan-400">
                          {prod.price} {prod.price !== 'Thỏa thuận' && 'đ'}
                        </div>
                      </div>

                      <button
                        onClick={() => setActiveDemoModal(prod)}
                        className="py-2 px-3.5 rounded-xl border border-[#9B2A4C]/30 dark:border-cyan-400/30 text-[#9B2A4C] dark:text-cyan-400 hover:bg-[#9B2A4C] hover:text-white dark:hover:bg-cyan-400 dark:hover:text-black font-bold text-xs flex items-center gap-1 transition-all cursor-pointer"
                      >
                        <i className="ri-play-circle-line text-sm" />
                        Xem demo
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

          </main>
        </div>

      </main>

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
                  className="px-3 py-1 rounded-lg border border-cyan-500/40 text-cyan-400 hover:bg-cyan-500/10 text-xs font-bold transition-all flex items-center gap-1 cursor-pointer"
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

      <Footer />
    </div>
  );
}
