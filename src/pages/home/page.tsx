import Navbar from '@/components/feature/Navbar';
import Footer from '@/components/feature/Footer';
import HeroSection from './components/HeroSection';
import EcosystemSection from './components/EcosystemSection';
import AboutSection from './components/AboutSection';
import ServicesSection from './components/ServicesSection';
import ProjectsSection from './components/ProjectsSection';
import CareersSection from './components/CareersSection';
import CtaSection from './components/CtaSection';
import { useEffect } from 'react';

function HomeJsonLd() {
  useEffect(() => {
    const schema = {
      '@context': 'https://schema.org',
      '@type': 'Person',
      name: 'Alvin Tran',
      alternateName: 'Trần Vũ Quốc Anh',
      jobTitle: 'Marketer, AI Automation Specialist & Communications Strategist',
      url: import.meta.env.VITE_SITE_URL ?? 'https://example.com',
      description: '20-year-old marketer with proven track record scaling businesses through creative strategies and smart technology.',
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Ha Dong',
        addressRegion: 'Hanoi',
        addressCountry: 'VN',
      },
      sameAs: [],
      worksFor: [
        {
          '@type': 'Organization',
          name: 'Beta Home Viet Nam',
          jobTitle: 'Communications & Marketer',
        },
        {
          '@type': 'Organization',
          name: 'Senn Cosmetics',
          jobTitle: 'CEO, Marketer & Sales',
        },
        {
          '@type': 'Organization',
          name: 'ByeBye Pimple',
          jobTitle: 'Designer / Marketer',
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
    <div className="min-h-screen" style={{ background: '#F8F6F2' }}>
      <HomeJsonLd />
      <Navbar />
      <main>
        <HeroSection />
        <EcosystemSection />
        <AboutSection />
        <ServicesSection />
        <ProjectsSection />
        <CareersSection />
        <CtaSection />
      </main>
      <Footer />
    </div>
  );
}