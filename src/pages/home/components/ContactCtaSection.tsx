import { useState, FormEvent } from 'react';
import { useTranslation } from 'react-i18next';

export default function ContactCtaSection() {
  const { i18n } = useTranslation();
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    service: 'ai-marketing',
    message: '',
  });

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFormData({ name: '', email: '', phone: '', service: 'ai-marketing', message: '' });
    }, 4000);
  };

  return (
    <section id="contact" className="py-20 md:py-28 border-t border-gray-200/60 dark:border-gray-800/60 bg-gradient-to-b from-white/40 to-gray-50/50 dark:from-[#0B0F17]/40 dark:to-[#0A0D14]/80 transition-colors">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        
        {/* Section Title */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <span className="text-[10px] font-bold tracking-widest uppercase text-[#9B2A4C] dark:text-cyan-400 px-3.5 py-1 rounded-full bg-[#9B2A4C]/10 dark:bg-cyan-500/10 border border-[#9B2A4C]/20 dark:border-cyan-500/20">
            Let's Connect
          </span>
          <h2 className="text-3xl md:text-5xl font-black text-[#1C2526] dark:text-white tracking-tight uppercase leading-tight">
            LET'S BUILD SOMETHING THAT WORKS
          </h2>
          <p className="text-sm text-[#5A6A72] dark:text-gray-400">
            Bắt đầu thảo luận ý tưởng & giải pháp tự động hóa AI cho dự án của bạn ngay hôm nay.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Left Column: Portrait & Direct Info */}
          <div className="lg:col-span-5 space-y-6">
            <div className="relative rounded-3xl overflow-hidden border border-gray-200 dark:border-gray-800 shadow-2xl bg-white dark:bg-[#131B2E] p-6 space-y-6">
              <div className="relative w-full h-64 rounded-2xl overflow-hidden">
                <img
                  src="https://static.readdy.ai/image/f4782dda055a3841fcfd0612adf32078/077c27292c8b798fc81c07d472b5546d.jpeg"
                  alt="Alvin Tran Contact"
                  onError={(e) => {
                    e.currentTarget.src = 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80';
                  }}
                  className="w-full h-full object-cover object-top"
                />
                
                {/* Floating chat icon button */}
                <a
                  href="https://zalo.me/0376960193"
                  target="_blank"
                  rel="noreferrer"
                  className="absolute bottom-4 right-4 w-12 h-12 rounded-full bg-emerald-500 text-white flex items-center justify-center text-xl shadow-lg hover:scale-110 transition-transform cursor-pointer"
                  title="Zalo Chat"
                >
                  <i className="ri-chat-smile-2-fill" />
                </a>
              </div>

              <div className="space-y-3">
                <h3 className="text-lg font-extrabold text-[#1C2526] dark:text-white">
                  Trần Vũ Quốc Anh (Alvin Tran)
                </h3>
                <p className="text-xs text-[#5A6A72] dark:text-gray-400">
                  Bộ phận kinh doanh & Giải pháp Công nghệ — AI Mastery
                </p>

                <div className="pt-2 space-y-2.5 text-xs font-semibold text-gray-700 dark:text-gray-300">
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded-full bg-[#9B2A4C]/10 dark:bg-cyan-500/10 flex items-center justify-center text-[#9B2A4C] dark:text-cyan-400">
                      <i className="ri-phone-line" />
                    </span>
                    <span>Hotline: 0376960193</span>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded-full bg-[#9B2A4C]/10 dark:bg-cyan-500/10 flex items-center justify-center text-[#9B2A4C] dark:text-cyan-400">
                      <i className="ri-mail-line" />
                    </span>
                    <span>Email: alvintrank95@gmail.com</span>
                  </div>

                  <div className="flex items-start gap-3">
                    <span className="w-8 h-8 rounded-full bg-[#9B2A4C]/10 dark:bg-cyan-500/10 flex items-center justify-center text-[#9B2A4C] dark:text-cyan-400 shrink-0 mt-0.5">
                      <i className="ri-map-pin-line" />
                    </span>
                    <span className="leading-snug">
                      Tầng 2, Tòa nhà Detech Tower, Số 8 Tôn Thất Thuyết, Cầu Giấy, Hà Nội
                    </span>
                  </div>
                </div>
              </div>

              {/* 24h Response Guarantee */}
              <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-bold flex items-center gap-2">
                <i className="ri-[#check-double-line] text-base shrink-0" />
                Cam kết phản hồi & tư vấn giải pháp chi tiết trong vòng 24 giờ.
              </div>
            </div>
          </div>

          {/* Right Column: Contact Form */}
          <div className="lg:col-span-7">
            <div className="p-8 rounded-3xl bg-white dark:bg-[#131B2E] border border-gray-200 dark:border-gray-800 shadow-2xl space-y-6">
              <div>
                <h3 className="text-xl font-extrabold text-[#1C2526] dark:text-white">
                  Gửi thông tin tư vấn
                </h3>
                <p className="text-xs text-[#5A6A72] dark:text-gray-400 mt-1">
                  Điền form dưới đây để nhận báo giá & giải pháp phù hợp nhất.
                </p>
              </div>

              {submitted ? (
                <div className="p-6 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 space-y-2 text-center">
                  <i className="ri-checkbox-circle-fill text-4xl" />
                  <h4 className="text-base font-extrabold">Gửi yêu cầu thành công!</h4>
                  <p className="text-xs">
                    Cảm ơn bạn! Chúng tôi đã nhận được thông tin và sẽ liên hệ lại trong thời gian sớm nhất.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                        Họ và tên *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="Nguyễn Văn A"
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-xs text-[#1C2526] dark:text-white focus:outline-none focus:border-[#9B2A4C] dark:focus:border-cyan-400"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                        Địa chỉ Email *
                      </label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="example@gmail.com"
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-xs text-[#1C2526] dark:text-white focus:outline-none focus:border-[#9B2A4C] dark:focus:border-cyan-400"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                        Số điện thoại / Zalo *
                      </label>
                      <input
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="0376960193"
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-xs text-[#1C2526] dark:text-white focus:outline-none focus:border-[#9B2A4C] dark:focus:border-cyan-400"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                        Dịch vụ bạn quan tâm?
                      </label>
                      <select
                        value={formData.service}
                        onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-xs text-[#1C2526] dark:text-white focus:outline-none focus:border-[#9B2A4C] dark:focus:border-cyan-400"
                      >
                        <option value="ai-marketing">AI Marketing & Growth Strategy</option>
                        <option value="n8n-automation">AI & Workflow Automations (n8n)</option>
                        <option value="web-design">Thiết kế Website & Landing Page</option>
                        <option value="odoo-erp">Tích hợp Hệ thống Odoo ERP</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                      Nội dung cần hỗ trợ
                    </label>
                    <textarea
                      rows={4}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Mô tả sơ lược về nhu cầu hoặc mục tiêu dự án của bạn..."
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-xs text-[#1C2526] dark:text-white focus:outline-none focus:border-[#9B2A4C] dark:focus:border-cyan-400"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-4 rounded-xl gradient-bg dark:bg-gradient-to-r dark:from-cyan-500 dark:to-blue-600 text-white font-black text-xs tracking-wider uppercase shadow-xl hover:opacity-95 transition-opacity cursor-pointer"
                  >
                    Gửi Yêu Cầu Tư Vấn <i className="ri-send-plane-fill ml-1" />
                  </button>
                </form>
              )}
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
