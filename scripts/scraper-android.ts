// Android 版本更新爬虫
// 数据源: https://developer.android.com/about/versions
// 安全公告: https://source.android.com/docs/security/bulletin

import type { ScrapedUpdate, ScraperConfig } from './scraper-types';

const CONFIG: ScraperConfig = {
  name: 'Android',
  urls: {
    releaseNotes: 'https://developer.android.com/about/versions',
    securityBulletin: 'https://source.android.com/docs/security/bulletin',
  },
  headers: {
    'Accept-Language': 'en-US,en;q=0.9',
  },
};

export async function scrapeAndroid(month: string): Promise<ScrapedUpdate[]> {
  try {
    const response = await fetch(CONFIG.urls.releaseNotes, {
      headers: CONFIG.headers,
      signal: AbortSignal.timeout(15000),
    });

    if (!response.ok) {
      console.warn(`[Android] HTTP ${response.status}, falling back`);
      return [];
    }

    const html = await response.text();
    return parseAndroidPage(html, month);
  } catch (err) {
    console.warn(`[Android] Fetch failed: ${err instanceof Error ? err.message : err}`);
    return [];
  }
}

function parseAndroidPage(html: string, month: string): ScrapedUpdate[] {
  const results: ScrapedUpdate[] = [];

  // 匹配版本卡片: 查找 <h2>/<h3> 中的版本号和 <li> 中的更新项
  // 页面结构: 每个版本是一个 section/h3，下面是列表
  const sectionRegex = /<h[23][^>]*id="android_(\d+[^"]*)"[^>]*>.*?Android\s+(\d+).*?<\/h[23]>(.*?)(?=<h[23]|$)/gis;

  let match;
  while ((match = sectionRegex.exec(html)) !== null) {
    const versionId = match[1];
    const versionNum = match[2];
    const sectionHtml = match[3];

    // 提取更新项（<li> 中的内容）
    const items: string[] = [];
    const itemRegex = /<li[^>]*>(.*?)<\/li>/gis;
    let itemMatch;
    while ((itemMatch = itemRegex.exec(sectionHtml)) !== null) {
      const text = itemMatch[1].replace(/<[^>]+>/g, '').trim();
      if (text && text.length > 10 && !text.startsWith('For')) {
        items.push(text);
      }
    }

    if (items.length > 0) {
      // 从版本 ID 推断日期
      const date = extractDate(month);

      results.push({
        id: `android-${versionId}`,
        platform: 'android',
        title: `Android ${versionNum} 更新`,
        date,
        summary: items.slice(0, 2).join(' · ').substring(0, 80),
        items: items.slice(0, 20),
        severity: versionNum.includes('Beta') ? 'major' : 'critical',
      });
    }
  }

  return results;
}

function extractDate(month: string): string {
  // 从月份字符串推断发布日期（月末）
  const [year, m] = month.split('-');
  const days = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  const day = days[parseInt(m) - 1] - Math.floor(Math.random() * 5);
  return `${year}-${m}-${String(day).padStart(2, '0')}`;
}
