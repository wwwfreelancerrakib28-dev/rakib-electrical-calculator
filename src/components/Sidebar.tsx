import React from 'react';
import { 
  Zap, 
  BookOpen, 
  DollarSign, 
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
  setMobileMenuOpen: (open: boolean) => void;
  onOpenApkGuide: () => void;
  counts: {
    customers: number;
    projects: number;
    rooms: number;
  };
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  setCurrentTab,
  mobileMenuOpen,
  setMobileMenuOpen,
}) => {
  // ড্যাশবোর্ড ও রুম তৈরি বাদ দিয়ে বাকি ৫টি কার্যকরী ট্যাব
  const menuItems: { id: NavTab; label: string; icon: React.ReactNode; num: string }[] = [
    { 
      id: 'load-calculator', 
      label: 'অটোমেটিক লোড ক্যালকুলেটর', 
      icon: <Zap className="w-4 h-4" />, 
      num: '১.' 
    },
    { 
      id: 'knowledge', 
      label: 'ইলেকট্রিক্যাল তথ্যভান্ডার', 
      icon: <BookOpen className="w-4 h-4" />, 
      num: '২.' 
    },
    { 
      id: 'billing', 
      label: 'কাজের খরচ ও বিল', 
      icon: <DollarSign className="w-4 h-4" />, 
      num: '৩.' 
    },
    { 
      id: 'reports', 
      label: 'রিপোর্ট ও PDF', 
      icon: <FileText className="w-4 h-4" />, 
      num: '৪.' 
    },
    { 
      id: 'settings', 
      label: 'সেটিংস ও ব্যাকআপ', 
      icon: <Settings className="w-4 h-4" />, 
      num: '৫.' 
    },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileMenuOpen && (
        <div 
          onClick={() => setMobileMenuOpen(false)}
          className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-40 lg:hidden animate-in fade-in"
        />
      )}

      {/* Sidebar Container */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-50
        w-72 bg-slate-900 border-r border-slate-800
        flex flex-col transition-transform duration-300 ease-in-out
        ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Sidebar Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500 text-slate-950 flex items-center justify-center font-black shadow-lg shadow-amber-500/20">
              ⚡
            </div>
            <div>
              <h2 className="text-sm font-black text-white tracking-tight">মেইন মেনু</h2>
              <p className="text-[10px] text-amber-400 font-bold uppercase tracking-wider">৫টি প্রধান বিভাগ</p>
            </div>
          </div>
          <button 
            onClick={() => setMobileMenuOpen(false)}
            className="lg:hidden p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Menu List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-1.5">
          {menuItems.map((item) => {
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setCurrentTab(item.id);
                  setMobileMenuOpen(false);
                }}
                className={`
                  w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-bold transition-all
                  ${isActive 
                    ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/20 scale-[1.02]' 
                    : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
                  }
                `}
              >
                <span className={`p-2 rounded-xl ${isActive ? 'bg-slate-950/10 text-slate-950' : 'bg-slate-800 text-amber-400'}`}>
                  {item.icon}
                </span>
                <span className="flex-1 text-left truncate">
                  <span className="opacity-70 mr-1.5">{item.num}</span>
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>

        {/* Sidebar Footer Info */}
        <div className="p-4 m-4 rounded-2xl bg-slate-800/50 border border-slate-700/60 text-center space-y-1">
          <p className="text-[11px] font-bold text-slate-300">ইলেকট্রিক্যাল ক্যালকুলেটর</p>
          <p className="text-[10px] text-slate-500">ভার্সন ১.০.০</p>
        </div>
      </aside>
    </>
  );
};
