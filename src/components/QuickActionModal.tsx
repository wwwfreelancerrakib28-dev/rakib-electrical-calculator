import React, { useState } from 'react';
import { 
  X, 
  UserPlus, 
  Building2, 
  DoorOpen, 
  Calculator, 
  Check, 
  AlertCircle 
} from 'lucide-react';
import { Customer, Project, Room, RoomType, PhaseType, WorkStatus } from '../types';

interface QuickActionModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultAction?: 'customer' | 'project' | 'room' | 'calc';
  customers: Customer[];
  projects: Project[];
  activeProjectId: string | null;
  onAddCustomer: (customer: Customer) => void;
  onAddProject: (project: Project) => void;
  onAddRoom: (projectId: string, room: Room) => void;
  onNavigateTo: (tab: any) => void;
}

export const QuickActionModal: React.FC<QuickActionModalProps> = ({
  isOpen,
  onClose,
  defaultAction = 'customer',
  customers,
  projects,
  activeProjectId,
  onAddCustomer,
  onAddProject,
  onAddRoom,
  onNavigateTo
}) => {
  const [selectedType, setSelectedType] = useState<'customer' | 'project' | 'room' | 'calc'>(defaultAction);
  const [errorMsg, setErrorMsg] = useState('');

  // Customer form state
  const [custName, setCustName] = useState('');
  const [custPhone, setCustPhone] = useState('');
  const [custAddress, setCustAddress] = useState('');
  const [custDesc, setCustDesc] = useState('');

  // Project form state
  const [projName, setProjName] = useState('');
  const [projCustId, setProjCustId] = useState(customers[0]?.id || '');
  const [projAddress, setProjAddress] = useState('');
  const [projPhase, setProjPhase] = useState<PhaseType>('1-Phase (সিঙ্গেল ফেজ)');
  const [projFloors, setProjFloors] = useState(1);

  // Room form state
  const [roomName, setRoomName] = useState('');
  const [roomType, setRoomType] = useState<RoomType>('বেডরুম');
  const [targetProjId, setTargetProjId] = useState(activeProjectId || projects[0]?.id || '');

  if (!isOpen) return null;

  const handleCreateCustomer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!custName.trim()) {
      setErrorMsg('কাস্টমারের নাম প্রদান করুন।');
      return;
    }
    if (!custPhone.trim()) {
      setErrorMsg('মোবাইল নম্বর প্রদান করুন।');
      return;
    }

    // Check duplicate phone
    const exists = customers.some((c) => c.phone.replace(/[^0-9]/g, '') === custPhone.replace(/[^0-9]/g, ''));
    if (exists) {
      if (!window.confirm('এই ফোন নম্বরের একজন কাস্টমার ইতোমধ্যে রয়েছে। আপনি কি তবুও নতুন হিসেবে যুক্ত করতে চান?')) {
        return;
      }
    }

    const newCust: Customer = {
      id: `cust-${Date.now()}`,
      name: custName.trim(),
      phone: custPhone.trim(),
      address: custAddress.trim(),
      workDescription: custDesc.trim(),
      status: 'চলমান',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    onAddCustomer(newCust);
    onClose();
  };

  const handleCreateProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!projName.trim()) {
      setErrorMsg('প্রজেক্ট বা বাড়ির নাম প্রদান করুন।');
      return;
    }
    const customer = customers.find((c) => c.id === projCustId) || customers[0];

    const newProj: Project = {
      id: `proj-${Date.now()}`,
      customerId: customer?.id || 'unknown',
      customerName: customer?.name || 'কাস্টমার',
      name: projName.trim(),
      address: projAddress.trim() || customer?.address || '',
      buildingType: 'আবাসিক বাড়ি',
      floors: Number(projFloors) || 1,
      voltage: projPhase.includes('3-Phase') ? 400 : 220,
      phase: projPhase,
      powerFactor: 0.85,
      diversityFactor: 0.8,
      status: 'চলমান',
      rooms: [],
      commonMaterials: [],
      costing: {
        materialsCost: 0,
        laborCostType: 'পয়েন্ট হিসাব',
        laborRate: 250,
        pointsCount: 0,
        laborTotal: 0,
        additionalCost: 0,
        transportCost: 0,
        discount: 0,
        totalBill: 0,
        paidAmount: 0,
        dueAmount: 0
      },
      payments: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    onAddProject(newProj);
    onClose();
  };

  const handleCreateRoom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetProjId) {
      setErrorMsg('দয়া করে প্রথমে একটি প্রজেক্ট তৈরি করুন বা নির্বাচন করুন।');
      return;
    }
    const finalName = roomName.trim() || roomType;

    const newRoom: Room = {
      id: `room-${Date.now()}`,
      projectId: targetProjId,
      name: finalName,
      type: roomType,
      status: 'চলমান',
      devices: [],
      materials: [],
      totalWatts: 0,
      totalAmps: 0,
      estimatedMaterialCost: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    onAddRoom(targetProjId, newRoom);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/60 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-800/50">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
              দ্রুত কাজের শর্টকাট (Quick Entry)
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              যে কোনো নতুন রেকর্ড বা হিসাব এক ক্লিকে তৈরি করুন
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-700"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selector */}
        <div className="grid grid-cols-4 gap-1 p-2 bg-slate-100 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 text-xs">
          <button
            onClick={() => { setSelectedType('customer'); setErrorMsg(''); }}
            className={`flex flex-col items-center gap-1 py-2 rounded-lg font-bold transition-all ${
              selectedType === 'customer'
                ? 'bg-amber-500 text-slate-950 shadow'
                : 'text-slate-600 dark:text-slate-400 hover:bg-white dark:hover:bg-slate-800'
            }`}
          >
            <UserPlus className="w-4 h-4" />
            <span>নতুন কাস্টমার</span>
          </button>

          <button
            onClick={() => { setSelectedType('project'); setErrorMsg(''); }}
            className={`flex flex-col items-center gap-1 py-2 rounded-lg font-bold transition-all ${
              selectedType === 'project'
                ? 'bg-amber-500 text-slate-950 shadow'
                : 'text-slate-600 dark:text-slate-400 hover:bg-white dark:hover:bg-slate-800'
            }`}
          >
            <Building2 className="w-4 h-4" />
            <span>নতুন প্রজেক্ট</span>
          </button>

          <button
            onClick={() => { setSelectedType('room'); setErrorMsg(''); }}
            className={`flex flex-col items-center gap-1 py-2 rounded-lg font-bold transition-all ${
              selectedType === 'room'
                ? 'bg-amber-500 text-slate-950 shadow'
                : 'text-slate-600 dark:text-slate-400 hover:bg-white dark:hover:bg-slate-800'
            }`}
          >
            <DoorOpen className="w-4 h-4" />
            <span>নতুন রুম</span>
          </button>

          <button
            onClick={() => {
              onClose();
              onNavigateTo('load-calculator');
            }}
            className="flex flex-col items-center gap-1 py-2 rounded-lg font-bold text-slate-600 dark:text-slate-400 hover:bg-white dark:hover:bg-slate-800 transition-all"
          >
            <Calculator className="w-4 h-4 text-amber-500" />
            <span>নতুন হিসাব ↗</span>
          </button>
        </div>

        {/* Error message */}
        {errorMsg && (
          <div className="mx-5 mt-3 p-2.5 rounded-lg bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-900 text-red-600 dark:text-red-400 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Form contents */}
        <div className="p-5 overflow-y-auto flex-1">
          {selectedType === 'customer' && (
            <form onSubmit={handleCreateCustomer} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  কাস্টমারের নাম <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="যেমন: জনাব রফিকুল ইসলাম"
                  value={custName}
                  onChange={(e) => setCustName(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  মোবাইল নম্বর <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  required
                  placeholder="যেমন: 01711-234567"
                  value={custPhone}
                  onChange={(e) => setCustPhone(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  ঠিকানা
                </label>
                <input
                  type="text"
                  placeholder="যেমন: বাড়ি ১২, রোড ৮/এ, ধানমন্ডি"
                  value={custAddress}
                  onChange={(e) => setCustAddress(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  কাজের বিবরণ বা নোট
                </label>
                <textarea
                  rows={2}
                  placeholder="যেমন: ৩ তলা বাড়ির সম্পূর্ণ ওয়্যারিং"
                  value={custDesc}
                  onChange={(e) => setCustDesc(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2"
                >
                  <Check className="w-4 h-4 stroke-[3]" />
                  <span>কাস্টমার সংরক্ষণ করুন</span>
                </button>
              </div>
            </form>
          )}

          {selectedType === 'project' && (
            <form onSubmit={handleCreateProject} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  প্রজেক্ট বা বাড়ির নাম <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="যেমন: রফিক সাহেবের ডুপ্লেক্স বাড়ি"
                  value={projName}
                  onChange={(e) => setProjName(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  কাস্টমার নির্বাচন করুন <span className="text-red-500">*</span>
                </label>
                <select
                  value={projCustId}
                  onChange={(e) => setProjCustId(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                >
                  {customers.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} ({c.phone})
                    </option>
                  ))}
                  {customers.length === 0 && <option value="">কোনো কাস্টমার নেই</option>}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    বিদ্যুৎ ফেজ
                  </label>
                  <select
                    value={projPhase}
                    onChange={(e) => setProjPhase(e.target.value as PhaseType)}
                    className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                  >
                    <option value="1-Phase (সিঙ্গেল ফেজ)">১-ফেজ (২২০V)</option>
                    <option value="3-Phase (থ্রি ফেজ)">৩-ফেজ (৪১৫V)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    কয় তলা ভবন?
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={50}
                    value={projFloors}
                    onChange={(e) => setProjFloors(Number(e.target.value))}
                    className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  প্রজেক্টের অবস্থান / ঠিকানা
                </label>
                <input
                  type="text"
                  placeholder="যেমন: ঢাকা, ধানমন্ডি"
                  value={projAddress}
                  onChange={(e) => setProjAddress(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2"
                >
                  <Check className="w-4 h-4 stroke-[3]" />
                  <span>প্রজেক্ট তৈরি করুন</span>
                </button>
              </div>
            </form>
          )}

          {selectedType === 'room' && (
            <form onSubmit={handleCreateRoom} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  কোন প্রজেক্টে যোগ হবে? <span className="text-red-500">*</span>
                </label>
                <select
                  value={targetProjId}
                  onChange={(e) => setTargetProjId(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                >
                  {projects.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} ({p.customerName})
                    </option>
                  ))}
                  {projects.length === 0 && <option value="">কোনো প্রজেক্ট নেই (আগে প্রজেক্ট বানান)</option>}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  রুমের ধরন
                </label>
                <select
                  value={roomType}
                  onChange={(e) => setRoomType(e.target.value as RoomType)}
                  className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                >
                  <option value="বেডরুম">বেডরুম</option>
                  <option value="ড্রয়িং রুম">ড্রয়িং রুম</option>
                  <option value="ডাইনিং রুম">ডাইনিং রুম</option>
                  <option value="রান্নাঘর">রান্নাঘর</option>
                  <option value="বাথরুম">বাথরুম</option>
                  <option value="বারান্দা">বারান্দা</option>
                  <option value="সিঁড়িঘর">সিঁড়িঘর</option>
                  <option value="গ্যারেজ">গ্যারেজ</option>
                  <option value="দোকান">দোকান</option>
                  <option value="অফিস">অফিস</option>
                  <option value="ছাদ">ছাদ</option>
                  <option value="অন্যান্য">অন্যান্য</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  রুমের নির্দিষ্ট নাম (ঐচ্ছিক)
                </label>
                <input
                  type="text"
                  placeholder={`যেমন: মাস্টার ${roomType} বা অতিথি রুম`}
                  value={roomName}
                  onChange={(e) => setRoomName(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2"
                >
                  <Check className="w-4 h-4 stroke-[3]" />
                  <span>রুম যুক্ত করুন</span>
                </button>
              </div>
            </form>
          )}
        </div>

      </div>
    </div>
  );
};
