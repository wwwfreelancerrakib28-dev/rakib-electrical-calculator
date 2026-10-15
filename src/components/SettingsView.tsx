import React, { useState } from 'react';
import { 
  Settings, 
  Zap, 
  Save,
  ShieldCheck,
  Plus,
  Trash2,
  Edit3
} from 'lucide-react';
import { AppState } from '../types';

interface SettingsViewProps {
  state: AppState;
  onUpdateState: React.Dispatch<React.SetStateAction<AppState>>;
  darkMode: boolean;
  setDarkMode: (dark: boolean) => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  state,
  onUpdateState
}) => {
  // Voltage & Safety state
  const [selectedVoltage, setSelectedVoltage] = useState<string>(
    String(state.settings?.defaultVoltage || '220')
  );
  const [safetyFactor, setSafetyFactor] = useState<string>(
    String(state.settings?.safetyFactor || '2.5')
  );

  // Device Management State
  const devicesList = state.customDevices || [
    { id: 'd1', name: 'LED লাইট (সাধারণ)', watt: 15, category: 'লাইট', count: 2 },
    { id: 'd2', name: 'LED টিউবলাইট', watt: 20, category: 'লাইট', count: 0 },
    { id: 'd3', name: 'সিলিং ফ্যান', watt: 75, category: 'ফ্যান', count: 1 },
    { id: 'd4', name: 'এক্সজস্ট ফ্যান', watt: 40, category: 'ফ্যান', count: 0 },
    { id: 'd5', name: 'টিভি (LED/Smart TV)', watt: 85, category: 'বিনোদন', count: 0 },
    { id: 'd6', name: 'রেফ্রিজারেটর / ফ্রিজ', watt: 200, category: 'হেভি অ্যাপ্লায়েন্স', count: 0 },
    { id: 'd7', name: 'রাইস কুকার', watt: 700, category: 'রান্নাঘর', count: 0 },
    { id: 'd8', name: 'এয়ার কন্ডিশনার (১ টন AC)', watt: 1200, category: 'ভারী লোড (এসি)', count: 0 },
  ];

  // New Device Form State
  const [newDevName, setNewDevName] = useState('');
  const [newDevWatt, setNewDevWatt] = useState('100');
  const [newDevCategory, setNewDevCategory] = useState('সাধারণ');

  // Editing State
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [editWatt, setEditWatt] = useState('');

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    
    onUpdateState(prev => ({
      ...prev,
      settings: {
        ...prev.settings,
        defaultVoltage: parseInt(selectedVoltage) || 220,
        safetyFactor: parseFloat(safetyFactor) || 2.5
      }
    }));

    alert(`সফলভাবে সেভ হয়েছে! ভোল্টেজ: ${selectedVoltage}V, সেফটি গুণিতক: ${safetyFactor}x`);
  };

  const handleAddDevice = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDevName.trim()) return;

    const newItem = {
      id: `dev-${Date.now()}`,
      name: newDevName,
      watt: parseInt(newDevWatt) || 100,
      category: newDevCategory,
      count: 0
    };

    const updatedDevices = [newItem, ...devicesList];
    onUpdateState(prev => ({ ...prev, customDevices: updatedDevices }));

    setNewDevName('');
    setNewDevWatt('100');
    alert('নতুন ডিভাইস সফলভাবে যুক্ত হয়েছে!');
  };

  const handleDeleteDevice = (id: string) => {
    const updatedDevices = devicesList.filter((d: any) => d.id !== id);
    onUpdateState(prev => ({ ...prev, customDevices: updatedDevices }));
  };

  const handleStartEdit = (dev: any) => {
    setEditingId(dev.id);
    setEditName(dev.name);
    setEditWatt(String(dev.watt));
  };

  const handleSaveEdit = (id: string) => {
    const updatedDevices = devicesList.map((d: any) => {
      if (d.id === id) {
        return {
          ...d,
          name: editName,
          watt: parseInt(editWatt) || d.watt
        };
      }
      return d;
    });

    onUpdateState(prev => ({ ...prev, customDevices: updatedDevices }));
    setEditingId(null);
  };

  return (
    <div className="space-y-6 animate-in duration-300 max-w-2xl mx-auto pb-12">
      
      {/* Settings Header */}
      <div className="p-4 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl flex items-center gap-3">
        <span className="p-2.5 rounded-2xl bg-amber-500/20 text-amber-400">
          <Settings className="w-6 h-6" />
        </span>
        <div>
          <h2 className="text-sm sm:text-base font-black text-white">
            সিস্টেম সেটিংস ও ডিভাইস কন্ট্রোল প্যানেল
          </h2>
          <p className="text-[11px] text-slate-400">
            ভোল্টেজ, সেফটি মার্জিন এবং হোম পেজের ডিভাইস লিস্ট কাস্টমাইজ করুন
          </p>
        </div>
      </div>

      {/* Voltage & Safety Form */}
      <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl space-y-6">
        
        <form onSubmit={handleSaveSettings} className="space-y-5">
          
          {/* Voltage Selection */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-amber-500/30 space-y-3">
            <label className="block text-xs font-black text-amber-400 flex items-center gap-1.5">
              <Zap className="w-4 h-4" />
              <span>সিস্টেম ভোল্টেজ সিলেক্ট করুন:</span>
            </label>

            <div className="grid grid-cols-3 gap-3">
              {['220', '230', '440'].map((vol) => {
                const isSelected = selectedVoltage === vol;
                return (
                  <button
                    key={vol}
                    type="button"
                    onClick={() => setSelectedVoltage(vol)}
                    className={`py-3 rounded-xl font-black text-xs transition-all border ${
                      isSelected 
                        ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-lg shadow-amber-500/20 scale-105' 
                        : 'bg-slate-900 text-slate-300 border-slate-700 hover:border-slate-500'
                    }`}
                  >
                    {vol} Volt
                  </button>
                );
              })}
            </div>
          </div>

          {/* Safety Multiplier */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-sky-500/30 space-y-3">
            <label className="block text-xs font-black text-sky-400 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4" />
              <span>তার ও ব্রেকার সুরক্ষার গুণিতক (Safety Multiplier):</span>
            </label>

            <div className="grid grid-cols-3 gap-3">
              {['2.0', '2.5', '3.0'].map((factor) => {
                const isSelected = safetyFactor === factor;
                return (
                  <button
                    key={factor}
                    type="button"
                    onClick={() => setSafetyFactor(factor)}
                    className={`py-3 rounded-xl font-black text-xs transition-all border ${
                      isSelected 
                        ? 'bg-sky-500 text-slate-950 border-sky-400 shadow-lg shadow-sky-500/20 scale-105' 
                        : 'bg-slate-900 text-slate-300 border-slate-700 hover:border-slate-500'
                    }`}
                  >
                    {factor} গুণ
                  </button>
                );
              })}
            </div>
          </div>

          <button 
            type="submit"
            className="w-full py-3.5 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs flex items-center justify-center gap-2 shadow-xl shadow-amber-500/20 transition-all"
          >
            <Save className="w-4 h-4" />
            <span>সেটিংস সেভ করুন</span>
          </button>

        </form>

      </div>

      {/* CUSTOM DEVICE & WATT CONTROL PANEL */}
      <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl space-y-5">
        <div className="border-b border-slate-800 pb-3">
          <h3 className="text-xs sm:text-sm font-black text-amber-400">
            ⚡ কাস্টম ডিভাইস ও ওয়াট কন্ট্রোল প্যানেল
          </h3>
          <p className="text-[10px] text-slate-400">এখানে নতুন ডিভাইস যোগ করুন অথবা ওয়াট এডিট/ডিলিট করুন, যা হোম পেজে শো করবে।</p>
        </div>

        {/* Add New Device Form */}
        <form onSubmit={handleAddDevice} className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
          <h4 className="text-xs font-bold text-white">+ নতুন ডিভাইস যোগ করুন</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <input 
              type="text" 
              value={newDevName}
              onChange={(e) => setNewDevName(e.target.value)}
              placeholder="ডিভাইসের নাম (যেমন: মোটর)"
              className="px-3.5 py-2.5 text-xs font-bold rounded-xl border border-slate-700 bg-slate-900 text-white focus:outline-none"
            />
            <input 
              type="number" 
              value={newDevWatt}
              onChange={(e) => setNewDevWatt(e.target.value)}
              placeholder="ওয়াট (যেমন: 1000)"
              className="px-3.5 py-2.5 text-xs font-bold rounded-xl border border-slate-700 bg-slate-900 text-white focus:outline-none"
            />
          </div>
          <button 
            type="submit"
            className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs flex items-center justify-center gap-1.5 shadow-lg"
          >
            <Plus className="w-4 h-4" />
            <span>তালিকায় যোগ করুন</span>
          </button>
        </form>

        {/* Device List with Edit & Delete */}
        <div className="space-y-2.5 max-h-96 overflow-y-auto pr-1">
          {devicesList.map((dev: any) => {
            const isEditing = editingId === dev.id;

            return (
              <div key={dev.id} className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between gap-3">
                {isEditing ? (
                  <div className="flex-1 flex gap-2 items-center">
                    <input 
                      type="text" 
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      className="flex-1 px-3 py-1.5 text-xs rounded-xl bg-slate-900 text-white border border-slate-700 font-bold"
                    />
                    <input 
                      type="number" 
                      value={editWatt}
                      onChange={(e) => setEditWatt(e.target.value)}
                      className="w-20 px-3 py-1.5 text-xs rounded-xl bg-slate-900 text-amber-400 border border-slate-700 font-black"
                    />
                    <button 
                      onClick={() => handleSaveEdit(dev.id)}
                      className="px-3 py-1.5 rounded-xl bg-emerald-600 text-white text-xs font-bold"
                    >
                      সেভ
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-black text-white">{dev.name}</span>
                        <span className="px-2 py-0.5 rounded-md bg-slate-900 text-[10px] font-bold text-amber-400">
                          {dev.category}
                        </span>
                      </div>
                      <p className="text-xs font-bold text-emerald-400">{dev.watt} Watts</p>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button 
                        onClick={() => handleStartEdit(dev)}
                        className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-sky-400 border border-slate-800"
                        title="এডিট করুন"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button 
                        onClick={() => handleDeleteDevice(dev.id)}
                        className="p-2 rounded-xl bg-rose-600/20 hover:bg-rose-600/30 text-rose-400 border border-rose-500/30"
                        title="ডিলিট করুন"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>

      </div>

    </div>
  );
};
