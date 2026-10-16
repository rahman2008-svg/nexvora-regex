/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useMemo, useState } from 'react';
import {
  ActiveSidebarTab,
  Sidebar,
} from './components/Sidebar';
import { TopNavbar } from './components/TopNavbar';
import { RegexInputBar } from './components/RegexInputBar';
import { SubstitutionBar } from './components/SubstitutionBar';
import { TestStringEditor } from './components/TestStringEditor';
import { ExplanationPanel } from './components/ExplanationPanel';
import { MatchInfoPanel } from './components/MatchInfoPanel';
import { QuickReferencePanel } from './components/QuickReferencePanel';
import { FlagsModal } from './components/FlagsModal';
import { AboutModal } from './components/AboutModal';
import { CodeGeneratorModal } from './components/CodeGeneratorModal';
import { RegexLibraryModal } from './components/RegexLibraryModal';
import { UnitTestsPanel } from './components/UnitTestsPanel';
import { Footer } from './components/Footer';

import {
  RegexFlags,
  RegexFlavor,
  SavedPattern,
  UnitTest,
} from './types/regex';
import {
  evaluateRegex,
  explainRegex,
  performSubstitution,
} from './utils/regexParser';
import { POPULAR_PATTERNS } from './data/regexLibrary';
import { BookOpen, Code2, HelpCircle, Info, ListChecks, Play } from 'lucide-react';

export default function App() {
  // Regex state
  const [pattern, setPattern] = useState<string>(
    '([a-zA-Z0-9._%+-]+)@([a-zA-Z0-9.-]+\\.[a-zA-Z]{2,})'
  );
  const [flags, setFlags] = useState<RegexFlags>({
    global: true,
    multiline: true,
    caseInsensitive: false,
    singleLine: false,
    unicode: false,
    extended: false,
    sticky: false,
  });

  const [flavor, setFlavor] = useState<RegexFlavor>('pcre2');
  const [functionMode, setFunctionMode] = useState<'match' | 'substitution' | 'list'>('match');
  const [replacement, setReplacement] = useState<string>('[$1]');
  const [testString, setTestString] = useState<string>(
    `Welcome to NexVora Regex by Prince AR Abdur Rahman!
Official Inquiries:
support@nexvora.com
developer.contact@gmail.com
team-alpha@sub.nexvora.org

Invalid addresses:
fake-email@
no-domain@.com
random-text-sample`
  );

  // Navigation & layout state
  const [activeSidebarTab, setActiveSidebarTab] = useState<ActiveSidebarTab>('tester');
  const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(false);
  const [sidebarMobileOpen, setSidebarMobileOpen] = useState<boolean>(false);
  const [rightPanelTab, setRightPanelTab] = useState<'explanation' | 'matches' | 'quick-ref'>('matches');

  // Modals state
  const [flagsModalOpen, setFlagsModalOpen] = useState<boolean>(false);
  const [aboutModalOpen, setAboutModalOpen] = useState<boolean>(false);
  const [codeGeneratorModalOpen, setCodeGeneratorModalOpen] = useState<boolean>(false);
  const [libraryModalOpen, setLibraryModalOpen] = useState<boolean>(false);

  // Hover sync state
  const [hoveredMatchIndex, setHoveredMatchIndex] = useState<number | null>(null);

  // Unit tests state
  const [unitTests, setUnitTests] = useState<UnitTest[]>([
    {
      id: 'test-1',
      name: 'Standard corporate email',
      testString: 'john.doe@company.com',
      expectedMatch: true,
      actualMatch: true,
      passed: true,
    },
    {
      id: 'test-2',
      name: 'Email with plus-tag',
      testString: 'user+testing@nexvora.org',
      expectedMatch: true,
      actualMatch: true,
      passed: true,
    },
    {
      id: 'test-3',
      name: 'Missing top-level domain',
      testString: 'invalid@hostname',
      expectedMatch: false,
      actualMatch: false,
      passed: true,
    },
  ]);

  // Compute flag string
  const flagsStr = useMemo(() => {
    let str = '';
    if (flags.global) str += 'g';
    if (flags.multiline) str += 'm';
    if (flags.caseInsensitive) str += 'i';
    if (flags.singleLine) str += 's';
    if (flags.unicode) str += 'u';
    if (flags.sticky) str += 'y';
    return str;
  }, [flags]);

  // Toggle specific flag
  const handleToggleFlag = (key: keyof RegexFlags) => {
    setFlags((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  // Safe evaluation
  const evaluation = useMemo(() => {
    return evaluateRegex(pattern, flagsStr, testString);
  }, [pattern, flagsStr, testString]);

  // Explanation tree
  const explanationNodes = useMemo(() => {
    return explainRegex(pattern, flagsStr);
  }, [pattern, flagsStr]);

  // Substitution execution
  const substitutionResult = useMemo(() => {
    return performSubstitution(pattern, flagsStr, testString, replacement);
  }, [pattern, flagsStr, testString, replacement]);

  // Read URL params or hash on initial load
  useEffect(() => {
    if (window.location.hash) {
      try {
        const hashStr = window.location.hash.replace(/^#/, '');
        const params = new URLSearchParams(hashStr);
        const p = params.get('pattern');
        const f = params.get('flags');
        const fl = params.get('flavor') as RegexFlavor;
        if (p) setPattern(p);
        if (fl) setFlavor(fl);
        if (f) {
          setFlags({
            global: f.includes('g'),
            multiline: f.includes('m'),
            caseInsensitive: f.includes('i'),
            singleLine: f.includes('s'),
            unicode: f.includes('u'),
            extended: f.includes('x'),
            sticky: f.includes('y'),
          });
        }
      } catch {
        // ignore hash errors
      }
    }
  }, []);

  // Insert token into pattern
  const handleInsertToken = (token: string) => {
    setPattern((prev) => prev + token);
  };

  // Clear pattern and test text
  const handleClear = () => {
    setPattern('');
    setTestString('');
  };

  // Load sample pattern
  const handleSelectPattern = (item: SavedPattern) => {
    setPattern(item.pattern);
    setTestString(item.testString);
    setFlavor(item.flavor);
    setFlags({
      global: item.flags.includes('g'),
      multiline: item.flags.includes('m'),
      caseInsensitive: item.flags.includes('i'),
      singleLine: item.flags.includes('s'),
      unicode: item.flags.includes('u'),
      extended: item.flags.includes('x'),
      sticky: item.flags.includes('y'),
    });
  };

  // Run all unit tests
  const handleRunUnitTests = () => {
    setUnitTests((prev) =>
      prev.map((test) => {
        const evalRes = evaluateRegex(pattern, flagsStr, test.testString);
        const matchesExist = evalRes.matches.length > 0;
        const passed = matchesExist === test.expectedMatch;
        return {
          ...test,
          actualMatch: matchesExist,
          passed,
        };
      })
    );
  };

  // Insert random sample pattern test string
  const handleInsertSample = () => {
    const randomPat =
      POPULAR_PATTERNS[Math.floor(Math.random() * POPULAR_PATTERNS.length)];
    setPattern(randomPat.pattern);
    setTestString(randomPat.testString);
  };

  // Handle sidebar navigation
  const handleSelectSidebarTab = (tab: ActiveSidebarTab) => {
    if (tab === 'about') {
      setAboutModalOpen(true);
      return;
    }
    if (tab === 'library') {
      setLibraryModalOpen(true);
      return;
    }
    if (tab === 'code-gen') {
      setCodeGeneratorModalOpen(true);
      return;
    }
    if (tab === 'quick-ref') {
      setActiveSidebarTab('tester');
      setRightPanelTab('quick-ref');
      return;
    }
    if (tab === 'substitution') {
      setFunctionMode('substitution');
      setActiveSidebarTab('tester');
      return;
    }

    setActiveSidebarTab(tab);
  };

  return (
    <div className="min-h-screen bg-[#1e222b] text-[#d6deeb] flex flex-col font-sans">
      {/* Top Navbar */}
      <TopNavbar
        flavor={flavor}
        onSelectFlavor={setFlavor}
        functionMode={functionMode}
        onChangeMode={setFunctionMode}
        onClear={handleClear}
        onOpenLibrary={() => setLibraryModalOpen(true)}
        onOpenCodeGenerator={() => setCodeGeneratorModalOpen(true)}
        onOpenAbout={() => setAboutModalOpen(true)}
        onToggleSidebarMobile={() => setSidebarMobileOpen(true)}
        pattern={pattern}
        flagsStr={flagsStr}
      />

      {/* Main Workspace Body */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Navigation Sidebar */}
        <Sidebar
          activeTab={activeSidebarTab}
          onSelectTab={handleSelectSidebarTab}
          collapsed={sidebarCollapsed}
          onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
          mobileOpen={sidebarMobileOpen}
          onCloseMobile={() => setSidebarMobileOpen(false)}
        />

        {/* Center Workspace Content */}
        <main className="flex-1 flex flex-col md:flex-row overflow-hidden">
          {activeSidebarTab === 'unit-tests' ? (
            <div className="flex-1 overflow-y-auto">
              <UnitTestsPanel
                tests={unitTests}
                onAddTest={(newTest) =>
                  setUnitTests((prev) => [
                    ...prev,
                    { ...newTest, id: `test-${Date.now()}` },
                  ])
                }
                onRemoveTest={(id) =>
                  setUnitTests((prev) => prev.filter((t) => t.id !== id))
                }
                onRunTests={handleRunUnitTests}
                pattern={pattern}
              />
            </div>
          ) : (
            <>
              {/* Left / Center Area: Regex Bar + Substitution + Test String Editor */}
              <div className="flex-1 flex flex-col border-r border-[#2e3646] overflow-hidden min-w-0">
                {/* Regular Expression Input Bar */}
                <RegexInputBar
                  pattern={pattern}
                  onChangePattern={setPattern}
                  flagsStr={flagsStr}
                  onOpenFlagsModal={() => setFlagsModalOpen(true)}
                  error={evaluation.error}
                />

                {/* Optional Substitution Pattern Bar */}
                {functionMode === 'substitution' && (
                  <SubstitutionBar
                    replacement={replacement}
                    onChangeReplacement={setReplacement}
                    substitutedResult={substitutionResult.result}
                    replacementsCount={substitutionResult.replacementsCount}
                  />
                )}

                {/* Test String Editor with Synchronized Real-Time Highlight Overlay */}
                <TestStringEditor
                  testString={testString}
                  onChangeTestString={setTestString}
                  matches={evaluation.matches}
                  executionTimeMs={evaluation.executionTimeMs}
                  stepCount={evaluation.stepCount}
                  hoveredMatchIndex={hoveredMatchIndex}
                  onHoverMatch={setHoveredMatchIndex}
                  onInsertSample={handleInsertSample}
                />
              </div>

              {/* Right Area: Tabs for Explanation / Match Info / Quick Reference */}
              <div className="w-full md:w-80 lg:w-96 bg-[#181b22] flex flex-col border-t md:border-t-0 md:border-l border-[#2e3646] shrink-0">
                {/* Right Panel Tab Bar */}
                <div className="h-11 border-b border-[#2e3646] bg-[#14171d] px-2 flex items-center gap-1 select-none overflow-x-auto">
                  <button
                    onClick={() => setRightPanelTab('matches')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors whitespace-nowrap ${
                      rightPanelTab === 'matches'
                        ? 'bg-[#1e222b] text-blue-400 border border-[#2e3646]'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <ListChecks className="w-3.5 h-3.5 text-blue-400" />
                    <span>Match Info ({evaluation.matches.length})</span>
                  </button>

                  <button
                    onClick={() => setRightPanelTab('explanation')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors whitespace-nowrap ${
                      rightPanelTab === 'explanation'
                        ? 'bg-[#1e222b] text-blue-400 border border-[#2e3646]'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <Code2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Explanation</span>
                  </button>

                  <button
                    onClick={() => setRightPanelTab('quick-ref')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors whitespace-nowrap ${
                      rightPanelTab === 'quick-ref'
                        ? 'bg-[#1e222b] text-blue-400 border border-[#2e3646]'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <HelpCircle className="w-3.5 h-3.5 text-amber-400" />
                    <span>Quick Ref</span>
                  </button>
                </div>

                {/* Right Panel Content */}
                <div className="flex-1 overflow-y-auto">
                  {rightPanelTab === 'matches' && (
                    <MatchInfoPanel
                      matches={evaluation.matches}
                      hoveredMatchIndex={hoveredMatchIndex}
                      onHoverMatch={setHoveredMatchIndex}
                      executionTimeMs={evaluation.executionTimeMs}
                    />
                  )}

                  {rightPanelTab === 'explanation' && (
                    <ExplanationPanel
                      nodes={explanationNodes}
                      pattern={pattern}
                    />
                  )}

                  {rightPanelTab === 'quick-ref' && (
                    <QuickReferencePanel onInsertToken={handleInsertToken} />
                  )}
                </div>
              </div>
            </>
          )}
        </main>
      </div>

      {/* Footer */}
      <Footer onOpenAbout={() => setAboutModalOpen(true)} />

      {/* Modals */}
      <FlagsModal
        isOpen={flagsModalOpen}
        onClose={() => setFlagsModalOpen(false)}
        flags={flags}
        onToggleFlag={handleToggleFlag}
      />

      <AboutModal
        isOpen={aboutModalOpen}
        onClose={() => setAboutModalOpen(false)}
      />

      <CodeGeneratorModal
        isOpen={codeGeneratorModalOpen}
        onClose={() => setCodeGeneratorModalOpen(false)}
        pattern={pattern}
        flagsStr={flagsStr}
        testString={testString}
        defaultFlavor={flavor}
      />

      <RegexLibraryModal
        isOpen={libraryModalOpen}
        onClose={() => setLibraryModalOpen(false)}
        onSelectPattern={handleSelectPattern}
      />
    </div>
  );
}
