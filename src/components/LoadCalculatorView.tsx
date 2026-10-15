import React, { useState } from 'react';
import { 
  Zap, 
  Calculator, 
  Plus, 
  Trash2, 
  Edit2, 
  X
} from 'lucide-react';
import { Project } from '../types';
import { calculateElectricalLoad } from '../utils/electricalCalculations';

interface LoadCalculatorProps {
  activeProject: Project | null;
  onNavigateTo: (tab: any) => void;
}

export const LoadCalculatorView: React.FC<LoadCalculatorProps> = ({
  activeProject,
  onNavigateTo
}) => {
  const [sectionName, setSectionName] = useState<string>('মেইন রুম / সম্পূর্ণ বাড়ি');
  
  const [calculatorDevices, setCalculatorDevices] = useState<Array<{
    id: string;
    name: string;
    watts: number;
    qty: number;
  }>>([
    { id: '1', name: 'লাইট (Light)', watts: 15, qty: 2 },
    { id: '2', name: 'ফ্যান (Fan)', watts: 75, qty: 1 },
    { id: '3', name: 'রাইস কুকার (Rice Cooker)', watts: 1000, qty: 0 },
    { id: '4', name: 'ফ্রিজ (Refrigerator)', watts: 250, qty: 0 },
    { id: '5', name: 'টিভি (TV)', watts: 120, qty: 0 }
  ]);

  const [editingItem, setEditingItem] = useState<{ id: string; name: string; watts: number; qty: number } | null>(null);
  const [editModalOpen, setEditModalOpen] = useState(false);

  const [resultModalOpen, setResultModalOpen] = useState(false);
  const [showItemizedNotes, setShowItemizedNotes] = useState(false);

  const [voltage, setVoltage] = useState<number>(activeProject?.voltage || 220);
  const [isThreePhase, setIsThreePhase] = useState<boolean>(false);
  const [powerFactor, setPowerFactor] = useState<number>(0.85);
  const [diversityFactor, setDiversityFactor] = useState<number>(0.85);
  const [lengthMeters, setLengthMeters] = useState<number>(25);
  const [isMotorOrCompressor, setIsMotorOrCompressor] = useState<boolean>(false);
  const [hasWetArea, setHasWetArea] = useState<boolean>(false);

  const totalCalculatedWatts = calculatorDevices.reduce((sum, d) => sum + (d.watts * d.qty), 0);

  const result = calculateElectricalLoad({
    loadWatts: totalCalculatedWatts > 0 ? totalCalculatedWatts : 100,
    voltage,
    isThreePhase,
    powerFactor,
    diversityFactor,
    lengthMeters,
    installationMethod: 'কন্ডুইট (Conduit in Wall)',
    isMotorOrCompressor,
    hasWetAreaOrGeyser: hasWetArea
  });

  const handleQtyChange = (id: string, newQty: number) => {
    setCalculatorDevices(prev => prev.map(d => d.id === id ? { ...d, qty: Math.max(0, newQty) } : d));
  };

  const handleWattsChange = (id: string, newWatts: number) => {
    setCalculatorDevices(prev => prev.map(d => d.id === id ? { ...d, watts: Math.max(0, newWatts) } : d));
  };

  const handleDeleteDevice = (id: string) => {
    setCalculatorDevices(prev => prev.filter(d => d.id !== id));
  };

  const openEditModal = (item: { id: string; name: string; watts: number; qty: number }) => {
    setEditingItem({ ...item });
    setEditModalOpen(true);
  };

  const handleSaveEditedItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;
    setCalculatorDevices(prev => prev.map(d => d.id === editingItem.id ? editingItem : d));
    setEditModalOpen(false);
    setEditingItem(null);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300 max-w-2xl mx-auto pb-12">
      
      <div className="bg-slate-900 p-5 rounded-3xl border border-amber-500/30 shadow-xl text-center space-y-2 backdrop-blur-xl">
        <div className="w-10 h-10 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center mx-auto">
          <Zap className="w-5 h-5 fill-amber-400" />
        </div>
        <h1 className="text-base sm:text-lg font-black text-white">
          ইলেকট্রিক্যাল ওয়্যারিং ও লোড ক্যালকুলেটর
        </h1>
        <p className="text-[11px] text-slate-400 max-w-md mx-auto">
          অ্যাপ্লায়েন্সের সংখ্যা ও ওয়াট হিসাব করে আরএম (RM) ও সার্কিট প্রটেকশন (MCB/RCCB) নির্ণয় করুন।
        </p>
      </div>

      <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800 shadow-md space-y-1.5">
        <label className="block text-xs font-bold text-slate-300">
          রুমের নাম বা সেকশন:
        </label>
        <input
          type="text"
          value={sectionName}
          onChange={(e) => setSectionName(e.target.value)}
          className="w-full px-3.5 py-2.5 text-xs font-bold rounded-xl border border-slate-700 bg-slate-800 text-white focus:ring-2 focus:ring-amber-500"
          placeholder="যেমন: রুম ১ বা মাস্টার বেডরুম"
        />
      </div>

      <div className="bg-slate-900 p-5 rounded-3xl border border-slate-800 shadow-xl space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-slate-800">
          <h2 className="text-xs font-black uppercase text-amber-400 tracking-wider">
            অ্যাপ্লায়েন্স ও লোড তালিকা (ড্রপডাউন মোড)
          </h2>
          <span className="text-xs font-mono font-bold text-amber-400">
            মোট: {totalCalculatedWatts} W
          </span>
        </div>

        <div className="space-y-2.5">
          {calculatorDevices.map((dev) => (
            <div 
              key={dev.id}
              className="p-3 rounded-2xl bg-slate-800/60 border border-slate-700/80 flex items-center justify-between gap-2 transition-all hover:border-amber-500/50"
            >
              <div className="flex-1 min-w-0">
                <span className="text-xs font-bold text-white truncate block">
                  {dev.name}
                </span>
                <span className="text-[10px] text-amber-400 font-mono">
                  {dev.watts}W × {dev.qty}টি = {dev.watts * dev.qty}W
                </span>
              </div>

              <div className="flex items-center gap-2">
                <select
                  value={dev.watts}
                  onChange={(e) => handleWattsChange(dev.id, Number(e.target.value))}
                  className="px-2.5 py-1.5 text-xs font-bold rounded-xl border border-slate-700 bg-slate-900 text-amber-300 focus:ring-1 focus:ring-amber-500"
                >
                  <option value={dev.watts}>{dev.watts}W</option>
                  <option value={15}>15W</option>
                  <option value={20}>20W</option>
                  <option value={40}>40W</option>
                  <option value={75}>75W</option>
                  <option value={100}>100W</option>
                  <option value={250}>250W</option>
                  <option value={1000}>1000W</option>
                  <option value={1500}>1500W</option>
                  <option value={1800}>1800W</option>
                </select>

                <input
                  type="number"
                  min={0}
                  value={dev.qty}
                  onChange={(e) => handleQtyChange(dev.id, Number(e.target.value))}
                  className="w-14 px-2 py-1.5 text-xs font-bold rounded-xl border border-slate-700 bg-slate-900 text-white text-center"
                  title="পরিমাণ"
                />

                <button
                  onClick={() => openEditModal(dev)}
                  className="p-1.5 rounded-xl bg-slate-800 text-slate-300 hover:text-amber-400 hover:bg-slate-700 transition-colors"
                  title="এডিট করুন"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>

                <button
                  onClick={() => handleDeleteDevice(dev.id)}
                  className="p-1.5 rounded-xl bg-slate-800 text-rose-400 hover:bg-rose-950/50 transition-colors"
                  title="ডিলিট করুন"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={() => {
            const name = prompt('নতুন ডিভাইসের নাম লিখুন:');
            if (!name) return;
            const w = Number(prompt('ওয়াট লিখুন:', '100')) || 100;
            setCalculatorDevices(prev => [...prev, { id: `dev-${Date.now()}`, name, watts: w, qty: 1 }]);
          }}
          className="w-full py-2.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 font-bold text-xs flex items-center justify-center gap-1.5 transition-all active:scale-95"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>+ নতুন ডিভাইস যোগ করুন</span>
        </button>
      </div>

      <div className="bg-slate-900 p-4 rounded-3xl border border-slate-800 space-y-3 shadow-md">
        <h2 className="text-xs font-black uppercase text-slate-400 tracking-wider pb-2 border-b border-slate-800">
          সুরক্ষা ডিভাইস (Protection)
        </h2>

        <label className="flex items-center gap-2.5 cursor-pointer text-xs font-bold text-slate-300">
          <input
            type="checkbox"
            checked={hasWetArea}
            onChange={(e) => setHasWetArea(e.target.checked)}
            className="w-4 h-4 rounded text-amber-500 focus:ring-amber-500 bg-slate-800 border-slate-700"
          />
          <span>RCCB (Residual Current Circuit Breaker) ব্যবহার করাবেন?</span>
        </label>
      </div>

      <div className="pt-2">
        <button
          onClick={() => setResultModalOpen(true)}
          className="w-full py-3.5 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-sm shadow-lg shadow-amber-500/25 transition-all active:scale-95 flex items-center justify-center gap-2"
        >
          <Calculator className="w-4 h-4" />
          <span>হিসাব করুন (Calculate)</span>
        </button>
      </div>

      {resultModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/80 backdrop-blur-md animate-in fade-in">
          <div className="bg-slate-900 border border-amber-500/50 rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            
            <div className="px-5 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-800/80">
              <div className="flex items-center gap-2">
                <span className="text-lg">📖</span>
                <h3 className="text-sm font-black text-white">
                  হিসাব ও নোটবুক রিপোর্ট
                </h3>
              </div>
              <button
                onClick={() => setResultModalOpen(false)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 overflow-y-auto space-y-4 flex-1 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-400 font-semibold">সেকশন: <strong className="text-white">{sectionName}</strong></span>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500 text-slate-950">যাচাইকৃত</span>
              </div>

              <div className="p-3 rounded-2xl bg-slate-800/80 border border-slate-700 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-amber-400">কোন মাল কয় পিস (তালিকা দেখুন):</span>
                  <button
                    onClick={() => setShowItemizedNotes(!showItemizedNotes)}
                    className="px-2.5 py-1 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-[10px] transition-all"
                  >
                    {showItemizedNotes ? 'তালিকা লুকান' : 'তালিকা দেখুন'}
                  </button>
                </div>

                {showItemizedNotes && (
                  <div className="space-y-1.5 pt-2 border-t border-slate-700 animate-in fade-in">
                    {calculatorDevices.filter(d => d.qty > 0).map(d => (
                      <div key={d.id} className="flex items-center justify-between text-slate-300 text-[11px] bg-slate-900/50 px-2.5 py-1.5 rounded-xl border border-slate-800">
                        <span>{d.name} ({d.qty} টি × {d.watts}W)</span>
                        <span className="font-mono font-bold text-amber-400">{d.qty * d.watts} W</span>
                      </div>
                    ))}
                    {calculatorDevices.filter(d => d.qty > 0).length === 0 && (
                      <p className="text-slate-500 italic text-center py-1">কোনো ডিভাইস সিলেক্ট করা হয়নি।</p>
                    )}
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30">
                  <span className="text-[10px] font-bold text-amber-400 block">মোট ওয়াট:</span>
                  <span className="text-lg font-black text-white font-mono">
                    {totalCalculatedWatts} ওয়াট
                  </span>
                </div>

                <div className="p-3.5 rounded-2xl bg-blue-500/10 border border-blue-500/30">
                  <span className="text-[10px] font-bold text-blue-400 block">মোট অ্যাম্পিয়ার:</span>
                  <span className="text-lg font-black text-white font-mono">
                    {result.operatingCurrentA.toFixed(2)} A
                  </span>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">তারের সাইজ (RM):</span>
                  <span className="font-black text-emerald-400">{result.recommendedCable.sizeMm2}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">প্রস্তাবিত সার্কিট ব্রেকার (MCB):</span>
                  <span className="font-black text-white">{result.recommendedBreakerRatingA} Amp MCB</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">RCCB প্রটেকশন:</span>
                  <span className="font-black text-amber-400">
                    {hasWetArea ? 'প্রয়োজন: ৩০mA (শকের হাত থেকে রক্ষা)' : 'প্রয়োজন নেই (সাধারণ ঘর)'}
                  </span>
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={() => setResultModalOpen(false)}
                  className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs transition-all shadow-md"
                >
                  বন্ধ করুন (Close)
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      {editModalOpen && editingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/70 backdrop-blur-sm animate-in fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-sm shadow-2xl overflow-hidden p-5 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-sm font-bold text-white">
                ডিভাইস এডিট করুন
              </h3>
              <button onClick={() => setEditModalOpen(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleSaveEditedItem} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-300 mb-1">নাম</label>
                <input
                  type="text"
                  value={editingItem.name}
                  onChange={(e) => setEditingItem({ ...editingItem, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-700 bg-slate-800 text-white font-semibold"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-300 mb-1">ওয়াট (Watts)</label>
                <input
                  type="number"
                  value={editingItem.watts}
                  onChange={(e) => setEditingItem({ ...editingItem, watts: Number(e.target.value) })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-700 bg-slate-800 text-white font-semibold"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-300 mb-1">পরিমাণ (Qty)</label>
                <input
                  type="number"
                  value={editingItem.qty}
                  onChange={(e) => setEditingItem({ ...editingItem, qty: Number(e.target.value) })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-700 bg-slate-800 text-white font-semibold"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs shadow-md transition-all mt-2"
              >
                সংরক্ষণ করুন (Save)
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
