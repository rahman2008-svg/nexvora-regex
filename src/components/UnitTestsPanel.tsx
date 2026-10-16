import React from 'react';
import {
  CheckCircle2,
  XCircle,
  Plus,
  Trash2,
  Play,
  RotateCcw,
  Check,
  AlertTriangle,
} from 'lucide-react';
import { UnitTest } from '../types/regex';

interface UnitTestsPanelProps {
  tests: UnitTest[];
  onAddTest: (test: Omit<UnitTest, 'id'>) => void;
  onRemoveTest: (id: string) => void;
  onRunTests: () => void;
  pattern: string;
}

export const UnitTestsPanel: React.FC<UnitTestsPanelProps> = ({
  tests,
  onAddTest,
  onRemoveTest,
  onRunTests,
  pattern,
}) => {
  const [newTitle, setNewTitle] = React.useState('');
  const [newString, setNewString] = React.useState('');
  const [newExpected, setNewExpected] = React.useState<boolean>(true);

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newString.trim()) return;

    onAddTest({
      name: newTitle.trim() || `Test Case #${tests.length + 1}`,
      testString: newString,
      expectedMatch: newExpected,
    });

    setNewTitle('');
    setNewString('');
    setNewExpected(true);
  };

  const passCount = tests.filter((t) => t.passed === true).length;
  const failCount = tests.filter((t) => t.passed === false).length;

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-4xl mx-auto">
      {/* Header & Run Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-[#181b22] border border-[#2e3646]">
        <div>
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            <span>Regex Unit Testing Suite</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Validate edge cases and ensure regression-proof patterns
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-xs font-mono">
            <span className="px-2 py-1 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              {passCount} passed
            </span>
            <span className="px-2 py-1 rounded bg-rose-500/10 text-rose-400 border border-rose-500/20">
              {failCount} failed
            </span>
          </div>

          <button
            onClick={onRunTests}
            className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold transition-colors shadow-sm"
          >
            <Play className="w-3.5 h-3.5 fill-white" />
            <span>Run All Tests</span>
          </button>
        </div>
      </div>

      {/* Add New Test Form */}
      <form
        onSubmit={handleAdd}
        className="p-4 rounded-xl bg-[#1a1f2a] border border-[#2e3646] space-y-3"
      >
        <div className="text-xs font-bold text-slate-300 uppercase tracking-wider">
          Add New Test Assertion
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <input
            type="text"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            placeholder="Label (optional, e.g. Valid email)"
            className="px-3 py-2 bg-[#14171d] border border-[#2e3646] rounded-lg text-xs text-white placeholder-slate-500 focus:outline-hidden focus:border-blue-500"
          />

          <input
            type="text"
            value={newString}
            onChange={(e) => setNewString(e.target.value)}
            placeholder="Test string text..."
            required
            className="px-3 py-2 bg-[#14171d] border border-[#2e3646] rounded-lg text-xs font-mono text-white placeholder-slate-500 focus:outline-hidden focus:border-blue-500 sm:col-span-1"
          />

          <div className="flex items-center gap-2">
            <select
              value={newExpected ? 'match' : 'no-match'}
              onChange={(e) => setNewExpected(e.target.value === 'match')}
              className="flex-1 px-3 py-2 bg-[#14171d] border border-[#2e3646] rounded-lg text-xs font-medium text-white focus:outline-hidden"
            >
              <option value="match">Must Match (True)</option>
              <option value="no-match">Must NOT Match (False)</option>
            </select>

            <button
              type="submit"
              className="px-3 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>Add</span>
            </button>
          </div>
        </div>
      </form>

      {/* Tests Table */}
      <div className="space-y-2">
        {tests.map((test) => {
          let statusBadge = (
            <span className="text-[10px] text-slate-400 font-mono">Not Run</span>
          );

          if (test.passed === true) {
            statusBadge = (
              <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                <CheckCircle2 className="w-3.5 h-3.5" />
                PASS
              </span>
            );
          } else if (test.passed === false) {
            statusBadge = (
              <span className="flex items-center gap-1 text-[11px] font-bold text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/20">
                <XCircle className="w-3.5 h-3.5" />
                FAIL
              </span>
            );
          }

          return (
            <div
              key={test.id}
              className={`p-3 rounded-lg border transition-all flex items-center justify-between gap-4 ${
                test.passed === true
                  ? 'bg-emerald-950/10 border-emerald-500/30'
                  : test.passed === false
                  ? 'bg-rose-950/10 border-rose-500/30'
                  : 'bg-[#181b22] border-[#2e3646]'
              }`}
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-white">
                    {test.name}
                  </span>
                  <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-[#13161c] text-slate-400 border border-[#252c39]">
                    Expected:{' '}
                    {test.expectedMatch ? (
                      <span className="text-emerald-400 font-bold">MATCH</span>
                    ) : (
                      <span className="text-rose-400 font-bold">NO MATCH</span>
                    )}
                  </span>
                </div>
                <div className="mt-1 font-mono text-xs text-slate-300 break-all bg-[#12151b] px-2 py-1 rounded border border-[#252c39]">
                  &ldquo;{test.testString}&rdquo;
                </div>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                {statusBadge}
                <button
                  onClick={() => onRemoveTest(test.id)}
                  className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded transition-colors"
                  title="Remove test case"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}

        {tests.length === 0 && (
          <div className="text-center py-8 text-xs text-slate-500 bg-[#181b22] rounded-xl border border-dashed border-[#2e3646]">
            No unit tests defined yet. Add test strings above to verify your regex logic.
          </div>
        )}
      </div>
    </div>
  );
};
