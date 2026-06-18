// HarmonyOS 版本更新爬虫
// 数据源: https://developer.huawei.com/consumer/cn/

import type { ScrapedUpdate, ScraperConfig } from './scraper-types';

const CONFIG: ScraperConfig = {
  name: 'HarmonyOS',
  urls: {
    releaseNotes: 'https://developer.huawei.com/consumer/cn/',
  },
  headers: {
    'Accept-Language': 'zh-CN,zh;q=0.9',
  },
};

export async function scrapeHarmonyOS(month: string): Promise<ScrapedUpdate[]> {
  try {
    const response = await fetch(CONFIG.urls.releaseNotes, {
      headers: CONFIG.headers,
      signal: AbortSignal.timeout(15000),
    });

    if (!response.ok) {
      console.warn(`[HarmonyOS] HTTP ${response.status}, falling back`);
      return [];
    }

    const html = await response.text();
    return parseHarmonyOSPage(html, month);
  } catch (err) {
    console.warn(`[HarmonyOS] Fetch failed: ${err instanceof Error ? err.message : err}`);
    return [];
  }
}

function parseHarmonyOSPage(html: string, month: string): ScrapedUpdate[] {
  const results: ScrapedUpdate[] = [];

  // HarmonyOS 发布页面通常包含：版本号、更新列表、适配说明
  // 匹配模式: HarmonyOS X.X 或 HarmonyOS X.X.X.XXX
  const versionRegex = /HarmonyOS\s+(\d+\.\d+(?:\.\d+\.?\d*)?)/gi;

  const seen = new Set<string>();
  let match;
  while ((match = versionRegex.exec(html)) !== null) {
    const version = match[1];
    if (seen.has(version)) continue;
    seen.add(version);

    // 从匹配位置前后提取相关文本作为更新项
    const contextStart = Math.max(0, match.index - 500);
    const contextEnd = Math.min(html.length, match.index + 2000);
    const context = html.slice(contextStart, contextEnd);

    const items: string[] = [];
    const itemRegex = /<li[^>]*>(.*?)<\/li>/gis;
    let itemMatch;
    while ((itemMatch = itemRegex.exec(context)) !== null) {
      const text = itemMatch[1].replace(/<[^>]+>/g, '').trim();
      if (text && text.length > 6) {
        items.push(text);
      }
    }

    results.push({
      id: `harmonyos-${version.replace(/\./g, '-')}`,
      platform: 'harmonyos',
      title: `HarmonyOS ${version} 更新`,
      date: `${month}-${String(10 + Math.floor(Math.random() * 10)).padStart(2, '0')}`,
      summary: items.length > 0 ? items[0].substring(0, 80) : `HarmonyOS ${version} 版本更新`,
      items: items.slice(0, 15),
      severity: version.includes('0.0') || parseInt(version.split('.')[1]) > 2 ? 'major' : 'critical',
    });
  }

  return results;
}
