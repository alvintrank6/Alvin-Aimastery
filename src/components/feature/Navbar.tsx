import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const scrollToSection = (id: string) => {
  const el = document.getElementById(id);
  if (el) {
    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
};

export default function Navbar() {
  const { t, i18n } = useTranslation();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const isHome = location.pathname === '/';

  const servicesList = [
    { name: 'Xây dựng website', id: 'web' },
    { name: 'Xây dựng chatbot', id: 'chatbot' },
    { name: 'Xây dựng landing page', id: 'landing' },
    { name: 'Xây dựng workflow', id: 'workflow' },
    { name: 'Xây dựng email automation', id: 'email' },
    { name: 'Xây dựng n8n', id: 'n8n' },
    { name: 'Xây app', id: 'app' },
  ];

  const navItems = [
    { label: t('navbar.about'), id: 'about' },
    { label: t('navbar.projects'), id: 'projects' },
  ];

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setServicesOpen(false);
  }, [location.pathname]);

  const handleNavClick = (id: string) => {
    if (isHome) {
      scrollToSection(id);
    } else {
      navigate('/', { state: { scrollTo: id } });
    }
  };

  useEffect(() => {
    if (isHome && location.state?.scrollTo) {
      const id = location.state.scrollTo as string;
      setTimeout(() => scrollToSection(id), 200);
      window.history.replaceState({}, document.title);
    }
  }, [isHome, location]);

  const toggleLang = () => {
    const next = i18n.language === 'vi' ? 'en' : 'vi';
    i18n.changeLanguage(next);
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'glass-nav shadow-sm bg-white/90 backdrop-blur-md border-b border-gray-100' : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 md:px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 shrink-0">
          <span className="font-bold text-base text-[#1C2526] whitespace-nowrap">Alvin Tran</span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden lg:flex items-center gap-6">
          {/* Services Dropdown */}
          <div
            className="relative"
            onMouseEnter={() => setServicesOpen(true)}
            onMouseLeave={() => setServicesOpen(false)}
          >
            <button className="text-sm font-medium text-[#5A6A72] hover:text-[#2C3E50] transition-colors duration-200 whitespace-nowrap flex items-center gap-1 cursor-pointer">
              Services
              <i className={`ri-arrow-down-s-line transition-transform duration-200 ${servicesOpen ? 'rotate-180' : ''}`} />
            </button>

            {servicesOpen && (
              <div className="absolute top-5 left-0 w-60 bg-white border border-gray-100 rounded-2xl shadow-xl py-3 z-50 animate-fadeIn">
                {servicesList.map((svc) => (
                  <Link
                    key={svc.id}
                    to={`/services/${svc.id}`}
                    className="block px-4 py-2.5 text-xs font-semibold text-[#5A6A72] hover:text-[#9B2A4C] hover:bg-[#9B2A4C]/5 transition-all"
                  >
                    {i18n.language === 'vi' ? svc.name : svc.name.replace('Xây dựng', 'Build').replace('Xây', 'Build')}
                  </Link>
                ))}
              </div>
            )}
          </div>

          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              className="text-sm font-medium text-[#5A6A72] hover:text-[#2C3E50] transition-colors duration-200 whitespace-nowrap cursor-pointer"
            >
              {item.label}
            </button>
          ))}

          {/* Portals Links */}
          <Link
            to="/client-portal"
            className={`text-sm font-medium transition-colors duration-200 whitespace-nowrap ${
              location.pathname === '/client-portal' ? 'text-[#9B2A4C] font-bold' : 'text-[#5A6A72] hover:text-[#2C3E50]'
            }`}
          >
            {t('portals.clientPortal')}
          </Link>

          <Link
            to="/outsource/register"
            className={`text-sm font-medium transition-colors duration-200 whitespace-nowrap ${
              location.pathname === '/outsource/register' ? 'text-[#9B2A4C] font-bold' : 'text-[#5A6A72] hover:text-[#2C3E50]'
            }`}
          >
            {t('portals.memberPortal')}
          </Link>

          <Link
            to="/admin"
            className={`text-sm font-medium transition-colors duration-200 whitespace-nowrap ${
              location.pathname === '/admin' ? 'text-[#9B2A4C] font-bold' : 'text-[#5A6A72] hover:text-[#2C3E50]'
            }`}
          >
            {t('portals.adminDashboard')}
          </Link>

          {/* Language toggle */}
          <button
            onClick={toggleLang}
            className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full border border-[#2C3E50]/20 text-[#2C3E50] hover:bg-[#2C3E50]/5 transition-colors whitespace-nowrap cursor-pointer"
            aria-label={t('common.switchLang')}
          >
            <i className="ri-global-line text-sm" />
            {i18n.language === 'vi' ? 'EN' : 'VI'}
          </button>
        </div>

        {/* CTA */}
        <div className="hidden lg:flex items-center gap-3">
          <Link
            to="/contact"
            className="gradient-bg text-white text-sm font-semibold px-5 py-2 rounded-full whitespace-nowrap hover:opacity-90 transition-opacity cursor-pointer"
          >
            {t('navbar.cta')}
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button
          className="lg:hidden w-8 h-8 flex items-center justify-center text-[#1C2526]"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          <i className={`ri-${mobileOpen ? 'close' : 'menu'}-line text-xl`}></i>
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="lg:hidden bg-white/95 backdrop-blur-lg border-t border-gray-100 px-4 py-4 flex flex-col gap-3 shadow-lg">
          <div className="text-xs font-bold text-gray-400 px-2 uppercase tracking-wider">Services</div>
          {servicesList.map((svc) => (
            <Link
              key={svc.id}
              to={`/services/${svc.id}`}
              className="text-xs font-semibold px-4 py-1.5 text-[#5A6A72] hover:text-[#9B2A4C]"
              onClick={() => setMobileOpen(false)}
            >
              {i18n.language === 'vi' ? svc.name : svc.name.replace('Xây dựng', 'Build').replace('Xây', 'Build')}
            </Link>
          ))}

          <div className="h-px bg-gray-100 my-1" />

          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setMobileOpen(false);
                handleNavClick(item.id);
              }}
              className="text-sm font-medium py-1.5 text-left text-[#5A6A72] hover:text-[#2C3E50] cursor-pointer px-2"
            >
              {item.label}
            </button>
          ))}

          <Link
            to="/client-portal"
            className="text-sm font-medium py-1.5 text-[#5A6A72] hover:text-[#2C3E50] px-2"
            onClick={() => setMobileOpen(false)}
          >
            {t('portals.clientPortal')}
          </Link>
          <Link
            to="/outsource/register"
            className="text-sm font-medium py-1.5 text-[#5A6A72] hover:text-[#2C3E50] px-2"
            onClick={() => setMobileOpen(false)}
          >
            {t('portals.memberPortal')}
          </Link>
          <Link
            to="/admin"
            className="text-sm font-medium py-1.5 text-[#5A6A72] hover:text-[#2C3E50] px-2"
            onClick={() => setMobileOpen(false)}
          >
            {t('portals.adminDashboard')}
          </Link>

          <button
            onClick={() => {
              toggleLang();
              setMobileOpen(false);
            }}
            className="flex items-center gap-1.5 text-sm font-semibold py-1.5 text-[#5A6A72] hover:text-[#2C3E50] cursor-pointer px-2"
          >
            <i className="ri-global-line text-sm" />
            {i18n.language === 'vi' ? 'Switch to English' : 'Chuyển sang Tiếng Việt'}
          </button>
          <Link
            to="/contact"
            className="gradient-bg text-white text-sm font-semibold px-4 py-3 rounded-full text-center whitespace-nowrap mt-2"
            onClick={() => setMobileOpen(false)}
          >
            {t('navbar.cta')}
          </Link>
        </div>
      )}
    </nav>
  );
}