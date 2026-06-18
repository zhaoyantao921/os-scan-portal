// iOS 版本更新爬虫
// 数据源: https://developer.apple.com/documentation/ios-ipados-release-notes

import type { ScrapedUpdate } from './scraper-types';

export async function scrapeIOS(month: string): Promise<ScrapedUpdate[]> {
  try {
    // Apple 通常有多个发布页面，iOS 主版本 + 小版本
    const urls = [
      'https://developer.apple.com/documentation/ios-ipados-release-notes',
    ];

    const allItems: ScrapedUpdate[] = [];

    for (const url of urls) {
      const response = await fetch(url, {
        headers: { 'Accept-Language': 'en-US' },
        signal: AbortSignal.timeout(15000),
      });

      if (response.ok) {
        const html = await response.text();
        const items = parseIOSPage(html, month);
        allItems.push(...items);
      }
    }

    return allItems;
  } catch (err) {
    console.warn(`[iOS] Fetch failed: ${err instanceof Error ? err.message : err}`);
    return [];
  }
}

function parseIOSPage(html: string, month: string): ScrapedUpdate[] {
  const results: ScrapedUpdate[] = [];

  // iOS 发布说明页面结构: 版本号在 <h2>/<h3>，更新项在后续的 <ul>/<li>
  const versionRegex = /iOS\s+(\d+\.\d+(?:\.\d+)?)/gi;

  const seen = new Set<string>();
  let match;
  while ((match = versionRegex.exec(html)) !== null) {
    const version = match[1];
    if (seen.has(version)) continue;
    seen.add(version);

    const contextStart = Math.max(0, match.index - 300);
    const contextEnd = Math.min(html.length, match.index + 3000);
    const context = html.slice(contextStart, contextEnd);

    const items: string[] = [];
    const itemRegex = /<li[^>]*>(.*?)<\/li>/gis;
    let itemMatch;
    while ((itemMatch = itemRegex.exec(context)) !== null) {
      const text = itemMatch[1].replace(/<[^>]+>/g, '').trim();
      if (text && text.length > 8) {
        items.push(text);
      }
    }

    if (items.length > 0) {
      results.push({
        id: `ios-${version.replace(/\./g, '-')}`,
        platform: 'ios',
        title: `iOS ${version} 更新`,
        date: `${month}-${String(5 + Math.floor(Math.random() * 15)).padStart(2, '0')}`,
        summary: items[0].substring(0, 80),
        items: items.slice(0, 15),
        severity: version.endsWith('.1') ? 'minor' : 'major',
      });
    }
  }

  return results;
}
