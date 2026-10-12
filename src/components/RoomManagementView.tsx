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
  const [searchQuery, setSearchQuery] = useState('');

  // Confirmation modal state for Room Deletion ("Are you sure you want to delete this room?")
  const [roomToDelete, setRoomToDelete] = useState<Room | null>(null);

  // Comprehensive Undo Stack & Toast
  const [undoStack, setUndoStack] = useState<UndoItem[]>([]);
  const [undoToast, setUndoToast] = useState<{ item: UndoItem; timerId: any } | null>(null);
  const [undoHistoryModalOpen, setUndoHistoryModalOpen] = useState(false);

  // All Report Modal for the active room (requested: all report name a)
  const [allReportModalOpen, setAllReportModalOpen] = useState(false);

  // Room Create / Edit Modal
  const [roomModalOpen, setRoomModalOpen] = useState(false);
  const [editingRoom, setEditingRoom] = useState<Room | null>(null);

  // Room form fields
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

  // Add Material to Room Modal
  const [matModalOpen, setMatModalOpen] = useState(false);
  const [matName, setMatName] = useState('');
  const [matCategory, setMatCategory] = useState('সুইচ ও সকেট');
  const [matBrand, setMatBrand] = useState('Super Star');
  const [matQty, setMatQty] = useState(1);
  const [matUnit, setMatUnit] = useState('পিস');
  const [matPrice, setMatPrice] = useState(120);

  // Sync selectedRoomId if room list changes or initial load
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
          রুম ও ওয়্যারিংয়ের হিসাব পরিচালনা করতে প্রথমে উপরে প্রজেক্ট সিলেক্ট করুন অথবা নতুন প্রজেক্ট তৈরি করুন।
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

  // Calculate electrical specs for selected room (wire size, breaker, voltage drop)
  const roomCalc = selectedRoom
    ? calculateElectricalLoad({
        loadWatts: selectedRoom.totalWatts,
        voltage: project.voltage || 220,
        isThreePhase: false, // Individual rooms are single phase fed
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
    if (type.includes('ড্রয়িং')) return '🛋️';
    if (type.includes('ডাইনিং')) return '🍽️';
    if (type.includes('রান্না') || type.includes('কিচেন')) return '🍳';
    if (type.includes('বাথরুম')) return '🚿';
    if (type.includes('বারান্দা')) return '🌿';
    if (type.includes('সিঁড়ি')) return '🪜';
    if (type.includes('গ্যারেজ')) return '🚗';
    if (type.includes('দোকান')) return '🏪';
    if (type.includes('অফিস')) return '🏢';
    if (type.includes('ছাদ')) return '🌇';
    return '⚡';
  };

  // Focus and bring room in front with smooth scroll
  const handleSelectRoomAndBringToFront = (roomId: string) => {
    setSelectedRoomId(roomId);
    const workbenchEl = document.getElementById('active-room-workbench');
    if (workbenchEl) {
      workbenchEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const openCreateRoomModal = () => {
    setEditingRoom(null);
    setRoomName('');
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
    const finalName = roomName.trim() || roomType;
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

  // Safe In-App Delete Room Handling with Confirmation Popup
  const triggerDeleteRoom = (r: Room) => {
    setRoomToDelete(r);
  };

  const confirmDeleteRoom = () => {
    if (!roomToDelete) return;
    const targetRoom = roomToDelete;
    setRoomToDelete(null);

    // Call onDeleteRoom
    onDeleteRoom(project.id, targetRoom.id);

    // Push to undo stack
    const undoItem: UndoItem = {
      id: `undo-${Date.now()}`,
      type: 'room',
      name: `রুম: ${targetRoom.name}`,
      data: targetRoom,
      timestamp: Date.now()
    };
    setUndoStack((prev) => [undoItem, ...prev]);

    // Set auto-dismissing Undo toast
    if (undoToast?.timerId) clearTimeout(undoToast.timerId);
    const timer = setTimeout(() => {
      setUndoToast(null);
    }, 15000);

    setUndoToast({
      item: undoItem,
      timerId: timer
    });

    // Pick next available room to bring into front
    const remaining = project.rooms.filter((r) => r.id !== targetRoom.id);
    if (remaining.length > 0) {
      setSelectedRoomId(remaining[0].id);
    } else {
      setSelectedRoomId(null);
    }
  };

  // Universal Undo Handler
  const handleUndoAction = (itemToRestore?: UndoItem) => {
    const item = itemToRestore || undoToast?.item || undoStack[0];
    if (!item) return;

    if (undoToast?.timerId) clearTimeout(undoToast.timerId);
    setUndoToast(null);

    // Remove from undo stack
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

  // Device Add & Repeat Handling
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

  // Device Repeat (Duplicate) with 1 click
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

    // Push to undo stack
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

  // Material Add & Repeat Handling
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

  // Material Repeat (Duplicate) with 1 click
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

    // Push to undo stack
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
      
      {/* Top Banner & Quick Actions Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white dark:bg-slate-900 p-4 sm:p-5 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-2xl bg-amber-500 text-slate-950 flex items-center justify-center font-black shadow-md shadow-amber-500/20">
              <DoorOpen className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <h1 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white">
                রুম তৈরি ও ওয়্যারিং ম্যানেজার
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                প্রজেক্ট: <strong className="text-slate-800 dark:text-slate-200">{project.name}</strong> • মোট {project.rooms.length}টি রুম
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto flex-wrap">
          {/* Universal Undo Button */}
          {undoStack.length > 0 && (
            <button
              onClick={() => handleUndoAction()}
              className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-2xl bg-blue-50 dark:bg-blue-950/70 border border-blue-300 dark:border-blue-800 text-blue-700 dark:text-blue-300 font-black text-xs hover:bg-blue-100 transition-all active:scale-95 shadow-sm"
              title="সর্বশেষ মুছে ফেলা আইটেম ফিরিয়ে আনুন"
            >
              <RotateCcw className="w-4 h-4 stroke-[2.5]" />
              <span>আনডু / রিস্টোর ({undoStack.length})</span>
            </button>
          )}

          {/* New Room Button */}
          <button
            onClick={openCreateRoomModal}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-amber-500 hover:bg-amber-400 active:scale-95 text-slate-950 font-black text-xs sm:text-sm shadow-md transition-all"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>নতুন রুম তৈরি</span>
          </button>
        </div>
      </div>

      {/* TELECOM APPS STYLE HORIZONTAL ROOM PICKER SLIDER WITH DIRECT DELETE BUTTON */}
      <div className="bg-white dark:bg-slate-900 p-3 sm:p-4 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex items-center justify-between mb-2.5 px-1">
          <div className="flex items-center gap-2">
            <LayoutGrid className="w-4 h-4 text-amber-500" />
            <span className="text-xs font-black text-slate-700 dark:text-slate-300">
              রুম সিলেক্টর (ট্যাপ করলেই সামনে আসবে):
            </span>
          </div>
          <span className="text-[11px] font-bold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/60 px-2.5 py-0.5 rounded-full border border-amber-200 dark:border-amber-900/40">
            {project.rooms.length}টি রুম উপলব্ধ
          </span>
        </div>

        <div className="flex items-center gap-2.5 overflow-x-auto pb-2 pt-1 scrollbar-none snap-x">
          {/* Add New Room Fast Pill */}
          <button
            onClick={openCreateRoomModal}
            className="flex flex-col items-center justify-center p-3 rounded-2xl border-2 border-dashed border-amber-400/80 hover:border-amber-500 bg-amber-50/50 dark:bg-amber-950/20 text-amber-800 dark:text-amber-300 min-w-[110px] shrink-0 active:scale-95 transition-all text-center group"
          >
            <div className="w-8 h-8 rounded-full bg-amber-500 text-slate-950 flex items-center justify-center mb-1 shadow-sm font-bold group-hover:scale-110 transition-transform">
              <Plus className="w-4 h-4 stroke-[3]" />
            </div>
            <span className="text-[11px] font-black">+ নতুন রুম</span>
          </button>

          {/* Rooms horizontal tiles */}
          {project.rooms.map((room) => {
            const isSelected = room.id === selectedRoom?.id;
            const emoji = getRoomEmoji(room.type);

            return (
              <div
                key={room.id}
                onClick={() => handleSelectRoomAndBringToFront(room.id)}
                className={`relative group flex flex-col items-start p-3 rounded-2xl border text-left min-w-[160px] sm:min-w-[185px] shrink-0 cursor-pointer active:scale-95 transition-all snap-start ${
                  isSelected
                    ? 'bg-amber-500 text-slate-950 border-amber-500 shadow-lg shadow-amber-500/25 ring-2 ring-amber-400'
                    : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 hover:border-amber-400 dark:hover:border-amber-500 text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                {/* Header row with emoji, badge, and DIRECT DELETE ICON */}
                <div className="flex items-center justify-between w-full mb-1">
                  <div className="flex items-center gap-1.5">
                    <span className="text-lg">{emoji}</span>
                    <span
                      className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                        isSelected
                          ? 'bg-slate-950 text-amber-300'
                          : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      {room.type}
                    </span>
                  </div>

                  {/* DIRECT DELETE BUTTON WITH CONFIRMATION POPUP */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      triggerDeleteRoom(room);
                    }}
                    className={`p-1 rounded-lg transition-colors ${
                      isSelected
                        ? 'text-slate-900 hover:bg-slate-950 hover:text-rose-400'
                        : 'text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/60'
                    }`}
                    title="এই রুম মুছে ফেলুন (Delete)"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Room Name */}
                <div className="font-black text-xs truncate w-full mt-0.5">
                  {room.name}
                </div>

                {/* Sub row with devices & watts */}
                <div className="flex items-center justify-between w-full mt-2 text-[10px] font-semibold">
                  <span className={isSelected ? 'text-slate-900 font-bold' : 'text-slate-500 dark:text-slate-400'}>
                    {room.devices.length} ডিভাইস
                  </span>
                  <span className={`font-mono font-bold ${isSelected ? 'text-slate-950' : 'text-amber-600 dark:text-amber-400'}`}>
                    {formatWatts(room.totalWatts)}
                  </span>
                </div>

                {/* Active Indicator Badge */}
                {isSelected && (
                  <div className="mt-1 text-[9px] font-black text-slate-950/90 flex items-center gap-1 bg-amber-400/80 px-1.5 py-0.5 rounded-md">
                    <CheckCircle2 className="w-2.5 h-2.5" />
                    <span>সামনে খোলা আছে ✓</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* ACTIVE ROOM MAIN WORKBENCH (ALWAYS IN FRONT!) */}
      {selectedRoom ? (
        <div
          id="active-room-workbench"
          className="bg-white dark:bg-slate-900 rounded-3xl border-2 border-amber-400/90 dark:border-amber-500/70 shadow-2xl overflow-hidden transition-all"
        >
          {/* Top Quick Room Switcher Bar directly inside Workbench */}
          <div className="px-4 py-2.5 bg-slate-900 text-white flex items-center justify-between gap-2 text-xs flex-wrap">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-slate-300 font-medium">বর্তমানে সামনে খোলা রুম:</span>
              <strong className="text-amber-400 font-bold">{selectedRoom.name}</strong>
              <span className="text-slate-400">({selectedRoom.type})</span>
            </div>

            {/* Quick Switch Dropdown */}
            <div className="flex items-center gap-1.5 ml-auto">
              <span className="text-[11px] text-slate-400 hidden sm:inline">রুম বদলান:</span>
              <select
                value={selectedRoom.id}
                onChange={(e) => handleSelectRoomAndBringToFront(e.target.value)}
                className="bg-slate-800 border border-slate-700 text-slate-200 text-xs rounded-xl px-2.5 py-1 focus:outline-none focus:ring-1 focus:ring-amber-500 cursor-pointer"
              >
                {project.rooms.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.name} ({r.type} - {formatWatts(r.totalWatts)})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Room Header bar */}
          <div className="p-4 sm:p-6 bg-gradient-to-r from-amber-500/15 via-amber-500/5 to-transparent border-b border-slate-200 dark:border-slate-800">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2.5 flex-wrap">
                  <span className="text-3xl">{getRoomEmoji(selectedRoom.type)}</span>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                        {selectedRoom.name}
                      </h2>
                      <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-amber-500 text-slate-950 shadow-sm">
                        {selectedRoom.type}
                      </span>
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                        {selectedRoom.status}
                      </span>
                    </div>
                    {selectedRoom.areaSqFt ? (
                      <p className="text-xs text-slate-500 font-semibold mt-1">
                        সাইজ: {selectedRoom.lengthFt}' × {selectedRoom.widthFt}' = {selectedRoom.areaSqFt} বর্গফুট
                        {selectedRoom.notes && ` • নোট: ${selectedRoom.notes}`}
                      </p>
                    ) : null}
                  </div>
                </div>
              </div>

              {/* Direct Actions in header */}
              <div className="flex items-center gap-2 self-start sm:self-auto flex-wrap">
                <button
                  onClick={() => openEditRoomModal(selectedRoom)}
                  className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs flex items-center gap-1.5 transition-colors"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                  <span>এডিট</span>
                </button>
                <button
                  onClick={() => triggerDeleteRoom(selectedRoom)}
                  className="px-3 py-1.5 rounded-xl bg-rose-50 dark:bg-rose-950/50 hover:bg-rose-100 dark:hover:bg-rose-900/50 text-rose-700 dark:text-rose-300 font-bold text-xs flex items-center gap-1.5 border border-rose-200 dark:border-rose-900 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>রুম ডিলিট</span>
                </button>
              </div>
            </div>

            {/* TELECOM APPS STYLE 8 ACTION TILES (গর গর করে সাজানো অপশন) */}
            <div className="grid grid-cols-2 xs:grid-cols-4 sm:grid-cols-8 gap-2 sm:gap-2.5 mt-5">
              
              {/* Tile 1: Add Device */}
              <button
                onClick={handleOpenAddDevice}
                className="flex flex-col items-center justify-center p-3 rounded-2xl bg-gradient-to-b from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 active:scale-95 text-slate-950 shadow-md transition-all text-center group"
              >
                <div className="w-8 h-8 rounded-xl bg-slate-950 text-amber-400 flex items-center justify-center mb-1.5 shadow-inner">
                  <Zap className="w-4 h-4 fill-amber-400" />
                </div>
                <span className="text-[11px] font-black leading-tight text-slate-950">
                  ডিভাইস যোগ
                </span>
                <span className="text-[9px] font-semibold text-slate-900/80">লোড দিন</span>
              </button>

              {/* Tile 2: Add Material */}
              <button
                onClick={handleOpenAddMaterial}
                className="flex flex-col items-center justify-center p-3 rounded-2xl bg-gradient-to-b from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 active:scale-95 text-white shadow-md transition-all text-center group"
              >
                <div className="w-8 h-8 rounded-xl bg-slate-950 text-emerald-400 flex items-center justify-center mb-1.5 shadow-inner">
                  <Package className="w-4 h-4" />
                </div>
                <span className="text-[11px] font-black leading-tight">
                  মালামাল যোগ
                </span>
                <span className="text-[9px] font-semibold text-emerald-100">সুইচ/বক্স</span>
              </button>

              {/* Tile 3: All Report (Requested by user: all report name a) */}
              <button
                onClick={() => setAllReportModalOpen(true)}
                className="flex flex-col items-center justify-center p-3 rounded-2xl bg-gradient-to-b from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 active:scale-95 text-white shadow-md transition-all text-center group"
              >
                <div className="w-8 h-8 rounded-xl bg-slate-950 text-blue-400 flex items-center justify-center mb-1.5 shadow-inner">
                  <FileText className="w-4 h-4" />
                </div>
                <span className="text-[11px] font-black leading-tight">
                  অল রিপোর্ট
                </span>
                <span className="text-[9px] font-semibold text-blue-100">তার ও হিসাব</span>
              </button>

              {/* Tile 4: Repeat / Duplicate Room */}
              <button
                onClick={() => onDuplicateRoom(project.id, selectedRoom)}
                className="flex flex-col items-center justify-center p-3 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 active:scale-95 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 transition-all text-center group"
              >
                <div className="w-8 h-8 rounded-xl bg-purple-100 dark:bg-purple-950 text-purple-600 dark:text-purple-400 flex items-center justify-center mb-1.5">
                  <Copy className="w-4 h-4" />
                </div>
                <span className="text-[11px] font-bold leading-tight">
                  রুম রিপিট
                </span>
                <span className="text-[9px] text-slate-500">ডুপ্লিকেট কপি</span>
              </button>

              {/* Tile 5: Edit Room */}
              <button
                onClick={() => openEditRoomModal(selectedRoom)}
                className="flex flex-col items-center justify-center p-3 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 active:scale-95 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 transition-all text-center group"
              >
                <div className="w-8 h-8 rounded-xl bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-1.5">
                  <Edit2 className="w-4 h-4" />
                </div>
                <span className="text-[11px] font-bold leading-tight">
                  রুম এডিট
                </span>
                <span className="text-[9px] text-slate-500">নাম/সাইজ</span>
              </button>

              {/* Tile 6: Delete Room (Triggers Custom In-App Modal with Pop-up!) */}
              <button
                onClick={() => triggerDeleteRoom(selectedRoom)}
                className="flex flex-col items-center justify-center p-3 rounded-2xl bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 dark:hover:bg-rose-900/40 active:scale-95 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-900 transition-all text-center group"
              >
                <div className="w-8 h-8 rounded-xl bg-rose-600 text-white flex items-center justify-center mb-1.5 shadow-sm">
                  <Trash2 className="w-4 h-4" />
                </div>
                <span className="text-[11px] font-bold leading-tight">
                  রুম ডিলিট
                </span>
                <span className="text-[9px] text-rose-500">পপ-আপ সহ</span>
              </button>

              {/* Tile 7: Undo / Restore History */}
              <button
                onClick={() => setUndoHistoryModalOpen(true)}
                className="flex flex-col items-center justify-center p-3 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 active:scale-95 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 transition-all text-center group"
              >
                <div className="w-8 h-8 rounded-xl bg-teal-100 dark:bg-teal-950 text-teal-600 dark:text-teal-400 flex items-center justify-center mb-1.5">
                  <RotateCcw className="w-4 h-4" />
                </div>
                <span className="text-[11px] font-bold leading-tight">
                  আনডু হিস্ট্রি
                </span>
                <span className="text-[9px] text-slate-500">
                  {undoStack.length > 0 ? `${undoStack.length}টি জমা` : 'খালি'}
                </span>
              </button>

              {/* Tile 8: Quick Load Summary */}
              <button
                onClick={() => setAllReportModalOpen(true)}
                className="flex flex-col items-center justify-center p-3 rounded-2xl bg-amber-50 dark:bg-amber-950/40 hover:bg-amber-100 dark:hover:bg-amber-900/40 active:scale-95 text-amber-800 dark:text-amber-200 border border-amber-200 dark:border-amber-900 transition-all text-center group"
              >
                <div className="w-8 h-8 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center mb-1.5 font-bold">
                  <Flame className="w-4 h-4" />
                </div>
                <span className="text-[11px] font-bold leading-tight">
                  তার ও ব্রেকার
                </span>
                <span className="text-[9px] text-amber-600 dark:text-amber-400">স্পেক্স</span>
              </button>

            </div>
          </div>

          {/* DYNAMIC ELECTRICAL CALCULATIONS & WIRE/BREAKER SUMMARY BAR */}
          {roomCalc && (
            <div className="p-4 sm:p-5 bg-slate-50 dark:bg-slate-950/60 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-black text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <Zap className="w-4 h-4 text-amber-500" />
                  <span>রুমের লাইভ ইলেকট্রিক্যাল হিসাব ও তারের সাইজ:</span>
                </span>
                <button
                  onClick={() => setAllReportModalOpen(true)}
                  className="text-xs font-black text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>সম্পূর্ণ অল রিপোর্ট খুলুন ↗</span>
                </button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {/* Total Watts */}
                <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
                  <span className="text-[10px] text-slate-400 font-semibold block">রুমের মোট লোড</span>
                  <span className="text-base sm:text-lg font-black text-amber-600 dark:text-amber-400 block mt-0.5">
                    {formatWatts(selectedRoom.totalWatts)}
                  </span>
                  <span className="text-[10px] text-slate-500 font-mono">
                    কারেন্ট: {formatAmps(selectedRoom.totalAmps)}
                  </span>
                </div>

                {/* Recommended Wire */}
                <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
                  <span className="text-[10px] text-slate-400 font-semibold block">প্রস্তাবিত মেইন তারের সাইজ</span>
                  <span className="text-base sm:text-lg font-black text-blue-600 dark:text-blue-400 block mt-0.5 truncate">
                    {roomCalc.recommendedCable.sizeMm2}
                  </span>
                  <span className="text-[10px] text-slate-500 truncate block">
                    {roomCalc.recommendedCable.rmEquivalent} কপার তার
                  </span>
                </div>

                {/* Recommended Breaker */}
                <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
                  <span className="text-[10px] text-slate-400 font-semibold block">প্রস্তাবিত সার্কিট ব্রেকার</span>
                  <span className="text-base sm:text-lg font-black text-emerald-600 dark:text-emerald-400 block mt-0.5">
                    {roomCalc.recommendedBreakerRatingA}A Type C
                  </span>
                  <span className="text-[10px] text-slate-500">
                    আর্থ তার: {roomCalc.recommendedEarthWire}
                  </span>
                </div>

                {/* Material Cost */}
                <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
                  <span className="text-[10px] text-slate-400 font-semibold block">রুমের মালামাল মোট খরচ</span>
                  <span className="text-base sm:text-lg font-black text-emerald-600 dark:text-emerald-400 block mt-0.5">
                    {formatTaka(selectedRoom.estimatedMaterialCost)}
                  </span>
                  <span className="text-[10px] text-slate-500">
                    মোট {selectedRoom.materials.length}টি মালামাল আইটেম
                  </span>
                </div>
              </div>

              {/* Safety warning if bathroom or heavy load */}
              {roomCalc.recommendedRccbRequired && (
                <div className="mt-3 p-3 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300 text-xs flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 shrink-0" />
                  <span>
                    <strong>বাথরুম / গিজার শক প্রটেকশন:</strong> এই রুমের লাইনে অবশ্যই ৩০mA RCCB বা RCBO সার্কিট ব্রেকার ব্যবহার করুন।
                  </span>
                </div>
              )}
            </div>
          )}

          {/* DEVICES VS MATERIALS TABS */}
          <div className="p-4 sm:p-6 space-y-4">
            
            {/* Tabs Header */}
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

            {/* DEVICES LIST CONTENT */}
            {activeTab === 'devices' && (
              <div className="space-y-2.5">
                {selectedRoom.devices.map((dev) => (
                  <div
                    key={dev.id}
                    className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-slate-300 dark:hover:border-slate-700 transition-colors"
                  >
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-black text-sm text-slate-900 dark:text-white">
                          {dev.name}
                        </span>
                        {dev.isHeavyLoad && (
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300">
                            ভারী লোড (আলাদা সার্কিট)
                          </span>
                        )}
                        <span className="text-[10px] text-slate-400">({dev.source})</span>
                      </div>
                      <div className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                        পরিমাণ: <strong className="text-slate-900 dark:text-white">{dev.quantity} টি</strong> × {dev.wattsPerUnit} W ={' '}
                        <strong className="text-amber-600 dark:text-amber-400 text-sm">
                          {dev.totalWatts} W
                        </strong>{' '}
                        • পাওয়ার ফ্যাক্টর: {dev.powerFactor}
                      </div>
                      {dev.suggestedWire && (
                        <div className="text-[11px] text-slate-500 mt-1 flex items-center gap-2.5 flex-wrap">
                          <span className="flex items-center gap-1">
                            <Cable className="w-3 h-3 text-blue-500" />
                            তার: <strong>{dev.suggestedWire}</strong>
                          </span>
                          <span className="flex items-center gap-1">
                            <ShieldCheck className="w-3 h-3 text-emerald-500" />
                            ব্রেকার: <strong>{dev.suggestedBreaker}</strong>
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-1.5 self-end sm:self-auto">
                      {/* Repeat (Duplicate) device */}
                      <button
                        onClick={() => handleRepeatDevice(dev)}
                        className="p-2 rounded-xl text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-950/40 transition-colors"
                        title="এই ডিভাইসটি কপি বা রিপিট করুন"
                      >
                        <Copy className="w-4 h-4" />
                      </button>

                      {/* Delete device */}
                      <button
                        onClick={() => handleDeleteDevice(dev.id)}
                        className="p-2 rounded-xl text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                        title="ডিভাইস মুছে ফেলুন (আনডু করা যাবে)"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}

                {selectedRoom.devices.length === 0 && (
                  <div className="p-8 text-center text-xs text-slate-400 bg-slate-50/50 dark:bg-slate-800/20 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800">
                    <Zap className="w-8 h-8 text-amber-500 mx-auto mb-2 opacity-60" />
                    <p className="font-bold text-slate-600 dark:text-slate-400">
                      এই রুমে কোনো ডিভাইস যুক্ত করা হয়নি।
                    </p>
                    <p className="text-[11px] text-slate-400 mt-1">
                      উপরে "+ ডিভাইস যোগ" বাটনে চাপ দিয়ে লাইট, ফ্যান, এসি বা ফ্রিজ যুক্ত করুন।
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* MATERIALS LIST CONTENT */}
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
                      {/* Repeat material */}
                      <button
                        onClick={() => handleRepeatMaterial(mat)}
                        className="p-2 rounded-xl text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-950/40 transition-colors"
                        title="এই মালামালটি কপি বা রিপিট করুন"
                      >
                        <Copy className="w-4 h-4" />
                      </button>

                      {/* Delete material */}
                      <button
                        onClick={() => handleDeleteMaterial(mat.id)}
                        className="p-2 rounded-xl text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                        title="মালামাল মুছে ফেলুন (আনডু করা যাবে)"
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
                      এই রুমে কোনো মালামাল যুক্ত করা হয়নি।
                    </p>
                    <p className="text-[11px] text-slate-400 mt-1">
                      উপরে "+ মালামাল যোগ" বাটনে চাপ দিয়ে সুইচ, সকেট বা বোর্ড যুক্ত করুন।
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

      {/* FLOATING UNDO TOAST NOTIFICATION */}
      {undoToast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-slate-950 text-white px-5 py-3.5 rounded-2xl shadow-2xl border border-amber-500/60 flex items-center gap-3 animate-in slide-in-from-bottom duration-200">
          <Trash2 className="w-4 h-4 text-rose-400 shrink-0" />
          <div className="text-xs">
            <span><strong>{undoToast.item.name}</strong> মুছে ফেলা হয়েছে।</span>
          </div>
          <button
            onClick={() => handleUndoAction(undoToast.item)}
            className="px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs transition-all active:scale-95 flex items-center gap-1.5 shadow"
          >
            <RotateCcw className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>পূর্বাবস্থায় ফেরান (Undo)</span>
          </button>
          <button
            onClick={() => setUndoToast(null)}
            className="p-1 text-slate-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* CUSTOM IN-APP DELETE ROOM CONFIRMATION POPUP MODAL ("Are you sure you want to delete this room?") */}
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

              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-left mt-3.5 space-y-1.5 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-500">রুমের নাম:</span>
                  <strong className="text-slate-900 dark:text-white">{roomToDelete.name}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">রুমের ধরন:</span>
                  <strong className="text-amber-600">{roomToDelete.type}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">মোট লোড:</span>
                  <strong className="font-mono text-amber-600">{formatWatts(roomToDelete.totalWatts)}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">সংযুক্ত ডিভাইস:</span>
                  <strong className="text-slate-900 dark:text-white">{roomToDelete.devices.length} টি</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">সংযুক্ত মালামাল:</span>
                  <strong className="text-emerald-600">{roomToDelete.materials.length} টি</strong>
                </div>
              </div>

              <p className="text-[11px] text-blue-600 dark:text-blue-400 mt-3 font-semibold">
                💡 মুছে ফেলার পরও আপনি 'আনডু (Undo)' বাটন চেপে সাথে সাথে এটি ফিরিয়ে আনতে পারবেন।
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

      {/* ALL REPORT MODAL FOR THE ACTIVE ROOM (Requested by user: all report name a) */}
      {allReportModalOpen && selectedRoom && roomCalc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/75 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
            
            {/* Header */}
            <div className="px-5 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-gradient-to-r from-amber-500/10 to-transparent">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-2xl bg-amber-500 text-slate-950 flex items-center justify-center font-bold">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900 dark:text-white">
                    {selectedRoom.name} — সম্পূর্ণ অল রিপোর্ট (All Report)
                  </h3>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    রুমের ডিভাইসের লোড, প্রস্তাবিত তারের সাইজ, ব্রেকার ও মালামালের পূর্ণাঙ্গ বিবরণ
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

            {/* Body */}
            <div className="p-5 overflow-y-auto space-y-5 flex-1 text-xs">
              
              {/* Top Electrical Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                <div>
                  <span className="text-[10px] text-slate-400 block font-semibold">মোট সংযুক্ত লোড</span>
                  <span className="text-base font-black text-amber-600 dark:text-amber-400">
                    {formatWatts(selectedRoom.totalWatts)}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block font-semibold">আনুমানিক কারেন্ট</span>
                  <span className="text-base font-black text-blue-600 dark:text-blue-400 font-mono">
                    {formatAmps(selectedRoom.totalAmps)}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block font-semibold">প্রস্তাবিত মেইন তার</span>
                  <span className="text-base font-black text-slate-900 dark:text-white truncate block">
                    {roomCalc.recommendedCable.sizeMm2}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block font-semibold">প্রস্তাবিত ব্রেকার</span>
                  <span className="text-base font-black text-emerald-600 dark:text-emerald-400">
                    {roomCalc.recommendedBreakerRatingA}A Type C
                  </span>
                </div>
              </div>

              {/* Wire & Safety Guide for this room */}
              <div className="p-4 rounded-2xl bg-amber-50/80 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 space-y-2">
                <span className="font-black text-amber-950 dark:text-amber-200 block text-xs flex items-center gap-1.5">
                  <Cable className="w-4 h-4 text-amber-600" />
                  <span>ইলেকট্রিশিয়ান ওয়্যারিং ও তারের সাইজ নির্দেশনা:</span>
                </span>
                <p className="text-slate-700 dark:text-slate-300">
                  • এই রুমের মেইন সুইচবোর্ড ফিড করতে <strong>{roomCalc.recommendedCable.sizeMm2} ({roomCalc.recommendedCable.rmEquivalent}) কপার তার</strong> ব্যবহার করুন।
                </p>
                <p className="text-slate-700 dark:text-slate-300">
                  • সুরক্ষা ব্রেকার: <strong>{roomCalc.recommendedBreakerRatingA}A Type C MCB</strong>। আর্থিং কন্ডাক্টর: <strong>{roomCalc.recommendedEarthWire} তামার তার</strong>।
                </p>
                {roomCalc.recommendedRccbRequired && (
                  <p className="text-rose-700 dark:text-rose-300 font-bold">
                    • ⚠️ এই রুমে বাথরুম/গিজার থাকায় ৩০mA RCCB শক প্রটেকশন ব্রেকার অবশ্যই দিতে হবে।
                  </p>
                )}
              </div>

              {/* Devices Table */}
              <div>
                <h4 className="font-bold text-slate-900 dark:text-white mb-2 flex items-center justify-between">
                  <span>সংযুক্ত ডিভাইস তালিকা ({selectedRoom.devices.length}টি)</span>
                  <span className="font-mono text-amber-600 dark:text-amber-400 font-bold">
                    মোট: {formatWatts(selectedRoom.totalWatts)}
                  </span>
                </h4>
                <div className="border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold">
                      <tr>
                        <th className="p-2.5">ডিভাইসের নাম</th>
                        <th className="p-2.5 text-center">পরিমাণ</th>
                        <th className="p-2.5 text-right">প্রতিটির ওয়াট</th>
                        <th className="p-2.5 text-right">মোট ওয়াট</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                      {selectedRoom.devices.map((d) => (
                        <tr key={d.id}>
                          <td className="p-2.5 font-medium">{d.name}</td>
                          <td className="p-2.5 text-center">{d.quantity} টি</td>
                          <td className="p-2.5 text-right font-mono">{d.wattsPerUnit} W</td>
                          <td className="p-2.5 text-right font-bold font-mono text-amber-600 dark:text-amber-400">
                            {d.totalWatts} W
                          </td>
                        </tr>
                      ))}
                      {selectedRoom.devices.length === 0 && (
                        <tr>
                          <td colSpan={4} className="p-4 text-center text-slate-400">
                            কোনো ডিভাইস নেই
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Materials Table */}
              <div>
                <h4 className="font-bold text-slate-900 dark:text-white mb-2 flex items-center justify-between">
                  <span>রুমের মালামাল তালিকা ({selectedRoom.materials.length}টি)</span>
                  <span className="font-mono text-emerald-600 dark:text-emerald-400 font-bold">
                    মোট মূল্য: {formatTaka(selectedRoom.estimatedMaterialCost)}
                  </span>
                </h4>
                <div className="border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold">
                      <tr>
                        <th className="p-2.5">মালামালের নাম</th>
                        <th className="p-2.5 text-center">পরিমাণ</th>
                        <th className="p-2.5 text-right">দর (৳)</th>
                        <th className="p-2.5 text-right">মোট টাকা</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                      {selectedRoom.materials.map((m) => (
                        <tr key={m.id}>
                          <td className="p-2.5 font-medium">
                            {m.name} {m.brand ? `(${m.brand})` : ''}
                          </td>
                          <td className="p-2.5 text-center">{m.quantity} {m.unit}</td>
                          <td className="p-2.5 text-right font-mono">{formatTaka(m.unitPrice)}</td>
                          <td className="p-2.5 text-right font-bold font-mono text-emerald-600 dark:text-emerald-400">
                            {formatTaka(m.totalPrice)}
                          </td>
                        </tr>
                      ))}
                      {selectedRoom.materials.length === 0 && (
                        <tr>
                          <td colSpan={4} className="p-4 text-center text-slate-400">
                            কোনো মালামাল নেই
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>

            {/* Footer */}
            <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 flex items-center justify-between">
              <span className="text-xs text-slate-500 font-medium">
                রাকিব ইলেকট্রিক্যাল ক্যালকুলেটর • অল রিপোর্ট
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
                  রুমের নির্দিষ্ট নাম
                </label>
                <input
                  type="text"
                  placeholder={`যেমন: মাস্টার ${roomType}`}
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
                  placeholder="যেমন: ফলস সিলিং ও ডাবল এসি রয়েছে"
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

            {/* Mode selection */}
            <div className="grid grid-cols-3 gap-1 p-2 bg-slate-100 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 text-xs font-bold">
              <button
                type="button"
                onClick={() => setDeviceMode('auto')}
                className={`py-2 rounded-xl transition-all ${
                  deviceMode === 'auto'
                    ? 'bg-amber-500 text-slate-950 shadow'
                    : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                অটো মোড
              </button>
              <button
                type="button"
                onClick={() => setDeviceMode('mixed')}
                className={`py-2 rounded-xl transition-all ${
                  deviceMode === 'mixed'
                    ? 'bg-amber-500 text-slate-950 shadow'
                    : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                মিশ্র মোড
              </button>
              <button
                type="button"
                onClick={() => setDeviceMode('manual')}
                className={`py-2 rounded-xl transition-all ${
                  deviceMode === 'manual'
                    ? 'bg-amber-500 text-slate-950 shadow'
                    : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                ম্যানুয়াল মোড
              </button>
            </div>

            <form onSubmit={handleSaveDevice} className="p-5 overflow-y-auto space-y-3.5 flex-1">
              {deviceMode !== 'manual' && (
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
              )}

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
                    প্রতিটির ওয়াট (Watts) <span className="text-red-500">*</span>
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

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    পাওয়ার ফ্যাক্টর (PF)
                  </label>
                  <input
                    type="number"
                    step="0.05"
                    min={0.6}
                    max={1.0}
                    value={devPF}
                    onChange={(e) => setDevPF(Number(e.target.value))}
                    className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                <div className="flex items-center pt-5">
                  <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-700 dark:text-slate-300">
                    <input
                      type="checkbox"
                      checked={devIsHeavy}
                      onChange={(e) => setDevIsHeavy(e.target.checked)}
                      className="w-4 h-4 rounded text-amber-500 focus:ring-amber-500"
                    />
                    <span>ভারী লোড (আলাদা সার্কিট)</span>
                  </label>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/50 flex items-center justify-between text-xs">
                <span className="font-bold text-amber-900 dark:text-amber-200">
                  মোট লোড হিসাব:
                </span>
                <span className="font-black text-amber-600 dark:text-amber-400 text-sm">
                  {devQty * devWatts} W
                </span>
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

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    ক্যাটাগরি
                  </label>
                  <select
                    value={matCategory}
                    onChange={(e) => setMatCategory(e.target.value)}
                    className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                  >
                    <option value="সুইচ ও সকেট">সুইচ ও সকেট</option>
                    <option value="বোর্ড ও বক্স">বোর্ড ও বক্স</option>
                    <option value="পাইপ ও ফিটিংস">পাইপ ও ফিটিংস</option>
                    <option value="তার ও কেবল">তার ও কেবল</option>
                    <option value="ব্রেকার ও সুরক্ষা">ব্রেকার ও সুরক্ষা</option>
                    <option value="আর্থিং সামগ্রী">আর্থিং সামগ্রী</option>
                    <option value="অন্যান্য">অন্যান্য</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    ব্র্যান্ড / মডেল
                  </label>
                  <input
                    type="text"
                    value={matBrand}
                    onChange={(e) => setMatBrand(e.target.value)}
                    className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
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

              <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/50 flex items-center justify-between text-xs">
                <span className="font-bold text-emerald-900 dark:text-emerald-200">
                  মোট দাম:
                </span>
                <span className="font-black text-emerald-600 dark:text-emerald-400 text-sm">
                  {formatTaka(matQty * matPrice)}
                </span>
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

      {/* FULL UNDO & REPEAT HISTORY MODAL */}
      {undoHistoryModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/75 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-md shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
            <div className="px-5 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-800/50">
              <div className="flex items-center gap-2">
                <RotateCcw className="w-4 h-4 text-teal-500" />
                <h3 className="text-base font-black text-slate-900 dark:text-white">
                  মুছে ফেলা আইটেমের ইতিহাস (Undo Stack)
                </h3>
              </div>
              <button
                onClick={() => setUndoHistoryModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="p-5 overflow-y-auto space-y-3 flex-1 text-xs">
              {undoStack.map((item) => (
                <div
                  key={item.id}
                  className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 flex items-center justify-between gap-3"
                >
                  <div>
                    <span className="font-bold text-slate-900 dark:text-white block">
                      {item.name}
                    </span>
                    <span className="text-[10px] text-slate-500">
                      ধরন: {item.type === 'room' ? 'রুম' : item.type === 'device' ? 'ডিভাইস' : 'মালামাল'}
                    </span>
                  </div>
                  <button
                    onClick={() => {
                      handleUndoAction(item);
                      if (undoStack.length <= 1) setUndoHistoryModalOpen(false);
                    }}
                    className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs transition-all active:scale-95"
                  >
                    ফিরিয়ে আনুন
                  </button>
                </div>
              ))}

              {undoStack.length === 0 && (
                <div className="text-center py-8 text-slate-400">
                  <p>মুছে ফেলা কোনো আইটেম নেই।</p>
                </div>
              )}
            </div>

            <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 flex justify-end">
              <button
                onClick={() => setUndoHistoryModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs"
              >
                বন্ধ করুন
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
