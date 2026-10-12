import { BreakerSpecification } from '../types';

export const BREAKER_SPECIFICATIONS: BreakerSpecification[] = [
  // SP MCB
  {
    id: 'brk-sp-6',
    type: 'SP MCB',
    poles: 1,
    ratedCurrentA: 6,
    voltage: 230,
    breakingCapacityKA: 6,
    curve: 'C',
    brand: 'Schneider / ABB / Super Star',
    approxPrice: 380,
    application: 'শুধুমাত্র লাইট ও ফ্যানের শাখা সার্কিট (সর্বোচ্চ ১০০০ ওয়াট পর্যন্ত)।',
    safetyNotes: 'অতিরিক্ত কারেন্ট বা শর্ট সার্কিটে স্বয়ংক্রিয়ভাবে ট্রিপ করে।'
  },
  {
    id: 'brk-sp-10',
    type: 'SP MCB',
    poles: 1,
    ratedCurrentA: 10,
    voltage: 230,
    breakingCapacityKA: 6,
    curve: 'C',
    brand: 'Schneider / ABB / Super Star',
    approxPrice: 380,
    application: 'সাধারণ ঘরের সকল লাইট ও ফ্যান সার্কিট (সর্বোচ্চ ১৫০০ ওয়াট পর্যন্ত)।',
    safetyNotes: '১.৫ mm² তারের সাথে সবচেয়ে নিরাপদ ও আদর্শ কম্বিনেশন।'
  },
  {
    id: 'brk-sp-16',
    type: 'SP MCB',
    poles: 1,
    ratedCurrentA: 16,
    voltage: 230,
    breakingCapacityKA: 6,
    curve: 'C',
    brand: 'Schneider / ABB / Super Star',
    approxPrice: 400,
    application: 'পাওয়ার সকেট সার্কিট, ফ্রিজ, টিভি, ওয়াশিং মেশিন, ১ টন এসি বা ১ HP মোটর।',
    safetyNotes: '২.৫ mm² কেবল ব্যবহার আবশ্যক।'
  },
  {
    id: 'brk-sp-20',
    type: 'SP MCB',
    poles: 1,
    ratedCurrentA: 20,
    voltage: 230,
    breakingCapacityKA: 6,
    curve: 'C',
    brand: 'Schneider / ABB / Super Star',
    approxPrice: 420,
    application: '১.৫ টন এসি, বাথরুম গিজার বা মাইক্রোওয়েভ সার্কিট।',
    safetyNotes: '৪.০ mm² তার ব্যবহার করতে হবে। ২০A ব্রেকারে কখনও ১.৫ mm² তার দেওয়া যাবে না।'
  },
  {
    id: 'brk-sp-25',
    type: 'SP MCB',
    poles: 1,
    ratedCurrentA: 25,
    voltage: 230,
    breakingCapacityKA: 6,
    curve: 'C',
    brand: 'Schneider / ABB / Super Star',
    approxPrice: 440,
    application: '২ টন এসি, সাবমার্সিবল মোটর (১.৫-২ HP) বা ইন্ডাকশন কুকার।',
    safetyNotes: '৪.০ mm² বা ৬.০ mm² তার বাধ্যতামূলক।'
  },
  {
    id: 'brk-sp-32',
    type: 'SP MCB',
    poles: 1,
    ratedCurrentA: 32,
    voltage: 230,
    breakingCapacityKA: 6,
    curve: 'C',
    brand: 'Schneider / ABB / Super Star',
    approxPrice: 460,
    application: 'বড় রুম সাব-ফিডার বা ভারী মেশিন পয়েন্ট।',
    safetyNotes: 'কেবল সাইজ ন্যূনতম ৬.০ mm² হতে হবে।'
  },

  // DP MCB
  {
    id: 'brk-dp-32',
    type: 'DP MCB',
    poles: 2,
    ratedCurrentA: 32,
    voltage: 230,
    breakingCapacityKA: 6,
    curve: 'C',
    brand: 'Schneider / ABB / Super Star',
    approxPrice: 850,
    application: 'ছোট ফ্ল্যাট বা ২-৩ রুমের বাসা-বাড়ির মেইন ব্রেকার।',
    safetyNotes: 'একসঙ্গে ফেজ ও নিউট্রাল উভয় লাইন বিচ্ছিন্ন করে সম্পূর্ণ সুরক্ষা দেয়।'
  },
  {
    id: 'brk-dp-40',
    type: 'DP MCB',
    poles: 2,
    ratedCurrentA: 40,
    voltage: 230,
    breakingCapacityKA: 6,
    curve: 'C',
    brand: 'Schneider / ABB / Super Star',
    approxPrice: 950,
    application: 'মাঝারি সাইজের ফ্ল্যাট (১০০০-১৫০০ বর্গফুট) এর মেইন সুইচ/ব্রেকার।',
    safetyNotes: 'ইনকামিং তার ন্যূনতম ১০.০ mm² বা ৬.০ mm² হওয়া প্রয়োজন।'
  },
  {
    id: 'brk-dp-63',
    type: 'DP MCB',
    poles: 2,
    ratedCurrentA: 63,
    voltage: 230,
    breakingCapacityKA: 10,
    curve: 'C',
    brand: 'Schneider / ABB / Super Star',
    approxPrice: 1350,
    application: 'বড় ফ্ল্যাট (২-৩টি এসি ও গিজারযুক্ত) এর ইনকামিং মেইন ব্রেকার।',
    safetyNotes: 'ইনকামিং তার ১০.০ mm² বা ১৬.০ mm² কেবল হতে হবে।'
  },

  // RCCB (ELCB)
  {
    id: 'brk-rccb-dp-40-30',
    type: 'RCCB',
    poles: 2,
    ratedCurrentA: 40,
    voltage: 230,
    breakingCapacityKA: 6,
    leakageTripMa: 30,
    brand: 'Schneider / Legrand / ABB',
    approxPrice: 2800,
    application: 'মানবদেহে শক প্রতিরোধ এবং আর্থ লিকেজ সুরক্ষা (বাথরুম, কিচেন, পুরো বাসা)।',
    safetyNotes: 'গুরুত্বপূর্ণ: RCCB একা ওভারলোড বা শর্ট সার্কিট থেকে রক্ষা করতে পারে না! এর আগে অবশ্যই MCB রাখতে হবে।'
  },
  {
    id: 'brk-rccb-dp-63-30',
    type: 'RCCB',
    poles: 2,
    ratedCurrentA: 63,
    voltage: 230,
    breakingCapacityKA: 6,
    leakageTripMa: 30,
    brand: 'Schneider / Legrand / ABB',
    approxPrice: 3400,
    application: 'বড় বাসাবাড়ির প্রধান মেইন লাইনে সামগ্রিক শক সুরক্ষা।',
    safetyNotes: '৩০mA কারেন্ট লিকেজ হলেই ১০-৩০ মিলিসেকেন্ডে বিদ্যুৎ সংযোগ বন্ধ করে দেয়।'
  },

  // RCBO
  {
    id: 'brk-rcbo-dp-20-30',
    type: 'RCBO',
    poles: 2,
    ratedCurrentA: 20,
    voltage: 230,
    breakingCapacityKA: 6,
    curve: 'C',
    leakageTripMa: 30,
    brand: 'Schneider / ABB / Siemens',
    approxPrice: 3200,
    application: 'বাথরুম গিজার, কিচেন ও আউটডোর সার্কিটে অল-ইন-ওয়ান সুরক্ষা।',
    safetyNotes: 'MCB এবং RCCB এর সম্পূর্ণ যৌথ কাজ করে (ওভারলোড + শর্ট সার্কিট + শক লিকেজ)।'
  },
  {
    id: 'brk-rcbo-dp-32-30',
    type: 'RCBO',
    poles: 2,
    ratedCurrentA: 32,
    voltage: 230,
    breakingCapacityKA: 6,
    curve: 'C',
    leakageTripMa: 30,
    brand: 'Schneider / ABB / Siemens',
    approxPrice: 3600,
    application: 'ফ্ল্যাটের মেইন ফিডার বা অত্যন্ত সংবেদনশীল ইলেকট্রনিক্স সার্কিট।',
    safetyNotes: 'ত্রুটির সঠিক কারণ নির্দেশ করে এবং কোনো পার্শ্ববর্তী সার্কিটকে অকারণে ট্রিপ করায় না।'
  },

  // TP MCB / TPN
  {
    id: 'brk-tp-32',
    type: 'TP MCB',
    poles: 3,
    ratedCurrentA: 32,
    voltage: 415,
    breakingCapacityKA: 10,
    curve: 'C',
    brand: 'Schneider / ABB / Super Star',
    approxPrice: 1850,
    application: 'থ্রি ফেজ মোটর (৫-৭.৫ HP), লিফট বা থ্রি-ফেজ লোড সাব-ফিডার।',
    safetyNotes: 'তিনটি ফেজ একসাথে সংযোগ বিচ্ছিন্ন করে ফেজ ফেইলিওর প্রতিরোধ করে।'
  },
  {
    id: 'brk-tp-63',
    type: 'TP MCB',
    poles: 3,
    ratedCurrentA: 63,
    voltage: 415,
    breakingCapacityKA: 10,
    curve: 'C',
    brand: 'Schneider / ABB / Super Star',
    approxPrice: 2400,
    application: 'থ্রি ফেজ মেইন সাপ্লাই লাইন ও কমার্শিয়াল ডিস্ট্রিবিউশন।',
    safetyNotes: '১০kA ব্রেকিং ক্যাপাসিটি সম্পন্ন হওয়া উচিত।'
  },
  {
    id: 'brk-tpn-63',
    type: 'TPN MCB',
    poles: 4,
    ratedCurrentA: 63,
    voltage: 415,
    breakingCapacityKA: 10,
    curve: 'C',
    brand: 'Schneider / ABB / Legrand',
    approxPrice: 3200,
    application: '৩-ফেজ + নিউট্রাল সম্পূর্ণ চার পোল ইনকামিং মেইন প্যানেল।',
    safetyNotes: 'নিউট্রাল আইসোলেশনসহ সর্বোচ্চ নিরাপত্তা নিশ্চিত করে।'
  },

  // MCCB
  {
    id: 'brk-mccb-100',
    type: '4P MCCB',
    poles: 4,
    ratedCurrentA: 100,
    voltage: 415,
    breakingCapacityKA: 25,
    brand: 'Schneider / ABB / Hyundai',
    approxPrice: 11500,
    application: 'বহুতল ভবনের প্রধান মেইন এলটি প্যানেল বোর্ড (LT Switchgear)।',
    safetyNotes: 'এডজাস্টেবল ট্রিপ সেটিং ও ২৫kA পর্যন্ত উচ্চ শর্ট সার্কিট ফল্ট কারেন্ট সামলাতে সক্ষম।'
  },
  {
    id: 'brk-mccb-200',
    type: '4P MCCB',
    poles: 4,
    ratedCurrentA: 200,
    voltage: 415,
    breakingCapacityKA: 36,
    brand: 'Schneider / ABB / LS Electric',
    approxPrice: 22000,
    application: 'সাব-স্টেশন ট্রান্সফরমার আউটপুট বা বড় কারখানার সেন্ট্রাল মেইন ব্রেকার।',
    safetyNotes: 'থার্মাল ও ম্যাগনেটিক ট্রিপ ইউনিট সম্পূর্ণ পরিবর্তনযোগ্য।'
  },

  // SPD
  {
    id: 'brk-spd-40ka',
    type: 'SPD',
    poles: 2,
    ratedCurrentA: 40,
    voltage: 275,
    breakingCapacityKA: 40,
    brand: 'Schneider / Phoenix Contact / Super Star',
    approxPrice: 4500,
    application: 'বজ্রপাত ও হাই ভোল্টেজ স্পাইক প্রটেকশন (Class II Surge Arrester)।',
    safetyNotes: 'আর্থিংয়ের সাথে সরাসরি যুক্ত হয়ে অতি উচ্চ ভোল্টেজ মাটিতে নিরাপদে নিষ্কাশন করে।'
  }
];

export const BREAKER_COMPARISON_GUIDE = {
  mcb: {
    title: 'MCB (Miniature Circuit Breaker)',
    bangla: 'মিনিয়াচার সার্কিট ব্রেকার',
    purpose: 'ওভারলোড (অতিরিক্ত লোড) এবং শর্ট সার্কিট (ফেজ ও নিউট্রাল স্পর্শ হওয়া) থেকে লাইন ও কেবলকে পোড়া থেকে রক্ষা করে।',
    currentRange: '০.৫ অ্যাম্পিয়ার থেকে সর্বোচ্চ ১২৫ অ্যাম্পিয়ার।',
    breakingCapacity: 'সাধারণত ৬kA থেকে ১০kA। বাসাবাড়ির জন্য আদর্শ।',
    keyNote: 'মানুষকে ইলেকট্রিক শক বা কারেন্ট লিকেজ থেকে একা রক্ষা করতে পারে না।'
  },
  mccb: {
    title: 'MCCB (Molded Case Circuit Breaker)',
    bangla: 'মোল্ডেড কেস সার্কিট ব্রেকার',
    purpose: 'উচ্চ ক্ষমতাসম্পন্ন শিল্প কারখানা, বহুতল ভবনের সেন্ট্রাল প্যানেল বা সাব-স্টেশন এর প্রধান সুরক্ষার জন্য।',
    currentRange: '১৬ অ্যাম্পিয়ার থেকে ২৫০০+ অ্যাম্পিয়ার পর্যন্ত।',
    breakingCapacity: '১৫kA থেকে ৫০kA+ পর্যন্ত অতি উচ্চ শর্ট সার্কিট ফল্ট সহ্য করতে পারে।',
    keyNote: 'এর ট্রিপ কারেন্ট প্রয়োজনমতো ম্যানুয়ালি অ্যাডজাস্ট (Adjust) বা সেট করা যায়।'
  },
  rccb: {
    title: 'RCCB / ELCB (Residual Current Circuit Breaker)',
    bangla: 'রেসিডুয়াল কারেন্ট সার্কিট ব্রেকার (জীবন রক্ষাকারী)',
    purpose: 'কোনো ব্যক্তি কোনো খোলা তার বা ত্রুটিযুক্ত বডি হওয়া ফ্রিজ/মোটরে হাত দিলে কিংবা আর্থ লিকেজ হলে তাৎক্ষণিক বিদ্যুৎ বন্ধ করে জীবন বাঁচায়।',
    currentRange: '১৬A, ২৫A, ৪০A, ৬৩A ইত্যাদি রেটিং। সেনসিটিভিটি: ৩০mA (মানুষের জন্য), ১০০mA-৩০০mA (অগ্নিকাণ্ড রোধে)।',
    breakingCapacity: 'নিজস্ব শর্ট সার্কিট ব্রেকিং নেই, শুধু লিকেজ শনাক্ত করে।',
    keyNote: 'সাবধান! RCCB কিন্তু অতিরিক্ত লোড বা শর্ট সার্কিটে ট্রিপ করে না! তাই RCCB এর আগে অবশ্যই MCB ব্যবহার করতে হবে।'
  },
  rcbo: {
    title: 'RCBO (Residual Current Breaker with Overcurrent)',
    bangla: 'সম্মিলিত সুরক্ষা ব্রেকার (MCB + RCCB একসাথে)',
    purpose: 'একটি একক ডিভাইসের ভেতরেই তিনটি সুরক্ষা: ১. ওভারলোড ২. শর্ট সার্কিট ৩. কারেন্ট লিকেজ / শক প্রটেকশন।',
    currentRange: '৬A থেকে ৪০A পর্যন্ত সিঙ্গেল মডিউল ও ডাবল মডিউল।',
    breakingCapacity: '৬kA থেকে ১০kA।',
    keyNote: 'বাথরুম গিজার, আউটডোর ওয়াটার পাম্প বা শিশুদের রুমের জন্য আধুনিকতম নিরাপদ সমাধান।'
  }
};
