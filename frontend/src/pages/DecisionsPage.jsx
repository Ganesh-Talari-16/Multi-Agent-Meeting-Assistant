import React, { useState } from 'react';
import { BookOpen, Tag, Users, Shield, Lightbulb, Calendar, Video } from 'lucide-react';

export default function DecisionsPage({ decisions = [] }) {
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = ['All', ...new Set(decisions.map(d => d.category))];
  const filteredDecisions = selectedCategory === 'All'
    ? decisions
    : decisions.filter(d => d.category === selectedCategory);

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-200 pb-5">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Decision Log Repository</h2>
          <p className="text-xs text-gray-500 mt-1">
            Audit-ready knowledge repository of corporate, architectural, and security decisions.
          </p>
        </div>

        {/* Category Filter Chips */}
        <div className="flex items-center gap-2 overflow-x-auto">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold shrink-0 transition-all ${
                selectedCategory === cat
                  ? 'bg-navy-900 text-white shadow-xs font-bold'
                  : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Decisions List */}
      <div className="space-y-4">
        {filteredDecisions.map((dec) => (
          <div
            key={dec.id}
            className="ui-card p-6 hover:border-gray-300 transition-all space-y-4"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-md badge-teal">
                  {dec.category || 'General'}
                </span>
                <span className="text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-md badge-navy">
                  High Impact
                </span>
              </div>
              <div className="flex items-center gap-3 text-xs text-gray-400 font-mono">
                <span className="flex items-center gap-1"><Video className="w-3.5 h-3.5" /> Q3 Architecture Sync</span>
                <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> {dec.created_at?.slice(0, 10) || '2026-08-12'}</span>
              </div>
            </div>

            <h3 className="text-base font-bold text-gray-900">{dec.topic}</h3>

            <div className="bg-gray-50 p-4 rounded-xl border border-gray-200/80 space-y-2">
              <div className="text-[11px] font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1.5">
                <Lightbulb className="w-3.5 h-3.5 text-amber-500" /> Decision Outcome
              </div>
              <p className="text-xs text-gray-900 leading-relaxed font-semibold">
                {dec.decision_text}
              </p>
            </div>

            {dec.rationale && (
              <div className="text-xs text-gray-600 italic pl-3 border-l-2 border-navy-900 font-medium">
                Rationale: {dec.rationale}
              </div>
            )}

            {dec.decision_makers_json && dec.decision_makers_json.length > 0 && (
              <div className="pt-3 flex items-center gap-2 text-xs text-gray-500 border-t border-gray-100 font-medium">
                <Users className="w-3.5 h-3.5 text-navy-900" />
                <span>Decision Makers: <strong className="text-gray-900">{dec.decision_makers_json.join(', ')}</strong></span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
