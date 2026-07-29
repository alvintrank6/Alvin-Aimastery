import React, { useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Navbar from '@/components/feature/Navbar';
import Footer from '@/components/feature/Footer';
import { BLOG_POSTS, BlogPost } from './blogData';
import { useTranslation } from 'react-i18next';

export const BlogPostDetail: React.FC = () => {
  const { postId } = useParams<{ postId: string }>();
  const navigate = useNavigate();
  const { i18n } = useTranslation();

  const post: BlogPost | undefined = BLOG_POSTS.find((item) => item.id === postId);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [postId]);

  if (!post) {
    return (
      <div className="min-h-screen pt-28 pb-12 transition-colors">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-6">
          <div className="text-6xl font-black text-[#9B2A4C] dark:text-cyan-400">404</div>
          <h1 className="text-2xl font-bold text-[#1C2526] dark:text-white">
            Bài viết không tồn tại hoặc đã bị gỡ bỏ
          </h1>
          <p className="text-gray-500 text-sm">
            Rất tiếc, bài viết bạn đang tìm kiếm không tìm thấy trong hệ thống.
          </p>
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#9B2A4C] text-white font-bold text-xs uppercase tracking-wider shadow-lg hover:scale-105 transition-transform"
          >
            <i className="ri-arrow-left-line" /> Quay lại trang Blog
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  // Related posts (excluding current post)
  const relatedPosts = BLOG_POSTS.filter((p) => p.id !== post.id).slice(0, 3);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    alert('Đã sao chép đường dẫn bài viết!');
  };

  return (
    <div className="min-h-screen pt-28 pb-12 transition-colors">
      <Navbar />

      <main className="max-w-4xl mx-auto px-4 md:px-6 space-y-10 pb-20">
        {/* Navigation back */}
        <div>
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 text-xs font-bold text-gray-500 hover:text-[#9B2A4C] dark:text-gray-400 dark:hover:text-cyan-400 transition-colors uppercase tracking-wider"
          >
            <i className="ri-arrow-left-line text-sm" /> Tất cả bài viết
          </Link>
        </div>

        {/* Header Metadata */}
        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-3 text-xs font-bold">
            <span className="px-3.5 py-1 rounded-full bg-[#9B2A4C]/10 dark:bg-cyan-500/10 text-[#9B2A4C] dark:text-cyan-400 border border-[#9B2A4C]/20 dark:border-cyan-500/20 uppercase tracking-wider">
              {post.category}
            </span>
            <span className="text-gray-400">•</span>
            <span className="text-gray-500 dark:text-gray-400 flex items-center gap-1">
              <i className="ri-calendar-line" /> {post.date}
            </span>
            <span className="text-gray-400">•</span>
            <span className="text-gray-500 dark:text-gray-400 flex items-center gap-1">
              <i className="ri-time-line" /> {post.readTime}
            </span>
            <span className="text-gray-400">•</span>
            <span className="text-gray-500 dark:text-gray-400 flex items-center gap-1">
              <i className="ri-eye-line" /> {post.views.toLocaleString()} lượt xem
            </span>
          </div>

          <h1 className="text-2xl md:text-4xl lg:text-5xl font-black text-[#1C2526] dark:text-white leading-tight tracking-tight">
            {post.title}
          </h1>

          {/* Author Badge */}
          <div className="flex items-center gap-3 pt-2">
            <img
              src={post.authorAvatar}
              alt={post.author}
              onError={(e) => {
                e.currentTarget.src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80';
              }}
              className="w-11 h-11 rounded-full object-cover border-2 border-[#9B2A4C] dark:border-cyan-400 shadow-md"
            />
            <div>
              <div className="text-xs font-bold text-[#1C2526] dark:text-white">{post.author}</div>
              <div className="text-[11px] text-gray-500 dark:text-gray-400">{post.authorTitle}</div>
            </div>
          </div>
        </div>

        {/* Cover Image Banner */}
        <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-gray-200 dark:border-gray-800 aspect-video">
          <img
            src={post.image}
            alt={post.title}
            onError={(e) => {
              e.currentTarget.src = 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80';
            }}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Article Intro Callout Box */}
        <div className="p-6 rounded-2xl bg-[#9B2A4C]/5 dark:bg-cyan-500/5 border-l-4 border-[#9B2A4C] dark:border-cyan-400 space-y-2">
          <h4 className="text-xs font-black uppercase tracking-wider text-[#9B2A4C] dark:text-cyan-400 flex items-center gap-1.5">
            <i className="ri-bookmark-3-line" /> Tóm tắt nội dung chính
          </h4>
          <p className="text-sm md:text-base font-semibold text-[#1C2526] dark:text-gray-200 leading-relaxed italic">
            "{post.content.intro}"
          </p>
        </div>

        {/* Article Body Sections */}
        <div className="space-y-8 text-[#1C2526] dark:text-gray-200 leading-relaxed">
          {post.content.sections.map((sec, idx) => (
            <div key={idx} className="space-y-4">
              <h2 className="text-xl md:text-2xl font-extrabold text-[#1C2526] dark:text-white tracking-tight">
                {sec.heading}
              </h2>
              <p className="text-sm md:text-base text-[#5A6A72] dark:text-gray-300 leading-relaxed">
                {sec.body}
              </p>

              {sec.image && (
                <div className="my-6 rounded-2xl overflow-hidden shadow-lg border border-gray-200 dark:border-gray-800">
                  <img src={sec.image} alt={sec.heading} className="w-full h-auto object-cover max-h-[450px]" />
                </div>
              )}

              {sec.quote && (
                <blockquote className="p-5 my-4 rounded-2xl bg-white dark:bg-[#131B2E] border border-gray-200 dark:border-gray-800 shadow-md font-medium text-sm text-[#9B2A4C] dark:text-cyan-300 italic flex gap-3 items-start">
                  <i className="ri-[#9B2A4C] ri-double-quotes-l text-2xl shrink-0" />
                  <span>{sec.quote}</span>
                </blockquote>
              )}
            </div>
          ))}

          {/* Conclusion Box */}
          <div className="p-6 rounded-3xl bg-gradient-to-r from-[#9B2A4C] to-[#2C3E50] text-white shadow-xl space-y-3 mt-8">
            <h3 className="text-lg font-black flex items-center gap-2">
              <i className="ri-lightbulb-line text-amber-300" /> Kết Luận
            </h3>
            <p className="text-xs md:text-sm text-gray-100 leading-relaxed">
              {post.content.conclusion}
            </p>
          </div>
        </div>

        {/* Tags & Share Bar */}
        <div className="pt-6 border-t border-gray-200 dark:border-gray-800 flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold text-gray-500 dark:text-gray-400">Tags:</span>
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="text-[11px] font-bold px-3 py-1 rounded-full bg-gray-200/80 dark:bg-slate-800 text-gray-700 dark:text-gray-300"
              >
                #{tag}
              </span>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleShare}
              className="px-4 py-2 rounded-full border border-gray-200 dark:border-gray-700 bg-white dark:bg-slate-900 text-xs font-bold flex items-center gap-1.5 hover:border-[#9B2A4C] transition-colors cursor-pointer"
            >
              <i className="ri-share-line" /> Chia sẻ bài viết
            </button>
          </div>
        </div>

        {/* Author Bio Banner */}
        <div className="p-6 md:p-8 rounded-3xl bg-white dark:bg-[#131B2E] border border-gray-200 dark:border-gray-800 shadow-xl flex flex-col sm:flex-row items-center gap-6">
          <img
            src={post.authorAvatar}
            alt={post.author}
            className="w-20 h-20 rounded-2xl object-cover shrink-0 border-2 border-[#9B2A4C] dark:border-cyan-400 shadow-lg"
          />
          <div className="space-y-2 text-center sm:text-left flex-1">
            <div className="text-xs font-bold uppercase text-[#9B2A4C] dark:text-cyan-400 tracking-wider">
              Tác giả bài viết
            </div>
            <h3 className="text-lg font-black text-[#1C2526] dark:text-white">{post.author}</h3>
            <p className="text-xs text-[#5A6A72] dark:text-gray-400 leading-relaxed">
              Marketer & Chuyên gia Tự động hóa AI với hơn 3 năm kinh nghiệm tư vấn giải pháp tăng trưởng cho doanh nghiệp.
            </p>
            <div className="pt-2">
              <a
                href="https://zalo.me/0376960193"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#9B2A4C] text-white font-bold text-xs hover:opacity-95 shadow-md transition-all"
              >
                <i className="ri-chat-3-line" /> Tư vấn giải pháp cùng Alvin
              </a>
            </div>
          </div>
        </div>

        {/* Related Articles Section */}
        {relatedPosts.length > 0 && (
          <div className="pt-12 border-t border-gray-200 dark:border-gray-800 space-y-6">
            <h3 className="text-2xl font-black text-[#1C2526] dark:text-white tracking-tight">
              Bài Viết Nổi Bật Khác
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedPosts.map((rel) => (
                <div
                  key={rel.id}
                  onClick={() => navigate(`/blog/${rel.id}`)}
                  className="group cursor-pointer rounded-2xl bg-white dark:bg-[#131B2E] border border-gray-200 dark:border-gray-800 overflow-hidden shadow-lg hover:shadow-2xl hover:border-[#9B2A4C]/40 transition-all duration-300 flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="relative aspect-video overflow-hidden">
                      <img
                        src={rel.image}
                        alt={rel.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <span className="absolute top-3 left-3 text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-md bg-[#9B2A4C] text-white shadow-md">
                        {rel.category}
                      </span>
                    </div>

                    <div className="p-4 space-y-2">
                      <h4 className="text-xs font-extrabold text-[#1C2526] dark:text-white group-hover:text-[#9B2A4C] dark:group-hover:text-cyan-400 transition-colors line-clamp-2 leading-snug">
                        {rel.title}
                      </h4>
                      <p className="text-[11px] text-gray-500 dark:text-gray-400 line-clamp-2 leading-relaxed">
                        {rel.excerpt}
                      </p>
                    </div>
                  </div>

                  <div className="p-4 pt-0 text-[10px] font-bold text-[#9B2A4C] dark:text-cyan-400 flex items-center justify-between">
                    <span>{rel.date}</span>
                    <span className="inline-flex items-center gap-1 group-hover:gap-2 transition-all">
                      Đọc bài <i className="ri-arrow-right-line" />
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default BlogPostDetail;
