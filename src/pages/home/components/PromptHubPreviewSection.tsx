import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { PROMPT_LIBRARY } from '@/pages/prompts/promptData';

export default function PromptHubPreviewSection() {
  const { i18n } = useTranslation();
  const navigate = useNavigate();
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const [customPrompts] = useState<any[]>(() => {
    try {
      const saved = localStorage.getItem('custom_prompts');
      if (saved) return JSON.parse(saved);
    } catch {}
    return [];
  });

  const featuredPrompts = [...customPrompts, ...PROMPT_LIBRARY].slice(0, 3);

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <section id="prompts" className="py-20 md:py-28 border-t border-gray-200/60 dark:border-gray-800/60 transition-colors">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
          <div className="space-y-2">
            <span className="text-[10px] font-bold tracking-widest uppercase text-[#9B2A4C] dark:text-rose-400 px-3 py-1 rounded-full bg-[#9B2A4C]/10 dark:bg-rose-400/10 border border-[#9B2A4C]/20 dark:border-rose-400/30">
              Prompt Hub (Marketing & AI)
            </span>
            <h2 className="text-3xl md:text-5xl font-black text-[#1C2526] dark:text-white tracking-tight">
              Thư Viện <span className="text-[#9B2A4C] dark:text-rose-400">Prompt Hub</span> Thực Chiến
            </h2>
            <p className="text-sm text-[#5A6A72] dark:text-gray-400 max-w-lg">
              Bộ câu lệnh Prompt tối ưu sẵn cho ChatGPT, Claude & DeepSeek giúp nhân 5 hiệu suất làm việc.
            </p>
          </div>

          <Link
            to="/prompts"
            className="inline-flex items-center gap-2 text-xs font-bold text-[#9B2A4C] dark:text-rose-400 hover:underline uppercase tracking-wider shrink-0"
          >
            {i18n.language === 'vi' ? 'Khám phá tất cả Prompts' : 'Explore All Prompts'}
            <i className="ri-arrow-right-line" />
          </Link>
        </div>

        {/* Prompts Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {featuredPrompts.map((item) => (
            <div
              key={item.id}
              className="p-6 rounded-3xl bg-white dark:bg-[#131B2E] border border-gray-200 dark:border-gray-800 shadow-xl flex flex-col justify-between space-y-4 hover:border-[#9B2A4C]/30 dark:hover:border-rose-400/30 transition-all duration-300"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#9B2A4C] dark:text-rose-400 bg-[#9B2A4C]/10 dark:bg-rose-400/10 px-3 py-1 rounded-full border border-[#9B2A4C]/20 dark:border-rose-400/30">
                    {item.category}
                  </span>
                  <span className={`text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full text-white ${item.badgeColor}`}>
                    {item.model}
                  </span>
                </div>

                <h3 className="text-base font-extrabold text-[#1C2526] dark:text-white leading-snug line-clamp-2">
                  {item.title}
                </h3>

                <p className="text-xs text-[#5A6A72] dark:text-gray-400 leading-relaxed line-clamp-2">
                  {item.summary}
                </p>

                {/* Prompt snippet preview box */}
                <div className="p-3 rounded-2xl bg-[#0E1524] text-purple-300 font-mono text-[11px] space-y-1 overflow-hidden border border-gray-800">
                  <div className="text-[9px] text-gray-400 font-bold uppercase">Prompt snippet:</div>
                  <div className="line-clamp-2 italic">"{item.userPrompt}"</div>
                </div>
              </div>

              {/* Actions: Copy Prompt & Open Builder */}
              <div className="pt-4 border-t border-gray-100 dark:border-gray-800/80 flex items-center justify-between gap-2">
                <button
                  onClick={() => handleCopy(item.id, `${item.systemPrompt}\n\n${item.userPrompt}`)}
                  className="flex-1 py-2.5 px-3 rounded-full border border-gray-300 dark:border-gray-700 hover:border-[#9B2A4C] dark:hover:border-rose-400 text-xs font-bold text-[#1C2526] dark:text-white flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                >
                  {copiedId === item.id ? (
                    <>
                      <i className="ri-check-line text-emerald-500" />
                      <span className="text-emerald-500">Đã chép!</span>
                    </>
                  ) : (
                    <>
                      <i className="ri-file-copy-line" /> Sao chép
                    </>
                  )}
                </button>

                <button
                  onClick={() => navigate('/prompts')}
                  className="py-2.5 px-4 rounded-full bg-[#9B2A4C] text-white dark:bg-rose-600 dark:text-white text-xs font-bold hover:scale-105 transition-transform flex items-center gap-1 cursor-pointer shadow-md"
                >
                  <i className="ri-magic-line" /> Thử ngay
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
