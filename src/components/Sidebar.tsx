import React from 'react';
import {
  Code2,
  BookOpen,
  HelpCircle,
  CheckCircle2,
  FileCode2,
  Repeat,
  Info,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Settings,
  Flame,
} from 'lucide-react';

export type ActiveSidebarTab =
  | 'tester'
  | 'substitution'
  | 'unit-tests'
  | 'code-gen'
  | 'library'
  | 'quick-ref'
  | 'about';

interface SidebarProps {
  activeTab: ActiveSidebarTab;
  onSelectTab: (tab: ActiveSidebarTab) => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
  mobileOpen: boolean;
  onCloseMobile: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onSelectTab,
  collapsed,
  onToggleCollapse,
  mobileOpen,
  onCloseMobile,
}) => {
  const navItems = [
    {
      id: 'tester' as ActiveSidebarTab,
      label: 'Regex Tester',
      icon: Code2,
      badge: 'Core',
    },
    {
      id: 'substitution' as ActiveSidebarTab,
      label: 'Substitution',
      icon: Repeat,
    },
    {
      id: 'unit-tests' as ActiveSidebarTab,
      label: 'Unit Tests',
      icon: CheckCircle2,
    },
    {
      id: 'code-gen' as ActiveSidebarTab,
      label: 'Code Generator',
      icon: FileCode2,
    },
    {
      id: 'library' as ActiveSidebarTab,
      label: 'Regex Library',
      icon: BookOpen,
      badge: 'Popular',
    },
    {
      id: 'quick-ref' as ActiveSidebarTab,
      label: 'Quick Reference',
      icon: HelpCircle,
    },
    {
      id: 'about' as ActiveSidebarTab,
      label: 'About NexVora',
      icon: Info,
      highlight: true,
    },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 md:hidden"
          onClick={onCloseMobile}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed md:static inset-y-0 left-0 z-40 bg-[#181b22] border-r border-[#2e3646] flex flex-col transition-all duration-200 select-none ${
          collapsed ? 'w-16' : 'w-56'
        } ${mobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}
      >
        {/* Navigation List */}
        <div className="flex-1 py-4 px-2 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  onSelectTab(item.id);
                  onCloseMobile();
                }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-medium transition-all group relative ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-xs'
                    : item.highlight
                    ? 'text-blue-300 hover:bg-blue-500/10 hover:text-white'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-[#202531]'
                }`}
                title={collapsed ? item.label : undefined}
              >
                <Icon
                  className={`w-4 h-4 shrink-0 ${
                    isActive
                      ? 'text-white'
                      : item.highlight
                      ? 'text-blue-400'
                      : 'text-slate-400 group-hover:text-slate-200'
                  }`}
                />
                {!collapsed && (
                  <span className="truncate flex-1 text-left">{item.label}</span>
                )}
                {!collapsed && item.badge && !isActive && (
                  <span className="px-1.5 py-0.5 text-[9px] font-semibold rounded bg-[#202531] text-blue-400 border border-blue-500/20">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Developer & Company Credit Bar */}
        <div className="p-2 border-t border-[#2e3646] bg-[#14171d]">
          {!collapsed ? (
            <div
              onClick={() => onSelectTab('about')}
              className="p-2.5 rounded-lg bg-[#1a1f29] hover:bg-[#222938] border border-[#2a303d] cursor-pointer transition-colors"
            >
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0" />
                <span className="text-[11px] font-bold text-white truncate">
                  Prince AR Abdur Rahman
                </span>
              </div>
              <p className="text-[10px] text-slate-400 truncate mt-0.5">
                NexVora Lab&apos;s Ofc &bull; v1.0.0
              </p>
            </div>
          ) : (
            <button
              onClick={() => onSelectTab('about')}
              className="w-full flex items-center justify-center p-2 rounded-lg text-blue-400 hover:bg-[#202531]"
              title="About Developer Prince AR Abdur Rahman"
            >
              <Sparkles className="w-4 h-4" />
            </button>
          )}

          {/* Collapse/Expand Toggle on Desktop */}
          <button
            onClick={onToggleCollapse}
            className="hidden md:flex w-full items-center justify-center py-1.5 mt-2 rounded text-slate-500 hover:text-slate-300 hover:bg-[#202531] transition-colors text-xs"
            title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {collapsed ? (
              <ChevronRight className="w-4 h-4" />
            ) : (
              <div className="flex items-center gap-1">
                <ChevronLeft className="w-3.5 h-3.5" />
                <span className="text-[10px]">Collapse</span>
              </div>
            )}
          </button>
        </div>
      </aside>
    </>
  );
};
