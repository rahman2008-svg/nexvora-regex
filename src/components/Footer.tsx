import React from 'react';
import { Heart, Facebook, Instagram, Phone, ExternalLink } from 'lucide-react';

interface FooterProps {
  onOpenAbout: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenAbout }) => {
  return (
    <footer className="border-t border-[#2e3646] bg-[#14171d] px-4 py-3 text-xs text-slate-400 select-none">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3 text-center md:text-left">
        {/* Developer & Company Info */}
        <div className="flex flex-wrap items-center justify-center md:justify-start gap-x-2 gap-y-1">
          <button
            onClick={onOpenAbout}
            className="font-bold text-white hover:text-blue-400 transition-colors flex items-center gap-1.5"
          >
            <span>NexVora Regex</span>
            <span className="text-[10px] font-mono px-1 py-0.2 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20">
              v1.0.0
            </span>
          </button>
          <span>&bull;</span>
          <span>
            Developed by{' '}
            <button
              onClick={onOpenAbout}
              className="text-slate-200 hover:text-blue-400 font-semibold underline decoration-dotted"
            >
              Prince AR Abdur Rahman
            </button>
          </span>
          <span>&bull;</span>
          <span>
            Published by{' '}
            <strong className="text-slate-200">NexVora Lab&apos;s Ofc</strong>
          </span>
        </div>

        {/* Contact Links & Copyright */}
        <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2">
          {/* WhatsApp Direct Links */}
          <div className="flex items-center gap-2">
            <Phone className="w-3.5 h-3.5 text-emerald-400" />
            <a
              href="https://wa.me/8801707424006"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-emerald-400 font-mono text-[11px] transition-colors"
            >
              01707424006
            </a>
            <span>/</span>
            <a
              href="https://wa.me/8801796951709"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-emerald-400 font-mono text-[11px] transition-colors"
            >
              01796951709
            </a>
          </div>

          {/* Socials */}
          <div className="flex items-center gap-3">
            <a
              href="https://www.facebook.com/share/1BNn32qoJo/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#1877f2] flex items-center gap-1 transition-colors"
              title="Facebook Profile"
            >
              <Facebook className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Facebook</span>
            </a>
            <a
              href="https://www.instagram.com/ur___abdur____rahman__2008"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-pink-400 flex items-center gap-1 transition-colors"
              title="Instagram Profile"
            >
              <Instagram className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Instagram</span>
            </a>
          </div>

          <span className="text-[11px] text-slate-500 font-mono">
            &copy; 2026 NexVora Lab&apos;s Ofc.
          </span>
        </div>
      </div>
    </footer>
  );
};
