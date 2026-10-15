import React, { useState } from 'react';
import { 
  Settings, 
  Zap, 
  Save 
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
  // Settings state for voltage selection (220V, 230V, 440V)
  const [selectedVoltage, setSelectedVoltage] = useState<string>(
    String(state.settings?.defaultVoltage || '220')
  );
  const [engineerName, setEngineerName] = useState<string>(
    state.settings?.engineerName || 'রাকিব হাসান'
  );
  const [phone, setPhone] = useState<string>(
    state.settings?.engineerPhone || '01700-000000'
  );

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    
    onUpdateState(prev => ({
      ...prev,
      settings: {
        ...prev.settings,
        defaultVoltage: parseInt(selectedVoltage) || 220,
        engineerName: engineerName,
        engineerPhone: phone
      }
    }));

    alert(`সফলভাবে সেভ হয়েছে! এখন থেকে পুরো অ্যাপের হিসাব ${selectedVoltage} ভোল্ট অনুযায়ী কাজ করবে।`);
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
            মেইন ভোল্টেজ ও প্রোফাইল সেটিংস
          </h2>
          <p className="text-[11px] text-slate-400">
            অ্যাপের হিসাবের ভোল্টেজ এবং আপনার নাম সেট করুন
          </p>
        </div>
      </div>

      {/* Main Form */}
      <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl space-y-6">
        
        <form onSubmit={handleSaveSettings} className="space-y-5">
          
          {/* Voltage Selection Box (220V, 230V, 440V) */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-amber-500/30 space-y-3">
            <label className="block text-xs font-black text-amber-400 flex items-center gap-1.5">
              <Zap className="w-4 h-4" />
              <span>সিস্টেম ভোল্টেজ সিলেক্ট করুন (পুরো অ্যাপের জন্য):</span>
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
                    {vol} Volt {vol === '440' ? '(3-Phase)' : '(1-Phase)'}
                  </button>
                );
              })}
            </div>
            <p className="text-[10px] text-slate-400">
              * আপনি যে ভোল্ট সিলেক্ট করবেন, লোড ও অ্যাম্পিয়ার ক্যালকুলেটর সেই ভোল্টেজ অনুযায়ী হিসাব করবে।
            </p>
          </div>

          {/* Name & Phone */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-300">আপনার নাম ও পদবি:</label>
            <input 
              type="text" 
              value={engineerName}
              onChange={(e) => setEngineerName(e.target.value)}
              placeholder="যেমন: রাকিব হাসান (টেকনিশিয়ান)" 
              className="w-full px-4 py-3 text-xs font-bold rounded-2xl border border-slate-700 bg-slate-950 text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-300">মোবাইল নম্বর:</label>
            <input 
              type="text" 
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="017xxxxxxxx" 
              className="w-full px-4 py-3 text-xs font-bold rounded-2xl border border-slate-700 bg-slate-950 text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>

          {/* Save Button */}
          <button 
            type="submit"
            className="w-full py-4 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs flex items-center justify-center gap-2 shadow-xl shadow-amber-500/20 transition-all active:scale-95"
          >
            <Save className="w-4 h-4" />
            <span>সেটিংস সেভ করুন ({selectedVoltage} Volt)</span>
          </button>

        </form>

      </div>

    </div>
  );
};
