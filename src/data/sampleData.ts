import { Customer, Project, AppSettings } from '../types';

export const INITIAL_SETTINGS: AppSettings = {
  defaultVoltageSinglePhase: 220,
  defaultVoltageThreePhase: 400,
  defaultPowerFactor: 0.85,
  currencySymbol: '৳',
  theme: 'light',
  electricianName: 'রাকিব হাসান (ইলেকট্রিক্যাল ইঞ্জিনিয়ার ও টেকনিশিয়ান)',
  electricianPhone: '01700-123456',
  electricianAddress: 'ঢাকা, বাংলাদেশ',
  showBengaliNumbers: false
};

export const SAMPLE_CUSTOMERS: Customer[] = [
  {
    id: 'cust-1',
    name: 'জনাব রফিকুল ইসলাম',
    phone: '01711-234567',
    altPhone: '01911-234567',
    address: 'বাড়ি নং ১২, রোড ৮/এ, ধানমন্ডি, ঢাকা',
    organization: 'ইসলাম ট্রেডার্স',
    workDescription: '৩-তলা ডুপ্লেক্স বাড়ির সম্পূর্ণ কনসিলড ওয়্যারিং, ডিবি স্থাপন ও আর্থিং',
    notes: 'কাজের গুণগত মান নিশ্চিত করতে বিআরবি কেবল ও স্নাইডার ব্রেকার ব্যবহারের অনুরোধ করেছেন।',
    status: 'চলমান',
    createdAt: '2026-03-01T10:00:00.000Z',
    updatedAt: '2026-03-10T14:30:00.000Z'
  },
  {
    id: 'cust-2',
    name: 'আলহাজ্ব কবির হোসেন',
    phone: '01819-876543',
    altPhone: '',
    address: 'প্লট ৪২, রোড ৩, মিরপুর ডিওএইচএস, ঢাকা',
    organization: '',
    workDescription: '২য় তলার ফ্ল্যাট রেনোভেশন এবং নতুন এসি ও গিজার লাইন ওয়্যারিং',
    notes: 'বাথরুমের জন্য আরসিসিবি প্রটেকশন জরুরি।',
    status: 'পরিকল্পনাধীন',
    createdAt: '2026-03-05T11:15:00.000Z',
    updatedAt: '2026-03-08T09:00:00.000Z'
  }
];

export const SAMPLE_PROJECTS: Project[] = [
  {
    id: 'proj-1',
    customerId: 'cust-1',
    customerName: 'জনাব রফিকুল ইসলাম',
    name: 'রফিকুল সাহেবের ডুপ্লেক্স বাড়ি ওয়্যারিং',
    address: 'বাড়ি নং ১২, রোড ৮/এ, ধানমন্ডি, ঢাকা',
    buildingType: 'আবাসিক বাড়ি',
    floors: 3,
    description: 'সম্পূর্ণ নতুন ৩-তলা ডুপ্লেক্স ভবনের পূর্ণাঙ্গ ওয়্যারিং, লোড ব্যালেন্সিং ও সেফটি ডিবি সিস্টেম।',
    startDate: '2026-03-01',
    endDate: '2026-04-15',
    voltage: 400,
    phase: '3-Phase (থ্রি ফেজ)',
    powerFactor: 0.85,
    diversityFactor: 0.8,
    status: 'চলমান',
    rooms: [
      {
        id: 'room-1',
        projectId: 'proj-1',
        name: 'মাস্টার বেডরুম (২য় তলা)',
        type: 'বেডরুম',
        lengthFt: 16,
        widthFt: 14,
        heightFt: 10,
        areaSqFt: 224,
        status: 'চলমান',
        notes: '১.৫ টন ইনভার্টার এসি ও এলইডি ফলস সিলিং রয়েছে।',
        devices: [
          {
            id: 'dev-1-1',
            name: 'এয়ার কন্ডিশনার (১.৫ টন AC)',
            quantity: 1,
            wattsPerUnit: 1800,
            totalWatts: 1800,
            voltage: 220,
            powerFactor: 0.85,
            startingMultiplier: 3.0,
            isHeavyLoad: true,
            source: 'ডিফল্ট ক্যাটালগ',
            suggestedWire: '4.0 mm²',
            suggestedBreaker: '20A Type C'
          },
          {
            id: 'dev-1-2',
            name: 'সিলিং ফ্যান',
            quantity: 1,
            wattsPerUnit: 75,
            totalWatts: 75,
            voltage: 220,
            powerFactor: 0.85,
            startingMultiplier: 1.5,
            isHeavyLoad: false,
            source: 'ডিফল্ট ক্যাটালগ',
            suggestedWire: '1.5 mm²',
            suggestedBreaker: '6A Type C'
          },
          {
            id: 'dev-1-3',
            name: 'LED লাইট (সাধারণ)',
            quantity: 4,
            wattsPerUnit: 15,
            totalWatts: 60,
            voltage: 220,
            powerFactor: 0.9,
            startingMultiplier: 1.0,
            isHeavyLoad: false,
            source: 'ডিফল্ট ক্যাটালগ',
            suggestedWire: '1.0 mm² / 1.5 mm²',
            suggestedBreaker: '6A Type C'
          },
          {
            id: 'dev-1-4',
            name: 'টিভি (LED/Smart TV)',
            quantity: 1,
            wattsPerUnit: 85,
            totalWatts: 85,
            voltage: 220,
            powerFactor: 0.95,
            startingMultiplier: 1.0,
            isHeavyLoad: false,
            source: 'ডিফল্ট ক্যাটালগ',
            suggestedWire: '1.5 mm²',
            suggestedBreaker: '10A Type C'
          }
        ],
        materials: [
          {
            id: 'mat-r1-1',
            name: '৪-গ্যাং সুইচ (4 Gang Switch)',
            category: 'সুইচ ও সকেট',
            brand: 'Super Star',
            quantity: 1,
            unit: 'পিস',
            unitPrice: 340,
            totalPrice: 340,
            roomId: 'room-1',
            roomName: 'মাস্টার বেডরুম'
          },
          {
            id: 'mat-r1-2',
            name: '৩-পিন মাল্টি সকেট ১৩ অ্যাম্পিয়ার',
            category: 'সুইচ ও সকেট',
            brand: 'Super Star',
            quantity: 2,
            unit: 'পিস',
            unitPrice: 280,
            totalPrice: 560,
            roomId: 'room-1',
            roomName: 'মাস্টার বেডরুম'
          },
          {
            id: 'mat-r1-3',
            name: 'এসি ডাবল পোল সুইচ বা ডিপি বক্স',
            category: 'সুইচ ও সকেট',
            brand: 'Legrand',
            quantity: 1,
            unit: 'সেট',
            unitPrice: 650,
            totalPrice: 650,
            roomId: 'room-1',
            roomName: 'মাস্টার বেডরুম'
          },
          {
            id: 'mat-r1-4',
            name: 'ফ্যান রেগুলেটর (Electronic Dimmer)',
            category: 'সুইচ ও সকেট',
            brand: 'Super Star',
            quantity: 1,
            unit: 'পিস',
            unitPrice: 220,
            totalPrice: 220,
            roomId: 'room-1',
            roomName: 'মাস্টার বেডরুম'
          }
        ],
        totalWatts: 2020,
        totalAmps: 10.7,
        estimatedMaterialCost: 1770,
        createdAt: '2026-03-01T11:00:00.000Z',
        updatedAt: '2026-03-01T11:00:00.000Z'
      },
      {
        id: 'room-2',
        projectId: 'proj-1',
        name: 'ড্রয়িং ও ডাইনিং হল',
        type: 'ড্রয়িং রুম',
        lengthFt: 22,
        widthFt: 16,
        heightFt: 10,
        areaSqFt: 352,
        status: 'চলমান',
        notes: '২ টন এসি ও বড় ঝাড়বাতি পয়েন্ট।',
        devices: [
          {
            id: 'dev-2-1',
            name: 'এয়ার কন্ডিশনার (২ টন AC)',
            quantity: 1,
            wattsPerUnit: 2400,
            totalWatts: 2400,
            voltage: 220,
            powerFactor: 0.85,
            startingMultiplier: 3.2,
            isHeavyLoad: true,
            source: 'ডিফল্ট ক্যাটালগ',
            suggestedWire: '4.0 mm² / 6.0 mm²',
            suggestedBreaker: '25A / 32A Type C'
          },
          {
            id: 'dev-2-2',
            name: 'সিলিং ফ্যান',
            quantity: 2,
            wattsPerUnit: 75,
            totalWatts: 150,
            voltage: 220,
            powerFactor: 0.85,
            startingMultiplier: 1.5,
            isHeavyLoad: false,
            source: 'ডিফল্ট ক্যাটালগ',
            suggestedWire: '1.5 mm²',
            suggestedBreaker: '6A Type C'
          },
          {
            id: 'dev-2-3',
            name: 'রেফ্রিজারেটর / ফ্রিজ',
            quantity: 1,
            wattsPerUnit: 200,
            totalWatts: 200,
            voltage: 220,
            powerFactor: 0.8,
            startingMultiplier: 2.5,
            isHeavyLoad: false,
            source: 'ডিফল্ট ক্যাটালগ',
            suggestedWire: '2.5 mm²',
            suggestedBreaker: '10A Type C'
          },
          {
            id: 'dev-2-4',
            name: 'LED লাইট (সাধারণ)',
            quantity: 8,
            wattsPerUnit: 15,
            totalWatts: 120,
            voltage: 220,
            powerFactor: 0.9,
            startingMultiplier: 1.0,
            isHeavyLoad: false,
            source: 'ডিফল্ট ক্যাটালগ',
            suggestedWire: '1.5 mm²',
            suggestedBreaker: '10A Type C'
          }
        ],
        materials: [
          {
            id: 'mat-r2-1',
            name: '৪-গ্যাং সুইচ (4 Gang Switch)',
            category: 'সুইচ ও সকেট',
            brand: 'Super Star',
            quantity: 2,
            unit: 'পিস',
            unitPrice: 340,
            totalPrice: 680,
            roomId: 'room-2',
            roomName: 'ড্রয়িং ও ডাইনিং হল'
          },
          {
            id: 'mat-r2-2',
            name: '৩-পিন মাল্টি সকেট ১৩ অ্যাম্পিয়ার',
            category: 'সুইচ ও সকেট',
            brand: 'Super Star',
            quantity: 3,
            unit: 'পিস',
            unitPrice: 280,
            totalPrice: 840,
            roomId: 'room-2',
            roomName: 'ড্রয়িং ও ডাইনিং হল'
          },
          {
            id: 'mat-r2-3',
            name: 'ফ্যান রেগুলেটর (Electronic Dimmer)',
            category: 'সুইচ ও সকেট',
            brand: 'Super Star',
            quantity: 2,
            unit: 'পিস',
            unitPrice: 220,
            totalPrice: 440,
            roomId: 'room-2',
            roomName: 'ড্রয়িং ও ডাইনিং হল'
          }
        ],
        totalWatts: 2870,
        totalAmps: 15.3,
        estimatedMaterialCost: 1960,
        createdAt: '2026-03-01T11:30:00.000Z',
        updatedAt: '2026-03-01T11:30:00.000Z'
      },
      {
        id: 'room-3',
        projectId: 'proj-1',
        name: 'মডার্ন কিচেন (রান্নাঘর)',
        type: 'রান্নাঘর',
        lengthFt: 12,
        widthFt: 10,
        heightFt: 10,
        areaSqFt: 120,
        status: 'চলমান',
        notes: 'ভারী রান্নাঘর অ্যাপ্লায়েন্সের জন্য ১৬A পাওয়ার পয়েন্ট।',
        devices: [
          {
            id: 'dev-3-1',
            name: 'মাইক্রোওয়েভ ওভেন',
            quantity: 1,
            wattsPerUnit: 1200,
            totalWatts: 1200,
            voltage: 220,
            powerFactor: 0.9,
            startingMultiplier: 1.5,
            isHeavyLoad: true,
            source: 'ডিফল্ট ক্যাটালগ',
            suggestedWire: '2.5 mm²',
            suggestedBreaker: '16A Type C'
          },
          {
            id: 'dev-3-2',
            name: 'ইন্ডাকশন / ইনফ্রারেড কুকার',
            quantity: 1,
            wattsPerUnit: 2000,
            totalWatts: 2000,
            voltage: 220,
            powerFactor: 0.95,
            startingMultiplier: 1.0,
            isHeavyLoad: true,
            source: 'ডিফল্ট ক্যাটালগ',
            suggestedWire: '4.0 mm²',
            suggestedBreaker: '20A Type C'
          },
          {
            id: 'dev-3-3',
            name: 'রাইস কুকার',
            quantity: 1,
            wattsPerUnit: 700,
            totalWatts: 700,
            voltage: 220,
            powerFactor: 1.0,
            startingMultiplier: 1.0,
            isHeavyLoad: false,
            source: 'ডিফল্ট ক্যাটালগ',
            suggestedWire: '2.5 mm²',
            suggestedBreaker: '16A Type C'
          },
          {
            id: 'dev-3-4',
            name: 'এক্সহস্ট ফ্যান',
            quantity: 1,
            wattsPerUnit: 40,
            totalWatts: 40,
            voltage: 220,
            powerFactor: 0.85,
            startingMultiplier: 1.3,
            isHeavyLoad: false,
            source: 'ডিফল্ট ক্যাটালগ',
            suggestedWire: '1.5 mm²',
            suggestedBreaker: '6A Type C'
          }
        ],
        materials: [
          {
            id: 'mat-r3-1',
            name: '১৬ অ্যাম্পিয়ার পাওয়ার সকেট (16A Heavy)',
            category: 'সুইচ ও সকেট',
            brand: 'BBS / Click',
            quantity: 2,
            unit: 'পিস',
            unitPrice: 380,
            totalPrice: 760,
            roomId: 'room-3',
            roomName: 'মডার্ন কিচেন'
          },
          {
            id: 'mat-r3-2',
            name: '২-গ্যাং সুইচ (2 Gang Switch)',
            category: 'সুইচ ও সকেট',
            brand: 'Super Star',
            quantity: 1,
            unit: 'পিস',
            unitPrice: 190,
            totalPrice: 190,
            roomId: 'room-3',
            roomName: 'মডার্ন কিচেন'
          }
        ],
        totalWatts: 3940,
        totalAmps: 18.8,
        estimatedMaterialCost: 950,
        createdAt: '2026-03-01T12:00:00.000Z',
        updatedAt: '2026-03-01T12:00:00.000Z'
      },
      {
        id: 'room-4',
        projectId: 'proj-1',
        name: 'মাস্টার বাথরুম (গিজারযুক্ত)',
        type: 'বাথরুম',
        lengthFt: 8,
        widthFt: 6,
        heightFt: 10,
        areaSqFt: 48,
        status: 'চলমান',
        notes: '১৫০০ ওয়াট গিজার। ৩০mA RCCB শক প্রোটেকশন বাধ্যতামূলক।',
        devices: [
          {
            id: 'dev-4-1',
            name: 'ওয়াটার হিটার / গিজার (বাথরুম)',
            quantity: 1,
            wattsPerUnit: 1500,
            totalWatts: 1500,
            voltage: 220,
            powerFactor: 1.0,
            startingMultiplier: 1.0,
            isHeavyLoad: true,
            source: 'ডিফল্ট ক্যাটালগ',
            suggestedWire: '4.0 mm²',
            suggestedBreaker: '16A Type C + 30mA RCCB'
          },
          {
            id: 'dev-4-2',
            name: 'এক্সহস্ট ফ্যান',
            quantity: 1,
            wattsPerUnit: 40,
            totalWatts: 40,
            voltage: 220,
            powerFactor: 0.85,
            startingMultiplier: 1.3,
            isHeavyLoad: false,
            source: 'ডিফল্ট ক্যাটালগ',
            suggestedWire: '1.5 mm²',
            suggestedBreaker: '6A Type C'
          },
          {
            id: 'dev-4-3',
            name: 'LED লাইট (সাধারণ)',
            quantity: 1,
            wattsPerUnit: 15,
            totalWatts: 15,
            voltage: 220,
            powerFactor: 0.9,
            startingMultiplier: 1.0,
            isHeavyLoad: false,
            source: 'ডিফল্ট ক্যাটালগ',
            suggestedWire: '1.5 mm²',
            suggestedBreaker: '6A Type C'
          }
        ],
        materials: [
          {
            id: 'mat-r4-1',
            name: '১৬ অ্যাম্পিয়ার পাওয়ার সকেট (16A Heavy)',
            category: 'সুইচ ও সকেট',
            brand: 'BBS / Click',
            quantity: 1,
            unit: 'পিস',
            unitPrice: 380,
            totalPrice: 380,
            roomId: 'room-4',
            roomName: 'মাস্টার বাথরুম'
          },
          {
            id: 'mat-r4-2',
            name: '২-গ্যাং সুইচ (2 Gang Switch)',
            category: 'সুইচ ও সকেট',
            brand: 'Super Star',
            quantity: 1,
            unit: 'পিস',
            unitPrice: 190,
            totalPrice: 190,
            roomId: 'room-4',
            roomName: 'মাস্টার বাথরুম'
          }
        ],
        totalWatts: 1555,
        totalAmps: 7.1,
        estimatedMaterialCost: 570,
        createdAt: '2026-03-01T12:30:00.000Z',
        updatedAt: '2026-03-01T12:30:00.000Z'
      }
    ],
    commonMaterials: [
      {
        id: 'mat-c-1',
        name: 'কপার কেবল 1.5 mm² (BYA 1.3 RM / 3/0.029)',
        category: 'তার ও কেবল',
        brand: 'BRB Cable',
        quantity: 3,
        unit: 'কয়েল (৯০ মি.)',
        unitPrice: 3100,
        totalPrice: 9300
      },
      {
        id: 'mat-c-2',
        name: 'কপার কেবল 2.5 mm² (BYA 2.0 RM / 7/0.029)',
        category: 'তার ও কেবল',
        brand: 'BRB Cable',
        quantity: 2,
        unit: 'কয়েল (৯০ মি.)',
        unitPrice: 4800,
        totalPrice: 9600
      },
      {
        id: 'mat-c-3',
        name: 'কপার কেবল 4.0 mm² (BYA 7/0.036)',
        category: 'তার ও কেবল',
        brand: 'BRB Cable',
        quantity: 1,
        unit: 'কয়েল (৯০ মি.)',
        unitPrice: 7500,
        totalPrice: 7500
      },
      {
        id: 'mat-c-4',
        name: 'PVC কন্ডুইট পাইপ ৩/৪ ইঞ্চি (10 ft / পাইপ)',
        category: 'পাইপ ও ফিটিংস',
        brand: 'National',
        quantity: 40,
        unit: 'পিস',
        unitPrice: 120,
        totalPrice: 4800
      },
      {
        id: 'mat-c-5',
        name: 'ডিস্ট্রিবিউশন বোর্ড ১২-ওয়ে (12 Way DB Box)',
        category: 'ব্রেকার ও সুরক্ষা',
        brand: 'Havells',
        quantity: 1,
        unit: 'পিস',
        unitPrice: 2200,
        totalPrice: 2200
      },
      {
        id: 'mat-c-6',
        name: 'RCCB / ELCB ডাবল পোল (40A, 30mA ট্রিপ)',
        category: 'ব্রেকার ও সুরক্ষা',
        brand: 'Schneider',
        quantity: 1,
        unit: 'পিস',
        unitPrice: 2800,
        totalPrice: 2800
      },
      {
        id: 'mat-c-7',
        name: 'SP MCB (সিঙ্গেল পোল ব্রেকার 10A / 16A)',
        category: 'ব্রেকার ও সুরক্ষা',
        brand: 'Schneider',
        quantity: 6,
        unit: 'পিস',
        unitPrice: 380,
        totalPrice: 2280
      },
      {
        id: 'mat-c-8',
        name: 'আর্থিং কপার রড ৮ ফুট (Copper Bonded Rod 5/8")',
        category: 'আর্থিং সামগ্রী',
        brand: 'Standard',
        quantity: 1,
        unit: 'পিস',
        unitPrice: 1800,
        totalPrice: 1800
      }
    ],
    costing: {
      materialsCost: 45530, // Sum of room materials + common materials
      laborCostType: 'পয়েন্ট হিসাব',
      laborRate: 250, // 250 taka per point
      pointsCount: 48,
      laborTotal: 12000,
      additionalCost: 1500,
      transportCost: 800,
      discount: 1000,
      totalBill: 58830, // 45530 + 12000 + 1500 + 800 - 1000
      paidAmount: 35000,
      dueAmount: 23830
    },
    payments: [
      {
        id: 'pay-1',
        projectId: 'proj-1',
        customerId: 'cust-1',
        amount: 20000,
        date: '2026-03-02',
        method: 'বিকাশ (bKash)',
        referenceNo: 'BK-9982421A',
        note: 'কাজের প্রাথমিক অগ্রিম হিসেবে প্রাপ্ত',
        createdAt: '2026-03-02T10:00:00.000Z'
      },
      {
        id: 'pay-2',
        projectId: 'proj-1',
        customerId: 'cust-1',
        amount: 15000,
        date: '2026-03-10',
        method: 'নগদ (Cash)',
        referenceNo: '',
        note: 'পাইপ ও তার কেনার কিস্তি',
        createdAt: '2026-03-10T16:00:00.000Z'
      }
    ],
    createdAt: '2026-03-01T10:30:00.000Z',
    updatedAt: '2026-03-10T16:00:00.000Z'
  }
];
