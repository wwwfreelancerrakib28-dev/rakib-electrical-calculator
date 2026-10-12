/**
 * Rakib Electrical Calculator - Data Types
 */

export type RoomType =
  | 'বেডরুম'
  | 'ড্রয়িং রুম'
  | 'ডাইনিং রুম'
  | 'রান্নাঘর'
  | 'বাথরুম'
  | 'বারান্দা'
  | 'সিঁড়িঘর'
  | 'গ্যারেজ'
  | 'দোকান'
  | 'অফিস'
  | 'ছাদ'
  | 'অন্যান্য';

export type PhaseType = '1-Phase (সিঙ্গেল ফেজ)' | '3-Phase (থ্রি ফেজ)';

export type WorkStatus = 'পরিকল্পনাধীন' | 'চলমান' | 'টেস্টিং' | 'সম্পন্ন' | 'স্থগিত';

export type DeviceSource = 'ডিফল্ট ক্যাটালগ' | 'ব্যবহারকারী ইনপুট' | 'নেমপ্লেট রিডিং';

export interface DeviceItem {
  id: string;
  name: string;
  quantity: number;
  wattsPerUnit: number; // Watt
  totalWatts: number;
  voltage: number; // 220V or 230V or 400V
  powerFactor: number; // 0.8 to 1.0
  startingMultiplier?: number; // Inrush current multiplier (e.g. 2x - 3x for motors/AC)
  isHeavyLoad?: boolean; // Geyser, AC, Motor - needs dedicated circuit
  source: DeviceSource;
  notes?: string;
  suggestedBreaker?: string;
  suggestedWire?: string;
}

export interface MaterialItem {
  id: string;
  name: string;
  category: string; // সুইচ ও সকেট, পাইপ ও ফিটিংস, কেবল, ব্রেকার, আর্থিং, অন্যান্য
  brand?: string;
  model?: string;
  size?: string;
  quantity: number;
  unit: string; // পিস, কয়েল, মিটার, ফুট, সেট, প্যাকেট
  unitPrice: number; // ৳
  totalPrice: number;
  roomId?: string; // If tied to a specific room, or 'common'
  roomName?: string;
  notes?: string;
}

export interface Room {
  id: string;
  projectId: string;
  name: string;
  type: RoomType | string;
  lengthFt?: number;
  widthFt?: number;
  heightFt?: number;
  areaSqFt?: number;
  status: WorkStatus;
  notes?: string;
  devices: DeviceItem[];
  materials: MaterialItem[];
  totalWatts: number;
  totalAmps: number;
  estimatedMaterialCost: number;
  createdAt: string;
  updatedAt: string;
}

export interface PaymentRecord {
  id: string;
  projectId: string;
  customerId: string;
  amount: number;
  date: string;
  method: 'নগদ (Cash)' | 'বিকাশ (bKash)' | 'নগদ (Nagad)' | 'রকেট (Rocket)' | 'ব্যাংক ট্রান্সফার' | 'চেক' | 'অন্যান্য';
  referenceNo?: string;
  note?: string;
  createdAt: string;
}

export interface ProjectCosting {
  materialsCost: number;
  laborCostType: 'চুক্তিভিত্তিক' | 'পয়েন্ট হিসাব' | 'দৈনিক হাজিরা' | 'স্কয়ার ফুট রেট';
  laborRate: number; // e.g. per point or contract amount
  pointsCount?: number;
  laborTotal: number;
  additionalCost: number;
  transportCost: number;
  discount: number;
  totalBill: number;
  paidAmount: number;
  dueAmount: number;
}

export interface Project {
  id: string;
  customerId: string;
  customerName: string;
  name: string;
  address: string;
  buildingType: 'আবাসিক বাড়ি' | 'বাণিজ্যিক ভবন' | 'ফ্ল্যাট / অ্যাপার্টমেন্ট' | 'দোকান / শোরুম' | 'ফ্যাক্টরি / ওয়ার্কশপ' | 'অন্যান্য';
  floors: number;
  description?: string;
  startDate?: string;
  endDate?: string;
  voltage: number; // 220, 230, 400, 415
  phase: PhaseType;
  powerFactor: number;
  diversityFactor: number; // Diversity factor (e.g., 0.7 - 0.9)
  status: WorkStatus;
  rooms: Room[];
  commonMaterials: MaterialItem[];
  costing: ProjectCosting;
  payments: PaymentRecord[];
  createdAt: string;
  updatedAt: string;
}

export interface Customer {
  id: string;
  name: string;
  phone: string;
  altPhone?: string;
  address: string;
  organization?: string;
  workDescription?: string;
  notes?: string;
  status: WorkStatus;
  createdAt: string;
  updatedAt: string;
}

export interface CatalogDevice {
  name: string;
  category: string;
  defaultWatts: number;
  defaultPowerFactor: number;
  voltage: number;
  isHeavyLoad: boolean;
  startingMultiplier: number;
  recommendedWire: string;
  recommendedBreaker: string;
  notes: string;
}

export interface CatalogMaterial {
  id: string;
  name: string;
  category: string;
  unit: string;
  defaultPrice: number;
  defaultBrand: string;
  description?: string;
}

export interface CableSpecification {
  sizeMm2: string; // e.g. "1.5 mm²"
  rmEquivalent?: string; // e.g. "1.3 RM (3/0.029)"
  coreType: 'Single Core (BYA)' | 'Multi Core (BYFY / NYY)';
  conductor: 'Copper (তামা)' | 'Aluminium (অ্যালুমিনিয়াম)';
  conduitCurrentCapacityA: number; // In conduit in wall (Amps)
  openAirCurrentCapacityA: number; // In open air/clipped (Amps)
  resistancePerKm: number; // Ohm/km at 20°C
  reactancePerKm: number; // Ohm/km
  voltageDropMvPerAmpMeter: number; // mV / (A * m)
  maxWattsSinglePhase220V: number;
  maxWattsThreePhase400V: number;
  recommendedEarthWire: string;
  recommendedUse: string;
}

export interface BreakerSpecification {
  id: string;
  type: 'SP MCB' | 'DP MCB' | 'TP MCB' | 'TPN MCB' | '4P MCCB' | 'RCCB' | 'RCBO' | 'Main Switch' | 'Isolator' | 'SPD';
  poles: 1 | 2 | 3 | 4;
  ratedCurrentA: number; // e.g. 6, 10, 16, 20, 25, 32, 40, 50, 63, 100, 125, 200
  voltage: number;
  breakingCapacityKA: number; // 6kA, 10kA, 15kA, 25kA
  curve?: 'B' | 'C' | 'D';
  leakageTripMa?: number; // 30mA, 100mA, 300mA
  brand?: string;
  approxPrice?: number;
  application: string;
  safetyNotes: string;
}

export interface AppSettings {
  defaultVoltageSinglePhase: number; // 220 or 230
  defaultVoltageThreePhase: number; // 400 or 415
  defaultPowerFactor: number; // 0.85
  currencySymbol: string; // "৳"
  theme: 'light' | 'dark' | 'system';
  electricianName: string; // e.g. "রাকিব হাসান"
  electricianPhone: string;
  electricianAddress: string;
  showBengaliNumbers: boolean;
}

export interface AppState {
  customers: Customer[];
  projects: Project[];
  activeProjectId: string | null;
  activeCustomerId: string | null;
  settings: AppSettings;
  customDevices: CatalogDevice[];
  customMaterials: CatalogMaterial[];
}
