import Navbar from '@/components/feature/Navbar';
import Footer from '@/components/feature/Footer';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

export default function AboutPage() {
  const { i18n } = useTranslation();

  const services = [
    {
      id: 1,
      num: '01',
      title: 'High-Performance Websites & Landing Pages',
      icon: 'ri-layout-grid-line',
      gradient: 'from-[#9B2A4C] to-rose-500',
      bullets: [
        'Custom-built, conversion-focused websites optimized for blazing-fast speed, mobile responsiveness, and a seamless user experience.',
        'Strategic landing pages designed specifically for lead generation, capturing user intent, and maximizing ROI on your paid marketing campaigns.',
        'Comprehensive performance tracking, technical optimization, and A/B testing to ensure your pages convert 3-5x more visitors into paying customers.',
      ],
    },
    {
      id: 2,
      num: '02',
      title: 'AI Chatbots That Close Deals 24/7',
      icon: 'ri-robot-line',
      gradient: 'from-purple-600 to-indigo-500',
      bullets: [
        'Intelligent, AI-powered chatbots designed to automate customer support, answer FAQs, and qualify leads around the clock.',
        'Seamless integration with your website and social media messaging platforms to ensure you never miss a valuable lead even while you sleep.',
        'Personalized conversational flows tailored to your brand voice, guiding prospects naturally toward making a purchase or booking a demo.',
      ],
    },
    {
      id: 3,
      num: '03',
      title: 'Smart Workflow Automation (n8n)',
      icon: 'ri-git-merge-line',
      gradient: 'from-amber-500 to-orange-600',
      bullets: [
        'End-to-end automation of repetitive tasks and manual data entry using advanced n8n integrations tailored exactly to your operations.',
        'Seamlessly connecting your favorite tools (CRM, email, social media, internal apps) to create error-free, hyper-efficient business workflows.',
        'Saving your team 100+ hours per month and drastically reducing operational costs, allowing you to focus purely on business growth.',
      ],
    },
    {
      id: 4,
      num: '04',
      title: 'Email Marketing on Autopilot',
      icon: 'ri-mail-send-line',
      gradient: 'from-emerald-500 to-teal-600',
      bullets: [
        'Automated email sequences designed to continuously nurture leads, onboard new clients, and drive consistent sales without manual intervention.',
        'Hyper-personalized cold outreach campaigns tailored specifically for B2B lead generation, maximizing your open rates and reply rates.',
        'Data-driven performance analytics and continuous A/B testing to optimize your email conversion funnel and maximize customer lifetime value.',
      ],
    },
    {
      id: 5,
      num: '05',
      title: 'Custom Apps Built for YOUR Business',
      icon: 'ri-apps-line',
      gradient: 'from-blue-600 to-cyan-500',
      bullets: [
        'Tailor-made web and mobile applications designed exclusively to streamline your specific internal operations and client management systems.',
        'Scalable and secure architectures that grow alongside your business, eliminating the need to rely on rigid, off-the-shelf software.',
        'User-centric UI/UX design ensuring high adoption rates among your team and providing a frictionless, premium experience for your customers.',
      ],
    },
  ];

  const providedServices = [
    {
      name: 'High-Performance Websites & Landing Pages',
      icon: 'ri-global-line',
      bgLight: 'bg-[#9B2A4C]/10 text-[#9B2A4C] border-[#9B2A4C]/20',
      darkIcon: 'dark:bg-rose-400/10 dark:text-rose-400 dark:border-rose-400/30',
      desc: 'Conversion-focused web development, speed optimization under 1s, responsive UI/UX designed to boost lead conversion rates 3x-5x.',
    },
    {
      name: 'AI Chatbot 24/7 Sales & Support Automation',
      icon: 'ri-robot-2-line',
      bgLight: 'bg-purple-500/10 text-purple-600 border-purple-500/20',
      darkIcon: 'dark:bg-purple-400/10 dark:text-purple-400 dark:border-purple-400/30',
      desc: 'Intelligent AI chatbots automating customer support, qualifying leads, and closing sales around the clock across website and social messaging.',
    },
    {
      name: 'Smart Workflow Automation (n8n & Integrations)',
      icon: 'ri-git-merge-line',
      bgLight: 'bg-amber-500/10 text-amber-600 border-amber-500/20',
      darkIcon: 'dark:bg-amber-400/10 dark:text-amber-400 dark:border-amber-400/30',
      desc: 'Connecting CRM, email outreach, internal databases, and AI webhooks to save 100+ manual hours per month and reduce operational costs by 60%.',
    },
    {
      name: 'Email Marketing & Cold Outreach Autopilot',
      icon: 'ri-mail-send-line',
      bgLight: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20',
      darkIcon: 'dark:bg-emerald-400/10 dark:text-emerald-400 dark:border-emerald-400/30',
      desc: 'Automated email sequences, B2B cold outreach campaigns, lead nurturing funnels, and data-driven conversion tracking.',
    },
    {
      name: 'Odoo 18 ERP & Custom App Development',
      icon: 'ri-apps-2-line',
      bgLight: 'bg-blue-500/10 text-blue-600 border-blue-500/20',
      darkIcon: 'dark:bg-blue-400/10 dark:text-blue-400 dark:border-blue-400/30',
      desc: 'Custom enterprise software, client management portals, Odoo ERP implementations tailored specifically to your unique business logic.',
    },
    {
      name: 'AI Marketing & Performance Growth Strategy',
      icon: 'ri-line-chart-fill',
      bgLight: 'bg-rose-500/10 text-rose-600 border-rose-500/20',
      darkIcon: 'dark:bg-rose-400/10 dark:text-rose-400 dark:border-rose-400/30',
      desc: 'Data-driven ad campaigns (Meta & Google Ads), AI content generation, keyword strategy, and total funnel optimization for maximum ROI.',
    },
  ];

  const journey = [
    {
      period: '2024 — 2026',
      role: 'COMMUNICATIONS & WEB STRATEGIST',
      company: 'ABS Corporation',
      badge: 'Current Role',
      desc: 'Leading digital web architecture, AI automation integrations, and B2B growth marketing strategies to optimize conversion pipelines and streamline enterprise operations.',
    },
    {
      period: '2022 — 2023',
      role: 'CO FOUNDER & GROWTH MARKETER',
      company: 'Senn Cosmetics',
      badge: 'Growth Engine',
      desc: 'Co-founded direct-to-consumer brand, architected online sales channels, managed performance ad campaigns, and scaled customer acquisition funnels.',
    },
    {
      period: '2020 — 2021',
      role: 'MARKETING DESIGNER & AFFILIATE LEAD',
      company: 'ByeBye Pimble',
      badge: 'Foundation',
      desc: 'Designed high-converting landing pages, managed affiliate marketer networks, and executed data-driven creative ad assets for rapid scaling.',
    },
  ];

  return (
    <div className="min-h-screen pt-28 pb-16 transition-colors bg-gray-50/60 dark:bg-[#0B0F17]">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 md:px-8 space-y-16 pb-20">
        
        {/* Profile Hero Header Card */}
        <section className="relative overflow-hidden p-8 md:p-12 rounded-3xl bg-white dark:bg-[#131B2E] border border-gray-200/80 dark:border-gray-800 shadow-xl transition-all">
          {/* Background Ambient Glows */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#9B2A4C]/10 dark:bg-rose-500/10 blur-[100px] rounded-full pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-purple-500/10 dark:bg-indigo-500/10 blur-[90px] rounded-full pointer-events-none" />

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            
            {/* Left Image Column */}
            <div className="lg:col-span-4 flex justify-center">
              <div className="relative group">
                <div className="absolute -inset-3 rounded-3xl bg-gradient-to-tr from-[#9B2A4C]/30 via-rose-500/20 to-purple-600/20 blur-xl opacity-80 group-hover:opacity-100 transition-opacity" />
                <div className="relative w-64 h-80 md:w-72 md:h-96 rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-800 shadow-xl bg-white dark:bg-[#0B0F17]">
                  <img
                    src="https://static.readdy.ai/image/f4782dda055a3841fcfd0612adf32078/077c27292c8b798fc81c07d472b5546d.jpeg"
                    alt="Alvin Tran - Marketer, AI Automation Specialist & Communications Strategist"
                    onError={(e) => {
                      e.currentTarget.src = 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80';
                    }}
                    className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute bottom-3 left-3 right-3 p-3 rounded-xl bg-white/90 dark:bg-[#131B2E]/90 backdrop-blur-md border border-gray-200/50 dark:border-gray-700/50 flex items-center justify-between shadow-lg">
                    <div>
                      <p className="text-xs font-black text-[#1C2526] dark:text-white">Alvin Tran</p>
                      <p className="text-[10px] font-semibold text-[#9B2A4C] dark:text-rose-400">Trần Vũ Quốc Anh</p>
                    </div>
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" title="Available for hire" />
                  </div>
                </div>
              </div>
            </div>

            {/* Right Text Column */}
            <div className="lg:col-span-8 space-y-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#9B2A4C]/10 dark:bg-rose-400/10 border border-[#9B2A4C]/20 dark:border-rose-400/30">
                <i className="ri-user-star-line text-[#9B2A4C] dark:text-rose-400 text-xs" />
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#9B2A4C] dark:text-rose-400">
                  About Me & Profile
                </span>
              </div>

              <div className="space-y-2">
                <h1 className="text-3xl md:text-5xl font-black text-[#1C2526] dark:text-white tracking-tight leading-tight">
                  Alvin Tran <span className="text-base md:text-xl font-medium text-gray-400 block sm:inline sm:ml-2">(Trần Vũ Quốc Anh)</span>
                </h1>
                <p className="text-base md:text-lg font-bold text-[#9B2A4C] dark:text-rose-400">
                  Marketer, AI Automation Specialist & Communications Strategist
                </p>
              </div>

              <p className="text-sm md:text-base text-[#5A6A72] dark:text-gray-300 leading-relaxed">
                My path into digital marketing and automation came from a hands-on, entrepreneurial background. I realized early on that combining creative media with data-driven sales strategies from scaling affiliate networks to building high-converting B2B websites, creating the ultimate growth engine. That experience shapes how I approach every project today: structured, automated by AI, and relentlessly focused on measurable ROI and real business growth.
              </p>

              {/* Stats pill counters */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                <div className="p-3.5 rounded-2xl bg-gray-50 dark:bg-[#0B0F17] border border-gray-100 dark:border-gray-800 text-center">
                  <p className="text-xl font-black text-[#9B2A4C] dark:text-rose-400">3+ Years</p>
                  <p className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Experience</p>
                </div>
                <div className="p-3.5 rounded-2xl bg-gray-50 dark:bg-[#0B0F17] border border-gray-100 dark:border-gray-800 text-center">
                  <p className="text-xl font-black text-[#9B2A4C] dark:text-rose-400">60% Cost</p>
                  <p className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Reduction Avg</p>
                </div>
                <div className="p-3.5 rounded-2xl bg-gray-50 dark:bg-[#0B0F17] border border-gray-100 dark:border-gray-800 text-center">
                  <p className="text-xl font-black text-[#9B2A4C] dark:text-rose-400">100+ Hours</p>
                  <p className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Saved / Month</p>
                </div>
                <div className="p-3.5 rounded-2xl bg-gray-50 dark:bg-[#0B0F17] border border-gray-100 dark:border-gray-800 text-center">
                  <p className="text-xl font-black text-[#9B2A4C] dark:text-rose-400">24/7 AI</p>
                  <p className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Automations</p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <Link
                  to="/contact"
                  className="gradient-bg text-white font-bold px-6 py-3 rounded-full hover:scale-105 transition-all text-xs uppercase tracking-wider shadow-lg shadow-[#9B2A4C]/20"
                >
                  <i className="ri-send-plane-fill mr-1.5" /> Work With Me
                </Link>
                <a
                  href="mailto:alvintrank95@gmail.com"
                  className="px-5 py-3 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-[#1C2526] dark:text-white font-bold text-xs transition-colors flex items-center gap-2"
                >
                  <i className="ri-mail-line text-[#9B2A4C] dark:text-rose-400" />
                  alvintrank95@gmail.com
                </a>
                <a
                  href="https://www.linkedin.com/in/alvin-tran-95"
                  target="_blank"
                  rel="noreferrer"
                  className="px-4 py-3 rounded-full border border-gray-300 dark:border-gray-700 hover:border-[#9B2A4C] text-[#5A6A72] dark:text-gray-300 font-bold text-xs transition-colors flex items-center gap-1.5"
                >
                  <i className="ri-linkedin-box-fill text-indigo-600" />
                  LinkedIn
                </a>
              </div>

            </div>

          </div>
        </section>

        {/* Section 1: What I Can Help You With */}
        <section className="space-y-8">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="text-[10px] font-bold tracking-widest uppercase text-[#9B2A4C] dark:text-rose-400 px-3.5 py-1 rounded-full bg-[#9B2A4C]/10 dark:bg-rose-400/10 border border-[#9B2A4C]/20 dark:border-rose-400/30">
              Core Services
            </span>
            <h2 className="text-3xl md:text-5xl font-black text-[#1C2526] dark:text-white tracking-tight">
              What I Can <span className="text-[#9B2A4C] dark:text-rose-400">Help You With</span>
            </h2>
            <p className="text-sm md:text-base text-[#5A6A72] dark:text-gray-300 leading-relaxed">
              High-performance web development and AI automation solutions for businesses that need to scale efficiently. From cutting operational costs by 60% to boosting conversions, I help you focus on strategic growth while technology works for you.
            </p>
          </div>

          {/* 5 Service Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((svc) => (
              <div
                key={svc.id}
                className="group relative p-7 rounded-3xl bg-white dark:bg-[#131B2E] border border-gray-200/80 dark:border-gray-800 hover:border-[#9B2A4C]/40 dark:hover:border-rose-400/40 shadow-lg hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
              >
                <div className="space-y-5">
                  {/* Top Badge & Icon */}
                  <div className="flex items-center justify-between">
                    <div className={`w-12 h-12 rounded-2xl bg-gradient-to-tr ${svc.gradient} text-white flex items-center justify-center text-xl shadow-md group-hover:scale-110 transition-transform duration-300`}>
                      <i className={svc.icon} />
                    </div>
                    <span className="text-2xl font-black text-gray-200 dark:text-gray-800 group-hover:text-[#9B2A4C]/30 transition-colors">
                      {svc.num}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="text-lg font-extrabold text-[#1C2526] dark:text-white group-hover:text-[#9B2A4C] dark:group-hover:text-rose-400 transition-colors">
                    {svc.title}
                  </h3>

                  {/* Bullet points */}
                  <ul className="space-y-3">
                    {svc.bullets.map((bullet, idx) => (
                      <li key={idx} className="flex items-start gap-2.5 text-xs text-[#5A6A72] dark:text-gray-300 leading-relaxed">
                        <i className="ri-checkbox-circle-fill text-[#9B2A4C] dark:text-rose-400 text-sm shrink-0 mt-0.5" />
                        <span>{bullet}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-6 mt-6 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between">
                  <span className="text-[11px] font-bold text-gray-400 group-hover:text-[#9B2A4C] dark:group-hover:text-rose-400 transition-colors">
                    Proven Solution
                  </span>
                  <Link
                    to="/contact"
                    className="text-xs font-bold text-[#9B2A4C] dark:text-rose-400 group-hover:translate-x-1 transition-transform flex items-center gap-1"
                  >
                    Discuss Project <i className="ri-arrow-right-line" />
                  </Link>
                </div>
              </div>
            ))}

            {/* Callout Card filling 6th slot */}
            <div className="p-7 rounded-3xl bg-gradient-to-br from-[#9B2A4C] to-rose-700 text-white shadow-xl flex flex-col justify-between relative overflow-hidden">
              <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full blur-2xl pointer-events-none" />
              
              <div className="space-y-4 relative z-10">
                <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-xl text-white">
                  <i className="ri-rocket-2-fill" />
                </div>
                <h3 className="text-xl font-black">
                  Need a Tailored AI & Growth Strategy?
                </h3>
                <p className="text-xs text-rose-100 leading-relaxed">
                  Let's analyze your current business bottlenecks and design a custom automation workflow that saves hundreds of manual hours every month.
                </p>
              </div>

              <div className="pt-6 relative z-10">
                <Link
                  to="/contact"
                  className="w-full inline-flex items-center justify-center gap-2 py-3 px-6 rounded-full bg-white text-[#9B2A4C] font-black text-xs uppercase tracking-wider hover:bg-gray-100 transition-all shadow-md"
                >
                  Book Strategy Call <i className="ri-calendar-event-line" />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Section 2: My Journey in Growth & AI Automation */}
        <section className="p-8 md:p-12 rounded-3xl bg-white dark:bg-[#131B2E] border border-gray-200/80 dark:border-gray-800 shadow-xl space-y-10">
          
          <div className="max-w-3xl space-y-3">
            <span className="text-[10px] font-bold tracking-widest uppercase text-[#9B2A4C] dark:text-rose-400 px-3.5 py-1 rounded-full bg-[#9B2A4C]/10 dark:bg-rose-400/10 border border-[#9B2A4C]/20 dark:border-rose-400/30">
              Background & Experience
            </span>
            <h2 className="text-3xl md:text-4xl font-black text-[#1C2526] dark:text-white tracking-tight">
              My Journey in <span className="text-[#9B2A4C] dark:text-rose-400">Growth & AI Automation</span>
            </h2>
            <p className="text-sm md:text-base text-[#5A6A72] dark:text-gray-300 leading-relaxed">
              My path into digital marketing and automation came from a hands-on, entrepreneurial background. I realized early on that combining creative media with data-driven sales strategies from scaling affiliate networks to building high-converting B2B websites, creating the ultimate growth engine. That experience shapes how I approach every project today: structured, automated by AI, and relentlessly focused on measurable ROI and real business growth.
            </p>
          </div>

          {/* Timeline List */}
          <div className="relative border-l-2 border-[#9B2A4C]/30 dark:border-rose-400/30 ml-4 md:ml-6 space-y-8 pl-6 md:pl-8">
            {journey.map((item, index) => (
              <div key={index} className="relative group">
                {/* Timeline Dot */}
                <div className="absolute -left-[31px] md:-left-[39px] top-1.5 w-4 h-4 rounded-full bg-[#9B2A4C] dark:bg-rose-400 border-4 border-white dark:border-[#131B2E] shadow-md group-hover:scale-125 transition-transform" />

                <div className="p-6 rounded-2xl bg-gray-50 dark:bg-[#0B0F17] border border-gray-200/60 dark:border-gray-800 shadow-sm hover:shadow-md transition-all space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <h3 className="text-base md:text-lg font-black text-[#1C2526] dark:text-white group-hover:text-[#9B2A4C] dark:group-hover:text-rose-400 transition-colors">
                        {item.role}
                      </h3>
                      <p className="text-xs font-extrabold text-[#9B2A4C] dark:text-rose-400">
                        {item.company}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold px-3 py-1 rounded-full bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700 shadow-sm">
                        {item.period}
                      </span>
                      <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-[#9B2A4C]/10 dark:bg-rose-400/10 text-[#9B2A4C] dark:text-rose-400 border border-[#9B2A4C]/20 dark:border-rose-400/20">
                        {item.badge}
                      </span>
                    </div>
                  </div>

                  <p className="text-xs md:text-sm text-[#5A6A72] dark:text-gray-300 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>

        </section>

      </main>
      <Footer />
    </div>
  );
}

