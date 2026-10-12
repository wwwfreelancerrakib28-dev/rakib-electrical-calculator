import React, { useState } from 'react';
import { 
  Cable, 
  Layers, 
  HelpCircle, 
  AlertTriangle, 
  CheckCircle2, 
  Flame, 
  ShieldCheck,
  Zap,
  Gauge
} from 'lucide-react';
import { CABLE_SPECIFICATIONS, ALUMINIUM_CABLE_SPECIFICATIONS } from '../data/cableData';
import { calculateElectricalLoad } from '../utils/electricalCalculations';
import { formatWatts, formatAmps } from '../utils/numberFormat';

export const CableCalculatorView: React.FC = () => {
  const [loadWatts, setLoadWatts] = useState<number>(2500);
  const [voltage, setVoltage] = useState<number>(220);
  const [isThreePhase, setIsThreePhase] = useState<boolean>(false);
  const [powerFactor, setPowerFactor] = useState<number>(0.85);
  const [lengthMeters, setLengthMeters] = useState<number>(30);
  const [unitType, setUnitType] = useState<'meter' | 'feet'>('meter');
  const [conductor, setConductor] = useState<'copper' | 'aluminium'>('copper');
  const [installationMethod, setInstallationMethod] = useState<'কন্ডুইট (Conduit in Wall)' | 'সারফেস (Surface / Clipped)' | 'ট্রে (Cable Tray)'>('কন্ডুইট (Conduit in Wall)');
  const [ambientTempC, setAmbientTempC] = useState<number>(35);

  const finalLengthMeters = unitType === 'feet' ? lengthMeters * 0.3048 : lengthMeters;

  const result = calculateElectricalLoad({
    loadWatts,
    voltage,
    isThreePhase,
    powerFactor,
    diversityFactor: 1.0,
    lengthMeters: finalLengthMeters,
    installationMethod,
    ambientTempC
  });

  const cableTable = conductor === 'copper' ? CABLE_SPECIFICATIONS : ALUMINIUM_CABLE_SPECIFICATIONS;

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <h1 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Cable className="w-5 h-5 text-amber-500" />
          <span>তার ও কেবল সাইজ ক্যালকুলেটর (Wire & Cable Size Calculator)</span>
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          তামা ও অ্যালুমিনিয়াম তারের কারেন্ট বহনক্ষমতা, ভোল্টেজ ড্রপ এবং নিরাপদ সাইজ নির্ধারণ
        </p>
      </div>

      {/* Inputs vs Output */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        
        {/* Left Inputs (5 Cols) */}
        <div className="lg:col-span-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm space-y-4">
          <h2 className="text-sm font-bold text-slate-900 dark:text-white pb-2 border-b border-slate-100 dark:border-slate-800">
            লোডের পরিমাপ ও তারের স্পেসিফিকেশন
          </h2>

          {/* Conductor Toggle */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              কন্ডাক্টরের ধাতু
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setConductor('copper')}
                className={`py-2 rounded-xl text-xs font-bold transition-all ${
                  conductor === 'copper'
                    ? 'bg-amber-500 text-slate-950 shadow-sm'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                }`}
              >
                খাঁটি কপার (তামা - Copper)
              </button>
              <button
                type="button"
                onClick={() => setConductor('aluminium')}
                className={`py-2 rounded-xl text-xs font-bold transition-all ${
                  conductor === 'aluminium'
                    ? 'bg-amber-500 text-slate-950 shadow-sm'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                }`}
              >
                অ্যালুমিনিয়াম (Aluminium)
              </button>
            </div>
          </div>

          {/* Load Watts */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                সংযুক্ত লোড (Watts)
              </label>
              <span className="text-xs font-mono font-bold text-amber-600 dark:text-amber-400">
                {loadWatts} W
              </span>
            </div>
            <input
              type="number"
              step="50"
              value={loadWatts}
              onChange={(e) => setLoadWatts(Math.max(0, Number(e.target.value)))}
              className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>

          {/* Phase & Voltage */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                বিদ্যুৎ সরবরাহ
              </label>
              <select
                value={isThreePhase ? '3' : '1'}
                onChange={(e) => {
                  const val = e.target.value === '3';
                  setIsThreePhase(val);
                  setVoltage(val ? 400 : 220);
                }}
                className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
              >
                <option value="1">১-ফেজ (২২০V)</option>
                <option value="3">৩-ফেজ (৪০০V)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                পাওয়ার ফ্যাক্টর (PF)
              </label>
              <input
                type="number"
                step="0.05"
                min={0.6}
                max={1.0}
                value={powerFactor}
                onChange={(e) => setPowerFactor(Number(e.target.value))}
                className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>
          </div>

          {/* Cable Length & Unit */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                তারের দৈর্ঘ্য
              </label>
              <div className="flex items-center gap-1 text-[11px]">
                <button
                  type="button"
                  onClick={() => setUnitType('meter')}
                  className={`px-2 py-0.5 rounded ${
                    unitType === 'meter' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400'
                  }`}
                >
                  মিটার
                </button>
                <button
                  type="button"
                  onClick={() => setUnitType('feet')}
                  className={`px-2 py-0.5 rounded ${
                    unitType === 'feet' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400'
                  }`}
                >
                  ফুট
                </button>
              </div>
            </div>
            <input
              type="number"
              min={1}
              value={lengthMeters}
              onChange={(e) => setLengthMeters(Number(e.target.value))}
              className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
            {unitType === 'feet' && (
              <p className="text-[10px] text-slate-400 mt-1">
                {lengthMeters} ফুট = {finalLengthMeters.toFixed(1)} মিটার
              </p>
            )}
          </div>

          {/* Installation method */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              ইনস্টলেশন পদ্ধতি
            </label>
            <select
              value={installationMethod}
              onChange={(e) => setInstallationMethod(e.target.value as any)}
              className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
            >
              <option value="কন্ডুইট (Conduit in Wall)">কন্ডুইট পাইপের ভেতর (দেয়ালে আবদ্ধ)</option>
              <option value="সারফেস (Surface / Clipped)">সারফেস ওয়্যারিং (দেয়ালে ক্লিপযুক্ত খোলা)</option>
              <option value="ট্রে (Cable Tray)">ক্যাবল ট্রে (খোলা বাতাস)</option>
            </select>
          </div>

          {/* Ambient Temperature */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              পরিবেষ্টক তাপমাত্রা (°C)
            </label>
            <select
              value={ambientTempC}
              onChange={(e) => setAmbientTempC(Number(e.target.value))}
              className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
            >
              <option value="30">৩০° সেলসিয়াস (স্বাভাবিক শীত/বসন্ত)</option>
              <option value="35">৩৫° সেলসিয়াস (বাংলাদেশের গড় তাপমাত্রা)</option>
              <option value="40">৪০° সেলসিয়াস (তীব্র গ্রীষ্মকাল)</option>
              <option value="45">৪৫° সেলসিয়াস (ফ্যাক্টরি বা গরম ছাদ)</option>
            </select>
          </div>
        </div>

        {/* Right Output Recommendations (7 Cols) */}
        <div className="lg:col-span-7 space-y-4">
          
          {/* Main Recommended Cable Box */}
          <div className="bg-gradient-to-br from-slate-900 to-amber-950 text-white rounded-2xl p-5 sm:p-6 shadow-md border border-amber-500/30">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <span className="text-xs font-semibold text-amber-300">
                প্রস্তাবিত তারের ফলাফল (BNBC / IEC মানদণ্ড)
              </span>
              <span className="text-[11px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                যাচাইকৃত হিসাব
              </span>
            </div>

            <div className="mt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-xs text-slate-300 block">উপযুক্ত কেবল সাইজ:</span>
                <span className="text-3xl sm:text-4xl font-extrabold text-amber-400 mt-1 block">
                  {result.recommendedCable.sizeMm2}
                </span>
                <span className="text-xs text-slate-300 mt-0.5 block">
                  প্রচলিত সাইজ: <strong className="text-white">{result.recommendedCable.rmEquivalent}</strong>
                </span>
              </div>

              <div className="bg-white/10 backdrop-blur p-3.5 rounded-xl border border-white/10 space-y-1 text-xs">
                <div className="flex justify-between gap-4">
                  <span className="text-slate-300">কারেন্ট বহনক্ষমতা:</span>
                  <span className="font-bold text-amber-300">
                    {installationMethod.includes('সারফেস')
                      ? result.recommendedCable.openAirCurrentCapacityA
                      : result.recommendedCable.conduitCurrentCapacityA} A
                  </span>
                </div>
                <div className="flex justify-between gap-4">
                  <span className="text-slate-300">কার্যকর লোড কারেন্ট:</span>
                  <span className="font-bold font-mono">
                    {formatAmps(result.operatingCurrentA)}
                  </span>
                </div>
                <div className="flex justify-between gap-4">
                  <span className="text-slate-300">নিরাপত্তা ডিজাইন কারেন্ট:</span>
                  <span className="font-bold font-mono text-amber-300">
                    {formatAmps(result.designCurrentA)}
                  </span>
                </div>
                <div className="flex justify-between gap-4">
                  <span className="text-slate-300">ভোল্টেজ ড্রপ:</span>
                  <span className={`font-bold font-mono ${result.isVoltageDropAcceptable ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {result.voltageDropPercentage.toFixed(2)}% ({result.voltageDropVolts.toFixed(1)} V)
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-white/10 text-xs text-slate-300 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>
                উপযুক্ত আর্থিং কেবল: <strong className="text-white">{result.recommendedEarthWire}</strong> কপার তার সংযুক্ত করা জরুরি।
              </span>
            </div>
          </div>

          {/* Warnings */}
          {result.warnings.length > 0 && (
            <div className="space-y-2">
              {result.warnings.map((w, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-xl bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-900 text-red-700 dark:text-red-300 text-xs flex items-start gap-2"
                >
                  <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{w}</span>
                </div>
              ))}
            </div>
          )}

          {/* Cable Standard Data Table */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 shadow-sm">
            <h3 className="text-xs font-bold text-slate-800 dark:text-white uppercase tracking-wider mb-3">
              {conductor === 'copper' ? 'কপার (তামা)' : 'অ্যালুমিনিয়াম'} কেবলের স্ট্যান্ডার্ড রেফারেন্স তালিকা
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-700 dark:text-slate-300">
                <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 uppercase text-[10px]">
                  <tr>
                    <th className="p-2.5">সাইজ (mm²)</th>
                    <th className="p-2.5">প্রচলিত RM / Imperial</th>
                    <th className="p-2.5">কন্ডুইট অ্যাম্পিয়ার (A)</th>
                    <th className="p-2.5">খোলা তার (A)</th>
                    <th className="p-2.5">আর্থ তার</th>
                    <th className="p-2.5">ব্যবহারের স্থান</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {cableTable.map((c) => {
                    const isSelected = c.sizeMm2 === result.recommendedCable.sizeMm2;

                    return (
                      <tr
                        key={c.sizeMm2}
                        className={`hover:bg-slate-50 dark:hover:bg-slate-800/40 ${
                          isSelected ? 'bg-amber-50 dark:bg-amber-950/30 font-bold' : ''
                        }`}
                      >
                        <td className="p-2.5 font-bold text-amber-600 dark:text-amber-400">
                          {c.sizeMm2}
                        </td>
                        <td className="p-2.5">{c.rmEquivalent}</td>
                        <td className="p-2.5 font-mono">{c.conduitCurrentCapacityA} A</td>
                        <td className="p-2.5 font-mono">{c.openAirCurrentCapacityA} A</td>
                        <td className="p-2.5">{c.recommendedEarthWire}</td>
                        <td className="p-2.5 text-[11px] text-slate-500 dark:text-slate-400">
                          {c.recommendedUse}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
