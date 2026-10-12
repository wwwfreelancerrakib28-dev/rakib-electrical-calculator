import React, { useState } from 'react';
import { 
  Package, 
  Plus, 
  Search, 
  ShoppingCart, 
  CheckSquare, 
  Square, 
  Filter, 
  Download, 
  Trash2, 
  Edit2, 
  Check, 
  Building2,
  Tag
} from 'lucide-react';
import { Project, MaterialItem } from '../types';
import { formatTaka } from '../utils/numberFormat';
import { DEFAULT_MATERIALS } from '../data/materialsCatalog';

interface MaterialsViewProps {
  activeProject: Project | null;
  onUpdateProject: (project: Project) => void;
  onOpenQuickAction: (actionType?: 'customer' | 'project' | 'room' | 'calc') => void;
}

export const MaterialsView: React.FC<MaterialsViewProps> = ({
  activeProject,
  onUpdateProject,
  onOpenQuickAction
}) => {
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'common' | string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [checklistMode, setChecklistMode] = useState(false);
  const [checkedItemIds, setCheckedItemIds] = useState<Record<string, boolean>>({});

  // Add common material modal
  const [modalOpen, setModalOpen] = useState(false);
  const [matName, setMatName] = useState('');
  const [matCategory, setMatCategory] = useState('তার ও কেবল');
  const [matBrand, setMatBrand] = useState('BRB Cable');
  const [matQty, setMatQty] = useState(1);
  const [matUnit, setMatUnit] = useState('কয়েল (৯০ মি.)');
  const [matPrice, setMatPrice] = useState(3100);

  if (!activeProject) {
    return (
      <div className="p-12 text-center bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
        <Package className="w-12 h-12 text-amber-500 mx-auto mb-3" />
        <h2 className="text-lg font-bold text-slate-800 dark:text-white mb-2">
          কোনো প্রজেক্ট নির্বাচিত নেই
        </h2>
        <p className="text-xs text-slate-500 max-w-md mx-auto mb-4">
          মালামালের মোট ফর্দ দেখতে উপরে প্রজেক্ট সিলেক্ট করুন।
        </p>
      </div>
    );
  }

  // Aggregate all materials: room-wise + common
  const allMaterials: (MaterialItem & { source: string })[] = [];

  // Add room materials
  activeProject.rooms.forEach((r) => {
    r.materials.forEach((m) => {
      allMaterials.push({
        ...m,
        roomId: r.id,
        roomName: r.name,
        source: `রুম: ${r.name}`
      });
    });
  });

  // Add common materials
  activeProject.commonMaterials.forEach((m) => {
    allMaterials.push({
      ...m,
      source: 'মেইন প্রজেক্ট (কমন)'
    });
  });

  // Filter
  const filteredMaterials = allMaterials.filter((m) => {
    const matchesSearch =
      m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (m.brand && m.brand.toLowerCase().includes(searchQuery.toLowerCase()));

    if (selectedFilter === 'all') return matchesSearch;
    if (selectedFilter === 'common') return matchesSearch && m.source.includes('মেইন প্রজেক্ট');
    return matchesSearch && m.roomId === selectedFilter;
  });

  const grandTotalCost = allMaterials.reduce((sum, m) => sum + (m.totalPrice || m.unitPrice * m.quantity), 0);

  const toggleCheck = (id: string) => {
    setCheckedItemIds((prev) => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const handleOpenAddCommonMaterial = () => {
    const defaultM = DEFAULT_MATERIALS[15]; // sample wire
    setMatName(defaultM.name);
    setMatCategory(defaultM.category);
    setMatBrand(defaultM.defaultBrand);
    setMatQty(1);
    setMatUnit(defaultM.unit);
    setMatPrice(defaultM.defaultPrice);
    setModalOpen(true);
  };

  const handleSelectDefault = (m: (typeof DEFAULT_MATERIALS)[0]) => {
    setMatName(m.name);
    setMatCategory(m.category);
    setMatBrand(m.defaultBrand);
    setMatUnit(m.unit);
    setMatPrice(m.defaultPrice);
  };

  const handleSaveCommonMaterial = (e: React.FormEvent) => {
    e.preventDefault();
    const qty = Number(matQty) || 1;
    const price = Number(matPrice) || 0;

    const newMat: MaterialItem = {
      id: `mat-c-${Date.now()}`,
      name: matName.trim(),
      category: matCategory,
      brand: matBrand.trim(),
      quantity: qty,
      unit: matUnit,
      unitPrice: price,
      totalPrice: qty * price
    };

    const updatedCommon = [...activeProject.commonMaterials, newMat];
    const updatedProject: Project = {
      ...activeProject,
      commonMaterials: updatedCommon
    };
    onUpdateProject(updatedProject);
    setModalOpen(false);
  };

  const handleDeleteCommonMaterial = (id: string) => {
    const updatedCommon = activeProject.commonMaterials.filter((m) => m.id !== id);
    const updatedProject: Project = {
      ...activeProject,
      commonMaterials: updatedCommon
    };
    onUpdateProject(updatedProject);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white dark:bg-slate-900 p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div>
          <h1 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Package className="w-5 h-5 text-amber-500" />
            <span>মালামাল ও এক্সেসরিজ তালিকা (Bill of Materials)</span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            প্রজেক্ট: <strong className="text-slate-800 dark:text-slate-200">{activeProject.name}</strong> • মোট {allMaterials.length} আইটেম
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={() => setChecklistMode(!checklistMode)}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all ${
              checklistMode
                ? 'bg-emerald-500 text-slate-950 shadow-sm'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
            }`}
          >
            <CheckSquare className="w-4 h-4" />
            <span>{checklistMode ? 'চেকলিস্ট চালু আছে' : 'বাজারের চেকলিস্ট মোড'}</span>
          </button>

          <button
            onClick={handleOpenAddCommonMaterial}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 active:scale-95 text-slate-950 font-bold text-xs shadow-md transition-all"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>কমন মালামাল যোগ</span>
          </button>
        </div>
      </div>

      {/* Summary Card */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <span className="text-[11px] text-slate-400 font-semibold block">মোট মালামাল খরচ</span>
          <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400 block mt-1">
            {formatTaka(grandTotalCost)}
          </span>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <span className="text-[11px] text-slate-400 font-semibold block">রুমভিত্তিক মালামাল</span>
          <span className="text-2xl font-bold text-slate-900 dark:text-white block mt-1">
            {allMaterials.filter((m) => !m.source.includes('মেইন')).length} আইটেম
          </span>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <span className="text-[11px] text-slate-400 font-semibold block">মেইন লাইন ও কমন মালামাল</span>
          <span className="text-2xl font-bold text-amber-600 dark:text-amber-400 block mt-1">
            {activeProject.commonMaterials.length} আইটেম
          </span>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white dark:bg-slate-900 p-3 rounded-xl border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="মালামাল বা ব্র‍্যান্ড খুঁজুন..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
        </div>

        {/* Room Filter Pills */}
        <div className="flex items-center gap-1 overflow-x-auto text-xs">
          <button
            onClick={() => setSelectedFilter('all')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-colors whitespace-nowrap ${
              selectedFilter === 'all'
                ? 'bg-amber-500 text-slate-950 font-bold'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
            }`}
          >
            সকল মালামাল
          </button>
          <button
            onClick={() => setSelectedFilter('common')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-colors whitespace-nowrap ${
              selectedFilter === 'common'
                ? 'bg-amber-500 text-slate-950 font-bold'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
            }`}
          >
            মেইন প্রজেক্ট (কমন)
          </button>
          {activeProject.rooms.map((r) => (
            <button
              key={r.id}
              onClick={() => setSelectedFilter(r.id)}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-colors whitespace-nowrap ${
                selectedFilter === r.id
                  ? 'bg-amber-500 text-slate-950 font-bold'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
              }`}
            >
              {r.name}
            </button>
          ))}
        </div>
      </div>

      {/* Materials Table */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700 dark:text-slate-300">
            <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 uppercase text-[10px]">
              <tr>
                {checklistMode && <th className="p-3 w-10">কিনেছেন?</th>}
                <th className="p-3">মালামালের নাম</th>
                <th className="p-3">ক্যাটাগরি</th>
                <th className="p-3">ব্র্যান্ড / সাইজ</th>
                <th className="p-3">পরিমাণ</th>
                <th className="p-3">দর (৳)</th>
                <th className="p-3">মোট দাম</th>
                <th className="p-3">ব্যবহারের স্থান</th>
                <th className="p-3 text-right">অ্যাকশন</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredMaterials.map((mat) => {
                const isChecked = !!checkedItemIds[mat.id];

                return (
                  <tr
                    key={mat.id}
                    className={`hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors ${
                      isChecked ? 'bg-emerald-50/50 dark:bg-emerald-950/20 line-through text-slate-400' : ''
                    }`}
                  >
                    {checklistMode && (
                      <td className="p-3">
                        <button
                          type="button"
                          onClick={() => toggleCheck(mat.id)}
                          className="text-slate-500 hover:text-emerald-600"
                        >
                          {isChecked ? (
                            <CheckSquare className="w-4 h-4 text-emerald-600" />
                          ) : (
                            <Square className="w-4 h-4" />
                          )}
                        </button>
                      </td>
                    )}
                    <td className="p-3 font-bold text-slate-900 dark:text-white">
                      {mat.name}
                    </td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-[10px]">
                        {mat.category}
                      </span>
                    </td>
                    <td className="p-3">{mat.brand || '-'}</td>
                    <td className="p-3 font-semibold">
                      {mat.quantity} {mat.unit}
                    </td>
                    <td className="p-3">{formatTaka(mat.unitPrice)}</td>
                    <td className="p-3 font-bold text-emerald-600 dark:text-emerald-400">
                      {formatTaka(mat.totalPrice || mat.quantity * mat.unitPrice)}
                    </td>
                    <td className="p-3 text-slate-500 text-[11px]">{mat.source}</td>
                    <td className="p-3 text-right">
                      {mat.source.includes('মেইন প্রজেক্ট') && (
                        <button
                          onClick={() => handleDeleteCommonMaterial(mat.id)}
                          className="p-1 rounded text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40"
                          title="মুছে ফেলুন"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {filteredMaterials.length === 0 && (
          <div className="p-12 text-center text-xs text-slate-400">
            কোনো মালামাল পাওয়া যায়নি।
          </div>
        )}
      </div>

      {/* Add Common Material Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden flex flex-col">
            <div className="px-5 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-800/50">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                মেইন প্রজেক্টের কমন মালামাল যোগ
              </h3>
              <button
                onClick={() => setModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveCommonMaterial} className="p-5 space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  ক্যাটালগ থেকে দ্রুত বাছাই করুন
                </label>
                <select
                  onChange={(e) => {
                    const item = DEFAULT_MATERIALS.find((m) => m.name === e.target.value);
                    if (item) handleSelectDefault(item);
                  }}
                  className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                >
                  {DEFAULT_MATERIALS.map((m) => (
                    <option key={m.id} value={m.name}>
                      {m.name} ({m.defaultPrice} ৳/{m.unit})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  মালামালের নাম <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={matName}
                  onChange={(e) => setMatName(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    ক্যাটাগরি
                  </label>
                  <select
                    value={matCategory}
                    onChange={(e) => setMatCategory(e.target.value)}
                    className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                  >
                    <option value="তার ও কেবল">তার ও কেবল</option>
                    <option value="ব্রেকার ও সুরক্ষা">ব্রেকার ও সুরক্ষা</option>
                    <option value="আর্থিং সামগ্রী">আর্থিং সামগ্রী</option>
                    <option value="পাইপ ও ফিটিংস">পাইপ ও ফিটিংস</option>
                    <option value="বোর্ড ও বক্স">বোর্ড ও বক্স</option>
                    <option value="সুইচ ও সকেট">সুইচ ও সকেট</option>
                    <option value="অন্যান্য">অন্যান্য</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    ব্র্যান্ড
                  </label>
                  <input
                    type="text"
                    value={matBrand}
                    onChange={(e) => setMatBrand(e.target.value)}
                    className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    পরিমাণ
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={matQty}
                    onChange={(e) => setMatQty(Number(e.target.value))}
                    className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    একক
                  </label>
                  <input
                    type="text"
                    value={matUnit}
                    onChange={(e) => setMatUnit(e.target.value)}
                    className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    দর (৳)
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={matPrice}
                    onChange={(e) => setMatPrice(Number(e.target.value))}
                    className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2"
                >
                  <Check className="w-4 h-4 stroke-[3]" />
                  <span>সংরক্ষণ করুন</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
