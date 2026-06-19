import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Navbar from '@/components/feature/Navbar';
import Footer from '@/components/feature/Footer';
import { useToast } from '@/components/common/ToastContext';

export default function ClientRegister() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const isVi = i18n.language === 'vi';

  const validateForm = (): boolean => {
    if (!name.trim()) {
      showToast(isVi ? 'Vui lòng nhập Họ và Tên!' : 'Please enter your Full Name!', 'warning');
      return false;
    }
    if (!email.trim() || !email.includes('@')) {
      showToast(isVi ? 'Vui lòng nhập Email hợp lệ!' : 'Please enter a valid Email!', 'warning');
      return false;
    }
    if (!phone.trim()) {
      showToast(isVi ? 'Vui lòng nhập Số điện thoại!' : 'Please enter your Phone Number!', 'warning');
      return false;
    }
    if (!password) {
      showToast(isVi ? 'Vui lòng nhập Mật khẩu!' : 'Please enter a Password!', 'warning');
      return false;
    }
    if (password.length < 6) {
      showToast(isVi ? 'Mật khẩu phải có ít nhất 6 ký tự!' : 'Password must be at least 6 characters!', 'warning');
      return false;
    }
    if (password !== confirmPassword) {
      showToast(isVi ? 'Mật khẩu xác nhận không khớp!' : 'Passwords do not match!', 'warning');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);

    try {
      const baseUrl = import.meta.env.VITE_API_URL 
        ? `${import.meta.env.VITE_API_URL.replace(/\/$/, '')}/api` 
        : 'http://localhost:3001/api';

      const response = await fetch(`${baseUrl}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          email,
          phone,
          password,
          role: 'client'
        })
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.message || (isVi ? 'Đăng ký tài khoản thất bại.' : 'Registration failed.'));
      }

      const data = await response.json();

      // Save token
      localStorage.setItem('access_token', data.access_token);
      
      // Save user details to session storage
      sessionStorage.setItem('user_logged_in', 'true');
      sessionStorage.setItem('user_role', data.user.role);
      sessionStorage.setItem('user_email', data.user.email);
      sessionStorage.setItem('user_name', data.user.name || '');
      sessionStorage.setItem('user_id', data.user.id);

      showToast(
        isVi ? 'Đăng ký tài khoản khách thành công!' : 'Client registration successful!',
        'success'
      );
      setSuccess(true);
    } catch (err: any) {
      showToast(err.message || (isVi ? 'Đăng ký thất bại' : 'Registration failed'), 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-between" style={{ background: '#F8F6F2' }}>
      <Navbar />

      <main className="pt-28 pb-16 flex-grow flex items-center">
        <div className="max-w-md mx-auto px-4 w-full">
          <div className="bg-white rounded-3xl p-6 md:p-8 border border-gray-100 shadow-xl relative overflow-hidden">
            {/* Colored top line */}
            <div className="absolute top-0 left-0 right-0 h-1.5 gradient-bg" />

            {success ? (
              <div className="text-center py-8 space-y-6 animate-fadeIn">
                <div className="w-16 h-16 bg-green-50 text-green-500 rounded-full flex items-center justify-center mx-auto shadow-inner">
                  <i className="ri-checkbox-circle-fill text-4xl" />
                </div>
                <div className="space-y-2">
                  <h2 className="text-2xl font-black text-[#1C2526]">
                    {isVi ? 'Đăng Ký Thành Công!' : 'Registration Complete!'}
                  </h2>
                  <p className="text-xs text-[#5A6A72] leading-relaxed">
                    {isVi 
                      ? 'Tài khoản khách hàng của bạn đã được tạo và kích hoạt tự động.' 
                      : 'Your client workspace account has been successfully created.'}
                  </p>
                </div>
                
                <button
                  onClick={() => navigate('/client-portal')}
                  className="w-full py-3.5 rounded-xl gradient-bg text-white font-bold text-xs shadow hover:opacity-95 transition-opacity cursor-pointer flex items-center justify-center gap-2"
                >
                  <i className="ri-dashboard-3-line text-sm" />
                  {isVi ? 'Đi tới Cổng Khách Hàng' : 'Go to Client Portal'}
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-2 text-center">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-[#9B2A4C]/25 bg-[#9B2A4C]/5 text-[#9B2A4C] text-[10px] font-bold uppercase tracking-wider">
                    <i className="ri-user-shared-line" />
                    {isVi ? 'Cổng Khách Hàng' : 'Client Access'}
                  </div>
                  <h1 className="text-2xl font-black text-[#1C2526]">
                    {isVi ? 'Đăng Ký Tài Khoản Khách' : 'Client Registration'}
                  </h1>
                  <p className="text-xs text-[#5A6A72] max-w-sm mx-auto">
                    {isVi 
                      ? 'Tạo tài khoản để quản lý chiến dịch, phê duyệt và giao tiếp.' 
                      : 'Create your account to manage campaigns, files, and deliverables.'}
                  </p>
                </div>

                <div className="h-px bg-gray-100 my-4" />

                {/* Name */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-[#1C2526] uppercase">
                    {isVi ? 'Họ và tên *' : 'Full Name *'}
                  </label>
                  <div className="flex items-center gap-2 bg-[#F8F6F2]/60 border border-gray-200 rounded-xl px-3.5 py-2.5 focus-within:border-[#9B2A4C] transition-colors">
                    <i className="ri-user-line text-gray-400" />
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder={isVi ? 'Nguyễn Văn A' : 'John Doe'}
                      className="bg-transparent border-none outline-none w-full text-xs text-[#1C2526] placeholder-gray-400"
                    />
                  </div>
                </div>

                {/* Email */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-[#1C2526] uppercase">
                    {isVi ? 'Địa chỉ Email *' : 'Email Address *'}
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

                {/* Phone */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-[#1C2526] uppercase">
                    {isVi ? 'Số điện thoại *' : 'Phone Number *'}
                  </label>
                  <div className="flex items-center gap-2 bg-[#F8F6F2]/60 border border-gray-200 rounded-xl px-3.5 py-2.5 focus-within:border-[#9B2A4C] transition-colors">
                    <i className="ri-phone-line text-gray-400" />
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder={isVi ? '0912345678' : '0912345678'}
                      className="bg-transparent border-none outline-none w-full text-xs text-[#1C2526] placeholder-gray-400"
                    />
                  </div>
                </div>

                {/* Password */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-[#1C2526] uppercase">
                    {isVi ? 'Mật khẩu *' : 'Password *'}
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

                {/* Confirm Password */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-[#1C2526] uppercase">
                    {isVi ? 'Xác nhận mật khẩu *' : 'Confirm Password *'}
                  </label>
                  <div className="flex items-center gap-2 bg-[#F8F6F2]/60 border border-gray-200 rounded-xl px-3.5 py-2.5 focus-within:border-[#9B2A4C] transition-colors">
                    <i className="ri-lock-check-line text-gray-400" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                      className="bg-transparent border-none outline-none w-full text-xs text-[#1C2526] placeholder-gray-400"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 rounded-xl gradient-bg text-white font-bold text-xs shadow hover:opacity-95 transition-opacity cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <i className="ri-loader-4-line animate-spin text-sm" />
                      {isVi ? 'Đang tạo tài khoản...' : 'Creating Account...'}
                    </>
                  ) : (
                    <>
                      <i className="ri-user-add-line text-sm" />
                      {isVi ? 'Đăng Ký Tài Khoản' : 'Register Now'}
                    </>
                  )}
                </button>

                <div className="text-center text-xs text-[#5A6A72] pt-2">
                  <span>{isVi ? 'Đã có tài khoản?' : 'Already have an account?'} </span>
                  <button
                    type="button"
                    onClick={() => navigate('/login')}
                    className="text-[#9B2A4C] hover:underline font-bold cursor-pointer"
                  >
                    {isVi ? 'Đăng nhập ngay' : 'Log in here'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
