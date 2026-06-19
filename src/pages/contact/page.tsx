import { useState, useEffect } from 'react';
import Navbar from '@/components/feature/Navbar';
import Footer from '@/components/feature/Footer';
import { useTranslation } from 'react-i18next';
import ContactOrbit from './components/ContactOrbit';
import { LeadsAPI } from '@/utils/api';
import CustomSelect from '@/components/common/Select';

type FormState = 'idle' | 'submitting' | 'success' | 'error';

function ContactJsonLd() {
  const { i18n } = useTranslation();
  useEffect(() => {
    const schema = {
      '@context': 'https://schema.org',
      '@type': 'ContactPage',
      name: 'Contact Alvin Tran | Marketer & AI Automation Specialist',
      description: 'Get in touch with Alvin Tran for marketing strategy, AI automation, and communications consulting. Available for collaborations and projects.',
      url: `${import.meta.env.VITE_SITE_URL ?? 'https://example.com'}/contact`,
      inLanguage: i18n.language === 'vi' ? 'vi' : 'en',
      mainEntity: {
        '@type': 'Person',
        name: 'Alvin Tran',
        jobTitle: 'Marketer, AI Automation Specialist & Communications Strategist',
        telephone: '+84376960193',
        url: import.meta.env.VITE_SITE_URL ?? 'https://example.com',
        address: {
          '@type': 'PostalAddress',
          addressLocality: 'Ha Dong',
          addressRegion: 'Hanoi',
          addressCountry: 'VN',
        },
      },
    };

    const existing = document.getElementById('contact-jsonld');
    if (existing) existing.remove();
    const script = document.createElement('script');
    script.id = 'contact-jsonld';
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(schema);
    document.head.appendChild(script);

    const titleEl = document.querySelector('title');
    if (titleEl) titleEl.textContent = 'Contact Alvin Tran | Marketer & AI Automation Specialist';

    const descEl = document.querySelector('meta[name="description"]');
    if (descEl) descEl.setAttribute('content', 'Contact Alvin Tran for marketing strategy, AI automation consulting, and communications projects. Based in Hanoi, Vietnam. Available for collaborations.');

    const canonicalEl = document.querySelector('link[rel="canonical"]');
    if (canonicalEl) canonicalEl.setAttribute('href', `${import.meta.env.VITE_SITE_URL ?? 'https://example.com'}/contact`);

    return () => {
      const el = document.getElementById('contact-jsonld');
      if (el) el.remove();
    };
  }, [i18n.language]);

  return null;
}

export default function ContactPage() {
  const { t, i18n } = useTranslation();
  const [formState, setFormState] = useState<FormState>('idle');
  const [charCount, setCharCount] = useState(0);
  const [selectedSubject, setSelectedSubject] = useState('');
  const [customSubject, setCustomSubject] = useState('');

  const servicesKeys = ['web', 'chatbot', 'landing', 'workflow', 'email', 'n8n', 'app'];

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const message = (form.elements.namedItem('message') as HTMLTextAreaElement).value;
    if (message.length > 500) return;

    setFormState('submitting');

    const formData = new FormData(form);
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const phone = formData.get('phone') as string;
    const subject = formData.get('subject') as string;

    const payload = {
      name,
      email,
      phone,
      company: '',
      service: subject || 'General Inquiry',
      message,
    };

    try {
      await LeadsAPI.create(payload);
      setFormState('success');
      form.reset();
      setSelectedSubject('');
      setCustomSubject('');
      setCharCount(0);
    } catch (err) {
      console.error('Failed to submit contact lead:', err);
      setFormState('error');
    }
  };

  const infoItems = t('contact.infoItems', { returnObjects: true }) as Array<{ icon: string; title: string; desc: string }>;

  return (
    <div className="min-h-screen" style={{ background: '#F8F6F2' }}>
      <ContactJsonLd />
      <Navbar />

      {/* Hero */}
      <section className="pt-28 pb-12 md:pt-36 md:pb-16 relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.03]" style={{ background: 'radial-gradient(ellipse at 50% 0%, #2C3E50 0%, transparent 60%)' }}></div>
        <div className="max-w-3xl mx-auto px-4 md:px-6 text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#2C3E50]/20 bg-[#2C3E50]/5 mb-5">
            <span className="text-[#2C3E50] text-xs font-semibold">{t('contact.badge')}</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-[#1C2526] mb-4 leading-tight">
            {t('contact.title')} <span className="gradient-text">{t('contact.titleHighlight')}</span>
          </h1>
          <p className="text-[#5A6A72] text-base md:text-lg leading-relaxed">
            {t('contact.subtitle')}
          </p>
        </div>
      </section>

      {/* Main content */}
      <section className="py-14 md:py-20" style={{ background: '#ffffff' }}>
        <div className="max-w-6xl mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
            {/* Left info */}
            <div className="lg:col-span-2 space-y-6 flex flex-col justify-between h-full">
              <div>
                <h2 className="text-[#1C2526] font-bold text-xl mb-3">{t('contact.infoTitle')}</h2>
                <p className="text-[#5A6A72] text-sm leading-relaxed">
                  {t('contact.infoDesc')}
                </p>
              </div>

              <ContactOrbit />
            </div>

            {/* Form */}
            <div className="lg:col-span-3">
              <div className="card-light rounded-2xl p-7 md:p-8">
                {formState === 'success' ? (
                  <div className="text-center py-10">
                    <div className="w-16 h-16 flex items-center justify-center rounded-full bg-green-50 mx-auto mb-5">
                      <i className="ri-check-line text-3xl text-green-500"></i>
                    </div>
                    <h3 className="text-[#1C2526] font-bold text-xl mb-3">{t('contact.form.successTitle')}</h3>
                    <p className="text-[#5A6A72] text-sm leading-relaxed max-w-sm mx-auto">
                      {t('contact.form.successDesc')}
                    </p>
                    <button
                      onClick={() => setFormState('idle')}
                      className="mt-6 border border-gray-200 text-[#1C2526] text-sm font-semibold px-6 py-2.5 rounded-full hover:border-[#2C3E50]/30 hover:text-[#2C3E50] transition-colors cursor-pointer whitespace-nowrap"
                    >
                      {t('contact.form.sendAnother')}
                    </button>
                  </div>
                ) : (
                  <form
                    onSubmit={handleSubmit}
                    data-readdy-form
                    id="contact-form-alvin"
                    className="space-y-5"
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-[#1C2526] text-sm font-medium mb-2">
                          {t('contact.form.nameLabel')} <span className="text-[#2C3E50]">*</span>
                        </label>
                        <input
                          type="text"
                          name="name"
                          required
                          placeholder={t('contact.form.namePlaceholder')}
                          className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-[#1C2526] text-sm placeholder-[#8A97A0] focus:outline-none focus:border-[#2C3E50]/50 transition-colors"
                        />
                      </div>
                      <div>
                        <label className="block text-[#1C2526] text-sm font-medium mb-2">
                          {t('contact.form.emailLabel')} <span className="text-[#2C3E50]">*</span>
                        </label>
                        <input
                          type="email"
                          name="email"
                          required
                          placeholder={t('contact.form.emailPlaceholder')}
                          className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-[#1C2526] text-sm placeholder-[#8A97A0] focus:outline-none focus:border-[#2C3E50]/50 transition-colors"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[#1C2526] text-sm font-medium mb-2">
                        {t('contact.form.phoneLabel')} <span className="text-[#2C3E50]">*</span>
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        required
                        placeholder={t('contact.form.phonePlaceholder')}
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-[#1C2526] text-sm placeholder-[#8A97A0] focus:outline-none focus:border-[#2C3E50]/50 transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-[#1C2526] text-sm font-medium mb-2">
                        {t('contact.form.subjectLabel')}
                      </label>
                      <div className="relative">
                        <CustomSelect
                          value={selectedSubject}
                          onChange={(val) => {
                            setSelectedSubject(val);
                            if (val !== 'custom') {
                              setCustomSubject('');
                            }
                          }}
                          placeholder={i18n.language === 'vi' ? 'Chọn dịch vụ cần hỗ trợ...' : 'Select service to request...'}
                          options={[
                            ...servicesKeys.map((key) => {
                              const title = t(`services.list.${key}.title`);
                              return { value: title, label: title };
                            }),
                            {
                              value: 'custom',
                              label: i18n.language === 'vi' ? 'Khác (Tự nhập)...' : 'Other (Type manually)...'
                            }
                          ]}
                          selectClassName="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm transition-all flex justify-between items-center cursor-pointer select-none text-[#1C2526] font-medium"
                        />
                      </div>

                      {selectedSubject === 'custom' && (
                        <div className="mt-3 animate-dropdown-in">
                          <input
                            type="text"
                            name="subject"
                            required
                            value={customSubject}
                            onChange={(e) => setCustomSubject(e.target.value)}
                            placeholder={t('contact.form.subjectPlaceholder')}
                            className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-[#1C2526] text-sm placeholder-[#8A97A0] focus:outline-none focus:border-[#2C3E50]/50 transition-colors"
                          />
                        </div>
                      )}
                    </div>

                    <div>
                      <label className="block text-[#1C2526] text-sm font-medium mb-2">
                        {t('contact.form.messageLabel')} <span className="text-[#2C3E50]">*</span>
                      </label>
                      <textarea
                        name="message"
                        required
                        rows={4}
                        maxLength={500}
                        placeholder={t('contact.form.messagePlaceholder')}
                        onChange={(e) => setCharCount(e.target.value.length)}
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-[#1C2526] text-sm placeholder-[#8A97A0] focus:outline-none focus:border-[#2C3E50]/50 transition-colors resize-none"
                      />
                      <div className="flex justify-between mt-1">
                        <span className="text-[#8A97A0] text-xs">{t('contact.form.messageHint')}</span>
                        <span className={`text-xs ${charCount > 450 ? 'text-red-500' : 'text-[#8A97A0]'}`}>{charCount}{t('contact.form.charLimit')}</span>
                      </div>
                    </div>

                    {formState === 'error' && (
                      <div className="flex items-center gap-2 p-3 rounded-xl bg-red-50 border border-red-100">
                        <i className="ri-error-warning-line text-red-500 text-sm"></i>
                        <p className="text-red-500 text-xs">{t('contact.form.errorMsg')}</p>
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={formState === 'submitting' || charCount > 500}
                      className="gradient-bg text-white font-semibold py-3.5 rounded-full w-full flex items-center justify-center gap-2 whitespace-nowrap hover:opacity-90 transition-opacity disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer text-sm"
                    >
                      {formState === 'submitting' ? (
                        <>
                          <i className="ri-loader-4-line animate-spin text-base"></i>
                          {t('contact.form.sending')}
                        </>
                      ) : (
                        <>
                          <i className="ri-send-plane-line text-base"></i>
                          {t('contact.form.sendBtn')}
                        </>
                      )}
                    </button>

                    <p className="text-center text-[#8A97A0] text-xs">
                      <i className="ri-lock-line mr-1"></i>
                      {t('contact.form.privacyNote')}
                    </p>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}