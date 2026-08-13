import React, { useState, useRef, useEffect } from 'react';
import { 
  Bot, 
  Send, 
  Sparkles, 
  Database, 
  CornerDownRight, 
  Layers, 
  Trash2,
  Copy,
  Check,
  RefreshCw,
  FileText,
  User,
  Filter,
  AlertCircle,
  HelpCircle,
  ChevronUp,
  ChevronDown
} from 'lucide-react';
import { queryRAG } from '../utils/api';

export default function ChatPage({ 
  messages: externalMessages, 
  setMessages: setExternalMessages,
  meetings = [] 
}) {
  const [inputQuery, setInputQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [queryError, setQueryError] = useState(null);
  const [selectedMeetingFilter, setSelectedMeetingFilter] = useState('All');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState('All');
  const [copiedIndex, setCopiedIndex] = useState(null);
  
  const chatContainerRef = useRef(null);
  const messagesEndRef = useRef(null);

  // Persistent local state with localStorage fallback
  const [localMessages, setLocalMessages] = useState(() => {
    try {
      const saved = localStorage.getItem('chat_history');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return [
      {
        role: 'assistant',
        content: "Welcome to your AI Conversational Knowledge Assistant. I have indexed all meeting transcripts, decision logs, action items, and enterprise SOPs into ChromaDB. How can I help you today?",
        citations: []
      }
    ];
  });

  const messages = externalMessages || localMessages;
  const setMessages = setExternalMessages || setLocalMessages;

  // Sync messages to localStorage for persistent conversation history
  useEffect(() => {
    try {
      localStorage.setItem('chat_history', JSON.stringify(messages));
    } catch (e) {}
  }, [messages]);

  const suggestedPrompts = [
    "What decisions were made regarding API authentication?",
    "Who is assigned to the ChromaDB task?",
    "Summarize all pending high priority action items.",
    "Show latest enterprise SOP updates."
  ];

  const scrollToTop = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }
  };

  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTo({
        top: chatContainerRef.current.scrollHeight,
        behavior: 'smooth'
      });
    } else if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      scrollToBottom();
    }, 60);
    return () => clearTimeout(timer);
  }, [messages, isLoading]);

  const handleSend = async (queryText = inputQuery) => {
    if (!queryText.trim()) return;
    setQueryError(null);
    const userMsg = { role: 'user', content: queryText };
    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setInputQuery('');
    setIsLoading(true);

    try {
      // Format chat history context window for multi-turn context
      const historyContext = updatedMessages.slice(-6).map(m => ({
        role: m.role,
        content: m.content
      }));

      const meetingId = selectedMeetingFilter === 'All' ? null : selectedMeetingFilter;
      const categoryFilter = selectedCategoryFilter === 'All' ? null : selectedCategoryFilter;

      const ragResult = await queryRAG(queryText, meetingId, categoryFilter, historyContext);

      const botMsg = {
        role: 'assistant',
        content: ragResult.answer || "No response received from RAG query pipeline.",
        citations: ragResult.citations || []
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch (err) {
      console.error("RAG Query Execution Error:", err);
      setQueryError("RAG Search failed. Please check network connectivity or retry.");
      const errorMsg = {
        role: 'assistant',
        content: "⚠️ I encountered an error while searching ChromaDB vector store. Please try again or rephrase your question.",
        citations: []
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearHistory = () => {
    const defaultMsg = [
      {
        role: 'assistant',
        content: "Chat history cleared. Ask me any question about past meetings, decisions, tasks, or enterprise SOPs.",
        citations: []
      }
    ];
    setMessages(defaultMsg);
    try {
      localStorage.setItem('chat_history', JSON.stringify(defaultMsg));
    } catch (e) {}
  };

  const handleCopyMessage = (text, idx) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto flex-1 flex flex-col min-h-0 h-[calc(100vh-5rem)] space-y-5 animate-in fade-in duration-300">
      {/* Header Bar */}
      <div className="border-b border-slate-200 dark:border-slate-800 pb-4 flex flex-col lg:flex-row lg:items-center justify-between gap-4 shrink-0">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <Bot className="w-6 h-6 text-sky-500" /> AI Conversational Assistant
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Semantic vector retrieval over ChromaDB + Gemini synthesis with verified source citations.
          </p>
        </div>

        {/* Scope Filters Controls */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Category Scope Selector */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 font-bold uppercase flex items-center gap-1">
              <Filter className="w-3.5 h-3.5 text-sky-500" /> Filter:
            </span>
            <select
              value={selectedCategoryFilter}
              onChange={(e) => setSelectedCategoryFilter(e.target.value)}
              className="ui-input px-3 py-1.5 text-xs font-semibold"
            >
              <option value="All">Global Search (All)</option>
              <option value="meetings">Meetings & Transcripts</option>
              <option value="decisions">Decisions Log</option>
              <option value="tasks">Action Items</option>
              <option value="sops">SOPs & Enterprise Docs</option>
            </select>
          </div>

          {/* Specific Meeting Selector */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 font-bold uppercase">Meeting:</span>
            <select
              value={selectedMeetingFilter}
              onChange={(e) => setSelectedMeetingFilter(e.target.value)}
              className="ui-input px-3 py-1.5 text-xs font-semibold max-w-[200px] truncate"
            >
              <option value="All">All Meetings</option>
              {meetings.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.title}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={handleClearHistory}
            className="p-2 rounded-xl text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
            title="Clear Chat History"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Grid: Conversation Feed & Context Panel */}
      <div className="flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-4 gap-6 overflow-hidden">
        {/* Left 3 Columns: Conversation Stream */}
        <div className="lg:col-span-3 flex flex-col justify-between h-full min-h-0 space-y-4 relative">
          {/* Scroll Up & Scroll Down Floating Action Controls */}
          <div className="absolute right-5 bottom-28 z-20 flex flex-col gap-1.5 p-1 rounded-2xl bg-white/90 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 shadow-lg backdrop-blur-md">
            <button
              type="button"
              onClick={scrollToTop}
              className="p-2 rounded-xl text-slate-500 dark:text-slate-400 hover:text-sky-600 dark:hover:text-sky-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all shadow-xs"
              title="Scroll to Top (Oldest Messages)"
            >
              <ChevronUp className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={scrollToBottom}
              className="p-2 rounded-xl text-slate-500 dark:text-slate-400 hover:text-sky-600 dark:hover:text-sky-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all shadow-xs"
              title="Scroll to Bottom (Latest Messages)"
            >
              <ChevronDown className="w-4 h-4" />
            </button>
          </div>

          {/* Scrollable Chat Container */}
          <div ref={chatContainerRef} className="flex-1 min-h-0 overflow-y-auto space-y-6 pr-3 scroll-smooth">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex gap-4 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.role === 'assistant' && (
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-sky-500 via-blue-600 to-indigo-600 text-white flex items-center justify-center shrink-0 shadow-md shadow-sky-500/20">
                    <Bot className="w-4 h-4 text-white" />
                  </div>
                )}

                <div className={`max-w-2xl rounded-2xl p-5 space-y-3 relative group ${
                  msg.role === 'user'
                    ? 'bg-gradient-to-r from-sky-500 via-blue-600 to-indigo-600 text-white rounded-br-none shadow-md'
                    : 'ui-card border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 rounded-bl-none'
                }`}>
                  {/* Copy Button */}
                  {msg.role === 'assistant' && (
                    <button
                      onClick={() => handleCopyMessage(msg.content, idx)}
                      className="absolute top-3 right-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded-md"
                      title="Copy Answer"
                    >
                      {copiedIndex === idx ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  )}

                  <p className="text-xs leading-relaxed font-normal whitespace-pre-line">
                    {msg.content}
                  </p>

                  {/* Vector Search Citations Panel */}
                  {msg.citations && msg.citations.length > 0 && (
                    <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-2">
                      <span className="text-[10px] font-bold text-sky-600 dark:text-sky-400 uppercase tracking-wider flex items-center gap-1">
                        <Database className="w-3 h-3 text-sky-500" /> Vector Search Citations ({msg.citations.length})
                      </span>
                      <div className="space-y-2">
                        {msg.citations.map((c, cIdx) => (
                          <div key={cIdx} className="bg-slate-50 dark:bg-slate-950/80 p-3 rounded-xl border border-slate-200/80 dark:border-slate-800/80 text-[11px] space-y-1">
                            <div className="flex items-center justify-between text-slate-700 dark:text-slate-300 font-bold">
                              <span className="text-slate-900 dark:text-white flex items-center gap-1.5">
                                <CornerDownRight className="w-3.5 h-3.5 text-sky-500 shrink-0" />
                                <span className="truncate">{c.title || 'Enterprise Record'}</span>
                              </span>
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded-md badge-teal shrink-0">
                                Relevance: {c.relevance_score != null ? c.relevance_score : '0.90'}
                              </span>
                            </div>

                            {c.metadata?.speaker && (
                              <div className="text-[10px] text-sky-600 dark:text-sky-400 font-semibold flex items-center gap-1">
                                <User className="w-3 h-3" /> Speaker: {c.metadata.speaker}
                              </div>
                            )}

                            <p className="text-slate-600 dark:text-slate-400 italic text-[11px] leading-relaxed">
                              "{c.content_snippet}"
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}

            {/* Loading Indicator */}
            {isLoading && (
              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-xl bg-sky-500 text-white flex items-center justify-center animate-pulse">
                  <Bot className="w-4 h-4 text-white" />
                </div>
                <div className="ui-card p-4 rounded-2xl border border-slate-200 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-sky-500 animate-ping"></span>
                  <span>Querying ChromaDB vector index & synthesizing answer via Gemini LLM...</span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Suggested Prompts & Input Bar (Single Line Horizontal Scroll Bar) */}
          <div className="shrink-0 space-y-3 pt-2 border-t border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 backdrop-blur-xs">
            <div className="flex items-center gap-2 overflow-x-auto overflow-y-hidden flex-nowrap pb-1 no-scrollbar">
              {suggestedPrompts.map((prompt, pIdx) => (
                <button
                  key={pIdx}
                  onClick={() => handleSend(prompt)}
                  className="shrink-0 whitespace-nowrap text-[11px] bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-850 text-slate-700 dark:text-slate-300 px-3.5 py-1.5 rounded-full border border-slate-200 dark:border-slate-800 font-medium transition-all shadow-xs hover:border-sky-500 dark:hover:border-sky-400 hover:text-sky-600 dark:hover:text-sky-400"
                >
                  💡 {prompt}
                </button>
              ))}
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Ask a question about past meetings, decisions, tasks, or SOPs..."
                value={inputQuery}
                onChange={(e) => setInputQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                className="flex-1 ui-input px-4 py-3 text-xs"
              />
              <button
                onClick={() => handleSend()}
                disabled={isLoading || !inputQuery.trim()}
                className="ui-btn-primary px-5 py-3 text-xs font-bold flex items-center gap-2"
              >
                {isLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                <span>Send</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Context Vault Side Panel */}
        <div className="hidden lg:block space-y-4 overflow-y-auto min-h-0">
          <div className="ui-card p-5 space-y-4">
            <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider border-b border-slate-100 dark:border-slate-800 pb-3 flex items-center gap-2">
              <Layers className="w-4 h-4 text-sky-500" /> Context Knowledge Stores
            </h4>
            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                <span className="font-semibold text-slate-800 dark:text-slate-200">Meeting Transcripts</span>
                <span className="badge-teal text-[10px] font-bold px-2 py-0.5 rounded-md">ChromaDB Vector</span>
              </div>
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                <span className="font-semibold text-slate-800 dark:text-slate-200">Decision Logs</span>
                <span className="badge-teal text-[10px] font-bold px-2 py-0.5 rounded-md">Indexed</span>
              </div>
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                <span className="font-semibold text-slate-800 dark:text-slate-200">Action Items Queue</span>
                <span className="badge-teal text-[10px] font-bold px-2 py-0.5 rounded-md">Indexed</span>
              </div>
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                <span className="font-semibold text-slate-800 dark:text-slate-200">Enterprise SOPs</span>
                <span className="badge-teal text-[10px] font-bold px-2 py-0.5 rounded-md">Indexed</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
