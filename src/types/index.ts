export interface PlatformUpdate {
  id: string;
  platform: 'android' | 'harmonyos' | 'ios';
  title: string;
  date: string;
  summary: string;
  items: string[];
  severity: 'critical' | 'major' | 'minor';
}

export interface Adaptation {
  platform: 'android' | 'harmonyos' | 'ios';
  issue: string;
  solution: string;
  impact: 'high' | 'medium' | 'low';
}

export interface MonthlyScan {
  month: string;
  scannedAt: string;
  updates: PlatformUpdate[];
  adaptations: Adaptation[];
}
