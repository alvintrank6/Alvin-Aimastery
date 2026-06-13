import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Navbar from '@/components/feature/Navbar';
import Footer from '@/components/feature/Footer';
import { MockDB } from '@/utils/db';

const SKILLS_OPTIONS = ['n8n', 'Web', 'App', 'Workflow', 'Landing', 'Email Auto', 'Copywriting', 'SEO'];

export default function Register() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [portfolio, setPortfolio] = useState('');
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [rateType, setRateType] = useState<'hourly' | 'fixed'>('hourly');
  const [rateValue, setRateValue] = useState<number>(20);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const toggleSkill = (skill: string) => {
    if (selectedSkills.includes(skill)) {
      setSelectedSkills(selectedSkills.filter((s) => s !== skill));
    } else {
      setSelectedSkills([...selectedSkills, skill]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedSkills.length === 0) {
      alert(t('outsource.skillsLabel') + ' *');
      return;
    }
    setSubmitting(true);

    setTimeout(() => {
      MockDB.addFreelancer({
        name,
        email,
        skills: selectedSkills,
        portfolio,
        rateType,
        rateValue,
      });

      setSubmitting(false);
      setSuccess(true);
    }, 1200);
  };

  return (
    <div className="min-h-screen flex flex-col justify-between" style={{ background: '#F8F6F2' }}>
      <Navbar />

      <main className="pt-24 pb-16 flex-grow flex items-center">
        <div className="max-w-xl mx-auto px-4 w-full">
          <div className="bg-white rounded-3xl p-6 md:p-8 border border-[#2C3E50]/5 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1.5 gradient-bg" />

            {success ? (
              <div className="text-center py-10 space-y-6">
                <div className="w-16 h-16 bg-green-50 text-green-500 rounded-full flex items-center justify-center mx-auto shadow-inner">
                  <i className="ri-checkbox-circle-fill text-4xl" />
                </div>
                <div className="space-y-2">
                  <h2 className="text-2xl font-black text-[#1C2526]">{t('outsource.successTitle')}</h2>
                  <p className="text-sm text-[#5A6A72] leading-relaxed">
                    {t('outsource.successDesc')}
                  </p>
                </div>
                <div className="bg-[#2C3E50]/5 p-4 rounded-xl border border-[#2C3E50]/10 text-xs text-[#5A6A72] space-y-2">
                  <p>
                    <span className="font-bold text-[#2C3E50]">Demo flow note:</span> You can verify this application right away by navigating to the Super Admin Dashboard.
                  </p>
                  <div className="flex justify-center gap-3 mt-2">
                    <button
                      onClick={() => navigate('/admin')}
                      className="bg-[#2C3E50] text-white font-semibold px-4 py-2 rounded-lg hover:bg-[#2C3E50]/90 transition-colors"
                    >
                      Go to Admin Dashboard
                    </button>
                    <button
                      onClick={() => navigate('/member-portal')}
                      className="border border-[#2C3E50]/20 text-[#2C3E50] font-semibold px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      Member Workspace
                    </button>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setSuccess(false);
                    setName('');
                    setEmail('');
                    setPortfolio('');
                    setSelectedSkills([]);
                    setRateValue(20);
                  }}
                  className="text-xs text-[#9B2A4C] hover:underline font-bold"
                >
                  Register another account
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2 text-center">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-[#9B2A4C]/25 bg-[#9B2A4C]/5 text-[#9B2A4C] text-xs font-semibold">
                    <i className="ri-team-line" />
                    {t('outsource.badge')}
                  </div>
                  <h1 className="text-2xl md:text-3xl font-black text-[#1C2526]">
                    {t('outsource.title')}
                  </h1>
                  <p className="text-xs text-[#5A6A72] max-w-sm mx-auto">
                    {t('outsource.subtitle')}
                  </p>
                </div>

                <div className="h-px bg-gray-100" />

                <div className="space-y-4">
                  {/* Name */}
                  <div>
                    <label className="block text-xs font-bold text-[#1C2526] mb-1.5 uppercase">Full Name *</label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Your full name"
                      className="w-full bg-[#F8F6F2]/50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#9B2A4C] transition-colors"
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-xs font-bold text-[#1C2526] mb-1.5 uppercase">Email Address *</label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="freelancer@example.com"
                      className="w-full bg-[#F8F6F2]/50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#9B2A4C] transition-colors"
                    />
                  </div>

                  {/* Skills (Tags) Selection */}
                  <div className="space-y-2">
                    <label className="block text-xs font-bold text-[#1C2526] uppercase">
                      {t('outsource.skillsLabel')} *
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {SKILLS_OPTIONS.map((skill) => {
                        const active = selectedSkills.includes(skill);
                        return (
                          <button
                            type="button"
                            key={skill}
                            onClick={() => toggleSkill(skill)}
                            className={`text-xs font-semibold px-3.5 py-2 rounded-xl transition-all border cursor-pointer ${
                              active
                                ? 'gradient-bg text-white border-transparent shadow-sm'
                                : 'bg-[#F8F6F2]/40 border-gray-200 text-[#5A6A72] hover:border-gray-300'
                            }`}
                          >
                            {skill}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Portfolio Link */}
                  <div>
                    <label className="block text-xs font-bold text-[#1C2526] mb-1.5 uppercase">
                      {t('outsource.portfolioLabel')} *
                    </label>
                    <input
                      type="url"
                      required
                      value={portfolio}
                      onChange={(e) => setPortfolio(e.target.value)}
                      placeholder="https://github.com/your-username or Drive link"
                      className="w-full bg-[#F8F6F2]/50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#9B2A4C] transition-colors"
                    />
                  </div>

                  {/* Desired rate */}
                  <div className="space-y-3">
                    <label className="block text-xs font-bold text-[#1C2526] uppercase">
                      {t('outsource.rateLabel')} *
                    </label>
                    <div className="grid grid-cols-2 gap-4">
                      <button
                        type="button"
                        onClick={() => setRateType('hourly')}
                        className={`text-xs font-bold py-3 rounded-xl border flex items-center justify-center gap-2 cursor-pointer ${
                          rateType === 'hourly'
                            ? 'border-[#9B2A4C] bg-[#9B2A4C]/5 text-[#9B2A4C]'
                            : 'border-gray-200 text-gray-500 hover:bg-gray-50'
                        }`}
                      >
                        <i className="ri-time-line text-sm" />
                        {t('outsource.hourly').split(' ')[0]}
                      </button>
                      <button
                        type="button"
                        onClick={() => setRateType('fixed')}
                        className={`text-xs font-bold py-3 rounded-xl border flex items-center justify-center gap-2 cursor-pointer ${
                          rateType === 'fixed'
                            ? 'border-[#9B2A4C] bg-[#9B2A4C]/5 text-[#9B2A4C]'
                            : 'border-gray-200 text-gray-500 hover:bg-gray-50'
                        }`}
                      >
                        <i className="ri-money-dollar-circle-line text-sm" />
                        {t('outsource.fixed').split(' ')[0]}
                      </button>
                    </div>

                    <div className="flex items-center gap-2 bg-[#F8F6F2]/50 border border-gray-200 rounded-xl px-4 py-2">
                      <span className="text-sm font-bold text-gray-400">$</span>
                      <input
                        type="number"
                        required
                        min={1}
                        value={rateValue}
                        onChange={(e) => setRateValue(parseInt(e.target.value) || 0)}
                        className="bg-transparent border-none outline-none w-full text-sm font-semibold text-[#1C2526]"
                      />
                      <span className="text-xs font-bold text-gray-400">
                        {rateType === 'hourly' ? '/ hr' : '/ proj'}
                      </span>
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full gradient-bg text-white font-bold py-3.5 rounded-xl shadow-lg hover:opacity-95 transition-opacity disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer text-sm"
                >
                  {submitting ? (
                    <span className="flex items-center justify-center gap-2">
                      <i className="ri-loader-4-line animate-spin" />
                      {t('outsource.submitting')}
                    </span>
                  ) : (
                    t('outsource.submitBtn')
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
