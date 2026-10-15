import React, { useState, useEffect } from 'react';
import { 
  DoorOpen, 
  Plus, 
  Search, 
  Zap, 
  Package, 
  Copy, 
  Edit2, 
  Trash2, 
  Check, 
  AlertCircle, 
  Layers, 
  Sparkles, 
  ChevronRight, 
  ChevronLeft,
  ShieldAlert, 
  ArrowLeft, 
  FileText, 
  RotateCcw, 
  Cable, 
  ShieldCheck, 
  Printer, 
  X, 
  AlertTriangle, 
  Flame, 
  LayoutGrid, 
  Info,
  CheckCircle2,
  Share2,
  Sliders,
  Maximize2
} from 'lucide-react';
import { Project, Room, DeviceItem, MaterialItem, RoomType, WorkStatus, CatalogDevice } from '../types';
import { formatTaka, formatWatts, formatAmps } from '../utils/numberFormat';
import { DEFAULT_DEVICES } from '../data/initialData';
import { DEFAULT_MATERIALS } from '../data/materialsCatalog';
import { calculateElectricalLoad } from '../utils/electricalCalculations';

interface RoomManagementProps {
  project: Project | null;
  projects: Project[];
  onSelectProject: (id: string) => void;
  onAddRoom: (projectId: string, room: Room) => void;
  onUpdateRoom: (projectId: string, room: Room) => void;
  onDeleteRoom: (projectId: string, roomId: string) => void;
  onDuplicateRoom: (projectId: string, sourceRoom: Room) => void;
}

interface UndoItem {
  id: string;
  type: 'room' | 'device' | 'material';
  name: string;
  data: any;
  roomId?: string;
  timestamp: number;
}

export const RoomManagementView: React.FC<RoomManagementProps> = ({
  project,
  projects,
  onSelectProject,
  onAddRoom,
  onUpdateRoom,
  onDeleteRoom,
  onDuplicateRoom
}) => {
  const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'devices' | 'materials'>('devices');

  // Confirmation modal state for Room Deletion
  const [roomToDelete, setRoomToDelete] = useState<Room | null>(null);

  // Undo Stack & Toast
  const [undoStack, setUndoStack] = useState<UndoItem[]>([]);
  const [undoToast, setUndoToast] = useState<{ item: UndoItem; timerId: any } | null>(null);
  const [undoHistoryModalOpen, setUndoHistoryModalOpen] = useState(false);

  // Report & Modal states
  const [allReportModalOpen, setAllReportModalOpen] = useState(false);
  const [roomModalOpen, setRoomModalOpen] = useState(false);
  const [editingRoom, setEditingRoom] = useState<Room | null>(null);

  // Room form fields with custom naming support (e.g., রুম ১, রুম ২, ইত্যাদি)
  const [roomName, setRoomName] = useState('');
  const [roomType, setRoomType] = useState<RoomType>('বেডরুম');
  const [lengthFt, setLengthFt] = useState<number>(14);
  const [widthFt, setWidthFt] = useState<number>(12);
  const [heightFt, setHeightFt] = useState<number>(10);
  const [roomNotes, setRoomNotes] = useState('');

  // Add Device Modal
  const [deviceModalOpen, setDeviceModalOpen] = useState(false);
  const [deviceMode, setDeviceMode] = useState<'auto' | 'manual' | 'mixed'>('auto');
  const [selectedCatalogDevice, setSelectedCatalogDevice] = useState<CatalogDevice>(DEFAULT_DEVICES[0]);
  const [devName, setDevName] = useState('');
  const [devQty, setDevQty] = useState(1);
  const [devWatts, setDevWatts] = useState(15);
  const [devPF, setDevPF] = useState(0.9);
  const [devIsHeavy, setDevIsHeavy] = useState(false);
  const [devNotes, setDevNotes] = useState('');

  // Add Material Modal
  const [matModalOpen, setMatModalOpen] = useState(false);
  const [matName, setMatName] = useState('');
  const [matCategory, setMatCategory] = useState('সুইচ ও সকেট');
  const [matBrand, setMatBrand] = useState('Super Star');
  const [matQty, setMatQty] = useState(1);
  const [matUnit, setMatUnit] = useState('পিস');
  const [matPrice, setMatPrice] = useState(120);

  // Sync selectedRoomId
  useEffect(() => {
    if (project && project.rooms.length > 0) {
      if (!selectedRoomId || !project.rooms.some((r) => r.id === selectedRoomId)) {
        setSelectedRoomId(project.rooms[0].id);
      }
    }
  }, [project, selectedRoomId]);

  if (!project) {
    return (
      <div className="p-12 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <DoorOpen className="w-12 h-12 text-amber-500 mx-auto mb-3" />
        <h2 className="text-lg font-bold text-slate-800 dark:text-white mb-2">
          কোনো প্রজেক্ট নির্বাচন করা নেই
        </h2>
        <p className="text-xs text-slate-500 max-w-md mx-auto mb-4">
          রুম ও ওয়্যারিংয়ের হিসাব পরিচালনা করতে প্রথমে উপরে প্রজেক্ট সিলেক্ট করুন অথবা নতুন প্রজেক্ট তৈরি করুন।
        </p>
        <div className="flex flex-wrap justify-center gap-2">
          {projects.map((p) => (
            <button
              key={p.id}
              onClick={() => onSelectProject(p.id)}
              className="px-3.5 py-2 rounded-xl bg-amber-500 font-bold text-xs text-slate-950 hover:bg-amber-400 transition-all active:scale-95 shadow"
            >
              {p.name}
            </button>
          ))}
        </div>
      </div>
    );
  }

  const selectedRoom = project.rooms.find((r) => r.id === selectedRoomId) || project.rooms[0];

  const roomCalc = selectedRoom
    ? calculateElectricalLoad({
        loadWatts: selectedRoom.totalWatts,
        voltage: project.voltage || 220,
        isThreePhase: false,
        powerFactor: 0.85,
        diversityFactor: 1.0,
        lengthMeters: 15,
        installationMethod: 'কন্ডুইট (Conduit in Wall)',
        isMotorOrCompressor: selectedRoom.devices.some(
          (d) => d.isHeavyLoad || d.name.includes('এসি') || d.name.includes('মোটর')
        ),
        hasWetAreaOrGeyser:
          selectedRoom.type === 'বাথরুম' ||
          selectedRoom.name.includes('বাথরুম') ||
          selectedRoom.devices.some((d) => d.name.includes('গিজার'))
      })
    : null;

  const getRoomEmoji = (type: string) => {
    if (type.includes('বেড')) return '🛏️';
    if (type.includes('ড্রয়িং')) return '🛋️';
    if (type.includes('ডাইনিং')) return '🍽️';
    if (type.includes('রান্না') || type.includes('কিচেন')) return '🍳';
    if (type.includes('বাথরুম')) return '🚿';
    if (type.includes('বারান্দা')) return '🌿';
    if (type.includes('সিঁড়ি')) return '🪜';
    if (type.includes('গ্যারেজ')) return '🚗';
    if (type.includes('দোকান')) return '🏪';
    if (type.includes('অফিস')) return '🏢';
    if (type.includes('ছাদ')) return '🌇';
    return '⚡';
  };

  const handleSelectRoomAndBringToFront = (roomId: string) => {
    setSelectedRoomId(roomId);
    const workbenchEl = document.getElementById('active-room-workbench');
    if (workbenchEl) {
      workbenchEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const openCreateRoomModal = () => {
    setEditingRoom(null);
    const nextRoomNum = project.rooms.length + 1;
    setRoomName(`রুম ${nextRoomNum}`);
    setRoomType('বেডরুম');
    setLengthFt(14);
    setWidthFt(12);
    setHeightFt(10);
    setRoomNotes('');
    setRoomModalOpen(true);
  };

  const openEditRoomModal = (r: Room) => {
    setEditingRoom(r);
    setRoomName(r.name);
    setRoomType(r.type as RoomType);
    setLengthFt(r.lengthFt || 14);
    setWidthFt(r.widthFt || 12);
    setHeightFt(r.heightFt || 10);
    setRoomNotes(r.notes || '');
    setRoomModalOpen(true);
  };

  const handleSaveRoom = (e: React.FormEvent) => {
    e.preventDefault();
    const finalName = roomName.trim() || `রুম ${project.rooms.length + 1}`;
    const area = lengthFt * widthFt;

    if (editingRoom) {
      const updated: Room = {
        ...editingRoom,
        name: finalName,
        type: roomType,
        lengthFt,
        widthFt,
        heightFt,
        areaSqFt: area,
        notes: roomNotes.trim(),
        updatedAt: new Date().toISOString()
      };
      onUpdateRoom(project.id, updated);
      handleSelectRoomAndBringToFront(updated.id);
    } else {
      const newRoom: Room = {
        id: `room-${Date.now()}`,
        projectId: project.id,
        name: finalName,
        type: roomType,
        lengthFt,
        widthFt,
        heightFt,
        areaSqFt: area,
        status: 'চলমান',
        notes: roomNotes.trim(),
        devices: [],
        materials: [],
        totalWatts: 0,
        totalAmps: 0,
        estimatedMaterialCost: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      onAddRoom(project.id, newRoom);
      handleSelectRoomAndBringToFront(newRoom.id);
    }
    setRoomModalOpen(false);
  };

  const triggerDeleteRoom = (r: Room) => {
    setRoomToDelete(r);
  };

  const confirmDeleteRoom = () => {
    if (!roomToDelete) return;
    const targetRoom = roomToDelete;
    setRoomToDelete(null);

    onDeleteRoom(project.id, targetRoom.id);

    const undoItem: UndoItem = {
      id: `undo-${Date.now()}`,
      type: 'room',
      name: `রুম: ${targetRoom.name}`,
      data: targetRoom,
      timestamp: Date.now()
    };
    setUndoStack((prev) => [undoItem, ...prev]);

    if (undoToast?.timerId) clearTimeout(undoToast.timerId);
    const timer = setTimeout(() => {
      setUndoToast(null);
    }, 15000);

    setUndoToast({
      item: undoItem,
      timerId: timer
    });

    const remaining = project.rooms.filter((r) => r.id !== targetRoom.id);
    if (remaining.length > 0) {
      setSelectedRoomId(remaining[0].id);
    } else {
      setSelectedRoomId(null);
    }
  };

  const handleUndoAction = (itemToRestore?: UndoItem) => {
    const item = itemToRestore || undoToast?.item || undoStack[0];
    if (!item) return;

    if (undoToast?.timerId) clearTimeout(undoToast.timerId);
    setUndoToast(null);

    setUndoStack((prev) => prev.filter((u) => u.id !== item.id));

    if (item.type === 'room') {
      const restoredRoom: Room = item.data;
      onAddRoom(project.id, restoredRoom);
      handleSelectRoomAndBringToFront(restoredRoom.id);
    } else if (item.type === 'device' && selectedRoom) {
      const restoredDev: DeviceItem = item.data;
      const updatedDevices = [...selectedRoom.devices, restoredDev];
      onUpdateRoom(project.id, {
        ...selectedRoom,
        devices: updatedDevices
      });
    } else if (item.type === 'material' && selectedRoom) {
      const restoredMat: MaterialItem = item.data;
      const updatedMats = [...selectedRoom.materials, restoredMat];
      onUpdateRoom(project.id, {
        ...selectedRoom,
        materials: updatedMats
      });
    }
  };

  const handleOpenAddDevice = () => {
    setDevName(selectedCatalogDevice.name);
    setDevQty(1);
    setDevWatts(selectedCatalogDevice.defaultWatts);
    setDevPF(selectedCatalogDevice.defaultPowerFactor);
    setDevIsHeavy(selectedCatalogDevice.isHeavyLoad);
    setDevNotes(selectedCatalogDevice.notes);
    setDeviceModalOpen(true);
  };

  const handleCatalogDeviceChange = (catDev: CatalogDevice) => {
    setSelectedCatalogDevice(catDev);
    setDevName(catDev.name);
    setDevWatts(catDev.defaultWatts);
    setDevPF(catDev.defaultPowerFactor);
    setDevIsHeavy(catDev.isHeavyLoad);
    setDevNotes(catDev.notes);
  };

  const handleSaveDevice = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRoom) return;

    const qty = Number(devQty) || 1;
    const watts = Number(devWatts) || 0;
    const totalWatts = qty * watts;

    const newDevice: DeviceItem = {
      id: `dev-${Date.now()}`,
      name: devName.trim() || 'বৈদ্যুতিক ডিভাইস',
      quantity: qty,
      wattsPerUnit: watts,
      totalWatts,
      voltage: project.voltage,
      powerFactor: Number(devPF) || 0.85,
      isHeavyLoad: devIsHeavy,
      source: deviceMode === 'manual' ? 'ব্যবহারকারী ইনপুট' : deviceMode === 'auto' ? 'ডিফল্ট ক্যাটালগ' : 'নেমপ্লেট রিডিং',
      notes: devNotes.trim(),
      suggestedWire: selectedCatalogDevice.recommendedWire,
      suggestedBreaker: selectedCatalogDevice.recommendedBreaker
    };

    const updatedDevices = [...selectedRoom.devices, newDevice];
    const updatedRoom: Room = {
      ...selectedRoom,
      devices: updatedDevices
    };
    onUpdateRoom(project.id, updatedRoom);
    setDeviceModalOpen(false);
  };

  const handleRepeatDevice = (dev: DeviceItem) => {
    if (!selectedRoom) return;
    const duplicatedDev: DeviceItem = {
      ...dev,
      id: `dev-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      name: `${dev.name} (কপি)`
    };
    const updatedDevices = [...selectedRoom.devices, duplicatedDev];
    onUpdateRoom(project.id, {
      ...selectedRoom,
      devices: updatedDevices
    });
  };

  const handleDeleteDevice = (deviceId: string) => {
    if (!selectedRoom) return;
    const targetDev = selectedRoom.devices.find((d) => d.id === deviceId);
    if (!targetDev) return;

    const updatedDevices = selectedRoom.devices.filter((d) => d.id !== deviceId);
    onUpdateRoom(project.id, {
      ...selectedRoom,
      devices: updatedDevices
    });

    const undoItem: UndoItem = {
      id: `undo-${Date.now()}`,
      type: 'device',
      name: `ডিভাইস: ${targetDev.name}`,
      data: targetDev,
      roomId: selectedRoom.id,
      timestamp: Date.now()
    };
    setUndoStack((prev) => [undoItem, ...prev]);

    if (undoToast?.timerId) clearTimeout(undoToast.timerId);
    const timer = setTimeout(() => {
      setUndoToast(null);
    }, 15000);
    setUndoToast({ item: undoItem, timerId: timer });
  };

  const handleOpenAddMaterial = () => {
    const defaultM = DEFAULT_MATERIALS[0];
    setMatName(defaultM.name);
    setMatCategory(defaultM.category);
    setMatBrand(defaultM.defaultBrand);
    setMatQty(1);
    setMatUnit(defaultM.unit);
    setMatPrice(defaultM.defaultPrice);
    setMatModalOpen(true);
  };

  const handleSelectDefaultMaterial = (m: (typeof DEFAULT_MATERIALS)[0]) => {
    setMatName(m.name);
    setMatCategory(m.category);
    setMatBrand(m.defaultBrand);
    setMatUnit(m.unit);
    setMatPrice(m.defaultPrice);
  };

  const handleSaveMaterial = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRoom) return;

    const qty = Number(matQty) || 1;
    const price = Number(matPrice) || 0;

    const newMat: MaterialItem = {
      id: `mat-${Date.now()}`,
      name: matName.trim(),
      category: matCategory,
      brand: matBrand.trim(),
      quantity: qty,
      unit: matUnit,
      unitPrice: price,
      totalPrice: qty * price,
      roomId: selectedRoom.id,
      roomName: selectedRoom.name
    };

    const updatedMats = [...selectedRoom.materials, newMat];
    const updatedRoom: Room = {
      ...selectedRoom,
      materials: updatedMats
    };
    onUpdateRoom(project.id, updatedRoom);
    setMatModalOpen(false);
  };

  const handleRepeatMaterial = (mat: MaterialItem) => {
    if (!selectedRoom) return;
    const duplicatedMat: MaterialItem = {
      ...mat,
      id: `mat-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      name: `${mat.name} (কপি)`
    };
    const updatedMats = [...selectedRoom.materials, duplicatedMat];
    onUpdateRoom(project.id, {
      ...selectedRoom,
      materials: updatedMats
    });
  };

  const handleDeleteMaterial = (matId: string) => {
    if (!selectedRoom) return;
    const targetMat = selectedRoom.materials.find((m) => m.id === matId);
    if (!targetMat) return;

    const updatedMats = selectedRoom.materials.filter((m) => m.id !== matId);
    onUpdateRoom(project.id, {
      ...selectedRoom,
      materials: updatedMats
    });

    const undoItem: UndoItem = {
      id: `undo-${Date.now()}`,
      type: 'material',
      name: `মালামাল: ${targetMat.name}`,
      data: targetMat,
      roomId: selectedRoom.id,
      timestamp: Date.now()
    };
    setUndoStack((prev) => [undoItem, ...prev]);

    if (undoToast?.timerId) clearTimeout(undoToast.timerId);
    const timer = setTimeout(() => {
      setUndoToast(null);
    }, 15000);
    setUndoToast({ item: undoItem, timerId: timer });
  };

  return (
    <div className="space-y-5 animate-in fade-in duration-300">
      
      {/* ACTIVE ROOM MAIN WORKBENCH */}
      {selectedRoom ? (
        <div
          id="active-room-workbench"
          className="bg-white dark:bg-slate-900 rounded-3xl border-2 border-amber-400/90 dark:border-amber-500/70 shadow-2xl overflow-hidden transition-all"
        >
          {/* Room Header bar */}
          <div className="p-4 sm:p-5 bg-gradient-to-r from-amber-500/15 via-amber-500/5 to-transparent border-b border-slate-200 dark:border-slate-800">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2.5 flex-wrap">
                  <span className="text-2xl">{getRoomEmoji(selectedRoom.type)}</span>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-1.5">
                        {selectedRoom.name}
                        <button
                          onClick={() => openEditRoomModal(selectedRoom)}
                          className="p-1 rounded-lg text-amber-500 hover:bg-amber-500/10 transition-colors"
                          title="রুমের নাম এডিট করুন"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                      </h2>
                      <span className="px-2.5 py-0.5 rounded-full text-[11px] font-extrabold bg-amber-500 text-slate-950 shadow-sm">
                        {selectedRoom.type}
                      </span>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                        {selectedRoom.status}
                      </span>
                    </div>
                    {selectedRoom.areaSqFt ? (
                      <p className="text-[11px] text-slate-500 font-semibold mt-0.5">
                        সাইজ: {selectedRoom.lengthFt}' × {selectedRoom.widthFt}' = {selectedRoom.areaSqFt} বর্গফুট
                        {selectedRoom.notes && ` • নোট: ${selectedRoom.notes}`}
                      </p>
                    ) : null}
                  </div>
                </div>
              </div>

              {/* CLEAN ACTION BAR (Single instances of Report, Repeat, Edit, Undo) */}
              <div className="flex items-center gap-1.5 flex-wrap">
                <select
                  value={selectedRoomId || ''}
                  onChange={(e) => handleSelectRoomAndBringToFront(e.target.value)}
                  className="bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white text-xs font-bold rounded-xl px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-amber-500 cursor-pointer shadow-sm"
                >
                  {project.rooms.map((room) => (
                    <option key={room.id} value={room.id}>
                      {getRoomEmoji(room.type)} {room.name} ({formatWatts(room.totalWatts)})
                    </option>
                  ))}
                </select>

                <button
                  onClick={openCreateRoomModal}
                  className="p-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold transition-all shadow active:scale-95"
                  title="নতুন রুম যোগ করুন"
                >
                  <Plus className="w-4 h-4 stroke-[3]" />
                </button>

                <button
                  onClick={() => setAllReportModalOpen(true)}
                  className="px-2.5 py-1.5 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 font-bold text-xs flex items-center gap-1 border border-blue-200 dark:border-blue-900 shadow-xs"
                  title="রিপোর্ট"
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>রিপোর্ট</span>
                </button>

                <button
                  onClick={() => onDuplicateRoom(project.id, selectedRoom)}
                  className="px-2.5 py-1.5 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 font-bold text-xs flex items-center gap-1 border border-purple-200 dark:border-purple-900 shadow-xs"
                  title="রিপিট"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>রিপিট</span>
                </button>

                <button
                  onClick={() => setUndoHistoryModalOpen(true)}
                  className="px-2.5 py-1.5 rounded-xl bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 font-bold text-xs flex items-center gap-1 border border-teal-200 dark:border-teal-900 shadow-xs"
                  title="আনডু"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>আনডু</span>
                </button>

                <button
                  onClick={() => triggerDeleteRoom(selectedRoom)}
                  className="p-1.5 rounded-xl bg-rose-50 dark:bg-rose-950/50 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-900 transition-colors"
                  title="রুম ডিলিট"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

          {/* COMPACT SINGLE-LINE ELECTRICAL SUMMARY BAR (Replacing Big Cards) */}
          {roomCalc && (
            <div className="px-4 py-2.5 bg-slate-50 dark:bg-slate-950/80 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between gap-2 flex-wrap text-xs">
              <div className="flex items-center gap-3 flex-wrap">
                <span className="font-black text-amber-600 dark:text-amber-400 flex items-center gap-1">
                  <Zap className="w-3.5 h-3.5" />
                  {formatWatts(selectedRoom.totalWatts)} ({selectedRoom.totalAmps.toFixed(1)}A)
                </span>
                <span className="text-slate-300 dark:text-slate-700">|</span>
                <span className="text-slate-700 dark:text-slate-300">
                  তার: <strong className="text-blue-600 dark:text-blue-400">{roomCalc.recommendedCable.sizeMm2}</strong>
                </span>
                <span className="text-slate-300 dark:text-slate-700">|</span>
                <span className="text-slate-700 dark:text-slate-300">
                  ব্রেকার: <strong className="text-emerald-600 dark:text-emerald-400">{roomCalc.recommendedBreakerRatingA}A</strong>
                </span>
                <span className="text-slate-300 dark:text-slate-700">|</span>
                <span className="text-slate-700 dark:text-slate-300">
                  খরচ: <strong className="text-emerald-600 dark:text-emerald-400">{formatTaka(selectedRoom.estimatedMaterialCost)}</strong>
                </span>
              </div>

              <button
                onClick={() => setAllReportModalOpen(true)}
                className="text-[11px] font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-0.5"
              >
                <span>পূর্ণাঙ্গ বিবরণ ↗</span>
              </button>
            </div>
          )}

          {/* DEVICES VS MATERIALS TABS */}
          <div className="p-4 sm:p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3 flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setActiveTab('devices')}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-black transition-all ${
                    activeTab === 'devices'
                      ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                >
                  <Zap className="w-3.5 h-3.5" />
                  <span>ডিভাইসের তালিকা ({selectedRoom.devices.length}টি)</span>
                </button>

                <button
                  onClick={() => setActiveTab('materials')}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-black transition-all ${
                    activeTab === 'materials'
                      ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                >
                  <Package className="w-3.5 h-3.5" />
                  <span>মালামালের তালিকা ({selectedRoom.materials.length}টি)</span>
                </button>
              </div>

              {activeTab === 'devices' ? (
                <button
                  onClick={handleOpenAddDevice}
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs transition-all active:scale-95 shadow"
                >
                  <Plus className="w-3.5 h-3.5 stroke-[3]" />
                  <span>+ ডিভাইস যোগ</span>
                </button>
              ) : (
                <button
                  onClick={handleOpenAddMaterial}
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-white font-black text-xs transition-all active:scale-95 shadow"
                >
                  <Plus className="w-3.5 h-3.5 stroke-[3]" />
                  <span>+ মালামাল যোগ</span>
                </button>
              )}
            </div>

            {/* COMPACT CHIPS / BADGES VIEW FOR DEVICES */}
            {activeTab === 'devices' && (
              <div>
                {selectedRoom.devices.length > 0 ? (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {selectedRoom.devices.map((dev) => (
                      <div
                        key={dev.id}
                        className="group flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm hover:border-amber-500 transition-all"
                      >
                        <span className="text-xs font-bold text-slate-900 dark:text-white">
                          {dev.name} ({dev.quantity}টি • {dev.totalWatts}W)
                        </span>
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => handleRepeatDevice(dev)}
                            className="p-1 text-purple-600 hover:bg-purple-100 dark:hover:bg-purple-900/50 rounded transition-colors"
                            title="কপি করুন"
                          >
                            <Copy className="w-3 h-3" />
                          </button>
                          <button
                            onClick={() => handleDeleteDevice(dev.id)}
                            className="p-1 text-rose-500 hover:bg-rose-100 dark:hover:bg-rose-900/50 rounded transition-colors"
                            title="ডিলিট করুন"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-8 text-center text-xs text-slate-400 bg-slate-50/50 dark:bg-slate-800/20 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800">
                    <Zap className="w-8 h-8 text-amber-500 mx-auto mb-2 opacity-60" />
                    <p className="font-bold text-slate-600 dark:text-slate-400">
                      এই রুমে কোনো ডিভাইস যুক্ত করা হয়নি। উপরে "+ ডিভাইস যোগ" বাটনে ক্লিক করুন।
                    </p>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'materials' && (
              <div className="space-y-2.5">
                {selectedRoom.materials.map((mat) => (
                  <div
                    key={mat.id}
                    className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-slate-300 dark:hover:border-slate-700 transition-colors"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-black text-sm text-slate-900 dark:text-white">
                          {mat.name}
                        </span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                          {mat.category}
                        </span>
                      </div>
                      <div className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                        {mat.quantity} {mat.unit} × {formatTaka(mat.unitPrice)} ={' '}
                        <strong className="text-emerald-600 dark:text-emerald-400 text-sm">
                          {formatTaka(mat.totalPrice)}
                        </strong>
                        {mat.brand && ` • ব্র‍্যান্ড: ${mat.brand}`}
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 self-end sm:self-auto">
                      <button
                        onClick={() => handleRepeatMaterial(mat)}
                        className="p-2 rounded-xl text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-950/40 transition-colors"
                        title="এই মালামালটি কপি বা রিপিট করুন"
                      >
                        <Copy className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => handleDeleteMaterial(mat.id)}
                        className="p-2 rounded-xl text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                        title="মালামাল মুছে ফেলুন"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}

                {selectedRoom.materials.length === 0 && (
                  <div className="p-8 text-center text-xs text-slate-400 bg-slate-50/50 dark:bg-slate-800/20 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800">
                    <Package className="w-8 h-8 text-emerald-500 mx-auto mb-2 opacity-60" />
                    <p className="font-bold text-slate-600 dark:text-slate-400">
                      এই রুমে কোনো মালামাল যুক্ত করা হয়নি।
                    </p>
                  </div>
                )}
              </div>
            )}

          </div>

        </div>
      ) : (
        <div className="p-12 text-center text-slate-400 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800">
          রুমের তালিকা থেকে যেকোনো রুম নির্বাচন করুন অথবা নতুন রুম যোগ করুন।
        </div>
      )}

      {/* FLOATING UNDO TOAST */}
      {undoToast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-slate-950 text-white px-5 py-3.5 rounded-2xl shadow-2xl border border-amber-500/60 flex items-center gap-3 animate-in slide-in-from-bottom duration-200">
          <Trash2 className="w-4 h-4 text-rose-400 shrink-0" />
          <div className="text-xs">
            <span><strong>{undoToast.item.name}</strong> মুছে ফেলা হয়েছে।</span>
          </div>
          <button
            onClick={() => handleUndoAction(undoToast.item)}
            className="px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs transition-all active:scale-95 flex items-center gap-1.5 shadow"
          >
            <RotateCcw className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>পূর্বাবস্থায় ফেরান (Undo)</span>
          </button>
          <button
            onClick={() => setUndoToast(null)}
            className="p-1 text-slate-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* ROOM DELETE MODAL */}
      {roomToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/75 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 border-2 border-rose-500/50 rounded-3xl w-full max-w-md shadow-2xl overflow-hidden p-6 text-center space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center mx-auto shadow-inner">
              <AlertTriangle className="w-8 h-8 stroke-[2.5]" />
            </div>

            <div>
              <h3 className="text-lg font-black text-slate-900 dark:text-white leading-tight">
                Are you sure you want to delete this room?
              </h3>
              <p className="text-sm font-bold text-rose-600 dark:text-rose-400 mt-1">
                আপনি কি নিশ্চিতভাবে এই রুমটি মুছে ফেলতে চান?
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                type="button"
                onClick={() => setRoomToDelete(null)}
                className="py-3 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs transition-colors"
              >
                না, বাতিল করুন
              </button>

              <button
                type="button"
                onClick={confirmDeleteRoom}
                className="py-3 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-black text-xs shadow-md transition-all active:scale-95 flex items-center justify-center gap-1.5"
              >
                <Trash2 className="w-4 h-4" />
                <span>হ্যাঁ, ডিলিট করুন</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ALL REPORT MODAL */}
      {allReportModalOpen && project && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/75 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
            
            <div className="px-5 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-gradient-to-r from-amber-500/15 to-transparent">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-2xl bg-amber-500 text-slate-950 flex items-center justify-center font-bold shadow">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900 dark:text-white">
                    {project.name} — সম্পূর্ণ অল রিপোর্ট
                  </h3>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    সকল রুমের মোট লোড, তারের সাইজ, ব্রেকার এবং মালামালের পূর্ণাঙ্গ হিসাব
                  </p>
                </div>
              </div>

              <button
                onClick={() => setAllReportModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 overflow-y-auto space-y-6 flex-1 text-xs">
              
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                <div>
                  <span className="text-[10px] text-slate-400 block font-semibold">প্রজেক্টের মোট রুম</span>
                  <span className="text-lg font-black text-slate-900 dark:text-white">
                    {project.rooms.length} টি রুম
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block font-semibold">মোট সংযুক্ত লোড</span>
                  <span className="text-lg font-black text-amber-600 dark:text-amber-400">
                    {formatWatts(project.rooms.reduce((sum, r) => sum + r.totalWatts, 0))}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block font-semibold">প্রধান মেইন তার</span>
                  <span className="text-lg font-black text-blue-600 dark:text-blue-400 truncate block">
                    {roomCalc ? roomCalc.recommendedCable.sizeMm2 : '10 mm²'}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block font-semibold">সর্বমোট মালামাল খরচ</span>
                  <span className="text-lg font-black text-emerald-600 dark:text-emerald-400">
                    {formatTaka(project.rooms.reduce((sum, r) => sum + r.estimatedMaterialCost, 0))}
                  </span>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-extrabold text-sm text-slate-900 dark:text-white border-b border-slate-200 dark:border-slate-800 pb-2">
                  রুম অনুযায়ী বিস্তারিত হিসাব:
                </h4>

                {project.rooms.map((room) => {
                  const rCalc = calculateElectricalLoad({
                    loadWatts: room.totalWatts,
                    voltage: project.voltage || 220,
                    isThreePhase: false,
                    powerFactor: 0.85,
                    diversityFactor: 1.0,
                    lengthMeters: 15,
                    installationMethod: 'কন্ডুইট (Conduit in Wall)',
                    isMotorOrCompressor: room.devices.some(
                      (d) => d.isHeavyLoad || d.name.includes('এসি') || d.name.includes('মোটর') || d.name.includes('ফ্রিজ')
                    ),
                    hasWetAreaOrGeyser: room.type === 'বাথরুম' || room.name.includes('বাথরুম')
                  });

                  return (
                    <div 
                      key={room.id}
                      className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3"
                    >
                      <div className="flex items-center justify-between flex-wrap gap-2">
                        <div className="flex items-center gap-2">
                          <span className="text-xl">{getRoomEmoji(room.type)}</span>
                          <div>
                            <h5 className="font-black text-sm text-slate-900 dark:text-white">
                              {room.name} <span className="text-xs font-normal text-slate-500">({room.type})</span>
                            </h5>
                            <p className="text-[10px] text-slate-400">
                              {room.areaSqFt ? `সাইজ: ${room.areaSqFt} বর্গফুট` : ''} {room.notes ? `• নোট: ${room.notes}` : ''}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="text-xs font-black text-amber-600 dark:text-amber-400 font-mono">
                            {formatWatts(room.totalWatts)}
                          </span>
                          <span className="text-[10px] text-slate-400 block">
                            খরচ: {formatTaka(room.estimatedMaterialCost)}
                          </span>
                        </div>
                      </div>

                      <div className="p-3 rounded-xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 text-[11px] space-y-1">
                        <div className="flex items-center justify-between font-bold text-amber-950 dark:text-amber-300">
                          <span>প্রস্তাবিত তার ও সুরক্ষা স্পেক্স:</span>
                          <span className="text-blue-600 dark:text-blue-400">
                            মেইন তার: {rCalc.recommendedCable.sizeMm2} ({rCalc.recommendedCable.rmEquivalent})
                          </span>
                        </div>
                        <p className="text-slate-600 dark:text-slate-300">
                          • ব্রেকার: <strong>{rCalc.recommendedBreakerRatingA}A Type C MCB</strong> • আর্থিং তার: <strong>{rCalc.recommendedEarthWire}</strong>
                        </p>
                      </div>

                      {room.devices.length > 0 ? (
                        <div className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden">
                          <table className="w-full text-left text-[11px]">
                            <thead className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold">
                              <tr>
                                <th className="p-2">ডিভাইস</th>
                                <th className="p-2 text-center">সংখ্যা</th>
                                <th className="p-2 text-right">ওয়াট</th>
                                <th className="p-2 text-right">মোট ওয়াট</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                              {room.devices.map((d) => (
                                <tr key={d.id}>
                                  <td className="p-2 font-medium text-slate-800 dark:text-slate-200">
                                    {d.name} {d.isHeavyLoad ? '⚡ (ভারী লোড)' : ''}
                                  </td>
                                  <td className="p-2 text-center">{d.quantity} টি</td>
                                  <td className="p-2 text-right font-mono">{d.wattsPerUnit} W</td>
                                  <td className="p-2 text-right font-bold font-mono text-amber-600 dark:text-amber-400">
                                    {d.totalWatts} W
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      ) : (
                        <p className="text-[11px] text-slate-400 italic">এই রুমে কোনো ডিভাইস যোগ করা হয়নি।</p>
                      )}
                    </div>
                  );
                })}
              </div>

            </div>

            <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 flex items-center justify-between">
              <span className="text-xs text-slate-500 font-medium">
                রাকিব ইলেকট্রিক্যাল ক্যালকুলেটর
              </span>
              <button
                onClick={() => setAllReportModalOpen(false)}
                className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs transition-colors"
              >
                ঠিক আছে (Close)
              </button>
            </div>

          </div>
        </div>
      )}

      {/* CREATE / EDIT ROOM MODAL */}
      {roomModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/70 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-md shadow-2xl overflow-hidden flex flex-col">
            <div className="px-5 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-800/50">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                {editingRoom ? 'রুমের তথ্য পরিবর্তন' : 'নতুন রুম তৈরি করুন'}
              </h3>
              <button
                onClick={() => setRoomModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveRoom} className="p-5 space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  রুমের ধরন
                </label>
                <select
                  value={roomType}
                  onChange={(e) => setRoomType(e.target.value as RoomType)}
                  className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                >
                  <option value="বেডরুম">বেডরুম</option>
                  <option value="ড্রয়িং রুম">ড্রয়িং রুম</option>
                  <option value="ডাইনিং রুম">ডাইনিং রুম</option>
                  <option value="রান্নাঘর">রান্নাঘর</option>
                  <option value="বাথরুম">বাথরুম</option>
                  <option value="বারান্দা">বারান্দা</option>
                  <option value="সিঁড়িঘর">সিঁড়িঘর</option>
                  <option value="গ্যারেজ">গ্যারেজ</option>
                  <option value="দোকান">দোকান</option>
                  <option value="অফিস">অফিস</option>
                  <option value="ছাদ">ছাদ</option>
                  <option value="অন্যান্য">অন্যান্য</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  রুমের নির্দিষ্ট নাম (যেমন: রুম ১, মাস্টার বেডরুম ইত্যাদি)
                </label>
                <input
                  type="text"
                  required
                  placeholder="যেমন: রুম ১"
                  value={roomName}
                  onChange={(e) => setRoomName(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    দৈর্ঘ্য (ফুট)
                  </label>
                  <input
                    type="number"
                    value={lengthFt}
                    onChange={(e) => setLengthFt(Number(e.target.value))}
                    className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    প্রস্থ (ফুট)
                  </label>
                  <input
                    type="number"
                    value={widthFt}
                    onChange={(e) => setWidthFt(Number(e.target.value))}
                    className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  রুমের বিশেষ নোট
                </label>
                <input
                  type="text"
                  placeholder="যেমন: ফলস সিলিং ও ডাবল এসি রয়েছে"
                  value={roomNotes}
                  onChange={(e) => setRoomNotes(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-sm shadow-md transition-all flex items-center justify-center gap-2"
                >
                  <Check className="w-4 h-4 stroke-[3]" />
                  <span>{editingRoom ? 'আপডেট করুন' : 'সংরক্ষণ করুন'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ADD DEVICE MODAL */}
      {deviceModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/70 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="px-5 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-800/50">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                রুমে ডিভাইস বা যন্ত্রপাতি যোগ করুন
              </h3>
              <button
                onClick={() => setDeviceModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveDevice} className="p-5 overflow-y-auto space-y-3.5 flex-1">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  ডিভাইস ক্যাটালগ থেকে নির্বাচন করুন
                </label>
                <select
                  value={selectedCatalogDevice.name}
                  onChange={(e) => {
                    const found = DEFAULT_DEVICES.find((d) => d.name === e.target.value);
                    if (found) handleCatalogDeviceChange(found);
                  }}
                  className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                >
                  {DEFAULT_DEVICES.map((d) => (
                    <option key={d.name} value={d.name}>
                      {d.name} ({d.defaultWatts}W)
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  ডিভাইসের নাম <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={devName}
                  onChange={(e) => setDevName(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    পরিমাণ (সংখ্যা) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={devQty}
                    onChange={(e) => setDevQty(Number(e.target.value))}
                    className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    প্রতিটির ওয়াট (Watts) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={devWatts}
                    onChange={(e) => setDevWatts(Number(e.target.value))}
                    className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-sm shadow-md transition-all flex items-center justify-center gap-2"
                >
                  <Check className="w-4 h-4 stroke-[3]" />
                  <span>ডিভাইস যুক্ত করুন</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ADD MATERIAL MODAL */}
      {matModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/70 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-md shadow-2xl overflow-hidden flex flex-col">
            <div className="px-5 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-800/50">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                রুমে মালামাল যুক্ত করুন
              </h3>
              <button
                onClick={() => setMatModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveMaterial} className="p-5 space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  ক্যাটালগ থেকে দ্রুত বাছাই করুন
                </label>
                <select
                  onChange={(e) => {
                    const item = DEFAULT_MATERIALS.find((m) => m.name === e.target.value);
                    if (item) handleSelectDefaultMaterial(item);
                  }}
                  className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
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
                  className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
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
                    className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
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
                    className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
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
                    className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-sm shadow-md transition-all flex items-center justify-center gap-2"
                >
                  <Check className="w-4 h-4 stroke-[3]" />
                  <span>মালামাল যুক্ত করুন</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
