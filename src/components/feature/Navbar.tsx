import { useState, useEffect, useRef } from 'react';
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
  const [authDropdownOpen, setAuthDropdownOpen] = useState(false);
  const authDropdownRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const navigate = useNavigate();
  const isHome = location.pathname === '/';

  const [userState, setUserState] = useState<{ loggedIn: boolean; role: string | null; name: string | null }>({
    loggedIn: false,
    role: null,
    name: null
  });

  useEffect(() => {
    const loggedIn = sessionStorage.getItem('user_logged_in') === 'true';
    const role = sessionStorage.getItem('user_role');
    const name = sessionStorage.getItem('user_name');
    setUserState({ loggedIn, role, name });
  }, [location.pathname, authDropdownOpen]);

  const servicesList = [
    { id: 'web', icon: 'ri-global-line', textColor: 'text-blue-500', bgColor: 'bg-blue-50' },
    { id: 'chatbot', icon: 'ri-chat-voice-line', textColor: 'text-emerald-500', bgColor: 'bg-emerald-50' },
    { id: 'landing', icon: 'ri-layout-grid-line', textColor: 'text-violet-500', bgColor: 'bg-violet-50' },
    { id: 'workflow', icon: 'ri-git-branch-line', textColor: 'text-amber-500', bgColor: 'bg-amber-50' },
    { id: 'email', icon: 'ri-mail-send-line', textColor: 'text-rose-500', bgColor: 'bg-rose-50' },
    { id: 'n8n', icon: 'ri-route-line', textColor: 'text-teal-500', bgColor: 'bg-teal-50' },
    { id: 'app', icon: 'ri-smartphone-line', textColor: 'text-cyan-500', bgColor: 'bg-cyan-50' },
  ];

  const navItems = [
    { label: t('navbar.projects'), id: 'projects' },
    { label: t('navbar.about'), id: 'about' },
    { label: t('navbar.careers'), id: 'careers' },
  ];

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setServicesOpen(false);
    setAuthDropdownOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (authDropdownRef.current && !authDropdownRef.current.contains(event.target as Node)) {
        setAuthDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 flex justify-center w-full transition-all duration-300 px-4 md:px-8 mt-4`}
    >
      <div
        className={`w-full max-w-7xl h-16 flex items-center justify-between px-6 rounded-2xl border transition-all duration-300 ${
          scrolled
            ? 'bg-white/95 backdrop-blur-lg border-gray-100 shadow-[0_12px_40px_rgba(44,62,80,0.08)] py-1'
            : 'bg-white/60 backdrop-blur-md border-white/20 shadow-sm'
        }`}
      >
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group shrink-0">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-[#2C3E50] to-[#9B2A4C] flex items-center justify-center text-white font-bold text-sm shadow-[0_3px_10px_rgba(155,42,76,0.15)] group-hover:scale-105 transition-transform duration-200">
            A
          </div>
          <span className="font-extrabold text-base text-[#1C2526] tracking-tight whitespace-nowrap flex items-center">
            Alvin
            <span className="text-[#9B2A4C] font-semibold ml-0.5">Tran</span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#9B2A4C] ml-1 animate-pulse" />
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden lg:flex items-center gap-6">
          {/* Services Dropdown */}
          <div
            className="relative h-full flex items-center group"
            onMouseEnter={() => setServicesOpen(true)}
            onMouseLeave={() => setServicesOpen(false)}
          >
            <button className="text-sm font-bold text-[#5A6A72] hover:text-[#1C2526] transition-colors duration-200 whitespace-nowrap flex items-center gap-1 cursor-pointer py-1.5 px-3 hover:bg-[#9B2A4C]/5 rounded-xl">
              {t('navbar.services')}
              <i className={`ri-arrow-down-s-line transition-transform duration-200 ${servicesOpen ? 'rotate-180 text-[#9B2A4C]' : ''}`} />
            </button>

            {/* Mega Menu Dropdown */}
            <div
              className={`absolute top-[90%] left-1/2 -translate-x-[35%] mt-2 w-[720px] bg-white border border-gray-100 rounded-3xl shadow-[0_20px_50px_rgba(44,62,80,0.12)] p-6 z-50 flex gap-6 transition-all duration-300 origin-top ${
                servicesOpen
                  ? 'opacity-100 scale-100 translate-y-0 pointer-events-auto'
                  : 'opacity-0 scale-95 -translate-y-2 pointer-events-none'
              }`}
            >
              {/* Services Grid (Left - 2 Columns) */}
              <div className="flex-1 grid grid-cols-2 gap-3">
                {servicesList.map((svc) => (
                  <Link
                    key={svc.id}
                    to={`/services/${svc.id}`}
                    className="flex gap-3 p-2.5 rounded-2xl hover:bg-[#9B2A4C]/5 group/item transition-all duration-200 border border-transparent hover:border-[#9B2A4C]/10"
                  >
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center text-lg ${svc.bgColor} ${svc.textColor} shrink-0 transition-transform group-hover/item:scale-110 duration-200`}
                    >
                      <i className={svc.icon} />
                    </div>
                    <div className="space-y-0.5">
                      <h4 className="text-xs font-bold text-[#1C2526] group-hover/item:text-[#9B2A4C] transition-colors">
                        {t(`services.list.${svc.id}.title` as any)}
                      </h4>
                      <p className="text-[10px] text-gray-400 leading-normal line-clamp-2">
                        {t(`services.list.${svc.id}.desc` as any)}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>

              {/* Featured Promo Panel (Right) */}
              <div className="w-56 bg-gradient-to-br from-[#9B2A4C] to-[#2C3E50] rounded-2xl p-5 text-white flex flex-col justify-between relative overflow-hidden shadow-inner shrink-0 group/promo">
                {/* Glow effect */}
                <div className="absolute -right-10 -top-10 w-28 h-28 bg-white/10 rounded-full blur-xl group-hover/promo:scale-125 transition-transform duration-500 animate-pulse" />

                <div className="space-y-2.5 relative z-10">
                  <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center text-sm font-bold">
                    <i className="ri-rocket-line text-white" />
                  </div>
                  <h4 className="text-xs font-extrabold tracking-wide">
                    {i18n.language === 'vi' ? 'Giải Pháp Tùy Biến?' : 'Custom Solution?'}
                  </h4>
                  <p className="text-[9px] text-white/80 leading-relaxed font-medium">
                    {i18n.language === 'vi'
                      ? 'Xây dựng quy trình tự động hóa và AI riêng biệt theo nhu cầu doanh nghiệp của bạn.'
                      : 'Build tailored AI chatbots and workflow automations for your business.'}
                  </p>
                </div>

                <Link
                  to="/contact"
                  className="mt-4 w-full py-2 bg-white text-[#9B2A4C] rounded-xl text-[10px] font-bold text-center block shadow hover:bg-gray-50 transition-all hover:scale-[1.02] relative z-10 cursor-pointer"
                >
                  {i18n.language === 'vi' ? 'Nhận Tư Vấn Miễn Phí' : 'Get Free Consultation'}
                </Link>
              </div>
            </div>
          </div>

          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              className="text-sm font-bold text-[#5A6A72] hover:text-[#1C2526] transition-all duration-200 whitespace-nowrap cursor-pointer py-1.5 px-3 hover:bg-[#9B2A4C]/5 rounded-xl"
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* Actions & Utilities */}
        <div className="hidden lg:flex items-center gap-4">
          {/* Premium Sliding Language toggle */}
          <div className="relative bg-[#F8F6F2] p-0.5 rounded-full border border-gray-200 flex items-center w-24 h-8 select-none">
            {/* Sliding indicator */}
            <div
              className="absolute top-0.5 bottom-0.5 w-[44px] bg-white rounded-full shadow-sm transition-all duration-300 ease-out"
              style={{
                transform: i18n.language === 'vi' ? 'translateX(0px)' : 'translateX(44px)',
              }}
            />
            <button
              onClick={() => i18n.changeLanguage('vi')}
              className={`flex-1 text-center text-[10px] font-bold z-10 transition-colors cursor-pointer ${
                i18n.language === 'vi' ? 'text-[#9B2A4C]' : 'text-gray-400'
              }`}
            >
              VI
            </button>
            <button
              onClick={() => i18n.changeLanguage('en')}
              className={`flex-1 text-center text-[10px] font-bold z-10 transition-colors cursor-pointer ${
                i18n.language === 'en' ? 'text-[#9B2A4C]' : 'text-gray-400'
              }`}
            >
              EN
            </button>
          </div>

          {/* User Auth Dropdown */}
          <div className="relative" ref={authDropdownRef}>
            <button
              onClick={() => setAuthDropdownOpen(!authDropdownOpen)}
              className="w-9 h-9 rounded-full border border-gray-200 flex items-center justify-center text-[#5A6A72] hover:text-[#9B2A4C] hover:border-[#9B2A4C]/30 hover:bg-[#9B2A4C]/5 transition-all duration-200 cursor-pointer relative"
              aria-label="User Account"
            >
              <i className="ri-user-line text-lg" />
            </button>

            {/* Dropdown Menu */}
            <div
              className={`absolute right-0 mt-2 w-48 bg-white border border-gray-100 rounded-2xl shadow-[0_12px_30px_rgba(44,62,80,0.12)] p-2 z-50 transition-all duration-300 origin-top-right ${
                authDropdownOpen
                  ? 'opacity-100 scale-100 translate-y-0 pointer-events-auto'
                  : 'opacity-0 scale-95 -translate-y-2 pointer-events-none'
              }`}
            >
              {userState.loggedIn ? (
                <>
                  <div className="px-4 py-2 border-b border-gray-100 text-left">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">
                      {i18n.language === 'vi' ? 'Xin chào' : 'Welcome'}
                    </p>
                    <p className="text-xs font-black text-[#1C2526] truncate">{userState.name || 'User'}</p>
                  </div>
                  {userState.role === 'client' && (
                    <Link
                      to="/client-portal"
                      onClick={() => setAuthDropdownOpen(false)}
                      className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-bold text-[#5A6A72] hover:text-[#9B2A4C] hover:bg-[#9B2A4C]/5 transition-all mt-1"
                    >
                      <i className="ri-dashboard-3-line text-base text-[#9B2A4C]" />
                      {i18n.language === 'vi' ? 'Cổng khách hàng' : 'Client Portal'}
                    </Link>
                  )}
                  {userState.role === 'developer' && (
                    <Link
                      to="/member-portal"
                      onClick={() => setAuthDropdownOpen(false)}
                      className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-bold text-[#5A6A72] hover:text-[#9B2A4C] hover:bg-[#9B2A4C]/5 transition-all mt-1"
                    >
                      <i className="ri-code-box-line text-base text-[#9B2A4C]" />
                      {i18n.language === 'vi' ? 'Cổng Freelancer' : 'Member Portal'}
                    </Link>
                  )}
                  {(userState.role === 'admin' || userState.role === 'manager') && (
                    <Link
                      to="/admin"
                      onClick={() => setAuthDropdownOpen(false)}
                      className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-bold text-[#5A6A72] hover:text-[#9B2A4C] hover:bg-[#9B2A4C]/5 transition-all mt-1"
                    >
                      <i className="ri-admin-line text-base text-[#9B2A4C]" />
                      {i18n.language === 'vi' ? 'Trang quản trị' : 'Admin Dashboard'}
                    </Link>
                  )}
                  <button
                    onClick={() => {
                      sessionStorage.removeItem('user_logged_in');
                      sessionStorage.removeItem('user_role');
                      sessionStorage.removeItem('user_email');
                      sessionStorage.removeItem('user_name');
                      sessionStorage.removeItem('user_id');
                      sessionStorage.removeItem('admin_logged_in');
                      sessionStorage.removeItem('admin_role');
                      setAuthDropdownOpen(false);
                      navigate('/login');
                    }}
                    className="w-full text-left flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-bold text-red-500 hover:bg-red-50 transition-all mt-1 cursor-pointer"
                  >
                    <i className="ri-logout-box-r-line text-base" />
                    {i18n.language === 'vi' ? 'Đăng xuất' : 'Sign Out'}
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    onClick={() => setAuthDropdownOpen(false)}
                    className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-bold text-[#5A6A72] hover:text-[#9B2A4C] hover:bg-[#9B2A4C]/5 transition-all"
                  >
                    <i className="ri-login-box-line text-base text-[#9B2A4C]" />
                    {t('portals.signIn')}
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setAuthDropdownOpen(false)}
                    className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-bold text-[#5A6A72] hover:text-[#9B2A4C] hover:bg-[#9B2A4C]/5 transition-all"
                  >
                    <i className="ri-user-add-line text-base text-[#9B2A4C]" />
                    {i18n.language === 'vi' ? 'Đăng Ký' : 'Register'}
                  </Link>
                </>
              )}
            </div>
          </div>

          {/* Contact CTA Button */}
          <Link
            to="/contact"
            className="gradient-bg text-white text-xs font-bold px-5 py-2.5 rounded-full whitespace-nowrap hover:shadow-[0_4px_15px_rgba(155,42,76,0.25)] hover:scale-[1.02] transition-all duration-200 cursor-pointer"
          >
            {t('navbar.cta')}
          </Link>
        </div>

        {/* Morphing Mobile hamburger */}
        <button
          className="lg:hidden w-8 h-8 flex flex-col justify-center items-center relative focus:outline-none cursor-pointer"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          <span
            className={`w-5 h-0.5 bg-[#1C2526] rounded transition-all duration-300 absolute ${
              mobileOpen ? 'rotate-45' : '-translate-y-1.5'
            }`}
          />
          <span
            className={`w-5 h-0.5 bg-[#1C2526] rounded transition-all duration-300 absolute ${
              mobileOpen ? 'opacity-0' : 'opacity-100'
            }`}
          />
          <span
            className={`w-5 h-0.5 bg-[#1C2526] rounded transition-all duration-300 absolute ${
              mobileOpen ? '-rotate-45' : 'translate-y-1.5'
            }`}
          />
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="absolute top-full left-4 right-4 bg-white/95 backdrop-blur-lg border border-gray-100 rounded-3xl p-5 flex flex-col gap-4 shadow-xl mt-2 max-h-[85vh] overflow-y-auto animate-fadeIn z-50">
          <div className="text-[10px] font-bold text-gray-400 px-1 uppercase tracking-wider">
            {t('navbar.services')}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {servicesList.map((svc) => (
              <Link
                key={svc.id}
                to={`/services/${svc.id}`}
                className="flex items-center gap-3 p-2 rounded-xl hover:bg-[#9B2A4C]/5 transition-colors"
                onClick={() => setMobileOpen(false)}
              >
                <div
                  className={`w-8 h-8 rounded-lg flex items-center justify-center text-md ${svc.bgColor} ${svc.textColor}`}
                >
                  <i className={svc.icon} />
                </div>
                <span className="text-xs font-bold text-[#1C2526]">
                  {t(`services.list.${svc.id}.title` as any)}
                </span>
              </Link>
            ))}
          </div>

          <div className="h-px bg-gray-100 my-1" />

          <div className="flex flex-col gap-2">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setMobileOpen(false);
                  handleNavClick(item.id);
                }}
                className="text-xs font-bold py-2.5 text-left text-[#5A6A72] hover:text-[#1C2526] px-2 hover:bg-gray-50 rounded-xl"
              >
                {item.label}
              </button>
            ))}
          </div>

          <div className="h-px bg-gray-100 my-1" />

          <div className="flex flex-col gap-2">
            <Link
              to="/login"
              className="flex items-center gap-2.5 text-xs font-bold py-2.5 text-[#5A6A72] hover:text-[#9B2A4C] px-2 hover:bg-[#9B2A4C]/5 rounded-xl transition-all"
              onClick={() => setMobileOpen(false)}
            >
              <i className="ri-login-box-line text-sm text-[#9B2A4C]" />
              {t('portals.signIn')}
            </Link>
            <Link
              to="/register"
              className="flex items-center gap-2.5 text-xs font-bold py-2.5 text-[#5A6A72] hover:text-[#9B2A4C] px-2 hover:bg-[#9B2A4C]/5 rounded-xl transition-all"
              onClick={() => setMobileOpen(false)}
            >
              <i className="ri-user-add-line text-sm text-[#9B2A4C]" />
              {i18n.language === 'vi' ? 'Đăng Ký' : 'Register'}
            </Link>

            <div className="flex justify-between items-center px-2 py-1 bg-[#F8F6F2] rounded-xl border border-gray-100">
              <span className="text-[10px] font-bold text-gray-400">Language</span>
              <div className="flex gap-2">
                <button
                  onClick={() => i18n.changeLanguage('vi')}
                  className={`text-[10px] font-bold px-2.5 py-1 rounded-lg ${
                    i18n.language === 'vi' ? 'bg-white text-[#9B2A4C] shadow-sm' : 'text-gray-400'
                  }`}
                >
                  VI
                </button>
                <button
                  onClick={() => i18n.changeLanguage('en')}
                  className={`text-[10px] font-bold px-2.5 py-1 rounded-lg ${
                    i18n.language === 'en' ? 'bg-white text-[#9B2A4C] shadow-sm' : 'text-gray-400'
                  }`}
                >
                  EN
                </button>
              </div>
            </div>

            <Link
              to="/contact"
              className="gradient-bg text-white text-xs font-bold py-3 rounded-xl text-center whitespace-nowrap mt-2 shadow hover:opacity-95 transition-opacity"
              onClick={() => setMobileOpen(false)}
            >
              {t('navbar.cta')}
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}