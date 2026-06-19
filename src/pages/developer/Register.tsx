import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Navbar from '@/components/feature/Navbar';
import Footer from '@/components/feature/Footer';
import { DevelopersAPI } from '@/utils/api';
import { useToast } from '@/components/common/ToastContext';
import CustomSelect from '@/components/common/Select';

const SKILLS_OPTIONS = ['n8n', 'Web', 'App', 'Workflow', 'Landing', 'Email Auto', 'Copywriting', 'SEO', 'React', 'Node.js', 'Python', 'DevOps', 'PostgreSQL', 'Docker'];

export default function Register() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { showToast } = useToast();

  // Multi-step State
  const [step, setStep] = useState<number>(1);

  // Form Field States
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [title, setTitle] = useState('frontend');
  const [yearsOfExperience, setYearsOfExperience] = useState('mid');

  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [englishProficiency, setEnglishProficiency] = useState('conversational');
  const [portfolio, setPortfolio] = useState('');
  const [cvLink, setCvLink] = useState('');

  const [rateType, setRateType] = useState<'hourly' | 'fixed'>('hourly');
  const [rateValue, setRateValue] = useState<number>(200000);
  const [availability, setAvailability] = useState('freelance');
  const [shortBio, setShortBio] = useState('');

  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const isVi = i18n.language === 'vi';

  const toggleSkill = (skill: string) => {
    if (selectedSkills.includes(skill)) {
      setSelectedSkills(selectedSkills.filter((s) => s !== skill));
    } else {
      setSelectedSkills([...selectedSkills, skill]);
    }
  };

  const validateStep = (currentStep: number): boolean => {
    if (currentStep === 1) {
      if (!name.trim()) {
        showToast(isVi ? 'Vui lòng nhập Họ và Tên' : 'Please enter your Full Name', 'warning');
        return false;
      }
      if (!email.trim() || !email.includes('@')) {
        showToast(isVi ? 'Vui lòng nhập Email hợp lệ' : 'Please enter a valid Email', 'warning');
        return false;
      }
      if (!phone.trim()) {
        showToast(isVi ? 'Vui lòng nhập Số điện thoại' : 'Please enter your Phone Number', 'warning');
        return false;
      }
      if (!dateOfBirth) {
        showToast(isVi ? 'Vui lòng chọn Ngày sinh' : 'Please select your Date of Birth', 'warning');
        return false;
      }
      return true;
    }
    if (currentStep === 2) {
      if (selectedSkills.length === 0) {
        showToast(isVi ? 'Vui lòng chọn ít nhất 1 kỹ năng' : 'Please select at least 1 skill', 'warning');
        return false;
      }
      if (!portfolio.trim()) {
        showToast(isVi ? 'Vui lòng nhập link Portfolio hoặc GitHub' : 'Please enter your Portfolio or GitHub link', 'warning');
        return false;
      }
      return true;
    }
    return true;
  };

  const handleNext = () => {
    if (validateStep(step)) {
      setStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    setStep((prev) => prev - 1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep(3)) return;

    setSubmitting(true);

    try {
      await DevelopersAPI.create({
        name,
        email,
        phone,
        skills: selectedSkills,
        portfolio,
        rateType,
        rateValue,
        title,
        yearsOfExperience,
        englishProficiency,
        cvLink,
        availability,
        shortBio,
        dateOfBirth,
      });
      setSuccess(true);
    } catch (error) {
      showToast('Registration failed', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-between" style={{ background: '#F8F6F2' }}>
      <Navbar />

      <main className="pt-28 pb-16 flex-grow flex items-center">
        <div className="max-w-xl mx-auto px-4 w-full">
          <div className="bg-white rounded-3xl p-6 md:p-8 border border-[#2C3E50]/5 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1.5 gradient-bg" />

            {success ? (
              <div className="text-center py-10 space-y-6">
                <div className="w-16 h-16 bg-green-50 text-green-500 rounded-full flex items-center justify-center mx-auto shadow-inner">
                  <i className="ri-checkbox-circle-fill text-4xl" />
                </div>
                <div className="space-y-2">
                  <h2 className="text-2xl font-black text-[#1C2526]">{t('developer.successTitle')}</h2>
                  <p className="text-sm text-[#5A6A72] leading-relaxed">
                    {t('developer.successDesc')}
                  </p>
                </div>
                <div className="bg-[#2C3E50]/5 p-4 rounded-xl border border-[#2C3E50]/10 text-xs text-[#5A6A72] space-y-2">
                  <p>{t('developer.demoNote')}</p>
                  <div className="flex justify-center gap-3 mt-3">
                    <button
                      onClick={() => navigate('/admin')}
                      className="bg-[#2C3E50] text-white font-semibold px-4 py-2 rounded-lg hover:bg-[#2C3E50]/90 transition-colors cursor-pointer"
                    >
                      {t('developer.goToAdmin')}
                    </button>
                    <button
                      onClick={() => navigate('/member-portal')}
                      className="border border-[#2C3E50]/20 text-[#2C3E50] font-semibold px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
                    >
                      {t('developer.memberWorkspace')}
                    </button>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setSuccess(false);
                    setStep(1);
                    setName('');
                    setEmail('');
                    setPhone('');
                    setDateOfBirth('');
                    setPortfolio('');
                    setCvLink('');
                    setSelectedSkills([]);
                    setShortBio('');
                    setRateValue(isVi ? 200000 : 20);
                  }}
                  className="text-xs text-[#9B2A4C] hover:underline font-bold cursor-pointer"
                >
                  {t('developer.registerAnother')}
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2 text-center">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-[#9B2A4C]/25 bg-[#9B2A4C]/5 text-[#9B2A4C] text-xs font-semibold">
                    <i className="ri-team-line" />
                    {t('developer.badge')}
                  </div>
                  <h1 className="text-2xl md:text-3xl font-black text-[#1C2526]">
                    {t('developer.title')}
                  </h1>
                  <p className="text-xs text-[#5A6A72] max-w-sm mx-auto">
                    {t('developer.subtitle')}
                  </p>
                </div>

                {/* Progress Stepper indicator */}
                <div className="flex items-center justify-between max-w-sm mx-auto pt-2 pb-4">
                  {[1, 2, 3].map((s) => (
                    <div key={s} className="flex items-center flex-grow last:flex-grow-0">
                      <div className="flex flex-col items-center relative">
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 border ${
                            step === s
                              ? 'gradient-bg text-white border-transparent ring-4 ring-[#9B2A4C]/10'
                              : step > s
                              ? 'bg-[#9B2A4C] text-white border-transparent'
                              : 'bg-white border-gray-200 text-gray-400'
                          }`}
                        >
                          {step > s ? <i className="ri-check-line" /> : s}
                        </div>
                        <span
                          className={`text-[9px] font-bold mt-1.5 absolute whitespace-nowrap top-8 transition-colors ${
                            step === s ? 'text-[#9B2A4C]' : 'text-gray-400'
                          }`}
                        >
                          {t(`developer.stepTitle${s}` as any)}
                        </span>
                      </div>
                      {s < 3 && (
                        <div
                          className={`h-0.5 flex-grow mx-2 transition-all duration-500 ${
                            step > s ? 'bg-[#9B2A4C]' : 'bg-gray-200'
                          }`}
                        />
                      )}
                    </div>
                  ))}
                </div>

                <div className="h-px bg-gray-100 mt-6" />

                <div className="space-y-4 pt-4">
                  {/* ================= STEP 1 ================= */}
                  {step === 1 && (
                    <div className="space-y-4 animate-fadeIn">
                      {/* Name */}
                      <div>
                        <label className="block text-xs font-bold text-[#1C2526] mb-1.5 uppercase">
                          {t('developer.nameLabel')} *
                        </label>
                        <input
                          type="text"
                          required
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder={t('developer.namePlaceholder')}
                          className="w-full bg-[#F8F6F2]/50 border border-gray-200 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-[#9B2A4C] transition-colors"
                        />
                      </div>

                      {/* Email */}
                      <div>
                        <label className="block text-xs font-bold text-[#1C2526] mb-1.5 uppercase">
                          {t('developer.emailLabel')} *
                        </label>
                        <input
                          type="email"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder={t('developer.emailPlaceholder')}
                          className="w-full bg-[#F8F6F2]/50 border border-gray-200 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-[#9B2A4C] transition-colors"
                        />
                      </div>

                      {/* Phone */}
                      <div>
                        <label className="block text-xs font-bold text-[#1C2526] mb-1.5 uppercase">
                          {isVi ? 'Số điện thoại *' : 'Phone Number *'}
                        </label>
                        <input
                          type="tel"
                          required
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder={isVi ? 'Nhập số điện thoại của bạn' : 'Enter your phone number'}
                          className="w-full bg-[#F8F6F2]/50 border border-gray-200 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-[#9B2A4C] transition-colors"
                        />
                      </div>

                      {/* Date of Birth */}
                      <div>
                        <label className="block text-xs font-bold text-[#1C2526] mb-1.5 uppercase">
                          {t('developer.dobLabel')} *
                        </label>
                        <input
                          type="date"
                          required
                          value={dateOfBirth}
                          onChange={(e) => setDateOfBirth(e.target.value)}
                          className="w-full bg-[#F8F6F2]/50 border border-gray-200 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-[#9B2A4C] transition-colors text-[#1C2526] font-semibold"
                        />
                      </div>

                      {/* Title Dropdown */}
                      <div>
                        <label className="block text-xs font-bold text-[#1C2526] mb-1.5 uppercase">
                          {t('developer.titleLabel')}
                        </label>
                        <CustomSelect
                          value={title}
                          onChange={(val) => setTitle(val)}
                          options={[
                            { value: 'frontend', label: t('developer.titles.frontend') },
                            { value: 'backend', label: t('developer.titles.backend') },
                            { value: 'fullstack', label: t('developer.titles.fullstack') },
                            { value: 'ai', label: t('developer.titles.ai') },
                            { value: 'uiux', label: t('developer.titles.uiux') },
                            { value: 'devops', label: t('developer.titles.devops') },
                          ]}
                          selectClassName="w-full bg-[#F8F6F2]/50 border border-gray-200 rounded-xl px-4 py-2.5 text-xs focus:border-[#9B2A4C] cursor-pointer text-[#1C2526] font-semibold"
                        />
                      </div>

                      {/* Years of Experience buttons */}
                      <div className="space-y-2">
                        <label className="block text-xs font-bold text-[#1C2526] uppercase">
                          {t('developer.yearsLabel')}
                        </label>
                        <div className="grid grid-cols-2 gap-2">
                          {['junior', 'mid', 'senior', 'expert'].map((exp) => (
                            <button
                              key={exp}
                              type="button"
                              onClick={() => setYearsOfExperience(exp)}
                              className={`text-[10px] font-bold py-2.5 px-3 rounded-xl border transition-all text-left flex items-center justify-between cursor-pointer ${
                                yearsOfExperience === exp
                                  ? 'border-[#9B2A4C] bg-[#9B2A4C]/5 text-[#9B2A4C]'
                                  : 'border-gray-200 text-gray-500 hover:bg-gray-50'
                              }`}
                            >
                              <span>{t(`developer.experience.${exp}` as any)}</span>
                              {yearsOfExperience === exp && <i className="ri-checkbox-circle-fill text-[#9B2A4C] text-xs" />}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* ================= STEP 2 ================= */}
                  {step === 2 && (
                    <div className="space-y-4 animate-fadeIn">
                      {/* Skills Selection */}
                      <div className="space-y-2">
                        <label className="block text-xs font-bold text-[#1C2526] uppercase">
                          {t('developer.skillsLabel')} *
                        </label>
                        <div className="flex flex-wrap gap-1.5 max-h-[140px] overflow-y-auto p-1 border border-gray-100 rounded-xl bg-gray-50/50">
                          {SKILLS_OPTIONS.map((skill) => {
                            const active = selectedSkills.includes(skill);
                            return (
                              <button
                                type="button"
                                key={skill}
                                onClick={() => toggleSkill(skill)}
                                className={`text-[10px] font-semibold px-2.5 py-1.5 rounded-lg transition-all border cursor-pointer ${
                                  active
                                    ? 'gradient-bg text-white border-transparent shadow-sm'
                                    : 'bg-white border-gray-200 text-[#5A6A72] hover:border-gray-300'
                                }`}
                              >
                                {skill}
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* English Proficiency */}
                      <div className="space-y-2">
                        <label className="block text-xs font-bold text-[#1C2526] uppercase">
                          {t('developer.englishLabel')}
                        </label>
                        <div className="grid grid-cols-2 gap-2">
                          {['basic', 'conversational', 'fluent', 'native'].map((lvl) => (
                            <button
                              key={lvl}
                              type="button"
                              onClick={() => setEnglishProficiency(lvl)}
                              className={`text-[10px] font-bold py-2.5 px-3 rounded-xl border transition-all text-left flex items-center justify-between cursor-pointer ${
                                englishProficiency === lvl
                                  ? 'border-[#9B2A4C] bg-[#9B2A4C]/5 text-[#9B2A4C]'
                                  : 'border-gray-200 text-gray-500 hover:bg-gray-50'
                              }`}
                            >
                              <span>{t(`developer.englishLevels.${lvl}` as any)}</span>
                              {englishProficiency === lvl && <i className="ri-checkbox-circle-fill text-[#9B2A4C] text-xs" />}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Portfolio Link */}
                      <div>
                        <label className="block text-xs font-bold text-[#1C2526] mb-1.5 uppercase">
                          {t('developer.portfolioLabel')} *
                        </label>
                        <input
                          type="url"
                          required
                          value={portfolio}
                          onChange={(e) => setPortfolio(e.target.value)}
                          placeholder="https://github.com/your-username or Portfolio link"
                          className="w-full bg-[#F8F6F2]/50 border border-gray-200 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-[#9B2A4C] transition-colors"
                        />
                      </div>

                      {/* CV Link */}
                      <div>
                        <label className="block text-xs font-bold text-[#1C2526] mb-1.5 uppercase">
                          {t('developer.cvLabel')}
                        </label>
                        <input
                          type="url"
                          value={cvLink}
                          onChange={(e) => setCvLink(e.target.value)}
                          placeholder="https://drive.google.com/file/d/.../view"
                          className="w-full bg-[#F8F6F2]/50 border border-gray-200 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-[#9B2A4C] transition-colors"
                        />
                      </div>
                    </div>
                  )}

                  {/* ================= STEP 3 ================= */}
                  {step === 3 && (
                    <div className="space-y-4 animate-fadeIn">
                      {/* Desired rate */}
                      <div className="space-y-3">
                        <label className="block text-xs font-bold text-[#1C2526] uppercase">
                          {t('developer.rateLabel')} *
                        </label>
                        <div className="grid grid-cols-2 gap-4">
                          <button
                            type="button"
                            onClick={() => {
                              setRateType('hourly');
                              setRateValue(isVi ? 200000 : 20);
                            }}
                            className={`text-xs font-bold py-3 rounded-xl border flex items-center justify-center gap-2 cursor-pointer ${
                              rateType === 'hourly'
                                ? 'border-[#9B2A4C] bg-[#9B2A4C]/5 text-[#9B2A4C]'
                                : 'border-gray-200 text-gray-500 hover:bg-gray-50'
                            }`}
                          >
                            <i className="ri-time-line text-sm" />
                            {t('developer.hourlyBtn')}
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setRateType('fixed');
                              setRateValue(isVi ? 30000000 : 3000);
                            }}
                            className={`text-xs font-bold py-3 rounded-xl border flex items-center justify-center gap-2 cursor-pointer ${
                              rateType === 'fixed'
                                ? 'border-[#9B2A4C] bg-[#9B2A4C]/5 text-[#9B2A4C]'
                                : 'border-gray-200 text-gray-500 hover:bg-gray-50'
                            }`}
                          >
                            <i className="ri-money-dollar-circle-line text-sm" />
                            {t('developer.fixedBtn')}
                          </button>
                        </div>

                        <div className="flex items-center gap-2 bg-[#F8F6F2]/50 border border-gray-200 rounded-xl px-4 py-2">
                          {!isVi && <span className="text-sm font-bold text-gray-400">$</span>}
                          <input
                            type="number"
                            required
                            min={1}
                            value={rateValue}
                            onChange={(e) => setRateValue(parseInt(e.target.value) || 0)}
                            className="bg-transparent border-none outline-none w-full text-sm font-semibold text-[#1C2526]"
                          />
                          <span className="text-xs font-bold text-gray-400 whitespace-nowrap">
                            {isVi
                              ? (rateType === 'hourly' ? 'vnđ / giờ' : 'vnđ / dự án')
                              : (rateType === 'hourly' ? '/ hr' : '/ proj')}
                          </span>
                        </div>
                      </div>

                      {/* Work availability buttons */}
                      <div className="space-y-2">
                        <label className="block text-xs font-bold text-[#1C2526] uppercase">
                          {t('developer.availabilityLabel')}
                        </label>
                        <div className="grid grid-cols-3 gap-2">
                          {['fulltime', 'parttime', 'freelance'].map((avail) => (
                            <button
                              key={avail}
                              type="button"
                              onClick={() => setAvailability(avail)}
                              className={`text-[9px] font-bold py-2.5 px-1 rounded-xl border transition-all text-center cursor-pointer ${
                                availability === avail
                                  ? 'border-[#9B2A4C] bg-[#9B2A4C]/5 text-[#9B2A4C]'
                                  : 'border-gray-200 text-gray-500 hover:bg-gray-50'
                              }`}
                            >
                              {t(`developer.availabilityOptions.${avail}` as any)}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Short Bio */}
                      <div>
                        <label className="block text-xs font-bold text-[#1C2526] mb-1.5 uppercase">
                          {t('developer.bioLabel')}
                        </label>
                        <textarea
                          rows={3}
                          maxLength={300}
                          value={shortBio}
                          onChange={(e) => setShortBio(e.target.value)}
                          placeholder={isVi ? 'Tóm tắt ngắn gọn thế mạnh kỹ thuật của bạn...' : 'A brief summary of your tech strengths...'}
                          className="w-full bg-[#F8F6F2]/50 border border-gray-200 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-[#9B2A4C] transition-colors resize-none text-[#1C2526]"
                        />
                        <div className="flex justify-end text-[10px] text-gray-400">
                          {shortBio.length}/300
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Stepper controls */}
                <div className="flex justify-between items-center pt-6 border-t border-gray-100">
                  {step > 1 ? (
                    <button
                      type="button"
                      onClick={handleBack}
                      className="px-5 py-2.5 rounded-xl border border-gray-200 text-[#5A6A72] font-bold text-xs hover:bg-gray-50 transition-all cursor-pointer flex items-center gap-1"
                    >
                      <i className="ri-arrow-left-s-line" />
                      {t('developer.backBtn')}
                    </button>
                  ) : (
                    <div />
                  )}

                  {step < 3 ? (
                    <button
                      type="button"
                      onClick={handleNext}
                      className="px-5 py-2.5 rounded-xl gradient-bg text-white font-bold text-xs shadow hover:opacity-95 transition-opacity cursor-pointer flex items-center gap-1"
                    >
                      {t('developer.nextBtn')}
                      <i className="ri-arrow-right-s-line" />
                    </button>
                  ) : (
                    <button
                      type="submit"
                      disabled={submitting}
                      className="px-6 py-2.5 rounded-xl gradient-bg text-white font-bold text-xs shadow hover:opacity-95 transition-opacity cursor-pointer disabled:opacity-60 flex items-center gap-1.5"
                    >
                      {submitting ? (
                        <>
                          <i className="ri-loader-4-line animate-spin" />
                          {t('developer.submitting')}
                        </>
                      ) : (
                        <>
                          <i className="ri-send-plane-fill" />
                          {t('developer.submitBtn')}
                        </>
                      )}
                    </button>
                  )}
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
