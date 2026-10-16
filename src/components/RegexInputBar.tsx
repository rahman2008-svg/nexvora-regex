import React from 'react';
import { Sliders, AlertCircle, Check, Copy } from 'lucide-react';
import { RegexFlags } from '../types/regex';

interface RegexInputBarProps {
  pattern: string;
  onChangePattern: (val: string) => void;
  flagsStr: string;
  onOpenFlagsModal: () => void;
  error: string | null;
}

export const RegexInputBar: React.FC<RegexInputBarProps> = ({
  pattern,
  onChangePattern,
  flagsStr,
  onOpenFlagsModal,
  error,
}) => {
  const inputRef = React.useRef<HTMLInputElement>(null);

  return (
    <div className="bg-[#181b22] border-b border-[#2e3646] p-3 sm:p-4">
      <div className="flex items-center justify-between mb-1.5">
        <label className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
          <span>Regular Expression</span>
          {error && (
            <span className="flex items-center gap-1 text-[11px] font-normal text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/20 lowercase">
              <AlertCircle className="w-3 h-3" />
              {error}
            </span>
          )}
        </label>
        <span className="text-[11px] text-slate-400 font-mono hidden sm:inline">
          {pattern.length} chars
        </span>
      </div>

      {/* Delimiter & Input Container */}
      <div
        className={`flex items-center bg-[#1e222b] border rounded-lg overflow-hidden transition-all focus-within:ring-2 focus-within:ring-blue-500/40 ${
          error ? 'border-rose-500/60' : 'border-[#2e3646] focus-within:border-blue-500'
        }`}
      >
        {/* Leading Delimiter */}
        <div className="px-3 py-2.5 font-mono text-base font-bold text-blue-400 select-none bg-[#14171d]/60 border-r border-[#2e3646]/60">
          /
        </div>

        {/* Real Regex Input */}
        <input
          ref={inputRef}
          type="text"
          value={pattern}
          onChange={(e) => onChangePattern(e.target.value)}
          placeholder="insert your regular expression here..."
          className="flex-1 px-3 py-2.5 bg-transparent font-mono text-sm text-white placeholder-slate-500 focus:outline-hidden tracking-wide"
          spellCheck={false}
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
        />

        {/* Trailing Delimiter */}
        <div className="px-2 py-2.5 font-mono text-base font-bold text-blue-400 select-none border-l border-[#2e3646]/60">
          /
        </div>

        {/* Flags Pill Button */}
        <button
          onClick={onOpenFlagsModal}
          className="flex items-center gap-1.5 px-3 py-2.5 bg-[#252c39] hover:bg-[#2d3545] border-l border-[#2e3646] font-mono text-xs font-bold text-blue-400 transition-colors group"
          title="Click to edit pattern flags (g, m, i, s, u, y)"
        >
          <span>{flagsStr || 'none'}</span>
          <Sliders className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-300" />
        </button>
      </div>
    </div>
  );
};
