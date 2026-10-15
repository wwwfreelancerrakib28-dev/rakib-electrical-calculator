import React, { useState } from 'react';
import { 
  Zap, 
  UserPlus, 
  FolderPlus, 
  ArrowRight,
  Calculator
} from 'lucide-react';
import { AppState, Customer, Project } from '../types';

interface DashboardViewProps {
  state: AppState;
  onNavigateTo: (tab: any) => void;
  onSelectProject: (id: string) => void;
  onOpenQuickAction: (actionType?: 'customer' | 'project' | 'room' | 'calc') => void;
  onAddCustomer?: (customer: Customer) => void;
  onAddProject?: (project: Project) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  onNavigateTo,
  onAddCustomer,
  onAddProject
}) => {
  const [activeSubView, setActiveSubView] = useState<
    'home' | 'create-customer' | 'create-project' | 'video-auto-calc'
  >('home');

  // Customer Form State
  const [clientName, setClientName] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [note, setNote] = useState('');

  // Project Form State
  const [projectName, setProjectName] = useState('');
  const [totalRooms, setTotalRooms] = useState('5');
  const [selectedRoom, setSelectedRoom] = useState('রুম ১');

  // Video Formula Auto Calculator State (Watt Input)
  const [inputWatt, setInputWatt] = useState('355');
  const [calcResult, setCalcResult] = useState<{
    amp: number;
    runningAmp: number;
    subCable: string;
    mcb: string;
    rccb: string;
    dpMcb: string;
    mainCable: string;
    mainMcb: string;
  } | null>(null);

  // Video Formula Calculation Logic: I = P / (V * 0.9), and Safety 3x margin
  const handleRunVideoCalc = (e: React.FormEvent) => {
    e.preventDefault();
    const watt = parseFloat(inputWatt) || 0;
    const voltage = state.settings?.defaultVoltage || 220;
    
    // Running Ampere with 0.9 Power Factor
    const currentAmp = Math.round((watt / (voltage * 0.9)) * 100) / 100;
    // 3x Safety Margin as explained in video
    const safetyAmp = Math.round(currentAmp * 3 * 10) / 10;

    let subCable = '1.0 RM তার';
    let mcb = '6A MCB';
    let rccb = '25A (30mA) RCCB';
    let dpMcb = '16A DP MCB';
    let mainCable = '2.5 RM তার';
    let mainMcb = '20A Main MCB';

    if (watt <= 400) {
      subCable = '1.0 RM বা 1.5 RM (সুইচবোর্ড থেকে বাতি/ফ্যান)';
      mcb = '6A MCB';
      rccb = '25A RCCB';
      dpMcb = '16A DP MCB';
      mainCable = '2.5 RM মেইন তার';
      mainMcb = '16A Main MCB';
    } else if (watt <= 1500) {
      subCable = '1.5 RM (রুমের লাইটিং ও ছোট সকেট লাইন)';
      mcb = '10A MCB';
      rccb = '25A RCCB';
      dpMcb = '16A DP MCB';
      mainCable = '2.5 RM মেইন তার';
      mainMcb = '20A Main MCB';
    } else if (watt <= 3500) {
      subCable = '2.5 RM (পাওয়ার ও ফ্রিজ লাইন)';
      mcb = '16A MCB';
      rccb = '40A RCCB';
      dpMcb = '32A DP MCB';
      mainCable = '4.0 RM মেইন তার';
      mainMcb = '32A Main MCB';
    } else {
      subCable = '4.0 RM বা তার বেশি (এসি ও হেভি লোড)';
      mcb = '20A/32A MCB';
      rccb = '40A/63A RCCB';
      dpMcb = '40/63A DP MCB';
      mainCable = '6.0 RM মেইন তার';
      mainMcb = '40A/63A Main MCB';
    }

    setCalcResult({
      amp: currentAmp,
      runningAmp: safetyAmp,
      subCable,
      mcb,
      rccb,
      dpMcb,
      mainCable,
      mainMcb
    });
  };

  const handleSaveCustomer = (e: React.FormEvent) => {
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
    setActiveSubView('home');
  };

  const handleSaveProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!projectName.trim()) {
      alert('প্রজেক্টের নাম লিখুন');
      return;
    }

    const newProject: Project = {
      id: `proj-${Date.now()}`,
      name: projectName,
      customerName: clientName || 'সাধারণ কাস্টমার',
      address: 'ঢাকা',
      phase: '1-Phase (220V)',
      voltage: 220,
      powerFactor: 0.9,
      diversityFactor: 0.8,
      status: 'চলমান',
      rooms: [],
      costing: {
        materialsCost: 0,
        laborCost: 0,
        totalBill: 0,
        paidAmount: 0,
        dueAmount: 0
      },
      createdAt: new Date().toISOString()
    };

    if (onAddProject) {
      onAddProject(newProject);
    }

    alert('প্রজেক্ট ও রুম সফলভাবে তৈরি হয়েছে!');
    setProjectName('');
    setActiveSubView('home');
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

      {/* SUB VIEW 1: HOME (GRID OF SQUARE BOX OPTIONS) */}
      {activeSubView === 'home' && (
        <div className="space-y-6">
          <div className="text-center py-1">
            <h2 className="text-xs font-bold text-slate-400">একটি অপশন সিলেক্ট করুন:</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Box 1: New User Account */}
            <div
              onClick={() => setActiveSubView('create-customer')}
              className="p-5 rounded-3xl bg-slate-900 border border-amber-500/30 hover:border-amber-500 shadow-xl cursor-pointer transition-all hover:scale-[1.02] group space-y-3 flex flex-col justify-between"
            >
              <div className="w-10 h-10 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-black">
                <UserPlus className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-xs sm:text-sm font-black text-white group-hover:text-amber-400 transition-colors">
                  নতুন ইউজার অ্যাকাউন্ট তৈরি
                </h3>
                <p className="text-[10px] text-slate-400 mt-1">ক্লায়েন্টের নাম, ফোন ও নোট সংরক্ষণ করুন।</p>
              </div>
              <div className="flex items-center gap-1 text-[11px] font-bold text-amber-400 pt-1">
                <span>কাজ শুরু করুন</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>

            {/* Box 2: Room & Project Selection */}
            <div
              onClick={() => setActiveSubView('create-project')}
              className="p-5 rounded-3xl bg-slate-900 border border-emerald-500/30 hover:border-emerald-500 shadow-xl cursor-pointer transition-all hover:scale-[1.02] group space-y-3 flex flex-col justify-between"
            >
              <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-black">
                <FolderPlus className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-xs sm:text-sm font-black text-white group-hover:text-emerald-400 transition-colors">
                  ঘরের সংখ্যা ও রুম নির্বাচন
                </h3>
                <p className="text-[10px] text-slate-400 mt-1">প্রজেক্টের রুম সংখ্যা ও লোড সেটআপ করুন।</p>
              </div>
              <div className="flex items-center gap-1 text-[11px] font-bold text-emerald-400 pt-1">
                <span>কাজ শুরু করুন</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>

            {/* Box 3: Video Formula Auto Calculator */}
            <div
              onClick={() => setActiveSubView('video-auto-calc')}
              className="p-5 rounded-3xl bg-slate-900 border border-sky-500/30 hover:border-sky-500 shadow-xl cursor-pointer transition-all hover:scale-[1.02] group space-y-3 flex flex-col justify-between sm:col-span-2"
            >
              <div className="w-10 h-10 rounded-2xl bg-sky-500/20 text-sky-400 flex items-center justify-center font-black">
                <Calculator className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-xs sm:text-sm font-black text-white group-hover:text-sky-400 transition-colors">
                  ⚡ ভিডিওর ফর্মুলা অনুযায়ী অটো তার ও ব্রেকার ক্যালকুলেটর
                </h3>
                <p className="text-[10px] text-slate-400 mt-1">
                  মোট ওয়াট ও পাওয়ার ফ্যাক্টর (0.9) হিসাব করে সঠিক RM তার, MCB, RCCB, DP MCB ও মেইন তার নির্ণয় করুন।
                </p>
              </div>
              <div className="flex items-center gap-1 text-[11px] font-bold text-sky-400 pt-1">
                <span>ক্যালকুলেটরে ঢুকুন</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>

          </div>
        </div>
      )}

      {/* SUB VIEW: CREATE CUSTOMER */}
      {activeSubView === 'create-customer' && (
        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl space-y-5 animate-in fade-in">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h2 className="text-sm font-black text-amber-400">নতুন ইউজার অ্যাকাউন্ট তৈরি করুন</h2>
            <button onClick={() => setActiveSubView('home')} className="text-xs font-bold text-slate-400 hover:text-white px-3 py-1 rounded-xl bg-slate-800">← ফিরে যান</button>
          </div>
          <form onSubmit={handleSaveCustomer} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">ক্লায়েন্টের নাম:</label>
              <input type="text" value={clientName} onChange={(e) => setClientName(e.target.value)} placeholder="যেমন: রহিম সাহেব" className="w-full px-4 py-3 text-xs font-bold rounded-2xl border border-slate-700 bg-slate-950 text-white focus:outline-none focus:ring-2 focus:ring-amber-500" />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">মোবাইল নম্বর:</label>
              <input type="text" value={mobileNumber} onChange={(e) => setMobileNumber(e.target.value)} placeholder="017xxxxxxxx" className="w-full px-4 py-3 text-xs font-bold rounded-2xl border border-slate-700 bg-slate-950 text-white focus:outline-none focus:ring-2 focus:ring-amber-500" />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">নোট (Note):</label>
              <textarea rows={3} value={note} onChange={(e) => setNote(e.target.value)} placeholder="জরুরি নোট বা কাজের বিবরণ" className="w-full px-4 py-3 text-xs font-bold rounded-2xl border border-slate-700 bg-slate-950 text-white focus:outline-none focus:ring-2 focus:ring-amber-500 resize-none" />
            </div>
            <button type="submit" className="w-full py-3 rounded-2xl bg-amber-500 text-slate-950 font-black text-xs shadow-lg">সেভ করুন</button>
          </form>
        </div>
      )}

      {/* SUB VIEW: CREATE PROJECT */}
      {activeSubView === 'create-project' && (
        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl space-y-5 animate-in fade-in">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h2 className="text-sm font-black text-emerald-400">ঘরের সংখ্যা ও রুম নির্বাচন</h2>
            <button onClick={() => setActiveSubView('home')} className="text-xs font-bold text-slate-400 hover:text-white px-3 py-1 rounded-xl bg-slate-800">← ফিরে যান</button>
          </div>
          <form onSubmit={handleSaveProject} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">প্রজেক্ট / বাড়ির নাম:</label>
              <input type="text" value={projectName} onChange={(e) => setProjectName(e.target.value)} placeholder="যেমন: ডুপ্লেক্স বাড়ি" className="w-full px-4 py-3 text-xs font-bold rounded-2xl border border-slate-700 bg-slate-950 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">মোট ঘর:</label>
                <input type="number" value={totalRooms} onChange={(e) => setTotalRooms(e.target.value)} className="w-full px-4 py-3 text-xs font-bold rounded-2xl border border-slate-700 bg-slate-950 text-white focus:outline-none" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">রুম সিলেক্ট:</label>
                <select value={selectedRoom} onChange={(e) => setSelectedRoom(e.target.value)} className="w-full px-4 py-3 text-xs font-bold rounded-2xl border border-slate-700 bg-slate-950 text-emerald-400 focus:outline-none">
                  <option value="রুম ১">রুম ১</option>
                  <option value="রুম ২">রুম ২</option>
                  <option value="মাস্টার বেড">মাস্টার বেড</option>
                </select>
              </div>
            </div>
            <button type="submit" className="w-full py-3 rounded-2xl bg-emerald-500 text-slate-950 font-black text-xs shadow-lg">প্রজেক্ট সেভ করুন</button>
          </form>
        </div>
      )}

      {/* SUB VIEW: VIDEO FORMULA AUTO CALCULATOR */}
      {activeSubView === 'video-auto-calc' && (
        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl space-y-5 animate-in fade-in">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h2 className="text-sm font-black text-sky-400">⚡ অটো তার ও ব্রেকার ক্যালকুলেটর (ভিডিও ফর্মুলা)</h2>
            <button onClick={() => setActiveSubView('home')} className="text-xs font-bold text-slate-400 hover:text-white px-3 py-1 rounded-xl bg-slate-800">← ফিরে যান</button>
          </div>

          <form onSubmit={handleRunVideoCalc} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">মোট ওয়াট (Total Watt) লিখুন:</label>
              <input 
                type="number" 
                value={inputWatt} 
                onChange={(e) => setInputWatt(e.target.value)} 
                placeholder="যেমন: 355" 
                className="w-full px-4 py-3 text-xs font-bold rounded-2xl border border-slate-700 bg-slate-950 text-white focus:outline-none focus:ring-2 focus:ring-sky-500" 
              />
              <p className="text-[10px] text-slate-400 mt-1">
                * সিস্টেম ভোল্টেজ: {state.settings?.defaultVoltage || 220}V এবং পাওয়ার ফ্যাক্টর: 0.9 ধরা হয়েছে।
              </p>
            </div>
            <button type="submit" className="w-full py-3 rounded-2xl bg-sky-500 text-slate-950 font-black text-xs shadow-lg shadow-sky-500/20">
              হিসাব করুন
            </button>
          </form>

          {calcResult && (
            <div className="p-4 rounded-2xl bg-slate-950 border border-sky-500/40 space-y-3 text-xs">
              <div className="text-center pb-2 border-b border-slate-800 space-y-1">
                <div>
                  <span className="text-slate-400">রানিং কারেন্ট (I): </span>
                  <span className="text-amber-400 font-black text-sm">{calcResult.amp} A</span>
                </div>
                <div>
                  <span className="text-slate-400">নিরাপদ সেফটি মার্জিন (৩ গুণ): </span>
                  <span className="text-emerald-400 font-black text-sm">{calcResult.runningAmp} A</span>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between p-2 rounded-xl bg-slate-900">
                  <span className="text-slate-300 font-bold">তারের সাইজ (Cable RM):</span>
                  <span className="text-sky-400 font-black">{calcResult.subCable}</span>
                </div>
                <div className="flex justify-between p-2 rounded-xl bg-slate-900">
                  <span className="text-slate-300 font-bold">সার্কিট ব্রেকার (MCB):</span>
                  <span className="text-emerald-400 font-black">{calcResult.mcb}</span>
                </div>
                <div className="flex justify-between p-2 rounded-xl bg-slate-900">
                  <span className="text-slate-300 font-bold">প্রটেকশন (RCCB):</span>
                  <span className="text-purple-400 font-black">{calcResult.rccb}</span>
                </div>
                <div className="flex justify-between p-2 rounded-xl bg-slate-900">
                  <span className="text-slate-300 font-bold">মেইন ডাবল পোল (DP MCB):</span>
                  <span className="text-amber-400 font-black">{calcResult.dpMcb}</span>
                </div>
                <div className="flex justify-between p-2 rounded-xl bg-slate-900">
                  <span className="text-slate-300 font-bold">মেইন মিটারের তার:</span>
                  <span className="text-sky-400 font-black">{calcResult.mainCable}</span>
                </div>
                <div className="flex justify-between p-2 rounded-xl bg-slate-900">
                  <span className="text-slate-300 font-bold">মেইন ব্রেকার (Main MCB):</span>
                  <span className="text-emerald-400 font-black">{calcResult.mainMcb}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

    </div>
  );
};
