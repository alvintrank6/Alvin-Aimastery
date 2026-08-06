import React, { useState, useMemo } from 'react';
import Navbar from '@/components/feature/Navbar';
import Footer from '@/components/feature/Footer';
import { PROMPT_LIBRARY, PromptItem } from './promptData';
import { useTranslation } from 'react-i18next';

export default function PromptsPage() {
  const { i18n } = useTranslation();
  const [selectedCategory, setSelectedCategory] = useState<string>('Tất cả');
  const [selectedModel, setSelectedModel] = useState<string>('Tất cả');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [activeModalPrompt, setActiveModalPrompt] = useState<PromptItem | null>(null);
  const [customValues, setCustomValues] = useState<Record<string, string>>({});
  const [activeTabMap, setActiveTabMap] = useState<Record<string, 'user' | 'system' | 'example'>>({});

  const categories = ['Tất cả', 'Marketing & Sales', 'Content & Social', 'AI Automation', 'SEO & Copywriting', 'Consulting & Code'];
  const models = ['Tất cả', 'ChatGPT 4o', 'Claude 3.5 Sonnet', 'DeepSeek R1', 'Midjourney v7'];

  const allPrompts = useMemo(() => {
    try {
      const saved = localStorage.getItem('custom_prompts');
      if (saved) {
        const parsed: PromptItem[] = JSON.parse(saved);
        return [...parsed, ...PROMPT_LIBRARY];
      }
    } catch {
      // fallback
    }
    return PROMPT_LIBRARY;
  }, []);

  const filteredPrompts = useMemo(() => {
    return allPrompts.filter((item) => {
      const matchCat = selectedCategory === 'Tất cả' || item.category === selectedCategory;
      const matchModel = selectedModel === 'Tất cả' || item.model === selectedModel;
      const matchSearch =
        searchQuery.trim() === '' ||
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.userPrompt.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCat && matchModel && matchSearch;
    });
  }, [allPrompts, selectedCategory, selectedModel, searchQuery]);

  const handleCopyText = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const getCustomizedPrompt = (prompt: PromptItem) => {
    let result = prompt.userPrompt;
    prompt.variables.forEach((v) => {
      const val = customValues[v.name] || `[${v.label}]`;
      result = result.replace(new RegExp(`\\[${v.label}\\]|\\[${v.placeholder}\\]`, 'g'), val);
    });
    return result;
  };

  const openPromptModal = (prompt: PromptItem) => {
    setActiveModalPrompt(prompt);
    const initialVals: Record<string, string> = {};
    prompt.variables.forEach((v) => {
      initialVals[v.name] = '';
    });
    setCustomValues(initialVals);
  };

  return (
    <div className="min-h-screen pt-28 pb-12 transition-colors">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 md:px-8 space-y-12 pb-20 md:pb-28">
        {/* Header Banner */}
        <div className="space-y-4 text-center max-w-3xl mx-auto">
          <span className="text-[10px] font-bold tracking-widest uppercase text-[#9B2A4C] dark:text-rose-400 px-3.5 py-1 rounded-full bg-[#9B2A4C]/10 dark:bg-rose-400/10 border border-[#9B2A4C]/20 dark:border-rose-400/30">
            AI Prompt Engineering Library
          </span>
          <h1 className="text-3xl md:text-5xl font-black text-[#1C2526] dark:text-white tracking-tight">
            Thư Viện <span className="text-[#9B2A4C] dark:text-rose-400">Prompt Hub Cao Cấp</span>
          </h1>
          <p className="text-sm md:text-base text-[#5A6A72] dark:text-gray-400 leading-relaxed">
            Bộ câu lệnh Prompt tối ưu sẵn cho ChatGPT-4o, Claude 3.5, DeepSeek R1 & Midjourney v7 giúp bạn x5 năng suất Marketing & Automation.
          </p>
        </div>

        {/* Filter Controls (Category Tabs, Model Dropdown & Search) */}
        <div className="p-6 rounded-3xl bg-white dark:bg-[#131B2E] border border-gray-200 dark:border-gray-800 shadow-xl space-y-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            {/* Search Input */}
            <div className="relative w-full md:w-80">
              <i className="ri-search-line absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Tìm câu lệnh, sản phẩm, ngành..."
                className="w-full pl-10 pr-4 py-2.5 rounded-full bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-gray-700 text-xs font-medium text-[#1C2526] dark:text-white focus:outline-none focus:border-[#9B2A4C] dark:focus:border-rose-400 shadow-sm"
              />
            </div>

            {/* Model Filter Buttons */}
            <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0">
              <span className="text-xs font-bold text-gray-400 shrink-0">Model AI:</span>
              {models.map((m) => (
                <button
                  key={m}
                  onClick={() => setSelectedModel(m)}
                  className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                    selectedModel === m
                      ? 'bg-[#1C2526] text-white dark:bg-rose-600 dark:text-white shadow-md'
                      : 'bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200'
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>

          {/* Category Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pt-2 border-t border-gray-100 dark:border-gray-800/80 no-scrollbar">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-full text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-[#9B2A4C] text-white shadow-md'
                    : 'bg-gray-100 dark:bg-slate-800/60 text-gray-600 dark:text-gray-300 hover:border-[#9B2A4C]/40'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Prompt Grid */}
        {filteredPrompts.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {filteredPrompts.map((item) => {
              const activeTab = activeTabMap[item.id] || 'user';

              return (
                <div
                  key={item.id}
                  className="rounded-3xl bg-white dark:bg-[#131B2E] border border-gray-200 dark:border-gray-800 shadow-xl hover:shadow-2xl transition-all duration-300 p-6 md:p-8 flex flex-col justify-between space-y-6"
                >
                  {/* Top Badges & Title */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between gap-2 flex-wrap">
                      <span className="text-[10px] font-extrabold uppercase px-3 py-1 rounded-full bg-[#9B2A4C]/10 text-[#9B2A4C] dark:bg-rose-400/10 dark:text-rose-400 border border-[#9B2A4C]/20 dark:border-rose-400/30">
                        {item.category}
                      </span>
                      <span className={`text-[10px] font-black uppercase px-3 py-1 rounded-full text-white ${item.badgeColor}`}>
                        {item.model}
                      </span>
                    </div>

                    {item.imageUrl && (
                      <div className="relative w-full h-48 rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-800 shadow-inner group">
                        <img
                          src={item.imageUrl}
                          alt={item.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                    )}

                    <h2 className="text-lg md:text-xl font-extrabold text-[#1C2526] dark:text-white leading-snug">
                      {item.title}
                    </h2>

                    <p className="text-xs md:text-sm text-[#5A6A72] dark:text-gray-300 leading-relaxed">
                      {item.summary}
                    </p>

                    {/* Inner Tabs for Prompt Content */}
                    <div className="space-y-2 pt-2">
                      <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-800 pb-2">
                        <div className="flex gap-2">
                          <button
                            onClick={() => setActiveTabMap({ ...activeTabMap, [item.id]: 'user' })}
                            className={`text-xs font-bold px-3 py-1 rounded-lg transition-colors cursor-pointer ${
                              activeTab === 'user'
                                ? 'bg-[#9B2A4C]/10 text-[#9B2A4C] dark:bg-rose-400/10 dark:text-rose-400'
                                : 'text-gray-400 hover:text-gray-600'
                            }`}
                          >
                            User Prompt
                          </button>
                          <button
                            onClick={() => setActiveTabMap({ ...activeTabMap, [item.id]: 'system' })}
                            className={`text-xs font-bold px-3 py-1 rounded-lg transition-colors cursor-pointer ${
                              activeTab === 'system'
                                ? 'bg-[#9B2A4C]/10 text-[#9B2A4C] dark:bg-rose-400/10 dark:text-rose-400'
                                : 'text-gray-400 hover:text-gray-600'
                            }`}
                          >
                            System Prompt
                          </button>
                          <button
                            onClick={() => setActiveTabMap({ ...activeTabMap, [item.id]: 'example' })}
                            className={`text-xs font-bold px-3 py-1 rounded-lg transition-colors cursor-pointer ${
                              activeTab === 'example'
                                ? 'bg-[#9B2A4C]/10 text-[#9B2A4C] dark:bg-rose-400/10 dark:text-rose-400'
                                : 'text-gray-400 hover:text-gray-600'
                            }`}
                          >
                            Mẫu Kết Quả
                          </button>
                        </div>

                        {/* Copy Current Tab Button */}
                        <button
                          onClick={() => {
                            const textToCopy =
                              activeTab === 'user'
                                ? item.userPrompt
                                : activeTab === 'system'
                                ? item.systemPrompt
                                : item.exampleOutput;
                            handleCopyText(`${item.id}-${activeTab}`, textToCopy);
                          }}
                          className="text-xs font-bold text-[#9B2A4C] dark:text-rose-400 hover:underline flex items-center gap-1 cursor-pointer"
                        >
                          {copiedId === `${item.id}-${activeTab}` ? (
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
                      </div>

                      {/* Tab Content Code Block */}
                      <div className="relative p-4 rounded-2xl bg-[#0E1524] text-gray-200 text-xs font-mono overflow-x-auto max-h-48 border border-gray-800 leading-relaxed select-all">
                        <pre className="whitespace-pre-wrap font-sans text-xs">
                          {activeTab === 'user'
                            ? item.userPrompt
                            : activeTab === 'system'
                            ? item.systemPrompt
                            : item.exampleOutput}
                        </pre>
                      </div>
                    </div>
                  </div>

                  {/* Actions Footer */}
                  <div className="pt-4 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between gap-3">
                    <button
                      onClick={() => openPromptModal(item)}
                      className="px-5 py-2.5 rounded-full bg-[#1C2526] dark:bg-rose-600 text-white font-bold text-xs hover:scale-105 transition-all flex items-center gap-1.5 cursor-pointer shadow-md"
                    >
                      <i className="ri-[#9B2A4C] ri-magic-line" /> Điền Thông Số & Test Prompt
                    </button>

                    <button
                      onClick={() => handleCopyText(item.id, `${item.systemPrompt}\n\n${item.userPrompt}`)}
                      className="px-4 py-2.5 rounded-full border border-gray-200 dark:border-gray-700 text-xs font-bold text-gray-700 dark:text-gray-300 hover:border-[#9B2A4C] transition-colors cursor-pointer"
                    >
                      Copy All Prompt
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-16 space-y-3">
            <i className="ri-code-s-slash-line text-4xl text-gray-300" />
            <div className="text-base font-bold text-gray-600 dark:text-gray-300">
              Không tìm thấy Prompt phù hợp
            </div>
            <p className="text-xs text-gray-400">Hãy chọn danh mục khác hoặc thay đổi từ khóa tìm kiếm.</p>
          </div>
        )}
      </main>

      {/* Interactive Prompt Builder Modal */}
      {activeModalPrompt && (
        <div
          onClick={() => setActiveModalPrompt(null)}
          className="fixed inset-0 z-[99990] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-3xl rounded-3xl bg-white dark:bg-[#131B2E] border border-gray-200 dark:border-gray-800 shadow-2xl p-6 md:p-8 space-y-6 max-h-[90vh] overflow-y-auto select-text pointer-events-auto"
          >
            {/* Modal Header */}
            <div className="flex items-start justify-between gap-4 border-b border-gray-100 dark:border-gray-800 pb-4">
              <div>
                <span className="text-[10px] font-extrabold uppercase px-3 py-1 rounded-full bg-[#9B2A4C]/10 text-[#9B2A4C] dark:bg-rose-400/10 dark:text-rose-400">
                  {activeModalPrompt.category}
                </span>
                <h3 className="text-lg md:text-2xl font-black text-[#1C2526] dark:text-white mt-2">
                  {activeModalPrompt.title}
                </h3>
              </div>
              <button
                onClick={() => setActiveModalPrompt(null)}
                className="w-8 h-8 rounded-full bg-gray-100 dark:bg-slate-800 flex items-center justify-center text-gray-500 hover:text-black dark:hover:text-white transition-colors cursor-pointer shrink-0"
              >
                <i className="ri-close-line text-lg" />
              </button>
            </div>

            {/* Input Variables Form */}
            <div className="space-y-4">
              <h4 className="text-xs font-extrabold uppercase tracking-wider text-[#9B2A4C] dark:text-rose-400">
                1. Điền Thông Số Sản Phẩm / Dịch Vụ Của Bạn
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {activeModalPrompt.variables.map((v) => (
                  <div key={v.name} className="space-y-1.5">
                    <label className="text-xs font-bold text-[#1C2526] dark:text-gray-300">
                      {v.label}
                    </label>
                    <input
                      type="text"
                      value={customValues[v.name] || ''}
                      onChange={(e) =>
                        setCustomValues({ ...customValues, [v.name]: e.target.value })
                      }
                      placeholder={v.placeholder}
                      className="w-full px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-gray-700 text-xs text-[#1C2526] dark:text-white focus:outline-none focus:border-[#9B2A4C] dark:focus:border-rose-400 select-text cursor-text relative z-10 pointer-events-auto"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Generated Custom Prompt Output */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-extrabold uppercase tracking-wider text-[#9B2A4C] dark:text-rose-400">
                  2. Câu Lệnh Đã Được Tối Ưu Hóa (Sẵn Sàng Copy)
                </h4>
                <button
                  onClick={() =>
                    handleCopyText(
                      'modal-custom',
                      `${activeModalPrompt.systemPrompt}\n\n${getCustomizedPrompt(activeModalPrompt)}`
                    )
                  }
                  className="px-4 py-1.5 rounded-full bg-[#9B2A4C] dark:bg-rose-600 text-white font-bold text-xs hover:scale-105 transition-transform flex items-center gap-1 cursor-pointer"
                >
                  {copiedId === 'modal-custom' ? (
                    <>
                      <i className="ri-check-line" /> Đã Copy!
                    </>
                  ) : (
                    <>
                      <i className="ri-file-copy-line" /> Copy Prompt Hoàn Chỉnh
                    </>
                  )}
                </button>
              </div>

              <div className="p-4 rounded-2xl bg-[#0E1524] text-purple-300 font-mono text-xs max-h-60 overflow-y-auto border border-gray-800 leading-relaxed whitespace-pre-wrap">
                {activeModalPrompt.systemPrompt}
                {'\n\n'}
                {getCustomizedPrompt(activeModalPrompt)}
              </div>
            </div>

            {/* Usage Guide Notice */}
            <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-300 text-xs leading-relaxed flex items-start gap-2">
              <i className="ri-information-line text-base shrink-0 mt-0.5" />
              <span>{activeModalPrompt.usageGuide}</span>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
