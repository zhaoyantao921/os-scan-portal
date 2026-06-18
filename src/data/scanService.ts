import type { MonthlyScan } from '../types';

// 静态 JSON 文件（由爬虫生成或手写 mock 数据）
const modules = import.meta.glob<MonthlyScan>('./*.json', { eager: true });

function createEmptyScan(month: string): MonthlyScan {
  return { month, scannedAt: new Date().toISOString(), updates: [], adaptations: [] };
}

/**
 * 加载指定月份的扫描结果
 * 优先读取本地 JSON 文件，无文件则返回空结果
 *
 * 生产环境可替换为:
 *   const res = await fetch(`/api/scan/${month}`);
 *   return res.json();
 */
export async function fetchMonthlyScan(month: string): Promise<MonthlyScan> {
  await new Promise(r => setTimeout(r, 300 + Math.random() * 500));

  const key = `./${month}.json`;
  const data = modules[key];

  if (!data) {
    return createEmptyScan(month);
  }

  return {
    ...data,
    scannedAt: data.scannedAt || new Date().toISOString(),
  };
}

// 获取当前月份 (YYYY-MM)
export function getCurrentMonth(): string {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
}

// 获取当年所有可用月份（1月 到 当前月）
export function getAvailableMonths(): string[] {
  const now = new Date();
  const year = now.getFullYear();
  const cur = now.getMonth() + 1;

  return Array.from({ length: cur }, (_, i) =>
    `${year}-${String(i + 1).padStart(2, '0')}`
  ).sort().reverse();
}

/**
 * 执行爬虫扫描（仅在有 Node 运行时的场景可用）
 * 在 Vite 开发模式下通过 import.meta.env 判断
 */
export async function triggerScrape(month: string): Promise<MonthlyScan> {
  // 在浏览器端无法直接运行爬虫，回退到 JSON 加载
  if (typeof window !== 'undefined') {
    console.log('[scanService] 浏览器环境，从 JSON 加载');
    return fetchMonthlyScan(month);
  }

  // Node 环境：动态导入爬虫模块
  try {
    const { scrapeAndroid } = await import('../../scripts/scraper-android');
    const { scrapeHarmonyOS } = await import('../../scripts/scraper-harmonyos');
    const { scrapeIOS } = await import('../../scripts/scraper-ios');

    const [android, harmonyos, ios] = await Promise.allSettled([
      scrapeAndroid(month),
      scrapeHarmonyOS(month),
      scrapeIOS(month),
    ]);

    const updates = [
      ...(android.status === 'fulfilled' ? android.value : []),
      ...(harmonyos.status === 'fulfilled' ? harmonyos.value : []),
      ...(ios.status === 'fulfilled' ? ios.value : []),
    ];

    return {
      month,
      scannedAt: new Date().toISOString(),
      updates,
      adaptations: [],
    };
  } catch {
    console.warn('[scanService] 爬虫不可用，回退到静态 JSON');
    return fetchMonthlyScan(month);
  }
}
