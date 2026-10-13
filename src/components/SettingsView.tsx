import React, { useState } from 'react';
import { 
  Settings, 
  Database, 
  Download, 
  Upload, 
  RotateCcw, 
  Check, 
  AlertTriangle, 
  Sparkles, 
  Moon, 
  Sun,
  UserCheck,
  ShieldCheck,
  Info,
  Zap,
  Cable
} from 'lucide-react';
import { AppState, AppSettings } from '../types';
import { exportDataAsJSON, importDataFromJSON, saveStateToStorage } from '../utils/storage';
import { SAMPLE_CUSTOMERS, SAMPLE_PROJECTS, INITIAL_SETTINGS } from '../data/sampleData';

interface SettingsViewProps {
  state: AppState;
  onUpdateState: (newState: AppState) => void;
  darkMode: boolean;
  setDarkMode: (val: boolean) => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  state,
  onUpdateState,
  darkMode,
  setDarkMode
}) => {
  const [settings, setSettings] = useState<AppSettings>(state.settings);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState('');
  const [importStatusMsg, setImportStatusMsg] = useState<{ type: 'success' | 'error'; msg: string } | null>(null);

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    const updatedState: AppState = {
      ...state,
      settings
    };
    onUpdateState(updatedState);
    saveStateToStorage(updatedState);
    setSaveSuccessMsg('সেটিংস সফলভাবে সংরক্ষিত হয়েছে!');
    setTimeout(() => setSaveSuccessMsg(''), 3000);
  };

  const handleExportBackup = () => {
    exportDataAsJSON(state);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      const res = importDataFromJSON(content, state);
      if (res.success && res.newState) {
        onUpdateState(res.newState);
        setImportStatusMsg({ type: 'success', msg: res.message });
      } else {
        setImportStatusMsg({ type: 'error', msg: res.message });
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const handleResetToSampleData = () => {
    if (
      window.confirm(
        'আপনি কি নিশ্চিতভাবে নমুনা (Demo) ডুপ্লেক্স বাড়ির ডেটা লোড করতে চান? আপনার বর্তমান তথ্যগুলো প্রতিস্থাপিত হবে।'
      )
    ) {
      const sampleState: AppState = {
        customers: SAMPLE_CUSTOMERS,
        projects: SAMPLE_PROJECTS,
        activeCustomerId: SAMPLE_CUSTOMERS[0].id,
        activeProjectId: SAMPLE_PROJECTS[0].id,
        settings: { ...settings, theme: darkMode ? 'dark' : 'light' },
        customDevices: state.customDevices,
        customMaterials: state.customMaterials
      };
      onUpdateState(sampleState);
      saveStateToStorage(sampleState);
      setImportStatusMsg({
        type: 'success',
        msg: 'নমুনা ডেটা সফলভাবে লোড হয়েছে!'
      });
    }
  };

  const handleClearAllData = () => {
    if (
      window.confirm(
        'সাবধান! আপনি কি সত্যিই সমস্ত কাস্টমার, প্রজেক্ট ও হিসাব মুছে সম্পূর্ণ নতুনভাবে শুরু করতে চান?'
      )
    ) {
      const emptyState: AppState = {
        customers: [],
        projects: [],
        activeCustomerId: null,
        activeProjectId: null,
        settings,
        customDevices: state.customDevices,
        customMaterials: state.customMaterials
      };
      onUpdateState(emptyState);
      saveStateToStorage(emptyState);
      setImportStatusMsg({
        type: 'success',
        msg: 'সমস্ত ডেটা মুছে ক্লিন স্লেট তৈরি করা হয়েছে।'
      });
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <h1 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Settings className="w-5 h-5 text-amber-500" />
          <span>সেটিংস ও ওয়্যারিং ক্যালকুলেশন গাইড</span>
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          আপনার প্রফেশনাল প্রোফাইল, ডিভাইস ওয়াট স্ট্যান্ডার্ড এবং অফলাইন ডেটা সংরক্ষণ ও পুনরুদ্ধার
        </p>
      </div>

      {/* Messages */}
      {saveSuccessMsg && (
        <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs flex items-center gap-2 animate-in fade-in">
          <Check className="w-4 h-4 shrink-0" />
          <span>{saveSuccessMsg}</span>
        </div>
      )}

      {importStatusMsg && (
        <div
          className={`p-3 rounded-xl border text-xs flex items-center gap-2 animate-in fade-in ${
            importStatusMsg.type === 'success'
              ? 'bg-emerald-50 dark:bg-emerald-950/50 border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300'
              : 'bg-red-50 dark:bg-red-950/50 border-red-300 dark:border-red-800 text-red-800 dark:text-red-300'
          }`}
        >
          {importStatusMsg.type === 'success' ? (
            <Check className="w-4 h-4 shrink-0" />
          ) : (
            <AlertTriangle className="w-4 h-4 shrink-0" />
          )}
          <span>{importStatusMsg.msg}</span>
        </div>
      )}

      {/* Grid: Left Settings Profile vs Right Backup & Restore */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        
        {/* Left: Electrician Profile & Defaults (7 Cols) */}
        <div className="lg:col-span-7 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm space-y-4">
          <h2 className="text-sm font-bold text-slate-900 dark:text-white pb-2 border-b border-slate-100 dark:border-slate-800 flex items-center gap-2">
            <UserCheck className="w-4 h-4 text-amber-500" />
            <span>ইলেকট্রিশিয়ান প্রোফাইল ও বিলিং হেডার</span>
          </h2>

          <form onSubmit={handleSaveSettings} className="space-y-3.5">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                আপনার নাম ও পদবি (ইনভয়েসে দৃশ্যমান হবে)
              </label>
              <input
                type="text"
                required
                value={settings.electricianName}
                onChange={(e) => setSettings({ ...settings, electricianName: e.target.value })}
                className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  মোবাইল নম্বর
                </label>
                <input
                  type="text"
                  required
                  value={settings.electricianPhone}
                  onChange={(e) => setSettings({ ...settings, electricianPhone: e.target.value })}
                  className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  ঠিকানা বা কর্মক্ষেত্র
                </label>
                <input
                  type="text"
                  value={settings.electricianAddress}
                  onChange={(e) => setSettings({ ...settings, electricianAddress: e.target.value })}
                  className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  ডিফল্ট সিঙ্গেল ফেজ ভোল্টেজ
                </label>
                <select
                  value={settings.defaultVoltageSinglePhase}
                  onChange={(e) =>
                    setSettings({ ...settings, defaultVoltageSinglePhase: Number(e.target.value) })
                  }
                  className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                >
                  <option value={220}>২২০ ভোল্ট (স্ট্যান্ডার্ড)</option>
                  <option value={230}>২৩০ ভোল্ট</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  ডিফল্ট থ্রি ফেজ ভোল্টেজ
                </label>
                <select
                  value={settings.defaultVoltageThreePhase}
                  onChange={(e) =>
                    setSettings({ ...settings, defaultVoltageThreePhase: Number(e.target.value) })
                  }
                  className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                >
                  <option value={400}>৪০০ ভোল্ট (স্ট্যান্ডার্ড)</option>
                  <option value={415}>৪১৫ ভোল্ট</option>
                </select>
              </div>
            </div>

            {/* Theme Toggle in Settings */}
            <div className="pt-2">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
                ইউজার ইন্টারফেস থিম
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setDarkMode(false)}
                  className={`py-2 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                    !darkMode
                      ? 'bg-amber-500 text-slate-950 border-amber-500 shadow-sm'
                      : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                  }`}
                >
                  <Sun className="w-4 h-4 text-amber-500" />
                  <span>লাইট মোড (Light)</span>
                </button>

                <button
                  type="button"
                  onClick={() => setDarkMode(true)}
                  className={`py-2 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                    darkMode
                      ? 'bg-amber-500 text-slate-950 border-amber-500 shadow-sm'
                      : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                  }`}
                >
                  <Moon className="w-4 h-4 text-slate-800 dark:text-white" />
                  <span>ডার্ক মোড (Dark)</span>
                </button>
              </div>
            </div>

            <div className="pt-3">
              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2"
              >
                <Check className="w-4 h-4 stroke-[3]" />
                <span>প্রোফাইল সেটিংস সেভ করুন</span>
              </button>
            </div>
          </form>
        </div>

        {/* Right: Data Backup, JSON Export/Import & Reset (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          
          {/* Backup Box */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm space-y-3">
            <h2 className="text-sm font-bold text-slate-900 dark:text-white pb-2 border-b border-slate-100 dark:border-slate-800 flex items-center gap-2">
              <Database className="w-4 h-4 text-amber-500" />
              <span>ডেটা ব্যাকআপ ও এক্সপোর্ট</span>
            </h2>

            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              আপনার তৈরি করা সকল কাস্টমার, প্রজেক্ট, রুম ও বিলের সম্পূর্ণ ব্যাকআপ একটি নিরাপদ <strong>.JSON</strong> ফাইল হিসেবে ডাউনলোড করে ফোনে বা ড্রাইভে রেখে দিন।
            </p>

            <button
              onClick={handleExportBackup}
              className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition-all flex items-center justify-center gap-2 shadow"
            >
              <Download className="w-4 h-4" />
              <span>সম্পূর্ণ ডেটা ব্যাকআপ ডাউনলোড (JSON)</span>
            </button>
          </div>

          {/* Restore Box */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm space-y-3">
            <h2 className="text-sm font-bold text-slate-900 dark:text-white pb-2 border-b border-slate-100 dark:border-slate-800 flex items-center gap-2">
              <Upload className="w-4 h-4 text-blue-500" />
              <span>ব্যাকআপ থেকে ডেটা পুনরুদ্ধার (Import)</span>
            </h2>

            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              আগে ডাউনলোড করা ব্যাকআপ ফাইল নির্বাচন করে পুনরায় সমস্ত ডেটা এই ডিভাইসে ফিরিয়ে আনুন:
            </p>

            <label className="w-full py-2.5 rounded-xl bg-blue-50 dark:bg-blue-950/40 hover:bg-blue-100 dark:hover:bg-blue-900/40 border border-blue-200 dark:border-blue-900 text-blue-700 dark:text-blue-300 font-bold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer">
              <Upload className="w-4 h-4" />
              <span>JSON ব্যাকআপ ফাইল নির্বাচন করুন</span>
              <input
                type="file"
                accept=".json,application/json"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>
          </div>

          {/* Sample Data & Reset Box */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm space-y-3">
            <h2 className="text-sm font-bold text-slate-900 dark:text-white pb-2 border-b border-slate-100 dark:border-slate-800 flex items-center gap-2">
              <RotateCcw className="w-4 h-4 text-rose-500" />
              <span>নমুনা ডেটা ও ফ্যাক্টরি রিসেট</span>
            </h2>

            <div className="space-y-2">
              <button
                onClick={handleResetToSampleData}
                className="w-full py-2 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/50 text-amber-900 dark:text-amber-300 font-bold text-xs transition-all flex items-center justify-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>নমুনা ডুপ্লেক্স বাড়ির ডেটা লোড করুন</span>
              </button>

              <button
                onClick={handleClearAllData}
                className="w-full py-2 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/40 text-red-600 dark:text-red-400 font-semibold text-xs transition-all hover:bg-red-100"
              >
                সমস্ত ডেটা মুছে নতুন করে শুরু করুন
              </button>
            </div>
          </div>

        </div>

      </div>

      {/* SECRET & PROFESSIONAL WIRING / WATT CALCULATION GUIDE SECTION */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-amber-400/50 p-5 shadow-sm space-y-4">
        <h2 className="text-sm font-bold text-slate-900 dark:text-white pb-2 border-b border-slate-100 dark:border-slate-800 flex items-center gap-2">
          <Zap className="w-4 h-4 text-amber-500" />
          <span>গোপন গাইড: স্ট্যান্ডার্ড ডিভাইস ওয়াট ও তারের সাইজ (Rm / mm²) চার্ট</span>
        </h2>

        <p className="text-xs text-slate-500 dark:text-slate-400">
          রুম বা প্রজেক্টে হিসাব করার সময় কোন অ্যাপ্লায়েন্সে কত ওয়াট ধরা হয় এবং কত অ্যাম্পিয়ারে কোন তার লাগবে তার প্রফেশনাল স্ট্যান্ডার্ড চার্ট:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          
          {/* Default Watts Table */}
          <div className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden">
            <div className="bg-slate-100 dark:bg-slate-800 p-2.5 font-bold text-slate-700 dark:text-slate-300">
              ডিভাইস ওয়াট স্ট্যান্ডার্ড তালিকা
            </div>
            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              <div className="p-2.5 flex justify-between"><span>সিলিং ফ্যান / টেবিল ফ্যান</span><strong className="text-amber-600">৭৫ W</strong></div>
              <div className="p-2.5 flex justify-between"><span>LED লাইট / টিউব লাইট</span><strong className="text-amber-600">১৫ - ২০ W</strong></div>
              <div className="p-2.5 flex justify-between"><span>এলইডি টিভি (LED TV)</span><strong className="text-amber-600">১০০ - ১২০ W</strong></div>
              <div className="p-2.5 flex justify-between"><span>রেফ্রিজারেটর / ফ্রিজ</span><strong className="text-amber-600">২০০ - ২৫০ W</strong></div>
              <div className="p-2.5 flex justify-between"><span>এয়ার কন্ডিশনার (১ টন / ১.৫ টন / ২ টন)</span><strong className="text-amber-600">১২০০ - ২৪০০ W</strong></div>
              <div className="p-2.5 flex justify-between"><span>পানির মোটর (১ হর্সপাওয়ার)</span><strong className="text-amber-600">৭৪৬ W</strong></div>
            </div>
          </div>

          {/* Wire & Breaker Guide Table */}
          <div className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden">
            <div className="bg-slate-100 dark:bg-slate-800 p-2.5 font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <Cable className="w-3.5 h-3.5 text-blue-500" />
              <span>তারের সাইজ (Rm / mm²) ও ব্রেকার গাইড</span>
            </div>
            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              <div className="p-2.5 flex justify-between"><span>লাইট ও ফ্যান সার্কিট (৫ অ্যাম্পিয়ার পর্যন্ত)</span><strong className="text-blue-600">1.3 Rm (1.0 mm²) / 6A MCB</strong></div>
              <div className="p-2.5 flex justify-between"><span>সাধারণ সকেট / টিভি লাইন (১০ অ্যাম্পিয়ার)</span><strong className="text-blue-600">1.5 Rm (1.5 mm²) / 10A MCB</strong></div>
              <div className="p-2.5 flex justify-between"><span>হেভি সকেট / ফ্রিজ / ওয়াটার হিটার (১৫-২০A)</span><strong className="text-blue-600">2.5 Rm (2.5 mm²) / 16A/20A MCB</strong></div>
              <div className="p-2.5 flex justify-between"><span>এসি (Air Conditioner) / সাব-মেইন লাইন</span><strong className="text-blue-600">4.0 mm² / 25A MCB</strong></div>
              <div className="p-2.5 flex justify-between"><span>মেইন ইনকামিং লাইন (সম্পূর্ণ বাড়ি)</span><strong className="text-blue-600">6.0 mm² বা তদূর্ধ্ব / 32A-63A</strong></div>
            </div>
          </div>

        </div>
      </div>

    </div>
  );
};
