import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

// Animated Counter Component (Counts up smoothly from 0 to target value on scroll)
function AnimatedCounter({ end, duration = 2500, suffix = '' }: { end: number; duration?: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
          let startTime: number | null = null;
          const step = (timestamp: number) => {
            if (!startTime) startTime = timestamp;
            const progress = Math.min((timestamp - startTime) / duration, 1);
            // Smooth easeOutCubic curve
            const easeProgress = 1 - Math.pow(1 - progress, 3);
            setCount(Math.floor(easeProgress * end));
            if (progress < 1) {
              requestAnimationFrame(step);
            } else {
              setCount(end);
            }
          };
          requestAnimationFrame(step);
        }
      },
      { threshold: 0.2 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [end, duration]);

  return (
    <span ref={ref}>
      {count.toLocaleString()}
      {suffix}
    </span>
  );
}

// Animated Progress Bar Component (Fills smoothly from 0% width to target % width)
function AnimatedProgressBar({ percent }: { percent: number }) {
  const [width, setWidth] = useState(0);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setTimeout(() => {
            setWidth(percent);
          }, 200);
        }
      },
      { threshold: 0.2 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [percent]);

  return (
    <div ref={ref} className="w-full h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
      <div
        className="h-full bg-gradient-to-r from-[#9B2A4C] to-cyan-400 rounded-full transition-all duration-[2400ms] cubic-bezier(0.16, 1, 0.3, 1)"
        style={{ width: `${width}%` }}
      />
    </div>
  );
}

export default function AboutPreviewSection() {
  const { i18n } = useTranslation();

  return (
    <section id="about" className="py-20 md:py-28 border-t border-gray-200/60 dark:border-gray-800/60 bg-white/40 dark:bg-[#0E1524]/40 transition-colors">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        
        {/* Header Badge */}
        <div className="flex items-center gap-2 mb-3">
          <span className="text-[10px] font-bold tracking-widest uppercase text-[#9B2A4C] dark:text-cyan-400 px-3 py-1 rounded-full bg-[#9B2A4C]/10 dark:bg-cyan-500/10 border border-[#9B2A4C]/20 dark:border-cyan-500/20">
            About the Consultant
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          
          {/* Bio text left */}
          <div className="lg:col-span-7 space-y-6">
            <h2 className="text-3xl md:text-5xl font-black text-[#1C2526] dark:text-white tracking-tight leading-tight">
              Kinh nghiệm thực chiến trong{' '}
              <span className="text-[#9B2A4C] dark:text-cyan-400">AI Marketing</span> & Truyền thông
            </h2>

            <p className="text-sm md:text-base text-[#5A6A72] dark:text-gray-300 leading-relaxed">
              Tôi là <strong>Trần Vũ Quốc Anh (Alvin Tran)</strong> — Marketer & Chuyên gia Tự động hóa AI với hơn 3 năm kinh nghiệm tư vấn và triển khai giải pháp tăng trưởng cho doanh nghiệp. Định hướng kết hợp giữa sáng tạo nội dung truyền thông và sức mạnh công nghệ AI thế hệ mới để mang lại hiệu quả đo lường được.
            </p>

            {/* Stats Bar - 3 Columns with Animated Counter */}
            <div className="grid grid-cols-3 gap-4 pt-4 border-y border-gray-200 dark:border-gray-800 py-6">
              <div className="space-y-1">
                <div className="text-2xl md:text-4xl font-black text-[#9B2A4C] dark:text-cyan-400">
                  <AnimatedCounter end={3} suffix="+" />
                </div>
                <div className="text-[11px] font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  Năm kinh nghiệm
                </div>
              </div>

              <div className="space-y-1">
                <div className="text-2xl md:text-4xl font-black text-[#9B2A4C] dark:text-cyan-400">
                  <AnimatedCounter end={1500} suffix="+" />
                </div>
                <div className="text-[11px] font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  Học viên & Khách hàng
                </div>
              </div>

              <div className="space-y-1">
                <div className="text-2xl md:text-4xl font-black text-[#9B2A4C] dark:text-cyan-400">
                  <AnimatedCounter end={30} suffix="+" />
                </div>
                <div className="text-[11px] font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  Dự án hoàn thành
                </div>
              </div>
            </div>

            {/* Direct Contact Links & CTA Button */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <a
                href="mailto:alvintrank95@gmail.com"
                className="inline-flex items-center gap-2 text-xs font-bold text-[#1C2526] dark:text-white bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 px-4 py-2.5 rounded-full transition-colors"
              >
                <i className="ri-mail-send-line text-[#9B2A4C] dark:text-cyan-400" />
                alvintrank95@gmail.com
              </a>

              <a
                href="https://www.linkedin.com/in/alvin-tran-95"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-[#5A6A72] dark:text-gray-300 hover:text-[#9B2A4C] dark:hover:text-rose-400 border border-gray-300 dark:border-gray-700 px-4 py-2.5 rounded-full transition-colors"
              >
                <i className="ri-linkedin-box-fill text-indigo-600 text-sm" />
                LinkedIn
              </a>

              <Link
                to="/about"
                className="inline-flex items-center gap-2 text-xs font-bold text-[#9B2A4C] dark:text-rose-400 border border-[#9B2A4C]/30 dark:border-rose-400/30 hover:bg-[#9B2A4C]/10 dark:hover:bg-rose-400/10 px-5 py-2.5 rounded-full transition-all"
              >
                {i18n.language === 'vi' ? 'Xem hành trình của tôi (My Story)' : 'Read My Story'}
                <i className="ri-arrow-right-line" />
              </Link>
            </div>
          </div>

          {/* Right Column Highlights / Skills Pills with Animated Progress */}
          <div className="lg:col-span-5 space-y-4">
            <div className="p-6 rounded-3xl bg-white dark:bg-[#131B2E] border border-gray-200 dark:border-gray-800 shadow-xl space-y-5">
              <h3 className="text-base font-extrabold text-[#1C2526] dark:text-white flex items-center gap-2">
                <i className="ri-shield-star-line text-[#9B2A4C] dark:text-cyan-400" />
                Core Capabilities & Focus
              </h3>

              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-xs font-bold mb-1.5 text-gray-700 dark:text-gray-300">
                    <span>AI Strategy & Workflow Automation</span>
                    <span className="text-[#9B2A4C] dark:text-cyan-400">
                      <AnimatedCounter end={95} suffix="%" />
                    </span>
                  </div>
                  <AnimatedProgressBar percent={95} />
                </div>

                <div>
                  <div className="flex justify-between text-xs font-bold mb-1.5 text-gray-700 dark:text-gray-300">
                    <span>Performance Ads & Conversion Rate (CRO)</span>
                    <span className="text-[#9B2A4C] dark:text-cyan-400">
                      <AnimatedCounter end={90} suffix="%" />
                    </span>
                  </div>
                  <AnimatedProgressBar percent={90} />
                </div>

                <div>
                  <div className="flex justify-between text-xs font-bold mb-1.5 text-gray-700 dark:text-gray-300">
                    <span>Web & System Architecture (Odoo, React, Python)</span>
                    <span className="text-[#9B2A4C] dark:text-cyan-400">
                      <AnimatedCounter end={88} suffix="%" />
                    </span>
                  </div>
                  <AnimatedProgressBar percent={88} />
                </div>
              </div>

              <div className="pt-2 flex flex-wrap gap-2">
                <span className="text-[11px] font-bold px-3 py-1 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300">
                  #AI_Marketing
                </span>
                <span className="text-[11px] font-bold px-3 py-1 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300">
                  #n8n_Automations
                </span>
                <span className="text-[11px] font-bold px-3 py-1 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300">
                  #Odoo_ERP
                </span>
                <span className="text-[11px] font-bold px-3 py-1 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300">
                  #Content_Strategy
                </span>
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
