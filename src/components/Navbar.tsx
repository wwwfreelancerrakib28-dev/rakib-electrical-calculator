import React from 'react';
import { 
  Zap, 
  Moon, 
  Sun, 
  Menu, 
  Plus, 
  Building2
} from 'lucide-react';
import { Project } from '../types';

interface NavbarProps {
  darkMode: boolean;
  setDarkMode: (val: boolean) => void;
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (val: boolean) => void;
  projects: Project[];
  activeProjectId: string | null;
  setActiveProjectId: (id: string) => void;
  onOpenQuickAction: (actionType?: 'customer' | 'project' | 'room' | 'calc') => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  darkMode,
  setDarkMode,
  mobileMenuOpen,
  setMobileMenuOpen,
  projects,
  activeProjectId,
  setActiveProjectId,
  onOpenQuickAction,
  searchQuery,
  setSearchQuery
}) => {
  const activeProject = projects.find((p) => p.id === activeProjectId);

  return (
    <header className="sticky top-0 z-30 bg-white/95 dark:bg-slate-900/95 backdrop-blur border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 h-16 flex items-center justify-between gap-2 sm:gap-4">
        
        {/* Left: Mobile hamburger & Brand */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
            aria-label="মেনু খুলুন"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 text-white flex items-center justify-center shadow-md shadow-amber-500/20">
              <Zap className="w-6 h-6 fill-white" />
            </div>
            <div className="hidden xs:block">
              <h1 className="text-base sm:text-lg font-bold tracking-tight text-slate-900 dark:text-white leading-none">
                Rakib <span className="text-amber-500">Electrical</span>
              </h1>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium mt-0.5">
                ক্যালকুলেটর ও ওয়্যারিং ম্যানেজার
              </p>
            </div>
          </div>
        </div>

        {/* Center: Active Project Selector */}
        <div className="hidden md:flex items-center gap-2 max-w-xs xl:max-w-md w-full">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-50 dark:bg-amber-950/40 border border-amber-200/80 dark:border-amber-900/50 text-xs text-amber-900 dark:text-amber-300 w-full">
            <Building2 className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
            <span className="font-semibold shrink-0">বর্তমান প্রজেক্ট:</span>
            <select
              value={activeProjectId || ''}
              onChange={(e) => setActiveProjectId(e.target.value)}
              className="bg-transparent font-medium focus:outline-none w-full truncate cursor-pointer text-slate-800 dark:text-slate-200"
            >
              {projects.map((p) => (
                <option key={p.id} value={p.id} className="dark:bg-slate-900">
                  {p.name} ({p.customerName})
                </option>
              ))}
              {projects.length === 0 && <option value="">কোনো প্রজেক্ট নেই</option>}
            </select>
          </div>
        </div>

        {/* Right: Quick Actions & Theme Toggle */}
        <div className="flex items-center gap-1.5 sm:gap-2">

          {/* Quick Action Button */}
          <button
            onClick={() => onOpenQuickAction()}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-amber-500 hover:bg-amber-600 active:scale-95 text-slate-950 font-bold text-xs sm:text-sm shadow-sm transition-all"
            title="নতুন কাস্টমার, প্রজেক্ট বা রুম যোগ করুন"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span className="hidden sm:inline">নতুন এন্ট্রি</span>
            <span className="sm:hidden">নতুন</span>
          </button>

          {/* Dark Mode Toggle */}
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title={darkMode ? 'লাইট মোডে পরিবর্তন করুন' : 'ডার্ক মোডে পরিবর্তন করুন'}
            aria-label="ডার্ক মোড টগল"
          >
            {darkMode ? (
              <Sun className="w-5 h-5 text-amber-400" />
            ) : (
              <Moon className="w-5 h-5 text-slate-700" />
            )}
          </button>
        </div>

      </div>
    </header>
  );
};
