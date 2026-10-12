import { CatalogMaterial } from '../types';

export const DEFAULT_MATERIALS: CatalogMaterial[] = [
  // সুইচ ও সকেট
  {
    id: 'mat-sw-1g',
    name: '১-গ্যাং সুইচ (1 Gang Switch)',
    category: 'সুইচ ও সকেট',
    unit: 'পিস',
    defaultPrice: 120,
    defaultBrand: 'Super Star / click',
    description: 'মডুলার পিয়ানো বা পুশ সুইচ'
  },
  {
    id: 'mat-sw-2g',
    name: '২-গ্যাং সুইচ (2 Gang Switch)',
    category: 'সুইচ ও সকেট',
    unit: 'পিস',
    defaultPrice: 190,
    defaultBrand: 'Super Star / click',
    description: 'এক বোর্ডে দুটি সুইচ'
  },
  {
    id: 'mat-sw-3g',
    name: '৩-গ্যাং সুইচ (3 Gang Switch)',
    category: 'সুইচ ও সকেট',
    unit: 'পিস',
    defaultPrice: 260,
    defaultBrand: 'Super Star / click',
    description: 'এক বোর্ডে তিনটি সুইচ'
  },
  {
    id: 'mat-sw-4g',
    name: '৪-গ্যাং সুইচ (4 Gang Switch)',
    category: 'সুইচ ও সকেট',
    unit: 'পিস',
    defaultPrice: 340,
    defaultBrand: 'Super Star / click',
    description: 'এক বোর্ডে চারটি সুইচ'
  },
  {
    id: 'mat-sock-2pin',
    name: '২-পিন সকেট (2 Pin Socket)',
    category: 'সুইচ ও সকেট',
    unit: 'পিস',
    defaultPrice: 110,
    defaultBrand: 'Super Star / Havells',
    description: 'সাধারণ মোবাইল চার্জার বা ছোট লোড'
  },
  {
    id: 'mat-sock-3pin-13a',
    name: '৩-পিন মাল্টি সকেট ১৩ অ্যাম্পিয়ার (13A Universal Socket)',
    category: 'সুইচ ও সকেট',
    unit: 'পিস',
    defaultPrice: 280,
    defaultBrand: 'Super Star / Legrand',
    description: 'সুইচসহ ১৩A সার্বজনীন পাওয়ার সকেট'
  },
  {
    id: 'mat-sock-16a-power',
    name: '১৬ অ্যাম্পিয়ার পাওয়ার সকেট (16A Heavy Socket)',
    category: 'সুইচ ও সকেট',
    unit: 'পিস',
    defaultPrice: 380,
    defaultBrand: 'click / BBS',
    description: 'এসি, গিজার বা মাইক্রোওয়েভের জন্য ভারী সকেট'
  },
  {
    id: 'mat-reg-fan',
    name: 'ফ্যান রেগুলেটর (Electronic Dimmer)',
    category: 'সুইচ ও সকেট',
    unit: 'পিস',
    defaultPrice: 220,
    defaultBrand: 'Super Star / ক্লিক',
    description: 'ইলেকট্রনিক স্টেপলেস রেগুলেটর'
  },
  {
    id: 'mat-holder-batten',
    name: 'ব্যাটেন লাইট হোল্ডার (Batten Holder)',
    category: 'সুইচ ও সকেট',
    unit: 'পিস',
    defaultPrice: 65,
    defaultBrand: 'National / Click',
    description: 'দেয়ালে লাইট লাগানোর হোল্ডার'
  },
  {
    id: 'mat-holder-pendant',
    name: 'পেনডেন্ট হোল্ডার (ঝুলন্ত)',
    category: 'সুইচ ও সকেট',
    unit: 'পিস',
    defaultPrice: 50,
    defaultBrand: 'National',
    description: 'ঝুলন্ত বাল্বের হোল্ডার'
  },
  {
    id: 'mat-ac-switch-box',
    name: 'এসি ডাবল পোল সুইচ বা ডিপি বক্স (20A DP Switch with Box)',
    category: 'সুইচ ও সকেট',
    unit: 'সেট',
    defaultPrice: 650,
    defaultBrand: 'Legrand / Click',
    description: 'এসির জন্য ইন্ডিকেটরসহ ২০A ডাবল পোল সুইচ'
  },

  // বোর্ড ও বক্স
  {
    id: 'mat-board-box-12',
    name: '১-২ গ্যাং মেটাল / পিভিসি বোর্ড বক্স (Gang Box)',
    category: 'বোর্ড ও বক্স',
    unit: 'পিস',
    defaultPrice: 45,
    defaultBrand: 'Gazi / RFL',
    description: 'কনসিলড ওয়্যারিংয়ের দেয়ালের ভেতরের বক্স'
  },
  {
    id: 'mat-board-box-34',
    name: '৩-৪ গ্যাং বোর্ড বক্স (Concealed Box)',
    category: 'বোর্ড ও বক্স',
    unit: 'পিস',
    defaultPrice: 65,
    defaultBrand: 'Gazi / RFL',
    description: 'মাঝারি সুইচ বোর্ডের মেটাল/পিভিসি বক্স'
  },
  {
    id: 'mat-board-box-68',
    name: '৬-৮ গ্যাং বড় বোর্ড বক্স',
    category: 'বোর্ড ও বক্স',
    unit: 'পিস',
    defaultPrice: 110,
    defaultBrand: 'Gazi / RFL',
    description: 'বড় সুইচ বোর্ডের জন্য'
  },
  {
    id: 'mat-circular-box',
    name: 'সার্কুলার বক্স / জংশন বক্স (Junction Box)',
    category: 'বোর্ড ও বক্স',
    unit: 'পিস',
    defaultPrice: 35,
    defaultBrand: 'RFL / Gazi',
    description: 'পাইপের জয়েন্টের জন্য ১/২/৩/৪ ওয়ে জংশন বক্স'
  },
  {
    id: 'mat-fan-hook-box',
    name: 'ফ্যান হুক বক্স (Fan Hook with Clamp)',
    category: 'বোর্ড ও বক্স',
    unit: 'পিস',
    defaultPrice: 140,
    defaultBrand: 'লোকাল হেভি কাস্ট আয়রন',
    description: 'সিলিংয়ে ফ্যান ঝুলানোর রড ও বক্স'
  },

  // পাইপ ও ফিটিংস
  {
    id: 'mat-pipe-pvc-34',
    name: 'PVC কন্ডুইট পাইপ ৩/৪ ইঞ্চি (10 ft / পাইপ)',
    category: 'পাইপ ও ফিটিংস',
    unit: 'পিস',
    defaultPrice: 120,
    defaultBrand: 'National / RFL / Gazi',
    description: 'দেয়ালের ভেতরের ভারী পিভিসি পাইপ'
  },
  {
    id: 'mat-pipe-pvc-1in',
    name: 'PVC কন্ডুইট পাইপ ১ ইঞ্চি (10 ft / পাইপ)',
    category: 'পাইপ ও ফিটিংস',
    unit: 'পিস',
    defaultPrice: 165,
    defaultBrand: 'National / RFL',
    description: 'মেইন লাইনের মোটা কন্ডুইট পাইপ'
  },
  {
    id: 'mat-pipe-flexible-34',
    name: 'ফ্লেক্সিবল পাইপ ৩/৪ ইঞ্চি',
    category: 'পাইপ ও ফিটিংস',
    unit: 'কয়েল (১০০ ফুট)',
    defaultPrice: 550,
    defaultBrand: 'RFL',
    description: 'বাঁকা জায়গা বা ড্রপ লাইনের জন্য নমনীয় পাইপ'
  },
  {
    id: 'mat-pipe-bend-34',
    name: 'PVC পাইপ ব্যান্ড ৩/৪" (Bend)',
    category: 'পাইপ ও ফিটিংস',
    unit: 'পিস',
    defaultPrice: 18,
    defaultBrand: 'Gazi / RFL',
    description: 'পাইপ বাঁকানোর এলবো'
  },
  {
    id: 'mat-pipe-socket-34',
    name: 'PVC সকেট ৩/৪" (Socket Connector)',
    category: 'পাইপ ও ফিটিংস',
    unit: 'পিস',
    defaultPrice: 12,
    defaultBrand: 'Gazi / RFL',
    description: 'দুটি পাইপ জোড়া দেওয়ার সকেট'
  },
  {
    id: 'mat-cable-clip',
    name: 'কেবল ক্লিপ / স্যাডেল (Cable Clip with Nail)',
    category: 'পাইপ ও ফিটিংস',
    unit: 'প্যাকেট (১০০ পিস)',
    defaultPrice: 90,
    defaultBrand: 'Standard',
    description: 'সারফেস ওয়্যারিংয়ে তার আটকানোর ক্লিপ'
  },
  {
    id: 'mat-insulation-tape',
    name: 'ইনসুলেশন টেপ (PVC Insulation Tape)',
    category: 'পাইপ ও ফিটিংস',
    unit: 'পিস',
    defaultPrice: 35,
    defaultBrand: 'Steel Grip / Wonder',
    description: 'বৈদ্যুতিক জয়েন্ট কভার করার টেপ'
  },
  {
    id: 'mat-royal-plug-screw',
    name: 'রয়েল প্লাগ ও স্ক্রু সেট',
    category: 'পাইপ ও ফিটিংস',
    unit: 'প্যাকেট (১০০ পিস)',
    defaultPrice: 130,
    defaultBrand: 'Standard',
    description: 'বোর্ড ও ক্লিপ দেয়ালে লাগানোর জন্য'
  },

  // কেবল ও তার (কয়েল = ৯০ মিটার)
  {
    id: 'mat-wire-1.0',
    name: 'কপার কেবল 1.0 mm² (BYA 1.0 RM)',
    category: 'তার ও কেবল',
    unit: 'কয়েল (৯০ মি.)',
    defaultPrice: 2200,
    defaultBrand: 'BRB / BBS / Eastern',
    description: 'লাইট ও সাধারণ পয়েন্ট ওয়্যারিং'
  },
  {
    id: 'mat-wire-1.5',
    name: 'কপার কেবল 1.5 mm² (BYA 1.3 RM / 3/0.029)',
    category: 'তার ও কেবল',
    unit: 'কয়েল (৯০ মি.)',
    defaultPrice: 3100,
    defaultBrand: 'BRB / BBS / Eastern',
    description: 'লাইট, ফ্যান এবং সুইচ বোর্ড ফিডিং'
  },
  {
    id: 'mat-wire-2.5',
    name: 'কপার কেবল 2.5 mm² (BYA 2.0 RM / 7/0.029)',
    category: 'তার ও কেবল',
    unit: 'কয়েল (৯০ মি.)',
    defaultPrice: 4800,
    defaultBrand: 'BRB / BBS / Eastern',
    description: 'পাওয়ার সকেট, ফ্রিজ, টিভি, হিটার'
  },
  {
    id: 'mat-wire-4.0',
    name: 'কপার কেবল 4.0 mm² (BYA 7/0.036)',
    category: 'তার ও কেবল',
    unit: 'কয়েল (৯০ মি.)',
    defaultPrice: 7500,
    defaultBrand: 'BRB / BBS / Eastern',
    description: 'এসি (১.৫/২ টন), পানির মোটর, মেইন সাব-সার্কিট'
  },
  {
    id: 'mat-wire-6.0',
    name: 'কপার কেবল 6.0 mm² (BYA 7/0.044)',
    category: 'তার ও কেবল',
    unit: 'কয়েল (৯০ মি.)',
    defaultPrice: 11200,
    defaultBrand: 'BRB / BBS / Eastern',
    description: 'রুম মেইন ডিবি লাইন বা ভারী মোটর'
  },
  {
    id: 'mat-wire-10.0',
    name: 'কপার কেবল 10.0 mm² (BYA 7/0.064)',
    category: 'তার ও কেবল',
    unit: 'কয়েল (৯০ মি.)',
    defaultPrice: 18500,
    defaultBrand: 'BRB / BBS / SQ',
    description: 'মিটার থেকে মেইন ডিবি ইনকামিং কেবল'
  },
  {
    id: 'mat-wire-earth-green',
    name: 'আর্থ কেবল 1.5 mm² সবুজ (Earth Wire)',
    category: 'তার ও কেবল',
    unit: 'কয়েল (৯০ মি.)',
    defaultPrice: 2900,
    defaultBrand: 'BRB / BBS',
    description: 'আর্থিং ও গ্রাউন্ডিং সুরক্ষার তার'
  },
  {
    id: 'mat-cable-byfy-2core-2.5',
    name: '২-কোর ফ্ল্যাট কেবল 2.5 mm² (BYFY)',
    category: 'তার ও কেবল',
    unit: 'কয়েল (৯০ মি.)',
    defaultPrice: 8500,
    defaultBrand: 'BRB / Eastern',
    description: 'সারফেস ডাবল ইনসুলেটেড ২-কোর কেবল'
  },

  // ডিস্ট্রিবিউশন বোর্ড ও ব্রেকার
  {
    id: 'mat-db-box-4way',
    name: 'ডিস্ট্রিবিউশন বোর্ড ৪-ওয়ে (4 Way DB Box with Busbar)',
    category: 'ব্রেকার ও সুরক্ষা',
    unit: 'পিস',
    defaultPrice: 850,
    defaultBrand: 'Havells / Super Star',
    description: 'ছোট ফ্ল্যাট বা রুম সাব-ডিবি'
  },
  {
    id: 'mat-db-box-8way',
    name: 'ডিস্ট্রিবিউশন বোর্ড ৮-ওয়ে (8 Way SPN DB Box)',
    category: 'ব্রেকার ও সুরক্ষা',
    unit: 'পিস',
    defaultPrice: 1450,
    defaultBrand: 'Havells / Super Star',
    description: 'ফ্ল্যাটের স্ট্যান্ডার্ড ডিস্ট্রিবিউশন বোর্ড'
  },
  {
    id: 'mat-db-box-12way',
    name: 'ডিস্ট্রিবিউশন বোর্ড ১২-ওয়ে (12 Way DB Box)',
    category: 'ব্রেকার ও সুরক্ষা',
    unit: 'পিস',
    defaultPrice: 2200,
    defaultBrand: 'ABB / Havells / Super Star',
    description: 'বড় ফ্ল্যাট বা বাড়ির জন্য'
  },
  {
    id: 'mat-mcb-sp-6-16',
    name: 'SP MCB (সিঙ্গেল পোল ব্রেকার 6A / 10A / 16A)',
    category: 'ব্রেকার ও সুরক্ষা',
    unit: 'পিস',
    defaultPrice: 380,
    defaultBrand: 'Schneider / ABB / Super Star',
    description: 'লাইটিং ও পাওয়ার শাখা সার্কিটের ব্রেকার'
  },
  {
    id: 'mat-mcb-sp-20-32',
    name: 'SP MCB (সিঙ্গেল পোল ব্রেকার 20A / 25A / 32A)',
    category: 'ব্রেকার ও সুরক্ষা',
    unit: 'পিস',
    defaultPrice: 420,
    defaultBrand: 'Schneider / ABB / Super Star',
    description: 'এসি ও ভারী মেশিনের শাখা ব্রেকার'
  },
  {
    id: 'mat-mcb-dp-32-63',
    name: 'DP MCB (ডাবল পোল মেইন ব্রেকার 32A / 40A / 63A)',
    category: 'ব্রেকার ও সুরক্ষা',
    unit: 'পিস',
    defaultPrice: 950,
    defaultBrand: 'Schneider / ABB / Super Star',
    description: 'ফেজ ও নিউট্রাল উভয়ের মেইন কাটআউট'
  },
  {
    id: 'mat-rccb-dp-30ma',
    name: 'RCCB / ELCB ডাবল পোল (40A, 30mA ট্রিপ)',
    category: 'ব্রেকার ও সুরক্ষা',
    unit: 'পিস',
    defaultPrice: 2800,
    defaultBrand: 'Schneider / Legrand / ABB',
    description: 'কারেন্ট লিকেজ ও ইলেকট্রিক শক প্রতিরোধে জীবন রক্ষাকারী'
  },
  {
    id: 'mat-rcbo-dp-30ma',
    name: 'RCBO ডাবল পোল (MCB + RCCB সম্মিলিত 32A 30mA)',
    category: 'ব্রেকার ও সুরক্ষা',
    unit: 'পিস',
    defaultPrice: 3600,
    defaultBrand: 'Schneider / ABB',
    description: 'ওভারলোড + শর্ট সার্কিট + কারেন্ট লিকেজ ট্রিপ'
  },
  {
    id: 'mat-mcb-tp-40-63',
    name: 'TP MCB (থ্রি পোল ব্রেকার 32A / 40A / 63A)',
    category: 'ব্রেকার ও সুরক্ষা',
    unit: 'পিস',
    defaultPrice: 1850,
    defaultBrand: 'Schneider / ABB / Super Star',
    description: 'থ্রি ফেজ সাপ্লাই বা ৩ ফেজ মোটরের জন্য'
  },
  {
    id: 'mat-spd',
    name: 'সার্জ প্রোটেকশন ডিভাইস (SPD - বজ্রপাত সুরক্ষা)',
    category: 'ব্রেকার ও সুরক্ষা',
    unit: 'পিস',
    defaultPrice: 4500,
    defaultBrand: 'Schneider / Phoenix Contact',
    description: 'বজ্রপাত ও হাই ভোল্টেজ স্পাইক থেকে যন্ত্রপাতির সুরক্ষা'
  },

  // আর্থিং সামগ্রী
  {
    id: 'mat-earth-rod-copper-8ft',
    name: 'আর্থিং কপার রড ৮ ফুট (Copper Bonded Rod 5/8")',
    category: 'আর্থিং সামগ্রী',
    unit: 'পিস',
    defaultPrice: 1800,
    defaultBrand: 'Heavy Copper Coated',
    description: 'মাটিতে গভীর আর্থিং রড স্থাপনের জন্য'
  },
  {
    id: 'mat-earth-clamp',
    name: 'আর্থিং ক্ল্যাম্প / ব্রাস ক্ল্যাম্প (Earth Clamp)',
    category: 'আর্থিং সামগ্রী',
    unit: 'পিস',
    defaultPrice: 180,
    defaultBrand: 'Pure Brass',
    description: 'আর্থিং তার ও রড সংযুক্ত করার ক্ল্যাম্প'
  },
  {
    id: 'mat-earth-salt-coal',
    name: 'আর্থিং উপাদান (লবণ ও কাঠকয়লা ২০ কেজি ব্যাগ)',
    category: 'আর্থিং সামগ্রী',
    unit: 'সেট',
    defaultPrice: 450,
    defaultBrand: 'Standard',
    description: 'মাটির আর্দ্রতা ধরে রেখে আর্থ রেজিস্ট্যান্স কমানোর জন্য'
  },
  {
    id: 'mat-earth-pit-cover',
    name: 'আর্থিং পিট চেম্বার বক্স (Inspection Chamber Cover)',
    category: 'আর্থিং সামগ্রী',
    unit: 'পিস',
    defaultPrice: 650,
    defaultBrand: 'Heavy PVC / CI',
    description: 'আর্থ টেস্ট পয়েন্টের চেম্বার ঢাকনা'
  }
];
