import React from 'react';
import { Repeat, Copy, Check, ArrowRight } from 'lucide-react';

interface SubstitutionBarProps {
  replacement: string;
  onChangeReplacement: (val: string) => void;
  substitutedResult: string;
  replacementsCount: number;
}

export const SubstitutionBar: React.FC<SubstitutionBarProps> = ({
  replacement,
  onChangeReplacement,
  substitutedResult,
  replacementsCount,
}) => {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(substitutedResult);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-[#161a22] border-b border-[#2e3646] p-3 sm:p-4 space-y-3">
      {/* Input row */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <label className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
            <Repeat className="w-3.5 h-3.5 text-blue-400" />
            <span>Substitution / Replacement Pattern</span>
          </label>
          <span className="text-[11px] text-slate-400">
            Use <code className="text-blue-400">$1</code>, <code className="text-blue-400">$2</code>,{' '}
            <code className="text-blue-400">$&amp;</code> for backreferences
          </span>
        </div>

        <div className="flex items-center bg-[#1e222b] border border-[#2e3646] rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-blue-500/40 focus-within:border-blue-500">
          <div className="px-3 py-2 text-xs font-mono font-semibold text-slate-400 bg-[#14171d]/60 border-r border-[#2e3646]">
            Replace with:
          </div>
          <input
            type="text"
            value={replacement}
            onChange={(e) => onChangeReplacement(e.target.value)}
            placeholder="e.g. [$1] or replaced_value..."
            className="flex-1 px-3 py-2 bg-transparent font-mono text-xs text-white placeholder-slate-500 focus:outline-hidden"
            spellCheck={false}
          />
        </div>
      </div>

      {/* Substituted Output Box */}
      <div>
        <div className="flex items-center justify-between mb-1 text-xs">
          <div className="flex items-center gap-2 text-slate-300 font-semibold">
            <ArrowRight className="w-3.5 h-3.5 text-emerald-400" />
            <span>Substituted Result</span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-mono">
              {replacementsCount} replacement{replacementsCount !== 1 ? 's' : ''}
            </span>
          </div>
          <button
            onClick={handleCopy}
            className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-white transition-colors"
          >
            {copied ? (
              <>
                <Check className="w-3 h-3 text-emerald-400" />
                <span className="text-emerald-400">Copied Result</span>
              </>
            ) : (
              <>
                <Copy className="w-3 h-3" />
                <span>Copy Result</span>
              </>
            )}
          </button>
        </div>

        <pre className="p-3 bg-[#11141a] border border-[#252c39] rounded-lg font-mono text-xs text-slate-200 overflow-x-auto max-h-36 whitespace-pre-wrap selection:bg-blue-500/30">
          {substitutedResult || <span className="text-slate-600 italic">No output</span>}
        </pre>
      </div>
    </div>
  );
};
