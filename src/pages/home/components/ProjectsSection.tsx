import ProjectMediaGallery from './ProjectMediaGallery';
import { useTranslation } from 'react-i18next';

interface MediaItem {
  type: 'image' | 'video';
  src: string;
  poster?: string;
  alt?: string;
}

interface Project {
  title: string;
  category: string;
  image?: string;
  media?: MediaItem[];
  description: string;
  results: string[];
  tags: string[];
  color: string;
}

export default function ProjectsSection() {
  const { t } = useTranslation();

  const projects: Project[] = [
    {
      title: (t('projects.items', { returnObjects: true }) as Array<{ title: string }>)[0]?.title ?? 'Beta Home Viet Nam – Brand Growth Engine',
      category: (t('projects.items', { returnObjects: true }) as Array<{ category: string }>)[0]?.category ?? 'Communications & Marketing',
      media: [
        {
          type: 'image',
          src: 'https://storage.readdy-site.link/project_files/777b9997-a4ea-46c0-8b9d-dfdba822c4b8/11731aaa-cbd7-462c-8264-c4c805d1f7b8_Screenshot_7-5-2026_82617_betahomevietnam.com.jpeg?v=e4c36b950ec843ffbd40e9d91a640a48',
          alt: 'Beta Home Viet Nam website screenshot',
        },
        {
          type: 'image',
          src: 'https://static.readdy.ai/image/f4782dda055a3841fcfd0612adf32078/e21f96a2ad64dd524ba4b485cf4f56ce.jpeg',
          alt: 'Beta Home marketing analytics dashboard',
        },
      ],
      description: (t('projects.items', { returnObjects: true }) as Array<{ description: string }>)[0]?.description ?? "Led the complete digital transformation of Beta Home Viet Nam's marketing. Built brand awareness, brand images, creating leads through website and social media.",
      results: (t('projects.items', { returnObjects: true }) as Array<{ results: string[] }>)[0]?.results ?? [
        'Increase brand awareness through TikTok',
        'A brand-new website with 100/100 SEO points',
      ],
      tags: (t('projects.items', { returnObjects: true }) as Array<{ tags: string[] }>)[0]?.tags ?? ['Brand Strategy', 'Social Media'],
      color: '#2C3E50',
    },
    {
      title: (t('projects.items', { returnObjects: true }) as Array<{ title: string }>)[1]?.title ?? 'Senn Cosmetics – From Zero to $4K/Month',
      category: (t('projects.items', { returnObjects: true }) as Array<{ category: string }>)[1]?.category ?? 'CEO, Marketing & Sales',
      media: [
        {
          type: 'image',
          src: 'https://static.readdy.ai/image/f4782dda055a3841fcfd0612adf32078/edb009c9185e00c60e08f7a715747d72.jpeg',
          alt: 'Senn Cosmetics product line',
        },
        {
          type: 'image',
          src: 'https://static.readdy.ai/image/f4782dda055a3841fcfd0612adf32078/67a653e2a0824167702fe383f02a0322.jpeg',
          alt: 'Senn Cosmetics brand collection',
        },
        {
          type: 'image',
          src: 'https://static.readdy.ai/image/f4782dda055a3841fcfd0612adf32078/feec85556b8df5e8778c3c6d2f1e8404.jpeg',
          alt: 'Senn Cosmetics packaging',
        },
      ],
      description: (t('projects.items', { returnObjects: true }) as Array<{ description: string }>)[1]?.description ?? 'Founded Senn Cosmetics and personally drove all marketing and sales. Took the brand from concept to profitable business in under 8 months.',
      results: (t('projects.items', { returnObjects: true }) as Array<{ results: string[] }>)[1]?.results ?? [
        '$0 to 4K$ monthly revenue in 3 months',
        '4.8/5 customer satisfaction rating',
        '45% repeat purchase rate via automation',
        '8 retail B2B partnerships established',
      ],
      tags: (t('projects.items', { returnObjects: true }) as Array<{ tags: string[] }>)[1]?.tags ?? ['Startup Launch', 'Brand Identity', 'B2B Sales', 'TiktTok Livestreming'],
      color: '#A8B5A0',
    },
    {
      title: (t('projects.items', { returnObjects: true }) as Array<{ title: string }>)[2]?.title ?? 'ByeBye Pimple – Viral Content Machine',
      category: (t('projects.items', { returnObjects: true }) as Array<{ category: string }>)[2]?.category ?? 'Design & Performance Marketing',
      media: [
        {
          type: 'image',
          src: 'https://static.readdy.ai/image/f4782dda055a3841fcfd0612adf32078/d93e02f9bd008302bcdb616d9c5b65da.jpeg',
          alt: 'ByeBye Pimple skincare product photo 1',
        },
        {
          type: 'image',
          src: 'https://static.readdy.ai/image/f4782dda055a3841fcfd0612adf32078/c2df285fad8ca998bf96535579520b2f.jpeg',
          alt: 'ByeBye Pimple skincare product photo 2',
        },
        {
          type: 'image',
          src: 'https://static.readdy.ai/image/f4782dda055a3841fcfd0612adf32078/b3cfa09131cf9c9dd89a2bbb5f43732a.jpeg',
          alt: 'ByeBye Pimple skincare product photo 3',
        },
        {
          type: 'image',
          src: 'https://static.readdy.ai/image/f4782dda055a3841fcfd0612adf32078/89ffbe7e8cfe35084b534aeeb63af0d9.jpeg',
          alt: 'ByeBye Pimple skincare product photo 4',
        },
        {
          type: 'image',
          src: 'https://static.readdy.ai/image/f4782dda055a3841fcfd0612adf32078/33171ee9996119805411fce9a4c7756d.jpeg',
          alt: 'ByeBye Pimple skincare product photo 5',
        },
      ],
      description: (t('projects.items', { returnObjects: true }) as Array<{ description: string }>)[2]?.description ?? "Led the complete redesign of ByeBye Pimple's e-commerce website to improve user experience and conversion rates. Developed and executed a targeted marketing strategy focused on micro-influencers to effectively reach local audiences across multiple states in the United States.\nSuccessfully scaled daily revenue from $2,000 to $8,000 within one week — a 300% increase — through strategic influencer partnerships and optimized digital campaigns.",
      results: (t('projects.items', { returnObjects: true }) as Array<{ results: string[] }>)[2]?.results ?? [
        'CTR improved from 1.2% to 3.8%',
        '1.2M organic Instagram views',
        '90% improvement in content consistency',
        '400% increased in revenue in one week',
      ],
      tags: (t('projects.items', { returnObjects: true }) as Array<{ tags: string[] }>)[2]?.tags ?? ['Creative Design', 'Paid Ads', 'TikTok Marketing', 'Content Strategy'],
      color: '#9B2A4C',
    },
  ];

  const galleryLabels = t('projects.galleryLabels', { returnObjects: true }) as Record<string, string>;

  return (
    <section id="projects" className="py-20 md:py-28" style={{ background: '#ffffff' }}>
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        {/* Header */}
        <div className="max-w-3xl mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#2C3E50]/20 bg-[#2C3E50]/5 mb-5">
            <span className="text-[#2C3E50] text-xs font-semibold">{t('projects.badge')}</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-[#1C2526] mb-3">
            {t('projects.title')} <span className="gradient-text">{t('projects.titleHighlight')}</span>
          </h2>
          <p className="text-[#5A6A72] text-base leading-relaxed">
            {t('projects.intro')}
          </p>
        </div>

        {/* Project cards */}
        <div className="space-y-10">
          {projects.map((project, i) => (
            <div
              key={i}
              className="card-light card-light-hover rounded-2xl overflow-hidden transition-all duration-300"
            >
              {/* Layout: media projects get stacked (media top, content below), single-image projects keep side-by-side */}
              <div className={`grid ${project.media ? 'grid-cols-1' : 'grid-cols-1 lg:grid-cols-2'}`}>
                {/* Image / Media */}
                <div className={`relative overflow-hidden ${project.media ? (project.media.length === 1 ? 'h-[280px] md:h-[380px]' : project.media.length === 2 ? 'h-[320px] md:h-[420px]' : (project.media.length >= 4 && project.media.length <= 6) ? 'h-auto py-4 md:py-6' : project.media.length === 3 ? 'h-[320px] md:h-[480px]' : 'h-[420px] md:h-[520px]') : 'h-64 lg:h-auto'}`}>
                  {project.media ? (
                    <ProjectMediaGallery media={project.media} color={project.color} labels={galleryLabels} />
                  ) : (
                    <>
                      <img
                        src={project.image!}
                        alt={project.title}
                        className="w-full h-full object-cover object-top"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent lg:bg-gradient-to-r"></div>
                    </>
                  )}
                </div>

                {/* Content */}
                <div className="p-7 md:p-8 flex flex-col justify-center">
                  <div className="flex items-center gap-2 mb-3">
                    <span
                      className="text-xs font-semibold px-2.5 py-1 rounded-full"
                      style={{ background: `${project.color}15`, color: project.color }}
                    >
                      {project.category}
                    </span>
                  </div>

                  <h3 className="text-[#1C2526] font-bold text-xl mb-3">{project.title}</h3>
                  <p className="text-[#5A6A72] text-sm leading-relaxed mb-5">{project.description}</p>

                  {/* Results */}
                  <div className="mb-5">
                    <h4 className="text-[#1C2526] text-xs font-semibold mb-2 uppercase tracking-wide">{t('projects.keyResults')}</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {project.results.map((result, ri) => (
                        <div key={ri} className="flex items-center gap-2">
                          <i className="ri-check-line text-sm" style={{ color: project.color }}></i>
                          <span className="text-[#3E4A52] text-sm">{result}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2">
                    {project.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-xs px-2.5 py-1 rounded-full border border-gray-200 text-[#5A6A72]"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}