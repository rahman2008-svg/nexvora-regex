import React from 'react';
import {
  FileText,
  ChevronDown,
  ChevronRight,
  Info,
  CornerDownRight,
  CheckCircle,
} from 'lucide-react';
import { ExplanationNode } from '../types/regex';

interface ExplanationPanelProps {
  nodes: ExplanationNode[];
  pattern: string;
}

const ExplanationItem: React.FC<{ node: ExplanationNode; depth?: number }> = ({
  node,
  depth = 0,
}) => {
  const [expanded, setExpanded] = React.useState(true);
  const hasChildren = node.children && node.children.length > 0;

  // Category badge color
  const getBadgeClass = (category: ExplanationNode['category']) => {
    switch (category) {
      case 'anchor':
        return 'bg-sky-500/10 text-sky-400 border-sky-500/20';
      case 'group':
        return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
      case 'quantifier':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
      case 'class':
        return 'bg-purple-500/10 text-purple-400 border-purple-500/20';
      case 'lookaround':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
      case 'flag':
        return 'bg-pink-500/10 text-pink-400 border-pink-500/20';
      case 'meta':
        return 'bg-teal-500/10 text-teal-400 border-teal-500/20';
      default:
        return 'bg-slate-500/10 text-slate-400 border-slate-500/20';
    }
  };

  return (
    <div className={`text-xs ${depth > 0 ? 'ml-3 sm:ml-4 pl-2 border-l border-[#2e3646]' : ''}`}>
      <div className="py-2 hover:bg-[#202531]/70 px-2 rounded-lg transition-colors group">
        <div className="flex items-start gap-2">
          {hasChildren ? (
            <button
              onClick={() => setExpanded(!expanded)}
              className="mt-0.5 p-0.5 rounded text-slate-400 hover:text-white"
            >
              {expanded ? (
                <ChevronDown className="w-3.5 h-3.5 text-blue-400" />
              ) : (
                <ChevronRight className="w-3.5 h-3.5" />
              )}
            </button>
          ) : (
            <CornerDownRight className="w-3.5 h-3.5 text-slate-600 mt-0.5 shrink-0" />
          )}

          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-1.5">
              <code className="font-mono font-bold text-xs px-1.5 py-0.5 rounded bg-[#161a22] text-amber-300 border border-[#2c323d]">
                {node.raw}
              </code>
              <span className="font-semibold text-slate-200">{node.title}</span>
              <span
                className={`text-[9px] uppercase font-bold px-1.5 py-0.2 rounded border ${getBadgeClass(
                  node.category
                )}`}
              >
                {node.category}
              </span>
            </div>

            <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
              {node.description}
            </p>
          </div>
        </div>
      </div>

      {hasChildren && expanded && (
        <div className="space-y-0.5 mt-0.5">
          {node.children!.map((child) => (
            <ExplanationItem key={child.id} node={child} depth={depth + 1} />
          ))}
        </div>
      )}
    </div>
  );
};

export const ExplanationPanel: React.FC<ExplanationPanelProps> = ({ nodes, pattern }) => {
  if (!pattern) {
    return (
      <div className="p-6 text-center text-slate-500 text-xs">
        <Info className="w-8 h-8 mx-auto mb-2 opacity-40 text-blue-400" />
        <p className="font-medium text-slate-400">No regular expression entered</p>
        <p className="text-[11px] mt-1">
          Type or paste a pattern into the expression bar above to view token-by-token explanation.
        </p>
      </div>
    );
  }

  return (
    <div className="p-3 sm:p-4 space-y-2">
      <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2 flex items-center justify-between">
        <span>Detailed Explanation</span>
        <span className="text-[10px] text-blue-400 font-mono">
          {nodes.length} top-level tokens
        </span>
      </div>

      <div className="space-y-1">
        {nodes.map((node) => (
          <ExplanationItem key={node.id} node={node} />
        ))}
      </div>
    </div>
  );
};
