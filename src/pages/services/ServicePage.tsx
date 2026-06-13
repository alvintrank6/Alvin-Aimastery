import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Navbar from '@/components/feature/Navbar';
import Footer from '@/components/feature/Footer';
import { MockDB } from '@/utils/db';

interface ServiceContent {
  id: string;
  titleKey: string;
  descKey: string;
  detailsKey: string;
  icon: string;
  stack: string[];
  process: string[];
  whyUs: string[];
}

const SERVICES_DATA: Record<string, ServiceContent> = {
  web: {
    id: 'web',
    titleKey: 'services.list.web.title',
    descKey: 'services.list.web.desc',
    detailsKey: 'services.list.web.details',
    icon: 'ri-global-line',
    stack: ['Next.js', 'React', 'TailwindCSS', 'TypeScript', 'Node.js', 'Vercel'],
    process: ['Requirement Gathering & Wireframing', 'UI/UX Interactive Design Prototype', 'Frontend & Backend Coding', 'SEO Optimization & Speed Auditing', 'Deployment & Handover'],
    whyUs: ['100/100 Core Web Vitals speed points', 'Fully responsive mobile-first grids', 'Modern typography & custom layouts', 'Easy-to-use headless CMS integration'],
  },
  chatbot: {
    id: 'chatbot',
    titleKey: 'services.list.chatbot.title',
    descKey: 'services.list.chatbot.desc',
    detailsKey: 'services.list.chatbot.details',
    icon: 'ri-chat-voice-line',
    stack: ['OpenAI GPT-4o', 'Flowise AI', 'LangChain', 'Python', 'FastAPI', 'WhatsApp API'],
    process: ['Define Bot Persona & FAQ Datasets', 'Build RAG pipelines & knowledge bases', 'Develop Agent logic & API integrations', 'Beta Testing with customer simulations', 'Launch & Analytics tracking setup'],
    whyUs: ['Over 90% support query resolution rate', 'Instant replies under 2 seconds', 'Smart handoff to human agents when needed', 'Integrated multi-channel chat (Web, Messenger, Slack)'],
  },
  landing: {
    id: 'landing',
    titleKey: 'services.list.landing.title',
    descKey: 'services.list.landing.desc',
    detailsKey: 'services.list.landing.details',
    icon: 'ri-layout-4-line',
    stack: ['Figma', 'React', 'TailwindCSS', 'Framer Motion', 'Google Analytics 4', 'A/B Testing Tools'],
    process: ['Marketing Hook & Copywriting', 'High-Fidelity UI Design in Figma', 'Fast-coded Framer/React template development', 'Conversion Tracking & Meta Pixel setups', 'Split-testing and constant performance iterations'],
    whyUs: ['Average conversion rates over 15%', 'Persuasive structural layout hierarchy', 'Blazing-fast loading times', 'Optimized for high ROI search and social ads'],
  },
  workflow: {
    id: 'workflow',
    titleKey: 'services.list.workflow.title',
    descKey: 'services.list.workflow.desc',
    detailsKey: 'services.list.workflow.details',
    icon: 'ri-git-merge-line',
    stack: ['Zapier', 'Make.com', 'Node.js', 'Webhooks', 'REST APIs', 'SQL / NoSQL Databases'],
    process: ['Manual Work Audit & Flowcharting', 'System Selection & API endpoints verification', 'Workflow construction & error fallback routing', 'Live staging runs & data consistency checks', 'Production switch & monitoring alerts'],
    whyUs: ['Eliminates human errors completely', 'Saves up to 40 hours of manual tasks per week', 'Real-time synchronization across different apps', 'Clean logging and automatic error email alerts'],
  },
  email: {
    id: 'email',
    titleKey: 'services.list.email.title',
    descKey: 'services.list.email.desc',
    detailsKey: 'services.list.email.details',
    icon: 'ri-mail-send-line',
    stack: ['Klaviyo', 'Mailchimp', 'ActiveCampaign', 'HTML/CSS Email Templates', 'Segmentations Tools'],
    process: ['Subscriber List Health Review', 'Email Sequence Strategy & Flow Mapping', 'Stunning responsive template design', 'Copywriting & Call-to-action optimizations', 'Performance auditing & A/B testing schedules'],
    whyUs: ['Boosts email-attributed revenue by 30%+', 'Hyper-personalized automated triggers', 'High inbox delivery rates', 'Clean list hygiene and subscriber growth'],
  },
  n8n: {
    id: 'n8n',
    titleKey: 'services.list.n8n.title',
    descKey: 'services.list.n8n.desc',
    detailsKey: 'services.list.n8n.details',
    icon: 'ri-terminal-window-line',
    stack: ['n8n Self-Hosted', 'Docker', 'AWS', 'PostgreSQL', 'Custom Nodes', 'Bash / JS scripting'],
    process: ['Hạ tầng Setup (VPS Docker setup)', 'n8n Configuration & Postgres DB backups', 'Create complex multi-step logical nodes', 'Custom API bindings using Javascript', 'Cronjob scheduler & webhook listening'],
    whyUs: ['Zero node-execution volume costs', 'Completely secure on your own cloud servers', 'Supports advanced JS coding within tasks', 'Flexible and robust open-source engine'],
  },
  app: {
    id: 'app',
    titleKey: 'services.list.app.title',
    descKey: 'services.list.app.desc',
    detailsKey: 'services.list.app.details',
    icon: 'ri-smartphone-line',
    stack: ['React Native', 'Flutter', 'Expo', 'Firebase', 'Supabase', 'Node.js'],
    process: ['App architecture & DB modeling', 'UI/UX high fidelity mobile prototypes', 'Native components development', 'API backend connections & OAuth integrations', 'TestFlight / Google Play beta testing & release'],
    whyUs: ['Smooth animations & native performance', 'Cross-platform single codebase efficiency', 'Secure offline-first local storage databases', 'Push notifications and automatic update systems'],
  }
};

/* --- SUB-SHOWCASE COMPONENTS FOR PORTFOLIO DEMO --- */

// 1. Web Showcase: Viewport and Theme switcher
function WebShowcase() {
  const [viewport, setViewport] = useState<'desktop' | 'mobile'>('desktop');
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center bg-gray-50 p-3 rounded-2xl border border-gray-100">
        <span className="text-xs font-bold text-[#2C3E50]">Live Web Template Simulator</span>
        <div className="flex gap-2">
          <button
            onClick={() => setViewport('desktop')}
            className={`px-3 py-1 text-[10px] font-bold rounded-lg ${viewport === 'desktop' ? 'bg-[#9B2A4C] text-white' : 'bg-white text-gray-500 border border-gray-100'}`}
          >
            Desktop
          </button>
          <button
            onClick={() => setViewport('mobile')}
            className={`px-3 py-1 text-[10px] font-bold rounded-lg ${viewport === 'mobile' ? 'bg-[#9B2A4C] text-white' : 'bg-white text-gray-500 border border-gray-100'}`}
          >
            Mobile
          </button>
          <button
            onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
            className="px-3 py-1 text-[10px] font-bold rounded-lg bg-white border border-gray-100 text-gray-700"
          >
            {theme === 'light' ? '🌙 Dark' : '☀️ Light'}
          </button>
        </div>
      </div>

      <div className="flex justify-center items-center bg-[#F8F6F2] border border-gray-100 rounded-3xl p-6 min-h-[320px] transition-all duration-300">
        <div
          className={`bg-white rounded-2xl shadow-lg border overflow-hidden transition-all duration-500 ${
            viewport === 'desktop' ? 'w-full max-w-lg' : 'w-64'
          } ${theme === 'dark' ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white text-slate-800'}`}
        >
          {/* Header */}
          <div className={`p-4 border-b flex justify-between items-center ${theme === 'dark' ? 'border-slate-800' : 'border-gray-100'}`}>
            <span className="text-xs font-black tracking-wider">COSMETICS CO.</span>
            <div className="flex gap-2 text-[8px] font-bold text-gray-400">
              <span>Home</span>
              <span>Shop</span>
              <span>Blog</span>
            </div>
          </div>
          {/* Hero */}
          <div className="p-6 text-center space-y-3">
            <h4 className="text-md font-extrabold leading-tight">Reveal Your Natural Glowing Skin</h4>
            <p className="text-[10px] text-gray-400 max-w-xs mx-auto">
              Organic serums engineered with premium vitamins for radiant hydration.
            </p>
            <button className="bg-[#9B2A4C] text-white text-[9px] font-bold px-4 py-2 rounded-full shadow hover:opacity-90">
              Shop Serum
            </button>
          </div>
          {/* Mock Product */}
          <div className="p-4 grid grid-cols-2 gap-3">
            <div className={`p-3 rounded-xl border ${theme === 'dark' ? 'bg-slate-800/50 border-slate-700' : 'bg-slate-50 border-gray-100'}`}>
              <div className="aspect-square bg-gradient-to-tr from-[#9B2A4C]/10 to-[#A8B5A0]/20 rounded-lg mb-2 flex items-center justify-center text-[#9B2A4C]">
                <i className="ri-fluid-line text-lg" />
              </div>
              <p className="text-[9px] font-bold">Hyaluronic Acid</p>
              <p className="text-[8px] text-[#9B2A4C] font-semibold">$24.00</p>
            </div>
            <div className={`p-3 rounded-xl border ${theme === 'dark' ? 'bg-slate-800/50 border-slate-700' : 'bg-slate-50 border-gray-100'}`}>
              <div className="aspect-square bg-gradient-to-tr from-[#9B2A4C]/10 to-[#A8B5A0]/20 rounded-lg mb-2 flex items-center justify-center text-[#9B2A4C]">
                <i className="ri-contrast-drop-line text-lg" />
              </div>
              <p className="text-[9px] font-bold">Retinol Booster</p>
              <p className="text-[8px] text-[#9B2A4C] font-semibold">$28.00</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// 2. Chatbot Showcase: Interactive typing bot
function ChatbotShowcase() {
  const [messages, setMessages] = useState<Array<{ sender: 'user' | 'bot'; text: string }>>([
    { sender: 'bot', text: 'Xin chào! Tôi là Trợ Lý AI của Alvin Agency. Bạn đang quan tâm giải pháp chatbot nào?' }
  ]);
  const [typing, setTyping] = useState(false);

  const triggerReply = (query: string, reply: string) => {
    setMessages((prev) => [...prev, { sender: 'user', text: query }]);
    setTyping(true);

    setTimeout(() => {
      setMessages((prev) => [...prev, { sender: 'bot', text: reply }]);
      setTyping(false);
    }, 1000);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center bg-gray-50 p-3 rounded-2xl border border-gray-100">
        <span className="text-xs font-bold text-[#2C3E50]">Interactive AI Bot Simulator</span>
        <span className="text-[9px] font-bold text-gray-400">Status: Active</span>
      </div>

      <div className="bg-slate-900 rounded-3xl p-4 border border-slate-800 shadow-2xl flex flex-col h-[340px] justify-between">
        {/* Messages Screen */}
        <div className="flex-grow overflow-y-auto space-y-3 p-1">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] rounded-2xl px-3.5 py-2 text-xs leading-relaxed ${
                  msg.sender === 'user'
                    ? 'bg-[#9B2A4C] text-white rounded-tr-none'
                    : 'bg-slate-800 text-slate-100 rounded-tl-none'
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}

          {typing && (
            <div className="flex justify-start">
              <div className="bg-slate-800 text-gray-400 rounded-2xl rounded-tl-none px-3.5 py-2 text-xs flex gap-1 items-center">
                <span className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce" />
                <span className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce delay-150" />
                <span className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce delay-300" />
              </div>
            </div>
          )}
        </div>

        {/* Buttons Suggestions */}
        <div className="border-t border-slate-800 pt-3 mt-2 space-y-2">
          <p className="text-[9px] font-bold text-slate-500 uppercase tracking-wide">Suggested Queries</p>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => triggerReply('Dịch vụ giá thế nào?', 'Dịch vụ Chatbot AI của chúng tôi bắt đầu từ $300/tháng tùy thuộc vào số lượng hội thoại và cơ sở dữ liệu (Knowledge Base) cung cấp.')}
              className="text-[10px] font-semibold bg-slate-800 text-slate-300 hover:text-white px-2.5 py-1.5 rounded-xl transition-colors text-left"
            >
              🏷️ Payout/Rates?
            </button>
            <button
              onClick={() => triggerReply('Bot có tích hợp WhatsApp không?', 'Có! Chúng tôi hỗ trợ tích hợp WhatsApp Business API, Facebook Messenger, Zalo và trực tiếp lên Website.')}
              className="text-[10px] font-semibold bg-slate-800 text-slate-300 hover:text-white px-2.5 py-1.5 rounded-xl transition-colors text-left"
            >
              💬 WhatsApp channels?
            </button>
            <button
              onClick={() => triggerReply('Tư vấn dịch vụ AI', 'Vui lòng gửi form đặt lịch bên cạnh, trợ lý AI sẽ tự động lập lịch biểu tư vấn 1-1 với chuyên gia Alvin.')}
              className="text-[10px] font-semibold bg-slate-800 text-slate-300 hover:text-white px-2.5 py-1.5 rounded-xl transition-colors text-left"
            >
              📞 Book AI Session?
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// 3. Landing Page Showcase: A/B Testing comparison slider
function LandingShowcase() {
  const [activeSide, setActiveSide] = useState<'old' | 'optimized'>('optimized');

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center bg-gray-50 p-3 rounded-2xl border border-gray-100">
        <span className="text-xs font-bold text-[#2C3E50]">A/B Test Design Comparison</span>
        <div className="inline-flex rounded-xl border border-gray-200 p-0.5 bg-white">
          <button
            onClick={() => setActiveSide('old')}
            className={`text-[10px] font-bold px-2.5 py-1 rounded-lg ${activeSide === 'old' ? 'bg-[#2C3E50] text-white' : 'text-gray-400'}`}
          >
            Old Design
          </button>
          <button
            onClick={() => setActiveSide('optimized')}
            className={`text-[10px] font-bold px-2.5 py-1 rounded-lg ${activeSide === 'optimized' ? 'bg-[#9B2A4C] text-white' : 'text-gray-400'}`}
          >
            Optimized (Alvin)
          </button>
        </div>
      </div>

      <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-xl min-h-[300px] flex flex-col justify-between">
        {activeSide === 'old' ? (
          <div className="space-y-4 animate-fadeIn">
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold text-red-500 bg-red-50 px-2 py-0.5 rounded-md">Conversion Rate: 1.8%</span>
              <span className="text-[10px] text-gray-400 font-bold">Bounce Rate: 72%</span>
            </div>
            <div className="border border-dashed border-gray-200 p-8 text-center rounded-2xl space-y-2">
              <h5 className="font-bold text-gray-500 text-sm">Welcome to our Medical Spa</h5>
              <p className="text-[10px] text-gray-400 max-w-xs mx-auto">We provide deep body massage and facials. Contact us today or write down your email in our newsletter form below.</p>
              <div className="w-full h-8 bg-gray-100 rounded-lg flex items-center justify-center text-[10px] text-gray-400">Newsletter input form here</div>
              <button className="bg-gray-400 text-white text-[10px] font-bold px-4 py-1.5 rounded mt-2">Submit</button>
            </div>
            <p className="text-[10px] text-gray-400 italic">Weak layout, lack of visual hooks, generic copy, and low contrast call-to-actions.</p>
          </div>
        ) : (
          <div className="space-y-4 animate-fadeIn">
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded-md">Conversion Rate: 8.5% (+370%)</span>
              <span className="text-[10px] text-green-600 font-bold">Bounce Rate: 34%</span>
            </div>
            <div className="bg-slate-900 border border-slate-800 text-white p-6 rounded-3xl space-y-4 text-center relative overflow-hidden">
              <div className="absolute top-0 right-0 w-20 h-20 bg-[#9B2A4C]/10 rounded-full blur-xl" />
              <div className="inline-block text-[8px] font-bold text-[#A8B5A0] tracking-widest uppercase">🌿 Organic Spa Therapies</div>
              <h5 className="font-extrabold text-md leading-snug">Rejuvenate Your Senses. Restore Your Health.</h5>
              <p className="text-[10px] text-slate-300 max-w-xs mx-auto">Get 15% OFF your first deep facial therapy session. Limited slots available this week.</p>
              <div className="flex gap-2 max-w-xs mx-auto">
                <input
                  type="email"
                  disabled
                  placeholder="Enter your email"
                  className="bg-slate-800 border border-slate-700 text-[10px] px-3 py-2 rounded-xl w-full"
                />
                <button className="bg-[#9B2A4C] text-white text-[10px] font-bold px-4 py-2 rounded-xl whitespace-nowrap shadow-lg">
                  Claim 15% Off
                </button>
              </div>
            </div>
            <p className="text-[10px] text-slate-500 font-medium">Highly optimized above-the-fold layout, custom copy strategy, social proof hooks, and urgent call-to-action.</p>
          </div>
        )}
      </div>
    </div>
  );
}

// 4. Workflow Automation Showcase: Simulation trigger
function WorkflowShowcase() {
  const [step, setStep] = useState<number>(0);
  const [running, setRunning] = useState(false);

  const startSimulation = () => {
    if (running) return;
    setRunning(true);
    setStep(1);

    setTimeout(() => {
      setStep(2);
      setTimeout(() => {
        setStep(3);
        setTimeout(() => {
          setStep(4);
          setRunning(false);
        }, 1200);
      }, 1200);
    }, 1200);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center bg-gray-50 p-3 rounded-2xl border border-gray-100">
        <span className="text-xs font-bold text-[#2C3E50]">Workflow Automation Pipeline</span>
        <button
          onClick={startSimulation}
          disabled={running}
          className="px-3.5 py-1.5 bg-[#9B2A4C] text-white text-[10px] font-bold rounded-xl disabled:opacity-50 transition-opacity flex items-center gap-1 cursor-pointer"
        >
          <i className="ri-play-fill" />
          {running ? 'Running Simulation...' : 'Test Simulation'}
        </button>
      </div>

      <div className="bg-slate-900 rounded-3xl p-6 border border-slate-800 shadow-2xl min-h-[300px] flex flex-col justify-center space-y-6">
        {/* Webhook step */}
        <div className="flex items-center gap-4">
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm transition-all duration-300 ${
            step >= 1 ? 'bg-green-500 text-white shadow-lg shadow-green-500/20' : 'bg-slate-800 text-slate-400'
          }`}>
            <i className="ri-webhook-line" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-100">Step 1: Webhook Trigger</p>
            <p className="text-[9px] text-slate-400">Listens to new customer form submissions</p>
          </div>
        </div>

        {/* Connection line */}
        <div className="w-0.5 h-6 bg-slate-800 ml-4 relative">
          <div className={`absolute top-0 left-0 w-full bg-green-500 transition-all duration-500 ${step >= 2 ? 'h-full' : 'h-0'}`} />
        </div>

        {/* DB processing step */}
        <div className="flex items-center gap-4">
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm transition-all duration-300 ${
            step >= 2 ? 'bg-green-500 text-white shadow-lg shadow-green-500/20' : 'bg-slate-800 text-slate-400'
          }`}>
            <i className="ri-database-2-line" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-100">Step 2: Database Sync</p>
            <p className="text-[9px] text-slate-400">Stores lead data inside agency CRM database</p>
          </div>
        </div>

        {/* Connection line */}
        <div className="w-0.5 h-6 bg-slate-800 ml-4 relative">
          <div className={`absolute top-0 left-0 w-full bg-green-500 transition-all duration-500 ${step >= 3 ? 'h-full' : 'h-0'}`} />
        </div>

        {/* Notification Slack step */}
        <div className="flex items-center gap-4">
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm transition-all duration-300 ${
            step >= 3 ? 'bg-green-500 text-white shadow-lg shadow-green-500/20' : 'bg-slate-800 text-slate-400'
          }`}>
            <i className="ri-slack-line" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-100">Step 3: Alert Notification</p>
            <p className="text-[9px] text-slate-400">Dispatches detailed report in team Slack channel</p>
          </div>
        </div>

        {/* Connection line */}
        <div className="w-0.5 h-6 bg-slate-800 ml-4 relative">
          <div className={`absolute top-0 left-0 w-full bg-green-500 transition-all duration-500 ${step >= 4 ? 'h-full' : 'h-0'}`} />
        </div>

        {/* Sync Sheet */}
        <div className="flex items-center gap-4">
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm transition-all duration-300 ${
            step >= 4 ? 'bg-green-500 text-white shadow-lg shadow-green-500/20' : 'bg-slate-800 text-slate-400'
          }`}>
            <i className="ri-file-excel-line" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-100">Step 4: Google Sheets Ledger Update</p>
            <p className="text-[9px] text-slate-400">Updates finance database reports</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// 5. Email Showcase: Newsletter sequence selector
function EmailShowcase() {
  const [activeTab, setActiveTab] = useState<'abandoned' | 'welcome'>('abandoned');

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center bg-gray-50 p-3 rounded-2xl border border-gray-100">
        <span className="text-xs font-bold text-[#2C3E50]">Campaign Email Template Mock</span>
        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab('abandoned')}
            className={`px-3 py-1 text-[10px] font-bold rounded-lg ${activeTab === 'abandoned' ? 'bg-[#9B2A4C] text-white' : 'bg-white text-gray-500 border border-gray-100'}`}
          >
            Abandoned Cart
          </button>
          <button
            onClick={() => setActiveTab('welcome')}
            className={`px-3 py-1 text-[10px] font-bold rounded-lg ${activeTab === 'welcome' ? 'bg-[#9B2A4C] text-white' : 'bg-white text-gray-500 border border-gray-100'}`}
          >
            Welcome Series
          </button>
        </div>
      </div>

      <div className="bg-gray-100 rounded-3xl p-4 border border-gray-200 shadow-inner flex justify-center min-h-[300px]">
        {activeTab === 'abandoned' ? (
          <div className="bg-white rounded-2xl shadow w-full max-w-sm overflow-hidden text-slate-800 animate-fadeIn">
            <div className="bg-[#2C3E50] p-4 text-center text-white">
              <span className="text-[9px] uppercase font-bold tracking-widest text-[#A8B5A0]">Did you forget something?</span>
            </div>
            <div className="p-6 text-center space-y-4">
              <h5 className="font-black text-sm">We saved your cart items!</h5>
              <p className="text-[10px] text-gray-400 max-w-[250px] mx-auto leading-relaxed">
                Your skincare routine is waiting. Claim an exclusive 10% coupon below to check out.
              </p>
              <div className="border border-dashed p-3 rounded-xl max-w-[180px] mx-auto text-xs font-bold text-[#9B2A4C] bg-[#9B2A4C]/5">
                CODE: BACK10
              </div>
              <button className="w-full bg-[#9B2A4C] text-white text-xs font-bold py-2.5 rounded-xl shadow-md hover:opacity-90">
                Restore Shopping Cart
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow w-full max-w-sm overflow-hidden text-slate-800 animate-fadeIn">
            <div className="bg-[#9B2A4C] p-4 text-center text-white">
              <span className="text-[9px] uppercase font-bold tracking-widest text-slate-200">Welcome to the Club</span>
            </div>
            <div className="p-6 text-center space-y-4">
              <h5 className="font-black text-sm">Thanks for joining us!</h5>
              <p className="text-[10px] text-gray-400 max-w-[250px] mx-auto leading-relaxed">
                As a valued member, you get access to early collection launches, tutorials, and expert skin health advice.
              </p>
              <button className="w-full bg-[#2C3E50] text-white text-xs font-bold py-2.5 rounded-xl shadow-md hover:opacity-90">
                Explore Best Sellers
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// 6. Mobile App Showcase: App screen slider inside device mock
function AppShowcase() {
  const [activeScreen, setActiveScreen] = useState<'welcome' | 'shop' | 'profile'>('welcome');

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center bg-gray-50 p-3 rounded-2xl border border-gray-100">
        <span className="text-xs font-bold text-[#2C3E50]">Interactive Mobile App Prototype</span>
        <div className="flex gap-2">
          {['welcome', 'shop', 'profile'].map((screen) => (
            <button
              key={screen}
              onClick={() => setActiveScreen(screen as any)}
              className={`px-2 py-0.5 text-[9px] uppercase font-bold rounded ${activeScreen === screen ? 'bg-[#9B2A4C] text-white' : 'bg-white text-gray-400 border border-gray-100'}`}
            >
              {screen}
            </button>
          ))}
        </div>
      </div>

      <div className="flex justify-center items-center bg-[#F8F6F2] rounded-3xl p-6 min-h-[340px]">
        {/* Mobile Device Container */}
        <div className="w-56 h-[320px] bg-slate-900 border-4 border-slate-800 rounded-[30px] p-2 shadow-2xl relative flex flex-col justify-between overflow-hidden">
          {/* Top Speaker */}
          <div className="w-16 h-3 bg-slate-800 rounded-full mx-auto mb-2" />

          {/* Screen */}
          <div className="bg-white rounded-2xl flex-grow overflow-hidden p-3 flex flex-col justify-between text-slate-800">
            {activeScreen === 'welcome' && (
              <div className="h-full flex flex-col justify-between text-center space-y-2 animate-fadeIn py-4">
                <div className="w-10 h-10 rounded-full bg-[#9B2A4C]/10 text-[#9B2A4C] flex items-center justify-center mx-auto">
                  <i className="ri-customer-service-line text-lg" />
                </div>
                <div className="space-y-1">
                  <h6 className="font-extrabold text-xs">AI Chat Hub</h6>
                  <p className="text-[8px] text-gray-400 max-w-[150px] mx-auto">Integrated multi-channel agent assistant for teams.</p>
                </div>
                <button
                  onClick={() => setActiveScreen('shop')}
                  className="w-full bg-[#9B2A4C] text-white text-[8px] font-bold py-1.5 rounded-lg"
                >
                  Get Started
                </button>
              </div>
            )}

            {activeScreen === 'shop' && (
              <div className="h-full flex flex-col justify-between animate-fadeIn">
                <div className="flex justify-between items-center pb-2 border-b border-gray-100">
                  <span className="text-[8px] font-bold">Workspace App Store</span>
                  <i className="ri-shopping-cart-2-line text-[9px] text-[#9B2A4C]" />
                </div>
                <div className="space-y-2 py-2 flex-grow overflow-y-auto">
                  <div className="flex items-center justify-between p-2 bg-gray-50 rounded-lg border border-gray-100">
                    <span className="text-[8px] font-bold">Chatbot Plugin</span>
                    <span className="text-[8px] text-[#9B2A4C] font-semibold">$9.99</span>
                  </div>
                  <div className="flex items-center justify-between p-2 bg-gray-50 rounded-lg border border-gray-100">
                    <span className="text-[8px] font-bold">n8n Node sync</span>
                    <span className="text-[8px] text-[#9B2A4C] font-semibold">$14.99</span>
                  </div>
                </div>
                <button
                  onClick={() => setActiveScreen('profile')}
                  className="w-full bg-[#2C3E50] text-white text-[8px] font-bold py-1.5 rounded-lg"
                >
                  Checkout
                </button>
              </div>
            )}

            {activeScreen === 'profile' && (
              <div className="h-full flex flex-col justify-between text-center animate-fadeIn py-2">
                <div className="w-10 h-10 rounded-full bg-gray-100 border flex items-center justify-center mx-auto font-bold text-xs text-gray-700">
                  U
                </div>
                <div className="space-y-1">
                  <h6 className="font-extrabold text-[10px]">User Account Settings</h6>
                  <p className="text-[8px] text-gray-400">Authenticated: user@agency.com</p>
                </div>
                <div className="bg-green-50 border border-green-200 text-green-700 text-[8px] p-2 rounded-lg font-bold">
                  Payment Gateway Secured
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// 7. General Placeholder / Fallback Showcase (used as template sample list)
function GeneralShowcase({ serviceId }: { serviceId: string }) {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center bg-gray-50 p-3 rounded-2xl border border-gray-100">
        <span className="text-xs font-bold text-[#2C3E50]">Sample Templates & Reference Cases</span>
        <span className="text-[9px] font-bold text-gray-400">7 Active Clients</span>
      </div>
      <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm space-y-4">
        <h3 className="text-xs font-bold text-[#1C2526] uppercase">Reference Showcase Cases</h3>
        <div className="space-y-3">
          <div className="p-3 rounded-2xl bg-[#F8F6F2]/50 border border-gray-100 flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-[#1C2526]">Senn Cosmetics Landing Portal</p>
              <p className="text-[9px] text-gray-400">Conversion Rate: 8.4% | Dynamic Klaviyo email integration</p>
            </div>
            <i className="ri-arrow-right-up-line text-[#9B2A4C]" />
          </div>
          <div className="p-3 rounded-2xl bg-[#F8F6F2]/50 border border-gray-100 flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-[#1C2526]">Beta Home Viet Nam Realty CRM</p>
              <p className="text-[9px] text-gray-400">Automated Lead ingestion pipelines syncing directly with Slack</p>
            </div>
            <i className="ri-arrow-right-up-line text-[#9B2A4C]" />
          </div>
          <div className="p-3 rounded-2xl bg-[#F8F6F2]/50 border border-gray-100 flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-[#1C2526]">ByeBye Pimple Shop Store</p>
              <p className="text-[9px] text-gray-400">Responsive web UI scaling Daily sales to $8,000 in one week</p>
            </div>
            <i className="ri-arrow-right-up-line text-[#9B2A4C]" />
          </div>
        </div>
      </div>
    </div>
  );
}

// Router dispatcher for showcases
function ServiceShowcaseDispatcher({ serviceId }: { serviceId: string }) {
  const id = serviceId.toLowerCase();
  switch (id) {
    case 'web':
      return <WebShowcase />;
    case 'chatbot':
      return <ChatbotShowcase />;
    case 'landing':
      return <LandingShowcase />;
    case 'workflow':
      return <WorkflowShowcase />;
    case 'n8n':
      return <WorkflowShowcase />;
    case 'email':
      return <EmailShowcase />;
    case 'app':
      return <AppShowcase />;
    default:
      return <GeneralShowcase serviceId={id} />;
  }
}

/* --- MAIN SERVICE PAGE COMPONENT --- */

export default function ServicePage() {
  const { serviceId } = useParams<{ serviceId: string }>();
  const { t } = useTranslation();
  const navigate = useNavigate();

  const service = serviceId ? SERVICES_DATA[serviceId.toLowerCase()] : null;

  // Form states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [company, setCompany] = useState('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    // Scroll to top when parameter changes
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setSuccess(false);
  }, [serviceId]);

  if (!service) {
    return (
      <div className="min-h-screen flex flex-col justify-between" style={{ background: '#F8F6F2' }}>
        <Navbar />
        <div className="max-w-md mx-auto text-center py-20 px-4">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Service Not Found</h1>
          <Link to="/" className="text-[#9B2A4C] hover:underline">Return to Home</Link>
        </div>
        <Footer />
      </div>
    );
  }

  const handleBooking = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    setTimeout(() => {
      MockDB.addLead({
        name,
        email,
        phone,
        company,
        service: t(service.titleKey),
        message: message || `Client requested consultation for: ${t(service.titleKey)}`
      });

      setSubmitting(false);
      setSuccess(true);
      // Reset form fields
      setName('');
      setEmail('');
      setPhone('');
      setCompany('');
      setMessage('');
    }, 1200);
  };

  return (
    <div className="min-h-screen flex flex-col justify-between" style={{ background: '#F8F6F2' }}>
      <Navbar />

      <main className="pt-24 pb-16 flex-grow">
        {/* Service Hero */}
        <section className="max-w-7xl mx-auto px-4 md:px-6 py-10 md:py-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#9B2A4C]/25 bg-[#9B2A4C]/5">
                <i className={`${service.icon} text-sm text-[#9B2A4C]`} />
                <span className="text-[#9B2A4C] text-xs font-semibold">{t('services.badge')}</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-black text-[#1C2526] leading-tight">
                {t(service.titleKey)}
              </h1>
              <p className="text-[#5A6A72] text-lg leading-relaxed">
                {t(service.descKey)}
              </p>
              <div className="h-px bg-[#2C3E50]/10" />

              {/* Dynamic Interactive Portfolio Showcase */}
              <div className="my-6">
                <ServiceShowcaseDispatcher serviceId={service.id} />
              </div>

              <p className="text-[#1C2526] text-sm leading-relaxed font-medium">
                {t(service.detailsKey)}
              </p>

              {/* Stack tags */}
              <div className="space-y-3 pt-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#5A6A72]">
                  {t('services.techStack')}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {service.stack.map((item) => (
                    <span
                      key={item}
                      className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-white border border-[#2C3E50]/10 text-[#2C3E50] shadow-sm"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Booking card */}
            <div className="lg:col-span-5 sticky top-24">
              <div className="bg-white rounded-3xl p-6 md:p-8 border border-[#2C3E50]/5 shadow-xl relative overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-1.5 gradient-bg" />
                <h2 className="text-[#1C2526] font-bold text-xl mb-2">
                  {t('services.bookService')}
                </h2>
                <p className="text-xs text-[#8A97A0] mb-6">
                  Submit this form to book an onboarding session. This request will instantly feed into the Admin CRM portal.
                </p>

                {success ? (
                  <div className="text-center py-8 space-y-4">
                    <div className="w-16 h-16 bg-green-50 text-green-500 rounded-full flex items-center justify-center mx-auto shadow-inner">
                      <i className="ri-checkbox-circle-fill text-4xl" />
                    </div>
                    <h3 className="text-lg font-bold text-[#1C2526]">Request Submitted!</h3>
                    <p className="text-xs text-[#5A6A72] leading-relaxed max-w-xs mx-auto">
                      Thank you. We have saved your lead details. Go to the <span className="font-semibold text-[#9B2A4C] cursor-pointer" onClick={() => navigate('/admin')}>Super Admin CRM Panel</span> to view your lead list.
                    </p>
                    <button
                      onClick={() => setSuccess(false)}
                      className="text-xs font-bold text-[#9B2A4C] hover:underline"
                    >
                      Submit another request
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleBooking} className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-[#1C2526] mb-1.5 uppercase">Full Name *</label>
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Your name"
                        className="w-full bg-[#F8F6F2]/50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#9B2A4C] transition-colors"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-[#1C2526] mb-1.5 uppercase">Email *</label>
                        <input
                          type="email"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="partner@company.com"
                          className="w-full bg-[#F8F6F2]/50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#9B2A4C] transition-colors"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-[#1C2526] mb-1.5 uppercase">Phone *</label>
                        <input
                          type="tel"
                          required
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="+84 9xx xx..."
                          className="w-full bg-[#F8F6F2]/50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#9B2A4C] transition-colors"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[#1C2526] mb-1.5 uppercase">Company Name</label>
                      <input
                        type="text"
                        value={company}
                        onChange={(e) => setCompany(e.target.value)}
                        placeholder="Your organization"
                        className="w-full bg-[#F8F6F2]/50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#9B2A4C] transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[#1C2526] mb-1.5 uppercase">Message / Goals</label>
                      <textarea
                        rows={3}
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Tell us about your project requirements..."
                        className="w-full bg-[#F8F6F2]/50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#9B2A4C] transition-colors resize-none"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={submitting}
                      className="w-full gradient-bg text-white font-bold py-3 rounded-xl shadow-lg hover:opacity-95 transition-opacity disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer text-sm"
                    >
                      {submitting ? (
                        <span className="flex items-center justify-center gap-2">
                          <i className="ri-loader-4-line animate-spin" />
                          Processing...
                        </span>
                      ) : (
                        t('services.bookService')
                      )}
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Process and Why choose Us */}
        <section className="bg-white border-y border-[#2C3E50]/5 mt-10 py-16">
          <div className="max-w-7xl mx-auto px-4 md:px-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Process timeline */}
              <div className="space-y-6">
                <h2 className="text-[#1C2526] font-bold text-2xl">
                  {t('services.processTitle')}
                </h2>
                <div className="relative border-l border-[#2C3E50]/10 pl-6 space-y-8 ml-3">
                  {service.process.map((step, idx) => (
                    <div key={step} className="relative">
                      {/* Step Circle */}
                      <span className="absolute -left-[37px] top-0 w-6 h-6 rounded-full gradient-bg flex items-center justify-center text-white text-xs font-bold">
                        {idx + 1}
                      </span>
                      <h4 className="text-sm font-bold text-[#1C2526] mb-1">{step}</h4>
                      <p className="text-xs text-[#5A6A72]">
                        Detailed task verification, quality control, and standard delivery timelines apply to this phase.
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Why Us list */}
              <div className="space-y-6">
                <h2 className="text-[#1C2526] font-bold text-2xl">
                  {t('services.whyUs')}
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {service.whyUs.map((point) => (
                    <div key={point} className="p-5 rounded-2xl bg-[#F8F6F2]/50 border border-gray-100 space-y-2">
                      <div className="w-8 h-8 rounded-lg bg-[#9B2A4C]/10 flex items-center justify-center text-[#9B2A4C]">
                        <i className="ri-checkbox-circle-line text-lg" />
                      </div>
                      <p className="text-xs font-bold text-[#1C2526] leading-relaxed">
                        {point}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="bg-[#2C3E50]/5 rounded-3xl p-6 border border-[#2C3E50]/10 text-center space-y-4">
                  <h3 className="font-bold text-sm text-[#2C3E50]">Ready to kickstart this project?</h3>
                  <p className="text-xs text-[#5A6A72]">
                    We schedule onboarding slots within 24 hours. Contact our strategists today.
                  </p>
                  <Link
                    to="/contact"
                    className="inline-block bg-[#2C3E50] text-white text-xs font-semibold px-6 py-2.5 rounded-full hover:bg-[#2C3E50]/90 transition-colors"
                  >
                    Go to Contact Page
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
