// 爬虫统一入口
// 用法: npx tsx scripts/scraper-run.ts [YYYY-MM]
// 输出: src/data/YYYY-MM.json

import { writeFileSync, existsSync, mkdirSync } from 'fs';
import { join } from 'path';
import type { ScrapeResult, ScrapedAdaptation } from './scraper-types';
import { scrapeAndroid } from './scraper-android';
import { scrapeHarmonyOS } from './scraper-harmonyos';
import { scrapeIOS } from './scraper-ios';

async function main() {
  // 默认扫描当月
  const now = new Date();
  const month = process.argv[2] ||
    `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;

  console.log(`\n🔍 开始扫描 ${month} 操作系统更新…\n`);

  // 并行抓取三个平台
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

  // 生成适配建议（基于更新内容自动推断）
  const adaptations = generateAdaptations(updates);

  const result: ScrapeResult = {
    month,
    scannedAt: new Date().toISOString(),
    updates,
    adaptations,
  };

  // 写入 JSON 文件
  const dataDir = join(process.cwd(), 'src', 'data');
  if (!existsSync(dataDir)) mkdirSync(dataDir, { recursive: true });

  const outputPath = join(dataDir, `${month}.json`);
  writeFileSync(outputPath, JSON.stringify(result, null, 2), 'utf-8');

  // 报告
  console.log('━'.repeat(50));
  console.log(`  Android:    ${countPlatform(updates, 'android')} 条`);
  console.log(`  HarmonyOS:  ${countPlatform(updates, 'harmonyos')} 条`);
  console.log(`  iOS:        ${countPlatform(updates, 'ios')} 条`);
  console.log(`  适配建议:   ${adaptations.length} 条`);
  console.log(`  总计:       ${updates.length} 条更新`);
  console.log(`  → ${outputPath}`);
  console.log('━'.repeat(50));

  if (updates.length === 0) {
    console.log('\n⚠️  未抓取到更新数据（可能网络受限或页面结构变动）');
    console.log('   请检查网络连接或更新爬虫解析逻辑\n');
  }
}

function countPlatform(updates: ScrapeResult['updates'], platform: string): number {
  return updates.filter(u => u.platform === platform).length;
}

function generateAdaptations(
  updates: ScrapeResult['updates']
): ScrapedAdaptation[] {
  const adaptations: ScrapedAdaptation[] = [];

  for (const u of updates) {
    if (u.severity === 'critical') {
      adaptations.push({
        platform: u.platform,
        issue: `${u.title} 包含破坏性变更`,
        solution: `检查 ${u.title} 的完整发布说明，评估对现有代码的影响。优先处理 API 废弃和权限变更项。`,
        impact: 'high',
      });
    }

    // API 变更检测
    const apiKeywords = ['API', 'deprecated', '废弃', '新增接口', '权限'];
    const hasAPIChange = u.items.some(item =>
      apiKeywords.some(kw => item.includes(kw))
    );
    if (hasAPIChange) {
      adaptations.push({
        platform: u.platform,
        issue: `${u.platform.toUpperCase()} 平台 API 变更`,
        solution: `更新项目中受影响的 API 调用，运行 lint/test 确保兼容性。`,
        impact: 'medium',
      });
    }
  }

  return adaptations.slice(0, 10);
}

main().catch(err => {
  console.error('❌ 扫描失败:', err);
  process.exit(1);
});
