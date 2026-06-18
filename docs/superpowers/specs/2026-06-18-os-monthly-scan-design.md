## 设计文档：OS 月度更新扫描工具

**受众**：内部开发团队自查工具
**数据方案**：Mock 数据 + 预留爬虫接口层
**技术栈**：Vue 3 + Vite + TypeScript

---

### 整体架构

Vue 3 + Vite SPA
├── App Shell（顶部导航栏：标题 + 当前月份 + 「扫描」按钮）
├── 主内容区
│   ├── 平台筛选 Pill 条（全部 / Android / HarmonyOS / iOS）
│   ├── 时间线 Feed 列表（按日期倒序混排，默认折叠前 3 条）
│   ├── 「展开全部」 按钮
│   └── 开发者适配建议卡片（附带改造方案详情）
└── 右侧竖轴时间线（64px 宽，1-12 月圆点连线）

### 组件树

App
├── Header（标题 + 月份标签 + 扫描按钮）
├── MainLayout
│   ├── ContentArea
│   │   ├── PlatformFilter（Pill 组）
│   │   ├── UpdateFeed
│   │   │   └── UpdateCard[]（每条更新卡片）
│   │   ├── ExpandAllButton
│   │   └── AdaptationPanel
│   └── Timeline（右侧竖轴，64px）
│       └── MonthDot[]（12 个月节点）

### 数据模型

interface MonthlyScan {
  month: string;           // "2026-06"
  scannedAt: string;       // ISO timestamp
  updates: PlatformUpdate[];
  adaptations: Adaptation[];
}

interface PlatformUpdate {
  id: string;
  platform: "android" | "harmonyos" | "ios";
  title: string;
  date: string;            // "2026-06-15"
  summary: string;         // 一行摘要
  items: string[];         // 完整更新条目
  severity: "critical" | "major" | "minor";
}

interface Adaptation {
  platform: "android" | "harmonyos" | "ios";
  issue: string;           // 需要适配的变更
  solution: string;        // 改造方案详情
  impact: "high" | "medium" | "low";
}

### 数据流

- 初始化：加载当前月份的 MonthlyScan 数据（从 mock JSON）
- 选择已过月份 → 切换到该月数据，自动触发「扫描」（当前阶段重新加载 mock 数据）
- 「扫描」按钮 → 重新加载当前月份数据，刷新 Feed
- 平台筛选 → 过滤 Feed 列表，不影响时间轴状态
- 展开/折叠 → 本地 UI 状态，不影响数据

### 核心交互

**时间轴（右侧竖轴，64px）**
- 圆点 + 竖线连线布局
- 已过月份：灰色圆点，hover 变蓝 + tooltip「点击查看扫描结果」，可点击切换
- 当前月份：蓝色圆点 + 光晕 + 文字高亮
- 未来月份：极淡圆点，不可交互，视觉上几乎消失
- 连线在「当前月 → 下一个月」之间渐变淡出

**Feed 列表**
- 默认展示最多 3 条最新更新，其余折叠
- 「展开全部 N 条 →」按钮展开所有条目
- 每条卡片：平台色标（AND/HM/IOS）+ 标题 + 日期 + 一行摘要
- 展开态显示完整更新条目列表，底部「▲ 收起」

**平台筛选**
- Pill 组，单选（默认「全部」）
- 选择后仅显示对应平台更新，适配建议同步过滤

**开发者适配建议**
- 卡片位于 Feed 列表底部
- 列出本月需要关注的适配项（平台 + 问题 + 影响等级）
- 每条附带「查看改造方案」入口，展开显示详细方案

### 视觉设计

- 深色主题（#0f1117 底色），工作工具风格
- 平台色标：Android 蓝 #3b82f6，HarmonyOS 绿 #10b981，iOS 紫 #8b5cf6
- 适配建议用暖黄 #f59e0b 标识
- 默认无大卡片容器，Feed 用细边框 + 暗底卡片

### Mock 数据结构

src/data/ 下按月份存储 JSON：

src/data/
├── 2026-01.json
├── ...
├── 2026-06.json
└── scanService.ts    // 统一加载接口，后续替换为爬虫

scanService.ts 导出：

export async function fetchMonthlyScan(month: string): Promise<MonthlyScan>

当前实现从本地 JSON 读取；未来替换为调用爬虫后端。

### 非功能需求

- 单页 Vite dev server 即可运行
- 桌面优先，响应式（移动端时间轴移至底部）
- 月份选择通过 URL query param 保持（?month=2026-06）
