import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Navbar from '@/components/feature/Navbar';
import Footer from '@/components/feature/Footer';
import { useToast } from '@/components/common/ToastContext';

export default function Login() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { showToast } = useToast();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // 2FA state variables
  const [temp2FAToken, setTemp2FAToken] = useState<string | null>(null);
  const [otpCode, setOtpCode] = useState('');
  const [verifying2FA, setVerifying2FA] = useState(false);

  const demoAccounts = [
    {
      role: 'admin',
      label: t('portals.roleAdmin'),
      email: 'admin1@gmail.com',
      password: 'admin123',
      color: '#9B2A4C',
      bg: 'rgba(155, 42, 76, 0.05)',
      borderColor: 'rgba(155, 42, 76, 0.15)',
      icon: 'ri-admin-line',
    },
    {
      role: 'manager',
      label: t('portals.roleManager'),
      email: 'manager1@gmail.com',
      password: 'manager123',
      color: '#2C3E50',
      bg: 'rgba(44, 62, 80, 0.05)',
      borderColor: 'rgba(44, 62, 80, 0.15)',
      icon: 'ri-user-settings-line',
    },
    {
      role: 'developer',
      label: t('portals.roleFreelancer'),
      email: 'dev1@gmail.com',
      password: 'dev123',
      color: '#1C2526',
      bg: 'rgba(28, 37, 38, 0.05)',
      borderColor: 'rgba(28, 37, 38, 0.15)',
      icon: 'ri-code-box-line',
    },
    {
      role: 'client',
      label: t('portals.roleClient'),
      email: 'client1@gmail.com',
      password: 'client123',
      color: '#16A085',
      bg: 'rgba(22, 160, 133, 0.05)',
      borderColor: 'rgba(22, 160, 133, 0.15)',
      icon: 'ri-user-3-line',
    },
  ];

  const handleLogin = async (loginEmail: string, loginPass: string) => {
    setError('');
    setLoading(true);

    try {
      const baseUrl = import.meta.env.VITE_API_URL 
        ? `${import.meta.env.VITE_API_URL.replace(/\/$/, '')}/api` 
        : 'http://localhost:3001/api';
      const response = await fetch(`${baseUrl}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: loginEmail, password: loginPass })
      });

      if (!response.ok) {
        throw new Error(t('admin.invalidCredentials'));
      }

      const data = await response.json();
      
      // If 2FA validation is triggered
      if (data.require2FA) {
        setTemp2FAToken(data.tempToken);
        showToast(
          i18n.language === 'vi' ? 'Vui lòng nhập mã OTP đã gửi về email!' : 'Please enter the 2FA OTP code sent to your email!',
          'success'
        );
        return;
      }
      
      // Save token
      localStorage.setItem('access_token', data.access_token);
      
      // Save user info for compatibility with existing UI
      const role = data.user.role;
      sessionStorage.setItem('user_logged_in', 'true');
      sessionStorage.setItem('user_role', role);
      sessionStorage.setItem('user_email', data.user.email);
      sessionStorage.setItem('user_name', data.user.name || '');
      sessionStorage.setItem('user_id', data.user.id);

      if (role === 'admin' || role === 'manager') {
        sessionStorage.setItem('admin_logged_in', 'true');
        sessionStorage.setItem('admin_role', role);
        navigate('/admin');
      } else if (role === 'client') {
        navigate('/client-portal');
      } else if (role === 'developer') {
        navigate('/member-portal');
      } else {
        navigate('/');
      }
    } catch (err: any) {
      setError(err.message || t('admin.invalidCredentials'));
    } finally {
      setLoading(false);
    }
  };

  const handleVerify2FA = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!temp2FAToken || !otpCode) return;

    setError('');
    setVerifying2FA(true);

    try {
      const baseUrl = import.meta.env.VITE_API_URL 
        ? `${import.meta.env.VITE_API_URL.replace(/\/$/, '')}/api` 
        : 'http://localhost:3001/api';
      const response = await fetch(`${baseUrl}/auth/verify-2fa`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tempToken: temp2FAToken, code: otpCode })
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.message || (i18n.language === 'vi' ? 'Mã xác thực không đúng.' : 'Incorrect verification code.'));
      }

      const data = await response.json();
      
      // Save token and user details
      localStorage.setItem('access_token', data.access_token);
      
      const role = data.user.role;
      sessionStorage.setItem('user_logged_in', 'true');
      sessionStorage.setItem('user_role', role);
      sessionStorage.setItem('user_email', data.user.email);
      sessionStorage.setItem('user_name', data.user.name || '');
      sessionStorage.setItem('user_id', data.user.id);

      if (role === 'admin' || role === 'manager') {
        sessionStorage.setItem('admin_logged_in', 'true');
        sessionStorage.setItem('admin_role', role);
        navigate('/admin');
      } else if (role === 'client') {
        navigate('/client-portal');
      } else if (role === 'developer') {
        navigate('/member-portal');
      } else {
        navigate('/');
      }
    } catch (err: any) {
      setError(err.message || 'OTP verification failed.');
    } finally {
      setVerifying2FA(false);
    }
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
            <h1 className="text-2xl font-black text-[#1C2526]">
              {temp2FAToken 
                ? (i18n.language === 'vi' ? 'Xác thực 2 lớp (2FA)' : '2-Factor Verification')
                : t('portals.signIn')}
            </h1>
            <p className="text-xs text-[#5A6A72] max-w-sm mx-auto">
              {temp2FAToken 
                ? (i18n.language === 'vi' ? 'Vui lòng nhập mã OTP đã gửi tới hòm thư của bạn để tiếp tục' : 'Please enter the OTP verification code sent to your email to continue')
                : t('auth.loginSubtitle')}
            </p>
          </div>

          {temp2FAToken ? (
            /* 2FA Form */
            <form onSubmit={handleVerify2FA} className="space-y-4">
              {error && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-500 rounded-xl text-xs font-semibold flex items-center gap-2">
                  <i className="ri-error-warning-line text-sm" />
                  <span>{error}</span>
                </div>
              )}

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-[#1C2526] uppercase">
                  {i18n.language === 'vi' ? 'Mã xác thực OTP (6 số)' : 'OTP Code (6 digits)'}
                </label>
                <div className="flex items-center gap-2 bg-[#F8F6F2]/60 border border-gray-200 rounded-xl px-3.5 py-2.5 focus-within:border-[#9B2A4C] transition-colors">
                  <i className="ri-key-line text-gray-400 animate-pulse" />
                  <input
                    type="text"
                    required
                    maxLength={6}
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
                    placeholder="123456"
                    className="bg-transparent border-none outline-none w-full text-xs text-[#1C2526] placeholder-gray-400 font-extrabold tracking-widest text-center"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={verifying2FA || otpCode.length < 6}
                className="w-full py-3.5 rounded-xl gradient-bg text-white font-bold text-xs shadow hover:opacity-95 transition-opacity cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {verifying2FA ? (
                  <>
                    <i className="ri-loader-4-line animate-spin text-sm" />
                    {i18n.language === 'vi' ? 'Đang xác thực...' : 'Verifying...'}
                  </>
                ) : (
                  <>
                    <i className="ri-shield-check-line text-sm" />
                    {i18n.language === 'vi' ? 'Xác thực mã OTP' : 'Verify Code'}
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => {
                  setTemp2FAToken(null);
                  setError('');
                  setOtpCode('');
                }}
                className="w-full text-center text-xs font-bold text-[#8A97A0] hover:text-[#9B2A4C] transition-colors py-1 cursor-pointer"
              >
                {i18n.language === 'vi' ? 'Quay lại Đăng nhập' : 'Back to Login'}
              </button>
            </form>
          ) : (
            /* Standard Login Form */
            <>
              <form onSubmit={onSubmitForm} className="space-y-4">
                {error && (
                  <div className="p-3 bg-red-50 border border-red-200 text-red-500 rounded-xl text-xs font-semibold flex items-center gap-2">
                    <i className="ri-error-warning-line text-sm" />
                    <span>{error}</span>
                  </div>
                )}

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-[#1C2526] uppercase">
                    {i18n.language === 'vi' ? 'Email hoặc Số điện thoại' : 'Email or Phone Number'}
                  </label>
                  <div className="flex items-center gap-2 bg-[#F8F6F2]/60 border border-gray-200 rounded-xl px-3.5 py-2.5 focus-within:border-[#9B2A4C] transition-colors">
                    <i className="ri-user-line text-gray-400" />
                    <input
                      type="text"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder={i18n.language === 'vi' ? 'email@example.com hoặc 0912345678' : 'email@example.com or 0912345678'}
                      className="bg-transparent border-none outline-none w-full text-xs text-[#1C2526] placeholder-gray-400"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-[#1C2526] uppercase">
                    {t('admin.passwordLabel')}
                  </label>
                  <div className="flex items-center gap-2 bg-[#F8F6F2]/60 border border-gray-200 rounded-xl px-3.5 py-2.5 focus-within:border-[#9B2A4C] transition-colors relative">
                    <i className="ri-lock-line text-gray-400" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="bg-transparent border-none outline-none w-full text-xs text-[#1C2526] placeholder-gray-400 pr-8"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#9B2A4C] transition-colors flex items-center justify-center cursor-pointer"
                    >
                      <i className={showPassword ? "ri-eye-off-line" : "ri-eye-line"} />
                    </button>
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
            </>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
