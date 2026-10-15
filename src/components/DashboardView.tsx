import React from 'react';
import { 
  Users, 
  Building2, 
  ArrowRight, 
  AlertTriangle,
  Zap,
  Sparkles,
  Layers
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

  const activeProject: Project | undefined = projects.find((p) => p.id === activeProjectId) || projects[0];

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
    <div className="space-y-5 animate-in fade-in duration-300">
        
      {/* COMPACT SINGLE-LINE STYLISH INFO BAR (Replacing 4 Big Cards) */}
      <div className="p-3.5 sm:p-4 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900 to-amber-950/40 border border-amber-500/30 shadow-lg flex items-center justify-between gap-3 flex-wrap text-xs">
        <div className="flex items-center gap-3 sm:gap-5 flex-wrap">
          <div 
            onClick={() => onNavigateTo('customers')}
            className="flex items-center gap-1.5 cursor-pointer group"
          >
            <span className="p-1 rounded-lg bg-blue-500/20 text-blue-400">
              <Users className="w-3.5 h-3.5" />
            </span>
            <span className="text-slate-400">কাস্টমার:</span>
            <strong className="text-white group-hover:text-amber-400 transition-colors">{totalCustomers} জন</strong>
          </div>

          <span className="text-slate-700">|</span>

          <div 
            onClick={() => onNavigateTo('projects')}
            className="flex items-center gap-1.5 cursor-pointer group"
          >
            <span className="p-1 rounded-lg bg-amber-500/20 text-amber-400">
              <Building2 className="w-3.5 h-3.5" />
            </span>
            <span className="text-slate-400">প্রজেক্ট:</span>
            <strong className="text-white group-hover:text-amber-400 transition-colors">{totalProjects}টি ({totalRooms} রুম)</strong>
          </div>

          <span className="text-slate-700">|</span>

          <div 
            onClick={() => onNavigateTo('materials')}
            className="flex items-center gap-1.5 cursor-pointer group"
          >
            <span className="p-1 rounded-lg bg-emerald-500/20 text-emerald-400">
              <Sparkles className="w-3.5 h-3.5" />
            </span>
            <span className="text-slate-400">মালামাল খরচ:</span>
            <strong className="text-emerald-400">{formatTaka(totalMaterialsCost)}</strong>
          </div>

          <span className="text-slate-700">|</span>

          <div 
            onClick={() => onNavigateTo('billing')}
            className="flex items-center gap-1.5 cursor-pointer group"
          >
            <span className="p-1 rounded-lg bg-rose-500/20 text-rose-400">
              <AlertTriangle className="w-3.5 h-3.5" />
            </span>
            <span className="text-slate-400">বকেয়া:</span>
            <strong className="text-rose-400">{formatTaka(totalDueAmount)}</strong>
          </div>
        </div>
      </div>

      {/* Active Project Modern & Romantic Styled Card */}
      {activeProject && activeCalc && (
        <div className="p-5 sm:p-6 rounded-3xl bg-slate-900/90 border border-amber-500/40 shadow-2xl space-y-4 relative overflow-hidden backdrop-blur-xl">
          <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

          {/* Header & Quick Room List Option Moved to Top */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-800 gap-3">
            <div>
              <div className="flex items-center gap-2.5 flex-wrap">
                <h2 className="text-lg sm:text-xl font-black text-white tracking-tight">
                  {activeProject.name}
                </h2>
                <span className="px-3 py-0.5 rounded-full text-[11px] font-extrabold bg-amber-500 text-slate-950 shadow-sm">
                  {activeProject.phase}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                কাস্টমার: {activeProject.customerName} • {activeProject.address}
              </p>
            </div>

            {/* ROOM LIST BUTTON MOVED TO TOP AS REQUESTED */}
            <div className="flex items-center gap-2 flex-wrap">
              <button
                onClick={() => onNavigateTo('rooms')}
                className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs transition-all active:scale-95 shadow-lg shadow-amber-500/20 flex items-center gap-1.5"
              >
                <Layers className="w-4 h-4" />
                <span>রুম তালিকা ({activeProject.rooms.length})</span>
              </button>
              <button
                onClick={() => onNavigateTo('billing')}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs transition-all border border-slate-700"
              >
                বিলিং ও ইনভয়েস
              </button>
            </div>
          </div>

          {/* Rooms Preview Cards (Stylish Grid) */}
          <div className="pt-2">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-amber-400" />
                <span>প্রজেক্টের রুমসমূহ:</span>
              </span>
              <button
                onClick={() => onOpenQuickAction('room')}
                className="text-xs font-bold text-amber-400 hover:underline flex items-center gap-1"
              >
                <span>+ নতুন রুম যোগ করুন</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {activeProject.rooms.map((room) => (
                <div
                  key={room.id}
                  onClick={() => onNavigateTo('rooms')}
                  className="p-3.5 rounded-2xl bg-slate-800/60 border border-slate-700/80 hover:border-amber-500 hover:bg-slate-800 transition-all cursor-pointer group shadow-sm"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white group-hover:text-amber-400 transition-colors truncate">
                      {room.name}
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-900 text-amber-300 border border-slate-700 font-semibold">
                      {room.type}
                    </span>
                  </div>
                  <div className="mt-3 text-xs text-slate-400 flex items-center justify-between">
                    <span>{room.devices.length}টি ডিভাইস</span>
                    <span className="font-black font-mono text-amber-400">
                      {formatWatts(room.totalWatts)}
                    </span>
                  </div>
                </div>
              ))}
              {activeProject.rooms.length === 0 && (
                <div className="col-span-full py-6 text-center text-xs text-slate-500 bg-slate-800/30 rounded-2xl border border-dashed border-slate-700">
                  এখনও কোনো রুম যোগ করা হয়নি। উপরে "+ নতুন রুম যোগ করুন" বাটনে ক্লিক করুন।
                </div>
              )}
            </div>
          </div>

        </div>
      )}

      {/* Projects List Overview */}
      <div className="p-5 sm:p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Building2 className="w-5 h-5 text-amber-400" />
            <h2 className="text-base sm:text-lg font-black text-white">
              সকল প্রজেক্টের তালিকা
            </h2>
          </div>
          <button
            onClick={() => onNavigateTo('projects')}
            className="text-xs font-bold text-amber-400 hover:underline flex items-center gap-1"
          >
            <span>সব দেখুন</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-800/80 text-slate-400 uppercase text-[10px] tracking-wider rounded-xl">
              <tr>
                <th className="p-3">প্রজেক্ট ও ঠিকানা</th>
                <th className="p-3">কাস্টমার</th>
                <th className="p-3">ফেজ</th>
                <th className="p-3">রুম</th>
                <th className="p-3">মোট লোড</th>
                <th className="p-3">মোট বিল</th>
                <th className="p-3">বাকি</th>
                <th className="p-3 text-right">অ্যাকশন</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {projects.map((proj) => {
                const projWatts = proj.rooms.reduce((sum, r) => sum + r.totalWatts, 0);
                const isCurrent = proj.id === activeProjectId;

                return (
                  <tr 
                    key={proj.id} 
                    className={`hover:bg-slate-800/50 transition-colors ${
                      isCurrent ? 'bg-amber-500/10' : ''
                    }`}
                  >
                    <td className="p-3 font-semibold text-white">
                      <div className="flex items-center gap-1.5">
                        {isCurrent && <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>}
                        <span>{proj.name}</span>
                      </div>
                      <div className="text-[11px] font-normal text-slate-400">{proj.address}</div>
                    </td>
                    <td className="p-3 font-medium">{proj.customerName}</td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 rounded bg-slate-800 text-[11px] text-amber-300 border border-slate-700">
                        {proj.phase.includes('3-Phase') ? '3-Phase' : '1-Phase'}
                      </span>
                    </td>
                    <td className="p-3 font-medium">{proj.rooms.length}টি</td>
                    <td className="p-3 font-bold font-mono text-amber-400">
                      {formatWatts(projWatts)}
                    </td>
                    <td className="p-3 font-bold">{formatTaka(proj.costing.totalBill)}</td>
                    <td className="p-3 font-bold text-rose-400">
                      {formatTaka(proj.costing.dueAmount)}
                    </td>
                    <td className="p-3 text-right">
                      <button
                        onClick={() => {
                          onSelectProject(proj.id);
                          onNavigateTo('rooms');
                        }}
                        className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-[11px] transition-all shadow active:scale-95"
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
