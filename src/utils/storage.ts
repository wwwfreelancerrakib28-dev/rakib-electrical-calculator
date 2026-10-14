import { AppState, Customer, Project, Room, DeviceItem, MaterialItem } from '../types';
import { SAMPLE_CUSTOMERS, SAMPLE_PROJECTS, INITIAL_SETTINGS } from '../data/sampleData';
import { DEFAULT_DEVICES } from '../data/initialData';
import { DEFAULT_MATERIALS } from '../data/materialsCatalog';
import { db } from '../firebase';
import { doc, setDoc, getDoc } from 'firebase/firestore';

const STORAGE_KEY = 'rakib_electrical_calc_v1';

export function getInitialState(): AppState {
  if (typeof window === 'undefined') {
    return {
      customers: SAMPLE_CUSTOMERS,
      projects: SAMPLE_PROJECTS,
      activeProjectId: SAMPLE_PROJECTS[0].id,
      activeCustomerId: SAMPLE_CUSTOMERS[0].id,
      settings: INITIAL_SETTINGS,
      customDevices: DEFAULT_DEVICES,
      customMaterials: DEFAULT_MATERIALS
    };
  }

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && Array.isArray(parsed.customers) && Array.isArray(parsed.projects)) {
        return {
          customers: parsed.customers,
          projects: parsed.projects,
          activeProjectId: parsed.activeProjectId || (parsed.projects[0] ? parsed.projects[0].id : null),
          activeCustomerId: parsed.activeCustomerId || (parsed.customers[0] ? parsed.customers[0].id : null),
          settings: { ...INITIAL_SETTINGS, ...(parsed.settings || {}) },
          customDevices: parsed.customDevices || DEFAULT_DEVICES,
          customMaterials: parsed.customMaterials || DEFAULT_MATERIALS
        };
      }
    }
  } catch (err) {
    console.error('Failed to load state from localStorage:', err);
  }

  // First time initialization: populate with sample data
  const defaultState: AppState = {
    customers: SAMPLE_CUSTOMERS,
    projects: SAMPLE_PROJECTS,
    activeProjectId: SAMPLE_PROJECTS[0].id,
    activeCustomerId: SAMPLE_CUSTOMERS[0].id,
    settings: INITIAL_SETTINGS,
    customDevices: DEFAULT_DEVICES,
    customMaterials: DEFAULT_MATERIALS
  };
  saveStateToStorage(defaultState);
  return defaultState;
}

export function saveStateToStorage(state: AppState): boolean {
  if (typeof window === 'undefined') return false;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    
    // Cloud Sync to Firebase Firestore (Background save)
    if (db) {
      setDoc(doc(db, "appData", "user_main_state"), {
        ...state,
        lastUpdated: new Date().toISOString()
      }).catch((err) => {
        console.error("Firebase sync error:", err);
      });
    }

    return true;
  } catch (err) {
    console.error('Failed to save state to localStorage:', err);
    return false;
  }
}

/**
 * Recompute totals for a room (watts, amps, materials cost)
 */
export function recalculateRoom(room: Room, voltage = 220, powerFactor = 0.85): Room {
  const totalWatts = room.devices.reduce((sum, d) => sum + (d.totalWatts || d.wattsPerUnit * d.quantity), 0);
  const estimatedMaterialCost = room.materials.reduce((sum, m) => sum + (m.totalPrice || m.unitPrice * m.quantity), 0);
  const totalAmps = totalWatts > 0 ? totalWatts / (voltage * powerFactor) : 0;

  return {
    ...room,
    totalWatts,
    totalAmps,
    estimatedMaterialCost,
    updatedAt: new Date().toISOString()
  };
}

/**
 * Recompute totals for a project (costing, paid, due, room totals)
 */
export function recalculateProject(project: Project): Project {
  // Update each room
  const updatedRooms = project.rooms.map((r) =>
    recalculateRoom(r, project.voltage || 220, project.powerFactor || 0.85)
  );

  const roomMaterialsSum = updatedRooms.reduce((sum, r) => sum + r.estimatedMaterialCost, 0);
  const commonMaterialsSum = project.commonMaterials.reduce(
    (sum, m) => sum + (m.totalPrice || m.unitPrice * m.quantity),
    0
  );
  const materialsCost = roomMaterialsSum + commonMaterialsSum;

  // Labor calculation
  let laborTotal = project.costing.laborTotal || 0;
  if (project.costing.laborCostType === 'পয়েন্ট হিসাব') {
    const points = project.costing.pointsCount || 0;
    const rate = project.costing.laborRate || 0;
    laborTotal = points * rate;
  }

  const additionalCost = Number(project.costing.additionalCost || 0);
  const transportCost = Number(project.costing.transportCost || 0);
  const discount = Number(project.costing.discount || 0);

  const totalBill = materialsCost + laborTotal + additionalCost + transportCost - discount;

  const paidAmount = project.payments.reduce((sum, p) => sum + Number(p.amount || 0), 0);
  const dueAmount = Math.max(0, totalBill - paidAmount);

  return {
    ...project,
    rooms: updatedRooms,
    costing: {
      ...project.costing,
      materialsCost,
      laborTotal,
      totalBill,
      paidAmount,
      dueAmount
    },
    updatedAt: new Date().toISOString()
  };
}

/**
 * Export data as downloadable JSON backup
 */
export function exportDataAsJSON(state: AppState): void {
  const exportPayload = {
    appName: 'Rakib Electrical Calculator',
    version: '1.0.0',
    exportDate: new Date().toISOString(),
    data: {
      customers: state.customers,
      projects: state.projects,
      settings: state.settings,
      customDevices: state.customDevices,
      customMaterials: state.customMaterials
    }
  };

  const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(exportPayload, null, 2));
  const downloadAnchor = document.createElement('a');
  const dateStr = new Date().toISOString().split('T')[0];
  downloadAnchor.setAttribute('href', dataStr);
  downloadAnchor.setAttribute('download', `rakib_electrical_backup_${dateStr}.json`);
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();
}

/**
 * Import JSON backup
 */
export function importDataFromJSON(
  jsonString: string,
  currentState: AppState
): { success: boolean; newState?: AppState; message: string } {
  try {
    const parsed = JSON.parse(jsonString);
    const incomingData = parsed.data || parsed;

    if (!Array.isArray(incomingData.customers) || !Array.isArray(incomingData.projects)) {
      return {
        success: false,
        message: 'ফাইলটিতে সঠিক ফরম্যাটের কাস্টমার বা প্রজেক্টের তথ্য পাওয়া যায়নি।'
      };
    }

    // Merge or replace without duplicates
    const customerMap = new Map<string, Customer>();
    // Existing
    currentState.customers.forEach((c) => customerMap.set(c.id, c));
    // Incoming
    incomingData.customers.forEach((c: Customer) => customerMap.set(c.id, c));

    const projectMap = new Map<string, Project>();
    currentState.projects.forEach((p) => projectMap.set(p.id, p));
    incomingData.projects.forEach((p: Project) => projectMap.set(p.id, recalculateProject(p)));

    const mergedCustomers = Array.from(customerMap.values());
    const mergedProjects = Array.from(projectMap.values());

    const newState: AppState = {
      customers: mergedCustomers,
      projects: mergedProjects,
      activeCustomerId: mergedCustomers[0]?.id || null,
      activeProjectId: mergedProjects[0]?.id || null,
      settings: {
        ...currentState.settings,
        ...(incomingData.settings || {})
      },
      customDevices: incomingData.customDevices || currentState.customDevices,
      customMaterials: incomingData.customMaterials || currentState.customMaterials
    };

    saveStateToStorage(newState);

    return {
      success: true,
      newState,
      message: `সফলভাবে ${incomingData.customers.length}টি কাস্টমার ও ${incomingData.projects.length}টি প্রজেক্ট ইমপোর্ট ও পুনরুদ্ধার হয়েছে!`
    };
  } catch (err: any) {
    return {
      success: false,
      message: `ফাইল রিড করতে ব্যর্থ হয়েছে: ${err?.message || 'অপ্রত্যাশিত ত্রুটি'}`
    };
  }
}
