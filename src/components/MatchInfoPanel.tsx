import React from 'react';
import {
  ListChecks,
  ChevronDown,
  ChevronRight,
  Copy,
  Check,
  Hash,
  Layers,
  Sparkles,
} from 'lucide-react';
import { RegexMatch } from '../types/regex';

interface MatchInfoPanelProps {
  matches: RegexMatch[];
  hoveredMatchIndex: number | null;
  onHoverMatch: (idx: number | null) => void;
  executionTimeMs: number;
}

export const MatchInfoPanel: React.FC<MatchInfoPanelProps> = ({
  matches,
  hoveredMatchIndex,
  onHoverMatch,
  executionTimeMs,
}) => {
  const [copiedId, setCopiedId] = React.useState<string | null>(null);
  const [collapsedMatches, setCollapsedMatches] = React.useState<Record<number, boolean>>({});

  const toggleCollapse = (idx: number) => {
    setCollapsedMatches((prev) => ({ ...prev, [idx]: !prev[idx] }));
  };

  const copyText = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1800);
  };

  if (!matches || matches.length === 0) {
    return (
      <div className="p-6 text-center text-slate-500 text-xs">
        <ListChecks className="w-8 h-8 mx-auto mb-2 opacity-40 text-blue-400" />
        <p className="font-medium text-slate-400">No match found</p>
        <p className="text-[11px] mt-1">
          The test string does not match the expression with current flags.
        </p>
      </div>
    );
  }

  return (
    <div className="p-3 sm:p-4 space-y-3">
      {/* Overview Stat */}
      <div className="flex items-center justify-between text-xs pb-2 border-b border-[#2e3646]">
        <div className="flex items-center gap-2">
          <span className="font-bold text-white">
            {matches.length} {matches.length === 1 ? 'Match' : 'Matches'}
          </span>
          <span className="text-[11px] text-slate-400 font-mono">
            ({executionTimeMs}ms)
          </span>
        </div>
        <span className="text-[10px] text-emerald-400 font-mono bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
          Evaluated
        </span>
      </div>

      {/* Matches List */}
      <div className="space-y-2.5">
        {matches.map((m, mIdx) => {
          const isHovered = hoveredMatchIndex === m.index;
          const isCollapsed = collapsedMatches[m.index];
          const matchColorBadge = [
            'text-blue-400 border-blue-500/30 bg-blue-500/10',
            'text-emerald-400 border-emerald-500/30 bg-emerald-500/10',
            'text-amber-400 border-amber-500/30 bg-amber-500/10',
            'text-purple-400 border-purple-500/30 bg-purple-500/10',
          ][mIdx % 4];

          return (
            <div
              key={`match-card-${m.index}`}
              onMouseEnter={() => onHoverMatch(m.index)}
              onMouseLeave={() => onHoverMatch(null)}
              className={`rounded-lg border transition-all ${
                isHovered
                  ? 'border-blue-500/80 bg-[#222938]'
                  : 'border-[#2e3646] bg-[#1a1f2a] hover:border-slate-500'
              }`}
            >
              {/* Match Header */}
              <div className="p-2.5 flex items-center justify-between text-xs">
                <div
                  className="flex items-center gap-2 cursor-pointer flex-1 min-w-0"
                  onClick={() => toggleCollapse(m.index)}
                >
                  <button className="text-slate-400 hover:text-white">
                    {isCollapsed ? (
                      <ChevronRight className="w-3.5 h-3.5" />
                    ) : (
                      <ChevronDown className="w-3.5 h-3.5" />
                    )}
                  </button>
                  <span
                    className={`font-mono text-[11px] font-bold px-1.5 py-0.2 rounded border ${matchColorBadge}`}
                  >
                    Match {mIdx + 1}
                  </span>
                  <span className="font-mono text-[11px] text-slate-400">
                    [{m.start}-{m.end}]
                  </span>
                </div>

                <button
                  onClick={() => copyText(m.text, `m-${m.index}`)}
                  className="p-1 text-slate-400 hover:text-white rounded hover:bg-[#2c323d] transition-colors"
                  title="Copy matched string"
                >
                  {copiedId === `m-${m.index}` ? (
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>

              {/* Match Content Value */}
              {!isCollapsed && (
                <div className="px-3 pb-3 space-y-2 border-t border-[#262c3b]/80 pt-2 text-xs">
                  <div className="p-2 rounded bg-[#13161c] border border-[#232936] font-mono text-xs text-white break-all whitespace-pre-wrap select-all">
                    {m.text || <span className="text-slate-500 italic">Empty string (0-length match)</span>}
                  </div>

                  {/* Groups Breakdown */}
                  {m.groups && m.groups.length > 0 && (
                    <div className="pt-1 space-y-1.5">
                      <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                        <Layers className="w-3 h-3 text-blue-400" />
                        <span>Capturing Groups ({m.groups.length})</span>
                      </div>

                      {m.groups.map((g) => (
                        <div
                          key={`group-${m.index}-${g.number}`}
                          className="flex items-start justify-between p-1.5 rounded bg-[#151922] border border-[#262d3d] text-xs font-mono"
                        >
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-1.5 text-[11px]">
                              <span className="font-bold text-pink-400">
                                Group {g.number}:
                              </span>
                              <span className="text-slate-400">
                                [{g.start}-{g.end}]
                              </span>
                            </div>
                            <div className="text-slate-200 mt-0.5 break-all">
                              &ldquo;{g.text}&rdquo;
                            </div>
                          </div>

                          <button
                            onClick={() => copyText(g.text, `g-${m.index}-${g.number}`)}
                            className="p-1 text-slate-400 hover:text-white rounded hover:bg-[#202531]"
                            title="Copy group text"
                          >
                            {copiedId === `g-${m.index}-${g.number}` ? (
                              <Check className="w-3 h-3 text-emerald-400" />
                            ) : (
                              <Copy className="w-3 h-3" />
                            )}
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Named Groups */}
                  {m.namedGroups && Object.keys(m.namedGroups).length > 0 && (
                    <div className="pt-1 space-y-1.5">
                      <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                        <Hash className="w-3 h-3 text-amber-400" />
                        <span>Named Groups</span>
                      </div>
                      {Object.entries(m.namedGroups).map(([name, val]) => (
                        <div
                          key={name}
                          className="flex items-center justify-between p-1.5 rounded bg-[#151922] border border-[#262d3d] text-xs font-mono"
                        >
                          <div className="truncate">
                            <span className="text-amber-400 font-semibold">{name}: </span>
                            <span className="text-white">&ldquo;{val}&rdquo;</span>
                          </div>
                          <button
                            onClick={() => copyText(val, `ng-${name}`)}
                            className="p-1 text-slate-400 hover:text-white"
                          >
                            {copiedId === `ng-${name}` ? (
                              <Check className="w-3 h-3 text-emerald-400" />
                            ) : (
                              <Copy className="w-3 h-3" />
                            )}
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
