import React from 'react';
import {
  FileText,
  ListOrdered,
  Sparkles,
  Trash2,
  Clock,
  Activity,
  Layers,
  ChevronRight,
} from 'lucide-react';
import { RegexMatch } from '../types/regex';

interface TestStringEditorProps {
  testString: string;
  onChangeTestString: (val: string) => void;
  matches: RegexMatch[];
  executionTimeMs: number;
  stepCount: number;
  hoveredMatchIndex: number | null;
  onHoverMatch: (idx: number | null) => void;
  onInsertSample: () => void;
}

export const TestStringEditor: React.FC<TestStringEditorProps> = ({
  testString,
  onChangeTestString,
  matches,
  executionTimeMs,
  stepCount,
  hoveredMatchIndex,
  onHoverMatch,
  onInsertSample,
}) => {
  const [showLineNumbers, setShowLineNumbers] = React.useState(true);
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);
  const backdropRef = React.useRef<HTMLDivElement>(null);

  // Sync scrolling between textarea and backdrop highlight layer
  const handleScroll = () => {
    if (textareaRef.current && backdropRef.current) {
      backdropRef.current.scrollTop = textareaRef.current.scrollTop;
      backdropRef.current.scrollLeft = textareaRef.current.scrollLeft;
    }
  };

  // Build highlighted markup segments
  const renderHighlightedText = () => {
    if (!matches || matches.length === 0) {
      return <span>{testString}</span>;
    }

    const segments: React.ReactNode[] = [];
    let lastIndex = 0;

    // Sort matches safely
    const sortedMatches = [...matches].sort((a, b) => a.start - b.start);

    sortedMatches.forEach((m, mIdx) => {
      // Any text before match
      if (m.start > lastIndex) {
        segments.push(
          <span key={`text-${lastIndex}`}>{testString.slice(lastIndex, m.start)}</span>
        );
      }

      if (m.start < lastIndex) {
        // Overlapping match safeguard
        return;
      }

      const isHovered = hoveredMatchIndex === m.index;
      const colorClass = `match-highlight-${mIdx % 4}`;

      // Render inner groups if present
      if (m.groups && m.groups.length > 0) {
        let matchInnerPos = m.start;
        const innerNodes: React.ReactNode[] = [];

        m.groups.forEach((g, gIdx) => {
          if (g.start > matchInnerPos && g.start < m.end) {
            innerNodes.push(
              <span key={`match-${mIdx}-text-${matchInnerPos}`}>
                {testString.slice(matchInnerPos, g.start)}
              </span>
            );
          }

          if (g.start >= m.start && g.end <= m.end) {
            innerNodes.push(
              <span
                key={`match-${mIdx}-group-${gIdx}`}
                className={`group-highlight-${gIdx % 3} rounded-xs px-0.5 font-bold transition-all`}
                title={`Group #${g.number}: ${g.text}`}
              >
                {g.text}
              </span>
            );
            matchInnerPos = Math.max(matchInnerPos, g.end);
          }
        });

        if (matchInnerPos < m.end) {
          innerNodes.push(
            <span key={`match-${mIdx}-tail`}>
              {testString.slice(matchInnerPos, m.end)}
            </span>
          );
        }

        segments.push(
          <mark
            key={`match-${m.index}-${m.start}`}
            onMouseEnter={() => onHoverMatch(m.index)}
            onMouseLeave={() => onHoverMatch(null)}
            className={`${colorClass} px-0.5 rounded-xs cursor-pointer transition-all ${
              isHovered ? 'ring-2 ring-white ring-offset-1 ring-offset-[#1e222b]' : ''
            }`}
          >
            {innerNodes}
          </mark>
        );
      } else {
        segments.push(
          <mark
            key={`match-${m.index}-${m.start}`}
            onMouseEnter={() => onHoverMatch(m.index)}
            onMouseLeave={() => onHoverMatch(null)}
            className={`${colorClass} px-0.5 rounded-xs cursor-pointer transition-all ${
              isHovered ? 'ring-2 ring-white ring-offset-1 ring-offset-[#1e222b]' : ''
            }`}
          >
            {testString.slice(m.start, m.end)}
          </mark>
        );
      }

      lastIndex = m.end;
    });

    if (lastIndex < testString.length) {
      segments.push(
        <span key={`text-tail`}>{testString.slice(lastIndex)}</span>
      );
    }

    return segments;
  };

  // Line numbers calculation
  const linesCount = Math.max(1, testString.split('\n').length);
  const lineNumbers = Array.from({ length: linesCount }, (_, i) => i + 1);

  return (
    <div className="flex-1 flex flex-col bg-[#1e222b] overflow-hidden min-h-[350px]">
      {/* Test String Header */}
      <div className="px-4 py-2.5 bg-[#181b22] border-b border-[#2e3646] flex items-center justify-between select-none">
        <div className="flex items-center gap-2">
          <FileText className="w-4 h-4 text-blue-400" />
          <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">
            Test String
          </span>
          <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">
            {matches.length} {matches.length === 1 ? 'match' : 'matches'}
          </span>
        </div>

        {/* Toolbar actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={onInsertSample}
            className="flex items-center gap-1.5 px-2 py-1 rounded bg-[#202531] hover:bg-[#282e3d] text-slate-300 text-xs font-medium border border-[#2e3646] transition-colors"
            title="Load sample test strings"
          >
            <Sparkles className="w-3 h-3 text-amber-400" />
            <span className="hidden sm:inline">Insert Sample</span>
          </button>

          <button
            onClick={() => setShowLineNumbers(!showLineNumbers)}
            className={`p-1.5 rounded text-xs transition-colors ${
              showLineNumbers
                ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30'
                : 'text-slate-400 hover:text-white hover:bg-[#202531]'
            }`}
            title="Toggle line numbers"
          >
            <ListOrdered className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => onChangeTestString('')}
            className="p-1.5 rounded text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
            title="Clear test string"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Editor & Highlight Container */}
      <div className="flex-1 relative flex overflow-hidden">
        {/* Line Numbers Gutter */}
        {showLineNumbers && (
          <div className="w-12 bg-[#161a22] border-r border-[#2a303d] py-3 select-none flex flex-col text-right font-mono text-xs text-slate-600 overflow-hidden shrink-0">
            {lineNumbers.map((num) => (
              <div key={num} className="h-6 leading-6 pr-2">
                {num}
              </div>
            ))}
          </div>
        )}

        {/* Content Box */}
        <div className="flex-1 relative h-full overflow-hidden">
          {/* Backdrop Highlight Layer */}
          <div
            ref={backdropRef}
            aria-hidden="true"
            className="absolute inset-0 p-3 font-mono text-xs sm:text-sm leading-6 whitespace-pre-wrap wrap-break-word overflow-auto pointer-events-none select-none text-transparent"
          >
            {renderHighlightedText()}
            {/* Trailing newline spacer so scroll height matches */}
            <div className="h-6" />
          </div>

          {/* Interactive Textarea Foreground */}
          <textarea
            ref={textareaRef}
            value={testString}
            onChange={(e) => onChangeTestString(e.target.value)}
            onScroll={handleScroll}
            placeholder="Insert your test string here to test against the regular expression..."
            className="absolute inset-0 p-3 bg-transparent text-slate-100 font-mono text-xs sm:text-sm leading-6 whitespace-pre-wrap wrap-break-word resize-none focus:outline-hidden selection:bg-blue-600/40"
            spellCheck={false}
          />
        </div>
      </div>

      {/* Bottom Status Bar */}
      <div className="h-8 bg-[#14171d] border-t border-[#2e3646] px-4 flex items-center justify-between text-[11px] text-slate-400 font-mono select-none">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-blue-500" />
            <strong className="text-slate-200">{matches.length}</strong> matches
          </span>
          <span className="hidden sm:inline-block text-slate-600">&bull;</span>
          <span className="hidden sm:flex items-center gap-1 text-slate-400">
            <Activity className="w-3 h-3 text-emerald-400" />
            ~{stepCount} steps
          </span>
        </div>

        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1 text-slate-400">
            <Clock className="w-3 h-3 text-amber-400" />
            {executionTimeMs}ms
          </span>
          <span className="text-slate-600">&bull;</span>
          <span>
            {linesCount} {linesCount === 1 ? 'line' : 'lines'}, {testString.length} chars
          </span>
        </div>
      </div>
    </div>
  );
};
