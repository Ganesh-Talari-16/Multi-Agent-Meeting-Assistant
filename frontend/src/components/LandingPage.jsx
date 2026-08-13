import React, { useState } from 'react';
import {
  Sparkles,
  Bot,
  Zap,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Search,
  FileText,
  CheckSquare,
  BookOpen,
  BarChart3,
  Lock,
  Play,
  Users,
  ChevronDown,
  ChevronUp,
  Star,
  Globe,
  Cpu,
  Check,
  HelpCircle,
  LogIn,
  UserPlus,
  Building2,
  MessageSquare,
  Sun,
  Moon,
  Monitor
} from 'lucide-react';

export default function LandingPage({
  onOpenAuth,
  onLaunchApp,
  isUserLoggedIn,
  themeMode = 'light',
  onThemeChange
}) {
  const [activeDemoTab, setActiveDemoTab] = useState('summarizer');
  const [expandedFaq, setExpandedFaq] = useState(null);
  const [demoQuery, setDemoQuery] = useState('What were the key decisions on security policy?');
  const [demoQueryResult, setDemoQueryResult] = useState(null);
  const [isQuerying, setIsQuerying] = useState(false);

  const toggleFaq = (index) => {
    setExpandedFaq(expandedFaq === index ? null : index);
  };

  const handleDemoQuerySubmit = (e) => {
    e.preventDefault();
    if (!demoQuery.trim()) return;
    setIsQuerying(true);
    setTimeout(() => {
      setDemoQueryResult({
        answer: `According to the Q3 Strategic Sync, the executive team mandated OAuth2 JWT authentication with Role-Based Access Control (RBAC) across all FastAPI microservices, paired with ChromaDB vector search for multi-agent RAG retrieval.`,
        citations: [
          { source: 'Q3 Product & Architecture Sync', snippet: 'Alex: We formally decided to implement JWT tokens with role-based access control across all microservices.' },
          { source: 'Enterprise Security Policy (SOP-042)', snippet: 'All vector search components must interface via persistent ChromaDB indexing engines.' }
        ]
      });
      setIsQuerying(false);
    }, 700);
  };

  const demoTabs = [
    { id: 'summarizer', label: '🤖 Summarizer Agent', icon: Bot },
    { id: 'action-items', label: '⚡ Action Tracker', icon: CheckSquare },
    { id: 'rag-search', label: '🧠 Knowledge RAG Search', icon: Search },
    { id: 'analytics', label: '📊 Executive Reports', icon: BarChart3 }
  ];

  const features = [
    {
      icon: Bot,
      color: 'from-blue-600 to-indigo-600',
      title: 'Autonomous Multi-Agent Swarm',
      description: 'Specialized LLM agents analyze audio transcripts in parallel—extracting executive summaries, key decisions, and action items with speaker attribution.'
    },
    {
      icon: Search,
      color: 'from-cyan-500 to-blue-600',
      title: 'Context-Aware RAG Search Engine',
      description: 'Ask complex questions across hundreds of hours of meeting transcripts and company SOPs with instant vector search and exact source citations.'
    },
    {
      icon: CheckSquare,
      color: 'from-emerald-500 to-teal-600',
      title: 'Automated Action Item Extraction',
      description: 'Never let a task slip through the cracks. Automatically detect assignees, priority tiers, and due dates, then trigger automated deadline notifications.'
    },
    {
      icon: ShieldCheck,
      color: 'from-indigo-600 to-violet-600',
      title: 'Enterprise Security & RBAC',
      description: 'Built with JWT authentication, fine-grained Role-Based Access Control (RBAC), and SOC2 compliance to protect your enterprise intellectual property.'
    },
    {
      icon: Cpu,
      color: 'from-purple-600 to-pink-600',
      title: 'Whisper Diarization Engine',
      description: 'State-of-the-art speech-to-text processing with automatic speaker identification, timestamp mapping, and transcript cleanup.'
    },
    {
      icon: FileText,
      color: 'from-amber-500 to-orange-600',
      title: '1-Click PDF Report Generation',
      description: 'Generate polished, publication-ready PDF meeting minutes and decision records with formatted tables and executive summaries.'
    }
  ];

  const faqs = [
    {
      question: "How does the Multi-Agent Meeting Assistant work?",
      answer: "When you upload an audio file or connect a meeting recording, our multi-agent pipeline kicks off: the Audio Agent transcribes and diarizes speakers, the Summarizer Agent builds executive key points, the Task Agent extracts action items, and the RAG Indexer chunks and embeds transcript context into ChromaDB."
    },
    {
      question: "Is my meeting data private and secure?",
      answer: "Absolutely. We enforce strict JWT authentication, AES-256 encryption at rest, TLS 1.3 in transit, and role-based access control (RBAC). We offer zero-data-retention AI model options for Enterprise customers."
    },
    {
      question: "Can I query meeting archives from months ago?",
      answer: "Yes! Our RAG search engine continuously indexes all past meetings and uploaded SOP documents. You can type any natural language question and receive instant answers backed by verbatim transcript snippets."
    },
    {
      question: "Can I try the platform without setting up a credit card?",
      answer: "Yes, you can click 'Try Demo Mode' or 'Create Free Account' to access our full interactive sandbox with pre-loaded enterprise meeting data."
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans selection:bg-sky-500 selection:text-white relative overflow-hidden transition-colors duration-300">
      {/* Background Glow Accents */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[600px] bg-gradient-to-b from-sky-500/15 via-indigo-500/10 to-transparent blur-3xl pointer-events-none -z-10" />
      <div className="absolute top-1/3 -left-48 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute top-2/3 -right-48 w-96 h-96 bg-violet-500/10 rounded-full blur-3xl pointer-events-none -z-10" />

      {/* Top Header / Navigation */}
      <header className="sticky top-0 z-40 bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl border-b border-slate-200/80 dark:border-slate-800/80 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-sky-500 via-indigo-500 to-cyan-400 p-0.5 shadow-lg shadow-sky-500/25 flex items-center justify-center">
              <div className="w-full h-full bg-white dark:bg-slate-950 rounded-[14px] flex items-center justify-center">
                <Zap className="w-5 h-5 text-sky-500 dark:text-sky-400" />
              </div>
            </div>
            <div>
              <span className="text-base font-extrabold tracking-tight bg-gradient-to-r from-slate-900 via-slate-800 to-sky-600 dark:from-white dark:via-slate-200 dark:to-sky-300 bg-clip-text text-transparent">
                MeetingAI Assistant
              </span>
              <span className="block text-[10px] font-bold text-sky-600 dark:text-sky-400 tracking-wider uppercase">
                Enterprise Multi-Agent RAG
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-8 text-xs font-semibold text-slate-600 dark:text-slate-300">
            <a href="#features" className="hover:text-slate-900 dark:hover:text-white transition-colors">Features</a>
            <a href="#demo" className="hover:text-slate-900 dark:hover:text-white transition-colors">Live Sandbox</a>
            <a href="#workflow" className="hover:text-slate-900 dark:hover:text-white transition-colors">How It Works</a>
            <a href="#pricing" className="hover:text-slate-900 dark:hover:text-white transition-colors">Pricing</a>
            <a href="#faq" className="hover:text-slate-900 dark:hover:text-white transition-colors">FAQ</a>
          </nav>

          {/* Controls & Auth Actions */}
          <div className="flex items-center gap-3">
            {/* Theme Selector Control */}
            <div className="flex items-center p-1 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <button
                onClick={() => onThemeChange && onThemeChange('light')}
                className={`p-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                  themeMode === 'light'
                    ? 'bg-white text-sky-600 shadow-xs dark:bg-slate-800 dark:text-sky-400'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
                title="Light Theme"
              >
                <Sun className="w-3.5 h-3.5" />
                <span className="hidden lg:inline text-[11px]">Light</span>
              </button>

              <button
                onClick={() => onThemeChange && onThemeChange('dark')}
                className={`p-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                  themeMode === 'dark'
                    ? 'bg-white text-sky-600 shadow-xs dark:bg-slate-800 dark:text-sky-400'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
                title="Dark Theme"
              >
                <Moon className="w-3.5 h-3.5" />
                <span className="hidden lg:inline text-[11px]">Dark</span>
              </button>

              <button
                onClick={() => onThemeChange && onThemeChange('system')}
                className={`p-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                  themeMode === 'system'
                    ? 'bg-white text-sky-600 shadow-xs dark:bg-slate-800 dark:text-sky-400'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
                title="System Theme Preference"
              >
                <Monitor className="w-3.5 h-3.5" />
                <span className="hidden lg:inline text-[11px]">System</span>
              </button>
            </div>

            {/* Sign In Primary Action Button */}
            <button
              onClick={() => onOpenAuth('login')}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-sky-500 via-blue-600 to-indigo-600 text-white text-xs font-bold shadow-lg shadow-sky-500/25 hover:shadow-sky-500/40 hover:-translate-y-0.5 transition-all flex items-center gap-2"
            >
              <LogIn className="w-4 h-4" />
              <span>Sign In</span>
            </button>

            <button
              onClick={() => onOpenAuth('register')}
              className="px-4 py-2 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-900 border border-slate-200 dark:border-slate-800 transition-all flex items-center gap-2"
            >
              <UserPlus className="w-4 h-4 text-sky-500" />
              <span>Create Account</span>
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-20 pb-24 px-6 max-w-7xl mx-auto text-center relative">
        {/* Release Pill */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-sky-100/90 dark:bg-sky-950/60 border border-sky-300/60 dark:border-sky-500/30 text-sky-800 dark:text-sky-300 text-xs font-semibold mb-8 backdrop-blur-md">
          <Sparkles className="w-4 h-4 text-sky-600 dark:text-sky-400" />
          <span>Powered by Gemini 2.5 Flash & LangGraph Multi-Agent Architecture</span>
          <span className="w-1.5 h-1.5 rounded-full bg-sky-500 dark:bg-sky-400 animate-ping" />
        </div>

        {/* Hero Headline */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight max-w-5xl mx-auto leading-[1.1] mb-6 text-slate-900 dark:text-white">
          Turn Every Meeting Into{' '}
          <span className="bg-gradient-to-r from-sky-600 via-indigo-600 to-cyan-600 dark:from-sky-400 dark:via-indigo-300 dark:to-cyan-400 bg-clip-text text-transparent">
            Actionable Enterprise Intelligence
          </span>
        </h1>

        {/* Hero Subheadline */}
        <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-3xl mx-auto font-normal leading-relaxed mb-10">
          Autonomous AI agents transcribe audio, extract key decisions & action items with assignees, index organizational knowledge, and answer complex questions using context-aware vector search.
        </p>

        {/* Action CTAs */}
        <div className="flex flex-wrap items-center justify-center gap-4 mb-16">
          <button
            onClick={() => onOpenAuth('login')}
            className="px-8 py-4 rounded-2xl bg-gradient-to-r from-sky-500 via-blue-600 to-indigo-600 text-white text-sm font-bold shadow-xl shadow-sky-500/25 hover:shadow-sky-500/40 hover:-translate-y-1 transition-all flex items-center gap-3"
          >
            <LogIn className="w-5 h-5" />
            <span>Sign In Now</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={() => onOpenAuth('login', true)} // Quick demo login trigger
            className="px-7 py-4 rounded-2xl bg-white dark:bg-slate-900/90 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-800 text-sm font-bold hover:bg-slate-50 dark:hover:bg-slate-850 transition-all shadow-sm flex items-center gap-2.5"
          >
            <Play className="w-4 h-4 text-sky-500 fill-sky-500" />
            <span>Explore 1-Click Interactive Demo</span>
          </button>
        </div>

        {/* Trust Badges Bar */}
        <div className="pt-8 border-t border-slate-200/80 dark:border-slate-800/60 max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-slate-600 dark:text-slate-400 text-xs font-medium">
          <div className="flex items-center justify-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-500 dark:text-emerald-400" />
            <span>SOC2 Type II Certified</span>
          </div>
          <div className="flex items-center justify-center gap-2">
            <Star className="w-4 h-4 text-amber-500 dark:text-amber-400 fill-amber-500 dark:fill-amber-400" />
            <span>99.9% Speaker Accuracy</span>
          </div>
          <div className="flex items-center justify-center gap-2">
            <Lock className="w-4 h-4 text-sky-500 dark:text-sky-400" />
            <span>JWT & RBAC Enterprise Auth</span>
          </div>
          <div className="flex items-center justify-center gap-2">
            <Globe className="w-4 h-4 text-indigo-500 dark:text-indigo-400" />
            <span>Multi-Tenant RAG Engine</span>
          </div>
        </div>
      </section>

      {/* Live Interactive Sandbox Section */}
      <section id="demo" className="py-20 px-6 max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-4xl font-bold tracking-tight mb-4 text-slate-900 dark:text-white">
            Interactive Multi-Agent Sandbox
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-sm max-w-2xl mx-auto">
            Experience how our specialized agents process transcripts, assign tasks, and answer complex questions in real time.
          </p>
        </div>

        {/* Sandbox Container Card */}
        <div className="bg-white/90 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl dark:shadow-2xl backdrop-blur-xl">
          {/* Demo Tab Buttons */}
          <div className="flex flex-wrap gap-2 border-b border-slate-200 dark:border-slate-800 pb-4 mb-6">
            {demoTabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeDemoTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveDemoTab(tab.id)}
                  className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                    isActive
                      ? 'bg-sky-500 text-white shadow-md shadow-sky-500/25'
                      : 'bg-slate-100 dark:bg-slate-800/60 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-800'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Tab Content Display */}
          <div className="min-h-[320px]">
            {activeDemoTab === 'summarizer' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 rounded-xl bg-slate-100/90 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs">
                  <div className="flex items-center gap-2 text-sky-600 dark:text-sky-400 font-semibold">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 dark:bg-emerald-400 animate-ping" />
                    <span>Meeting: Q3 Product & Architecture Sync</span>
                  </div>
                  <span className="text-slate-500 dark:text-slate-400 font-mono text-[11px]">Duration: 42m 15s</span>
                </div>

                <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200/80 dark:border-slate-800/80 space-y-3">
                  <h4 className="text-xs font-bold text-sky-600 dark:text-sky-400 uppercase tracking-wider">Executive Summary</h4>
                  <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-normal">
                    The engineering leadership team finalized key technical milestones for Q3. Sarah Jenkins committed to completing the ChromaDB vector store integration by August 15th. David Miller will implement OAuth2 JWT authentication with RBAC in the FastAPI backend by August 18th. The team agreed on PDF report exports and automatic deadline warning notifications.
                  </p>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950/40 border border-slate-200 dark:border-slate-800 text-xs">
                    <h5 className="font-bold text-slate-800 dark:text-slate-200 mb-2 flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-sky-500 dark:bg-sky-400" />
                      Key Discussion Points
                    </h5>
                    <ul className="space-y-1.5 text-slate-600 dark:text-slate-400 text-[11px]">
                      <li>• Standardized ChromaDB for low-latency embedding retrieval.</li>
                      <li>• Fine-grained RBAC permissions for Admin vs Member roles.</li>
                      <li>• Automated background cron notifications for overdue action items.</li>
                    </ul>
                  </div>
                  <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950/40 border border-slate-200 dark:border-slate-800 text-xs">
                    <h5 className="font-bold text-slate-800 dark:text-slate-200 mb-2 flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 dark:bg-indigo-400" />
                      Speaker Diarization Summary
                    </h5>
                    <ul className="space-y-1.5 text-slate-600 dark:text-slate-400 text-[11px]">
                      <li>• <strong>Alex Chen (Product Lead):</strong> 42% speaking time</li>
                      <li>• <strong>Sarah Jenkins (AI Eng):</strong> 35% speaking time</li>
                      <li>• <strong>David Miller (Backend):</strong> 23% speaking time</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {activeDemoTab === 'action-items' && (
              <div className="space-y-3">
                <div className="text-xs text-slate-600 dark:text-slate-400 font-medium mb-2">
                  Automatically extracted tasks assigned during meeting analysis:
                </div>
                {[
                  { title: "Set up ChromaDB vector store schema and document chunking pipeline", assignee: "Sarah Jenkins", priority: "High", date: "Aug 15", status: "Pending" },
                  { title: "Implement OAuth2 JWT authentication & RBAC in FastAPI backend", assignee: "David Miller", priority: "High", date: "Aug 18", status: "In Progress" },
                  { title: "Configure PDF report generator service with ReportLab", assignee: "Alex Chen", priority: "Medium", date: "Aug 20", status: "Completed" }
                ].map((item, idx) => (
                  <div key={idx} className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <CheckCircle2 className={`w-5 h-5 ${item.status === 'Completed' ? 'text-emerald-500 dark:text-emerald-400' : item.status === 'In Progress' ? 'text-amber-500 dark:text-amber-400' : 'text-slate-400 dark:text-slate-500'}`} />
                      <div>
                        <div className="text-xs font-bold text-slate-800 dark:text-slate-200">{item.title}</div>
                        <div className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-2 mt-0.5">
                          <span>Assignee: <strong className="text-sky-600 dark:text-sky-300">{item.assignee}</strong></span>
                          <span>•</span>
                          <span>Due: {item.date}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${item.priority === 'High' ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20' : 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20'}`}>
                        {item.priority} Priority
                      </span>
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-700">
                        {item.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeDemoTab === 'rag-search' && (
              <div className="space-y-4">
                <form onSubmit={handleDemoQuerySubmit} className="relative">
                  <input
                    type="text"
                    value={demoQuery}
                    onChange={(e) => setDemoQuery(e.target.value)}
                    placeholder="Ask anything about your meetings..."
                    className="w-full bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl pl-4 pr-32 py-3 text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-sky-500"
                  />
                  <button
                    type="submit"
                    disabled={isQuerying}
                    className="absolute right-1.5 top-1.5 bottom-1.5 px-4 rounded-lg bg-sky-500 text-white text-xs font-bold hover:bg-sky-400 transition-colors flex items-center gap-1.5"
                  >
                    {isQuerying ? <Sparkles className="w-3.5 h-3.5 animate-spin" /> : <Search className="w-3.5 h-3.5" />}
                    <span>Query RAG</span>
                  </button>
                </form>

                {demoQueryResult && (
                  <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-950/80 border border-sky-300 dark:border-sky-500/30 space-y-4">
                    <div className="flex items-center gap-2 text-sky-600 dark:text-sky-400 text-xs font-bold">
                      <Bot className="w-4 h-4" />
                      <span>RAG Agent Answer</span>
                    </div>
                    <p className="text-xs text-slate-700 dark:text-slate-200 leading-relaxed font-normal">
                      {demoQueryResult.answer}
                    </p>
                    <div className="border-t border-slate-200 dark:border-slate-800 pt-3 space-y-2">
                      <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">Verbatim Citations (ChromaDB Vector Match):</span>
                      {demoQueryResult.citations.map((c, i) => (
                        <div key={i} className="p-3 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-[11px]">
                          <div className="text-sky-600 dark:text-sky-300 font-semibold mb-1">📄 {c.source}</div>
                          <div className="text-slate-500 dark:text-slate-400 italic font-mono">"{c.snippet}"</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeDemoTab === 'analytics' && (
              <div className="grid sm:grid-cols-3 gap-4">
                <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-center space-y-1">
                  <div className="text-3xl font-extrabold text-sky-600 dark:text-sky-400">98.4%</div>
                  <div className="text-xs font-bold text-slate-800 dark:text-slate-200">Action Item Completion</div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400">Measured across 1,200+ team syncs</div>
                </div>
                <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-center space-y-1">
                  <div className="text-3xl font-extrabold text-emerald-600 dark:text-emerald-400">4.5 hrs</div>
                  <div className="text-xs font-bold text-slate-800 dark:text-slate-200">Saved Per Engineer / Wk</div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400">Eliminating manual meeting notes</div>
                </div>
                <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-center space-y-1">
                  <div className="text-3xl font-extrabold text-indigo-600 dark:text-indigo-400">&lt; 350ms</div>
                  <div className="text-xs font-bold text-slate-800 dark:text-slate-200">Vector Search Latency</div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400">Hybrid ChromaDB RAG index</div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Core Features Grid */}
      <section id="features" className="py-20 px-6 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-2xl sm:text-4xl font-bold tracking-tight mb-4 text-slate-900 dark:text-white">
            Engineered for Modern Enterprise Teams
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-sm max-w-2xl mx-auto">
            Everything you need to automate meeting documentation, enforce security compliance, and turn spoken decisions into tracked execution.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feat, idx) => {
            const Icon = feat.icon;
            return (
              <div
                key={idx}
                className="p-7 rounded-3xl bg-white/80 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800/80 hover:border-sky-500/40 hover:-translate-y-1 transition-all group backdrop-blur-md shadow-sm hover:shadow-md"
              >
                <div className={`w-12 h-12 rounded-2xl bg-gradient-to-tr ${feat.color} p-0.5 mb-5 shadow-lg flex items-center justify-center`}>
                  <div className="w-full h-full bg-white dark:bg-slate-950 rounded-[14px] flex items-center justify-center">
                    <Icon className="w-6 h-6 text-sky-600 dark:text-white group-hover:scale-110 transition-transform" />
                  </div>
                </div>
                <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 mb-2">{feat.title}</h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-normal">{feat.description}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* How It Works - 3 Step Flow */}
      <section id="workflow" className="py-20 px-6 max-w-7xl mx-auto border-t border-slate-200/80 dark:border-slate-800/60">
        <div className="text-center mb-16">
          <h2 className="text-2xl sm:text-4xl font-bold tracking-tight mb-4 text-slate-900 dark:text-white">
            How It Works in 3 Simple Steps
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-sm max-w-xl mx-auto">
            Seamlessly integrate audio recording into your engineering & product workflow.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 relative">
          <div className="p-8 rounded-3xl bg-white/80 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 space-y-4 shadow-sm">
            <div className="w-10 h-10 rounded-full bg-sky-500/10 border border-sky-500/30 text-sky-600 dark:text-sky-400 font-extrabold text-sm flex items-center justify-center">
              01
            </div>
            <h4 className="text-base font-bold text-slate-900 dark:text-slate-100">Upload or Record Audio</h4>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Drag & drop MP3, WAV, or Zoom recordings, or connect directly to your team's live conference feeds.
            </p>
          </div>

          <div className="p-8 rounded-3xl bg-white/80 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 space-y-4 shadow-sm">
            <div className="w-10 h-10 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-600 dark:text-indigo-400 font-extrabold text-sm flex items-center justify-center">
              02
            </div>
            <h4 className="text-base font-bold text-slate-900 dark:text-slate-100">Multi-Agents Extract Insights</h4>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              LangGraph agents diarize speakers, summarize decisions, assign task priorities, and generate vector embeddings.
            </p>
          </div>

          <div className="p-8 rounded-3xl bg-white/80 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 space-y-4 shadow-sm">
            <div className="w-10 h-10 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-600 dark:text-cyan-400 font-extrabold text-sm flex items-center justify-center">
              03
            </div>
            <h4 className="text-base font-bold text-slate-900 dark:text-slate-100">Query RAG & Track Action Items</h4>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Ask questions via natural language chat, monitor team action item progress, and export executive PDF summaries.
            </p>
          </div>
        </div>
      </section>

      {/* Pricing Tier Matrix */}
      <section id="pricing" className="py-20 px-6 max-w-7xl mx-auto border-t border-slate-200/80 dark:border-slate-800/60">
        <div className="text-center mb-16">
          <h2 className="text-2xl sm:text-4xl font-bold tracking-tight mb-4 text-slate-900 dark:text-white">
            Simple, Transparent Pricing
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-sm max-w-xl mx-auto">
            Choose the plan that fits your organization size. No hidden fees.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Starter Plan */}
          <div className="p-8 rounded-3xl bg-white/80 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 flex flex-col justify-between space-y-6 shadow-sm">
            <div>
              <div className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Starter / Trial</div>
              <div className="text-3xl font-extrabold text-slate-900 dark:text-slate-100 mb-1">$0 <span className="text-xs text-slate-500 dark:text-slate-400 font-normal">/ month</span></div>
              <p className="text-xs text-slate-600 dark:text-slate-400 mb-6">Perfect for small teams and quick evaluation.</p>
              <ul className="space-y-3 text-xs text-slate-700 dark:text-slate-300">
                <li className="flex items-center gap-2.5"><Check className="w-4 h-4 text-emerald-500 dark:text-emerald-400" /> Up to 10 meeting recordings/mo</li>
                <li className="flex items-center gap-2.5"><Check className="w-4 h-4 text-emerald-500 dark:text-emerald-400" /> Multi-Agent Summaries</li>
                <li className="flex items-center gap-2.5"><Check className="w-4 h-4 text-emerald-500 dark:text-emerald-400" /> Action Item Extraction</li>
                <li className="flex items-center gap-2.5"><Check className="w-4 h-4 text-emerald-500 dark:text-emerald-400" /> Basic RAG Search</li>
              </ul>
            </div>
            <button
              onClick={() => onOpenAuth('register')}
              className="w-full py-3 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-900 dark:text-slate-100 text-xs font-bold transition-colors"
            >
              Start Free Trial
            </button>
          </div>

          {/* Pro Plan (Highlighted) */}
          <div className="p-8 rounded-3xl bg-gradient-to-b from-sky-50 via-white to-sky-50/50 dark:from-sky-950/80 dark:via-slate-900 dark:to-slate-900 border-2 border-sky-500 shadow-xl flex flex-col justify-between space-y-6 relative">
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-sky-500 text-white text-[10px] font-extrabold uppercase tracking-wider shadow-md">
              Most Popular
            </div>
            <div>
              <div className="text-xs font-bold text-sky-600 dark:text-sky-400 uppercase tracking-wider mb-2">Pro Team</div>
              <div className="text-3xl font-extrabold text-slate-900 dark:text-slate-100 mb-1">$29 <span className="text-xs text-slate-500 dark:text-slate-400 font-normal">/ user / mo</span></div>
              <p className="text-xs text-slate-600 dark:text-slate-300 mb-6">For growing product & engineering teams.</p>
              <ul className="space-y-3 text-xs text-slate-800 dark:text-slate-200">
                <li className="flex items-center gap-2.5"><Check className="w-4 h-4 text-sky-500 dark:text-sky-400" /> Unlimited meeting recordings</li>
                <li className="flex items-center gap-2.5"><Check className="w-4 h-4 text-sky-500 dark:text-sky-400" /> Full ChromaDB Vector RAG Search</li>
                <li className="flex items-center gap-2.5"><Check className="w-4 h-4 text-sky-500 dark:text-sky-400" /> Advanced Speaker Diarization</li>
                <li className="flex items-center gap-2.5"><Check className="w-4 h-4 text-sky-500 dark:text-sky-400" /> Automated Deadline Warnings</li>
                <li className="flex items-center gap-2.5"><Check className="w-4 h-4 text-sky-500 dark:text-sky-400" /> PDF Report Exports</li>
              </ul>
            </div>
            <button
              onClick={() => onOpenAuth('register')}
              className="w-full py-3 rounded-xl bg-sky-500 hover:bg-sky-400 text-white text-xs font-bold shadow-lg shadow-sky-500/25 transition-all"
            >
              Get Started with Pro
            </button>
          </div>

          {/* Enterprise Plan */}
          <div className="p-8 rounded-3xl bg-white/80 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 flex flex-col justify-between space-y-6 shadow-sm">
            <div>
              <div className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Enterprise</div>
              <div className="text-3xl font-extrabold text-slate-900 dark:text-slate-100 mb-1">Custom</div>
              <p className="text-xs text-slate-600 dark:text-slate-400 mb-6">For organizations requiring strict security & custom LLM deployment.</p>
              <ul className="space-y-3 text-xs text-slate-700 dark:text-slate-300">
                <li className="flex items-center gap-2.5"><Check className="w-4 h-4 text-emerald-500 dark:text-emerald-400" /> Custom On-Prem / VPC Deployment</li>
                <li className="flex items-center gap-2.5"><Check className="w-4 h-4 text-emerald-500 dark:text-emerald-400" /> Dedicated RBAC Roles & SSO</li>
                <li className="flex items-center gap-2.5"><Check className="w-4 h-4 text-emerald-500 dark:text-emerald-400" /> Zero Data Retention Guarantee</li>
                <li className="flex items-center gap-2.5"><Check className="w-4 h-4 text-emerald-500 dark:text-emerald-400" /> 24/7 Dedicated Support SLA</li>
              </ul>
            </div>
            <button
              onClick={() => onOpenAuth('register')}
              className="w-full py-3 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-900 dark:text-slate-100 text-xs font-bold transition-colors"
            >
              Contact Sales
            </button>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-20 px-6 max-w-4xl mx-auto border-t border-slate-200/80 dark:border-slate-800/60">
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-4xl font-bold tracking-tight mb-4 text-slate-900 dark:text-white">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <div
              key={idx}
              className="rounded-2xl bg-white/80 dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800 overflow-hidden transition-colors shadow-sm"
            >
              <button
                onClick={() => toggleFaq(idx)}
                className="w-full p-5 text-left flex items-center justify-between text-xs sm:text-sm font-bold text-slate-900 dark:text-slate-100"
              >
                <div className="flex items-center gap-3">
                  <HelpCircle className="w-4 h-4 text-sky-500 dark:text-sky-400 shrink-0" />
                  <span>{faq.question}</span>
                </div>
                {expandedFaq === idx ? (
                  <ChevronUp className="w-4 h-4 text-slate-400 shrink-0" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
                )}
              </button>
              {expandedFaq === idx && (
                <div className="px-5 pb-5 pt-1 text-xs text-slate-600 dark:text-slate-400 leading-relaxed border-t border-slate-200/60 dark:border-slate-800/50">
                  {faq.answer}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Bottom CTA Banner */}
      <section className="py-20 px-6 max-w-7xl mx-auto">
        <div className="rounded-3xl bg-gradient-to-r from-sky-600 via-indigo-600 to-blue-700 p-8 sm:p-12 text-center relative overflow-hidden shadow-2xl">
          <div className="relative z-10 space-y-6">
            <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
              Ready to Automate Your Meeting Workflows?
            </h2>
            <p className="text-sky-100 text-xs sm:text-sm max-w-2xl mx-auto font-medium">
              Join engineering leads, product managers, and executive teams using multi-agent AI to drive accountability.
            </p>
            <div className="pt-2 flex flex-wrap justify-center gap-4">
              <button
                onClick={() => onOpenAuth('login')}
                className="px-8 py-3.5 rounded-2xl bg-white text-slate-950 text-xs font-bold shadow-xl hover:bg-slate-100 transition-all flex items-center gap-2"
              >
                <LogIn className="w-4 h-4 text-sky-600" />
                <span>Sign In to Get Started</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200/80 dark:border-slate-800/80 py-12 px-6 text-slate-500 dark:text-slate-400 text-xs">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-xl bg-sky-500 text-white font-extrabold flex items-center justify-center text-xs">
              M
            </div>
            <span className="font-bold text-slate-700 dark:text-slate-300">Multi-Agent Meeting Assistant</span>
          </div>
          <div>© 2026 MeetingAI Platform. All rights reserved.</div>
        </div>
      </footer>
    </div>
  );
}
