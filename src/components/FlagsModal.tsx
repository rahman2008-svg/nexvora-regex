import React from 'react';
import { X, Check } from 'lucide-react';
import { RegexFlags } from '../types/regex';

interface FlagsModalProps {
  isOpen: boolean;
  onClose: () => void;
  flags: RegexFlags;
  onToggleFlag: (flagKey: keyof RegexFlags) => void;
}

interface FlagOption {
  key: keyof RegexFlags;
  char: string;
  name: string;
  description: string;
  example: string;
}

const FLAG_OPTIONS: FlagOption[] = [
  {
    key: 'global',
    char: 'g',
    name: 'Global',
    description: "Don't return after first match; find all occurrences throughout the entire string.",
    example: '/a/g finds all "a" characters',
  },
  {
    key: 'multiline',
    char: 'm',
    name: 'Multiline',
    description: '^ and $ match start and end of individual lines instead of start and end of whole string.',
    example: '/^foo/m matches "foo" at start of any line',
  },
  {
    key: 'caseInsensitive',
    char: 'i',
    name: 'Case Insensitive',
    description: 'Match characters regardless of uppercase or lowercase distinction.',
    example: '/apple/i matches "Apple", "APPLE", "apple"',
  },
  {
    key: 'singleLine',
    char: 's',
    name: 'Single line (dotAll)',
    description: 'Allows the dot (.) wildcard token to also match newline (\\n) characters.',
    example: '/foo.*bar/s matches across line breaks',
  },
  {
    key: 'unicode',
    char: 'u',
    name: 'Unicode',
    description: 'Treat pattern as a sequence of Unicode code points (ES6+ support).',
    example: '/\\u{1F600}/u matches emoji glyphs',
  },
  {
    key: 'sticky',
    char: 'y',
    name: 'Sticky',
    description: 'Matches only from the index indicated by lastIndex property of this regular expression.',
    example: 'Anchor searches to specific character offsets',
  },
];

export const FlagsModal: React.FC<FlagsModalProps> = ({
  isOpen,
  onClose,
  flags,
  onToggleFlag,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
      <div
        className="w-full max-w-lg bg-[#1e222b] border border-[#2e3646] rounded-xl shadow-2xl overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-[#2e3646] bg-[#181b22]">
          <div className="flex items-center gap-2">
            <span className="font-mono text-sm px-2 py-0.5 rounded bg-blue-500/20 text-blue-400 font-bold border border-blue-500/30">
              /flags
            </span>
            <h3 className="text-sm font-bold text-white">Regular Expression Flags / Modifiers</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded text-slate-400 hover:text-white hover:bg-[#2c323d] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-4 space-y-2.5 max-h-[70vh] overflow-y-auto">
          {FLAG_OPTIONS.map((opt) => {
            const isActive = flags[opt.key];
            return (
              <div
                key={opt.key}
                onClick={() => onToggleFlag(opt.key)}
                className={`p-3 rounded-lg border cursor-pointer transition-all flex items-start gap-3 select-none ${
                  isActive
                    ? 'bg-blue-600/10 border-blue-500/40 text-white'
                    : 'bg-[#181b22]/50 border-[#2a303d] text-slate-400 hover:border-slate-600'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded mt-0.5 flex items-center justify-center border transition-colors ${
                    isActive
                      ? 'bg-blue-600 border-blue-500 text-white'
                      : 'border-slate-600 bg-[#1e222b]'
                  }`}
                >
                  {isActive && <Check className="w-3.5 h-3.5" />}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-blue-400 text-sm">
                      {opt.char}
                    </span>
                    <span className="font-semibold text-xs text-white">
                      {opt.name}
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                    {opt.description}
                  </p>
                  <p className="text-[11px] font-mono text-slate-500 mt-1">
                    {opt.example}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        <div className="px-5 py-3 border-t border-[#2e3646] bg-[#181b22] flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
