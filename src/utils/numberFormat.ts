const BENGALI_DIGITS = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];

export function toBnNumber(value: number | string | null | undefined): string {
  if (value === null || value === undefined || value === '') return '০';
  const str = String(value);
  return str.replace(/[0-9]/g, (digit) => BENGALI_DIGITS[parseInt(digit, 10)]);
}

export function formatTaka(amount: number | null | undefined, inBengaliDigits = false): string {
  const num = Number(amount || 0);
  const formattedEnglish = num.toLocaleString('en-IN', {
    maximumFractionDigits: 0
  });

  if (inBengaliDigits) {
    return `৳ ${toBnNumber(formattedEnglish)}`;
  }
  return `৳ ${formattedEnglish}`;
}

export function formatWatts(watts: number, inBengali = false): string {
  if (watts >= 1000) {
    const kw = (watts / 1000).toFixed(2);
    return inBengali ? `${toBnNumber(kw)} kW` : `${kw} kW`;
  }
  const val = Math.round(watts);
  return inBengali ? `${toBnNumber(val)} W` : `${val} W`;
}

export function formatAmps(amps: number, inBengali = false): string {
  const val = amps.toFixed(2);
  return inBengali ? `${toBnNumber(val)} A` : `${val} A`;
}
