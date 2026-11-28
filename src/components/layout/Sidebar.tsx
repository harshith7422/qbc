import React from 'react';
import { 
  LayoutDashboard, 
  FilePlus2, 
  FileText, 
  Layers, 
  SlidersHorizontal,
  ChevronRight,
  Sparkles
} from 'lucide-react';
import { Logo } from '../common/Logo';

export type NavTab = 'dashboard' | 'create' | 'history' | 'pricing' | 'settings' | 'preview';

interface SidebarProps {
  currentTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  quotationCount?: number;
  draftCount?: number;
  tagline?: string;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onSelectTab,
  draftCount = 0,
  tagline,
}) => {
  const navItems = [
    {
      id: 'dashboard' as NavTab,
      label: 'Dashboard',
      icon: LayoutDashboard,
      badge: null,
      desc: 'Overview & metrics'
    },
    {
      id: 'create' as NavTab,
      label: 'Create Quotation',
      icon: FilePlus2,
      badge: 'New',
      badgeColor: 'bg-accent-gold/20 text-amber-900 border border-accent-gold/30',
      desc: 'Calculate & generate'
    },
    {
      id: 'history' as NavTab,
      label: 'Quotation History',
      icon: FileText,
      badge: draftCount > 0 ? `${draftCount} drafts` : null,
      badgeColor: 'bg-amber-100 text-amber-800',
      desc: 'Archive & proposals'
    },
    {
      id: 'pricing' as NavTab,
      label: 'Master Pricing',
      icon: Layers,
      badge: 'Admin',
      badgeColor: 'bg-brand-100 text-brand-900',
      desc: 'Room & rate catalog'
    },
    {
      id: 'settings' as NavTab,
      label: 'Settings',
      icon: SlidersHorizontal,
      badge: null,
      desc: 'Studio terms & info'
    },
  ];

  return (
    <aside className="no-print w-64 lg:w-72 bg-brand-950 text-slate-200 flex flex-col shrink-0 min-h-screen border-r border-brand-900/60 transition-all select-none">
      {/* Brand Header */}
      <div className="p-4 border-b border-brand-900/80">
        <div className="bg-white rounded-2xl p-3 shadow-sm border border-stone-100">
          <Logo variant="dark" size="sm" tagline={tagline} />
        </div>
        <div className="mt-3 pt-2.5 flex items-center justify-between text-[11px] text-slate-400 px-1">
          <span className="flex items-center gap-1.5 font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            Internal Portal
          </span>
          <span className="text-[10px] uppercase font-mono tracking-wider text-slate-500">v1.2 Studio</span>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-3 py-6 space-y-1.5 overflow-y-auto">
        <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-slate-300">
          Main Workspace
        </div>

        {navItems.map((item) => {
          const isActive = currentTab === item.id || (item.id === 'history' && currentTab === 'preview');
          const Icon = item.icon;

          return (
            <button
              key={item.id}
              onClick={() => onSelectTab(item.id)}
              className={`w-full text-left flex items-center justify-between px-3.5 py-3 rounded-xl transition-all duration-150 group relative ${
                isActive
                  ? 'bg-brand-800/90 text-white font-medium shadow-md shadow-black/20 border border-brand-700/60'
                  : 'text-slate-300 hover:text-white hover:bg-brand-900/60'
              }`}
            >
              {isActive && (
                <div className="absolute left-0 top-2 bottom-2 w-1 bg-accent-gold rounded-r" />
              )}

              <div className="flex items-center gap-3">
                <div
                  className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
                    isActive
                      ? 'bg-accent-gold text-brand-950 shadow-sm'
                      : 'bg-brand-900 text-slate-300 group-hover:text-white group-hover:bg-brand-800'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-semibold leading-tight">{item.label}</div>
                  <div className="text-[10px] text-slate-400 line-clamp-1">{item.desc}</div>
                </div>
              </div>

              <div className="flex items-center gap-1.5">
                {item.badge && (
                  <span
                    className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${item.badgeColor}`}
                  >
                    {item.badge}
                  </span>
                )}
                <ChevronRight
                  className={`w-3.5 h-3.5 transition-transform ${
                    isActive ? 'text-accent-gold translate-x-0.5' : 'text-slate-600 group-hover:text-slate-400'
                  }`}
                />
              </div>
            </button>
          );
        })}
      </nav>

      {/* Pro-Tip / Studio Assistant Card */}
      <div className="p-4 m-3 rounded-2xl bg-brand-900/50 border border-brand-800/60 text-xs">
        <div className="flex items-center gap-2 text-accent-gold font-medium mb-1">
          <Sparkles className="w-3.5 h-3.5 text-accent-gold" />
          <span>Internal Reference</span>
        </div>
        <p className="text-[11px] text-slate-300 leading-relaxed">
          Base calculation prices are never exposed on customer PDF exports or print views.
        </p>
      </div>

      {/* Studio Location Footer */}
      <div className="p-4 border-t border-brand-900/80 text-[11px] text-slate-300">
        <div className="font-medium text-slate-200">HSR Layout Studio</div>
        <div className="text-[10px] text-slate-400">Bengaluru, Karnataka</div>
      </div>
    </aside>
  );
};
