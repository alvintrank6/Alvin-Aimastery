import Navbar from '@/components/feature/Navbar';
import Footer from '@/components/feature/Footer';
import HeroSection from './components/HeroSection';
import AboutPreviewSection from './components/AboutPreviewSection';
import ServicesSection from './components/ServicesSection';
import FeaturedProjectsSection from './components/FeaturedProjectsSection';
import BlogPreviewSection from './components/BlogPreviewSection';
import PromptHubPreviewSection from './components/PromptHubPreviewSection';
import ContactCtaSection from './components/ContactCtaSection';
import { useEffect } from 'react';

function HomeJsonLd() {
  useEffect(() => {
    const schema = {
      '@context': 'https://schema.org',
      '@type': 'Person',
      name: 'Alvin Tran',
      alternateName: 'Trần Vũ Quốc Anh',
      jobTitle: 'AI Marketing Specialist & Communications Strategist',
      url: import.meta.env.VITE_SITE_URL ?? 'https://alvinaimastery.com',
      description: 'Marketer and AI Automation Specialist scaling businesses with creative strategies and smart technology.',
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Cau Giay',
        addressRegion: 'Hanoi',
        addressCountry: 'VN',
      },
      sameAs: [
        'https://www.facebook.com/alvin.tran.872661/',
        'https://www.instagram.com/alvintran_95/'
      ],
      worksFor: [
        {
          '@type': 'Organization',
          name: 'AI Mastery',
          jobTitle: 'AI Marketing Specialist & Business Development',
        },
      ],
    };

    const existing = document.getElementById('home-jsonld');
    if (existing) existing.remove();
    const script = document.createElement('script');
    script.id = 'home-jsonld';
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(schema);
    document.head.appendChild(script);

    return () => {
      const el = document.getElementById('home-jsonld');
      if (el) el.remove();
    };
  }, []);

  return null;
}

export default function Home() {
  return (
    <div className="min-h-screen transition-colors duration-300">
      <HomeJsonLd />
      <Navbar />
      <main>
        <HeroSection />
        <AboutPreviewSection />
        <ServicesSection />
        <FeaturedProjectsSection />
        <BlogPreviewSection />
        <PromptHubPreviewSection />
        <ContactCtaSection />
      </main>
      <Footer />
    </div>
  );
}