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
  Zap,
  Plus,
  Trash2,
  Edit2
} from 'lucide-react';
import { AppState, AppSettings, CatalogDevice } from '../types';
import { exportDataAsJSON, importDataFromJSON, saveStateToStorage } from '../utils/storage';
import { SAMPLE_CUSTOMERS, SAMPLE_PROJECTS } from '../data/sampleData';

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

  // Custom Devices State aligned with CatalogDevice type
  const [customDevices, setCustomDevices] = useState<CatalogDevice[]>(
    state.customDevices || [
      { id: '1', name: 'সিলিং ফ্যান', defaultWatts: 75, defaultPowerFactor: 0.9, isHeavyLoad: false, category: 'ফ্যান', notes: '' },
      { id: '2', name: 'LED লাইট', defaultWatts: 20, defaultPowerFactor: 0.9, isHeavyLoad: false, category: 'লাইট', notes: '' },
      { id: '3', name: 'ফ্রিজ', defaultWatts: 250, defaultPowerFactor: 0.85, isHeavyLoad: false, category: 'অ্যাপ্লায়েন্স', notes: '' },
      { id: '4', name: 'এসি (1.5 Ton)', defaultWatts: 1800, defaultPowerFactor: 0.85, isHeavyLoad: true, category: 'এসি', notes: '' }
    ]
  );

  const [newDeviceName, setNewDeviceName] = useState('');
  const [newDeviceWatts, setNewDeviceWatts] = useState('');
  const [newDeviceCat, setNewDeviceCat] = useState('সাধারণ');
  const [newDeviceHeavy, setNewDeviceHeavy] = useState(false);

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    const updatedState: AppState = {
      ...state,
      settings,
      customDevices
    };
    onUpdateState(updatedState);
    saveStateToStorage(updatedState);
    setSaveSuccessMsg('সেটিংস ও ডিভাইস তালিকা সফলভাবে সংরক্ষিত হয়েছে!');
    setTimeout(() => setSaveSuccessMsg(''), 3000);
  };

  const handleAddDevice = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDeviceName || !newDeviceWatts) return;

    const newItem: CatalogDevice = {
      id: `cdev-${Date.now()}`,
      name: newDeviceName,
      defaultWatts: Number(newDeviceWatts),
      defaultPowerFactor: 0.85,
      isHeavyLoad: newDeviceHeavy,
      category: newDeviceCat,
      notes: ''
    };

    const updatedDevices = [...customDevices, newItem];
    setCustomDevices(updatedDevices);
    setNewDeviceName('');
    setNewDeviceWatts('');
    setNewDeviceHeavy(false);

    const updatedState: AppState = {
      ...state,
      customDevices: updatedDevices
    };
    onUpdateState(updatedState);
    saveStateToStorage(updatedState);
    setSaveSuccessMsg('নতুন ডিভাইস সফলভাবে যোগ করা হয়েছে!');
    setTimeout(() => setSaveSuccessMsg(''), 3000);
  };

  const handleDeleteDevice = (id: string) => {
    const updatedDevices = customDevices.filter(d => d.id !== id);
    setCustomDevices(updatedDevices);

    const updatedState: AppState = {
      ...state,
      customDevices: updatedDevices
    };
    onUpdateState(updatedState);
    saveStateToStorage(updatedState);
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
        if (res.newState.customDevices) {
          setCustomDevices(res.newState.customDevices);
        }
        setImportStatusMsg({ type: 'success', msg: res.message });
      } else {
        setImportStatusMsg({ type: 'error', msg: res.message });
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const handleResetToSampleData = () => {
    if (window.confirm('আপনি কি নিশ্চিতভাবে নমুনা ডেটা লোড করতে চান?')) {
      const sampleState: AppState = {
        ...state,
        customers: SAMPLE_CUSTOMERS,
        projects: SAMPLE_PROJECTS,
        activeCustomerId: SAMPLE_CUSTOMERS[0].id,
        activeProjectId: SAMPLE_PROJECTS[0].id,
        settings: { ...settings, theme: darkMode ? 'dark' : 'light' },
        customDevices: customDevices,
        customMaterials: state.customMaterials
      };
      onUpdateState(sampleState);
      saveStateToStorage(sampleState);
      setImportStatusMsg({ type: 'success', msg: 'নমুনা ডেটা সফলভাবে লোড হয়েছে!' });
    }
  };

  const handleClearAllData = () => {
    if (window.confirm('সাবধান! সমস্ত ডেটা মুছে নতুন করে শুরু করতে চান?')) {
      const emptyState: AppState = {
        ...state,
        customers: [],
        projects: [],
        activeCustomerId: null,
        activeProjectId: null,
        settings,
        customDevices,
        customMaterials: []
      };
      onUpdateState(emptyState);
      saveStateToStorage(emptyState);
      setImportStatusMsg({ type: 'success', msg: 'সমস্ত ডেটা মুছে ফেলা হয়েছে।' });
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <h1 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Settings className="w-5 h-5 text-amber-500" />
          <span>সেটিংস ও ডিভাইস ম্যানেজমেন্ট কন্ট্রোল</span>
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          আপনার প্রফেশনাল প্রোফাইল, নিজস্ব ডিভাইস ওয়াট লিস্ট এডিট/যোগ এবং ডেটা ব্যাকআপ
        </p>
      </div>

      {/* Messages */}
      {saveSuccessMsg && (
        <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs flex items-center gap-2">
          <Check className="w-4 h-4 shrink-0" />
          <span>{saveSuccessMsg}</span>
        </div>
      )}

      {importStatusMsg && (
        <div className={`p-3 rounded-xl border text-xs flex items-center gap-2 ${
          importStatusMsg.type === 'success' 
            ? 'bg-emerald-50 text-emerald-800 border-emerald-300' 
            : 'bg-red-50 text-red-800 border-red-300'
        }`}>
          <span>{importStatusMsg.msg}</span>
        </div>
      )}

      {/* Main Control Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        
        {/* Left: Electrician Profile & Theme (6 Cols) */}
        <div className="lg:col-span-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm space-y-4">
          <h2 className="text-sm font-bold text-slate-900 dark:text-white pb-2 border-b border-slate-100 dark:border-slate-800 flex items-center gap-2">
            <UserCheck className="w-4 h-4 text-amber-500" />
            <span>প্রোফাইল ও থিম সেটিংস</span>
          </h2>

          <form onSubmit={handleSaveSettings} className="space-y-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                আপনার নাম ও পদবি (ইনভয়েসে দৃশ্যমান হবে)
              </label>
              <input
                type="text"
                required
                value={settings.contractorName}
                onChange={(e) => setSettings({ ...settings, contractorName: e.target.value })}
                className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">মোবাইল নম্বর</label>
                <input
                  type="text"
                  value={settings.phone}
                  onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
                  className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">ঠিকানা</label>
                <input
                  type="text"
                  value={settings.address}
                  onChange={(e) => setSettings({ ...settings, address: e.target.value })}
                  className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>
            </div>

            {/* Theme Toggle */}
            <div className="pt-2">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">থিম মোড</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setDarkMode(false);
                    setSettings({ ...settings, theme: 'light' });
                  }}
                  className={`py-2 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 ${
                    !darkMode ? 'bg-amber-500 text-slate-950 border-amber-500' : 'bg-slate-800 text-slate-300 border-slate-700'
                  }`}
                >
                  <Sun className="w-4 h-4 text-amber-500" />
                  <span>লাইট মোড</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setDarkMode(true);
                    setSettings({ ...settings, theme: 'dark' });
                  }}
                  className={`py-2 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 ${
                    darkMode ? 'bg-amber-500 text-slate-950 border-amber-500' : 'bg-slate-800 text-slate-300 border-slate-700'
                  }`}
                >
                  <Moon className="w-4 h-4 text-white" />
                  <span>ডার্ক মোড</span>
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs shadow transition-all mt-3"
            >
              প্রোফাইল সেভ করুন
            </button>
          </form>
        </div>

        {/* Right: Data Backup & Reset (6 Cols) */}
        <div className="lg:col-span-6 space-y-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm space-y-3">
            <h2 className="text-sm font-bold text-slate-900 dark:text-white pb-2 border-b border-slate-100 dark:border-slate-800 flex items-center gap-2">
              <Database className="w-4 h-4 text-amber-500" />
              <span>ডেটা ব্যাকআপ ও পুনরুদ্ধার</span>
            </h2>

            <button
              onClick={handleExportBackup}
              className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center justify-center gap-2"
            >
              <Download className="w-4 h-4" />
              <span>সম্পূর্ণ ডেটা ব্যাকআপ ডাউনলোড (JSON)</span>
            </button>

            <label className="w-full py-2.5 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900 text-blue-700 dark:text-blue-300 font-bold text-xs flex items-center justify-center gap-2 cursor-pointer">
              <Upload className="w-4 h-4" />
              <span>ব্যাকআপ ফাইল থেকে রিস্টোর করুন</span>
              <input type="file" accept=".json" onChange={handleFileUpload} className="hidden" />
            </label>

            <div className="pt-2 flex gap-2">
              <button
                onClick={handleResetToSampleData}
                className="flex-1 py-2 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 text-amber-900 dark:text-amber-300 font-bold text-xs"
              >
                নমুনা ডেটা লোড
              </button>
              <button
                onClick={handleClearAllData}
                className="flex-1 py-2 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 text-red-600 font-semibold text-xs"
              >
                সব মুছুন
              </button>
            </div>
          </div>
        </div>

      </div>

      {/* DYNAMIC CUSTOM DEVICE & WATT MANAGER */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-amber-400/50 p-5 shadow-sm space-y-4">
        <h2 className="text-sm font-bold text-slate-900 dark:text-white pb-2 border-b border-slate-100 dark:border-slate-800 flex items-center gap-2">
          <Zap className="w-4 h-4 text-amber-500" />
          <span>কাস্টম ডিভাইস ও ওয়াট কন্ট্রোল প্যানেল (নিজের মতো যোগ ও ডিলিট করুন)</span>
        </h2>

        {/* Add New Device Form */}
        <form onSubmit={handleAddDevice} className="grid grid-cols-1 sm:grid-cols-4 gap-3 bg-slate-50 dark:bg-slate-800/50 p-3 rounded-xl border border-slate-200 dark:border-slate-700">
          <div>
            <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">ডিভাইসের নাম</label>
            <input
              type="text"
              required
              placeholder="যেমন: গিজার / মোটর"
              value={newDeviceName}
              onChange={(e) => setNewDeviceName(e.target.value)}
              className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
            />
          </div>
          <div>
            <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">ওয়াট (Watts)</label>
            <input
              type="number"
              required
              placeholder="যেমন: ১৫০০"
              value={newDeviceWatts}
              onChange={(e) => setNewDeviceWatts(e.target.value)}
              className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
            />
          </div>
          <div>
            <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">ক্যাটাগরি</label>
            <input
              type="text"
              value={newDeviceCat}
              onChange={(e) => setNewDeviceCat(e.target.value)}
              className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
            />
          </div>
          <div className="flex items-end">
            <button
              type="submit"
              className="w-full py-1.5 rounded-lg bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs flex items-center justify-center gap-1 shadow"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>ডিভাইস যোগ করুন</span>
            </button>
          </div>
        </form>

        {/* Existing Devices List with Delete Option */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700 dark:text-slate-300">
            <thead className="bg-slate-100 dark:bg-slate-800 text-slate-500 uppercase text-[10px]">
              <tr>
                <th className="p-2.5">ডিভাইসের নাম</th>
                <th className="p-2.5">ওয়াট (Watts)</th>
                <th className="p-2.5">ক্যাটাগরি</th>
                <th className="p-2.5 text-right">অ্যাকশন</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {customDevices.map((device) => (
                <tr key={device.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                  <td className="p-2.5 font-bold text-slate-900 dark:text-white">{device.name}</td>
                  <td className="p-2.5 font-bold text-amber-600">{device.defaultWatts} W</td>
                  <td className="p-2.5">
                    <span className="px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-700 text-[10px]">{device.category}</span>
                  </td>
                  <td className="p-2.5 text-right">
                    <button
                      onClick={() => handleDeleteDevice(device.id)}
                      className="px-2 py-1 rounded bg-red-50 hover:bg-red-100 text-red-600 font-bold text-[11px] flex items-center gap-1 ml-auto"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>ডিলিট</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>

    </div>
  );
};
