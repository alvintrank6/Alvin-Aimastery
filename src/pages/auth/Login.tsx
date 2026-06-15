import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Navbar from '@/components/feature/Navbar';
import Footer from '@/components/feature/Footer';

export default function Login() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const demoAccounts = [
    {
      role: 'admin',
      label: t('portals.roleAdmin'),
      email: 'admin@agency.com',
      password: 'admin123',
      color: '#9B2A4C',
      bg: 'rgba(155, 42, 76, 0.05)',
      borderColor: 'rgba(155, 42, 76, 0.15)',
      icon: 'ri-admin-line',
    },
    {
      role: 'manager',
      label: t('portals.roleManager'),
      email: 'manager@agency.com',
      password: 'manager123',
      color: '#2C3E50',
      bg: 'rgba(44, 62, 80, 0.05)',
      borderColor: 'rgba(44, 62, 80, 0.15)',
      icon: 'ri-user-settings-line',
    },
    {
      role: 'freelancer',
      label: t('portals.roleFreelancer'),
      email: 'minhdev@gmail.com',
      password: 'free123',
      color: '#1C2526',
      bg: 'rgba(28, 37, 38, 0.05)',
      borderColor: 'rgba(28, 37, 38, 0.15)',
      icon: 'ri-code-box-line',
    },
    {
      role: 'client',
      label: t('portals.roleClient') + ' (TechCorp)',
      email: 'vana@techcorp.vn',
      password: 'client123',
      color: '#D97706',
      bg: 'rgba(217, 119, 6, 0.05)',
      borderColor: 'rgba(217, 119, 6, 0.15)',
      icon: 'ri-user-shared-line',
    },
  ];

  const handleLogin = (loginEmail: string, loginPass: string) => {
    setError('');
    setLoading(true);

    setTimeout(() => {
      const emailLower = loginEmail.toLowerCase().trim();

      // 1. Admin Auth
      if (emailLower === 'admin@agency.com' && loginPass === 'admin123') {
        sessionStorage.setItem('user_logged_in', 'true');
        sessionStorage.setItem('user_role', 'admin');
        sessionStorage.setItem('user_email', emailLower);
        sessionStorage.setItem('user_name', 'Super Admin');

        // Sync older admin session keys for compatibility
        sessionStorage.setItem('admin_logged_in', 'true');
        sessionStorage.setItem('admin_role', 'admin');

        navigate('/admin');
        return;
      }
      if (emailLower === 'manager@agency.com' && loginPass === 'manager123') {
        sessionStorage.setItem('user_logged_in', 'true');
        sessionStorage.setItem('user_role', 'manager');
        sessionStorage.setItem('user_email', emailLower);
        sessionStorage.setItem('user_name', 'Agency Manager');

        // Sync older admin session keys for compatibility
        sessionStorage.setItem('admin_logged_in', 'true');
        sessionStorage.setItem('admin_role', 'manager');

        navigate('/admin');
        return;
      }

      // 2. Client Auth
      if (emailLower === 'vana@techcorp.vn') {
        sessionStorage.setItem('user_logged_in', 'true');
        sessionStorage.setItem('user_role', 'client');
        sessionStorage.setItem('user_email', emailLower);
        sessionStorage.setItem('user_name', 'Nguyen Van A (TechCorp)');
        navigate('/client-portal');
        return;
      }
      if (emailLower === 'lethib@spa.vn') {
        sessionStorage.setItem('user_logged_in', 'true');
        sessionStorage.setItem('user_role', 'client');
        sessionStorage.setItem('user_email', emailLower);
        sessionStorage.setItem('user_name', 'Le Thi B (An Nhien Spa)');
        navigate('/client-portal');
        return;
      }

      // 3. Freelancer Auth
      if (emailLower === 'tranfree@gmail.com') {
        sessionStorage.setItem('user_logged_in', 'true');
        sessionStorage.setItem('user_role', 'freelancer');
        sessionStorage.setItem('user_email', emailLower);
        sessionStorage.setItem('user_name', 'Tran Freelancer');
        sessionStorage.setItem('user_id', 'free-1');
        navigate('/member-portal');
        return;
      }
      if (emailLower === 'minhdev@gmail.com') {
        sessionStorage.setItem('user_logged_in', 'true');
        sessionStorage.setItem('user_role', 'freelancer');
        sessionStorage.setItem('user_email', emailLower);
        sessionStorage.setItem('user_name', 'Minh Dev');
        sessionStorage.setItem('user_id', 'free-2');
        navigate('/member-portal');
        return;
      }

      setLoading(false);
      setError(t('admin.invalidCredentials'));
    }, 600);
  };

  const onSubmitForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    handleLogin(email, password);
  };

  const handleQuickLogin = (acc: typeof demoAccounts[0]) => {
    setEmail(acc.email);
    setPassword(acc.password);
    handleLogin(acc.email, acc.password);
  };

  return (
    <div className="min-h-screen flex flex-col justify-between" style={{ background: '#F8F6F2' }}>
      <Navbar />

      <main className="pt-28 pb-16 flex-grow flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-3xl p-6 md:p-8 border border-gray-100 shadow-xl relative overflow-hidden">
          {/* Top colored accent line */}
          <div className="absolute top-0 left-0 right-0 h-1.5 gradient-bg" />

          {/* Heading */}
          <div className="text-center space-y-2 mb-6">
            <h1 className="text-2xl font-black text-[#1C2526]">{t('portals.signIn')}</h1>
            <p className="text-xs text-[#5A6A72] max-w-sm mx-auto">
              {t('auth.loginSubtitle')}
            </p>
          </div>

          {/* Form */}
          <form onSubmit={onSubmitForm} className="space-y-4">
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-500 rounded-xl text-xs font-semibold flex items-center gap-2">
                <i className="ri-error-warning-line text-sm" />
                <span>{error}</span>
              </div>
            )}

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-[#1C2526] uppercase">
                {t('admin.emailLabel')}
              </label>
              <div className="flex items-center gap-2 bg-[#F8F6F2]/60 border border-gray-200 rounded-xl px-3.5 py-2.5 focus-within:border-[#9B2A4C] transition-colors">
                <i className="ri-mail-line text-gray-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="bg-transparent border-none outline-none w-full text-xs text-[#1C2526] placeholder-gray-400"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-[#1C2526] uppercase">
                {t('admin.passwordLabel')}
              </label>
              <div className="flex items-center gap-2 bg-[#F8F6F2]/60 border border-gray-200 rounded-xl px-3.5 py-2.5 focus-within:border-[#9B2A4C] transition-colors">
                <i className="ri-lock-line text-gray-400" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="bg-transparent border-none outline-none w-full text-xs text-[#1C2526] placeholder-gray-400"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl gradient-bg text-white font-bold text-xs shadow hover:opacity-95 transition-opacity cursor-pointer flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <i className="ri-loader-4-line animate-spin text-sm" />
                  {t('services.booking.processing')}
                </>
              ) : (
                <>
                  <i className="ri-login-box-line text-sm" />
                  {t('portals.signIn')}
                </>
              )}
            </button>
          </form>

          {/* Quick Demo logins */}
          <div className="mt-6 pt-5 border-t border-gray-100 space-y-3">
            <span className="block text-[10px] font-bold text-[#8A97A0] uppercase tracking-wider text-center">
              {t('admin.demoHelper')}
            </span>
            <div className="grid grid-cols-2 gap-2">
              {demoAccounts.map((acc) => (
                <button
                  key={acc.email}
                  type="button"
                  onClick={() => handleQuickLogin(acc)}
                  className="p-2.5 text-left border rounded-xl hover:shadow-sm transition-all flex flex-col justify-between h-20 cursor-pointer group"
                  style={{
                    backgroundColor: acc.bg,
                    borderColor: acc.borderColor,
                  }}
                >
                  <div className="flex items-center justify-between w-full">
                    <span className="text-[10px] font-bold" style={{ color: acc.color }}>
                      {acc.label}
                    </span>
                    <i className={`${acc.icon} text-xs`} style={{ color: acc.color }} />
                  </div>
                  <div className="text-[8px] text-[#8A97A0] truncate w-full mt-1">
                    {acc.email}
                  </div>
                  <div className="text-[8px] text-[#8A97A0] font-medium">
                    Pass: {acc.password}
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="h-px bg-gray-100 my-5" />

          {/* Footer prompt */}
          <div className="text-center text-xs text-[#5A6A72]">
            <span>{t('auth.noAccount')} </span>
            <button
              onClick={() => navigate('/register')}
              className="text-[#9B2A4C] hover:underline font-bold cursor-pointer"
            >
              {t('auth.registerNow')}
            </button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
