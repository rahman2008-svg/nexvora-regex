import React from 'react';
import { X, Copy, Check, Terminal, FileCode2 } from 'lucide-react';
import { RegexFlavor } from '../types/regex';
import { generateCode } from '../utils/regexParser';

interface CodeGeneratorModalProps {
  isOpen: boolean;
  onClose: () => void;
  pattern: string;
  flagsStr: string;
  testString: string;
  defaultFlavor: RegexFlavor;
}

const LANGUAGES: { id: RegexFlavor; name: string; ext: string }[] = [
  { id: 'javascript', name: 'JavaScript / Node.js', ext: 'js' },
  { id: 'python', name: 'Python 3 (re)', ext: 'py' },
  { id: 'golang', name: 'Golang (regexp)', ext: 'go' },
  { id: 'java', name: 'Java (util.regex)', ext: 'java' },
  { id: 'csharp', name: 'C# (.NET)', ext: 'cs' },
  { id: 'pcre2', name: 'PHP (PCRE2)', ext: 'php' },
  { id: 'rust', name: 'Rust (regex)', ext: 'rs' },
];

export const CodeGeneratorModal: React.FC<CodeGeneratorModalProps> = ({
  isOpen,
  onClose,
  pattern,
  flagsStr,
  testString,
  defaultFlavor,
}) => {
  const [selectedLang, setSelectedLang] = React.useState<RegexFlavor>(defaultFlavor);
  const [copied, setCopied] = React.useState(false);

  if (!isOpen) return null;

  const generatedCode = generateCode(
    pattern || 'pattern',
    flagsStr,
    testString || 'Sample test text',
    selectedLang
  );

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
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
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <FileCode2 className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Generate Code Snippet</h2>
              <p className="text-xs text-slate-400">
                Production-ready code tailored to your exact expression and flags
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

        {/* Languages Tabs */}
        <div className="px-6 pt-4 pb-2 border-b border-[#2e3646] bg-[#161a22] flex items-center gap-2 overflow-x-auto">
          {LANGUAGES.map((lang) => (
            <button
              key={lang.id}
              onClick={() => setSelectedLang(lang.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors flex items-center gap-1.5 ${
                selectedLang === lang.id
                  ? 'bg-emerald-600 text-white font-semibold shadow-xs'
                  : 'bg-[#202531] text-slate-400 hover:text-slate-200 hover:bg-[#282e3d]'
              }`}
            >
              <span>{lang.name}</span>
            </button>
          ))}
        </div>

        {/* Code Content */}
        <div className="p-6 overflow-y-auto flex-1 bg-[#13161c]">
          <pre className="font-mono text-xs text-emerald-300 leading-relaxed overflow-x-auto whitespace-pre selection:bg-emerald-500/30">
            {generatedCode}
          </pre>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-[#2e3646] bg-[#181b22] flex items-center justify-between">
          <span className="text-xs text-slate-400 font-mono">
            Format: /{pattern || 'pattern'}/{flagsStr}
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold transition-colors"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Copied to Clipboard!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Code</span>
                </>
              )}
            </button>
            <button
              onClick={onClose}
              className="px-4 py-1.5 bg-[#252c39] hover:bg-[#2e3646] text-slate-300 rounded-lg text-xs font-semibold transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
