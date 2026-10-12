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
  ArrowRight
} from 'lucide-react';
import { Project } from '../types';
import { calculateElectricalLoad } from '../utils/electricalCalculations';
import { formatTaka, formatWatts, formatAmps } from '../utils/numberFormat';

interface LoadCalculatorProps {
  activeProject: Project | null;
  onNavigateTo: (tab: any) => void;
}

export const LoadCalculatorView: React.FC<LoadCalculatorProps> = ({
  activeProject,
  onNavigateTo
}) => {
  const [loadWatts, setLoadWatts] = useState<number>(3500);
  const [voltage, setVoltage] = useState<number>(220);
  const [isThreePhase, setIsThreePhase] = useState<boolean>(false);
  const [powerFactor, setPowerFactor] = useState<number>(0.85);
  const [diversityFactor, setDiversityFactor] = useState<number>(0.85);
  const [lengthMeters, setLengthMeters] = useState<number>(25);
  const [isMotorOrCompressor, setIsMotorOrCompressor] = useState<boolean>(false);
  const [hasWetArea, setHasWetArea] = useState<boolean>(false);

  // Sync from active project
  const handleSyncFromProject = () => {
    if (!activeProject) return;
    const projectWatts = activeProject.rooms.reduce((sum, r) => sum + r.totalWatts, 0);
    setLoadWatts(projectWatts > 0 ? projectWatts : 3500);
    setVoltage(activeProject.voltage || 220);
    setIsThreePhase(activeProject.phase.includes('3-Phase'));
    setPowerFactor(activeProject.powerFactor || 0.85);
    setDiversityFactor(activeProject.diversityFactor || 0.8);

    // check if any room is bathroom or has AC
    const hasBath = activeProject.rooms.some((r) => r.type === 'বাথরুম' || r.name.includes('বাথরুম'));
    const hasMotor = activeProject.rooms.some((r) =>
      r.devices.some((d) => d.isHeavyLoad || d.name.includes('এসি') || d.name.includes('মোটর'))
    );
    setHasWetArea(hasBath);
    setIsMotorOrCompressor(hasMotor);
  };

  const result = calculateElectricalLoad({
    loadWatts,
    voltage,
    isThreePhase,
    powerFactor,
    diversityFactor,
    lengthMeters,
    installationMethod: 'কন্ডুইট (Conduit in Wall)',
    isMotorOrCompressor,
    hasWetAreaOrGeyser: hasWetArea
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white dark:bg-slate-900 p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div>
          <h1 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Zap className="w-5 h-5 text-amber-500" />
            <span>অটোমেটিক লোড ক্যালকুলেটর (Electrical Load Calculator)</span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            ওয়াট, কারেন্ট (অ্যাম্পিয়ার), পাওয়ার ফ্যাক্টর ও ডাইভারসিটি ফ্যাক্টরের আন্তর্জাতিক প্রকৌশল হিসাব
          </p>
        </div>

        {activeProject && (
          <button
            onClick={handleSyncFromProject}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-900/60 text-amber-900 dark:text-amber-300 font-bold text-xs hover:bg-amber-100 dark:hover:bg-amber-900/40 transition-colors"
          >
            <Building2 className="w-4 h-4 text-amber-600 dark:text-amber-400" />
            <span>"{activeProject.name}" প্রজেক্ট লোড লোড করুন</span>
          </button>
        )}
      </div>

      {/* Main Grid: Inputs vs Calculation Output */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        
        {/* Left Inputs (5 Cols) */}
        <div className="lg:col-span-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm space-y-4">
          <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5 pb-2 border-b border-slate-100 dark:border-slate-800">
            <Calculator className="w-4 h-4 text-amber-500" />
            <span>ইনপুট প্যারামিটারসমূহ</span>
          </h2>

          {/* Phase Toggle */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              বিদ্যুৎ সংযোগের ধরন
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => {
                  setIsThreePhase(false);
                  setVoltage(220);
                }}
                className={`py-2 rounded-xl text-xs font-bold transition-all ${
                  !isThreePhase
                    ? 'bg-amber-500 text-slate-950 shadow-sm'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                }`}
              >
                ১-ফেজ (সিঙ্গেল ফেজ)
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsThreePhase(true);
                  setVoltage(400);
                }}
                className={`py-2 rounded-xl text-xs font-bold transition-all ${
                  isThreePhase
                    ? 'bg-amber-500 text-slate-950 shadow-sm'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                }`}
              >
                ৩-ফেজ (থ্রি ফেজ)
              </button>
            </div>
          </div>

          {/* Load Watts */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                মোট লোড (Watts)
              </label>
              <span className="text-xs font-mono text-amber-600 dark:text-amber-400 font-bold">
                {loadWatts} W = {(loadWatts / 1000).toFixed(2)} kW
              </span>
            </div>
            <input
              type="number"
              step="50"
              min="10"
              value={loadWatts}
              onChange={(e) => setLoadWatts(Math.max(0, Number(e.target.value)))}
              className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>

          {/* Voltage */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              লাইন ভোল্টেজ (V)
            </label>
            <input
              type="number"
              value={voltage}
              onChange={(e) => setVoltage(Number(e.target.value))}
              className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>

          {/* Power Factor */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                পাওয়ার ফ্যাক্টর (Power Factor - cos φ)
              </label>
              <span className="text-xs font-mono font-bold text-slate-700 dark:text-slate-300">
                {powerFactor}
              </span>
            </div>
            <input
              type="range"
              min="0.65"
              max="1.0"
              step="0.05"
              value={powerFactor}
              onChange={(e) => setPowerFactor(Number(e.target.value))}
              className="w-full accent-amber-500"
            />
            <div className="flex justify-between text-[10px] text-slate-400 mt-0.5">
              <span>০.৬৫ (দুর্বল মোটর)</span>
              <span>০.৮৫ (স্ট্যান্ডার্ড বাসা)</span>
              <span>১.০ (হিটার/রেজিস্ট্যান্স)</span>
            </div>
          </div>

          {/* Diversity Factor */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                ডাইভারসিটি ফ্যাক্টর (Diversity Factor)
              </label>
              <span className="text-xs font-mono font-bold text-slate-700 dark:text-slate-300">
                {(diversityFactor * 100).toFixed(0)}%
              </span>
            </div>
            <input
              type="range"
              min="0.5"
              max="1.0"
              step="0.05"
              value={diversityFactor}
              onChange={(e) => setDiversityFactor(Number(e.target.value))}
              className="w-full accent-amber-500"
            />
            <p className="text-[10px] text-slate-400 mt-0.5">
              বাসার সব যন্ত্রপাতি একসাথে চালু থাকে না, তাই ব্যবহারিক লোড ৮০%-৮৫% ধরা হয়।
            </p>
          </div>

          {/* Line Length */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              তারের দৈর্ঘ্য (মিটার)
            </label>
            <input
              type="number"
              min={1}
              value={lengthMeters}
              onChange={(e) => setLengthMeters(Number(e.target.value))}
              className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>

          {/* Checkboxes */}
          <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
            <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-700 dark:text-slate-300">
              <input
                type="checkbox"
                checked={isMotorOrCompressor}
                onChange={(e) => setIsMotorOrCompressor(e.target.checked)}
                className="w-4 h-4 rounded text-amber-500 focus:ring-amber-500"
              />
              <span>ইন্ডাকশন মোটর / এসি / কম্প্রেসার লোড অন্তর্ভুক্ত</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-700 dark:text-slate-300">
              <input
                type="checkbox"
                checked={hasWetArea}
                onChange={(e) => setHasWetArea(e.target.checked)}
                className="w-4 h-4 rounded text-amber-500 focus:ring-amber-500"
              />
              <span>বাথরুম গিজার বা ভেজা স্থান (৩০mA RCCB বাধ্যতামূলক)</span>
            </label>
          </div>
        </div>

        {/* Right Output Results (7 Cols) */}
        <div className="lg:col-span-7 space-y-4">
          
          {/* Main Calculation Summary Card */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 sm:p-6 shadow-sm space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div>
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  গণনার ফলাফল
                </span>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  তড়িৎ প্রবাহ ও লোড বিশ্লেষণ
                </h3>
              </div>
              <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>{result.status}</span>
              </span>
            </div>

            {/* 4 Result Metrics */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3.5 rounded-xl bg-amber-50/80 dark:bg-amber-950/40 border border-amber-200/60 dark:border-amber-900/50">
                <span className="text-[10px] font-semibold text-amber-800 dark:text-amber-400 block">কার্যকর লোড</span>
                <span className="text-lg font-black text-amber-950 dark:text-amber-200 mt-1 block">
                  {formatWatts(result.effectiveWattsWithDiversity)}
                </span>
                <span className="text-[10px] text-amber-700/80 dark:text-amber-400">
                  {result.totalKW.toFixed(2)} kW
                </span>
              </div>

              <div className="p-3.5 rounded-xl bg-blue-50/80 dark:bg-blue-950/40 border border-blue-200/60 dark:border-blue-900/50">
                <span className="text-[10px] font-semibold text-blue-800 dark:text-blue-400 block">কার্যকর কারেন্ট</span>
                <span className="text-lg font-black text-blue-950 dark:text-blue-200 mt-1 block font-mono">
                  {formatAmps(result.operatingCurrentA)}
                </span>
                <span className="text-[10px] text-blue-700/80 dark:text-blue-400">
                  {isThreePhase ? 'প্রতি ফেজে' : 'মোট প্রবাহ'}
                </span>
              </div>

              <div className="p-3.5 rounded-xl bg-purple-50/80 dark:bg-purple-950/40 border border-purple-200/60 dark:border-purple-900/50">
                <span className="text-[10px] font-semibold text-purple-800 dark:text-purple-400 block">ডিজাইন কারেন্ট</span>
                <span className="text-lg font-black text-purple-950 dark:text-purple-200 mt-1 block font-mono">
                  {formatAmps(result.designCurrentA)}
                </span>
                <span className="text-[10px] text-purple-700/80 dark:text-purple-400">
                  ১২৫% সেফটি মার্জিন
                </span>
              </div>

              <div className="p-3.5 rounded-xl bg-emerald-50/80 dark:bg-emerald-950/40 border border-emerald-200/60 dark:border-emerald-900/50">
                <span className="text-[10px] font-semibold text-emerald-800 dark:text-emerald-400 block">ভোল্টেজ ড্রপ</span>
                <span className="text-lg font-black text-emerald-950 dark:text-emerald-200 mt-1 block font-mono">
                  {result.voltageDropPercentage.toFixed(2)}%
                </span>
                <span className="text-[10px] text-emerald-700/80 dark:text-emerald-400">
                  ({result.voltageDropVolts.toFixed(1)} V)
                </span>
              </div>
            </div>

            {/* Recommended Cable & Breaker Card */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 text-xs">
              <div>
                <span className="text-slate-400 block mb-0.5">প্রস্তাবিত কপার তারের সাইজ:</span>
                <span className="text-sm font-bold text-slate-900 dark:text-white block">
                  {result.recommendedCable.sizeMm2} ({result.recommendedCable.rmEquivalent})
                </span>
                <span className="text-[11px] text-slate-500 mt-0.5 block">
                  কন্ডুইটে বহনক্ষমতা: {result.recommendedCable.conduitCurrentCapacityA} A
                </span>
              </div>

              <div>
                <span className="text-slate-400 block mb-0.5">প্রস্তাবিত সার্কিট ব্রেকার:</span>
                <span className="text-sm font-bold text-amber-600 dark:text-amber-400 block">
                  {result.recommendedBreakerRatingA}A {result.recommendedBreakerType} ({result.recommendedBreakerCurve})
                </span>
                <span className="text-[11px] text-slate-500 mt-0.5 block">
                  আর্থ তার: {result.recommendedEarthWire}
                </span>
              </div>
            </div>

            {/* Warnings and Safety Alerts */}
            {result.warnings.length > 0 && (
              <div className="space-y-1.5">
                {result.warnings.map((w, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-xl bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-900 text-red-700 dark:text-red-300 text-xs flex items-start gap-2"
                  >
                    <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                    <span>{w}</span>
                  </div>
                ))}
              </div>
            )}

            {result.safetyNotes.length > 0 && (
              <div className="space-y-1.5">
                {result.safetyNotes.map((note, idx) => (
                  <div
                    key={idx}
                    className="p-2.5 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900 text-blue-700 dark:text-blue-300 text-xs flex items-center gap-2"
                  >
                    <Info className="w-4 h-4 shrink-0" />
                    <span>{note}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Mathematical Step-by-Step Explanation */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm space-y-3">
            <h3 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <HelpCircle className="w-4 h-4 text-amber-500" />
              <span>হিসাবের প্রকৌশল ব্যাখ্যা ও সূত্র (Calculation Steps)</span>
            </h3>

            <div className="space-y-2 text-xs font-mono bg-slate-50 dark:bg-slate-950 p-4 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-300 leading-relaxed">
              {result.formulaSteps.map((step, idx) => (
                <div key={idx} className="flex items-start gap-2">
                  <span className="text-amber-500 font-bold shrink-0">{idx + 1}.</span>
                  <span>{step}</span>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
