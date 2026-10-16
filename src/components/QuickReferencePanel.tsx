import React from 'react';
import { Search, Plus, ExternalLink, HelpCircle } from 'lucide-react';
import { QUICK_REFERENCE_ITEMS } from '../data/quickReference';
import { QuickReferenceItem } from '../types/regex';

interface QuickReferencePanelProps {
  onInsertToken: (token: string) => void;
}

export const QuickReferencePanel: React.FC<QuickReferencePanelProps> = ({
  onInsertToken,
}) => {
  const [search, setSearch] = React.useState('');
  const [activeCategory, setActiveCategory] = React.useState<string>('all');

  const categories = [
    { id: 'all', label: 'All' },
    { id: 'common', label: 'Common' },
    { id: 'classes', label: 'Classes' },
    { id: 'anchors', label: 'Anchors' },
    { id: 'quantifiers', label: 'Quantifiers' },
    { id: 'groups', label: 'Groups' },
    { id: 'flags', label: 'Flags' },
    { id: 'substitutions', label: 'Substitution' },
  ];

  const filteredItems = QUICK_REFERENCE_ITEMS.filter((item) => {
    const matchesCategory =
      activeCategory === 'all' || item.category === activeCategory;
    const matchesSearch =
      search.trim() === '' ||
      item.token.toLowerCase().includes(search.toLowerCase()) ||
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.description.toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="p-3 sm:p-4 space-y-3">
      {/* Search Bar */}
      <div className="relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search regex tokens (e.g. \d, lookahead)..."
          className="w-full pl-9 pr-3 py-2 bg-[#181b22] border border-[#2e3646] rounded-lg text-xs text-white placeholder-slate-500 focus:outline-hidden focus:border-blue-500 font-mono"
        />
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        {categories.map((c) => (
          <button
            key={c.id}
            onClick={() => setActiveCategory(c.id)}
            className={`px-2.5 py-1 rounded-md text-[11px] font-medium whitespace-nowrap transition-colors ${
              activeCategory === c.id
                ? 'bg-blue-600 text-white font-semibold'
                : 'bg-[#1a1f2a] hover:bg-[#252c39] text-slate-400 hover:text-white border border-[#2e3646]'
            }`}
          >
            {c.label}
          </button>
        ))}
      </div>

      {/* Items List */}
      <div className="space-y-2 max-h-[600px] overflow-y-auto pr-1">
        {filteredItems.map((item, idx) => (
          <div
            key={`${item.token}-${idx}`}
            className="p-2.5 rounded-lg border border-[#2e3646] bg-[#1a1f2a] hover:border-slate-500 transition-all flex items-start justify-between gap-3 group"
          >
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <code className="font-mono font-bold text-xs px-2 py-0.5 rounded bg-[#13161c] text-emerald-400 border border-[#252c39]">
                  {item.token}
                </code>
                <span className="font-semibold text-xs text-white truncate">
                  {item.name}
                </span>
              </div>
              <p className="text-[11px] text-slate-300 mt-1 leading-relaxed">
                {item.description}
              </p>
              <div className="text-[10px] font-mono text-slate-500 mt-1 italic">
                {item.example}
              </div>
            </div>

            <button
              onClick={() => onInsertToken(item.token)}
              className="p-1.5 rounded-lg bg-[#202531] hover:bg-blue-600 text-slate-400 hover:text-white transition-colors shrink-0 flex items-center gap-1 text-[11px]"
              title={`Insert "${item.token}" into expression`}
            >
              <Plus className="w-3.5 h-3.5" />
              <span className="hidden group-hover:inline text-[10px]">Insert</span>
            </button>
          </div>
        ))}

        {filteredItems.length === 0 && (
          <div className="text-center py-8 text-xs text-slate-500">
            No matching regex tokens found for &ldquo;{search}&rdquo;
          </div>
        )}
      </div>
    </div>
  );
};
