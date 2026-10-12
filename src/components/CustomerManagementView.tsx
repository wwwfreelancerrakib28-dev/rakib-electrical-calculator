import React, { useState } from 'react';
import { 
  Users, 
  Search, 
  Plus, 
  Phone, 
  MapPin, 
  Briefcase, 
  Calendar, 
  Edit2, 
  Trash2, 
  Building2, 
  ArrowRight, 
  Check, 
  AlertCircle,
  FileText
} from 'lucide-react';
import { Customer, Project, WorkStatus } from '../types';
import { formatTaka } from '../utils/numberFormat';

interface CustomerManagementProps {
  customers: Customer[];
  projects: Project[];
  activeCustomerId: string | null;
  onSelectCustomer: (id: string) => void;
  onAddCustomer: (customer: Customer) => void;
  onUpdateCustomer: (customer: Customer) => void;
  onDeleteCustomer: (id: string) => void;
  onSelectProject: (id: string) => void;
  onNavigateTo: (tab: any) => void;
  onOpenQuickAction: (actionType?: 'customer' | 'project' | 'room' | 'calc') => void;
}

export const CustomerManagementView: React.FC<CustomerManagementProps> = ({
  customers,
  projects,
  activeCustomerId,
  onSelectCustomer,
  onAddCustomer,
  onUpdateCustomer,
  onDeleteCustomer,
  onSelectProject,
  onNavigateTo,
  onOpenQuickAction
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  
  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [warningMessage, setWarningMessage] = useState('');

  // Form fields
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [altPhone, setAltPhone] = useState('');
  const [address, setAddress] = useState('');
  const [organization, setOrganization] = useState('');
  const [workDescription, setWorkDescription] = useState('');
  const [notes, setNotes] = useState('');
  const [status, setStatus] = useState<WorkStatus>('চলমান');

  const filteredCustomers = customers.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.phone.includes(searchQuery) ||
      (c.address && c.address.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesStatus = statusFilter === 'all' || c.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const selectedCustomer = customers.find((c) => c.id === activeCustomerId) || customers[0];
  const customerProjects = selectedCustomer
    ? projects.filter((p) => p.customerId === selectedCustomer.id)
    : [];

  const openCreateModal = () => {
    setEditingCustomer(null);
    setName('');
    setPhone('');
    setAltPhone('');
    setAddress('');
    setOrganization('');
    setWorkDescription('');
    setNotes('');
    setStatus('চলমান');
    setWarningMessage('');
    setModalOpen(true);
  };

  const openEditModal = (c: Customer) => {
    setEditingCustomer(c);
    setName(c.name);
    setPhone(c.phone);
    setAltPhone(c.altPhone || '');
    setAddress(c.address);
    setOrganization(c.organization || '');
    setWorkDescription(c.workDescription || '');
    setNotes(c.notes || '');
    setStatus(c.status);
    setWarningMessage('');
    setModalOpen(true);
  };

  const handlePhoneBlur = () => {
    const cleanPhone = phone.replace(/[^0-9]/g, '');
    if (!cleanPhone) return;

    const duplicate = customers.find(
      (c) =>
        c.id !== editingCustomer?.id &&
        c.phone.replace(/[^0-9]/g, '') === cleanPhone
    );

    if (duplicate) {
      setWarningMessage(
        `সতর্কতা: "${duplicate.name}" নামের একজন কাস্টমার ইতোমধ্যে এই মোবাইল নম্বরে নিবন্ধিত আছেন!`
      );
    } else {
      setWarningMessage('');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    if (editingCustomer) {
      const updated: Customer = {
        ...editingCustomer,
        name: name.trim(),
        phone: phone.trim(),
        altPhone: altPhone.trim(),
        address: address.trim(),
        organization: organization.trim(),
        workDescription: workDescription.trim(),
        notes: notes.trim(),
        status,
        updatedAt: new Date().toISOString()
      };
      onUpdateCustomer(updated);
    } else {
      const newCust: Customer = {
        id: `cust-${Date.now()}`,
        name: name.trim(),
        phone: phone.trim(),
        altPhone: altPhone.trim(),
        address: address.trim(),
        organization: organization.trim(),
        workDescription: workDescription.trim(),
        notes: notes.trim(),
        status,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      onAddCustomer(newCust);
      onSelectCustomer(newCust.id);
    }
    setModalOpen(false);
  };

  const handleDelete = (c: Customer) => {
    const projCount = projects.filter((p) => p.customerId === c.id).length;
    let confirmMsg = `আপনি কি নিশ্চিতভাবে "${c.name}" কাস্টমারকে মুছে ফেলতে চান?`;
    if (projCount > 0) {
      confirmMsg += `\n\nসাবধান: এই কাস্টমারের অধীনে ${projCount}টি প্রজেক্ট যুক্ত রয়েছে।`;
    }

    if (window.confirm(confirmMsg)) {
      onDeleteCustomer(c.id);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Top Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white dark:bg-slate-900 p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div>
          <h1 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Users className="w-5 h-5 text-amber-500" />
            <span>কাস্টমার ম্যানেজমেন্ট (গ্রাহক প্রোফাইল)</span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            সকল কাস্টমারের তালিকা, যোগাযোগের তথ্য, একাধিক বাড়ি/প্রজেক্ট এবং বকেয়া হিসাব
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 active:scale-95 text-slate-950 font-bold text-sm shadow-md transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>নতুন কাস্টমার তৈরি</span>
        </button>
      </div>

      {/* Main Grid: Left List (40%) and Right Detail (60%) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        
        {/* Left Column: Customer List */}
        <div className="lg:col-span-5 space-y-3">
          
          {/* Search & Filter Bar */}
          <div className="bg-white dark:bg-slate-900 p-3 rounded-xl border border-slate-200 dark:border-slate-800 space-y-2">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="নাম বা মোবাইল নম্বর দিয়ে খুঁজুন..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div className="flex items-center gap-1 overflow-x-auto text-[11px]">
              {['all', 'চলমান', 'পরিকল্পনাধীন', 'সম্পন্ন'].map((st) => (
                <button
                  key={st}
                  onClick={() => setStatusFilter(st)}
                  className={`px-2.5 py-1 rounded-md font-semibold whitespace-nowrap transition-colors ${
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

          {/* List Cards */}
          <div className="space-y-2 max-h-[600px] overflow-y-auto pr-1">
            {filteredCustomers.map((cust) => {
              const isSelected = cust.id === selectedCustomer?.id;
              const pCount = projects.filter((p) => p.customerId === cust.id).length;

              return (
                <div
                  key={cust.id}
                  onClick={() => onSelectCustomer(cust.id)}
                  className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-amber-50/80 dark:bg-amber-950/30 border-amber-400 dark:border-amber-500 shadow-sm'
                      : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                        <span>{cust.name}</span>
                        {cust.organization && (
                          <span className="text-[10px] text-slate-500 font-normal">
                            ({cust.organization})
                          </span>
                        )}
                      </h3>
                      <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400 mt-1">
                        <Phone className="w-3 h-3 text-amber-500" />
                        <span className="font-mono">{cust.phone}</span>
                      </div>
                    </div>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                      {cust.status}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 mt-2.5 pt-2 border-t border-slate-100 dark:border-slate-800">
                    <span className="truncate max-w-[200px]">{cust.address || 'ঠিকানা দেওয়া নেই'}</span>
                    <span className="font-semibold text-amber-600 dark:text-amber-400 shrink-0">
                      {pCount}টি প্রজেক্ট
                    </span>
                  </div>
                </div>
              );
            })}

            {filteredCustomers.length === 0 && (
              <div className="p-8 text-center text-xs text-slate-400 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
                কোনো কাস্টমার খুঁজে পাওয়া যায়নি।
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Active Customer Profile Detail */}
        <div className="lg:col-span-7">
          {selectedCustomer ? (
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-5 sm:p-6 space-y-6">
              
              {/* Profile Header */}
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 pb-5 border-b border-slate-100 dark:border-slate-800">
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">
                      {selectedCustomer.name}
                    </h2>
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                      {selectedCustomer.status}
                    </span>
                  </div>
                  {selectedCustomer.organization && (
                    <div className="text-xs text-slate-500 font-medium mt-0.5">
                      প্রতিষ্ঠান: {selectedCustomer.organization}
                    </div>
                  )}
                  <div className="flex flex-wrap items-center gap-4 text-xs text-slate-600 dark:text-slate-400 mt-2">
                    <span className="flex items-center gap-1 font-mono">
                      <Phone className="w-3.5 h-3.5 text-amber-500" />
                      {selectedCustomer.phone}
                    </span>
                    {selectedCustomer.altPhone && (
                      <span className="flex items-center gap-1 font-mono text-slate-500">
                        বিকল্প: {selectedCustomer.altPhone}
                      </span>
                    )}
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-amber-500" />
                      {selectedCustomer.address}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => openEditModal(selectedCustomer)}
                    className="p-2 rounded-lg text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    title="তথ্য পরিবর্তন করুন"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(selectedCustomer)}
                    className="p-2 rounded-lg text-rose-500 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                    title="কাস্টমার মুছে ফেলুন"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Work Description & Notes */}
              {(selectedCustomer.workDescription || selectedCustomer.notes) && (
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 text-xs space-y-2">
                  {selectedCustomer.workDescription && (
                    <div>
                      <span className="font-bold text-slate-700 dark:text-slate-300">কাজের মূল বিবরণ: </span>
                      <span className="text-slate-600 dark:text-slate-400">{selectedCustomer.workDescription}</span>
                    </div>
                  )}
                  {selectedCustomer.notes && (
                    <div>
                      <span className="font-bold text-slate-700 dark:text-slate-300">বিশেষ নোট: </span>
                      <span className="text-slate-600 dark:text-slate-400">{selectedCustomer.notes}</span>
                    </div>
                  )}
                </div>
              )}

              {/* Projects linked to this customer */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                    <Building2 className="w-4 h-4 text-amber-500" />
                    <span>এই কাস্টমারের বাড়ি ও প্রজেক্টসমূহ ({customerProjects.length}টি)</span>
                  </h3>
                  <button
                    onClick={() => onOpenQuickAction('project')}
                    className="text-xs font-bold text-amber-600 dark:text-amber-400 hover:underline flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>নতুন বাড়ি যোগ করুন</span>
                  </button>
                </div>

                <div className="space-y-3">
                  {customerProjects.map((p) => {
                    const watts = p.rooms.reduce((sum, r) => sum + r.totalWatts, 0);

                    return (
                      <div
                        key={p.id}
                        className="p-4 rounded-xl bg-white dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 hover:border-amber-400 dark:hover:border-amber-500/60 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                      >
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                              {p.name}
                            </h4>
                            <span className="px-2 py-0.5 rounded text-[10px] bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                              {p.phase}
                            </span>
                          </div>
                          <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                            {p.rooms.length}টি রুম • মোট লোড {watts} W • ঠিকানা: {p.address}
                          </div>
                          <div className="text-xs font-semibold text-slate-700 dark:text-slate-300 mt-1 flex items-center gap-3">
                            <span>মোট বিল: {formatTaka(p.costing.totalBill)}</span>
                            <span className="text-rose-600 dark:text-rose-400">
                              বাকি: {formatTaka(p.costing.dueAmount)}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => {
                              onSelectProject(p.id);
                              onNavigateTo('rooms');
                            }}
                            className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs transition-colors flex items-center gap-1"
                          >
                            <span>রুমে প্রবেশ</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => {
                              onSelectProject(p.id);
                              onNavigateTo('billing');
                            }}
                            className="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 text-slate-700 dark:text-slate-200 font-semibold text-xs transition-colors"
                          >
                            বিল দেখুন
                          </button>
                        </div>
                      </div>
                    );
                  })}

                  {customerProjects.length === 0 && (
                    <div className="p-6 text-center text-xs text-slate-400 bg-slate-50 dark:bg-slate-800/20 rounded-xl border border-dashed border-slate-200 dark:border-slate-800">
                      এই কাস্টমারের কোনো বাড়ি বা প্রজেক্ট এখনও তৈরি করা হয়নি।
                    </div>
                  )}
                </div>
              </div>

            </div>
          ) : (
            <div className="p-12 text-center text-slate-400 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
              বাম পাশের তালিকা থেকে যেকোনো কাস্টমার নির্বাচন করুন।
            </div>
          )}
        </div>

      </div>

      {/* Create / Edit Customer Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="px-5 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-800/50">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                {editingCustomer ? 'কাস্টমারের তথ্য পরিবর্তন' : 'নতুন কাস্টমার প্রোফাইল তৈরি'}
              </h3>
              <button
                onClick={() => setModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white"
              >
                ✕
              </button>
            </div>

            {/* Warning Message */}
            {warningMessage && (
              <div className="mx-5 mt-3 p-3 rounded-lg bg-amber-50 dark:bg-amber-950/50 border border-amber-300 dark:border-amber-800 text-amber-800 dark:text-amber-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{warningMessage}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="p-5 overflow-y-auto space-y-3.5 flex-1">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  কাস্টমারের নাম <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="যেমন: জনাব রফিকুল ইসলাম"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    মোবাইল নম্বর <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="01711-xxxxxx"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    onBlur={handlePhoneBlur}
                    className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    বিকল্প নম্বর (যদি থাকে)
                  </label>
                  <input
                    type="tel"
                    placeholder="01911-xxxxxx"
                    value={altPhone}
                    onChange={(e) => setAltPhone(e.target.value)}
                    className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    প্রতিষ্ঠান / বাড়ির নাম
                  </label>
                  <input
                    type="text"
                    placeholder="যেমন: ইসলাম ম্যানশন"
                    value={organization}
                    onChange={(e) => setOrganization(e.target.value)}
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

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  ঠিকানা
                </label>
                <input
                  type="text"
                  placeholder="বাড়ি ১২, রোড ৮/এ, ধানমন্ডি, ঢাকা"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  কাজের বিবরণ
                </label>
                <textarea
                  rows={2}
                  placeholder="৩-তলা বাড়ির সম্পূর্ণ ওয়্যারিং, ডিবি স্থাপন ও আর্থিং"
                  value={workDescription}
                  onChange={(e) => setWorkDescription(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  অতিরিক্ত নোট
                </label>
                <input
                  type="text"
                  placeholder="যেমন: বিআরবি কেবল পছন্দ"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div className="pt-3">
                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2"
                >
                  <Check className="w-4 h-4 stroke-[3]" />
                  <span>{editingCustomer ? 'তথ্য আপডেট করুন' : 'কাস্টমার সংরক্ষণ করুন'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
