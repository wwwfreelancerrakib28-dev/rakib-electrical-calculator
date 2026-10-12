import React from 'react';
import { 
  Users, 
  Building2, 
  DoorOpen, 
  Briefcase, 
  CheckCircle2, 
  Banknote, 
  Zap, 
  Cable, 
  Plus, 
  ArrowRight, 
  AlertTriangle,
  Clock,
  Sparkles
} from 'lucide-react';
import { AppState, Project } from '../types';
import { formatTaka, formatWatts, formatAmps } from '../utils/numberFormat';
import { calculateElectricalLoad } from '../utils/electricalCalculations';

interface DashboardViewProps {
  state: AppState;
  onNavigateTo: (tab: any) => void;
  onSelectProject: (id: string) => void;
  onOpenQuickAction: (actionType?: 'customer' | 'project' | 'room' | 'calc') => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  state,
  onNavigateTo,
  onSelectProject,
  onOpenQuickAction
}) => {
  const { customers, projects, activeProjectId } = state;

  const totalCustomers = customers.length;
  const totalProjects = projects.length;
  const totalRooms = projects.reduce((sum, p) => sum + p.rooms.length, 0);

  const runningProjects = projects.filter((p) => p.status === 'চলমান').length;
  const completedProjects = projects.filter((p) => p.status === 'সম্পন্ন').length;

  const totalMaterialsCost = projects.reduce((sum, p) => sum + (p.costing.materialsCost || 0), 0);
  const totalDueAmount = projects.reduce((sum, p) => sum + (p.costing.dueAmount || 0), 0);
  const totalBilled = projects.reduce((sum, p) => sum + (p.costing.totalBill || 0), 0);

  const activeProject: Project | undefined = projects.find((p) => p.id === activeProjectId) || projects[0];

  // Active project calculations
  const activeProjectLoadWatts = activeProject
    ? activeProject.rooms.reduce((sum, r) => sum + r.totalWatts, 0)
    : 0;

  const activeCalc = activeProject
    ? calculateElectricalLoad({
        loadWatts: activeProjectLoadWatts,
        voltage: activeProject.voltage,
        isThreePhase: activeProject.phase.includes('3-Phase'),
        powerFactor: activeProject.powerFactor || 0.85,
        diversityFactor: activeProject.diversityFactor || 0.8,
        lengthMeters: 25,
        installationMethod: 'কন্ডুইট (Conduit in Wall)'
      })
    : null;

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-slate-800 to-amber-950 p-5 sm:p-7 text-white shadow-xl border border-amber-500/20">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-400/30 text-amber-300 text-xs font-semibold mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>প্রফেশনাল ইলেকট্রিক্যাল ম্যানেজমেন্ট স্যুট</span>
          </div>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold tracking-tight text-white mb-2">
            স্বাগতম, {state.settings.electricianName || 'রাকিব হাসান'}!
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            বাসাবাড়ির ওয়্যারিং, নির্ভুল লোড ক্যালকুলেশন, কপার কেবল সাইজ ও ব্রেকার নির্বাচন, মালামালের ক্রয়মূল্য এবং কাস্টমারের নিখুঁত বিল তৈরির সম্পূর্ণ সমাধান।
          </p>

          {/* Quick Action Shortcuts */}
          <div className="flex flex-wrap items-center gap-2.5 mt-5">
            <button
              onClick={() => onOpenQuickAction('customer')}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 active:scale-95 text-slate-950 font-bold text-xs shadow-md transition-all"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>নতুন কাস্টমার</span>
            </button>
            <button
              onClick={() => onOpenQuickAction('project')}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 active:scale-95 text-white font-bold text-xs shadow transition-all"
            >
              <Building2 className="w-4 h-4 text-amber-400" />
              <span>নতুন প্রজেক্ট</span>
            </button>
            <button
              onClick={() => onOpenQuickAction('room')}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 active:scale-95 text-white font-bold text-xs shadow transition-all"
            >
              <DoorOpen className="w-4 h-4 text-amber-400" />
              <span>নতুন রুম</span>
            </button>
            <button
              onClick={() => onNavigateTo('load-calculator')}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-400/40 text-amber-300 font-bold text-xs transition-all"
            >
              <Zap className="w-4 h-4" />
              <span>লোড ক্যালকুলেটর</span>
            </button>
          </div>
        </div>

        {/* Decorative background glow */}
        <div className="absolute right-0 top-0 bottom-0 w-80 bg-gradient-to-l from-amber-500/15 via-transparent to-transparent pointer-events-none" />
      </div>

      {/* Top 4 Primary Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        
        {/* Total Customers */}
        <div 
          onClick={() => onNavigateTo('customers')}
          className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md hover:border-amber-400 dark:hover:border-amber-500/50 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs sm:text-sm font-semibold text-slate-500 dark:text-slate-400">মোট কাস্টমার</span>
            <div className="w-9 h-9 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            {totalCustomers} <span className="text-xs font-normal text-slate-500">জন</span>
          </div>
          <div className="mt-2 text-[11px] text-blue-600 dark:text-blue-400 font-medium flex items-center gap-1">
            <span>প্রোফাইল তালিকা দেখুন</span>
            <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        {/* Total Projects & Rooms */}
        <div 
          onClick={() => onNavigateTo('projects')}
          className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md hover:border-amber-400 dark:hover:border-amber-500/50 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs sm:text-sm font-semibold text-slate-500 dark:text-slate-400">বাড়ি ও প্রজেক্ট</span>
            <div className="w-9 h-9 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Building2 className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            {totalProjects} <span className="text-xs font-normal text-slate-500">টি বাড়ি ({totalRooms} রুম)</span>
          </div>
          <div className="mt-2 text-[11px] text-amber-600 dark:text-amber-400 font-medium flex items-center gap-1">
            <span>চলমান {runningProjects}টি, সম্পন্ন {completedProjects}টি</span>
          </div>
        </div>

        {/* Material Cost */}
        <div 
          onClick={() => onNavigateTo('materials')}
          className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md hover:border-amber-400 dark:hover:border-amber-500/50 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs sm:text-sm font-semibold text-slate-500 dark:text-slate-400">মালামালের খরচ</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Banknote className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-emerald-600 dark:text-emerald-400">
            {formatTaka(totalMaterialsCost)}
          </div>
          <div className="mt-2 text-[11px] text-slate-500 dark:text-slate-400 font-medium flex items-center gap-1">
            <span>তার, ব্রেকার, পাইপ ও এক্সেসরিজ</span>
          </div>
        </div>

        {/* Total Due Amount */}
        <div 
          onClick={() => onNavigateTo('billing')}
          className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md hover:border-amber-400 dark:hover:border-amber-500/50 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs sm:text-sm font-semibold text-slate-500 dark:text-slate-400">বাকি বা বকেয়া বিল</span>
            <div className="w-9 h-9 rounded-xl bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <AlertTriangle className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-rose-600 dark:text-rose-400">
            {formatTaka(totalDueAmount)}
          </div>
          <div className="mt-2 text-[11px] text-rose-600 dark:text-rose-400 font-medium flex items-center gap-1">
            <span>মোট বিল {formatTaka(totalBilled)}</span>
          </div>
        </div>

      </div>

      {/* Active Project Live Electrical Overview */}
      {activeProject && activeCalc && (
        <div className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800 gap-2">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                  {activeProject.name}
                </h2>
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-amber-100 text-amber-800 dark:bg-amber-900/60 dark:text-amber-300">
                  {activeProject.phase}
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                কাস্টমার: {activeProject.customerName} • {activeProject.address}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => onNavigateTo('rooms')}
                className="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-xs font-semibold text-slate-700 dark:text-slate-300 transition-colors"
              >
                রুম তালিকা ({activeProject.rooms.length})
              </button>
              <button
                onClick={() => onNavigateTo('billing')}
                className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-600 text-xs font-bold text-slate-950 transition-colors"
              >
                বিলিং ও ইনভয়েস
              </button>
            </div>
          </div>

          {/* Quick Electrical Metrics for Active Project */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-4">
            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
              <div className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">মোট সংযুক্ত লোড</div>
              <div className="text-xl font-bold text-slate-900 dark:text-white mt-1">
                {formatWatts(activeProjectLoadWatts)}
              </div>
              <div className="text-[11px] text-slate-500 mt-0.5">
                {activeCalc.totalKW.toFixed(2)} kW ({activeCalc.totalKVA.toFixed(2)} kVA)
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
              <div className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">আনুমানিক মোট কারেন্ট</div>
              <div className="text-xl font-bold text-amber-600 dark:text-amber-400 mt-1">
                {formatAmps(activeCalc.operatingCurrentA)}
              </div>
              <div className="text-[11px] text-slate-500 mt-0.5">
                ডিজাইন কারেন্ট: {formatAmps(activeCalc.designCurrentA)}
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
              <div className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">প্রস্তাবিত মেইন তার</div>
              <div className="text-xl font-bold text-blue-600 dark:text-blue-400 mt-1 truncate">
                {activeCalc.recommendedCable.sizeMm2}
              </div>
              <div className="text-[11px] text-slate-500 mt-0.5 truncate">
                {activeCalc.recommendedCable.rmEquivalent}
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
              <div className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">প্রস্তাবিত মেইন ব্রেকার</div>
              <div className="text-xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">
                {activeCalc.recommendedBreakerRatingA}A {activeProject.phase.includes('3-Phase') ? 'TP' : 'DP'}
              </div>
              <div className="text-[11px] text-slate-500 mt-0.5">
                {activeCalc.recommendedBreakerCurve}
              </div>
            </div>
          </div>

          {/* Rooms Preview Cards */}
          <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                প্রজেক্টের রুমসমূহ ({activeProject.rooms.length}টি রুম তৈরি করা আছে)
              </span>
              <button
                onClick={() => onOpenQuickAction('room')}
                className="text-xs font-bold text-amber-600 dark:text-amber-400 hover:underline flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>নতুন রুম যোগ করুন</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {activeProject.rooms.map((room) => (
                <div
                  key={room.id}
                  onClick={() => onNavigateTo('rooms')}
                  className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/60 hover:border-amber-400 dark:hover:border-amber-500 transition-all cursor-pointer"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900 dark:text-white truncate">
                      {room.name}
                    </span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                      {room.type}
                    </span>
                  </div>
                  <div className="mt-2 text-xs text-slate-600 dark:text-slate-400 flex items-center justify-between">
                    <span>{room.devices.length}টি ডিভাইস</span>
                    <span className="font-bold text-amber-600 dark:text-amber-400">
                      {formatWatts(room.totalWatts)}
                    </span>
                  </div>
                </div>
              ))}
              {activeProject.rooms.length === 0 && (
                <div className="col-span-full py-4 text-center text-xs text-slate-500">
                  এখনও কোনো রুম যোগ করা হয়নি। উপরে "নতুন রুম যোগ করুন" বাটনে ক্লিক করুন।
                </div>
              )}
            </div>
          </div>

        </div>
      )}

      {/* Projects List Overview */}
      <div className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Building2 className="w-5 h-5 text-amber-500" />
            <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
              সকল প্রজেক্টের সংক্ষিপ্ত তালিকা
            </h2>
          </div>
          <button
            onClick={() => onNavigateTo('projects')}
            className="text-xs font-bold text-amber-600 dark:text-amber-400 hover:underline flex items-center gap-1"
          >
            <span>সব দেখুন</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700 dark:text-slate-300">
            <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 uppercase text-[10px] tracking-wider">
              <tr>
                <th className="p-3">প্রজেক্ট ও ঠিকানা</th>
                <th className="p-3">কাস্টমার</th>
                <th className="p-3">ফেজ ও তলা</th>
                <th className="p-3">রুম</th>
                <th className="p-3">মোট লোড</th>
                <th className="p-3">মোট বিল</th>
                <th className="p-3">বাকি</th>
                <th className="p-3 text-right">অ্যাকশন</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {projects.map((proj) => {
                const projWatts = proj.rooms.reduce((sum, r) => sum + r.totalWatts, 0);
                const isCurrent = proj.id === activeProjectId;

                return (
                  <tr 
                    key={proj.id} 
                    className={`hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors ${
                      isCurrent ? 'bg-amber-50/40 dark:bg-amber-950/20' : ''
                    }`}
                  >
                    <td className="p-3 font-semibold text-slate-900 dark:text-white">
                      <div className="flex items-center gap-1.5">
                        {isCurrent && <span className="w-2 h-2 rounded-full bg-amber-500"></span>}
                        <span>{proj.name}</span>
                      </div>
                      <div className="text-[11px] font-normal text-slate-500">{proj.address}</div>
                    </td>
                    <td className="p-3 font-medium">{proj.customerName}</td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-[11px]">
                        {proj.phase.includes('3-Phase') ? '3-Phase' : '1-Phase'} ({proj.floors} তলা)
                      </span>
                    </td>
                    <td className="p-3 font-medium">{proj.rooms.length}টি</td>
                    <td className="p-3 font-bold text-amber-600 dark:text-amber-400">
                      {formatWatts(projWatts)}
                    </td>
                    <td className="p-3 font-bold">{formatTaka(proj.costing.totalBill)}</td>
                    <td className="p-3 font-bold text-rose-600 dark:text-rose-400">
                      {formatTaka(proj.costing.dueAmount)}
                    </td>
                    <td className="p-3 text-right">
                      <button
                        onClick={() => {
                          onSelectProject(proj.id);
                          onNavigateTo('rooms');
                        }}
                        className="px-2.5 py-1 rounded-lg bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-[11px] transition-colors"
                      >
                        প্রবেশ করুন
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
