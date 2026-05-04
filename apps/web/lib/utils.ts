import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatXP(xp: number): string {
  if (xp >= 1_000_000) return `${(xp / 1_000_000).toFixed(1)}M`;
  if (xp >= 1_000) return `${(xp / 1_000).toFixed(1)}K`;
  return xp.toString();
}

export function getLevelFromXP(xp: number): { level: string; progress: number; nextLevelXP: number } {
  const levels = [
    { level: 'A1', min: 0, max: 500 },
    { level: 'A2', min: 500, max: 1500 },
    { level: 'B1', min: 1500, max: 4000 },
    { level: 'B2', min: 4000, max: 10000 },
    { level: 'C1', min: 10000, max: 25000 },
    { level: 'C2', min: 25000, max: Infinity },
  ];
  const current = levels.find((l) => xp >= l.min && xp < l.max) || levels[0];
  const progress = current.max === Infinity ? 100 : Math.round(((xp - current.min) / (current.max - current.min)) * 100);
  return { level: current.level, progress, nextLevelXP: current.max === Infinity ? xp : current.max };
}

export function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

export function getGreeting(name: string): string {
  const h = new Date().getHours();
  if (h < 12) return `Hyvää huomenta, ${name}!`;
  if (h < 18) return `Hyvää päivää, ${name}!`;
  return `Hyvää iltaa, ${name}!`;
}

export const FINN_LEVEL_COLORS: Record<string, string> = {
  A1: 'from-emerald-400 to-teal-500',
  A2: 'from-blue-400 to-cyan-500',
  B1: 'from-violet-500 to-purple-600',
  B2: 'from-amber-400 to-orange-500',
  C1: 'from-rose-500 to-pink-600',
  C2: 'from-aurora-yellow to-orange-400',
};
