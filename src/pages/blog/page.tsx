import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/feature/Navbar';
import Footer from '@/components/feature/Footer';
import { BLOG_POSTS, BlogPost } from './blogData';
import { useTranslation } from 'react-i18next';

export default function BlogPage() {
  const { i18n } = useTranslation();
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState<string>('Tất cả');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const categories = ['Tất cả', 'AI Trends', 'Social Viral', 'Automation', 'E-Commerce', 'SEO & AI', 'AI Visuals'];

  const filteredPosts = useMemo(() => {
    return BLOG_POSTS.filter((post) => {
      const matchCat = selectedCategory === 'Tất cả' || post.category === selectedCategory;
      const matchQuery =
        searchQuery.trim() === '' ||
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchCat && matchQuery;
    });
  }, [selectedCategory, searchQuery]);

  const featuredPost = BLOG_POSTS[0];

  return (
    <div className="min-h-screen pt-28 pb-12 transition-colors">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 md:px-8 space-y-12 pb-20 md:pb-28">
        {/* Page Header Banner */}
        <div className="space-y-4 text-center max-w-3xl mx-auto">
          <span className="text-[10px] font-bold tracking-widest uppercase text-[#9B2A4C] dark:text-cyan-400 px-3.5 py-1 rounded-full bg-[#9B2A4C]/10 dark:bg-cyan-500/10 border border-[#9B2A4C]/20 dark:border-cyan-500/20">
            Xu Hướng & Kiến Thức Hot
          </span>
          <h1 className="text-3xl md:text-5xl font-black text-[#1C2526] dark:text-white tracking-tight leading-tight">
            Blog <span className="text-[#9B2A4C] dark:text-cyan-400">AI & Digital Marketing</span>
          </h1>
          <p className="text-sm md:text-base text-[#5A6A72] dark:text-gray-400 leading-relaxed">
            Tổng hợp những chủ đề hot nhất trên mạng xã hội, xu hướng AI mới nhất và chiến thuật tự động hóa tăng trưởng thực chiến.
          </p>
        </div>

        {/* Featured Top Article (If no search query) */}
        {!searchQuery && selectedCategory === 'Tất cả' && featuredPost && (
          <div
            onClick={() => navigate(`/blog/${featuredPost.id}`)}
            className="group cursor-pointer p-6 md:p-8 rounded-3xl bg-white dark:bg-[#131B2E] border border-gray-200 dark:border-gray-800 shadow-2xl hover:shadow-cyan-500/10 hover:border-[#9B2A4C]/40 dark:hover:border-cyan-500/40 transition-all duration-300 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center"
          >
            <div className="lg:col-span-7 relative aspect-video rounded-2xl overflow-hidden shadow-lg bg-slate-200 dark:bg-slate-800">
              <img
                src={featuredPost.image}
                alt=""
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&auto=format&fit=crop&q=80';
                }}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <span className="absolute top-4 left-4 text-xs font-black uppercase tracking-wider px-3.5 py-1.5 rounded-full bg-[#9B2A4C] text-white shadow-lg">
                🔥 Hot Trend 2026
              </span>
            </div>

            <div className="lg:col-span-5 space-y-4">
              <div className="flex items-center gap-3 text-xs font-bold text-gray-500 dark:text-gray-400">
                <span className="text-[#9B2A4C] dark:text-cyan-400 uppercase tracking-wider">
                  {featuredPost.category}
                </span>
                <span>•</span>
                <span>{featuredPost.readTime}</span>
                <span>•</span>
                <span>{featuredPost.date}</span>
              </div>

              <h2 className="text-xl md:text-3xl font-black text-[#1C2526] dark:text-white group-hover:text-[#9B2A4C] dark:group-hover:text-cyan-400 transition-colors leading-tight">
                {featuredPost.title}
              </h2>

              <p className="text-xs md:text-sm text-[#5A6A72] dark:text-gray-300 leading-relaxed line-clamp-3">
                {featuredPost.excerpt}
              </p>

              <div className="pt-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <img
                    src={featuredPost.authorAvatar}
                    alt={featuredPost.author}
                    className="w-8 h-8 rounded-full object-cover border border-[#9B2A4C]"
                  />
                  <span className="text-xs font-bold text-[#1C2526] dark:text-gray-300">
                    {featuredPost.author}
                  </span>
                </div>

                <span className="text-xs font-bold text-[#9B2A4C] dark:text-cyan-400 inline-flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                  Đọc ngay <i className="ri-arrow-right-line" />
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Filter Controls (Category Tabs & Search Input) */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-4 border-t border-gray-200/60 dark:border-gray-800/60">
          {/* Category Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 no-scrollbar">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-full text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-[#9B2A4C] text-white shadow-md'
                    : 'bg-white dark:bg-slate-900 border border-gray-200 dark:border-gray-800 text-gray-600 dark:text-gray-300 hover:border-[#9B2A4C]/50'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search Bar */}
          <div className="relative w-full md:w-72">
            <i className="ri-search-line absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm bài viết, từ khóa..."
              className="w-full pl-10 pr-4 py-2 rounded-full bg-white dark:bg-slate-900 border border-gray-200 dark:border-gray-800 text-xs font-medium text-[#1C2526] dark:text-white focus:outline-none focus:border-[#9B2A4C] dark:focus:border-cyan-400 shadow-sm"
            />
          </div>
        </div>

        {/* Blog Posts Grid */}
        {filteredPosts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPosts.map((post) => (
              <article
                key={post.id}
                onClick={() => navigate(`/blog/${post.id}`)}
                className="group cursor-pointer rounded-3xl bg-white dark:bg-[#131B2E] border border-gray-200 dark:border-gray-800 shadow-xl hover:shadow-2xl hover:border-[#9B2A4C]/40 dark:hover:border-cyan-500/40 transition-all duration-300 flex flex-col justify-between overflow-hidden"
              >
                <div className="space-y-4">
                  {/* Image Cover */}
                  <div className="relative aspect-video overflow-hidden bg-slate-200 dark:bg-slate-800">
                    <img
                      src={post.image}
                      alt=""
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80';
                      }}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <span className="absolute top-3 left-3 text-[10px] font-extrabold uppercase px-3 py-1 rounded-full bg-black/60 backdrop-blur-md text-white border border-white/20">
                      {post.category}
                    </span>
                  </div>

                  {/* Content Info */}
                  <div className="p-6 pt-0 space-y-3">
                    <div className="flex items-center justify-between text-[11px] font-bold text-gray-400">
                      <span className="flex items-center gap-1">
                        <i className="ri-calendar-line" /> {post.date}
                      </span>
                      <span className="flex items-center gap-1">
                        <i className="ri-time-line" /> {post.readTime}
                      </span>
                    </div>

                    <h3 className="text-base font-extrabold text-[#1C2526] dark:text-white group-hover:text-[#9B2A4C] dark:group-hover:text-cyan-400 transition-colors leading-snug line-clamp-2">
                      {post.title}
                    </h3>

                    <p className="text-xs text-[#5A6A72] dark:text-gray-400 leading-relaxed line-clamp-3">
                      {post.excerpt}
                    </p>
                  </div>
                </div>

                {/* Card Footer */}
                <div className="p-6 pt-4 border-t border-gray-100 dark:border-gray-800/80 flex items-center justify-between text-xs font-bold">
                  <div className="flex items-center gap-2">
                    <img
                      src={post.authorAvatar}
                      alt={post.author}
                      className="w-6 h-6 rounded-full object-cover border border-[#9B2A4C]"
                    />
                    <span className="text-[11px] text-gray-500 dark:text-gray-400">{post.author}</span>
                  </div>

                  <span className="text-[#9B2A4C] dark:text-cyan-400 inline-flex items-center gap-1 group-hover:gap-2 transition-all">
                    Xem chi tiết <i className="ri-arrow-right-line" />
                  </span>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 space-y-3">
            <i className="ri-article-line text-4xl text-gray-300" />
            <div className="text-base font-bold text-gray-600 dark:text-gray-300">
              Không tìm thấy bài viết phù hợp
            </div>
            <p className="text-xs text-gray-400">Hãy thử chọn danh mục khác hoặc thay đổi từ khóa tìm kiếm.</p>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
