import type { MonthlyScan } from '../types';

const modules = import.meta.glob<MonthlyScan>('./*.json', { eager: true });

export async function fetchMonthlyScan(month: string): Promise<MonthlyScan> {
  await new Promise(r => setTimeout(r, 800 + Math.random() * 1200));
  const key = `./${month}.json`;
  const data = modules[key];
  if (!data) {
    throw new Error(`No scan data found for month ${month}`);
  }
  return { ...data, scannedAt: new Date().toISOString() };
}

export function getCurrentMonth(): string {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
}

export function getAvailableMonths(): string[] {
  return Object.keys(modules)
    .map(k => k.replace('./', '').replace('.json', ''))
    .sort()
    .reverse();
}
