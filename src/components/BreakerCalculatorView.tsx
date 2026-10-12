import React, { useState } from 'react';
import { 
  ShieldCheck, 
  HelpCircle, 
  AlertTriangle, 
  CheckCircle2, 
  Info, 
  Zap, 
  Sliders, 
  Filter
} from 'lucide-react';
import { BREAKER_SPECIFICATIONS, BREAKER_COMPARISON_GUIDE } from '../data/breakerData';
import { formatTaka } from '../utils/numberFormat';

export const BreakerCalculatorView: React.FC = () => {
  const [loadAmps, setLoadAmps] = useState<number>(14);
  const [isMotorOrInductive, setIsMotorOrInductive] = useState<boolean>(false);
  const [hasWaterOrBath, setHasWaterOrBath] = useState<boolean>(true);
  const [typeFilter, setTypeFilter] = useState<string>('all');

  // Filter breaker list
  const filteredBreakers = BREAKER_SPECIFICATIONS.filter((b) => {
    if (typeFilter === 'all') return true;
    return b.type.toLowerCase().includes(typeFilter.toLowerCase());
  });

  // Calculate recommendation
  const standardRatings = [6, 10, 16, 20, 25, 32, 40, 50, 63, 100, 125, 200];
  const recommendedAmp = standardRatings.find((r) => r >= loadAmps) || 63;
  const recommendedCurve = isMotorOrInductive ? 'Type C / D (মোটর/ইনরাশ লোড)' : 'Type C (সাধারণ বাসাবাড়ি)';

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <h1 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-amber-500" />
          <span>ব্রেকার ও বৈদ্যুতিক সুরক্ষা ক্যালকুলেটর (Breaker & Protection)</span>
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          MCB, MCCB, RCCB, RCBO এবং SPD এর সঠিক রেটিং, ট্রিপ কার্ভ ও আন্তর্জাতিক জীবন-সুরক্ষা নির্দেশনা
        </p>
      </div>

      {/* Interactive Breaker Size Selector Box */}
      <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-800 to-amber-950 text-white border border-amber-500/20 shadow-lg">
        <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-4">
          <span className="text-xs font-bold text-amber-400 uppercase tracking-wide">
            স্বয়ংক্রিয় ব্রেকার নির্বাচন টুল
          </span>
          <span className="text-[11px] px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-400/30">
            নিরাপত্তা সমন্বয়
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">
              সার্কিটের আনুমানিক কারেন্ট (Amperes)
            </label>
            <input
              type="number"
              min={1}
              max={250}
              value={loadAmps}
              onChange={(e) => setLoadAmps(Number(e.target.value))}
              className="w-full px-3 py-2 text-sm rounded-lg bg-white/10 border border-white/20 text-white font-mono focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>

          <div className="flex flex-col justify-center space-y-2 pt-2 md:pt-4">
            <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-300">
              <input
                type="checkbox"
                checked={isMotorOrInductive}
                onChange={(e) => setIsMotorOrInductive(e.target.checked)}
                className="w-4 h-4 rounded text-amber-500"
              />
              <span>মোটর, এসি বা কম্প্রেসার লোড</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-300">
              <input
                type="checkbox"
                checked={hasWaterOrBath}
                onChange={(e) => setHasWaterOrBath(e.target.checked)}
                className="w-4 h-4 rounded text-amber-500"
              />
              <span>বাথরুম/গিজার/কিচেন বা ভেজা স্থান</span>
            </label>
          </div>

          {/* Result Highlight */}
          <div className="p-3.5 rounded-xl bg-white/10 backdrop-blur border border-white/15 space-y-1 text-xs">
            <span className="text-slate-300 block">প্রস্তাবিত ব্রেকার রেটিং:</span>
            <span className="text-2xl font-extrabold text-amber-400 block font-mono">
              {recommendedAmp} A
            </span>
            <div className="text-[11px] text-slate-300">
              ট্রিপ কার্ভ: <strong className="text-white">{recommendedCurve}</strong>
            </div>
            {hasWaterOrBath && (
              <div className="text-[11px] text-emerald-300 font-bold mt-1">
                + ৩০mA RCCB / RCBO জীবন-সুরক্ষা আবশ্যক
              </div>
            )}
          </div>
        </div>
      </div>

      {/* MCB vs MCCB vs RCCB vs RCBO Educational Guide */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm space-y-4">
        <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <HelpCircle className="w-4 h-4 text-amber-500" />
          <span>ব্রেকারের প্রকারভেদ ও পার্থক্য (বাংলা শিক্ষণীয় গাইড)</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Object.entries(BREAKER_COMPARISON_GUIDE).map(([key, item]) => (
            <div
              key={key}
              className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/80 space-y-2 text-xs"
            >
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-slate-900 dark:text-white text-sm">
                  {item.title}
                </h3>
                <span className="text-[10px] text-amber-600 dark:text-amber-400 font-semibold">
                  {item.bangla}
                </span>
              </div>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                <strong>কাজ:</strong> {item.purpose}
              </p>
              <div className="text-slate-500 dark:text-slate-400 text-[11px]">
                <strong>রেটিং সীমা:</strong> {item.currentRange}
              </div>
              <div className="p-2 rounded-lg bg-amber-50/80 dark:bg-amber-950/40 text-amber-900 dark:text-amber-300 text-[11px] font-semibold">
                ⚠️ {item.keyNote}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Product Catalog & Breaker Table */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <h2 className="text-sm font-bold text-slate-900 dark:text-white">
            স্ট্যান্ডার্ড ব্রেকার ক্যাটালগ ও স্পেসিফিকেশন
          </h2>

          {/* Filter Pills */}
          <div className="flex items-center gap-1 overflow-x-auto text-xs">
            {['all', 'SP', 'DP', 'TP', 'RCCB', 'RCBO', 'MCCB', 'SPD'].map((t) => (
              <button
                key={t}
                onClick={() => setTypeFilter(t)}
                className={`px-2.5 py-1 rounded-lg font-semibold transition-colors ${
                  typeFilter === t
                    ? 'bg-amber-500 text-slate-950 font-bold'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                }`}
              >
                {t === 'all' ? 'সকল' : t}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700 dark:text-slate-300">
            <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 uppercase text-[10px]">
              <tr>
                <th className="p-2.5">ব্রেকার টাইপ</th>
                <th className="p-2.5">পোল</th>
                <th className="p-2.5">অ্যাম্পিয়ার (A)</th>
                <th className="p-2.5">কার্ভ</th>
                <th className="p-2.5">শর্ট সার্কিট (kA)</th>
                <th className="p-2.5">গড় মূল্য</th>
                <th className="p-2.5">ব্যবহারের ক্ষেত্র ও নিরাপত্তা</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredBreakers.map((b) => (
                <tr key={b.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                  <td className="p-2.5 font-bold text-slate-900 dark:text-white">
                    {b.type}
                  </td>
                  <td className="p-2.5">{b.poles} Pole</td>
                  <td className="p-2.5 font-bold text-amber-600 dark:text-amber-400 font-mono">
                    {b.ratedCurrentA} A
                  </td>
                  <td className="p-2.5 font-mono">{b.curve ? `Type ${b.curve}` : '-'}</td>
                  <td className="p-2.5 font-mono">{b.breakingCapacityKA} kA</td>
                  <td className="p-2.5 font-semibold text-emerald-600 dark:text-emerald-400">
                    {formatTaka(b.approxPrice)}
                  </td>
                  <td className="p-2.5 text-[11px] text-slate-500 dark:text-slate-400 max-w-xs">
                    <div>{b.application}</div>
                    <div className="text-amber-600 dark:text-amber-400 font-medium mt-0.5">
                      {b.safetyNotes}
                    </div>
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
