# OS 月度更新扫描工具 实现计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development

**Goal:** 构建 Vue 3 单页应用，按月展示 Android/HarmonyOS/iOS 系统更新，支持时间轴导航、折叠展开、平台筛选、适配建议。

**Architecture:** Vue 3 + Vite + TypeScript，Composition API + \<script setup\>。Mock JSON 数据驱动，scanService 抽象数据加载层。64px 右侧竖轴时间线 + 时间线 Feed 主区。

**Tech Stack:** Vue 3.4+, Vite 5, TypeScript 5

---

### Task 1: 脚手架 + 类型 + Mock 数据

- Scaffold: `npm create vite@latest . -- --template vue-ts`
- Types: `src/types/index.ts` — MonthlyScan, PlatformUpdate, Adaptation
- Mock: `src/data/2026-06.json` (5 条更新 + 3 条适配), `src/data/2026-05.json` (3 条)
- Service: `src/data/scanService.ts` — fetchMonthlyScan(), getCurrentMonth(), getAvailableMonths()

### Task 2: MonthTimeline 组件

64px 右侧竖轴，圆点连线。三态：已扫描(灰点 hover 蓝)、当前月(蓝点光晕)、未来(极淡不可交互)

### Task 3: UpdateCard 组件

单条更新卡片。折叠态：平台色标 + 标题 + 日期 + 摘要。展开态：完整条目列表 + 收起

### Task 4: UpdateFeed + PlatformFilter

PlatformFilter: Pill 组全部/Android/HarmonyOS/iOS。UpdateFeed: 默认 3 条折叠，展开全部按钮

### Task 5: AdaptationPanel

适配建议卡片。点击行展开显示改造方案，impact 等级色标

### Task 6: AppHeader + App.vue 主组装

Header: 标题 + 月份标签 + 扫描按钮。App.vue: 布局、数据加载、月份切换、URL 同步

### Task 7: 全局样式 + 响应式

深色主题样式、滚动条、移动端时间轴下移

### Task 8: 最终验证

功能 checklist 全项验证 + vue-tsc 类型检查
