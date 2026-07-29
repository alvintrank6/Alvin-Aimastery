import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { BLOG_POSTS } from '@/pages/blog/blogData';

export default function BlogPreviewSection() {
  const { i18n } = useTranslation();
  const navigate = useNavigate();

  const featuredArticles = BLOG_POSTS.slice(0, 3);

  return (
    <section id="blog" className="py-20 md:py-28 border-t border-gray-200/60 dark:border-gray-800/60 bg-white/30 dark:bg-[#0B0F17]/30 transition-colors">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
          <div className="space-y-2">
            <span className="text-[10px] font-bold tracking-widest uppercase text-[#9B2A4C] dark:text-cyan-400 px-3 py-1 rounded-full bg-[#9B2A4C]/10 dark:bg-cyan-500/10 border border-[#9B2A4C]/20 dark:border-cyan-500/20">
              Knowledge & Insights
            </span>
            <h2 className="text-3xl md:text-5xl font-black text-[#1C2526] dark:text-white tracking-tight">
              Bài Viết & <span className="text-[#9B2A4C] dark:text-cyan-400">Chia Sẻ Hot</span>
            </h2>
            <p className="text-sm text-[#5A6A72] dark:text-gray-400 max-w-lg">
              Cập nhật các chủ đề hot nhất trên mạng xã hội, xu hướng AI & chiến lược truyền thông mới nhất.
            </p>
          </div>

          <Link
            to="/blog"
            className="inline-flex items-center gap-2 text-xs font-bold text-[#9B2A4C] dark:text-cyan-400 hover:underline uppercase tracking-wider shrink-0"
          >
            {i18n.language === 'vi' ? 'Xem tất cả bài viết' : 'Read All Articles'}
            <i className="ri-arrow-right-line" />
          </Link>
        </div>

        {/* Blog Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {featuredArticles.map((item) => (
            <article
              key={item.id}
              onClick={() => navigate(`/blog/${item.id}`)}
              className="group cursor-pointer rounded-3xl bg-white dark:bg-[#131B2E] border border-gray-200 dark:border-gray-800 shadow-xl hover:shadow-2xl hover:border-[#9B2A4C]/30 dark:hover:border-cyan-500/30 transition-all duration-300 flex flex-col justify-between overflow-hidden"
            >
              <div className="space-y-4">
                {/* Article Cover Image */}
                <div className="relative aspect-video overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.title}
                    onError={(e) => {
                      e.currentTarget.src = 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80';
                    }}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <span className="absolute top-3 left-3 text-[10px] font-extrabold uppercase px-3 py-1 rounded-full bg-black/60 backdrop-blur-md text-white border border-white/20">
                    {item.category}
                  </span>
                </div>

                <div className="p-6 pt-0 space-y-3">
                  <div className="flex items-center justify-between text-[11px] font-bold text-gray-500 dark:text-gray-400">
                    <span>{item.date}</span>
                    <span className="flex items-center gap-1">
                      <i className="ri-time-line" /> {item.readTime}
                    </span>
                  </div>

                  <h3 className="text-base font-extrabold text-[#1C2526] dark:text-white group-hover:text-[#9B2A4C] dark:group-hover:text-cyan-400 transition-colors leading-snug line-clamp-2">
                    {item.title}
                  </h3>

                  <p className="text-xs text-[#5A6A72] dark:text-gray-400 leading-relaxed line-clamp-3">
                    {item.excerpt}
                  </p>
                </div>
              </div>

              <div className="p-6 pt-4 border-t border-gray-100 dark:border-gray-800/80 flex items-center justify-between text-xs font-bold text-[#1C2526] dark:text-gray-300">
                <div className="flex items-center gap-2">
                  <img
                    src={item.authorAvatar}
                    alt={item.author}
                    className="w-6 h-6 rounded-full object-cover border border-[#9B2A4C]"
                  />
                  <span className="text-[11px] text-gray-400">{item.author}</span>
                </div>

                <span className="text-[#9B2A4C] dark:text-cyan-400 inline-flex items-center gap-1 group-hover:gap-2 transition-all">
                  Đọc chi tiết <i className="ri-arrow-right-line" />
                </span>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
