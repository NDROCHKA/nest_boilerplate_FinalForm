export type FitCategoryKey = 'oversized' | 'regular' | 'hoodie';

export interface MeasurementRow {
  key: 'A' | 'B' | 'C' | 'D';
  label: string;
  description: string;
  valuesCm: Record<string, number>;
}

export interface SizeChartCategory {
  key: FitCategoryKey;
  title: string;
  subtitle: string;
  badge: string;
  sizes: string[];
  measurements: MeasurementRow[];
  garmentType: 'tshirt' | 'hoodie';
  fitDescription: string;
}

export const SIZE_CHARTS: Record<FitCategoryKey, SizeChartCategory> = {
  oversized: {
    key: 'oversized',
    title: 'Oversized T-Shirts',
    subtitle: 'Relaxed streetwear fit with dropped shoulders & extended length',
    badge: 'Streetwear Fit',
    garmentType: 'tshirt',
    sizes: ['S', 'M', 'L', 'XL'],
    fitDescription: 'Cut with generous chest volume, dropped shoulder seams, and relaxed armholes. If you prefer a classic boxy fit, select your true size. For a more standard fit, order one size down.',
    measurements: [
      {
        key: 'A',
        label: 'Length',
        description: 'Collar seam to bottom hem',
        valuesCm: { S: 70, M: 73, L: 76, XL: 79 },
      },
      {
        key: 'B',
        label: 'Chest',
        description: 'Armpit to armpit across front',
        valuesCm: { S: 55, M: 57, L: 60, XL: 63 },
      },
      {
        key: 'C',
        label: 'Sleeve',
        description: 'Shoulder seam to sleeve cuff',
        valuesCm: { S: 24, M: 25, L: 25, XL: 28 },
      },
      {
        key: 'D',
        label: 'Shoulder',
        description: 'Shoulder seam to shoulder seam',
        valuesCm: { S: 47, M: 50, L: 53, XL: 56 },
      },
    ],
  },
  regular: {
    key: 'regular',
    title: 'Regular Fit T-Shirts',
    subtitle: 'Classic athletic cut tailored for everyday comfort',
    badge: 'Classic Fit',
    garmentType: 'tshirt',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    fitDescription: 'Designed with standard shoulder proportions and a tailored waist curve. Fits true to size.',
    measurements: [
      {
        key: 'A',
        label: 'Length',
        description: 'Collar seam to bottom hem',
        valuesCm: { S: 70, M: 72, L: 74, XL: 76, XXL: 78 },
      },
      {
        key: 'B',
        label: 'Chest',
        description: 'Armpit to armpit across front',
        valuesCm: { S: 50, M: 52, L: 54, XL: 56, XXL: 58 },
      },
      {
        key: 'C',
        label: 'Sleeve',
        description: 'Shoulder seam to sleeve cuff',
        valuesCm: { S: 21, M: 22, L: 22, XL: 23, XXL: 23 },
      },
      {
        key: 'D',
        label: 'Shoulder',
        description: 'Shoulder seam to shoulder seam',
        valuesCm: { S: 40, M: 42, L: 44, XL: 46, XXL: 48 },
      },
    ],
  },
  hoodie: {
    key: 'hoodie',
    title: 'Hoodies & Outerwear',
    subtitle: 'Heavyweight fleece with double-layer hood & ribbed cuffs',
    badge: 'Heavyweight Fleece',
    garmentType: 'hoodie',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    fitDescription: 'Engineered from 450 GSM cotton fleece with custom ribbed waistband and relaxed sleeves. Fits true to size with room for inner layering.',
    measurements: [
      {
        key: 'A',
        label: 'Length',
        description: 'High shoulder point to bottom hem',
        valuesCm: { S: 68, M: 70, L: 72, XL: 74, XXL: 76 },
      },
      {
        key: 'B',
        label: 'Chest',
        description: 'Armpit to armpit across chest',
        valuesCm: { S: 56, M: 58, L: 60, XL: 62, XXL: 64 },
      },
      {
        key: 'C',
        label: 'Sleeve',
        description: 'Shoulder seam down to wrist cuff',
        valuesCm: { S: 62, M: 64, L: 66, XL: 68, XXL: 70 },
      },
      {
        key: 'D',
        label: 'Shoulder',
        description: 'Shoulder seam across upper back',
        valuesCm: { S: 48, M: 50, L: 52, XL: 54, XXL: 56 },
      },
    ],
  },
};

/**
 * Converts centimeters to inches rounded to 1 decimal place.
 */
export const cmToInches = (cm: number): number => {
  return Math.round((cm / 2.54) * 10) / 10;
};

/**
 * Intelligently detects the fit category key based on category name or product title.
 */
export const detectFitCategory = (nameOrCategory?: string): FitCategoryKey => {
  if (!nameOrCategory) return 'oversized';
  const str = nameOrCategory.toLowerCase();

  if (str.includes('hoodie') || str.includes('jacket') || str.includes('outerwear') || str.includes('fleece') || str.includes('sweater')) {
    return 'hoodie';
  }
  if (str.includes('regular') || str.includes('classic') || str.includes('tailored') || str.includes('standard')) {
    return 'regular';
  }
  if (str.includes('oversize') || str.includes('drop') || str.includes('streetwear') || str.includes('heavyweight')) {
    return 'oversized';
  }

  // Default for T-Shirts
  return 'oversized';
};
