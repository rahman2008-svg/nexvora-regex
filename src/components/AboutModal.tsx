import React from 'react';
import {
  X,
  User,
  Building2,
  Phone,
  Facebook,
  Instagram,
  ShieldCheck,
  Code2,
  Sparkles,
  Smartphone,
  ExternalLink,
  Heart,
  Copy,
  Check,
} from 'lucide-react';

interface AboutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AboutModal: React.FC<AboutModalProps> = ({ isOpen, onClose }) => {
  const [copiedPhone, setCopiedPhone] = React.useState<string | null>(null);

  if (!isOpen) return null;

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedPhone(label);
    setTimeout(() => setCopiedPhone(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-2xl bg-[#1e222b] border border-[#2e3646] rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#2e3646] bg-[#181b22]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-linear-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-white font-bold text-sm shadow-md">
              (.\*)
            </div>
            <div>
              <h2 className="text-lg font-bold text-white tracking-wide">NexVora Regex</h2>
              <p className="text-xs text-slate-400">Version 1.0.0 &bull; Built with Precision</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-[#2c323d] transition-colors"
            title="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-6 overflow-y-auto space-y-6 text-sm text-slate-300">
          {/* About Developer Section */}
          <div className="bg-[#181b22]/70 border border-[#2a303d] rounded-xl p-5 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-2xl pointer-events-none" />
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400 shrink-0">
                <User className="w-6 h-6" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-white">About Developer</h3>
                  <span className="px-2 py-0.5 text-[10px] font-semibold bg-blue-500/20 text-blue-300 rounded border border-blue-500/30">
                    Lead Creator
                  </span>
                </div>
                <h4 className="text-sm font-semibold text-blue-400 mt-1">
                  Prince AR Abdur Rahman
                </h4>
                <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                  Independent App Developer passionate about building modern Android applications,
                  productivity tools, AI-powered experiences, media players, educational apps, and
                  next-generation digital products.
                </p>

                {/* Developer Contacts */}
                <div className="mt-4 pt-3 border-t border-[#2a303d] space-y-2">
                  <div className="text-xs font-semibold text-slate-400 flex items-center gap-1.5 uppercase tracking-wider">
                    <Phone className="w-3.5 h-3.5 text-emerald-400" />
                    Direct Contact & WhatsApp
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
                    {/* WhatsApp 1 */}
                    <div className="flex items-center justify-between p-2.5 bg-[#1e222b] border border-[#2e3646] rounded-lg">
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                        <div>
                          <div className="text-[11px] text-slate-400">WhatsApp 1</div>
                          <a
                            href="https://wa.me/8801707424006"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-mono text-xs text-emerald-400 hover:underline font-semibold"
                          >
                            01707424006
                          </a>
                        </div>
                      </div>
                      <button
                        onClick={() => copyToClipboard('01707424006', 'wa1')}
                        className="p-1.5 text-slate-400 hover:text-white hover:bg-[#2c323d] rounded transition-colors"
                        title="Copy number"
                      >
                        {copiedPhone === 'wa1' ? (
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>

                    {/* WhatsApp 2 */}
                    <div className="flex items-center justify-between p-2.5 bg-[#1e222b] border border-[#2e3646] rounded-lg">
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                        <div>
                          <div className="text-[11px] text-slate-400">WhatsApp 2</div>
                          <a
                            href="https://wa.me/8801796951709"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-mono text-xs text-emerald-400 hover:underline font-semibold"
                          >
                            01796951709
                          </a>
                        </div>
                      </div>
                      <button
                        onClick={() => copyToClipboard('01796951709', 'wa2')}
                        className="p-1.5 text-slate-400 hover:text-white hover:bg-[#2c323d] rounded transition-colors"
                        title="Copy number"
                      >
                        {copiedPhone === 'wa2' ? (
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Social Handles */}
                  <div className="flex flex-wrap gap-2 pt-2">
                    <a
                      href="https://www.facebook.com/share/1BNn32qoJo/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#1877f2]/10 hover:bg-[#1877f2]/20 border border-[#1877f2]/30 text-[#1877f2] rounded-lg text-xs font-medium transition-colors"
                    >
                      <Facebook className="w-3.5 h-3.5" />
                      <span>Facebook Profile</span>
                      <ExternalLink className="w-3 h-3 opacity-70" />
                    </a>
                    <a
                      href="https://www.instagram.com/ur___abdur____rahman__2008"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-3 py-1.5 bg-pink-500/10 hover:bg-pink-500/20 border border-pink-500/30 text-pink-400 rounded-lg text-xs font-medium transition-colors"
                    >
                      <Instagram className="w-3.5 h-3.5" />
                      <span>Instagram (@ur___abdur____rahman__2008)</span>
                      <ExternalLink className="w-3 h-3 opacity-70" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* About Company Section */}
          <div className="bg-[#181b22]/70 border border-[#2a303d] rounded-xl p-5 relative overflow-hidden">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400 shrink-0">
                <Building2 className="w-6 h-6" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-white">About Company</h3>
                  <span className="px-2 py-0.5 text-[10px] font-semibold bg-purple-500/20 text-purple-300 rounded border border-purple-500/30">
                    Publisher
                  </span>
                </div>
                <h4 className="text-sm font-semibold text-purple-400 mt-1">
                  NexVora Lab&apos;s Ofc
                </h4>
                <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                  NexVora Lab&apos;s Ofc focuses on creating innovative Android applications designed to
                  improve productivity, entertainment, learning, and digital experiences.
                </p>

                {/* Company Mission */}
                <div className="mt-3.5 p-3 bg-purple-950/20 border border-purple-800/30 rounded-lg">
                  <div className="text-[11px] font-bold text-purple-300 flex items-center gap-1.5 uppercase tracking-wider mb-1">
                    <Sparkles className="w-3 h-3" />
                    Mission Statement
                  </div>
                  <p className="text-xs text-slate-200 italic">
                    &ldquo;Build fast, beautiful, privacy-friendly, and user-focused applications
                    accessible to everyone.&rdquo;
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Technical Info & Credits */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Technical Information */}
            <div className="p-4 bg-[#181b22]/70 border border-[#2a303d] rounded-xl space-y-2">
              <div className="text-xs font-semibold text-slate-400 flex items-center gap-1.5 uppercase tracking-wider">
                <Code2 className="w-3.5 h-3.5 text-blue-400" />
                Technical Information
              </div>
              <div className="space-y-1 text-xs">
                <div className="flex justify-between py-1 border-b border-[#2e3646]">
                  <span className="text-slate-400">Version:</span>
                  <span className="font-mono font-semibold text-white">1.0.0</span>
                </div>
                <div className="flex justify-between py-1 border-b border-[#2e3646]">
                  <span className="text-slate-400">Engine:</span>
                  <span className="font-mono text-emerald-400">ECMAScript &amp; PCRE2 Emulation</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-400">Platform:</span>
                  <span className="text-slate-200">Web Responsive &amp; Mobile Ready</span>
                </div>
              </div>
            </div>

            {/* Credits */}
            <div className="p-4 bg-[#181b22]/70 border border-[#2a303d] rounded-xl space-y-2">
              <div className="text-xs font-semibold text-slate-400 flex items-center gap-1.5 uppercase tracking-wider">
                <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                Credits &amp; Rights
              </div>
              <div className="space-y-1 text-xs text-slate-300">
                <p>
                  <span className="text-slate-400">Developed by:</span>{' '}
                  <strong className="text-white">Prince AR Abdur Rahman</strong>
                </p>
                <p>
                  <span className="text-slate-400">Published by:</span>{' '}
                  <strong className="text-white">NexVora Lab&apos;s Ofc</strong>
                </p>
                <p className="text-[11px] text-slate-400 pt-1 font-mono">
                  &copy; 2026 NexVora Lab&apos;s Ofc. All Rights Reserved.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-[#2e3646] bg-[#181b22] flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs text-slate-400">
            <span>Made with</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
            <span>by Prince AR Abdur Rahman</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold transition-colors shadow-sm"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
