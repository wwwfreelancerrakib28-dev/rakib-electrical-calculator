import React, { useState } from 'react';
import { 
  Zap, 
  UserPlus
} from 'lucide-react';
import { AppState, Customer } from '../types';

interface DashboardViewProps {
  state: AppState;
  onNavigateTo: (tab: any) => void;
  onSelectProject: (id: string) => void;
  onOpenQuickAction: (actionType?: 'customer' | 'project' | 'room' | 'calc') => void;
  onAddCustomer?: (customer: Customer) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  onNavigateTo,
  onAddCustomer
}) => {
  const [clientName, setClientName] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [note, setNote] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName.trim()) {
      alert('দয়া করে ক্লায়েন্টের নাম লিখুন');
      return;
    }

    const newCustomer: Customer = {
      id: `cust-${Date.now()}`,
      name: clientName,
      phone: mobileNumber,
      address: note,
      createdAt: new Date().toISOString()
    };

    if (onAddCustomer) {
      onAddCustomer(newCustomer);
    }

    alert('ইউজার অ্যাকাউন্ট সফলভাবে তৈরি হয়েছে!');
    setClientName('');
    setMobileNumber('');
    setNote('');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300 max-w-2xl mx-auto">
        
      {/* Top Header Bar */}
      <div className="flex items-center justify-between p-3.5 sm:p-4 rounded-2xl bg-slate-900 border border-slate-800 shadow-lg">
        <div className="flex items-center gap-2.5">
          <span className="p-2 rounded-xl bg-amber-500/20 text-amber-400">
            <Zap className="w-5 h-5 fill-amber-400" />
          </span>
          <h1 className="text-base sm:text-lg font-black text-amber-400 tracking-tight">
            এডমিন ড্যাশবোর্ড
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onNavigateTo('load-calculator')}
            className="px-3.5 py-2 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 border border-emerald-500/40 text-emerald-400 font-bold text-xs flex items-center gap-1.5 transition-all"
          >
            <span>💡</span>
            <span>ওয়াট ক্যালক</span>
          </button>

          <button
            onClick={() => {
              if (confirm('লগআউট করতে চান?')) {
                onNavigateTo('settings');
              }
            }}
            className="px-3.5 py-2 rounded-xl bg-rose-600/20 hover:bg-rose-600/30 border border-rose-500/40 text-rose-400 font-bold text-xs transition-all"
          >
            লগআউট
          </button>
        </div>
      </div>

      {/* New User Account Creation Form (Matching Picture) */}
      <div className="p-6 sm:p-8 rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl space-y-6">
        
        <div className="flex items-center gap-2 pb-4 border-b border-slate-800">
          <span className="text-amber-500 font-black text-lg">
            <UserPlus className="w-5 h-5 inline mr-1" />+
          </span>
          <h2 className="text-base sm:text-lg font-black text-amber-400">
            নতুন ইউজার অ্যাকাউন্ট তৈরি করুন
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Client Name */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-300">
              ক্লায়েন্টের নাম:
            </label>
            <input
              type="text"
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
              placeholder="যেমন: রহিম সাহেব"
              className="w-full px-4 py-3 text-xs font-bold rounded-2xl border border-slate-700 bg-slate-950/80 text-white focus:ring-2 focus:ring-amber-500 focus:outline-none placeholder:text-slate-600"
            />
          </div>

          {/* Mobile Number */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-300">
              মোবাইল নম্বর:
            </label>
            <input
              type="text"
              value={mobileNumber}
              onChange={(e) => setMobileNumber(e.target.value)}
              placeholder="017xxxxxxxx"
              className="w-full px-4 py-3 text-xs font-bold rounded-2xl border border-slate-700 bg-slate-950/80 text-white focus:ring-2 focus:ring-amber-500 focus:outline-none placeholder:text-slate-600"
            />
          </div>

          {/* Note */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-300">
              নোট (Note):
            </label>
            <textarea
              rows={3}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="জরুরি নোট বা কাজের বিবরণ"
              className="w-full px-4 py-3 text-xs font-bold rounded-2xl border border-slate-700 bg-slate-950/80 text-white focus:ring-2 focus:ring-amber-500 focus:outline-none placeholder:text-slate-600 resize-none"
            />
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-3.5 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs transition-all shadow-lg shadow-amber-500/20 active:scale-95"
            >
              সেভ করুন / অ্যাকাউন্ট তৈরি করুন
            </button>
          </div>
        </form>

      </div>

    </div>
  );
};
