import React, { useState } from 'react';
import { 
  Building2, 
  Plus, 
  Search, 
  MapPin, 
  Layers, 
  Zap, 
  Calendar, 
  Edit2, 
  Trash2, 
  ArrowRight, 
  DoorOpen, 
  Check, 
  Copy,
  Receipt
} from 'lucide-react';
import { Project, Customer, PhaseType, WorkStatus } from '../types';
import { formatTaka, formatWatts } from '../utils/numberFormat';

interface ProjectManagementProps {
  projects: Project[];
  customers: Customer[];
  activeProjectId: string | null;
  onSelectProject: (id: string) => void;
  onAddProject: (project: Project) => void;
  onUpdateProject: (project: Project) => void;
  onDeleteProject: (id: string) => void;
  onNavigateTo: (tab: any) => void;
  onOpenQuickAction: (actionType?: 'customer' | 'project' | 'room' | 'calc') => void;
}

export const ProjectManagementView: React.FC<ProjectManagementProps> = ({
  projects,
  customers,
  activeProjectId,
  onSelectProject,
  onAddProject,
  onUpdateProject,
  onDeleteProject,
  onNavigateTo,
  onOpenQuickAction
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);

  // Form fields
  const [name, setName] = useState('');
  const [customerId, setCustomerId] = useState(customers[0]?.id || '');
  const [address, setAddress] = useState('');
  const [buildingType, setBuildingType] = useState<Project['buildingType']>('আবাসিক বাড়ি');
  const [floors, setFloors] = useState(1);
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [phase, setPhase] = useState<PhaseType>('1-Phase (সিঙ্গেল ফেজ)');
  const [voltage, setVoltage] = useState(220);
  const [powerFactor, setPowerFactor] = useState(0.85);
  const [diversityFactor, setDiversityFactor] = useState(0.8);
  const [status, setStatus] = useState<WorkStatus>('চলমান');

  const filteredProjects = projects.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.address.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || p.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const openCreateModal = () => {
    setEditingProject(null);
    setName('');
    setCustomerId(customers[0]?.id || '');
    setAddress('');
    setBuildingType('আবাসিক বাড়ি');
    setFloors(1);
    setDescription('');
    setStartDate(new Date().toISOString().split('T')[0]);
    setEndDate('');
    setPhase('1-Phase (সিঙ্গেল ফেজ)');
    setVoltage(220);
    setPowerFactor(0.85);
    setDiversityFactor(0.8);
    setStatus('চলমান');
    setModalOpen(true);
  };

  const openEditModal = (p: Project) => {
    setEditingProject(p);
    setName(p.name);
    setCustomerId(p.customerId);
    setAddress(p.address);
    setBuildingType(p.buildingType);
    setFloors(p.floors);
    setDescription(p.description || '');
    setStartDate(p.startDate || '');
    setEndDate(p.endDate || '');
    setPhase(p.phase);
    setVoltage(p.voltage);
    setPowerFactor(p.powerFactor);
    setDiversityFactor(p.diversityFactor);
    setStatus(p.status);
    setModalOpen(true);
  };

  const handleDuplicateProject = (p: Project) => {
    const duplicated: Project = {
      ...p,
      id: `proj-${Date.now()}`,
      name: `${p.name} (কপি)`,
      rooms: p.rooms.map((r) => ({
        ...r,
        id: `room-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
        devices: r.devices.map((d) => ({ ...d, id: `dev-${Date.now()}-${Math.random().toString(36).substr(2, 4)}` })),
        materials: r.materials.map((m) => ({ ...m, id: `mat-${Date.now()}-${Math.random().toString(36).substr(2, 4)}` }))
      })),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    onAddProject(duplicated);
    onSelectProject(duplicated.id);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const matchedCustomer = customers.find((c) => c.id === customerId);
    const customerName = matchedCustomer ? matchedCustomer.name : 'কাস্টমার';

    if (editingProject) {
      const updated: Project = {
        ...editingProject,
        name: name.trim(),
        customerId,
        customerName,
        address: address.trim(),
        buildingType,
        floors: Number(floors) || 1,
        description: description.trim(),
        startDate,
        endDate,
        phase,
        voltage: Number(voltage),
        powerFactor: Number(powerFactor),
        diversityFactor: Number(diversityFactor),
        status,
        updatedAt: new Date().toISOString()
      };
      onUpdateProject(updated);
    } else {
      const newProj: Project = {
        id: `proj-${Date.now()}`,
        name: name.trim(),
        customerId,
        customerName,
        address: address.trim(),
        buildingType,
        floors: Number(floors) || 1,
        description: description.trim(),
        startDate,
        endDate,
        phase,
        voltage: Number(voltage),
        powerFactor: Number(powerFactor),
        diversityFactor: Number(diversityFactor),
        status,
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
      onSelectProject(newProj.id);
    }
    setModalOpen(false);
  };

  const handleDelete = (p: Project) => {
    if (window.confirm(`আপনি কি নিশ্চিতভাবে "${p.name}" প্রজেক্ট ও এর সব রুমের তথ্য মুছে ফেলতে চান?`)) {
      onDeleteProject(p.id);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white dark:bg-slate-900 p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div>
          <h1 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Building2 className="w-5 h-5 text-amber-500" />
            <span>বাড়ি ও প্রজেক্ট ম্যানেজমেন্ট</span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            বাসাবাড়ির ভবন নির্বাচন, সিঙ্গেল/থ্রি-ফেজ ভোল্টেজ সেটিং এবং রুমগুলোর সমন্বিত ওয়্যারিং
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 active:scale-95 text-slate-950 font-bold text-sm shadow-md transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>নতুন প্রজেক্ট তৈরি</span>
        </button>
      </div>

      {/* Filter and Search */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white dark:bg-slate-900 p-3 rounded-xl border border-slate-200 dark:border-slate-800">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="প্রজেক্ট বা কাস্টমারের নাম দিয়ে খুঁজুন..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
        </div>

        <div className="flex items-center gap-1 overflow-x-auto text-xs">
          {['all', 'চলমান', 'পরিকল্পনাধীন', 'সম্পন্ন'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-colors ${
                statusFilter === st
                  ? 'bg-amber-500 text-slate-950 font-bold'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
              }`}
            >
              {st === 'all' ? 'সকল' : st}
            </button>
          ))}
        </div>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredProjects.map((p) => {
          const totalWatts = p.rooms.reduce((sum, r) => sum + r.totalWatts, 0);
          const isCurrent = p.id === activeProjectId;

          return (
            <div
              key={p.id}
              className={`bg-white dark:bg-slate-900 rounded-2xl border transition-all p-5 flex flex-col justify-between ${
                isCurrent
                  ? 'border-amber-500 ring-2 ring-amber-500/20 shadow-md'
                  : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 shadow-sm'
              }`}
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
                      {p.buildingType} • {p.floors} তলা
                    </span>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white mt-0.5">
                      {p.name}
                    </h3>
                  </div>

                  <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                    {p.status}
                  </span>
                </div>

                <div className="text-xs text-slate-600 dark:text-slate-400 space-y-1 mb-4">
                  <div className="font-semibold text-slate-800 dark:text-slate-200">
                    কাস্টমার: {p.customerName}
                  </div>
                  <div className="flex items-center gap-1 truncate text-slate-500">
                    <MapPin className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                    <span>{p.address || 'ঠিকানা দেওয়া নেই'}</span>
                  </div>
                </div>

                {/* Electrical Specs Badge */}
                <div className="grid grid-cols-2 gap-2 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 text-xs mb-4">
                  <div>
                    <span className="text-[10px] text-slate-400 block">সাপ্লাই ও ভোল্টেজ</span>
                    <span className="font-bold text-slate-800 dark:text-slate-200">
                      {p.voltage}V ({p.phase.includes('3-Phase') ? '3-Phase' : '1-Phase'})
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">মোট সংযুক্ত লোড</span>
                    <span className="font-bold text-amber-600 dark:text-amber-400">
                      {formatWatts(totalWatts)}
                    </span>
                  </div>
                </div>

                {/* Financial Summary */}
                <div className="flex items-center justify-between text-xs py-2 border-t border-b border-slate-100 dark:border-slate-800 mb-4">
                  <div>
                    <span className="text-[10px] text-slate-400 block">মোট বিল</span>
                    <span className="font-bold text-slate-900 dark:text-white">
                      {formatTaka(p.costing.totalBill)}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 block">বাকি টাকা</span>
                    <span className="font-bold text-rose-600 dark:text-rose-400">
                      {formatTaka(p.costing.dueAmount)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2 pt-2">
                <button
                  onClick={() => {
                    onSelectProject(p.id);
                    onNavigateTo('rooms');
                  }}
                  className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm transition-all"
                >
                  <DoorOpen className="w-4 h-4" />
                  <span>রুম ও লোড পরিচালনা করুন ({p.rooms.length}টি রুম)</span>
                </button>

                <div className="flex items-center justify-between gap-1">
                  <button
                    onClick={() => {
                      onSelectProject(p.id);
                      onNavigateTo('billing');
                    }}
                    className="flex-1 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 text-[11px] font-semibold transition-colors flex items-center justify-center gap-1"
                  >
                    <Receipt className="w-3.5 h-3.5" />
                    <span>বিলিং</span>
                  </button>

                  <button
                    onClick={() => handleDuplicateProject(p)}
                    className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800"
                    title="প্রজেক্টটি কপি করে নতুন প্রজেক্ট তৈরি করুন"
                  >
                    <Copy className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => openEditModal(p)}
                    className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800"
                    title="তথ্য সম্পাদনা করুন"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => handleDelete(p)}
                    className="p-1.5 rounded-lg text-rose-500 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/40"
                    title="প্রজেক্ট মুছে ফেলুন"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

            </div>
          );
        })}

        {filteredProjects.length === 0 && (
          <div className="col-span-full p-12 text-center text-slate-400 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
            কোনো প্রজেক্ট খুঁজে পাওয়া যায়নি। নতুন প্রজেক্ট তৈরি করতে উপরে ক্লিক করুন।
          </div>
        )}
      </div>

      {/* Create / Edit Project Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="px-5 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-800/50">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                {editingProject ? 'প্রজেক্ট সম্পাদনা' : 'নতুন বাড়ি বা প্রজেক্ট যোগ করুন'}
              </h3>
              <button
                onClick={() => setModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-5 overflow-y-auto space-y-3.5 flex-1">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  প্রজেক্টের নাম <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="যেমন: রফিক সাহেবের ডুপ্লেক্স বাড়ি"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  কাস্টমার নির্বাচন করুন <span className="text-red-500">*</span>
                </label>
                <select
                  value={customerId}
                  onChange={(e) => setCustomerId(e.target.value)}
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
                    বাড়ির ধরন
                  </label>
                  <select
                    value={buildingType}
                    onChange={(e) => setBuildingType(e.target.value as any)}
                    className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                  >
                    <option value="আবাসিক বাড়ি">আবাসিক বাড়ি</option>
                    <option value="বাণিজ্যিক ভবন">বাণিজ্যিক ভবন</option>
                    <option value="ফ্ল্যাট / অ্যাপার্টমেন্ট">ফ্ল্যাট / অ্যাপার্টমেন্ট</option>
                    <option value="দোকান / শোরুম">দোকান / শোরুম</option>
                    <option value="ফ্যাক্টরি / ওয়ার্কশপ">ফ্যাক্টরি / ওয়ার্কশপ</option>
                    <option value="অন্যান্য">অন্যান্য</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    কয় তলা ভবন?
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={100}
                    value={floors}
                    onChange={(e) => setFloors(Number(e.target.value))}
                    className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    বিদ্যুৎ ফেজ নির্বাচন
                  </label>
                  <select
                    value={phase}
                    onChange={(e) => {
                      const newPhase = e.target.value as PhaseType;
                      setPhase(newPhase);
                      setVoltage(newPhase.includes('3-Phase') ? 400 : 220);
                    }}
                    className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                  >
                    <option value="1-Phase (সিঙ্গেল ফেজ)">১-ফেজ (সিঙ্গেল ফেজ)</option>
                    <option value="3-Phase (থ্রি ফেজ)">৩-ফেজ (থ্রি ফেজ)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    সাপ্লাই ভোল্টেজ (V)
                  </label>
                  <input
                    type="number"
                    value={voltage}
                    onChange={(e) => setVoltage(Number(e.target.value))}
                    className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  প্রজেক্টের পূর্ণাঙ্গ ঠিকানা
                </label>
                <input
                  type="text"
                  placeholder="বাড়ি ১২, রোড ৮/এ, ধানমন্ডি"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    কাজ শুরুর তারিখ
                  </label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    কাজের অবস্থা
                  </label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as WorkStatus)}
                    className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                  >
                    <option value="পরিকল্পনাধীন">পরিকল্পনাধীন</option>
                    <option value="চলমান">চলমান</option>
                    <option value="টেস্টিং">টেস্টিং</option>
                    <option value="সম্পন্ন">সম্পন্ন</option>
                    <option value="স্থগিত">স্থগিত</option>
                  </select>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2"
                >
                  <Check className="w-4 h-4 stroke-[3]" />
                  <span>{editingProject ? 'আপডেট সম্পন্ন করুন' : 'প্রজেক্ট সংরক্ষণ করুন'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
