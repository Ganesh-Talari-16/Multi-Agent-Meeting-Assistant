import React, { useState } from 'react';
import { 
  Bot, 
  Send, 
  Sparkles, 
  Database, 
  CornerDownRight, 
  Layers, 
  Building2, 
  BookOpen, 
  ChevronRight,
  FileText
} from 'lucide-react';
import { queryRAG } from '../utils/api';

export default function ChatPage() {
  const [inputQuery, setInputQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedMeetingFilter, setSelectedMeetingFilter] = useState('All');
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: "Welcome to your AI Conversational Knowledge Assistant. I have indexed all meeting transcripts, decision logs, action items, and enterprise SOPs into ChromaDB. How can I help you today?",
      citations: []
    }
  ]);

  const suggestedPrompts = [
    "What decisions were made regarding API authentication?",
    "Who is assigned to the ChromaDB vector store task and what is the deadline?",
    "Summarize all pending high priority action items."
  ];

  const handleSend = async (queryText = inputQuery) => {
    if (!queryText.trim()) return;
    const userMsg = { role: 'user', content: queryText };
    setMessages((prev) => [...prev, userMsg]);
    setInputQuery('');
    setIsLoading(true);

    const ragResult = await queryRAG(queryText);

    const botMsg = {
      role: 'assistant',
      content: ragResult.answer,
      citations: ragResult.citations || []
    };

    setMessages((prev) => [...prev, botMsg]);
    setIsLoading(false);
  };

  return (
    <div className="p-8 max-w-7xl mx-auto h-[calc(100vh-4rem)] flex flex-col space-y-6">
      {/* Header */}
      <div className="border-b border-gray-200 pb-4 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 tracking-tight flex items-center gap-2">
            <Bot className="w-6 h-6 text-navy-900" /> AI Conversational Assistant
          </h2>
          <p className="text-xs text-gray-500 mt-1">
            Semantic vector retrieval over ChromaDB + Gemini synthesis with verified source citations.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-400 font-semibold uppercase">Scope:</span>
          <select
            value={selectedMeetingFilter}
            onChange={(e) => setSelectedMeetingFilter(e.target.value)}
            className="ui-input px-3 py-1.5 text-xs font-semibold"
          >
            <option value="All">All Knowledge & Meetings</option>
            <option value="demo-meeting-001">Q3 Product & Architecture Sync</option>
          </select>
        </div>
      </div>

      {/* Main Container: Chat Feed + Context Side Panel */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-4 gap-6 overflow-hidden">
        {/* Left 3 Columns: Conversation Area & Floating Input */}
        <div className="lg:col-span-3 flex flex-col justify-between h-full space-y-4">
          {/* Scrollable Conversation Area */}
          <div className="flex-1 overflow-y-auto space-y-6 pr-3">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex gap-4 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.role === 'assistant' && (
                  <div className="w-8 h-8 rounded-xl bg-navy-900 text-white flex items-center justify-center shrink-0 shadow-xs">
                    <Bot className="w-4 h-4 text-teal-400" />
                  </div>
                )}

                <div className={`max-w-2xl rounded-2xl p-5 space-y-3 ${
                  msg.role === 'user'
                    ? 'bg-navy-900 text-white rounded-br-none shadow-xs'
                    : 'ui-card border-gray-200 text-gray-800 rounded-bl-none'
                }`}>
                  <p className="text-xs leading-relaxed font-normal whitespace-pre-line">
                    {msg.content}
                  </p>

                  {/* Vector Search Citations Panel */}
                  {msg.citations && msg.citations.length > 0 && (
                    <div className="pt-3 border-t border-gray-100 space-y-2">
                      <span className="text-[10px] font-bold text-navy-900 uppercase tracking-wider flex items-center gap-1">
                        <Database className="w-3 h-3 text-teal-700" /> Vector Search Citations ({msg.citations.length})
                      </span>
                      <div className="space-y-2">
                        {msg.citations.map((c, cIdx) => (
                          <div key={cIdx} className="bg-gray-50 p-3 rounded-xl border border-gray-200 text-[11px] space-y-1">
                            <div className="flex items-center justify-between text-gray-700 font-semibold">
                              <span className="text-gray-900 font-bold flex items-center gap-1.5">
                                <CornerDownRight className="w-3 h-3 text-navy-900" /> {c.title}
                              </span>
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded-md badge-teal">
                                Relevance: {c.relevance_score}
                              </span>
                            </div>
                            <p className="text-gray-600 italic text-[11px] leading-relaxed">
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

            {isLoading && (
              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-xl bg-gray-100 flex items-center justify-center animate-pulse">
                  <Bot className="w-4 h-4 text-navy-900" />
                </div>
                <div className="ui-card p-4 rounded-2xl border border-gray-200 text-xs text-gray-500 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-navy-900 animate-ping"></span>
                  <span>Querying ChromaDB vector index & synthesizing response...</span>
                </div>
              </div>
            )}
          </div>

          {/* Floating Input Box & Suggested Prompts */}
          <div className="space-y-3 pt-2 border-t border-gray-200">
            <div className="flex flex-wrap gap-2">
              {suggestedPrompts.map((prompt, pIdx) => (
                <button
                  key={pIdx}
                  onClick={() => handleSend(prompt)}
                  className="text-[11px] bg-white hover:bg-gray-50 text-gray-700 px-3 py-1.5 rounded-full border border-gray-200 font-medium transition-all shadow-xs"
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
                disabled={isLoading}
                className="ui-btn-primary px-5 py-3 text-xs font-semibold flex items-center gap-2"
              >
                <Send className="w-4 h-4" /> Send
              </button>
            </div>
          </div>
        </div>

        {/* Right 1 Column: Context & Knowledge Vault Panel */}
        <div className="hidden lg:block space-y-4">
          <div className="ui-card p-5 space-y-4">
            <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider border-b border-gray-100 pb-3">
              Context Knowledge Stores
            </h4>
            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-gray-50 border border-gray-200">
                <span className="font-semibold text-gray-800">Meeting Transcripts</span>
                <span className="badge-navy text-[10px] font-bold px-2 py-0.5 rounded-md">Indexed</span>
              </div>
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-gray-50 border border-gray-200">
                <span className="font-semibold text-gray-800">Decision Registers</span>
                <span className="badge-teal text-[10px] font-bold px-2 py-0.5 rounded-md">Indexed</span>
              </div>
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-gray-50 border border-gray-200">
                <span className="font-semibold text-gray-800">Enterprise SOPs</span>
                <span className="badge-teal text-[10px] font-bold px-2 py-0.5 rounded-md">Indexed</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
