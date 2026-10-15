import { CABLE_SPECIFICATIONS } from '../data/cableData';
import { CableSpecification } from '../types';

export interface CalculationResult {
  totalWatts: number;
  totalKW: number;
  totalKVA: number;
  effectiveWattsWithDiversity: number;
  operatingCurrentA: number;
  designCurrentA: number; // Current with safety factor
  voltage: number;
  isThreePhase: boolean;
  powerFactor: number;
  diversityFactor: number;
  status: 'প্রাথমিক অনুমান' | 'ম্যানুয়াল ইনপুট' | 'যাচাইকৃত';
  recommendedCable: CableSpecification;
  alternativeCable?: CableSpecification;
  voltageDropVolts: number;
  voltageDropPercentage: number;
  isVoltageDropAcceptable: boolean;
  recommendedBreakerRatingA: number;
  recommendedBreakerType: string;
  recommendedBreakerCurve: string;
  recommendedRccbRequired: boolean;
  recommendedRccbRating?: string;
  recommendedEarthWire: string;
  warnings: string[];
  safetyNotes: string[];
  formulaSteps: string[];
}

export interface CableCalculationInput {
  loadWatts: number;
  voltage: number;
  isThreePhase: boolean;
  powerFactor: number;
  diversityFactor?: number;
  lengthMeters: number;
  installationMethod: 'কন্ডুইট (Conduit in Wall)' | 'সারফেস (Surface / Clipped)' | 'ট্রে (Cable Tray)';
  ambientTempC?: number;
  conductorType?: 'Copper (তামা)' | 'Aluminium (অ্যালুমিনিয়াম)';
  isMotorOrCompressor?: boolean;
  hasWetAreaOrGeyser?: boolean;
}

/**
 * Calculate electrical parameters with strict engineering standards and safety minimums
 */
export function calculateElectricalLoad(input: CableCalculationInput): CalculationResult {
  const {
    loadWatts,
    voltage = 220,
    isThreePhase = false,
    powerFactor = 0.85,
    diversityFactor = 1.0,
    lengthMeters = 20,
    installationMethod = 'কন্ডুইট (Conduit in Wall)',
    ambientTempC = 35,
    conductorType = 'Copper (তামা)',
    isMotorOrCompressor = false,
    hasWetAreaOrGeyser = false
  } = input;

  const warnings: string[] = [];
  const safetyNotes: string[] = [];
  const formulaSteps: string[] = [];

  const effectivePF = Math.max(0.6, Math.min(1.0, powerFactor || 0.85));
  const effectiveDiversity = Math.max(0.5, Math.min(1.0, diversityFactor || 1.0));
  const safeVoltage = voltage > 0 ? voltage : isThreePhase ? 400 : 220;

  const totalWatts = Math.max(0, loadWatts);
  const totalKW = totalWatts / 1000;
  const effectiveWattsWithDiversity = totalWatts * effectiveDiversity;
  const totalKVA = totalKW / effectivePF;

  // 1. Operating Current calculation
  let operatingCurrentA = 0;
  if (isThreePhase) {
    const sqrt3 = 1.73205;
    operatingCurrentA = effectiveWattsWithDiversity / (sqrt3 * safeVoltage * effectivePF);
    formulaSteps.push(
      `থ্রি ফেজ কারেন্ট: I = P ÷ (√৩ × V × PF) = ${effectiveWattsWithDiversity.toFixed(0)}W ÷ (১.৭৩২ × ${safeVoltage}V × ${effectivePF}) = ${operatingCurrentA.toFixed(2)} অ্যাম্পিয়ার প্রতি ফেজে।`
    );
  } else {
    operatingCurrentA = effectiveWattsWithDiversity / (safeVoltage * effectivePF);
    formulaSteps.push(
      `সিঙ্গেল ফেজ কারেন্ট: I = P ÷ (V × PF) = ${effectiveWattsWithDiversity.toFixed(0)}W ÷ (${safeVoltage}V × ${effectivePF}) = ${operatingCurrentA.toFixed(2)} অ্যাম্পিয়ার।`
    );
  }

  // 2. Continuous load safety factor (125% - 135% as per standard rules)
  const safetyMultiplier = isMotorOrCompressor ? 1.35 : 1.25;
  const designCurrentA = operatingCurrentA * safetyMultiplier;
  formulaSteps.push(
    `ডিজাইন ও সেফটি কারেন্ট (১২৫% - ১৩৫% মার্জিন): ${operatingCurrentA.toFixed(2)}A × ${safetyMultiplier} = ${designCurrentA.toFixed(2)} অ্যাম্পিয়ার।`
  );

  // 3. Temperature derating factor
  let tempDerating = 1.0;
  if (ambientTempC >= 40) tempDerating = 0.87;
  else if (ambientTempC >= 35) tempDerating = 0.94;

  // 4. Find suitable cable based on current capacity and voltage drop
  const availableCables = CABLE_SPECIFICATIONS;
  let selectedCable: CableSpecification = availableCables[0];
  let alternativeCable: CableSpecification | undefined = undefined;

  for (const cable of availableCables) {
    const baseCapacity =
      installationMethod === 'সারফেস (Surface / Clipped)'
        ? cable.openAirCurrentCapacityA
        : cable.conduitCurrentCapacityA;
    const deratedCapacity = baseCapacity * tempDerating;

    const dropV = (cable.voltageDropMvPerAmpMeter * operatingCurrentA * lengthMeters) / 1000;
    const dropPct = (dropV / safeVoltage) * 100;

    if (deratedCapacity >= designCurrentA && dropPct <= 3.5) {
      selectedCable = cable;
      break;
    }
  }

  // ENFORCE ENGINEERING SAFETY MINIMUMS BASED ON TOTAL LOAD (Fixing 1.5mm issue for heavy loads)
  // - Up to 1300W: min 1.5 mm²
  // - 1300W to 2000W: min 2.5 mm²
  // - 2000W to 4000W: min 4.0 mm²
  // - Above 4000W: min 6.0 mm² or 10 mm²
  let minRequiredSizeMm2 = 1.5;
  if (effectiveWattsWithDiversity > 4000) {
    minRequiredSizeMm2 = 6.0;
  } else if (effectiveWattsWithDiversity > 2000) {
    minRequiredSizeMm2 = 4.0;
  } else if (effectiveWattsWithDiversity > 1300) {
    minRequiredSizeMm2 = 2.5;
  }

  const currentSelectedSizeNum = parseFloat(selectedCable.sizeMm2);
  if (currentSelectedSizeNum < minRequiredSizeMm2) {
    const forcedCable = availableCables.find(c => parseFloat(c.sizeMm2) >= minRequiredSizeMm2);
    if (forcedCable) {
      selectedCable = forcedCable;
    }
  }

  // If design current exceeds selected cable capacity, pick higher
  const currentCap =
    installationMethod === 'সারফেস (Surface / Clipped)'
      ? selectedCable.openAirCurrentCapacityA
      : selectedCable.conduitCurrentCapacityA;

  if (designCurrentA > currentCap * tempDerating) {
    const capable = availableCables.find(
      (c) => (installationMethod === 'সারফেস (Surface / Clipped)' ? c.openAirCurrentCapacityA : c.conduitCurrentCapacityA) * tempDerating >= designCurrentA
    );
    if (capable) selectedCable = capable;
  }

  // Calculate final voltage drop with selected cable
  const voltageDropVolts =
    (selectedCable.voltageDropMvPerAmpMeter * operatingCurrentA * lengthMeters) / 1000;
  const voltageDropPercentage = (voltageDropVolts / safeVoltage) * 100;
  const isVoltageDropAcceptable = voltageDropPercentage <= 3.0;

  formulaSteps.push(
    `ভোল্টেজ ড্রপ: (${selectedCable.voltageDropMvPerAmpMeter} mV/A/m × ${operatingCurrentA.toFixed(2)}A × ${lengthMeters}m) ÷ ১০০০ = ${voltageDropVolts.toFixed(2)}V (${voltageDropPercentage.toFixed(2)}%)।`
  );

  if (voltageDropPercentage > 3.0 && voltageDropPercentage <= 5.0) {
    warnings.push(
      `সতর্কতা: ভোল্টেজ ড্রপ ${voltageDropPercentage.toFixed(2)}% হয়েছে, যা ৩% স্ট্যান্ডার্ডের বেশি কিন্তু ৫% সীমার ভেতর।`
    );
  } else if (voltageDropPercentage > 5.0) {
    warnings.push(
      `বিপদজনক সতর্কতা: তারের দৈর্ঘ্য বেশি হওয়ায় ভোল্টেজ ড্রপ ${voltageDropPercentage.toFixed(2)}% ছাড়িয়ে গেছে! তারের সাইজ বৃদ্ধি করুন।`
    );
    const currIdx = availableCables.findIndex((c) => c.sizeMm2 === selectedCable.sizeMm2);
    if (currIdx < availableCables.length - 1) {
      alternativeCable = availableCables[currIdx + 1];
    }
  }

  // 5. Breaker Selection matching market ratings (10A, 16A, 20A, 25A, 32A, 40A, 50A, 63A)
  const standardRatings = [6, 10, 16, 20, 25, 32, 40, 50, 63, 80, 100];
  let recommendedBreakerRatingA = 10;

  for (const rating of standardRatings) {
    if (rating >= designCurrentA) {
      recommendedBreakerRatingA = rating;
      break;
    }
  }

  const cableCapacity =
    installationMethod === 'সারফেস (Surface / Clipped)'
      ? selectedCable.openAirCurrentCapacityA
      : selectedCable.conduitCurrentCapacityA;

  if (recommendedBreakerRatingA > cableCapacity) {
    warnings.push(
      `নিরাপত্তা ত্রুটি: নির্বাচিত ব্রেকার (${recommendedBreakerRatingA}A) তারের বহনক্ষমতা (${cableCapacity}A) চেয়ে বড়!`
    );
  }

  const recommendedBreakerCurve = isMotorOrCompressor ? 'Curve C / D' : 'Curve C';
  const recommendedBreakerType = isThreePhase ? 'TP MCB / MCCB' : 'SP / DP MCB';

  const recommendedRccbRequired = hasWetAreaOrGeyser || isMotorOrCompressor || totalWatts > 2000;
  const recommendedRccbRating = recommendedRccbRequired
    ? `${recommendedBreakerRatingA >= 40 ? 63 : 40}A DP, 30mA ট্রিপ সেনসিটিভিটি`
    : undefined;

  if (hasWetAreaOrGeyser) {
    safetyNotes.push('বাথরুমে গিজার বা ভেজা সার্কিট থাকায় ৩০mA RCCB বা RCBO ব্যবহার করা বাধ্যতামূলক।');
  }

  if (isMotorOrCompressor) {
    safetyNotes.push('মোটর বা কম্প্রেসারে স্টার্টিং কারেন্ট বেশি থাকায় Curve C ব্রেকার নির্বাচন করা হয়েছে।');
  }

  safetyNotes.push(
    `আর্থিং কন্ডাক্টর হিসেবে ন্যূনতম ${selectedCable.recommendedEarthWire} তামার তার সংযুক্ত করতে হবে।`
  );

  return {
    totalWatts,
    totalKW,
    totalKVA,
    effectiveWattsWithDiversity,
    operatingCurrentA,
    designCurrentA,
    voltage: safeVoltage,
    isThreePhase,
    powerFactor: effectivePF,
    diversityFactor: effectiveDiversity,
    status: totalWatts > 0 ? 'যাচাইকৃত' : 'প্রাথমিক অনুমান',
    recommendedCable: selectedCable,
    alternativeCable,
    voltageDropVolts,
    voltageDropPercentage,
    isVoltageDropAcceptable,
    recommendedBreakerRatingA,
    recommendedBreakerType,
    recommendedBreakerCurve,
    recommendedRccbRequired,
    recommendedRccbRating,
    recommendedEarthWire: selectedCable.recommendedEarthWire,
    warnings,
    safetyNotes,
    formulaSteps
  };
}
