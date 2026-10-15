import React, { useState } from 'react';
import { 
  Zap, 
  Calculator, 
  RotateCcw, 
  CheckCircle2, 
  AlertTriangle, 
  Info, 
  HelpCircle,
  Building2,
  Layers,
  ArrowRight,
  Plus,
  Trash2,
  Edit2
} from 'lucide-react';
import { Project, DeviceItem } from '../types';
import { calculateElectricalLoad } from '../utils/electricalCalculations';
import { formatTaka, formatWatts, formatAmps } from '../utils/numberFormat';
import { DEFAULT_DEVICES } from '../data/initialData';

interface LoadCalculatorProps {
  activeProject: Project | null;
  onNavigateTo: (tab: any) => void;
}

export const LoadCalculatorView: React.FC<LoadCalculatorProps> = ({
  activeProject,
  onNavigateTo
}) => {
  // Section or Room Name input
  const [sectionName, setSectionName] = useState<string>('মেইন রুম / সম্পূর্ণ বাড়ি');
  
  // Interactive Devices List for Calculator
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

  // Edit Modal State for specific chip/item
  const [editingItem, setEditingItem] = useState<{ id: string; name: string; watts: number; qty: number } | null>(null);
  const [editModalOpen, setEditModalOpen] = useState(false);

  // Voltage, Phase & Safety settings
  const [voltage, setVoltage] = useState<number>(activeProject?.voltage || 220);
  const [isThreePhase, setIsThreePhase] = useState<boolean>(false);
  const [powerFactor, setPowerFactor] = useState<number>(0.85);
  const [diversityFactor, setDiversityFactor] = useState<number>(0.85);
  const [lengthMeters, setLengthMeters] = useState<number>(25);
  const [isMotorOrCompressor, setIsMotorOrCompressor] = useState<boolean>(false);
  const [hasWetArea, setHasWetArea] = useState<boolean>(false);

  // Calculate total watts from active items
  const totalCalculatedWatts = calculatorDevices.reduce((sum, d) => sum + (d.watts * d.qty), 0);

  // Sync from active project
  const handleSyncFromProject = () => {
    if (!activeProject) return;
    setVoltage(activeProject.voltage || 220);
    setIsThreePhase(activeProject.phase?.includes('3-Phase') || false);
    setPowerFactor(activeProject.powerFactor || 0.85);
  };

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
      
      {/* Top Header Card (Matching User Screenshot style) */}
      <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm text-center space-y-2">
        <div className="w-10 h-10 rounded-2xl bg-amber-500/15 text-amber-500 flex items-center justify-center mx-auto">
          <Zap className="w-5 h-5 fill-amber-500" />
        </div>
        <h1 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
          ইলেকট্রিক্যাল ওয়্যারিং ও লোড ক্যালকুলেটর
        </h1>
        <p className="text-[11px] text-slate-500 dark:text-slate-400 max-w-md mx-auto">
          অ্যাপ্লায়েন্সের সংখ্যা ও ওয়াট হিসাব করে আরএম (RM) ও সার্কিট প্রটেকশন (MCB/RCCB) নির্ণয় করুন।
        </p>
      </div>

      {/* COMPACT CHIPS BADGES & QUICK EDIT BAR (Requested Feature) */}
      <div className="bg-amber-50 dark:bg-slate-900/60 p-4 rounded-2xl border border-amber-200 dark:border-amber-900/50 space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-amber-900 dark:text-amber-300 flex items-center gap-1.5">
            <span>নির্বাচিত লোডসমূহ (পেন্সিল আইকনে ক্লিক করে এডিট করুন):</span>
          </span>
          <span className="text-xs font-bold text-amber-600 font-mono">
            মোট: {totalCalculatedWatts} W
          </span>
        </div>
        
        <div className="flex flex-wrap gap-2">
          {calculatorDevices.filter(d => d.qty > 0).map((dev) => (
            <div 
              key={dev.id}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xs text-xs font-semibold text-slate-800 dark:text-slate-200"
            >
              <span>{dev.name} ({dev.qty}টি • {dev.watts * dev.qty}W)</span>
              <button
                onClick={() => openEditModal(dev)}
                className="p-1 rounded text-amber-600 hover:bg-amber-50 dark:hover:bg-slate-700 transition-colors"
                title="এডিট করুন"
              >
                <Edit2 className="w-3 h-3" />
              </button>
            </div>
          ))}
          {calculatorDevices.filter(d => d.qty > 0).length === 0 && (
            <p className="text-xs text-slate-400 italic">কোনো ডিভাইস সংখ্যা সিলেক্ট করা হয়নি। নিচে পরিমাণ বাড়ান।</p>
          )}
        </div>
      </div>

      {/* Section Name Input */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-1.5">
        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
          রুমের নাম বা সেকশন:
        </label>
        <input
          type="text"
          value={sectionName}
          onChange={(e) => setSectionName(e.target.value)}
          className="w-full px-3.5 py-2.5 text-xs font-bold rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-amber-500"
          placeholder="যেমন: রুম ১ বা মাস্টার বেডরুম"
        />
      </div>

      {/* Appliances & Load List Cards */}
      <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <h2 className="text-xs font-black uppercase text-slate-400 tracking-wider">
          অ্যাপ্লায়েন্স ও লোড তালিকা
        </h2>

        <div className="space-y-3">
          {calculatorDevices.map((dev) => (
            <div 
              key={dev.id}
              className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/80 space-y-2.5"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-900 dark:text-white">
                  {dev.name}
                </span>
                <button
                  onClick={() => openEditModal(dev)}
                  className="text-[11px] font-bold text-amber-600 hover:underline flex items-center gap-1"
                >
                  <Edit2 className="w-3 h-3" /> এডিট
                </button>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 mb-1">ওয়াট</label>
                  <select
                    value={dev.watts}
                    onChange={(e) => handleWattsChange(dev.id, Number(e.target.value))}
                    className="w-full px-3 py-1.5 text-xs font-bold rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                  >
                    <option value={dev.watts}>{dev.watts} ওয়াট</option>
                    <option value={15}>১৫ ওয়াট</option>
                    <option value={20}>২০ ওয়াট</option>
                    <option value={40}>৪০ ওয়াট</option>
                    <option value={75}>৭৫ ওয়াট</option>
                    <option value={100}>১০০ ওয়াট</option>
                    <option value={250}>২৫০ ওয়াট</option>
                    <option value={1000}>১০০০ ওয়াট</option>
                    <option value={1500}>১৫০০ ওয়াট</option>
                    <option value={1800}>১৮০০ ওয়াট</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-400 mb-1">সংখ্যা (Qty)</label>
                  <input
                    type="number"
                    min={0}
                    value={dev.qty}
                    onChange={(e) => handleQtyChange(dev.id, Number(e.target.value))}
                    className="w-full px-3 py-1.5 text-xs font-bold rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Add custom device button */}
        <button
          onClick={() => {
            const name = prompt('নতুন ডিভাইসের নাম লিখুন:');
            if (!name) return;
            const w = Number(prompt('ওয়াট লিখুন:', '100')) || 100;
            setCalculatorDevices(prev => [...prev, { id: `dev-${Date.now()}`, name, watts: w, qty: 1 }]);
          }}
          className="w-full py-2.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 font-bold text-xs flex items-center justify-center gap-1.5 shadow-xs transition-all active:scale-95"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>+ নতুন ডিভাইস যোগ করুন</span>
        </button>
      </div>

      {/* Protection Checkbox */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-3">
        <h2 className="text-xs font-black uppercase text-slate-400 tracking-wider pb-2 border-b border-slate-100 dark:border-slate-800">
          সুরক্ষা ডিভাইস (Protection)
        </h2>

        <label className="flex items-center gap-2.5 cursor-pointer text-xs font-bold text-slate-700 dark:text-slate-300">
          <input
            type="checkbox"
            checked={hasWetArea}
            onChange={(e) => setHasWetArea(e.target.checked)}
            className="w-4 h-4 rounded text-amber-500 focus:ring-amber-500"
          />
          <span>RCCB (Residual Current Circuit Breaker) ব্যবহার করাবেন?</span>
        </label>
      </div>

      {/* Calculate Action Button */}
      <div className="pt-2">
        <button
          onClick={() => {
            const outputEl = document.getElementById('notebook-report-result');
            if (outputEl) outputEl.scrollIntoView({ behavior: 'smooth' });
          }}
          className="w-full py-3.5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-black text-sm shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2"
        >
          <Calculator className="w-4 h-4" />
          <span>হিসাব করুন (Calculate)</span>
        </button>
      </div>

      {/* NOTEBOOK REPORT OUTPUT (Matching Screenshot) */}
      <div 
        id="notebook-report-result"
        className="bg-[#fffdf5] dark:bg-slate-900 p-5 sm:p-6 rounded-3xl border-2 border-amber-400/80 dark:border-amber-500/60 shadow-xl space-y-4"
      >
        <div className="flex items-center justify-between pb-3 border-b border-amber-200 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <span className="text-lg">📖</span>
            <h3 className="text-sm font-black text-slate-900 dark:text-white">
              নোটবুক রিপোর্ট
            </h3>
          </div>
          <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-amber-500 text-slate-950 shadow-xs">
            যাচাইকৃত
          </span>
        </div>

        <div>
          <span className="text-[11px] text-slate-400 block font-semibold">সেকশন: {sectionName}</span>
          <div className="space-y-1 mt-2">
            {calculatorDevices.filter(d => d.qty > 0).map(d => (
              <div key={d.id} className="flex items-center justify-between text-xs text-slate-700 dark:text-slate-300">
                <span>{d.name} ({d.qty}টি × {d.watts}W)</span>
                <span className="font-mono font-bold">{d.qty * d.watts} W</span>
              </div>
            ))}
          </div>
        </div>

        <div className="pt-3 border-t border-amber-200 dark:border-slate-800 grid grid-cols-2 gap-3">
          <div className="p-3 rounded-2xl bg-amber-100/60 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-900">
            <span className="text-[10px] font-bold text-amber-800 dark:text-amber-400 block">মোট ওয়াট:</span>
            <span className="text-base font-black text-amber-950 dark:text-amber-200 font-mono">
              {totalCalculatedWatts} ওয়াট
            </span>
          </div>

          <div className="p-3 rounded-2xl bg-blue-100/60 dark:bg-blue-950/40 border border-blue-300 dark:border-blue-900">
            <span className="text-[10px] font-bold text-blue-800 dark:text-blue-400 block">মোট অ্যাম্পিয়ার:</span>
            <span className="text-base font-black text-blue-950 dark:text-blue-200 font-mono">
              {result.operatingCurrentA.toFixed(2)} A
            </span>
          </div>
        </div>

        <div className="p-3.5 rounded-2xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 space-y-1.5 text-xs">
          <div className="flex items-center justify-between">
            <span className="text-slate-500">তারের সাইজ (RM):</span>
            <span className="font-black text-emerald-600 dark:text-emerald-400">{result.recommendedCable.sizeMm2}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-500">প্রস্তাবিত সার্কিট ব্রেকার (MCB):</span>
            <span className="font-black text-slate-900 dark:text-white">{result.recommendedBreakerRatingA} Amp MCB</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-500">RCCB প্রটেকশন:</span>
            <span className="font-black text-amber-600 dark:text-amber-400">
              {hasWetArea ? 'প্রয়োজন: ৩০mA (শকের হাত থেকে রক্ষা)' : 'প্রয়োজন নেই (সাধারণ ঘর)'}
            </span>
          </div>
        </div>

        <p className="text-[10px] text-slate-400 italic text-center leading-relaxed">
          নোট: এই বৈদ্যুতিক হিসাবটি প্রমিত প্রকৌশল ফর্মুলা, লোড, MCB ও RCCB নির্বাচনে সঠিক মান নিশ্চিত করতে কার্যকর।
        </p>
      </div>

      {/* EDIT MODAL FOR POPUP EDITING */}
      {editModalOpen && editingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/70 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-sm shadow-2xl overflow-hidden p-5 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                ডিভাইস এডিট করুন
              </h3>
              <button onClick={() => setEditModalOpen(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleSaveEditedItem} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">নাম</label>
                <input
                  type="text"
                  value={editingItem.name}
                  onChange={(e) => setEditingItem({ ...editingItem, name: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">ওয়াট (Watts)</label>
                <input
                  type="number"
                  value={editingItem.watts}
                  onChange={(e) => setEditingItem({ ...editingItem, watts: Number(e.target.value) })}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">পরিমাণ (Qty)</label>
                <input
                  type="number"
                  value={editingItem.qty}
                  onChange={(e) => setEditingItem({ ...editingItem, qty: Number(e.target.value) })}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
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
