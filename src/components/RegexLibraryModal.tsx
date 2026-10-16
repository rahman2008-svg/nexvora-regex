import React from 'react';
import { X, Search, BookOpen, ArrowRight, Sparkles, Check } from 'lucide-react';
import { POPULAR_PATTERNS } from '../data/regexLibrary';
import { SavedPattern } from '../types/regex';

interface RegexLibraryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectPattern: (pattern: SavedPattern) => void;
}

export const RegexLibraryModal: React.FC<RegexLibraryModalProps> = ({
  isOpen,
  onClose,
  onSelectPattern,
}) => {
  const [search, setSearch] = React.useState('');
  const [selectedCategory, setSelectedCategory] = React.useState<string>('All');
  const [loadedId, setLoadedId] = React.useState<string | null>(null);

  if (!isOpen) return null;

  const categories = ['All', 'Validation', 'Web', 'Network', 'Communication', 'Dates', 'Design', 'Markup', 'Data'];

  const filtered = POPULAR_PATTERNS.filter((p) => {
    const matchesCat = selectedCategory === 'All' || p.category === selectedCategory;
    const matchesSearch =
      search.trim() === '' ||
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.description.toLowerCase().includes(search.toLowerCase()) ||
      p.pattern.toLowerCase().includes(search.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const handleLoad = (pat: SavedPattern) => {
    onSelectPattern(pat);
    setLoadedId(pat.id);
    setTimeout(() => {
      setLoadedId(null);
      onClose();
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-in fade-in">
      <div
        className="w-full max-w-3xl bg-[#1e222b] border border-[#2e3646] rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#2e3646] bg-[#181b22]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <BookOpen className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Community &amp; Standard Regex Library</h2>
              <p className="text-xs text-slate-400">
                Verified regular expression patterns for everyday development tasks
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-[#2c323d] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filter bar */}
        <div className="p-4 border-b border-[#2e3646] bg-[#161a22] space-y-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search patterns (e.g. Email, URL, IP address, Phone)..."
              className="w-full pl-9 pr-3 py-2 bg-[#1e222b] border border-[#2e3646] rounded-lg text-xs text-white placeholder-slate-500 focus:outline-hidden focus:border-blue-500 font-mono"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            {categories.map((c) => (
              <button
                key={c}
                onClick={() => setSelectedCategory(c)}
                className={`px-2.5 py-1 rounded-md text-[11px] font-medium whitespace-nowrap transition-colors ${
                  selectedCategory === c
                    ? 'bg-amber-600 text-white font-semibold'
                    : 'bg-[#1f2533] text-slate-400 hover:text-white hover:bg-[#282f40] border border-[#2e3646]'
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        {/* Patterns List */}
        <div className="p-4 overflow-y-auto space-y-3 flex-1 bg-[#181b22]/50">
          {filtered.map((item) => (
            <div
              key={item.id}
              className="p-4 rounded-xl border border-[#2e3646] bg-[#1a1f2a] hover:border-blue-500/50 transition-all space-y-2.5"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-sm text-white">{item.title}</h3>
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">
                      {item.category}
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                    {item.description}
                  </p>
                </div>

                <button
                  onClick={() => handleLoad(item)}
                  className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shrink-0 transition-colors shadow-sm"
                >
                  {loadedId === item.id ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>Loaded</span>
                    </>
                  ) : (
                    <>
                      <span>Use Pattern</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              </div>

              <div className="p-2.5 rounded-lg bg-[#11141a] border border-[#252c39] font-mono text-xs text-amber-300 overflow-x-auto whitespace-pre">
                /{item.pattern}/{item.flags}
              </div>
            </div>
          ))}

          {filtered.length === 0 && (
            <div className="text-center py-10 text-xs text-slate-500">
              No regex patterns found matching your search.
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-[#2e3646] bg-[#181b22] flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-[#252c39] hover:bg-[#2e3646] text-slate-300 rounded-lg text-xs font-semibold transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
