import React, { useState } from 'react';
import { 
  Receipt, 
  DollarSign, 
  Plus, 
  Trash2, 
  Edit2, 
  Check, 
  Calendar, 
  Printer, 
  Banknote, 
  AlertCircle,
  FileText
} from 'lucide-react';
import { Project, PaymentRecord, ProjectCosting } from '../types';
import { formatTaka } from '../utils/numberFormat';
import { recalculateProject } from '../utils/storage';

interface CostAndBillProps {
  activeProject: Project | null;
  onUpdateProject: (project: Project) => void;
  onNavigateTo: (tab: any) => void;
}

export const CostAndBillView: React.FC<CostAndBillProps> = ({
  activeProject,
  onUpdateProject,
  onNavigateTo
}) => {
  // Add payment modal state
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [payAmount, setPayAmount] = useState(5000);
  const [payDate, setPayDate] = useState(new Date().toISOString().split('T')[0]);
  const [payMethod, setPayMethod] = useState<PaymentRecord['method']>('নগদ (Cash)');
  const [payRef, setPayRef] = useState('');
  const [payNote, setPayNote] = useState('');

  // Editable costing fields
  const [laborType, setLaborType] = useState<ProjectCosting['laborCostType']>(
    activeProject?.costing.laborCostType || 'পয়েন্ট হিসাব'
  );
  const [laborRate, setLaborRate] = useState<number>(activeProject?.costing.laborRate || 250);
  const [pointsCount, setPointsCount] = useState<number>(activeProject?.costing.pointsCount || 40);
  const [contractLabor, setContractLabor] = useState<number>(activeProject?.costing.laborTotal || 10000);
  const [additionalCost, setAdditionalCost] = useState<number>(activeProject?.costing.additionalCost || 0);
  const [transportCost, setTransportCost] = useState<number>(activeProject?.costing.transportCost || 0);
  const [discount, setDiscount] = useState<number>(activeProject?.costing.discount || 0);

  if (!activeProject) {
    return (
      <div className="p-12 text-center bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
        <Receipt className="w-12 h-12 text-amber-500 mx-auto mb-3" />
        <h2 className="text-lg font-bold text-slate-800 dark:text-white mb-2">
          কোনো প্রজেক্ট নির্বাচিত নেই
        </h2>
        <p className="text-xs text-slate-500 max-w-md mx-auto mb-4">
          কাজের বিল ও হিসাব দেখতে উপরে প্রজেক্ট সিলেক্ট করুন।
        </p>
      </div>
    );
  }

  // Handle costing change & sync
  const handleUpdateCosting = () => {
    let finalLabor = 0;
    if (laborType === 'পয়েন্ট হিসাব') {
      finalLabor = (Number(pointsCount) || 0) * (Number(laborRate) || 0);
    } else {
      finalLabor = Number(contractLabor) || 0;
    }

    const updatedCosting: ProjectCosting = {
      ...activeProject.costing,
      laborCostType: laborType,
      laborRate: Number(laborRate),
      pointsCount: Number(pointsCount),
      laborTotal: finalLabor,
      additionalCost: Number(additionalCost),
      transportCost: Number(transportCost),
      discount: Number(discount)
    };

    const updatedProj: Project = {
      ...activeProject,
      costing: updatedCosting
    };

    onUpdateProject(recalculateProject(updatedProj));
  };

  const handleAddPayment = (e: React.FormEvent) => {
    e.preventDefault();
    const amount = Number(payAmount) || 0;
    if (amount <= 0) return;

    const newPayment: PaymentRecord = {
      id: `pay-${Date.now()}`,
      projectId: activeProject.id,
      customerId: activeProject.customerId,
      amount,
      date: payDate,
      method: payMethod,
      referenceNo: payRef.trim(),
      note: payNote.trim(),
      createdAt: new Date().toISOString()
    };

    const updatedPayments = [...activeProject.payments, newPayment];
    const updatedProj: Project = {
      ...activeProject,
      payments: updatedPayments
    };

    onUpdateProject(recalculateProject(updatedProj));
    setPaymentModalOpen(false);
    setPayAmount(0);
    setPayNote('');
    setPayRef('');
  };

  const handleDeletePayment = (id: string) => {
    if (window.confirm('আপনি কি এই পেমেন্ট এন্ট্রিটি মুছে ফেলতে চান?')) {
      const updatedPayments = activeProject.payments.filter((p) => p.id !== id);
      const updatedProj: Project = {
        ...activeProject,
        payments: updatedPayments
      };
      onUpdateProject(recalculateProject(updatedProj));
    }
  };

  const { costing } = activeProject;

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white dark:bg-slate-900 p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div>
          <h1 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Receipt className="w-5 h-5 text-amber-500" />
            <span>কাজের খরচ, বিল ও পেমেন্ট হিসাব (Billing & Payments)</span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            প্রজেক্ট: <strong className="text-slate-800 dark:text-slate-200">{activeProject.name}</strong> • কাস্টমার: {activeProject.customerName}
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={() => onNavigateTo('reports')}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
          >
            <Printer className="w-4 h-4" />
            <span>প্রিন্ট ও PDF রসিদ</span>
          </button>

          <button
            onClick={() => setPaymentModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 active:scale-95 text-slate-950 font-bold text-xs shadow-md transition-all"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>পেমেন্ট জমা করুন</span>
          </button>
        </div>
      </div>

      {/* Primary Financial Overview Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <span className="text-xs text-slate-500 dark:text-slate-400 font-semibold block">মালামাল বাবদ</span>
          <span className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white block mt-1">
            {formatTaka(costing.materialsCost)}
          </span>
          <span className="text-[11px] text-slate-400">স্বয়ংক্রিয় ক্যালকুলেশন</span>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <span className="text-xs text-slate-500 dark:text-slate-400 font-semibold block">মিস্ত্রির মজুরি</span>
          <span className="text-xl sm:text-2xl font-black text-amber-600 dark:text-amber-400 block mt-1">
            {formatTaka(costing.laborTotal)}
          </span>
          <span className="text-[11px] text-slate-400">
            {costing.laborCostType === 'পয়েন্ট হিসাব'
              ? `${costing.pointsCount} পয়েন্ট × ${costing.laborRate} ৳`
              : costing.laborCostType}
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <span className="text-xs text-slate-500 dark:text-slate-400 font-semibold block">মোট বিল</span>
          <span className="text-xl sm:text-2xl font-black text-blue-600 dark:text-blue-400 block mt-1">
            {formatTaka(costing.totalBill)}
          </span>
          <span className="text-[11px] text-slate-400">ছাড় ও অতিরিক্ত ব্যয়সহ</span>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <span className="text-xs text-slate-500 dark:text-slate-400 font-semibold block">বাকি বা বকেয়া</span>
          <span className="text-xl sm:text-2xl font-black text-rose-600 dark:text-rose-400 block mt-1">
            {formatTaka(costing.dueAmount)}
          </span>
          <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-bold">
            পরিশোধ: {formatTaka(costing.paidAmount)}
          </span>
        </div>
      </div>

      {/* Billing Calculator Editor & Payments Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        
        {/* Left: Billing Rates & Labor Setup (5 Cols) */}
        <div className="lg:col-span-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm space-y-4">
          <h2 className="text-sm font-bold text-slate-900 dark:text-white pb-2 border-b border-slate-100 dark:border-slate-800">
            মজুরি ও খরচের খাত নির্ধারণ
          </h2>

          {/* Labor calculation type */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              মজুরির হিসাবের পদ্ধতি
            </label>
            <select
              value={laborType}
              onChange={(e) => setLaborType(e.target.value as any)}
              className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
            >
              <option value="পয়েন্ট হিসাব">পয়েন্ট হিসাব (প্রতি পয়েন্টে নির্দিষ্ট রেট)</option>
              <option value="চুক্তিভিত্তিক">চুক্তিভিত্তিক (Lump-sum Contract)</option>
              <option value="দৈনিক হাজিরা">দৈনিক হাজিরা (Daily Wage)</option>
              <option value="স্কয়ার ফুট রেট">স্কয়ার ফুট রেট (Per Sq. Ft)</option>
            </select>
          </div>

          {laborType === 'পয়েন্ট হিসাব' ? (
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  মোট পয়েন্ট সংখ্যা
                </label>
                <input
                  type="number"
                  min={1}
                  value={pointsCount}
                  onChange={(e) => setPointsCount(Number(e.target.value))}
                  className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  প্রতি পয়েন্টের রেট (৳)
                </label>
                <input
                  type="number"
                  min={0}
                  value={laborRate}
                  onChange={(e) => setLaborRate(Number(e.target.value))}
                  className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>
            </div>
          ) : (
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                মজুরির মোট অংক (৳)
              </label>
              <input
                type="number"
                min={0}
                value={contractLabor}
                onChange={(e) => setContractLabor(Number(e.target.value))}
                className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                অতিরিক্ত খরচ (টুলস/ড্রিল)
              </label>
              <input
                type="number"
                min={0}
                value={additionalCost}
                onChange={(e) => setAdditionalCost(Number(e.target.value))}
                className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                পরিবহন ভাড়া (৳)
              </label>
              <input
                type="number"
                min={0}
                value={transportCost}
                onChange={(e) => setTransportCost(Number(e.target.value))}
                className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              ছাড় / ডিসকাউন্ট (৳)
            </label>
            <input
              type="number"
              min={0}
              value={discount}
              onChange={(e) => setDiscount(Number(e.target.value))}
              className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>

          <div className="pt-2">
            <button
              type="button"
              onClick={handleUpdateCosting}
              className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs shadow transition-all flex items-center justify-center gap-2"
            >
              <Check className="w-4 h-4 stroke-[3]" />
              <span>বিলের হিসাব আপডেট ও সেভ করুন</span>
            </button>
          </div>
        </div>

        {/* Right: Payment History Log (7 Cols) */}
        <div className="lg:col-span-7 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                পেমেন্ট ও কিস্তির ইতিহাস ({activeProject.payments.length}টি এন্ট্রি)
              </h2>
              <span className="text-xs text-slate-400">
                মোট পরিশোধ হয়েছে: <strong className="text-emerald-600 dark:text-emerald-400">{formatTaka(costing.paidAmount)}</strong>
              </span>
            </div>

            <button
              onClick={() => setPaymentModalOpen(true)}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold text-xs transition-colors"
            >
              <Plus className="w-3.5 h-3.5 stroke-[3]" />
              <span>টাকা গ্রহণ</span>
            </button>
          </div>

          <div className="space-y-2.5 max-h-[450px] overflow-y-auto pr-1">
            {activeProject.payments.map((p) => (
              <div
                key={p.id}
                className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-2"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-base text-emerald-600 dark:text-emerald-400">
                      {formatTaka(p.amount)}
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                      {p.method}
                    </span>
                    <span className="text-xs text-slate-500 font-mono">{p.date}</span>
                  </div>

                  {(p.referenceNo || p.note) && (
                    <div className="text-xs text-slate-500 mt-1">
                      {p.referenceNo && <span>রশিদ/Trx: {p.referenceNo} </span>}
                      {p.note && <span>• {p.note}</span>}
                    </div>
                  )}
                </div>

                <div className="self-end sm:self-auto">
                  <button
                    onClick={() => handleDeletePayment(p.id)}
                    className="p-1.5 rounded text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40"
                    title="পেমেন্ট মুছে ফেলুন"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}

            {activeProject.payments.length === 0 && (
              <div className="p-8 text-center text-xs text-slate-400 bg-slate-50/50 dark:bg-slate-800/20 rounded-xl border border-dashed border-slate-200 dark:border-slate-800">
                এখনও কোনো পেমেন্ট রেকর্ড যুক্ত করা হয়নি। "টাকা গ্রহণ" বাটনে ক্লিক করে অগ্রিম বা কিস্তি যোগ করুন।
              </div>
            )}
          </div>
        </div>

      </div>

      {/* Add Payment Modal */}
      {paymentModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden flex flex-col">
            <div className="px-5 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-800/50">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                কাস্টমার থেকে পেমেন্ট গ্রহণ
              </h3>
              <button
                onClick={() => setPaymentModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddPayment} className="p-5 space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  টাকার পরিমাণ (৳) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  required
                  min={1}
                  value={payAmount}
                  onChange={(e) => setPayAmount(Number(e.target.value))}
                  className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-mono font-bold text-base focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    পেমেন্টের তারিখ <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    required
                    value={payDate}
                    onChange={(e) => setPayDate(e.target.value)}
                    className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    মাধ্যম
                  </label>
                  <select
                    value={payMethod}
                    onChange={(e) => setPayMethod(e.target.value as any)}
                    className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                  >
                    <option value="নগদ (Cash)">নগদ (Cash)</option>
                    <option value="বিকাশ (bKash)">বিকাশ (bKash)</option>
                    <option value="নগদ (Nagad)">নগদ (Nagad)</option>
                    <option value="রকেট (Rocket)">রকেট (Rocket)</option>
                    <option value="ব্যাংক ট্রান্সফার">ব্যাংক ট্রান্সফার</option>
                    <option value="চেক">চেক</option>
                    <option value="অন্যান্য">অন্যান্য</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  রশিদ নং / TrxID (ঐচ্ছিক)
                </label>
                <input
                  type="text"
                  placeholder="যেমন: BK-998242"
                  value={payRef}
                  onChange={(e) => setPayRef(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  পেমেন্ট সংক্রান্ত নোট
                </label>
                <input
                  type="text"
                  placeholder="যেমন: ১ম কিস্তি বা কেবল ক্রয়ের জন্য"
                  value={payNote}
                  onChange={(e) => setPayNote(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2"
                >
                  <Check className="w-4 h-4 stroke-[3]" />
                  <span>পেমেন্ট নিশ্চিত করুন</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
