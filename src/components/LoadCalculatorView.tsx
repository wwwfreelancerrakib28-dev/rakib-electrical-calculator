import React, { useState } from 'react';
import { 
  Zap, 
  Plus, 
  Trash2, 
  ChevronDown, 
  ChevronUp 
} from 'lucide-react';

interface DeviceItem {
  id: string;
  name: string;
  watt: number;
  category: string;
  count: number;
}

interface LoadCalculatorViewProps {
  activeProject?: any;
  onNavigateTo: (tab: any) => void;
}

export const LoadCalculatorView: React.FC<LoadCalculatorViewProps> = () => {
  // Complete list of electrical devices based on your specification
  const [devices, setDevices] = useState<DeviceItem[]>([
    { id: 'd1', name: 'LED লাইট (সাধারণ)', watt: 15, category: 'লাইট', count: 2 },
    { id: 'd2', name: 'LED টিউবলাইট', watt: 20, category: 'লাইট', count: 0 },
    { id: 'd3', name: 'সিলিং ফ্যান', watt: 75, category: 'ফ্যান', count: 1 },
    { id: 'd4', name: 'এক্সজস্ট ফ্যান', watt: 40, category: 'ফ্যান', count: 0 },
    { id: 'd5', name: 'টিভি (LED/Smart TV)', watt: 85, category: 'বিনোদন', count: 0 },
    { id: 'd6', name: 'রেফ্রিজারেটর / ফ্রিজ', watt: 200, category: 'হেভি অ্যাপ্লায়েন্স', count: 0 },
    { id: 'd7', name: 'ডিপ ফ্রিজ', watt: 300, category: 'হেভি অ্যাপ্লায়েন্স', count: 0 },
    { id: 'd8', name: 'রাইস কুকার', watt: 700, category: 'রান্নাঘর', count: 0 },
    { id: 'd9', name: 'ইলেকট্রিক ইস্ত্রি / আয়রন', watt: 1000, category: 'হেভি অ্যাপ্লায়েন্স', count: 0 },
    { id: 'd10', name: 'এয়ার কন্ডিশনার (১ টন AC)', watt: 1200, category: 'ভারী লোড (এসি)', count: 0 },
    { id: 'd11', name: 'এয়ার কন্ডিশনার (১.৫ টন AC)', watt: 1800, category: 'ভারী লোড (এসি)', count: 0 },
    { id: 'd12', name: 'এয়ার কন্ডিশনার (২ টন AC)', watt: 2400, category: 'ভারী লোড (এসি)', count: 0 },
    { id: 'd13', name: 'পানির পাম্প / মোটর (0.5 HP)', watt: 375, category: 'মোটর ও পাম্প', count: 0 },
    { id: 'd14', name: 'পানির পাম্প / মোটর (1.0 HP)', watt: 750, category: 'মোটর ও পাম্প', count: 0 },
    { id: 'd15', name: 'পানির পাম্প / মোটর (1.5 HP)', watt: 1120, category: 'মোটর ও পাম্প', count: 0 },
    { id: 'd16', name: 'পানির সাবমারসিবল মোটর (2.0 HP)', watt: 1500, category: 'মোটর ও পাম্প', count: 0 },
    { id: 'd17', name: 'ওয়াটার হিটার / গিজার (বাথরুম)', watt: 1500, category: 'ভারী লোড (হিটার)', count: 0 },
    { id: 'd18', name: 'মাইক্রোওয়েভ ওভেন', watt: 1200, category: 'রান্নাঘর', count: 0 },
    { id: 'd19', name: 'ইনডাকশন / ইনফারেড কুকার', watt: 2000, category: 'রান্নাঘর', count: 0 },
    { id: 'd20', name: 'ইলেকট্রিক কেটলি', watt: 1500, category: 'রান্নাঘর', count: 0 },
    { id: 'd21', name: 'ওয়াশিং মেশিন', watt: 500, category: 'হেভি অ্যাপ্লায়েন্স', count: 0 },
    { id: 'd22', name: 'কম্পিউটার ও মনিটর', watt: 250, category: 'অফিস ও আউটলেট', count: 0 },
    { id: 'd23', name: 'ল্যাপটপ / মোবাইল চার্জার', watt: 65, category: 'অফিস ও আউটলেট', count: 0 },
    { id: 'd24', name: 'প্রিন্টার / ফটোকপিয়ার', watt: 450, category: 'অফিস ও আউটলেট', count: 0 },
    { id: 'd25', name: 'সিসিটিভি সেট ও NVR', watt: 80, category: 'নিরাপত্তা', count: 0 },
    { id: 'd26', name: 'ওয়াইফাই রাউটার ও ONU', watt: 15, category: 'নেটওয়ার্ক', count: 0 },
  ]);

  // Dropdown open/close state for each device
  const [openDropdowns, setOpenDropdowns] = useState<{ [key: string]: boolean }>({});

  // New custom device modal state
  const [newModalOpen, setNewModalOpen] = useState(false);
  const [customName, setCustomName] = useState('');
  const [customWatt, setCustomWatt] = useState('100');
  const [customCategory, setCustomCategory] = useState('সাধারণ');

  const toggleDropdown = (id: string) => {
    setOpenDropdowns(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleCountChange = (id: string, delta: number) => {
    setDevices(prev => prev.map(d => {
      if (d.id === id) {
        const newCount = Math.max(0, d.count + delta);
        return { ...d, count: newCount };
      }
      return d;
    }));
  };

  const handleDeleteDevice = (id: string) => {
    setDevices(prev => prev.filter(d => d.id !== id));
  };

  const handleAddCustomDevice = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customName.trim()) return;

    const newDev: DeviceItem = {
      id: `cust-${Date.now()}`,
      name: customName,
      watt: parseInt(customWatt) || 100,
      category: customCategory,
      count: 1
    };

    setDevices([newDev, ...devices]);
    setCustomName('');
    setNewModalOpen(false);
  };

  // Total Watt Calculation
  const totalWatt = devices.reduce((sum, d) => sum + (d.watt * d.count), 0);
  const totalAmp = Math.round((totalWatt / (220 * 0.85)) * 10) / 10;

  return (
    <div className="space-y-6 animate-in duration-300 max-w-2xl mx-auto pb-12">
      
      {/* Room Selection Header */}
      <div className="p-4 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-2">
        <label className="block text-xs font-bold text-slate-400">
          রুমের নাম বা সেকশন:
        </label>
        <input 
          type="text" 
          defaultValue="মেইন রুম / সম্পূর্ণ বাড়ি"
          className="w-full px-4 py-3 text-xs font-bold rounded-2xl border border-slate-700 bg-slate-950 text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
        />
      </div>

      {/* Appliances & Load Table Section */}
      <div className="p-5 sm:p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl space-y-4">
        
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-amber-400 fill-amber-400" />
            <h2 className="text-xs sm:text-sm font-black text-white">
              অ্যাপ্লায়েন্স ও লোড তালিকা (ড্রপডাউন মোড)
            </h2>
          </div>
          <div className="text-right">
            <span className="text-xs font-bold text-slate-400">মোট: </span>
            <span className="text-sm font-black text-amber-400">{totalWatt} W ({totalAmp}A)</span>
          </div>
        </div>

        {/* Add Device Top Button */}
        <button
          onClick={() => setNewModalOpen(true)}
          className="w-full py-3 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs flex items-center justify-center gap-2 transition-all shadow-lg shadow-amber-500/20"
        >
          <Plus className="w-4 h-4" />
          <span>+ নতুন ডিভাইস যোগ করুন</span>
        </button>

        {/* Device Dropdown Cards List */}
        <div className="space-y-3 pt-2">
          {devices.map((device) => {
            const isOpen = !!openDropdowns[device.id];
            const deviceTotalWatt = device.watt * device.count;

            return (
              <div 
                key={device.id}
                className="rounded-2xl bg-slate-950 border border-slate-800 overflow-hidden transition-all shadow-md"
              >
                {/* Dropdown Header Bar */}
                <div 
                  onClick={() => toggleDropdown(device.id)}
                  className="p-4 flex items-center justify-between cursor-pointer hover:bg-slate-900/60 select-none"
                >
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <h3 className="text-xs sm:text-sm font-black text-white">{device.name}</h3>
                      <span className="px-2 py-0.5 rounded-full bg-slate-800 text-[10px] font-bold text-amber-400">
                        {device.category}
                      </span>
                    </div>
                    <p className="text-[11px] font-bold text-slate-400">
                      {device.watt}W × {device.count}টি = <span className="text-emerald-400">{deviceTotalWatt}W</span>
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-xl">
                      {device.count} টি
                    </span>
                    <button className="p-1 rounded-lg text-slate-400 hover:text-white">
                      {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Dropdown Expandable Content */}
                {isOpen && (
                  <div className="p-4 border-t border-slate-800/80 bg-slate-900/50 flex items-center justify-between gap-4 animate-in fade-in">
                    <div className="space-y-1">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">পরিমাণ বাড়ান/মান কমান:</span>
                      <div className="flex items-center gap-2">
                        <button 
                          onClick={() => handleCountChange(device.id, -1)}
                          className="w-8 h-8 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-black text-sm flex items-center justify-center transition-all"
                        >
                          -
                        </button>
                        <span className="w-10 text-center text-xs font-black text-amber-400">
                          {device.count}
                        </span>
                        <button 
                          onClick={() => handleCountChange(device.id, 1)}
                          className="w-8 h-8 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-black text-sm flex items-center justify-center transition-all"
                        >
                          +
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleDeleteDevice(device.id)}
                        className="px-3.5 py-2 rounded-xl bg-rose-600/20 hover:bg-rose-600/30 text-rose-400 border border-rose-500/30 font-bold text-xs flex items-center gap-1 transition-all"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>ডিলিট</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </div>

      {/* Add Custom Device Modal */}
      {newModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-sm w-full shadow-2xl space-y-4">
            <h3 className="text-sm font-black text-amber-400">নতুন ডিভাইস যুক্ত করুন</h3>
            
            <form onSubmit={handleAddCustomDevice} className="space-y-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-300 mb-1">ডিভাইসের নাম:</label>
                <input 
                  type="text" 
                  value={customName}
                  onChange={(e) => setCustomName(e.target.value)}
                  placeholder="যেমন: ওভেন / মোটর" 
                  className="w-full px-3.5 py-2.5 text-xs font-bold rounded-xl border border-slate-700 bg-slate-950 text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-300 mb-1">ওয়াট (Watts):</label>
                <input 
                  type="number" 
                  value={customWatt}
                  onChange={(e) => setCustomWatt(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs font-bold rounded-xl border border-slate-700 bg-slate-950 text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-300 mb-1">ক্যাটাগরি:</label>
                <input 
                  type="text" 
                  value={customCategory}
                  onChange={(e) => setCustomCategory(e.target.value)}
                  placeholder="যেমন: রান্নাঘর / হেভি" 
                  className="w-full px-3.5 py-2.5 text-xs font-bold rounded-xl border border-slate-700 bg-slate-950 text-white focus:outline-none"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setNewModalOpen(false)}
                  className="flex-1 py-2.5 rounded-xl bg-slate-800 text-slate-300 font-bold text-xs"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-amber-500 text-slate-950 font-black text-xs shadow-lg"
                >
                  সংরক্ষণ করুন
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
