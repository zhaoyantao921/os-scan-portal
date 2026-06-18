// 爬虫输出类型 — 与前端 MonthlyScan 结构一致

export interface ScrapedUpdate {
  id: string;
  platform: 'android' | 'harmonyos' | 'ios';
  title: string;
  date: string;           // YYYY-MM-DD
  summary: string;
  items: string[];
  severity: 'critical' | 'major' | 'minor';
}

export interface ScrapedAdaptation {
  platform: 'android' | 'harmonyos' | 'ios';
  issue: string;
  solution: string;
  impact: 'high' | 'medium' | 'low';
}

export interface ScrapeResult {
  month: string;          // YYYY-MM
  scannedAt: string;      // ISO timestamp
  updates: ScrapedUpdate[];
  adaptations: ScrapedAdaptation[];
}

export interface ScraperConfig {
  name: string;
  urls: {
    releaseNotes: string;
    securityBulletin?: string;
  };
  headers?: Record<string, string>;
}
