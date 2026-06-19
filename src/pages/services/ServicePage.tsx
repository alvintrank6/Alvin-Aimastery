import { useState, useEffect, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Navbar from '@/components/feature/Navbar';
import Footer from '@/components/feature/Footer';
import { LeadsAPI } from '@/utils/api';

interface ServiceContent {
  id: string;
  titleKey: string;
  descKey: string;
  detailsKey: string;
  icon: string;
  stack: string[];
  process: string[];
  whyUs: string[];
}

export const SERVICES_DATA: Record<string, ServiceContent> = {
  web: {
    id: 'web',
    titleKey: 'services.list.web.title',
    descKey: 'services.list.web.desc',
    detailsKey: 'services.list.web.details',
    icon: 'ri-global-line',
    stack: ['Next.js', 'React', 'TailwindCSS', 'TypeScript', 'Node.js', 'Vercel'],
    process: ['Requirement Gathering & Wireframing', 'UI/UX Interactive Design Prototype', 'Frontend & Backend Coding', 'SEO Optimization & Speed Auditing', 'Deployment & Handover'],
    whyUs: ['100/100 Core Web Vitals speed points', 'Fully responsive mobile-first grids', 'Modern typography & custom layouts', 'Easy-to-use headless CMS integration'],
  },
  chatbot: {
    id: 'chatbot',
    titleKey: 'services.list.chatbot.title',
    descKey: 'services.list.chatbot.desc',
    detailsKey: 'services.list.chatbot.details',
    icon: 'ri-chat-voice-line',
    stack: ['OpenAI GPT-4o', 'Flowise AI', 'LangChain', 'Python', 'FastAPI', 'WhatsApp API'],
    process: ['Define Bot Persona & FAQ Datasets', 'Build RAG pipelines & knowledge bases', 'Develop Agent logic & API integrations', 'Beta Testing with customer simulations', 'Launch & Analytics tracking setup'],
    whyUs: ['Over 90% support query resolution rate', 'Instant replies under 2 seconds', 'Smart handoff to human agents when needed', 'Integrated multi-channel chat (Web, Messenger, Slack)'],
  },
  landing: {
    id: 'landing',
    titleKey: 'services.list.landing.title',
    descKey: 'services.list.landing.desc',
    detailsKey: 'services.list.landing.details',
    icon: 'ri-layout-4-line',
    stack: ['Figma', 'React', 'TailwindCSS', 'Framer Motion', 'Google Analytics 4', 'A/B Testing Tools'],
    process: ['Marketing Hook & Copywriting', 'High-Fidelity UI Design in Figma', 'Fast-coded Framer/React template development', 'Conversion Tracking & Meta Pixel setups', 'Split-testing and constant performance iterations'],
    whyUs: ['Average conversion rates over 15%', 'Persuasive structural layout hierarchy', 'Blazing-fast loading times', 'Optimized for high ROI search and social ads'],
  },
  workflow: {
    id: 'workflow',
    titleKey: 'services.list.workflow.title',
    descKey: 'services.list.workflow.desc',
    detailsKey: 'services.list.workflow.details',
    icon: 'ri-git-merge-line',
    stack: ['Zapier', 'Make.com', 'Node.js', 'Webhooks', 'REST APIs', 'SQL / NoSQL Databases'],
    process: ['Manual Work Audit & Flowcharting', 'System Selection & API endpoints verification', 'Workflow construction & error fallback routing', 'Live staging runs & data consistency checks', 'Production switch & monitoring alerts'],
    whyUs: ['Eliminates human errors completely', 'Saves up to 40 hours of manual tasks per week', 'Real-time synchronization across different apps', 'Clean logging and automatic error email alerts'],
  },
  email: {
    id: 'email',
    titleKey: 'services.list.email.title',
    descKey: 'services.list.email.desc',
    detailsKey: 'services.list.email.details',
    icon: 'ri-mail-send-line',
    stack: ['Klaviyo', 'Mailchimp', 'ActiveCampaign', 'HTML/CSS Email Templates', 'Segmentations Tools'],
    process: ['Subscriber List Health Review', 'Email Sequence Strategy & Flow Mapping', 'Stunning responsive template design', 'Copywriting & Call-to-action optimizations', 'Performance auditing & A/B testing schedules'],
    whyUs: ['Boosts email-attributed revenue by 30%+', 'Hyper-personalized automated triggers', 'High inbox delivery rates', 'Clean list hygiene and subscriber growth'],
  },
  n8n: {
    id: 'n8n',
    titleKey: 'services.list.n8n.title',
    descKey: 'services.list.n8n.desc',
    detailsKey: 'services.list.n8n.details',
    icon: 'ri-terminal-window-line',
    stack: ['n8n Self-Hosted', 'Docker', 'AWS', 'PostgreSQL', 'Custom Nodes', 'Bash / JS scripting'],
    process: ['Hạ tầng Setup (VPS Docker setup)', 'n8n Configuration & Postgres DB backups', 'Create complex multi-step logical nodes', 'Custom API bindings using Javascript', 'Cronjob scheduler & webhook listening'],
    whyUs: ['Zero node-execution volume costs', 'Completely secure on your own cloud servers', 'Supports advanced JS coding within tasks', 'Flexible and robust open-source engine'],
  },
  app: {
    id: 'app',
    titleKey: 'services.list.app.title',
    descKey: 'services.list.app.desc',
    detailsKey: 'services.list.app.details',
    icon: 'ri-smartphone-line',
    stack: ['React Native', 'Flutter', 'Expo', 'Firebase', 'Supabase', 'Node.js'],
    process: ['App architecture & DB modeling', 'UI/UX high fidelity mobile prototypes', 'Native components development', 'API backend connections & OAuth integrations', 'TestFlight / Google Play beta testing & release'],
    whyUs: ['Smooth animations & native performance', 'Cross-platform single codebase efficiency', 'Secure offline-first local storage databases', 'Push notifications and automatic update systems'],
  }
};

/* --- SUB-SHOWCASE COMPONENTS FOR PORTFOLIO DEMO --- */
export function WebShowcase() {
  const { t } = useTranslation();
  const [viewport, setViewport] = useState<'desktop' | 'mobile'>('desktop');
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  // Interactive store states
  const [currentTab, setCurrentTab] = useState<'home' | 'shop' | 'blog'>('home');
  const [cart, setCart] = useState<Array<{ id: string; name: string; price: number; quantity: number; imageColor: string }>>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [checkoutSuccess, setCheckoutSuccess] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [selectedBlog, setSelectedBlog] = useState<any>(null);

  const MOCK_PRODUCTS = [
    {
      id: 'prod1',
      name: t('services.showcase.web.prod1') || 'Hyaluronic Acid',
      price: 24.00,
      rating: 4.9,
      reviews: 124,
      badge: 'Best Seller',
      badgeBg: 'bg-green-500',
      color: '#9B2A4C', // burgundy red
      desc: 'Tinh chất cấp ẩm chuyên sâu, phục hồi hàng rào bảo vệ da, giúp da căng mọng tức thì và giảm nếp nhăn mảnh.',
      ingredients: ['Pure Hyaluronic Acid 2%', 'Vitamin B5 (Panthenol)', 'Centella Asiatica Extract']
    },
    {
      id: 'prod2',
      name: t('services.showcase.web.prod2') || 'Retinol Booster',
      price: 28.00,
      rating: 4.8,
      reviews: 98,
      badge: 'New',
      badgeBg: 'bg-amber-500',
      color: '#8A9A86', // organic green
      desc: 'Hỗ trợ tái tạo tế bào, làm mờ vết thâm mụn, cải thiện lỗ chân lông và mang lại làn da mịn màng, tươi trẻ.',
      ingredients: ['Retinol 1% Encapsulated', 'Niacinamide 4%', 'Squalane']
    }
  ];

  const MOCK_BLOGS = [
    {
      id: 'blog1',
      category: 'Skincare Tips',
      readTime: '3 min read',
      title: 'Quy trình Skincare tối giản cho da dầu mụn',
      excerpt: 'Làm thế nào để chăm sóc làn da dầu mụn hiệu quả mà không cần dùng quá nhiều bước? Hãy tìm hiểu công thức 3 bước cơ bản tối ưu...',
      content: 'Chăm sóc da dầu mụn không có nghĩa là bạn cần bôi đắp hàng chục lớp mỹ phẩm. Quy trình tối giản sau sẽ giúp da thông thoáng và giảm mụn hiệu quả:\n\n1. Làm sạch sâu: Sử dụng sữa rửa mặt dịu nhẹ pH 5.5 giúp lấy sạch bã nhờn mà không khô da.\n2. Cấp ẩm (Hyaluronic Acid): Da dầu thường thiếu nước, dẫn đến tuyến bã nhờn hoạt động mạnh hơn. Bổ sung HA nhẹ dịu giúp cân bằng dầu-nước.\n3. Đặc trị (Retinol/Salicylic Acid): Sử dụng Retinol vào ban đêm giúp tăng tốc độ tái tạo tế bào, gom cồi mụn và giảm tiết dầu.'
    },
    {
      id: 'blog2',
      category: 'Ingredients',
      readTime: '4 min read',
      title: 'Retinol là gì? Hướng dẫn sử dụng cho người mới bắt đầu',
      excerpt: 'Retinol được xem là thần dược trẻ hóa da và ngừa mụn. Tuy nhiên, sử dụng sai cách có thể gây kích ứng nghiêm trọng...',
      content: 'Retinol là dẫn xuất của Vitamin A, hoạt động bằng cách đẩy nhanh chu kỳ sống của tế bào da, thúc đẩy sản sinh collagen giúp da săn chắc.\n\nHướng dẫn cho người mới bắt đầu:\n- Nồng độ thấp: Nên bắt đầu với nồng độ từ 0.1% đến 0.3%.\n- Tần suất: Dùng 1-2 lần/tuần trong 2 tuần đầu tiên, sau đó tăng dần khi da đã làm quen.\n- Quy trình: Bôi sau bước kem dưỡng (phương pháp kẹp sandwich) để giảm thiểu bong tróc và kích ứng da.'
    }
  ];

  const addToCart = (product: typeof MOCK_PRODUCTS[0]) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { id: product.id, name: product.name, price: product.price, quantity: 1, imageColor: product.color }];
    });
    setIsCartOpen(true);
  };

  const updateQuantity = (id: string, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.id === id) {
        const newQty = item.quantity + delta;
        return newQty > 0 ? { ...item, quantity: newQty } : null;
      }
      return item;
    }).filter(Boolean) as any);
  };

  const handleCheckout = () => {
    setIsCartOpen(false);
    setCheckoutSuccess(true);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center bg-gray-50 p-3 rounded-2xl border border-gray-100 gap-3">
        <span className="text-xs font-bold text-[#2C3E50]">{t('services.showcase.web.title')}</span>
        <div className="flex flex-wrap items-center gap-2">
          {/* Viewport switch */}
          <div className="flex rounded-xl border border-gray-200/60 p-0.5 bg-white shadow-sm">
            <button
              onClick={() => setViewport('desktop')}
              className={`px-2.5 py-1 text-[10px] font-bold rounded-lg transition-all cursor-pointer ${
                viewport === 'desktop' ? 'bg-[#9B2A4C] text-white shadow-sm' : 'bg-white text-gray-500 hover:text-gray-800'
              }`}
            >
              {t('services.showcase.web.desktop')}
            </button>
            <button
              onClick={() => setViewport('mobile')}
              className={`px-2.5 py-1 text-[10px] font-bold rounded-lg transition-all cursor-pointer ${
                viewport === 'mobile' ? 'bg-[#9B2A4C] text-white shadow-sm' : 'bg-white text-gray-500 hover:text-gray-800'
              }`}
            >
              {t('services.showcase.web.mobile')}
            </button>
          </div>

          {/* Theme switch */}
          <div className="flex rounded-xl border border-gray-200/60 p-0.5 bg-white shadow-sm">
            <button
              onClick={() => setTheme('light')}
              className={`px-2.5 py-1 text-[10px] font-bold rounded-lg transition-all cursor-pointer flex items-center gap-1 ${
                theme === 'light' ? 'bg-[#9B2A4C] text-white shadow-sm' : 'bg-white text-gray-500 hover:text-gray-800'
              }`}
            >
              ☀️ {t('services.showcase.web.light')}
            </button>
            <button
              onClick={() => setTheme('dark')}
              className={`px-2.5 py-1 text-[10px] font-bold rounded-lg transition-all cursor-pointer flex items-center gap-1 ${
                theme === 'dark' ? 'bg-slate-900 text-white shadow-sm' : 'bg-white text-gray-500 hover:text-gray-800'
              }`}
            >
              🌙 {t('services.showcase.web.dark')}
            </button>
          </div>
        </div>
      </div>

      <div className="flex justify-center items-center bg-[#F8F6F2] border border-gray-100 rounded-3xl p-6 min-h-[320px] transition-all duration-300">
        <div
          className={`rounded-2xl shadow-lg border overflow-hidden transition-all duration-500 relative flex flex-col ${
            viewport === 'desktop' ? 'w-full max-w-lg h-[600px]' : 'w-64 h-[520px]'
          } ${theme === 'dark' ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white text-slate-800'}`}
        >
          {/* Header */}
          <div className={`p-4 border-b flex justify-between items-center shrink-0 transition-colors duration-300 ${
            theme === 'dark' ? 'border-slate-800 bg-slate-900/80 backdrop-blur-md' : 'border-gray-100 bg-white/80 backdrop-blur-md'
          }`}>
            <span className="text-xs font-black tracking-wider bg-gradient-to-r from-[#9B2A4C] to-[#2C3E50] bg-clip-text text-transparent">
              COSMETICS CO.
            </span>
            <div className="flex items-center gap-3">
              <div className="flex gap-2.5 text-[8px] font-bold text-gray-400">
                <span 
                  onClick={() => setCurrentTab('home')}
                  className={`transition-colors cursor-pointer ${currentTab === 'home' ? 'text-[#9B2A4C]' : 'hover:text-[#9B2A4C]'}`}
                >
                  Home
                </span>
                <span 
                  onClick={() => setCurrentTab('shop')}
                  className={`transition-colors cursor-pointer ${currentTab === 'shop' ? 'text-[#9B2A4C]' : 'hover:text-[#9B2A4C]'}`}
                >
                  Shop
                </span>
                <span 
                  onClick={() => setCurrentTab('blog')}
                  className={`transition-colors cursor-pointer ${currentTab === 'blog' ? 'text-[#9B2A4C]' : 'hover:text-[#9B2A4C]'}`}
                >
                  Blog
                </span>
              </div>
              <div className="w-px h-2.5 bg-gray-200/50" />
              <div 
                onClick={() => setIsCartOpen(true)}
                className="relative cursor-pointer text-gray-400 hover:text-[#9B2A4C] transition-colors"
              >
                <i className="ri-shopping-bag-3-line text-xs" />
                {cart.length > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-[#9B2A4C] text-white text-[6px] font-extrabold w-3 h-3 rounded-full flex items-center justify-center animate-pulse">
                    {cart.reduce((sum, item) => sum + item.quantity, 0)}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Scrollable Content Container */}
          <div 
            className="flex-grow overflow-y-auto pb-6 transition-all duration-300"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {/* HOME VIEW */}
            {currentTab === 'home' && (
              <div className="animate-fadeIn space-y-6">
                {/* Home Hero */}
                <div className="relative p-8 text-center space-y-4 overflow-hidden border-b dark:border-slate-800 border-gray-100 bg-gradient-to-b from-[#9B2A4C]/5 to-transparent">
                  <div className="absolute -top-12 -left-12 w-28 h-28 bg-[#9B2A4C]/10 rounded-full blur-xl pointer-events-none" />
                  <div className="absolute -bottom-10 -right-10 w-28 h-28 bg-[#A8B5A0]/20 rounded-full blur-xl pointer-events-none" />
                  
                  <span className="text-[7px] uppercase font-extrabold tracking-widest text-[#9B2A4C] bg-[#9B2A4C]/5 border border-[#9B2A4C]/15 px-2.5 py-0.5 rounded-full">
                    Welcome to Cosmetics Co.
                  </span>
                  
                  <h4 className="text-lg md:text-xl font-black leading-tight bg-gradient-to-r from-[#9B2A4C] to-[#2C3E50] dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
                    Chăm Sóc Làn Da<br />Theo Cách Khoa Học
                  </h4>
                  
                  <p className="text-[9px] text-gray-400 max-w-xs mx-auto leading-relaxed">
                    Khám phá dòng sản phẩm tinh chất thuần chay, kiểm nghiệm lâm sàng mang lại làn da sáng khỏe tự nhiên.
                  </p>
                  
                  <button 
                    onClick={() => setCurrentTab('shop')}
                    className="bg-gradient-to-r from-[#9B2A4C] to-[#b83f60] text-white text-[9px] font-extrabold px-6 py-2.5 rounded-full shadow-lg shadow-[#9B2A4C]/25 hover:opacity-95 transition-all flex items-center gap-1.5 mx-auto cursor-pointer"
                  >
                    Mua Ngay Cửa Hàng
                    <i className="ri-arrow-right-line text-[9px]" />
                  </button>
                </div>

                {/* Features list */}
                <div className="px-6 space-y-3">
                  <h5 className="text-[9px] font-extrabold text-gray-400 uppercase tracking-wider text-center">Cam Kết Cốt Lõi</h5>
                  <div className="grid grid-cols-3 gap-3">
                    <div className="p-2.5 rounded-xl border dark:border-slate-800 border-gray-100 text-center space-y-1 bg-white/50 dark:bg-slate-800/20">
                      <i className="ri-leaf-line text-[#9B2A4C] text-sm" />
                      <p className="text-[8px] font-black leading-none">100% Thuần Chay</p>
                      <p className="text-[6px] text-gray-400">Hữu cơ lành tính</p>
                    </div>
                    <div className="p-2.5 rounded-xl border dark:border-slate-800 border-gray-100 text-center space-y-1 bg-white/50 dark:bg-slate-800/20">
                      <i className="ri-test-tube-line text-[#9B2A4C] text-sm" />
                      <p className="text-[8px] font-black leading-none">Y Khoa Kiểm Định</p>
                      <p className="text-[6px] text-gray-400">Hiệu quả rõ rệt</p>
                    </div>
                    <div className="p-2.5 rounded-xl border dark:border-slate-800 border-gray-100 text-center space-y-1 bg-white/50 dark:bg-slate-800/20">
                      <i className="ri-heart-line text-[#9B2A4C] text-sm" />
                      <p className="text-[8px] font-black leading-none">Cruelty-Free</p>
                      <p className="text-[6px] text-gray-400">Bảo vệ động vật</p>
                    </div>
                  </div>
                </div>

                {/* Testimonial */}
                <div className="px-6 pb-4">
                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 text-center space-y-2 border dark:border-slate-800/50 border-gray-100/50">
                    <p className="text-[9px] italic text-gray-500 dark:text-gray-400">
                      "Da mình giảm thâm mụn và căng mướt rõ rệt chỉ sau 2 tuần dùng Retinol & Hyaluronic Acid ở đây. Rất đáng tiền!"
                    </p>
                    <div className="flex items-center justify-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                      <span className="text-[8px] font-bold text-gray-400">Lan Anh (Hà Nội) - Khách hàng Verified</span>
                    </div>
                  </div>
                </div>

                {/* Newsletter signup inside mockup */}
                <div className="px-6 pb-4">
                  <div className="p-4 rounded-2xl border border-[#9B2A4C]/10 bg-[#9B2A4C]/5 text-center space-y-2">
                    <p className="text-[8px] uppercase tracking-wider font-extrabold text-[#9B2A4C]">Newsletter</p>
                    <p className="text-[9px] font-bold text-slate-700 dark:text-slate-200">Đăng ký nhận ưu đãi 10%</p>
                    <div className="flex gap-1.5 max-w-[220px] mx-auto">
                      <input 
                        type="email" 
                        placeholder="Email của bạn..." 
                        className="flex-grow px-2 py-1 text-[7px] rounded-lg border dark:border-slate-800 border-gray-100 bg-white dark:bg-slate-900 focus:outline-none text-slate-800 dark:text-white"
                      />
                      <button className="px-3 py-1 bg-[#9B2A4C] text-white text-[7px] font-black rounded-lg hover:opacity-90 cursor-pointer">
                        Đăng ký
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* SHOP VIEW */}
            {currentTab === 'shop' && (
              <div className="animate-fadeIn space-y-4">
                {/* Hero Section */}
                <div className="relative p-6 text-center space-y-3 overflow-hidden">
                  {/* Ambient glows */}
                  <div className="absolute -top-12 -left-12 w-24 h-24 bg-[#9B2A4C]/10 rounded-full blur-xl pointer-events-none" />
                  <div className="absolute -bottom-10 -right-10 w-24 h-24 bg-[#A8B5A0]/20 rounded-full blur-xl pointer-events-none" />
                  
                  {/* Premium organic badge */}
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border border-[#9B2A4C]/15 bg-[#9B2A4C]/5 text-[#9B2A4C] text-[7px] font-extrabold uppercase tracking-widest">
                    <i className="ri-leaf-line text-[8px]" />
                    100% Organic & Vegan
                  </div>

                  <h4 className="text-md font-black leading-tight bg-gradient-to-r from-[#9B2A4C] to-[#2C3E50] dark:from-white dark:to-slate-300 bg-clip-text text-transparent px-2">
                    {t('services.showcase.web.tagline')}
                  </h4>
                  <p className="text-[9px] text-gray-400 max-w-xs mx-auto leading-relaxed">
                    {t('services.showcase.web.desc')}
                  </p>
                  <button 
                    onClick={() => addToCart(MOCK_PRODUCTS[0])}
                    className="bg-gradient-to-r from-[#9B2A4C] to-[#b83f60] text-white text-[9px] font-extrabold px-5 py-2.5 rounded-full shadow-lg shadow-[#9B2A4C]/25 hover:shadow-xl hover:opacity-95 transition-all flex items-center gap-1.5 mx-auto cursor-pointer"
                  >
                    <i className="ri-shopping-cart-2-line text-[9px]" />
                    {t('services.showcase.web.cta')}
                  </button>
                </div>

                {/* Mock Product */}
                <div className="p-4 grid grid-cols-2 gap-4">
                  {MOCK_PRODUCTS.map((prod) => (
                    <div 
                      key={prod.id}
                      className={`group p-3 rounded-2xl border transition-all duration-300 relative flex flex-col justify-between cursor-pointer ${
                        theme === 'dark' 
                          ? 'bg-slate-800/40 border-slate-700/60 hover:bg-slate-800/60 hover:border-[#9B2A4C]/45' 
                          : 'bg-slate-50/60 border-gray-100 hover:bg-white hover:border-[#9B2A4C]/35 hover:shadow-md'
                      }`}
                      onClick={() => setSelectedProduct(prod)}
                    >
                      {/* Product Badge */}
                      <span className={`absolute top-2 left-2 z-10 text-[6px] font-bold text-white px-1 py-0.5 rounded uppercase ${prod.badgeBg}`}>
                        {prod.badge}
                      </span>
                      
                      {/* Product Image Area */}
                      <div className="aspect-square bg-gradient-to-tr from-[#9B2A4C]/10 to-[#A8B5A0]/20 rounded-xl mb-3 flex flex-col items-center justify-center relative overflow-hidden group-hover:scale-[1.02] transition-transform duration-300">
                        <div className="absolute w-12 h-12 rounded-full bg-white/20 blur-md" />
                        <div className="w-6 h-12 relative flex flex-col items-center z-10 filter drop-shadow-md">
                          {/* Cap */}
                          <div className="w-2 h-2 bg-gradient-to-r from-gray-700 to-gray-500 rounded-t-sm" />
                          {/* Dropper neck */}
                          <div className="w-1 h-1 bg-gray-400" />
                          {/* Bottle body */}
                          <div className="w-5 h-8 bg-gradient-to-b from-[#9B2A4C] to-[#5A1C30]/90 rounded-b-md rounded-t-sm relative" style={{ backgroundColor: prod.color }}>
                            <div className="absolute bottom-1 left-0.5 right-0.5 h-4 bg-white/10 rounded-b-sm" />
                          </div>
                        </div>
                      </div>
                      
                      {/* Product Info */}
                      <div className="space-y-1">
                        {/* Ratings */}
                        <div className="flex items-center gap-0.5 text-yellow-500 text-[6px]">
                          <i className="ri-star-fill" />
                          <i className="ri-star-fill" />
                          <i className="ri-star-fill" />
                          <i className="ri-star-fill" />
                          <i className="ri-star-fill" />
                          <span className="text-[6px] text-gray-400 font-semibold ml-1">{prod.rating}</span>
                        </div>
                        <p className="text-[9px] font-extrabold truncate">{prod.name}</p>
                        <div className="flex justify-between items-center">
                          <p className="text-[9px] text-[#9B2A4C] font-black">${prod.price.toFixed(2)}</p>
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              addToCart(prod);
                            }}
                            className="w-4 h-4 rounded-full bg-[#9B2A4C] text-white flex items-center justify-center hover:bg-slate-800 transition-colors shadow-sm cursor-pointer"
                          >
                            <i className="ri-add-line text-[8px] font-bold" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Shipping & Support Banner */}
                <div className="px-4 pb-4 grid grid-cols-2 gap-3">
                  <div className="p-2 rounded-xl bg-gray-50/60 dark:bg-slate-800/30 border border-gray-100/50 dark:border-slate-800/40 flex items-center gap-2">
                    <i className="ri-truck-line text-[#9B2A4C] text-xs" />
                    <div>
                      <p className="text-[7px] font-black text-slate-700 dark:text-slate-200">Miễn Phí Ship</p>
                      <p className="text-[5px] text-gray-400">Đơn từ $50</p>
                    </div>
                  </div>
                  <div className="p-2 rounded-xl bg-gray-50/60 dark:bg-slate-800/30 border border-gray-100/50 dark:border-slate-800/40 flex items-center gap-2">
                    <i className="ri-customer-service-2-line text-[#9B2A4C] text-xs" />
                    <div>
                      <p className="text-[7px] font-black text-slate-700 dark:text-slate-200">Hỗ Trợ 24/7</p>
                      <p className="text-[5px] text-gray-400">Tư vấn miễn phí</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* BLOG VIEW */}
            {currentTab === 'blog' && (
              <div className="animate-fadeIn p-4 space-y-4">
                <div className="text-center pb-2 border-b dark:border-slate-800 border-gray-100">
                  <h4 className="text-xs font-black tracking-wider uppercase text-[#9B2A4C]">Cẩm Nang Làm Đẹp</h4>
                  <p className="text-[8px] text-gray-400">Chia sẻ bí quyết skincare khoa học & lành tính</p>
                </div>

                {/* Blog list */}
                <div className="space-y-3">
                  {MOCK_BLOGS.map((blog) => (
                    <div 
                      key={blog.id} 
                      onClick={() => setSelectedBlog(blog)}
                      className="p-3 rounded-xl border dark:border-slate-800 border-gray-100 bg-white/50 dark:bg-slate-800/30 hover:shadow-sm cursor-pointer transition-all duration-300 space-y-1.5 flex flex-col justify-between"
                    >
                      <div className="flex justify-between items-center text-[7px] font-extrabold">
                        <span className="text-[#9B2A4C] bg-[#9B2A4C]/5 px-1.5 py-0.5 rounded uppercase">{blog.category}</span>
                        <span className="text-gray-400">{blog.readTime}</span>
                      </div>
                      <h5 className="text-[10px] font-extrabold text-slate-800 dark:text-slate-100 leading-snug">{blog.title}</h5>
                      <p className="text-[8px] text-gray-400 line-clamp-2 leading-relaxed">{blog.excerpt}</p>
                      <span className="text-[7px] text-[#9B2A4C] font-extrabold flex items-center gap-0.5">
                        Đọc tiếp <i className="ri-arrow-right-line text-[7px]" />
                      </span>
                    </div>
                  ))}
                </div>

                {/* Blog Categories tags */}
                <div className="px-4 pt-2">
                  <p className="text-[7px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-1.5">Chủ đề quan tâm</p>
                  <div className="flex flex-wrap gap-1">
                    {['#ChămDaMụn', '#TrẻHóa', '#ThuầnChay', '#CấpẨm'].map(tag => (
                      <span key={tag} className="text-[6px] font-bold px-2 py-0.5 rounded-full bg-gray-100 dark:bg-slate-800 text-gray-500 dark:text-gray-400">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Mock Footer inside mockup */}
            <div className="mt-8 border-t dark:border-slate-800 border-gray-100 pt-5 px-6 pb-2 text-center space-y-3">
              <p className="text-[8px] font-black tracking-wider uppercase bg-gradient-to-r from-[#9B2A4C] to-[#2C3E50] dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
                COSMETICS CO.
              </p>
              <p className="text-[6px] text-gray-400 dark:text-slate-500 max-w-[220px] mx-auto leading-relaxed">
                © 2026 Cosmetics Co. Thương hiệu mỹ phẩm hữu cơ & thuần chay cao cấp.
              </p>
              <div className="flex justify-center gap-3 text-gray-400 dark:text-slate-500 text-[8px]">
                <i className="ri-facebook-fill hover:text-[#9B2A4C] cursor-pointer" />
                <i className="ri-instagram-line hover:text-[#9B2A4C] cursor-pointer" />
                <i className="ri-twitter-fill hover:text-[#9B2A4C] cursor-pointer" />
              </div>
            </div>
          </div>

          {/* Cart Drawer Overlay */}
          {isCartOpen && (
            <div className={`absolute inset-y-0 right-0 w-full sm:w-72 shadow-2xl z-40 flex flex-col justify-between p-4 transition-all duration-300 border-l ${
              theme === 'dark' ? 'bg-slate-900/95 text-white border-slate-800' : 'bg-white/95 text-slate-800 border-gray-100'
            }`}>
              <div className="space-y-4">
                <div className="flex justify-between items-center border-b pb-2 dark:border-slate-800 border-gray-100">
                  <h5 className="text-xs font-black tracking-wider flex items-center gap-1.5">
                    <i className="ri-shopping-bag-3-line text-[#9B2A4C]" />
                    GIỎ HÀNG ({cart.reduce((sum, item) => sum + item.quantity, 0)})
                  </h5>
                  <button 
                    onClick={() => setIsCartOpen(false)}
                    className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                  >
                    <i className="ri-close-line text-sm" />
                  </button>
                </div>
                
                {cart.length === 0 ? (
                  <div className="text-center py-10 space-y-2">
                    <i className="ri-shopping-basket-line text-2xl text-gray-300 block" />
                    <p className="text-[10px] text-gray-400 font-semibold">Giỏ hàng đang trống</p>
                  </div>
                ) : (
                  <div className="space-y-3 max-h-[180px] overflow-y-auto pr-1">
                    {cart.map(item => (
                      <div key={item.id} className="flex justify-between items-center text-[10px] gap-2 p-2 rounded-xl bg-gray-50/50 dark:bg-slate-800/40 border dark:border-slate-800 border-gray-100">
                        <div className="flex items-center gap-2">
                          <div className="w-5 h-8 rounded bg-gradient-to-b from-gray-100 to-gray-200 flex items-center justify-center shrink-0">
                            <div className="w-1.5 h-4 rounded-sm" style={{ backgroundColor: item.imageColor }} />
                          </div>
                          <div>
                            <p className="font-extrabold truncate w-24">{item.name}</p>
                            <p className="text-[8px] text-[#9B2A4C] font-black">${item.price.toFixed(2)}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-1">
                          <button 
                            onClick={() => updateQuantity(item.id, -1)}
                            className="w-4 h-4 rounded bg-gray-200 dark:bg-slate-700 flex items-center justify-center font-bold hover:opacity-80"
                          >
                            -
                          </button>
                          <span className="w-4 text-center font-bold text-[9px]">{item.quantity}</span>
                          <button 
                            onClick={() => updateQuantity(item.id, 1)}
                            className="w-4 h-4 rounded bg-gray-200 dark:bg-slate-700 flex items-center justify-center font-bold hover:opacity-80"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {cart.length > 0 && (
                <div className="border-t dark:border-slate-800 border-gray-100 pt-3 mt-2 space-y-2">
                  <div className="flex justify-between items-center text-[10px] font-bold">
                    <span>TỔNG CỘNG:</span>
                    <span className="text-[#9B2A4C] font-black text-xs">
                      ${cart.reduce((sum, item) => sum + (item.price * item.quantity), 0).toFixed(2)}
                    </span>
                  </div>
                  <button 
                    onClick={handleCheckout}
                    className="w-full py-2 bg-gradient-to-r from-[#9B2A4C] to-[#b83f60] text-white text-[9px] font-extrabold rounded-xl shadow hover:opacity-95 transition-opacity flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <i className="ri-shield-check-line" />
                    Thanh Toán Ngay
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Product Detail Modal */}
          {selectedProduct && (
            <div className={`absolute inset-0 z-50 flex flex-col justify-between p-5 transition-all duration-300 ${
              theme === 'dark' ? 'bg-slate-900 text-white' : 'bg-white text-slate-800'
            }`}>
              <div className="space-y-4">
                <div className="flex justify-between items-center border-b dark:border-slate-800 border-gray-100 pb-2">
                  <span className="text-[7px] uppercase font-extrabold text-[#9B2A4C] bg-[#9B2A4C]/5 px-2 py-0.5 rounded border border-[#9B2A4C]/15">
                    Chi tiết sản phẩm
                  </span>
                  <button 
                    onClick={() => setSelectedProduct(null)}
                    className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                  >
                    <i className="ri-close-line text-sm" />
                  </button>
                </div>

                <div className="grid grid-cols-5 gap-3 items-center">
                  <div className="col-span-2 aspect-[3/4] bg-gradient-to-tr from-[#9B2A4C]/10 to-[#A8B5A0]/20 rounded-xl flex items-center justify-center">
                    <div className="w-8 h-16 relative flex flex-col items-center filter drop-shadow-md">
                      <div className="w-2.5 h-2.5 bg-gradient-to-r from-gray-700 to-gray-500 rounded-t-sm" />
                      <div className="w-1.5 h-1 bg-gray-400" />
                      <div className="w-6 h-11 rounded-b-md rounded-t-xs relative animate-pulse" style={{ backgroundColor: selectedProduct.color }}>
                        <div className="absolute bottom-1 left-0.5 right-0.5 h-5 bg-white/10 rounded-b-sm" />
                      </div>
                    </div>
                  </div>
                  
                  <div className="col-span-3 space-y-1">
                    <h5 className="text-xs font-black">{selectedProduct.name}</h5>
                    <p className="text-[10px] text-[#9B2A4C] font-black">${selectedProduct.price.toFixed(2)}</p>
                    <div className="flex items-center gap-0.5 text-yellow-500 text-[6px]">
                      <i className="ri-star-fill" />
                      <i className="ri-star-fill" />
                      <i className="ri-star-fill" />
                      <i className="ri-star-fill" />
                      <i className="ri-star-fill" />
                      <span className="text-gray-400 font-semibold ml-1">({selectedProduct.reviews} reviews)</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-1">
                  <p className="text-[8px] text-gray-400 uppercase font-bold tracking-wider">Mô tả sản phẩm</p>
                  <p className="text-[9px] leading-relaxed text-gray-500 dark:text-gray-400">{selectedProduct.desc}</p>
                </div>

                <div className="space-y-1">
                  <p className="text-[8px] text-gray-400 uppercase font-bold tracking-wider">Thành phần chính</p>
                  <div className="flex flex-wrap gap-1">
                    {selectedProduct.ingredients.map((ing: string) => (
                      <span key={ing} className="text-[7px] font-bold px-1.5 py-0.5 bg-gray-100 dark:bg-slate-800 rounded">
                        {ing}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <button 
                onClick={() => {
                  addToCart(selectedProduct);
                  setSelectedProduct(null);
                }}
                className="w-full py-2 bg-gradient-to-r from-[#9B2A4C] to-[#b83f60] text-white text-[9px] font-extrabold rounded-xl shadow flex items-center justify-center gap-1.5 cursor-pointer mt-3"
              >
                <i className="ri-shopping-cart-2-line" />
                Thêm vào giỏ hàng
              </button>
            </div>
          )}

          {/* Blog Detail Modal */}
          {selectedBlog && (
            <div className={`absolute inset-0 z-50 flex flex-col justify-between p-5 transition-all duration-300 overflow-y-auto ${
              theme === 'dark' ? 'bg-slate-900 text-white' : 'bg-white text-slate-800'
            }`}>
              <div className="space-y-4">
                <div className="flex justify-between items-center border-b dark:border-slate-800 border-gray-100 pb-2">
                  <span className="text-[7px] uppercase font-extrabold text-[#9B2A4C] bg-[#9B2A4C]/5 px-2 py-0.5 rounded border border-[#9B2A4C]/15">
                    Bài viết cẩm nang
                  </span>
                  <button 
                    onClick={() => setSelectedBlog(null)}
                    className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                  >
                    <i className="ri-close-line text-sm" />
                  </button>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-[7px] text-gray-400">
                    <span className="text-[#9B2A4C] font-extrabold uppercase">{selectedBlog.category}</span>
                    <span>•</span>
                    <span>{selectedBlog.readTime}</span>
                  </div>
                  <h4 className="text-xs font-black leading-snug">{selectedBlog.title}</h4>
                </div>

                <div className="w-full h-24 rounded-xl bg-gradient-to-br from-[#9B2A4C]/10 to-[#A8B5A0]/20 flex items-center justify-center relative overflow-hidden">
                  <i className="ri-article-line text-3xl text-[#9B2A4C]/60" />
                </div>

                <div className="text-[9px] leading-relaxed text-gray-500 dark:text-gray-400 whitespace-pre-line space-y-2">
                  {selectedBlog.content}
                </div>
              </div>

              <button 
                onClick={() => setSelectedBlog(null)}
                className="w-full py-2 border border-[#9B2A4C]/30 text-[#9B2A4C] dark:text-white dark:border-slate-700 text-[9px] font-extrabold rounded-xl hover:bg-[#9B2A4C]/5 transition-all cursor-pointer mt-4 shrink-0"
              >
                Quay lại danh sách
              </button>
            </div>
          )}

          {/* Checkout Success Screen */}
          {checkoutSuccess && (
            <div className={`absolute inset-0 z-50 flex flex-col items-center justify-center p-6 text-center transition-all duration-300 ${
              theme === 'dark' ? 'bg-slate-950/95 text-white' : 'bg-white/95 text-slate-800'
            }`}>
              <div className="w-12 h-12 rounded-full bg-green-500/10 text-green-500 flex items-center justify-center mb-3 animate-bounce">
                <i className="ri-checkbox-circle-fill text-3xl" />
              </div>
              <h5 className="text-sm font-black tracking-wide uppercase text-green-500">Đặt hàng thành công!</h5>
              <p className="text-[10px] text-gray-400 max-w-[200px] mt-1.5 leading-relaxed">
                Cảm ơn bạn đã trải nghiệm mua sắm! Đơn hàng của bạn đã được tiếp nhận và xử lý thành công trên hệ thống.
              </p>
              <button 
                onClick={() => {
                  setCheckoutSuccess(false);
                  setCart([]);
                }}
                className="mt-4 px-5 py-2 bg-[#9B2A4C] text-white text-[8px] font-extrabold rounded-full hover:opacity-90 transition-opacity cursor-pointer shadow-md shadow-[#9B2A4C]/25"
              >
                Quay lại cửa hàng
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// 2. Chatbot Showcase: Interactive typing bot
export function ChatbotShowcase() {
  const { t, i18n } = useTranslation();
  const [messages, setMessages] = useState<Array<{ sender: 'user' | 'bot'; text: string }>>([]);
  const [typing, setTyping] = useState(false);
  const [inputText, setInputText] = useState('');
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMessages([
      { sender: 'bot', text: t('services.showcase.chatbot.welcome') }
    ]);
  }, [i18n.language, t]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, typing]);

  const handleSend = (text: string) => {
    if (!text.trim()) return;
    setMessages((prev) => [...prev, { sender: 'user', text }]);
    setInputText('');
    setTyping(true);

    // AI smart response matching logic
    const lower = text.toLowerCase();
    let reply = 'Cảm ơn bạn! Yêu cầu của bạn đã được chuyển tới Alvin. Bạn có muốn đặt lịch hẹn tư vấn chi tiết hơn không?';
    if (lower.includes('giá') || lower.includes('chi phí') || lower.includes('bao nhiêu') || lower.includes('price') || lower.includes('cost')) {
      reply = t('services.showcase.chatbot.a1');
    } else if (lower.includes('whatsapp') || lower.includes('zalo') || lower.includes('kênh') || lower.includes('channel') || lower.includes('messenger')) {
      reply = t('services.showcase.chatbot.a2');
    } else if (lower.includes('lịch') || lower.includes('tư vấn') || lower.includes('gặp') || lower.includes('book') || lower.includes('meet') || lower.includes('hẹn')) {
      reply = t('services.showcase.chatbot.a3');
    }

    setTimeout(() => {
      setMessages((prev) => [...prev, { sender: 'bot', text: reply }]);
      setTyping(false);
    }, 1000);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center bg-gray-50 p-3 rounded-2xl border border-gray-100">
        <span className="text-xs font-bold text-[#2C3E50]">{t('services.showcase.chatbot.title')}</span>
        <span className="text-[9px] font-bold text-gray-400">{t('services.showcase.chatbot.status')}</span>
      </div>

      <div className="bg-slate-900 rounded-3xl p-4 border border-slate-800 shadow-2xl flex flex-col h-[380px] justify-between relative overflow-hidden">
        {/* Chat Widget Header */}
        <div className="flex items-center gap-2 pb-3 border-b border-slate-800/80 mb-2 shrink-0">
          <div className="relative">
            <div className="w-8 h-8 rounded-full bg-[#9B2A4C]/25 text-[#9B2A4C] flex items-center justify-center font-bold text-xs border border-[#9B2A4C]/20">
              AI
            </div>
            <span className="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-green-500 border border-slate-900" />
          </div>
          <div className="text-left">
            <h6 className="text-[10px] font-extrabold text-white leading-tight">Alvin Agency AI Agent</h6>
            <p className="text-[7px] text-gray-400">Đang hoạt động trực tuyến</p>
          </div>
        </div>

        {/* Messages Screen */}
        <div 
          className="flex-grow overflow-y-auto space-y-3 p-1"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] rounded-2xl px-3.5 py-2 text-[10px] leading-relaxed text-left ${
                  msg.sender === 'user'
                    ? 'bg-[#9B2A4C] text-white rounded-tr-none'
                    : 'bg-slate-800 text-slate-100 rounded-tl-none'
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}

          {typing && (
            <div className="flex justify-start">
              <div className="bg-slate-800 text-gray-400 rounded-2xl rounded-tl-none px-3.5 py-2 text-[10px] flex gap-1 items-center">
                <span className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce" />
                <span className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce delay-75" />
                <span className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce delay-150" />
              </div>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        {/* Input & Quick Suggestions */}
        <div className="border-t border-slate-800 pt-2.5 mt-2 space-y-2.5 shrink-0">
          {/* Buttons Suggestions */}
          <div className="space-y-1 text-left">
            <p className="text-[8px] font-black text-slate-500 uppercase tracking-wide">{t('services.showcase.chatbot.suggested')}</p>
            <div className="flex flex-wrap gap-1.5">
              <button
                onClick={() => handleSend(t('services.showcase.chatbot.q1'))}
                className="text-[8px] font-bold bg-slate-800/80 hover:bg-slate-800 text-slate-300 hover:text-white px-2.5 py-1 rounded-lg transition-colors cursor-pointer"
              >
                {t('services.showcase.chatbot.q1')}
              </button>
              <button
                onClick={() => handleSend(t('services.showcase.chatbot.q2'))}
                className="text-[8px] font-bold bg-slate-800/80 hover:bg-slate-800 text-slate-300 hover:text-white px-2.5 py-1 rounded-lg transition-colors cursor-pointer"
              >
                {t('services.showcase.chatbot.q2')}
              </button>
              <button
                onClick={() => handleSend(t('services.showcase.chatbot.q3'))}
                className="text-[8px] font-bold bg-slate-800/80 hover:bg-slate-800 text-slate-300 hover:text-white px-2.5 py-1 rounded-lg transition-colors cursor-pointer"
              >
                {t('services.showcase.chatbot.q3')}
              </button>
            </div>
          </div>

          {/* Text Input area */}
          <div className="flex gap-1.5 bg-slate-950/80 p-1 rounded-xl border border-slate-800/80 items-center">
            <input 
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSend(inputText);
              }}
              placeholder="Nhập tin nhắn..."
              className="flex-grow bg-transparent text-[10px] px-2 py-1.5 focus:outline-none text-white placeholder-slate-500"
            />
            <button 
              onClick={() => handleSend(inputText)}
              className="w-7 h-7 rounded-lg bg-[#9B2A4C] hover:opacity-90 transition-opacity text-white flex items-center justify-center cursor-pointer shrink-0"
            >
              <i className="ri-send-plane-2-fill text-xs" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// 3. Landing Page Showcase: A/B Testing comparison slider
// 3. Landing Page Showcase: A/B Testing comparison slider
export function LandingShowcase() {
  const { t } = useTranslation();
  const [sliderPos, setSliderPos] = useState<number>(50);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [containerWidth, setContainerWidth] = useState<number>(500);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      setContainerWidth(containerRef.current.getBoundingClientRect().width);
    }
    const handleResize = () => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.getBoundingClientRect().width);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    setIsDragging(true);
    updatePosition(e.clientX);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    updatePosition(e.clientX);
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    setIsDragging(false);
  };

  const updatePosition = (clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPos(percentage);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center bg-gray-50 p-3 rounded-2xl border border-gray-100">
        <span className="text-xs font-bold text-[#2C3E50]">{t('services.showcase.landing.title')}</span>
        <span className="text-[9px] font-bold text-gray-400">Kéo thanh trượt để so sánh</span>
      </div>

      {/* Swipe Slider Frame */}
      <div 
        ref={containerRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        className="relative rounded-3xl border border-gray-100 shadow-xl overflow-hidden min-h-[350px] cursor-ew-resize select-none bg-slate-900 touch-none"
      >
        {/* RIGHT SIDE: Optimized Design (Alvin Agency - 8.5% CR) */}
        <div className="absolute inset-0 flex flex-col justify-between p-6 bg-slate-900 text-white transition-colors duration-300">
          <div className="flex justify-between items-center z-10">
            <span className="text-[8px] font-extrabold text-green-500 bg-green-500/10 border border-green-500/20 px-2 py-0.5 rounded uppercase">
              {t('services.showcase.landing.convRate')}: 8.5% (+370%)
            </span>
            <span className="text-[8px] text-green-400 font-extrabold uppercase">
              {t('services.showcase.landing.bounceRate')}: 34%
            </span>
          </div>

          <div className="flex-grow flex flex-col justify-center text-center space-y-4 max-w-sm mx-auto z-10 py-6">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border border-[#A8B5A0]/20 bg-[#A8B5A0]/5 text-[#A8B5A0] text-[7px] font-extrabold uppercase tracking-widest mx-auto">
              <i className="ri-leaf-line text-[8px]" />
              {t('services.showcase.landing.optBadge')}
            </div>
            <h5 className="font-extrabold text-sm md:text-md leading-snug bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              {t('services.showcase.landing.optTitle')}
            </h5>
            <p className="text-[9px] text-slate-400 max-w-[240px] mx-auto leading-relaxed">
              {t('services.showcase.landing.optDesc')}
            </p>
            <div className="flex gap-1.5 max-w-xs mx-auto w-full">
              <input
                type="email"
                disabled
                placeholder={t('services.showcase.landing.optPlaceholder')}
                className="bg-slate-900/60 border border-slate-800 text-[8px] px-2.5 py-1.5 rounded-xl w-full text-white placeholder-slate-600 focus:outline-none"
              />
              <button className="bg-gradient-to-r from-[#9B2A4C] to-[#b83f60] text-white text-[8px] font-extrabold px-3 py-1.5 rounded-xl whitespace-nowrap shadow-lg shadow-[#9B2A4C]/25 hover:opacity-95 cursor-pointer shrink-0">
                {t('services.showcase.landing.optBtn')}
              </button>
            </div>
          </div>
          <p className="text-[7px] text-slate-500 font-medium text-center z-10">{t('services.showcase.landing.optDesign')}</p>
        </div>

        {/* LEFT SIDE: Old Design (1.8% CR) - width is clipped by sliderPos */}
        <div 
          className="absolute inset-y-0 left-0 overflow-hidden bg-gray-50 border-r border-slate-300/40 text-slate-800 z-20"
          style={{ width: `${sliderPos}%` }}
        >
          {/* Content width matches containerWidth for perfect offset alignment */}
          <div className="h-full flex flex-col justify-between p-6 shrink-0" style={{ width: containerWidth }}>
            <div className="flex justify-between items-center">
              <span className="text-[8px] font-extrabold text-red-500 bg-red-50 border border-red-200 px-2 py-0.5 rounded uppercase">
                {t('services.showcase.landing.convRate')}: 1.8%
              </span>
              <span className="text-[8px] text-gray-400 font-extrabold uppercase">
                {t('services.showcase.landing.bounceRate')}: 72%
              </span>
            </div>

            <div className="flex-grow flex flex-col justify-center text-center space-y-4 max-w-sm mx-auto py-6">
              <h5 className="font-bold text-gray-600 text-xs">{t('services.showcase.landing.oldTitle')}</h5>
              <p className="text-[9px] text-gray-400 max-w-[240px] mx-auto leading-relaxed">{t('services.showcase.landing.oldDesc')}</p>
              <div className="w-full max-w-[200px] mx-auto py-1.5 bg-white border border-gray-200 text-gray-300 text-[8px] rounded-lg">
                {t('services.showcase.landing.oldPlaceholder')}
              </div>
              <button className="bg-gray-400 text-white text-[8px] font-bold px-4 py-1.5 rounded-lg max-w-[100px] mx-auto">
                {t('services.showcase.landing.oldSubmit')}
              </button>
            </div>
            <p className="text-[7px] text-gray-400 italic text-center">{t('services.showcase.landing.oldDesign')}</p>
          </div>
        </div>

        {/* Vertical Drag Handle */}
        <div 
          className="absolute inset-y-0 z-30 w-1 bg-white cursor-ew-resize flex items-center justify-center shadow-lg pointer-events-none"
          style={{ left: `${sliderPos}%` }}
        >
          <div className="w-6 h-6 rounded-full bg-white border border-gray-200 shadow-md flex items-center justify-center gap-0.5">
            <i className="ri-arrow-left-s-line text-[10px] text-gray-500" />
            <i className="ri-arrow-right-s-line text-[10px] text-gray-500" />
          </div>
        </div>
      </div>
    </div>
  );
}

// 4. Workflow Automation Showcase: Simulation trigger
// 4. Workflow Automation Showcase: Simulation trigger
export function WorkflowShowcase() {
  const { t } = useTranslation();
  const [step, setStep] = useState<number>(0);
  const [running, setRunning] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);
  const logContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (logContainerRef.current) {
      logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
    }
  }, [logs]);

  const addLog = (text: string) => {
    const time = new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    setLogs((prev) => [...prev, `[${time}] ${text}`]);
  };

  const startSimulation = () => {
    if (running) return;
    setRunning(true);
    setStep(1);
    setLogs([]);
    addLog('⚡ Nhận yêu cầu kích hoạt từ cổng webhook...');

    setTimeout(() => {
      setStep(2);
      addLog('💾 Đang kết nối Database... Đã ghi nhận thông tin khách hàng mới.');
      setTimeout(() => {
        setStep(3);
        addLog('💬 Đang gọi API Slack... Đã gửi thông báo leads thành công tới nhóm.');
        setTimeout(() => {
          setStep(4);
          addLog('📊 Đang ghi dữ liệu... Đã cập nhật sổ cái nội bộ Google Sheets (Row 142).');
          setTimeout(() => {
            addLog('✅ Tất cả các tác vụ đã hoàn thành tự động 100%.');
            setRunning(false);
          }, 600);
        }, 1200);
      }, 1200);
    }, 1200);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center bg-gray-50 p-3 rounded-2xl border border-gray-100">
        <span className="text-xs font-bold text-[#2C3E50]">{t('services.showcase.workflow.title')}</span>
        <button
          onClick={startSimulation}
          disabled={running}
          className="px-3.5 py-1.5 bg-[#9B2A4C] text-white text-[10px] font-bold rounded-xl disabled:opacity-50 transition-opacity flex items-center gap-1 cursor-pointer"
        >
          <i className="ri-play-fill" />
          {running ? t('services.showcase.workflow.runningBtn') : t('services.showcase.workflow.runBtn')}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Connection pipeline node graph */}
        <div className="bg-slate-900 rounded-3xl p-5 border border-slate-800 shadow-2xl flex flex-col justify-center space-y-4">
          {/* Webhook step */}
          <div className="flex items-center gap-3">
            <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs transition-all duration-300 ${
              step >= 1 ? 'bg-green-500 text-white shadow-lg shadow-green-500/20 scale-105' : 'bg-slate-800 text-slate-400'
            }`}>
              <i className="ri-webhook-line" />
            </div>
            <div className="text-left">
              <p className="text-[10px] font-bold text-slate-100 leading-tight">{t('services.showcase.workflow.step1Title')}</p>
              <p className="text-[8px] text-gray-400">{t('services.showcase.workflow.step1Desc')}</p>
            </div>
          </div>

          {/* Connection line */}
          <div className="w-0.5 h-4 bg-slate-800 ml-3.5 relative">
            <div className={`absolute top-0 left-0 w-full bg-green-500 transition-all duration-500 ${step >= 2 ? 'h-full' : 'h-0'}`} />
          </div>

          {/* DB processing step */}
          <div className="flex items-center gap-3">
            <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs transition-all duration-300 ${
              step >= 2 ? 'bg-green-500 text-white shadow-lg shadow-green-500/20 scale-105' : 'bg-slate-800 text-slate-400'
            }`}>
              <i className="ri-database-2-line" />
            </div>
            <div className="text-left">
              <p className="text-[10px] font-bold text-slate-100 leading-tight">{t('services.showcase.workflow.step2Title')}</p>
              <p className="text-[8px] text-gray-400">{t('services.showcase.workflow.step2Desc')}</p>
            </div>
          </div>

          {/* Connection line */}
          <div className="w-0.5 h-4 bg-slate-800 ml-3.5 relative">
            <div className={`absolute top-0 left-0 w-full bg-green-500 transition-all duration-500 ${step >= 3 ? 'h-full' : 'h-0'}`} />
          </div>

          {/* Notification Slack step */}
          <div className="flex items-center gap-3">
            <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs transition-all duration-300 ${
              step >= 3 ? 'bg-green-500 text-white shadow-lg shadow-green-500/20 scale-105' : 'bg-slate-800 text-slate-400'
            }`}>
              <i className="ri-slack-line" />
            </div>
            <div className="text-left">
              <p className="text-[10px] font-bold text-slate-100 leading-tight">{t('services.showcase.workflow.step3Title')}</p>
              <p className="text-[8px] text-gray-400">{t('services.showcase.workflow.step3Desc')}</p>
            </div>
          </div>

          {/* Connection line */}
          <div className="w-0.5 h-4 bg-slate-800 ml-3.5 relative">
            <div className={`absolute top-0 left-0 w-full bg-green-500 transition-all duration-500 ${step >= 4 ? 'h-full' : 'h-0'}`} />
          </div>

          {/* Sync Sheet */}
          <div className="flex items-center gap-3">
            <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs transition-all duration-300 ${
              step >= 4 ? 'bg-green-500 text-white shadow-lg shadow-green-500/20 scale-105' : 'bg-slate-800 text-slate-400'
            }`}>
              <i className="ri-file-excel-line" />
            </div>
            <div className="text-left">
              <p className="text-[10px] font-bold text-slate-100 leading-tight">{t('services.showcase.workflow.step4Title')}</p>
              <p className="text-[8px] text-gray-400">{t('services.showcase.workflow.step4Desc')}</p>
            </div>
          </div>
        </div>

        {/* Real-time System Console log monitor */}
        <div className="bg-[#0b0f19] rounded-3xl border border-slate-800 p-4 flex flex-col justify-between h-[280px] md:h-auto">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800 mb-2">
            <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Live Execution Logs</span>
            <div className="flex gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500/30" />
              <span className="w-1.5 h-1.5 rounded-full bg-yellow-500/30" />
              <span className="w-1.5 h-1.5 rounded-full bg-green-500/30" />
            </div>
          </div>
          
          <div 
            ref={logContainerRef}
            className="flex-grow overflow-y-auto space-y-2 text-left font-mono text-[8px] text-emerald-400 leading-relaxed pr-1"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {logs.length === 0 ? (
              <p className="text-slate-600 italic">Sẵn sàng chạy giả lập... Nhấn nút ở trên để bắt đầu n8n automation pipeline.</p>
            ) : (
              logs.map((log, index) => (
                <div key={index} className="animate-fadeIn">{log}</div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// 5. Email Showcase: AI Email Auto-Responder Simulator
export function EmailShowcase() {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<'advice' | 'status' | 'refund'>('advice');
  const [tone, setTone] = useState<'professional' | 'friendly' | 'direct'>('professional');
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [displayedText, setDisplayedText] = useState<string>('');
  const [isReplied, setIsReplied] = useState<Record<string, boolean>>({ advice: false, status: false, refund: false });
  const [sendingTest, setSendingTest] = useState<boolean>(false);
  const [showToast, setShowToast] = useState<boolean>(false);
  const [toastMsg, setToastMsg] = useState<string>('');
  const [typewriterTrigger, setTypewriterTrigger] = useState<number>(0);

  // Core Mock Data
  const INQUIRIES = {
    advice: {
      sender: 'Nguyễn Lan Anh',
      email: 'lananh.nguyen@gmail.com',
      time: '2 phút trước',
      subject: 'Cần tư vấn da mụn dầu nhạy cảm',
      body: 'Chào shop, da em dạo này bị đổ dầu rất nhiều ở vùng chữ T, lỗ chân lông to mà lại nổi thêm nhiều mụn ẩn liti ở trán và má. Cho em hỏi bên mình có dòng serum nào dịu nhẹ, kiềm dầu tốt mà không gây kích ứng cho da nhạy cảm không ạ? Em cảm ơn!',
      intent: 'Tư vấn Routine (Product Advice)',
      confidence: '99.2%',
      hasProductWidget: true,
      replies: {
        professional: `Kính gửi chị Lan Anh,\n\nCảm ơn chị đã liên hệ và chia sẻ tình trạng da với Cosmetics Co. Dựa trên thông tin về tình trạng da dầu mụn vùng chữ T kèm nhạy cảm, AI Agent khuyên dùng routine tối giản chuyên sâu:\n\n1. Serum Hyaluronic Acid 2% + B5: Cấp nước sâu giúp da cân bằng dầu-nước tự nhiên, giảm dầu đáng kể.\n2. Retinol Booster 1%: Kích thích tế bào mới đào thải tế bào chết, đẩy mụn ẩn nhẹ nhàng mà không gây kích ứng.\n\nThông tin chi tiết sản phẩm được đính kèm ở dưới.`,
        friendly: `Hi chị Lan Anh ơi,\n\nCám ơn chị đã nhắn tin cho shop nha! Da đổ dầu vùng chữ T và nổi mụn ẩn nhạy cảm thì shop khuyên chị nên dùng bộ đôi này cực hợp luôn:\n\n1. Serum HA cấp nước: Cấp ẩm cân bằng giúp kiềm dầu siêu tốt.\n2. Retinol Booster: Gom cồi mụn ẩn nhanh mà cực dịu nhẹ cho da nhạy cảm.\n\nShop gửi link sản phẩm ngay bên dưới, chị xem thử nha!`,
        direct: `Chào Lan Anh,\n\nRoutine khuyến nghị cho da dầu mụn ẩn nhạy cảm:\n- Sáng: Dùng Serum HA để cấp nước và kiềm dầu thừa.\n- Tối: Dùng Retinol Booster nồng độ thấp để gom cồi mụn và tái tạo da.\n\nChi tiết sản phẩm xem ở phía dưới.`
      }
    },
    status: {
      sender: 'Trần Hoàng Minh',
      email: 'minh.tran92@gmail.com',
      time: '15 phút trước',
      subject: 'Kiểm tra đơn hàng #8492 chưa giao',
      body: 'Shop ơi kiểm tra gấp giúp mình đơn hàng số #8492 đặt từ hôm kia sao đến giờ vẫn hiển thị trạng thái đang xử lý vậy ạ? Mình đang cần làm quà tặng sinh nhật bạn vào tối mai nên mong shop hỗ trợ giao nhanh nhé.',
      intent: 'Tra cứu vận đơn (Order Tracking)',
      confidence: '98.5%',
      hasTrackingWidget: true,
      replies: {
        professional: `Kính gửi anh Hoàng Minh,\n\nLiên quan đến đơn hàng #8492, AI Agent đã kiểm tra trên cổng vận chuyển nhanh. Đơn hàng của anh đã được bàn giao cho bên giao vận GHTK sáng nay.\n\n- Mã vận đơn: GHTK8492019A\n- Trạng thái: Đang trên xe giao hàng\n- Dự kiến nhận: Trước 17:00 chiều nay\n\nChúng tôi đã gửi yêu cầu ưu tiên bưu tá giao sớm. Cảm ơn anh.`,
        friendly: `Dạ chào anh Hoàng Minh,\n\nShop check đơn hàng #8492 của anh rồi nhé! Đơn hàng của mình đã được shipper GHTK mang đi giao từ sáng nay rồi ạ. Anh yên tâm chắc chắn sẽ nhận được trước 17:00 chiều nay để kịp làm quà sinh nhật nhé!\n\n- Mã vận đơn: GHTK8492019A\n\nChúc bạn của anh đón sinh nhật thật vui nha!`,
        direct: `Chào Hoàng Minh,\n\nĐơn hàng #8492 của bạn đã được bàn giao sáng nay:\n- Đơn vị vận chuyển: GHTK\n- Mã vận đơn: GHTK8492019A\n- Thời gian dự kiến: Trước 17:00 chiều nay.\n\nYên tâm nhận trước sinh nhật tối mai.`
      }
    },
    refund: {
      sender: 'Lê Khánh Vy',
      email: 'vy.le.khanh@hotmail.com',
      time: '1 giờ trước',
      subject: 'Lọ serum bị vỡ nắp nhựa khi giao',
      body: 'Mình vừa nhận hàng hôm nay mã vận đơn #GH6394, khi mở hộp ra thấy lọ serum Retinol bị nứt vỡ nắp nhựa do va đập lúc vận chuyển, tinh chất bị rò ra ngoài hộp giấy một ít. Shop xem hỗ trợ đổi lọ mới giúp mình nhé.',
      intent: 'Lỗi vận chuyển / Đổi trả (Damage Refund)',
      confidence: '97.8%',
      hasRefundWidget: true,
      replies: {
        professional: `Kính gửi chị Khánh Vy,\n\nCosmetics Co. rất tiếc về sự cố hư hỏng nắp sản phẩm do tác động vận chuyển. Chúng tôi xin lỗi vì trải nghiệm không mong muốn này.\n\nChúng tôi đã lập tức kích hoạt đơn hàng đổi mới 1-1 miễn phí tận nhà cho chị:\n- Mã yêu cầu: #RT-9948\n- Giải pháp: Giao lọ mới nguyên vẹn và thu hồi lọ vỡ.\n- Chi phí: 0đ (Miễn phí 100%)\n\nHàng mới sẽ được gửi đi vào sáng mai. Cảm ơn chị.`,
        friendly: `Vy ơi shop rất xin lỗi mình nha,\n\nBên vận chuyển làm vỡ nắp lọ Retinol của mình mất rồi. Vy đừng lo lắng nhé, shop đã chuẩn bị gửi bù ngay 1 lọ mới hoàn toàn miễn phí 100% đến nhà cho mình nè!\n\n- Mã yêu cầu đổi hàng: #RT-9948\n- Bạn shipper sẽ mang lọ mới qua đổi lấy lọ vỡ, Vy không tốn thêm đồng nào hết nha.\n\nSáng mai shop gửi đi luôn nè. Vy thông cảm giúp shop nhé!`,
        direct: `Chào Khánh Vy,\n\nTiếp nhận sự cố vỡ nắp vận đơn #GH6394. Tiến hành đổi mới miễn phí:\n- Mã yêu cầu đổi trả: #RT-9948\n- Phương thức: Shipper giao lọ mới và thu hồi lọ lỗi tại nhà.\n- Phí vận chuyển: 0đ.\n\nHàng mới sẽ được đóng gói gửi đi vào sáng mai.`
      }
    }
  };

  const currentInquiry = INQUIRIES[activeTab];

  // Trigger Intent Analysis animation on tab change
  useEffect(() => {
    setIsAnalyzing(true);
    setIsGenerating(false);
    setDisplayedText('');

    const timer = setTimeout(() => {
      setIsAnalyzing(false);
    }, 900);

    return () => {
      clearTimeout(timer);
    };
  }, [activeTab]);

  // Trigger Typewriter draft generation when analyzing finishes, tab, or tone changes
  useEffect(() => {
    if (isAnalyzing || isReplied[activeTab]) {
      setIsGenerating(false);
      return;
    }

    const targetReply = INQUIRIES[activeTab].replies[tone];
    setDisplayedText('');
    setIsGenerating(true);

    const timer = setInterval(() => {
      setDisplayedText((prev) => {
        if (prev.length < targetReply.length) {
          return targetReply.substring(0, prev.length + 1);
        } else {
          clearInterval(timer);
          setIsGenerating(false);
          return prev;
        }
      });
    }, 12); // Speed of typewriter

    return () => {
      clearInterval(timer);
    };
  }, [activeTab, tone, isAnalyzing, isReplied[activeTab], typewriterTrigger]);

  // Trigger Typewriter draft generation when tone changes
  const handleToneChange = (newTone: 'professional' | 'friendly' | 'direct') => {
    setTone(newTone);
  };

  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (isGenerating || isAnalyzing) return;
    
    setSendingTest(true);
    setTimeout(() => {
      setSendingTest(false);
      setIsReplied((prev) => ({ ...prev, [activeTab]: true }));
      setToastMsg(`Đã gửi phản hồi tự động tới ${currentInquiry.sender}! Tiết kiệm 12 phút soạn thảo.`);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 4000);
    }, 1200);
  };

  const handleResetTicket = (tabKey: 'advice' | 'status' | 'refund') => {
    setIsReplied((prev) => ({ ...prev, [tabKey]: false }));
  };

  return (
    <div className="space-y-4">
      {/* Simulation Bar Header */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center bg-gray-50 p-3 rounded-2xl border border-gray-100 gap-3">
        <span className="text-xs font-bold text-[#2C3E50] flex items-center gap-1.5">
          <i className="ri-robot-line text-[#9B2A4C]" />
          Giả lập Trợ Lý AI Auto-Responder Email
        </span>
        <span className="text-[9px] font-bold text-gray-400">Tự động nhận diện ý định & Soạn thư trả lời</span>
      </div>

      {/* Simulator Workspace Card - Stacked Layout */}
      <div className="bg-white rounded-3xl border border-gray-200/80 shadow-xl p-4 md:p-5 space-y-4 relative min-h-[460px] overflow-hidden flex flex-col justify-between">
        
        {/* SUCCESS TOAST MESSAGE */}
        {showToast && (
          <div className="absolute top-4 right-4 z-50 bg-slate-900 border border-slate-800 text-white rounded-2xl py-3 px-4 shadow-2xl flex items-center gap-3 animate-slideIn">
            <div className="w-8 h-8 rounded-full bg-green-500/10 text-green-400 flex items-center justify-center shrink-0">
              <i className="ri-checkbox-circle-fill text-lg" />
            </div>
            <div className="text-left">
              <p className="text-[10px] font-bold text-white">SMTP Auto-Reply Sent!</p>
              <p className="text-[8px] text-gray-400">{toastMsg}</p>
            </div>
          </div>
        )}

        {/* 1. TICKET SELECTION TABS ROW */}
        <div className="flex flex-wrap gap-2 pb-3 border-b border-gray-100">
          {[
            { id: 'advice', label: 'Tư vấn Skincare', sender: 'N. Lan Anh', icon: 'ri-customer-service-2-line' },
            { id: 'status', label: 'Tra cứu Đơn hàng', sender: 'T. Hoàng Minh', icon: 'ri-truck-line' },
            { id: 'refund', label: 'Báo lỗi & Đổi trả', sender: 'L. Khánh Vy', icon: 'ri-refresh-line' }
          ].map((ticket) => {
            const isActive = activeTab === ticket.id;
            const hasReplied = isReplied[ticket.id];

            return (
              <button
                key={ticket.id}
                onClick={() => setActiveTab(ticket.id as any)}
                className={`flex-grow sm:flex-grow-0 px-3 py-2 rounded-xl border text-[9px] font-extrabold text-left transition-all cursor-pointer flex items-center justify-between gap-3 ${
                  isActive
                    ? 'bg-[#9B2A4C] border-[#9B2A4C] text-white shadow-md scale-[1.01]'
                    : 'bg-slate-50 border-gray-200/60 hover:bg-slate-100 hover:border-gray-300 text-slate-700'
                }`}
              >
                <span className="flex items-center gap-1.5">
                  <i className={`${ticket.icon} ${isActive ? 'text-white' : 'text-slate-400'}`} />
                  {ticket.label} ({ticket.sender})
                </span>
                {hasReplied && (
                  <span className={`w-3.5 h-3.5 rounded-full flex items-center justify-center text-[7px] font-bold ${
                    isActive ? 'bg-white text-[#9B2A4C]' : 'bg-green-500 text-white'
                  }`}>
                    ✓
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* 2. CUSTOMER INCOMING EMAIL CARD */}
        <div className="bg-[#F8FAFC] border border-gray-200/60 rounded-2xl p-4 text-left space-y-2 relative">
          <div className="flex flex-wrap justify-between items-center text-[9px] text-gray-400 gap-1.5">
            <span className="flex flex-wrap items-center gap-1 font-bold">
              <i className="ri-mail-download-line text-[#9B2A4C]" />
              Hộp Thư Đến từ: <strong className="text-slate-700">{currentInquiry.sender}</strong> 
              <span className="text-gray-400 truncate max-w-[150px] sm:max-w-none">&lt;{currentInquiry.email}&gt;</span>
            </span>
            <span>{currentInquiry.time}</span>
          </div>
          <div className="text-[10px] font-extrabold text-[#9B2A4C]">Tiêu đề: {currentInquiry.subject}</div>
          <p className="text-[10px] text-slate-600 leading-relaxed italic bg-white p-3 rounded-xl border border-gray-100/50">
            "{currentInquiry.body}"
          </p>
        </div>

        {/* 3. AI AUTO-RESPONDER PANEL */}
        <div className="border border-gray-200/80 rounded-2xl bg-white shadow-sm flex flex-col justify-between relative overflow-hidden min-h-[300px]">
          
          {/* AI Intent Scanner processing laser overlay animation */}
          {isAnalyzing && (
            <div className="absolute inset-0 bg-[#0F172A]/95 text-white z-40 flex flex-col items-center justify-center space-y-4 animate-fadeIn">
              <div className="relative">
                <i className="ri-radar-line text-4xl text-[#9B2A4C] animate-spin-slow" />
                <div className="absolute inset-0 border border-transparent rounded-full animate-ping bg-[#9B2A4C]/10" />
              </div>
              <div className="text-center space-y-1">
                <p className="text-[10px] font-bold text-white tracking-widest uppercase">NexDome AI NLP Engine</p>
                <p className="text-[8px] text-gray-400">Đang quét thư, phân tích ý định và trích xuất thực thể...</p>
              </div>
            </div>
          )}

          {/* AI Status & Intent Recognition Banner */}
          <div className="p-3 border-b border-gray-200/80 bg-slate-50 flex flex-wrap justify-between items-center gap-3 text-left shrink-0">
            <div className="space-y-1 min-w-[150px] flex-1">
              <p className="text-[7px] font-black text-slate-400 uppercase tracking-widest">Phân tích ý định bởi AI</p>
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[9px] font-black text-slate-700 bg-white px-2.5 py-0.5 rounded-lg border border-slate-200 flex items-center gap-1.5 font-bold">
                  <i className="ri-brain-line text-[#9B2A4C]" />
                  Ý định: <strong className="text-[#9B2A4C] font-black">{currentInquiry.intent}</strong>
                </span>
                <span className="text-[8px] font-bold text-green-600 bg-green-50 px-1.5 py-0.5 rounded border border-green-200">
                  Độ tự tin: {currentInquiry.confidence}
                </span>
              </div>
            </div>

            {/* AI response tone switcher controls */}
            <div className="space-y-1 text-left shrink-0">
              <p className="text-[7px] font-black text-slate-400 uppercase tracking-widest">Giọng điệu phản hồi (AI Tone)</p>
              <div className="flex rounded-xl border border-gray-200/80 p-0.5 bg-white shadow-sm">
                {[
                  { id: 'professional', label: 'Chuyên nghiệp' },
                  { id: 'friendly', label: 'Thân thiện' },
                  { id: 'direct', label: 'Ngắn gọn' }
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => handleToneChange(item.id as any)}
                    className={`px-2 py-1 text-[8px] font-bold rounded-lg transition-all cursor-pointer ${
                      tone === item.id ? 'bg-[#9B2A4C] text-white shadow-sm' : 'bg-white text-gray-500 hover:text-gray-800'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Email draft editor viewport area */}
          <div className="flex-grow p-4 bg-white flex flex-col justify-between text-[10px] leading-relaxed overflow-x-hidden">
            {isReplied[activeTab] ? (
              /* REPLIED SUCCESS SCREEN */
              <div className="py-8 text-center space-y-4 max-w-sm mx-auto w-full animate-fadeIn">
                <div className="w-12 h-12 rounded-full bg-green-500/10 text-green-500 flex items-center justify-center mx-auto animate-bounce">
                  <i className="ri-mail-send-fill text-2xl" />
                </div>
                <div>
                  <h5 className="font-black text-xs md:text-sm text-slate-800 uppercase tracking-wider text-green-600">Đã phản hồi thành công!</h5>
                  <p className="text-[9px] text-gray-400 mt-1.5 leading-relaxed">
                    AI Auto-Responder đã gửi thư trả lời tới khách hàng. Toàn bộ hội thoại được đồng bộ về CRM.
                  </p>
                </div>
                <button
                  onClick={() => handleResetTicket(activeTab)}
                  className="px-4 py-2 bg-[#2C3E50] text-white text-[8px] font-extrabold rounded-xl shadow-md hover:bg-slate-800 cursor-pointer"
                >
                  <i className="ri-refresh-line mr-1" />
                  Thử phản hồi lại bằng AI
                </button>
              </div>
            ) : (
              /* REAL WEBMAIL EDITOR PREVIEW FRAME */
              <div className="flex flex-col justify-between flex-grow space-y-4 overflow-x-hidden max-w-full">
                
                {/* Editor headers */}
                <div className="text-left text-[9px] space-y-1 pb-3 border-b border-gray-100 bg-white">
                  <p><span className="text-gray-400">Từ:</span> <strong className="text-slate-800">Cosmetics Co.</strong> &lt;support@cosmetics.co&gt;</p>
                  <p><span className="text-gray-400">Đến:</span> <span className="text-slate-600">{currentInquiry.sender}</span> &lt;{currentInquiry.email}&gt;</p>
                  <p><span className="text-gray-400">Tiêu đề:</span> <span className="text-slate-800 font-extrabold">Re: {currentInquiry.subject}</span></p>
                </div>

                {/* Draft Content (Typewriter effect) */}
                <div className="flex-grow overflow-y-auto text-left min-h-[140px] max-h-[220px] pr-1">
                  <div className="whitespace-pre-line text-slate-700 font-medium">
                    {displayedText}
                    {isGenerating && <span className="inline-block w-1.5 h-3.5 bg-[#9B2A4C] ml-0.5 animate-pulse" />}
                  </div>

                  {/* Contextual Widget */}
                  {!isAnalyzing && displayedText.length > 0 && (
                    <div className="mt-4 pt-3 border-t border-gray-100">
                      {/* 1. Advice: Product Widget */}
                      {currentInquiry.hasProductWidget && activeTab === 'advice' && (
                        <div className="bg-[#F8FAFC] border border-gray-200/60 rounded-xl p-3 flex flex-col gap-2.5 text-left w-full">
                          <div className="flex items-center gap-2 text-left">
                            <div className="w-8 h-8 rounded-lg bg-[#9B2A4C]/10 text-[#9B2A4C] flex items-center justify-center shrink-0">
                              <i className="ri-heart-pulse-line text-base" />
                            </div>
                            <div>
                              <p className="text-[9px] font-black text-slate-800">Sản phẩm Đề Xuất (Routine khuyên dùng)</p>
                              <p className="text-[7px] text-gray-400">Tự động gắn link mua sắm & tracking coupon</p>
                            </div>
                          </div>
                          <div className="flex flex-wrap gap-2 w-full">
                            <div className="bg-white border border-gray-150 rounded-lg p-1.5 flex items-center gap-1.5 flex-1 min-w-[130px]">
                              <span className="w-4 h-4 rounded bg-red-100 flex items-center justify-center text-[8px] text-red-600 font-bold">HA</span>
                              <div className="text-left leading-none">
                                <p className="text-[7px] font-bold text-slate-700">HA Hydrating Serum</p>
                                <span className="text-[7px] font-black text-[#9B2A4C]">$24.00</span>
                              </div>
                            </div>
                            <div className="bg-white border border-gray-150 rounded-lg p-1.5 flex items-center gap-1.5 flex-1 min-w-[130px]">
                              <span className="w-4 h-4 rounded bg-amber-100 flex items-center justify-center text-[8px] text-amber-600 font-bold">RT</span>
                              <div className="text-left leading-none">
                                <p className="text-[7px] font-bold text-slate-700">Retinol Booster 1%</p>
                                <span className="text-[7px] font-black text-[#9B2A4C]">$28.00</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* 2. Status: Tracking Widget */}
                      {currentInquiry.hasTrackingWidget && activeTab === 'status' && (
                        <div className="bg-[#F8FAFC] border border-gray-200/60 rounded-xl p-3 text-left space-y-2">
                          <div className="flex justify-between items-center pb-1.5 border-b border-gray-150">
                            <span className="text-[8px] font-black text-slate-700 flex items-center gap-1">
                              <i className="ri-truck-line text-[#9B2A4C]" /> Đơn Vị Giao Hàng: GHTK
                            </span>
                            <span className="text-[8px] font-bold text-[#9B2A4C]">Mã: GHTK8492019A</span>
                          </div>
                          {/* Timeline steps */}
                          <div className="grid grid-cols-3 gap-2">
                            <div className="text-center relative">
                              <div className="w-4 h-4 rounded-full bg-green-500/10 text-green-500 flex items-center justify-center mx-auto mb-1">
                                <i className="ri-checkbox-circle-fill text-[9px]" />
                              </div>
                              <p className="text-[7px] font-bold text-slate-700">Đã bàn giao</p>
                              <p className="text-[5px] text-gray-400">08:00 Sáng nay</p>
                            </div>
                            <div className="text-center relative">
                              <div className="w-4 h-4 rounded-full bg-amber-500/15 text-amber-600 flex items-center justify-center mx-auto mb-1 animate-pulse">
                                <i className="ri-truck-fill text-[9px]" />
                              </div>
                              <p className="text-[7px] font-bold text-slate-700">Đang trên xe</p>
                              <p className="text-[5px] text-gray-400">Giao hôm nay</p>
                            </div>
                            <div className="text-center relative opacity-55">
                              <div className="w-4 h-4 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-1">
                                <i className="ri-home-4-fill text-[9px]" />
                              </div>
                              <p className="text-[7px] font-bold text-slate-500">Khách nhận</p>
                              <p className="text-[5px] text-gray-400">Dự kiến trước 17h</p>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* 3. Refund: Refund/Voucher Widget */}
                      {currentInquiry.hasRefundWidget && activeTab === 'refund' && (
                        <div className="bg-[#F8FAFC] border border-gray-200/60 rounded-xl p-3 flex justify-between items-center">
                          <div className="text-left space-y-0.5">
                            <span className="text-[8px] font-black text-slate-700 flex items-center gap-1">
                              <i className="ri-coupon-2-line text-[#9B2A4C]" /> Đổi Trả Tự Động: 1-1 Miễn Phí
                            </span>
                            <p className="text-[7px] text-gray-400">Giao bù hàng mới, thu hồi lọ vỡ tận nơi</p>
                          </div>
                          <div className="bg-red-50 border border-red-200 text-red-600 px-2.5 py-1.5 rounded-lg text-center shrink-0">
                            <p className="text-[8px] font-black leading-none">Mã Yêu Cầu</p>
                            <p className="text-[9px] font-black text-[#9B2A4C] mt-0.5">#RT-9948</p>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Bottom Action Footer */}
          <div className="p-4 border-t border-gray-200 bg-white shrink-0 flex flex-wrap justify-between items-center gap-3">
            <div className="text-left min-w-[150px] flex-1">
              <p className="text-[9px] font-black text-slate-800 leading-tight">Hành động của Đại Lý AI</p>
              <p className="text-[7px] text-gray-400 leading-normal">Gửi phản hồi tự động lập tức để giải phóng nhân lực</p>
            </div>

            <div className="flex gap-2 shrink-0">
              <button
                onClick={() => setTypewriterTrigger((prev) => prev + 1)}
                disabled={isGenerating || isAnalyzing || isReplied[activeTab]}
                className="px-3.5 py-2 border border-[#9B2A4C]/35 text-[#9B2A4C] hover:bg-[#9B2A4C]/5 text-[9px] font-extrabold rounded-xl transition-all cursor-pointer disabled:opacity-50 whitespace-nowrap shrink-0"
              >
                <i className="ri-magic-line mr-1 animate-pulse" />
                Soạn Phản Hồi AI
              </button>
              
              <button
                onClick={handleSendReply}
                disabled={isGenerating || isAnalyzing || isReplied[activeTab] || sendingTest}
                className="bg-gradient-to-r from-[#9B2A4C] to-[#b83f60] text-white text-[9px] font-extrabold px-4 py-2 rounded-xl shadow-lg shadow-[#9B2A4C]/25 hover:opacity-95 transition-opacity disabled:opacity-50 flex items-center gap-1 cursor-pointer shrink-0 whitespace-nowrap"
              >
                {sendingTest ? (
                  <>
                    <i className="ri-loader-4-line animate-spin" />
                    Đang truyền tải...
                  </>
                ) : (
                  <>
                    <i className="ri-send-plane-2-fill" />
                    Gửi Phản Hồi Tự Động
                  </>
                )}
              </button>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}



// 6. Mobile App Showcase: App screen slider inside device mock
export function AppShowcase() {
  const { t } = useTranslation();
  const [viewport, setViewport] = useState<'desktop' | 'mobile'>('desktop');
  const [theme, setTheme] = useState<'dark' | 'light'>('dark'); // Smart home dashboard defaults to dark theme for visual premium feel

  const [currentTab, setCurrentTab] = useState<'home' | 'scenes' | 'security'>('home');
  
  // Interactive smart home states
  const [isLightOn, setIsLightOn] = useState(false);
  const [acTemp, setAcTemp] = useState(24);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLocked, setIsLocked] = useState(true);
  const [lockingState, setLockingState] = useState<'idle' | 'processing'>('idle');
  const [selectedScene, setSelectedScene] = useState<string | null>(null);

  const toggleLight = () => setIsLightOn(prev => !prev);
  
  const adjustTemp = (delta: number) => {
    setAcTemp(prev => {
      const newVal = prev + delta;
      return newVal >= 16 && newVal <= 30 ? newVal : prev;
    });
  };

  const handleLockToggle = () => {
    if (lockingState === 'processing') return;
    setLockingState('processing');
    setTimeout(() => {
      setIsLocked(prev => !prev);
      setLockingState('idle');
    }, 1200);
  };

  const applyScene = (scene: string) => {
    setSelectedScene(scene);
    if (scene === 'cinema') {
      setIsLightOn(false);
      setAcTemp(21);
      setIsPlaying(true);
    } else if (scene === 'sleep') {
      setIsLightOn(false);
      setAcTemp(23);
      setIsPlaying(false);
    } else if (scene === 'welcome') {
      setIsLightOn(true);
      setAcTemp(24);
      setIsPlaying(true);
    } else if (scene === 'party') {
      setIsLightOn(true);
      setAcTemp(22);
      setIsPlaying(true);
    }
    setTimeout(() => setSelectedScene(null), 1000);
  };

  return (
    <div className="space-y-4">
      {/* Top Control Bar */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center bg-gray-50 p-3 rounded-2xl border border-gray-100 gap-3">
        <span className="text-xs font-bold text-[#2C3E50]">{t('services.showcase.app.title')}</span>
        <div className="flex flex-wrap items-center gap-2">
          {/* Viewport switch */}
          <div className="flex rounded-xl border border-gray-200/60 p-0.5 bg-white shadow-sm">
            <button
              onClick={() => setViewport('desktop')}
              className={`px-2.5 py-1 text-[10px] font-bold rounded-lg transition-all cursor-pointer ${
                viewport === 'desktop' ? 'bg-[#9B2A4C] text-white shadow-sm' : 'bg-white text-gray-500 hover:text-gray-800'
              }`}
            >
              Máy tính
            </button>
            <button
              onClick={() => setViewport('mobile')}
              className={`px-2.5 py-1 text-[10px] font-bold rounded-lg transition-all cursor-pointer ${
                viewport === 'mobile' ? 'bg-[#9B2A4C] text-white shadow-sm' : 'bg-white text-gray-500 hover:text-gray-800'
              }`}
            >
              Di động
            </button>
          </div>

          {/* Theme switch */}
          <div className="flex rounded-xl border border-gray-200/60 p-0.5 bg-white shadow-sm">
            <button
              onClick={() => setTheme('light')}
              className={`px-2.5 py-1 text-[10px] font-bold rounded-lg transition-all cursor-pointer ${
                theme === 'light' ? 'bg-[#9B2A4C] text-white shadow-sm' : 'bg-white text-gray-500 hover:text-gray-800'
              }`}
            >
              ☀️ Sáng
            </button>
            <button
              onClick={() => setTheme('dark')}
              className={`px-2.5 py-1 text-[10px] font-bold rounded-lg transition-all cursor-pointer ${
                theme === 'dark' ? 'bg-[#9B2A4C] text-white shadow-sm' : 'bg-white text-gray-500 hover:text-gray-800'
              }`}
            >
              🌙 Tối
            </button>
          </div>
        </div>
      </div>

      {/* Simulator Frame wrapper */}
      <div className="flex justify-center items-center bg-[#F8F6F2] border border-gray-100 rounded-3xl p-6 min-h-[340px] transition-all duration-300">
        <div
          className={`bg-slate-950 border-[6px] border-slate-800 rounded-[36px] shadow-2xl relative flex flex-col justify-between overflow-hidden transition-all duration-500 ${
            viewport === 'desktop' ? 'w-[260px] h-[480px]' : 'w-64 h-[420px]'
          }`}
        >
          {/* Top Notch/Speaker */}
          <div className="absolute top-2 left-1/2 -translate-x-1/2 w-20 h-4 bg-slate-800 rounded-full z-30 flex items-center justify-center pointer-events-none">
            <div className="w-1.5 h-1.5 bg-slate-900 rounded-full mr-2" />
            <div className="w-8 h-1 bg-slate-700 rounded-full" />
          </div>

          {/* Device Screen */}
          <div
            className={`flex-grow mt-7 mb-2 mx-2 rounded-[28px] overflow-hidden flex flex-col justify-between relative transition-colors duration-300 ${
              theme === 'dark' ? 'bg-[#0F172A] text-white' : 'bg-[#F8FAFC] text-slate-800'
            }`}
          >
            {/* Ambient Backlight Glow inside screen if light is ON */}
            {isLightOn && (
              <div className="absolute inset-0 bg-radial-glow bg-amber-500/5 pointer-events-none z-0" />
            )}

            {/* App Header */}
            <div className={`p-3 border-b flex justify-between items-center shrink-0 z-10 ${
              theme === 'dark' ? 'border-slate-800/80 bg-slate-900/50' : 'border-slate-100 bg-white/50'
            }`}>
              <span className="text-[9px] font-black tracking-wider uppercase bg-gradient-to-r from-amber-500 to-orange-500 bg-clip-text text-transparent">
                NexDome AI
              </span>
              <div className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                <span className="text-[6px] text-gray-400 font-bold">{t('services.showcase.app.statusConnected')}</span>
              </div>
            </div>

            {/* Scrollable Screen Content */}
            <div
              className="flex-grow overflow-y-auto p-3 space-y-3 z-10"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {/* TAB 1: DASHBOARD / DEVICE CONTROL */}
              {currentTab === 'home' && (
                <div className="animate-fadeIn space-y-3">
                  {/* Status Banner */}
                  <div className={`p-2.5 rounded-xl border flex items-center justify-between ${
                    theme === 'dark' ? 'bg-slate-900/60 border-slate-800' : 'bg-white border-slate-100 shadow-sm'
                  }`}>
                    <div>
                      <p className="text-[9px] font-extrabold">{t('services.showcase.app.roomLiving')}</p>
                      <p className="text-[6px] text-gray-400">{t('services.showcase.app.roomTemp', { temp: acTemp })}</p>
                    </div>
                    <i className="ri-home-wifi-line text-[#9B2A4C] text-xs" />
                  </div>

                  {/* Smart Light Switch Card */}
                  <div className={`p-3 rounded-xl border transition-all duration-300 flex items-center justify-between cursor-pointer ${
                    isLightOn 
                      ? 'bg-amber-500/10 border-amber-500/40 shadow-inner' 
                      : (theme === 'dark' ? 'bg-slate-900/40 border-slate-800/60 hover:bg-slate-900/60' : 'bg-white border-slate-100 hover:shadow-sm')
                  }`}
                  onClick={toggleLight}
                  >
                    <div className="flex items-center gap-2">
                      <div className={`w-6 h-6 rounded-lg flex items-center justify-center transition-colors ${
                        isLightOn ? 'bg-amber-500 text-white' : 'bg-gray-100 dark:bg-slate-800 text-gray-400'
                      }`}>
                        <i className={`text-xs ${isLightOn ? 'ri-lightbulb-fill' : 'ri-lightbulb-line'}`} />
                      </div>
                      <div>
                        <p className="text-[8px] font-black">{t('services.showcase.app.deviceLights')}</p>
                        <p className="text-[5px] text-gray-400">{isLightOn ? t('services.showcase.app.lightsOn') : t('services.showcase.app.lightsOff')}</p>
                      </div>
                    </div>
                    {/* Toggle pill */}
                    <div className={`w-6 h-3.5 rounded-full p-0.5 transition-colors cursor-pointer ${
                      isLightOn ? 'bg-[#9B2A4C]' : 'bg-gray-300 dark:bg-slate-700'
                    }`}>
                      <div className={`w-2.5 h-2.5 rounded-full bg-white transition-transform ${
                        isLightOn ? 'translate-x-2.5' : 'translate-x-0'
                      }`} />
                    </div>
                  </div>

                  {/* Air Conditioner Card */}
                  <div className={`p-3 rounded-xl border flex flex-col gap-2 ${
                    theme === 'dark' ? 'bg-slate-900/40 border-slate-800/60' : 'bg-white border-slate-100 shadow-sm'
                  }`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className={`w-6 h-6 rounded-lg flex items-center justify-center bg-[#9B2A4C]/10 text-[#9B2A4C]`}>
                          <i className="ri-temp-cold-line text-xs" />
                        </div>
                        <div>
                          <p className="text-[8px] font-black">{t('services.showcase.app.deviceAc')}</p>
                          <p className="text-[5px] text-gray-400">{t('services.showcase.app.acModeCool')}</p>
                        </div>
                      </div>
                      <span className={`text-[10px] font-extrabold ${
                        acTemp < 22 ? 'text-cyan-500' : acTemp > 25 ? 'text-orange-500' : 'text-emerald-500'
                      }`}>{acTemp}°C</span>
                    </div>

                    {/* Temp adjustments */}
                    <div className="flex justify-between items-center bg-gray-50 dark:bg-slate-950 p-1 rounded-lg">
                      <button 
                        onClick={() => adjustTemp(-1)}
                        className="w-5 h-5 rounded bg-white dark:bg-slate-800 border dark:border-slate-700/60 flex items-center justify-center font-bold text-[10px] hover:opacity-85 text-slate-800 dark:text-white"
                      >
                        -
                      </button>
                      <span className="text-[6px] text-gray-400 uppercase font-black tracking-wider">{t('services.showcase.app.setTemp')}</span>
                      <button 
                        onClick={() => adjustTemp(1)}
                        className="w-5 h-5 rounded bg-white dark:bg-slate-800 border dark:border-slate-700/60 flex items-center justify-center font-bold text-[10px] hover:opacity-85 text-slate-800 dark:text-white"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  {/* Media Player Card */}
                  <div className={`p-3 rounded-xl border flex items-center justify-between ${
                    theme === 'dark' ? 'bg-slate-900/40 border-slate-800/60' : 'bg-white border-slate-100 shadow-sm'
                  }`}>
                    <div className="flex items-center gap-2 overflow-hidden">
                      <div className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 ${
                        isPlaying ? 'bg-[#9B2A4C]/15 text-[#9B2A4C] animate-spin-slow' : 'bg-gray-100 dark:bg-slate-800 text-gray-400'
                      }`}>
                        <i className="ri-disc-line text-xs" />
                      </div>
                      <div className="truncate text-left">
                        <p className="text-[8px] font-black truncate">{t('services.showcase.app.mediaChill')}</p>
                        <p className="text-[5px] text-gray-400 truncate">{t('services.showcase.app.mediaLofi')}</p>
                      </div>
                    </div>
                    
                    {/* Media Action */}
                    <button 
                      onClick={() => setIsPlaying(prev => !prev)}
                      className={`w-6 h-6 rounded-full flex items-center justify-center shadow-sm cursor-pointer transition-colors ${
                        isPlaying ? 'bg-[#9B2A4C] text-white' : 'bg-gray-100 dark:bg-slate-800 text-gray-500'
                      }`}
                    >
                      <i className={`text-[10px] ${isPlaying ? 'ri-pause-fill' : 'ri-play-fill'}`} />
                    </button>
                  </div>
                </div>
              )}

              {/* TAB 2: AUTOMATION / SCENES */}
              {currentTab === 'scenes' && (
                <div className="animate-fadeIn space-y-3">
                  <div className="text-center pb-1">
                    <p className="text-[7px] text-gray-400 uppercase tracking-widest font-black">{t('services.showcase.app.sceneTitle')}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { id: 'cinema', title: t('services.showcase.app.sceneCinema'), desc: t('services.showcase.app.sceneCinemaDesc'), icon: 'ri-movie-2-line' },
                      { id: 'sleep', title: t('services.showcase.app.sceneSleep'), desc: t('services.showcase.app.sceneSleepDesc'), icon: 'ri-moon-clear-line' },
                      { id: 'welcome', title: t('services.showcase.app.sceneWelcome'), desc: t('services.showcase.app.sceneWelcomeDesc'), icon: 'ri-door-open-line' },
                      { id: 'party', title: t('services.showcase.app.sceneParty'), desc: t('services.showcase.app.scenePartyDesc'), icon: 'ri-music-2-line' }
                    ].map(scene => (
                      <div 
                        key={scene.id}
                        onClick={() => applyScene(scene.id)}
                        className={`p-2.5 rounded-xl border cursor-pointer text-center space-y-1 transition-all duration-300 relative overflow-hidden ${
                          selectedScene === scene.id
                            ? 'bg-[#9B2A4C] border-[#9B2A4C] text-white scale-[0.98]'
                            : (theme === 'dark' ? 'bg-slate-900/40 border-slate-800/60 hover:bg-slate-900/60' : 'bg-white border-slate-100 hover:shadow-sm')
                        }`}
                      >
                        {selectedScene === scene.id && (
                          <div className="absolute inset-0 bg-white/10 animate-pulse pointer-events-none" />
                        )}
                        <i className={`${scene.icon} text-xs ${selectedScene === scene.id ? 'text-white' : 'text-[#9B2A4C]'}`} />
                        <p className="text-[8px] font-black leading-none">{scene.title}</p>
                        <p className="text-[5px] text-gray-400">{scene.desc}</p>
                      </div>
                    ))}
                  </div>

                  {/* Scene Note */}
                  <div className={`p-2.5 rounded-xl border text-[6px] text-gray-400 leading-relaxed text-center ${
                    theme === 'dark' ? 'bg-slate-900/20 border-slate-800/40' : 'bg-gray-50/50 border-slate-100'
                  }`}>
                    {t('services.showcase.app.sceneHint')}
                  </div>
                </div>
              )}

              {/* TAB 3: SECURITY / CAMERAS */}
              {currentTab === 'security' && (
                <div className="animate-fadeIn space-y-3">
                  {/* Camera Live stream container */}
                  <div className="relative aspect-video rounded-xl bg-slate-950 border border-slate-800 overflow-hidden flex items-center justify-center text-center">
                    {/* Live REC Indicator */}
                    <div className="absolute top-1.5 left-1.5 flex items-center gap-1 z-20">
                      <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                      <span className="text-[5px] font-bold text-white tracking-widest uppercase">{t('services.showcase.app.secCamTitle')}</span>
                    </div>

                    {/* Camera outline draw */}
                    <div className="w-6 h-6 rounded-full border-2 border-slate-800/60 flex items-center justify-center relative">
                      <div className="w-2.5 h-2.5 rounded-full bg-[#9B2A4C]/35 animate-ping absolute" />
                      <div className="w-2 h-2 rounded-full bg-slate-800" />
                    </div>

                    <span className="absolute bottom-1 right-1.5 text-[5px] text-gray-500">{t('services.showcase.app.secRoom')}</span>
                  </div>

                  {/* Door Lock Controller Card */}
                  <div className={`p-3 rounded-xl border flex items-center justify-between ${
                    theme === 'dark' ? 'bg-slate-900/40 border-slate-800/60' : 'bg-white border-slate-100 shadow-sm'
                  }`}>
                    <div className="flex items-center gap-2">
                      <div className={`w-6 h-6 rounded-lg flex items-center justify-center ${
                        isLocked ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'
                      }`}>
                        <i className={`text-xs ${isLocked ? 'ri-lock-fill' : 'ri-lock-unlock-line'}`} />
                      </div>
                      <div className="text-left">
                        <p className="text-[8px] font-black">{t('services.showcase.app.secDoorLock')}</p>
                        <p className="text-[5px] text-gray-400">{lockingState === 'processing' ? t('services.showcase.app.secLocking') : (isLocked ? t('services.showcase.app.secLocked') : t('services.showcase.app.secUnlocked'))}</p>
                      </div>
                    </div>

                    {/* Lock Action Button */}
                    <button 
                      onClick={handleLockToggle}
                      disabled={lockingState === 'processing'}
                      className={`px-2.5 py-1 text-[7px] font-black rounded-lg cursor-pointer transition-all ${
                        lockingState === 'processing'
                          ? 'bg-gray-200 text-gray-400 dark:bg-slate-800'
                          : (isLocked ? 'bg-[#9B2A4C] text-white hover:opacity-90' : 'bg-green-600 text-white hover:bg-green-700')
                      }`}
                    >
                      {lockingState === 'processing' ? (
                        <div className="flex items-center gap-0.5">
                          <span className="w-1 h-1 rounded-full bg-gray-400 animate-bounce" />
                          <span className="w-1 h-1 rounded-full bg-gray-400 animate-bounce delay-75" />
                        </div>
                      ) : (
                        isLocked ? t('services.showcase.app.secBtnOpen') : t('services.showcase.app.secBtnClose')
                      )}
                    </button>
                  </div>

                  {/* Event list logs */}
                  <div className="space-y-1.5 text-left">
                    <p className="text-[6px] text-gray-400 uppercase font-black tracking-wider">{t('services.showcase.app.secLogs')}</p>
                    <div className="space-y-1">
                      <div className="text-[5px] text-gray-400 flex justify-between items-center">
                        <span>{t('services.showcase.app.secLogMotion')}</span>
                        <span>10:42 PM</span>
                      </div>
                      <div className="text-[5px] text-gray-400 flex justify-between items-center">
                        <span>{t('services.showcase.app.secLogLocked')}</span>
                        <span>09:15 PM</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Mobile Footer Tab Bar */}
            <div className={`p-1.5 border-t flex justify-around items-center shrink-0 z-10 ${
              theme === 'dark' ? 'border-slate-800/80 bg-slate-900/60' : 'border-slate-100 bg-white/70 backdrop-blur-sm shadow-inner'
            }`}>
              {[
                { tab: 'home', label: t('services.showcase.app.tabDevices'), icon: 'ri-dashboard-line' },
                { tab: 'scenes', label: t('services.showcase.app.tabScenes'), icon: 'ri-node-tree' },
                { tab: 'security', label: t('services.showcase.app.tabSecurity'), icon: 'ri-shield-user-line' }
              ].map(item => (
                <div 
                  key={item.tab}
                  onClick={() => setCurrentTab(item.tab as any)}
                  className={`flex flex-col items-center cursor-pointer py-1 px-3 rounded-lg transition-colors ${
                    currentTab === item.tab 
                      ? 'text-[#9B2A4C] font-extrabold' 
                      : 'text-gray-400 hover:text-gray-600'
                  }`}
                >
                  <i className={`${item.icon} text-[11px]`} />
                  <span className="text-[5px] leading-none mt-0.5">{item.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// 7. General Placeholder / Fallback Showcase (used as template sample list)
export function GeneralShowcase({ serviceId }: { serviceId: string }) {
  const { t } = useTranslation();
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center bg-gray-50 p-3 rounded-2xl border border-gray-100">
        <span className="text-xs font-bold text-[#2C3E50]">{t('services.showcase.general.title')}</span>
        <span className="text-[9px] font-bold text-gray-400">{t('services.showcase.general.activeClients')}</span>
      </div>
      <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm space-y-4">
        <h3 className="text-xs font-bold text-[#1C2526] uppercase">{t('services.showcase.general.header')}</h3>
        <div className="space-y-3">
          <div className="p-3 rounded-2xl bg-[#F8F6F2]/50 border border-gray-100 flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-[#1C2526]">{t('services.showcase.general.case1Title')}</p>
              <p className="text-[9px] text-gray-400">{t('services.showcase.general.case1Desc')}</p>
            </div>
            <i className="ri-arrow-right-up-line text-[#9B2A4C]" />
          </div>
          <div className="p-3 rounded-2xl bg-[#F8F6F2]/50 border border-gray-100 flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-[#1C2526]">{t('services.showcase.general.case2Title')}</p>
              <p className="text-[9px] text-gray-400">{t('services.showcase.general.case2Desc')}</p>
            </div>
            <i className="ri-arrow-right-up-line text-[#9B2A4C]" />
          </div>
          <div className="p-3 rounded-2xl bg-[#F8F6F2]/50 border border-gray-100 flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-[#1C2526]">{t('services.showcase.general.case3Title')}</p>
              <p className="text-[9px] text-gray-400">{t('services.showcase.general.case3Desc')}</p>
            </div>
            <i className="ri-arrow-right-up-line text-[#9B2A4C]" />
          </div>
        </div>
      </div>
    </div>
  );
}

// Router dispatcher for showcases
export function ServiceShowcaseDispatcher({ serviceId }: { serviceId: string }) {
  const id = serviceId.toLowerCase();
  switch (id) {
    case 'web':
      return <WebShowcase />;
    case 'chatbot':
      return <ChatbotShowcase />;
    case 'landing':
      return <LandingShowcase />;
    case 'workflow':
      return <WorkflowShowcase />;
    case 'n8n':
      return <WorkflowShowcase />;
    case 'email':
      return <EmailShowcase />;
    case 'app':
      return <AppShowcase />;
    default:
      return <GeneralShowcase serviceId={id} />;
  }
}

/* --- MAIN SERVICE PAGE COMPONENT --- */

export default function ServicePage() {
  const { serviceId } = useParams<{ serviceId: string }>();
  const { t } = useTranslation();
  const navigate = useNavigate();

  const service = serviceId ? SERVICES_DATA[serviceId.toLowerCase()] : null;

  // Retrieve localized process and whyUs lists from translation files
  let processList: Array<{ title: string; desc: string }> = [];
  let whyUsList: string[] = [];

  if (service) {
    try {
      const rawProcess = t(`services.list.${service.id}.process`, { returnObjects: true });
      if (Array.isArray(rawProcess)) {
        processList = rawProcess;
      } else {
        processList = service.process.map(p => ({ title: p, desc: t('services.booking.processDesc') }));
      }
    } catch {
      processList = service.process.map(p => ({ title: p, desc: t('services.booking.processDesc') }));
    }

    try {
      const rawWhy = t(`services.list.${service.id}.whyUs`, { returnObjects: true });
      if (Array.isArray(rawWhy)) {
        whyUsList = rawWhy;
      } else {
        whyUsList = service.whyUs;
      }
    } catch {
      whyUsList = service.whyUs;
    }
  }

  // Form states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [company, setCompany] = useState('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    // Scroll to top when parameter changes
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setSuccess(false);
  }, [serviceId]);

  if (!service) {
    return (
      <div className="min-h-screen flex flex-col justify-between" style={{ background: '#F8F6F2' }}>
        <Navbar />
        <div className="max-w-md mx-auto text-center py-20 px-4">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">{t('services.booking.notFoundTitle')}</h1>
          <Link to="/" className="text-[#9B2A4C] hover:underline">{t('services.booking.backHome')}</Link>
        </div>
        <Footer />
      </div>
    );
  }

  const handleBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      await LeadsAPI.create({
        name,
        email,
        phone,
        company,
        service: service.id,
        message: message || `${t('services.bookService')}: ${t(service.titleKey)}`
      });

      setSuccess(true);
      // Reset form fields
      setName('');
      setEmail('');
      setPhone('');
      setCompany('');
      setMessage('');
    } catch (error) {
      console.error(error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-between" style={{ background: '#F8F6F2' }}>
      <Navbar />

      <main className="pt-24 pb-16 flex-grow">
        {/* Service Hero */}
        <section className="max-w-7xl mx-auto px-4 md:px-6 py-10 md:py-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#9B2A4C]/25 bg-[#9B2A4C]/5">
                <i className={`${service.icon} text-sm text-[#9B2A4C]`} />
                <span className="text-[#9B2A4C] text-xs font-semibold">{t('services.badge')}</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-black text-[#1C2526] leading-tight">
                {t(service.titleKey)}
              </h1>
              <p className="text-[#5A6A72] text-lg leading-relaxed">
                {t(service.descKey)}
              </p>
              <div className="h-px bg-[#2C3E50]/10" />

              {/* Dynamic Interactive Portfolio Showcase */}
              <div className="my-6">
                <ServiceShowcaseDispatcher serviceId={service.id} />
              </div>

              <p className="text-[#1C2526] text-sm leading-relaxed font-medium">
                {t(service.detailsKey)}
              </p>

              {/* Stack tags */}
              <div className="space-y-3 pt-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#5A6A72]">
                  {t('services.techStack')}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {service.stack.map((item) => (
                    <span
                      key={item}
                      className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-white border border-[#2C3E50]/10 text-[#2C3E50] shadow-sm"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Booking card */}
            <div className="lg:col-span-5 sticky top-24">
              <div className="bg-white rounded-3xl p-6 md:p-8 border border-[#2C3E50]/5 shadow-xl relative overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-1.5 gradient-bg" />
                <h2 className="text-[#1C2526] font-bold text-xl mb-2">
                  {t('services.bookService')}
                </h2>
                <p className="text-xs text-[#8A97A0] mb-6">
                  {t('services.booking.subtitle')}
                </p>

                {success ? (
                  <div className="text-center py-8 space-y-4">
                    <div className="w-16 h-16 bg-green-50 text-green-500 rounded-full flex items-center justify-center mx-auto shadow-inner">
                      <i className="ri-checkbox-circle-fill text-4xl" />
                    </div>
                    <h3 className="text-lg font-bold text-[#1C2526]">{t('services.booking.successTitle')}</h3>
                    <p className="text-xs text-[#5A6A72] leading-relaxed max-w-xs mx-auto">
                      {t('services.booking.successDescPart1')}
                      <span className="font-semibold text-[#9B2A4C] cursor-pointer" onClick={() => navigate('/admin')}>
                        {t('services.booking.successDescLink')}
                      </span>
                      {t('services.booking.successDescPart2')}
                    </p>
                    <button
                      onClick={() => setSuccess(false)}
                      className="text-xs font-bold text-[#9B2A4C] hover:underline"
                    >
                      {t('services.booking.submitAnother')}
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleBooking} className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-[#1C2526] mb-1.5 uppercase">{t('services.booking.nameLabel')}</label>
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder={t('services.booking.namePlaceholder')}
                        className="w-full bg-[#F8F6F2]/50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#9B2A4C] transition-colors"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-[#1C2526] mb-1.5 uppercase">{t('services.booking.emailLabel')}</label>
                        <input
                          type="email"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder={t('services.booking.emailPlaceholder')}
                          className="w-full bg-[#F8F6F2]/50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#9B2A4C] transition-colors"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-[#1C2526] mb-1.5 uppercase">{t('services.booking.phoneLabel')}</label>
                        <input
                          type="tel"
                          required
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder={t('services.booking.phonePlaceholder')}
                          className="w-full bg-[#F8F6F2]/50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#9B2A4C] transition-colors"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[#1C2526] mb-1.5 uppercase">{t('services.booking.companyLabel')}</label>
                      <input
                        type="text"
                        value={company}
                        onChange={(e) => setCompany(e.target.value)}
                        placeholder={t('services.booking.companyPlaceholder')}
                        className="w-full bg-[#F8F6F2]/50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#9B2A4C] transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[#1C2526] mb-1.5 uppercase">{t('services.booking.messageLabel')}</label>
                      <textarea
                        rows={3}
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder={t('services.booking.messagePlaceholder')}
                        className="w-full bg-[#F8F6F2]/50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#9B2A4C] transition-colors resize-none"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={submitting}
                      className="w-full gradient-bg text-white font-bold py-3 rounded-xl shadow-lg hover:opacity-95 transition-opacity disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer text-sm"
                    >
                      {submitting ? (
                        <span className="flex items-center justify-center gap-2">
                          <i className="ri-loader-4-line animate-spin" />
                          {t('services.booking.processing')}
                        </span>
                      ) : (
                        t('services.bookService')
                      )}
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Process and Why choose Us */}
        <section className="bg-white border-y border-[#2C3E50]/5 mt-10 py-16">
          <div className="max-w-7xl mx-auto px-4 md:px-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Process timeline */}
              <div className="space-y-6">
                <h2 className="text-[#1C2526] font-bold text-2xl">
                  {t('services.processTitle')}
                </h2>
                <div className="relative border-l border-[#2C3E50]/10 pl-6 space-y-8 ml-3">
                  {processList.map((step, idx) => (
                    <div key={idx} className="relative">
                      {/* Step Circle */}
                      <span className="absolute -left-[37px] top-0 w-6 h-6 rounded-full gradient-bg flex items-center justify-center text-white text-xs font-bold">
                        {idx + 1}
                      </span>
                      <h4 className="text-sm font-bold text-[#1C2526] mb-1">{step.title}</h4>
                      <p className="text-xs text-[#5A6A72] leading-relaxed">
                        {step.desc}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Why Us list */}
              <div className="space-y-6">
                <h2 className="text-[#1C2526] font-bold text-2xl">
                  {t('services.whyUs')}
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {whyUsList.map((point, idx) => (
                    <div key={idx} className="p-5 rounded-2xl bg-[#F8F6F2]/50 border border-gray-100 space-y-2">
                      <div className="w-8 h-8 rounded-lg bg-[#9B2A4C]/10 flex items-center justify-center text-[#9B2A4C]">
                        <i className="ri-checkbox-circle-line text-lg" />
                      </div>
                      <p className="text-xs font-bold text-[#1C2526] leading-relaxed">
                        {point}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="bg-[#2C3E50]/5 rounded-3xl p-6 border border-[#2C3E50]/10 text-center space-y-4">
                  <h3 className="font-bold text-sm text-[#2C3E50]">{t('services.booking.readyTitle')}</h3>
                  <p className="text-xs text-[#5A6A72]">
                    {t('services.booking.readyDesc')}
                  </p>
                  <Link
                    to="/contact"
                    className="inline-block bg-[#2C3E50] text-white text-xs font-semibold px-6 py-2.5 rounded-full hover:bg-[#2C3E50]/90 transition-colors"
                  >
                    {t('services.booking.goToContact')}
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
