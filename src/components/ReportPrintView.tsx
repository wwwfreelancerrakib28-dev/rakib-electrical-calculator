import React, { useState } from 'react';
import { 
  Printer, 
  FileText, 
  Download, 
  Building2, 
  User, 
  Calendar, 
  Phone, 
  MapPin, 
  CheckCircle2,
  Package,
  Zap,
  ShieldCheck
} from 'lucide-react';
import { Project, Customer, AppSettings } from '../types';
import { formatTaka, formatWatts, formatAmps } from '../utils/numberFormat';
import { calculateElectricalLoad } from '../utils/electricalCalculations';

interface ReportPrintProps {
  project: Project | null;
  customer: Customer | null;
  settings: AppSettings;
}

export const ReportPrintView: React.FC<ReportPrintProps> = ({
  project,
  customer,
  settings
}) => {
  const [reportType, setReportType] = useState<'invoice' | 'materials' | 'electrical'>('invoice');

  if (!project) {
    return (
      <div className="p-12 text-center bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
        <FileText className="w-12 h-12 text-amber-500 mx-auto mb-3" />
        <h2 className="text-lg font-bold text-slate-800 dark:text-white mb-2">
          কোনো প্রজেক্ট নির্বাচিত নেই
        </h2>
        <p className="text-xs text-slate-500 max-w-md mx-auto">
          রিপোর্ট বা বিল প্রিন্ট করতে উপরে ড্রপডাউন থেকে প্রজেক্ট নির্বাচন করুন।
        </p>
      </div>
    );
  }

  const handlePrint = () => {
    window.print();
  };

  const totalWatts = project.rooms.reduce((sum, r) => sum + r.totalWatts, 0);
  const electricalCalc = calculateElectricalLoad({
    loadWatts: totalWatts,
    voltage: project.voltage,
    isThreePhase: project.phase.includes('3-Phase'),
    powerFactor: project.powerFactor,
    diversityFactor: project.diversityFactor,
    lengthMeters: 25,
    installationMethod: 'কন্ডুইট (Conduit in Wall)'
  });

  // Aggregate all materials
  const allMaterials = [
    ...project.rooms.flatMap((r) => r.materials.map((m) => ({ ...m, roomName: r.name }))),
    ...project.commonMaterials.map((m) => ({ ...m, roomName: 'মেইন প্রজেক্ট (কমন)' }))
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Action Bar (Hidden on print) */}
      <div className="no-print flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white dark:bg-slate-900 p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div>
          <h1 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <FileText className="w-5 h-5 text-amber-500" />
            <span>প্রফেশনাল রিপোর্ট ও ক্যাশ মেমো / PDF</span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            প্রিন্ট বাটনে চাপ দিলে সহজে সরাসরি প্রিন্ট করা যাবে অথবা "Save as PDF" হিসেবে সংরক্ষণ করা যাবে
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Report switcher */}
          <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl text-xs">
            <button
              onClick={() => setReportType('invoice')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                reportType === 'invoice'
                  ? 'bg-amber-500 text-slate-950 shadow-sm'
                  : 'text-slate-600 dark:text-slate-300'
              }`}
            >
              বিলের চালান (Invoice)
            </button>
            <button
              onClick={() => setReportType('materials')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                reportType === 'materials'
                  ? 'bg-amber-500 text-slate-950 shadow-sm'
                  : 'text-slate-600 dark:text-slate-300'
              }`}
            >
              মালামালের ফর্দ (BOM)
            </button>
            <button
              onClick={() => setReportType('electrical')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                reportType === 'electrical'
                  ? 'bg-amber-500 text-slate-950 shadow-sm'
                  : 'text-slate-600 dark:text-slate-300'
              }`}
            >
              ওয়্যারিং ও লোড রিপোর্ট
            </button>
          </div>

          <button
            onClick={handlePrint}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 active:scale-95 text-slate-950 font-bold text-sm shadow-md transition-all shrink-0"
          >
            <Printer className="w-4 h-4 stroke-[2.5]" />
            <span>প্রিন্ট / PDF সংরক্ষণ</span>
          </button>
        </div>
      </div>

      {/* Printable Sheet Container */}
      <div className="bg-white text-slate-900 p-6 sm:p-10 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xl max-w-4xl mx-auto print:max-w-none print:border-none print:shadow-none print:p-0">
        
        {/* Memo Header */}
        <div className="border-b-2 border-slate-800 pb-5 mb-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-amber-500 text-slate-950 font-black flex items-center justify-center text-lg">
                  ⚡
                </div>
                <h2 className="text-2xl font-black tracking-tight text-slate-900">
                  {settings.electricianName || 'রাকিব হাসান'}
                </h2>
              </div>
              <p className="text-xs text-slate-600 font-semibold mt-1">
                পেশাদার ইলেকট্রিক্যাল কন্ট্রাক্টর ও টেকনিশিয়ান
              </p>
              <div className="text-xs text-slate-600 flex flex-wrap items-center gap-3 mt-1">
                <span>মোবাইল: {settings.electricianPhone}</span>
                <span>• ঠিকানা: {settings.electricianAddress}</span>
              </div>
            </div>

            <div className="text-left sm:text-right border-t sm:border-t-0 pt-2 sm:pt-0 w-full sm:w-auto">
              <span className="inline-block px-3 py-1 rounded-md bg-slate-900 text-white font-bold text-xs uppercase tracking-wider mb-1">
                {reportType === 'invoice'
                  ? 'কাজের অফিসিয়াল বিল ও চালান'
                  : reportType === 'materials'
                  ? 'বৈদ্যুতিক মালামালের কেনাকাটার ফর্দ'
                  : 'ওয়্যারিং লোড ও কেবল শিট'}
              </span>
              <div className="text-xs text-slate-500">
                তারিখ: {new Date().toLocaleDateString('bn-BD')}
              </div>
              <div className="text-xs text-slate-500 font-mono">
                চালান নং: INV-{project.id.slice(-6).toUpperCase()}
              </div>
            </div>
          </div>
        </div>

        {/* Customer & Project Info Box */}
        <div className="grid grid-cols-2 gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs mb-6">
          <div>
            <span className="text-[10px] text-slate-500 uppercase font-bold block mb-1">
              গ্রাহক / কাস্টমারের তথ্য:
            </span>
            <div className="font-bold text-sm text-slate-900">{customer?.name || project.customerName}</div>
            <div className="text-slate-600 mt-0.5">মোবাইল: {customer?.phone}</div>
            <div className="text-slate-600">ঠিকানা: {customer?.address || project.address}</div>
          </div>

          <div>
            <span className="text-[10px] text-slate-500 uppercase font-bold block mb-1">
              প্রজেক্টের বিবরণ:
            </span>
            <div className="font-bold text-sm text-slate-900">{project.name}</div>
            <div className="text-slate-600 mt-0.5">
              {project.buildingType} ({project.floors} তলা) • {project.phase} ({project.voltage}V)
            </div>
            <div className="text-slate-600">অবস্থা: {project.status}</div>
          </div>
        </div>

        {/* Report Content Types */}

        {/* 1. INVOICE VIEW */}
        {reportType === 'invoice' && (
          <div className="space-y-6">
            <table className="w-full text-left text-xs text-slate-800 border-collapse">
              <thead>
                <tr className="border-b-2 border-slate-700 bg-slate-100">
                  <th className="p-3 font-bold">বিবরণ / সেবার খাত</th>
                  <th className="p-3 font-bold text-right">পরিমাণ / রেট</th>
                  <th className="p-3 font-bold text-right">মোট টাকা (৳)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                <tr>
                  <td className="p-3 font-medium">
                    <div>১. সকল রুম ও মেইন লাইনের প্রয়োজনীয় বৈদ্যুতিক মালামাল</div>
                    <div className="text-[11px] text-slate-500">
                      (তার, ব্রেকার, পাইপ, সুইচ, সকেট, আর্থিং সামগ্রী ইত্যাদি মোট {allMaterials.length} আইটেম)
                    </div>
                  </td>
                  <td className="p-3 text-right">প্রকৃত বাজারদর</td>
                  <td className="p-3 text-right font-bold font-mono">
                    {formatTaka(project.costing.materialsCost)}
                  </td>
                </tr>

                <tr>
                  <td className="p-3 font-medium">
                    <div>২. ইলেকট্রিশিয়ান / টেকনিশিয়ানের কাজের মজুরি</div>
                    <div className="text-[11px] text-slate-500">
                      পদ্ধতি: {project.costing.laborCostType}
                      {project.costing.laborCostType === 'পয়েন্ট হিসাব' &&
                        ` (${project.costing.pointsCount}টি পয়েন্ট × ${project.costing.laborRate} ৳)`}
                    </div>
                  </td>
                  <td className="p-3 text-right">
                    {project.costing.laborCostType === 'পয়েন্ট হিসাব'
                      ? `${project.costing.pointsCount} পয়েন্ট`
                      : 'চুক্তি'}
                  </td>
                  <td className="p-3 text-right font-bold font-mono">
                    {formatTaka(project.costing.laborTotal)}
                  </td>
                </tr>

                {project.costing.additionalCost > 0 && (
                  <tr>
                    <td className="p-3 font-medium">৩. অতিরিক্ত খরচ (টুলস / মেটেরিয়াল ফিটিং)</td>
                    <td className="p-3 text-right">-</td>
                    <td className="p-3 text-right font-bold font-mono">
                      {formatTaka(project.costing.additionalCost)}
                    </td>
                  </tr>
                )}

                {project.costing.transportCost > 0 && (
                  <tr>
                    <td className="p-3 font-medium">৪. পরিবহন খরচ</td>
                    <td className="p-3 text-right">-</td>
                    <td className="p-3 text-right font-bold font-mono">
                      {formatTaka(project.costing.transportCost)}
                    </td>
                  </tr>
                )}

                {project.costing.discount > 0 && (
                  <tr className="text-emerald-700">
                    <td className="p-3 font-medium">৫. বিশেষ ছাড় / ডিসকাউন্ট</td>
                    <td className="p-3 text-right">-</td>
                    <td className="p-3 text-right font-bold font-mono">
                      - {formatTaka(project.costing.discount)}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>

            {/* Total Math summary Box */}
            <div className="flex justify-end pt-2">
              <div className="w-full sm:w-72 space-y-2 text-xs border-t-2 border-slate-800 pt-3">
                <div className="flex justify-between font-bold text-sm text-slate-900">
                  <span>সর্বমোট বিল:</span>
                  <span className="font-mono">{formatTaka(project.costing.totalBill)}</span>
                </div>
                <div className="flex justify-between text-emerald-700 font-semibold">
                  <span>মোট পরিশোধিত:</span>
                  <span className="font-mono">{formatTaka(project.costing.paidAmount)}</span>
                </div>
                <div className="flex justify-between text-rose-700 font-black text-sm border-t border-slate-300 pt-2">
                  <span>বর্তমান বাকি বা বকেয়া:</span>
                  <span className="font-mono">{formatTaka(project.costing.dueAmount)}</span>
                </div>
              </div>
            </div>

            {/* Payment history list on bill */}
            {project.payments.length > 0 && (
              <div className="pt-4 border-t border-slate-200">
                <h4 className="text-xs font-bold text-slate-700 mb-2">পরিশোধের রেকর্ড:</h4>
                <div className="space-y-1 text-[11px] text-slate-600">
                  {project.payments.map((p, idx) => (
                    <div key={p.id} className="flex justify-between py-1 border-b border-slate-100">
                      <span>
                        {idx + 1}. {p.date} — {p.method} {p.referenceNo ? `(${p.referenceNo})` : ''} {p.note ? `[${p.note}]` : ''}
                      </span>
                      <span className="font-bold text-slate-900 font-mono">{formatTaka(p.amount)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* 2. MATERIALS SHOPPING LIST (BOM) */}
        {reportType === 'materials' && (
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-900 border-b pb-2">
              দোকান থেকে ক্রয়ের জন্য মালামালের পূর্ণাঙ্গ তালিকা ({allMaterials.length}টি আইটেম)
            </h3>

            <table className="w-full text-left text-xs text-slate-800 border-collapse">
              <thead>
                <tr className="border-b border-slate-700 bg-slate-100 text-[11px]">
                  <th className="p-2">ক্রমিক</th>
                  <th className="p-2">মালামালের নাম</th>
                  <th className="p-2">ক্যাটাগরি / ব্র্যান্ড</th>
                  <th className="p-2">পরিমাণ</th>
                  <th className="p-2 text-right">দর (৳)</th>
                  <th className="p-2 text-right">মোট দাম (৳)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {allMaterials.map((m, idx) => (
                  <tr key={m.id} className="hover:bg-slate-50">
                    <td className="p-2 font-mono">{idx + 1}</td>
                    <td className="p-2 font-semibold">
                      {m.name}
                      <span className="text-[10px] text-slate-500 block">স্থান: {m.roomName}</span>
                    </td>
                    <td className="p-2 text-slate-600">{m.category} {m.brand ? `(${m.brand})` : ''}</td>
                    <td className="p-2 font-bold">{m.quantity} {m.unit}</td>
                    <td className="p-2 text-right font-mono">{formatTaka(m.unitPrice)}</td>
                    <td className="p-2 text-right font-bold font-mono">{formatTaka(m.totalPrice)}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="border-t-2 border-slate-800 font-bold bg-slate-50">
                  <td colSpan={5} className="p-3 text-right">মালামালের সর্বমোট আনুমানিক মূল্য:</td>
                  <td className="p-3 text-right font-mono text-emerald-700 text-sm">
                    {formatTaka(project.costing.materialsCost)}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        )}

        {/* 3. ELECTRICAL WIRING & LOAD SPEC SHEET */}
        {reportType === 'electrical' && (
          <div className="space-y-5">
            <h3 className="text-sm font-bold text-slate-900 border-b pb-2">
              প্রকৌশলগত লোড গণনা ও তার/ব্রেকার স্পেসিফিকেশন শিট
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs">
              <div>
                <span className="text-slate-500 block">মোট সংযুক্ত লোড</span>
                <span className="font-bold text-slate-900 text-sm">{formatWatts(totalWatts)}</span>
              </div>
              <div>
                <span className="text-slate-500 block">কার্যকর কারেন্ট</span>
                <span className="font-bold text-slate-900 text-sm">{formatAmps(electricalCalc.operatingCurrentA)}</span>
              </div>
              <div>
                <span className="text-slate-500 block">প্রস্তাবিত মেইন তার</span>
                <span className="font-bold text-amber-700 text-sm">{electricalCalc.recommendedCable.sizeMm2}</span>
              </div>
              <div>
                <span className="text-slate-500 block">মেইন ব্রেকার</span>
                <span className="font-bold text-emerald-700 text-sm">{electricalCalc.recommendedBreakerRatingA}A {electricalCalc.recommendedBreakerType}</span>
              </div>
            </div>

            {/* Room by Room load table */}
            <table className="w-full text-left text-xs text-slate-800 border-collapse">
              <thead>
                <tr className="border-b border-slate-700 bg-slate-100">
                  <th className="p-2.5">রুমের নাম</th>
                  <th className="p-2.5">ডিভাইস সংখ্যা</th>
                  <th className="p-2.5">লোড (Watts)</th>
                  <th className="p-2.5">কারেন্ট (A)</th>
                  <th className="p-2.5">প্রস্তাবিত শাখা ব্রেকার ও কেবল</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {project.rooms.map((r) => {
                  const hasHeavy = r.devices.some((d) => d.isHeavyLoad);

                  return (
                    <tr key={r.id}>
                      <td className="p-2.5 font-bold">
                        {r.name} ({r.type})
                      </td>
                      <td className="p-2.5">{r.devices.length}টি</td>
                      <td className="p-2.5 font-bold font-mono">{formatWatts(r.totalWatts)}</td>
                      <td className="p-2.5 font-mono">{formatAmps(r.totalAmps)}</td>
                      <td className="p-2.5 text-slate-600">
                        {hasHeavy ? '১৬A/২০A Type C (৪.০ mm² তার)' : '১০A/১৬A Type C (১.৫ / ২.৫ mm²)'}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Signatures & Footer */}
        <div className="mt-12 pt-8 border-t border-slate-300 grid grid-cols-2 text-xs">
          <div>
            <div className="w-44 border-t border-slate-700 pt-1.5 text-center font-bold text-slate-800">
              গ্রাহকের স্বাক্ষর
            </div>
          </div>
          <div className="text-right flex flex-col items-end">
            <div className="w-48 border-t border-slate-700 pt-1.5 text-center font-bold text-slate-800">
              ইলেকট্রিশিয়ানের স্বাক্ষর ও সিল
            </div>
          </div>
        </div>

        <div className="mt-8 text-center text-[10px] text-slate-400">
          রাকিব ইলেকট্রিক্যাল ক্যালকুলেটর (Rakib Electrical Calculator) দ্বারা প্রস্তুতকৃত।
        </div>

      </div>

    </div>
  );
};
