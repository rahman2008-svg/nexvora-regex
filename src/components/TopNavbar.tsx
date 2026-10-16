import React from 'react';
import {
  Code,
  Share2,
  Copy,
  Trash2,
  BookOpen,
  ChevronDown,
  Info,
  Menu,
  Sparkles,
  Terminal,
  Check,
  FileCode2,
} from 'lucide-react';
import { RegexFlavor } from '../types/regex';

interface TopNavbarProps {
  flavor: RegexFlavor;
  onSelectFlavor: (flavor: RegexFlavor) => void;
  functionMode: 'match' | 'substitution' | 'list';
  onChangeMode: (mode: 'match' | 'substitution' | 'list') => void;
  onClear: () => void;
  onOpenLibrary: () => void;
  onOpenCodeGenerator: () => void;
  onOpenAbout: () => void;
  onToggleSidebarMobile: () => void;
  pattern: string;
  flagsStr: string;
}

const FLAVORS: { id: RegexFlavor; label: string; tag: string }[] = [
  { id: 'pcre2', label: 'PCRE2 (PHP)', tag: 'v10.42' },
  { id: 'javascript', label: 'ECMAScript (JavaScript)', tag: 'ES2024' },
  { id: 'python', label: 'Python (re)', tag: '3.12' },
  { id: 'golang', label: 'Golang', tag: '1.22' },
  { id: 'java', label: 'Java 8+', tag: 'Standard' },
  { id: 'csharp', label: '.NET (C#)', tag: 'Core' },
  { id: 'rust', label: 'Rust', tag: 'regex' },
];

export const TopNavbar: React.FC<TopNavbarProps> = ({
  flavor,
  onSelectFlavor,
  functionMode,
  onChangeMode,
  onClear,
  onOpenLibrary,
  onOpenCodeGenerator,
  onOpenAbout,
  onToggleSidebarMobile,
  pattern,
  flagsStr,
}) => {
  const [flavorDropdownOpen, setFlavorDropdownOpen] = React.useState(false);
  const [copiedRegex, setCopiedRegex] = React.useState(false);
  const [shareNotice, setShareNotice] = React.useState(false);

  const handleCopyRegex = () => {
    navigator.clipboard.writeText(`/${pattern}/${flagsStr}`);
    setCopiedRegex(true);
    setTimeout(() => setCopiedRegex(false), 2000);
  };

  const handleShare = () => {
    // Generate URL hash or link
    const params = new URLSearchParams();
    if (pattern) params.set('pattern', pattern);
    if (flagsStr) params.set('flags', flagsStr);
    params.set('flavor', flavor);
    window.location.hash = params.toString();

    navigator.clipboard.writeText(window.location.href);
    setShareNotice(true);
    setTimeout(() => setShareNotice(false), 2500);
  };

  const currentFlavorObj = FLAVORS.find((f) => f.id === flavor) || FLAVORS[0];

  return (
    <header className="h-14 border-b border-[#2e3646] bg-[#181b22] px-3 sm:px-4 flex items-center justify-between z-30 select-none">
      {/* Left: Mobile Toggle & Brand */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleSidebarMobile}
          className="md:hidden p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-[#2c323d] transition-colors"
          title="Toggle Navigation"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2.5 cursor-pointer" onClick={onOpenAbout}>
          <div className="w-8 h-8 rounded-lg bg-linear-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-white font-mono font-bold text-sm shadow-md">
            /N/
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-white text-base tracking-tight">NexVora</span>
              <span className="text-blue-400 font-semibold text-base">Regex</span>
              <span className="hidden sm:inline-block text-[10px] uppercase font-bold px-1.5 py-0.2 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20">
                101
              </span>
            </div>
            <span className="hidden sm:block text-[10px] text-slate-400 font-medium">
              by Prince AR Abdur Rahman &bull; NexVora Lab&apos;s
            </span>
          </div>
        </div>

        {/* Flavor Selector Dropdown */}
        <div className="relative ml-2 sm:ml-4">
          <button
            onClick={() => setFlavorDropdownOpen(!flavorDropdownOpen)}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-[#202531] hover:bg-[#282e3d] border border-[#2e3646] text-xs font-medium text-slate-200 transition-colors"
          >
            <Terminal className="w-3.5 h-3.5 text-blue-400" />
            <span className="hidden sm:inline text-slate-400">Flavor:</span>
            <span className="font-semibold text-white">{currentFlavorObj.label}</span>
            <ChevronDown className="w-3 h-3 text-slate-400" />
          </button>

          {flavorDropdownOpen && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setFlavorDropdownOpen(false)}
              />
              <div className="absolute left-0 mt-1 w-64 bg-[#1e222b] border border-[#2e3646] rounded-xl shadow-2xl py-1.5 z-50 animate-in fade-in">
                <div className="px-3 py-1.5 text-[11px] font-semibold text-slate-400 uppercase tracking-wider border-b border-[#2e3646]">
                  Select Regex Flavor
                </div>
                {FLAVORS.map((f) => (
                  <button
                    key={f.id}
                    onClick={() => {
                      onSelectFlavor(f.id);
                      setFlavorDropdownOpen(false);
                    }}
                    className={`w-full px-3 py-2 text-left text-xs flex items-center justify-between hover:bg-[#2c323d] transition-colors ${
                      flavor === f.id
                        ? 'text-blue-400 font-semibold bg-blue-500/10'
                        : 'text-slate-300'
                    }`}
                  >
                    <span>{f.label}</span>
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#181b22] text-slate-400">
                      {f.tag}
                    </span>
                  </button>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Function Mode Selector (Match vs Substitution vs List) */}
        <div className="hidden lg:flex items-center p-0.5 rounded-lg bg-[#202531] border border-[#2e3646] text-xs font-medium">
          <button
            onClick={() => onChangeMode('match')}
            className={`px-3 py-1 rounded-md transition-colors ${
              functionMode === 'match'
                ? 'bg-blue-600 text-white font-semibold shadow-xs'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Match
          </button>
          <button
            onClick={() => onChangeMode('substitution')}
            className={`px-3 py-1 rounded-md transition-colors ${
              functionMode === 'substitution'
                ? 'bg-blue-600 text-white font-semibold shadow-xs'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Substitution
          </button>
          <button
            onClick={() => onChangeMode('list')}
            className={`px-3 py-1 rounded-md transition-colors ${
              functionMode === 'list'
                ? 'bg-blue-600 text-white font-semibold shadow-xs'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            List / Extract
          </button>
        </div>
      </div>

      {/* Right Action Buttons */}
      <div className="flex items-center gap-1.5 sm:gap-2">
        {/* Quick Regex Library */}
        <button
          onClick={onOpenLibrary}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-[#202531] hover:bg-[#282e3d] border border-[#2e3646] text-xs font-medium text-slate-300 hover:text-white transition-colors"
          title="Browse Community & Library Patterns"
        >
          <BookOpen className="w-3.5 h-3.5 text-amber-400" />
          <span className="hidden sm:inline">Library</span>
        </button>

        {/* Code Generator */}
        <button
          onClick={onOpenCodeGenerator}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-[#202531] hover:bg-[#282e3d] border border-[#2e3646] text-xs font-medium text-slate-300 hover:text-white transition-colors"
          title="Export Code in JS, Python, Go, Java, C#, PHP, Rust"
        >
          <FileCode2 className="w-3.5 h-3.5 text-emerald-400" />
          <span className="hidden md:inline">Generate Code</span>
        </button>

        {/* Copy Regex */}
        <button
          onClick={handleCopyRegex}
          className="p-1.5 sm:px-2.5 sm:py-1.5 rounded-lg bg-[#202531] hover:bg-[#282e3d] border border-[#2e3646] text-xs font-medium text-slate-300 hover:text-white transition-colors flex items-center gap-1.5"
          title="Copy full regex string"
        >
          {copiedRegex ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              <span className="hidden sm:inline text-emerald-400">Copied!</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5 text-slate-400" />
              <span className="hidden sm:inline">Copy</span>
            </>
          )}
        </button>

        {/* Share / Permalink */}
        <button
          onClick={handleShare}
          className="p-1.5 sm:px-2.5 sm:py-1.5 rounded-lg bg-[#202531] hover:bg-[#282e3d] border border-[#2e3646] text-xs font-medium text-slate-300 hover:text-white transition-colors flex items-center gap-1.5"
          title="Share link"
        >
          {shareNotice ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              <span className="hidden sm:inline text-emerald-400">Link Copied!</span>
            </>
          ) : (
            <>
              <Share2 className="w-3.5 h-3.5 text-slate-400" />
              <span className="hidden sm:inline">Share</span>
            </>
          )}
        </button>

        {/* Clear */}
        <button
          onClick={onClear}
          className="p-1.5 sm:px-2 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
          title="Clear Pattern & Text"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>

        {/* About Developer & Company Trigger */}
        <button
          onClick={onOpenAbout}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-linear-to-r from-blue-600/20 to-indigo-600/20 hover:from-blue-600/30 hover:to-indigo-600/30 border border-blue-500/30 text-xs font-semibold text-blue-300 transition-all shadow-xs"
          title="About Developer & Company (Prince AR Abdur Rahman / NexVora Lab's)"
        >
          <Info className="w-3.5 h-3.5 text-blue-400" />
          <span className="hidden sm:inline">About</span>
        </button>
      </div>
    </header>
  );
};
