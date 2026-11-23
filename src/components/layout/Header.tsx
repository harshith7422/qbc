import React from 'react';
import { NavTab } from './Sidebar';
import { PlusCircle, Sliders, Calendar } from 'lucide-react';
import { formatINR } from '../../utils/formatCurrency';

interface HeaderProps {
  currentTab: NavTab;
  onNavigate: (tab: NavTab) => void;
  globalBaseRate: number;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  onNavigate,
  globalBaseRate,
}) => {
  const titles: Record<NavTab, { title: string; subtitle: string }> = {
    dashboard: {
      title: 'Studio Dashboard',
      subtitle: 'Performance metrics, quotation pipelines, and recent projects',
    },
    create: {
      title: 'Quotation Maker',
      subtitle: 'Build custom modular & turnkey interior proposals',
    },
    history: {
      title: 'Quotation History',
      subtitle: 'Manage saved proposals, client revisions, and generated contracts',
    },
    pricing: {
      title: 'Master Pricing & Room Catalog',
      subtitle: 'Configure base sq.ft rates, room categories, and finishes',
    },
    settings: {
      title: 'Studio Configuration',
      subtitle: 'Legal details, terms & conditions, and payment schedule templates',
    },
    preview: {
      title: 'Quotation Customer Preview',
      subtitle: 'Verified customer-facing 3-column quotation presentation',
    },
  };

  const currentDate = new Date().toLocaleDateString('en-IN', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  const { title, subtitle } = titles[currentTab] || titles.dashboard;

  return (
    <header className="no-print bg-white border-b border-stone-border/80 sticky top-0 z-20 px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-subtle">
      {/* Title & Subtitle */}
      <div>
        <h1 className="text-xl font-bold font-serif text-brand-950 tracking-tight flex items-center gap-2.5">
          {title}
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-3 self-end sm:self-auto">
        {/* Global Rate Pill */}
        <button
          onClick={() => onNavigate('pricing')}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-stone-warm hover:bg-stone-200/70 border border-stone-border text-xs text-slate-700 transition group"
          title="Click to view/edit Master Pricing"
        >
          <Sliders className="w-3.5 h-3.5 text-accent-gold" />
          <span className="text-slate-500 hidden md:inline">Base Rate:</span>
          <span className="font-semibold text-brand-900 font-mono">
            {formatINR(globalBaseRate)}
            <span className="text-[10px] text-slate-500 font-normal"> /sq.ft</span>
          </span>
        </button>

        {/* Date Chip */}
        <div className="hidden lg:flex items-center gap-1.5 text-xs text-slate-500 px-3 py-1.5 rounded-lg bg-stone-50 border border-stone-border/60">
          <Calendar className="w-3.5 h-3.5 text-slate-400" />
          <span>{currentDate}</span>
        </div>

        {/* Primary CTA */}
        {currentTab !== 'create' && (
          <button
            onClick={() => onNavigate('create')}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-brand-900 hover:bg-brand-800 text-white text-xs font-semibold shadow-sm transition hover:shadow-md"
          >
            <PlusCircle className="w-3.5 h-3.5 text-accent-gold" />
            <span>New Quotation</span>
          </button>
        )}
      </div>
    </header>
  );
};
