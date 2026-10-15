import React from 'react';
import {
  LayoutDashboard,
  Home,
  Zap,
  BookOpen,
  Receipt,
  FileText,
  Settings,
  X
} from 'lucide-react';

export type NavTab =
  | 'dashboard'
  | 'rooms'
  | 'load-calculator'
  | 'knowledge'
  | 'billing'
  | 'reports'
  | 'settings';

interface SidebarProps {
  currentTab: NavTab;
  setCurrentTab: (tab: NavTab) => void;
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (val: boolean) => void;
  onOpenApkGuide?: () => void;
  counts: {
    customers: number;
    projects: number;
    rooms: number;
  };
}

export const NAV_ITEMS = [
  { id: 'dashboard' as NavTab, label: '১. ড্যাশবোর্ড', icon: LayoutDashboard },
  { id: 'rooms' as NavTab, label: '২. রুম তৈরি ও রুমের হিসাব', icon: Home, badgeKey: 'rooms' },
  { id: 'load-calculator' as NavTab, label: '৩. অটোমেটিক লোড ক্যালকুলেটর', icon: Zap },
  { id: 'knowledge' as NavTab, label: '৪. ইলেকট্রিক্যাল তথ্যভান্ডার', icon: BookOpen },
  { id: 'billing' as NavTab, label: '৫. কাজের খরচ ও বিল', icon: Receipt },
  { id: 'reports' as NavTab, label: '৬. রিপোর্ট ও PDF', icon: FileText },
  { id: 'settings' as NavTab, label: '৭. সেটিংস ও ব্যাকআপ', icon: Settings },
];

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  setCurrentTab,
  mobileMenuOpen,
  setMobileMenuOpen,
  counts
}) => {
  const handleSelect = (tab: NavTab) => {
    setCurrentTab(tab);
    setMobileMenuOpen(false);
  };

  const navContent = (
    <div className="flex flex-col h-full bg-slate-900 text-slate-200">
      {/* Header in sidebar */}
      <div className="p-4 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-amber-500 text-slate-950 flex items-center justify-center font-black">
            ⚡
          </div>
          <div>
            <div className="text-sm font-bold text-white tracking-wide">মেইন মেনু</div>
            <div className="text-[11px] text-amber-400">৭টি প্রধান বিভাগ</div>
          </div>
        </div>
        <button
          onClick={() => setMobileMenuOpen(false)}
          className="lg:hidden p-1.5 rounded-md text-slate-400 hover:text-white hover:bg-slate-800"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Navigation links */}
      <nav className="flex-1 overflow-y-auto px-2 py-3 space-y-1">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;
          const badgeCount = item.badgeKey ? (counts as any)[item.badgeKey] : undefined;

          return (
            <button
              key={item.id}
              onClick={() => handleSelect(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                isActive
                  ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/25'
                  : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-2.5 truncate">
                <Icon
                  className={`w-4 h-4 shrink-0 ${
                    isActive ? 'text-slate-950' : 'text-amber-400'
                  }`}
                />
                <span className="truncate">{item.label}</span>
              </div>
              {badgeCount !== undefined && badgeCount > 0 && (
                <span
                  className={`px-2 py-0.5 rounded-full text-[11px] font-bold ${
                    isActive
                      ? 'bg-slate-950 text-amber-400'
                      : 'bg-slate-800 text-amber-300 border border-slate-700'
                  }`}
                >
                  {badgeCount}
                </span>
              )}
            </button>
          );
        })}
      </nav>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:block w-72 shrink-0 border-r border-slate-200 dark:border-slate-800 h-[calc(100vh-4rem)] sticky top-16 z-20">
        {navContent}
      </aside>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="relative w-72 max-w-[85vw] h-full shadow-2xl z-10 animate-in slide-in-from-left duration-200">
            {navContent}
          </div>
        </div>
      )}
    </>
  );
};
