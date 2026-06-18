<script setup lang="ts">
import { ref } from 'vue';
import type { PlatformUpdate } from '../types';
import PlatformIcon from './PlatformIcon.vue';

defineProps<{ update: PlatformUpdate }>();

const expanded = ref(false);

const platformConfig: Record<string, { label: string; color: string; glow: string; url: string }> = {
  android: { label: 'AND', color: '#3b82f6', glow: 'rgba(59,130,246,0.15)', url: 'developer.android.com' },
  harmonyos: { label: 'HM', color: '#10b981', glow: 'rgba(16,185,129,0.15)', url: 'developer.huawei.com' },
  ios: { label: 'IOS', color: '#8b5cf6', glow: 'rgba(139,92,246,0.15)', url: 'developer.apple.com' },
};
</script>

<template>
  <div
    class="update-card"
    :class="{ expanded }"
    :style="{
      '--card-glow': platformConfig[update.platform].glow,
      '--card-accent': platformConfig[update.platform].color
    }"
  >
    <div class="card-header" @click="expanded = !expanded">
      <div class="platform-badge-row">
        <PlatformIcon :platform="update.platform" :size="24" />
        <span
          class="platform-badge"
          :style="{ background: platformConfig[update.platform].color }"
        >
          {{ platformConfig[update.platform].label }}
        </span>
      </div>
      <div class="card-info">
        <div class="card-title-row">
          <span class="card-title">{{ update.title }}</span>
          <span class="card-date">{{ update.date.slice(5) }}</span>
        </div>
        <p class="card-summary">{{ update.summary }}</p>
      </div>
    </div>
    <div v-if="expanded" class="card-items">
      <ul>
        <li v-for="(item, i) in update.items" :key="i">{{ item }}</li>
      </ul>
      <span class="collapse-hint" @click="expanded = false">▲ 收起</span>
    </div>
    <div v-else class="expand-hint">
      更新项 {{ update.items.length }} 条 — 点击展开
    </div>
    <div class="card-source">
      <span class="source-dot" :style="{ background: platformConfig[update.platform].color }"></span>
      <span class="source-text">来源：{{ platformConfig[update.platform].url }}</span>
    </div>
  </div>
</template>

<style scoped>
.update-card {
  background: #0d1117;
  border: 1px solid #1e2130;
  border-radius: 5px;
  overflow: hidden;
  transition: border-color 0.25s, box-shadow 0.25s;
  position: relative;
}

.update-card:hover {
  border-color: var(--card-accent);
  box-shadow: 0 0 20px var(--card-glow), inset 0 0 20px var(--card-glow);
}

.update-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 2px;
  height: 100%;
  background: var(--card-accent);
  opacity: 0;
  transition: opacity 0.25s;
}

.update-card:hover::before {
  opacity: 0.6;
}

.card-header {
  display: flex;
  gap: 8px;
  align-items: flex-start;
  padding: 12px 14px 6px;
  cursor: pointer;
}

.platform-badge-row {
  display: flex;
  align-items: center;
  gap: 4px;
  flex-shrink: 0;
  margin-top: 1px;
}

.platform-badge {
  color: #fff;
  padding: 2px 7px;
  border-radius: 2px;
  font-size: 16px;
  font-weight: 600;
  letter-spacing: 0.3px;
  box-shadow: 0 0 8px rgba(0, 0, 0, 0.3);
}

.card-info {
  flex: 1;
  min-width: 0;
}

.card-title-row {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
}

.card-title {
  font-size: 16px;
  font-weight: 600;
  color: #e2e8f0;
}

.card-date {
  color: #4a5568;
  font-size: 15px;
  flex-shrink: 0;
  margin-left: 8px;
  font-family: 'SF Mono', 'Cascadia Code', monospace;
}

.card-summary {
  color: #8b9dc3;
  font-size: 16px;
  margin-top: 2px;
  margin-bottom: 0;
}

.expand-hint {
  color: #4a5568;
  font-size: 15px;
  padding: 0 12px 4px 48px;
}

.card-items {
  background: #0a0c14;
  padding: 8px 12px 8px 48px;
}

.card-items ul {
  margin: 0;
  padding: 0 0 0 14px;
  list-style: none;
}

.card-items li {
  font-size: 16px;
  color: #8b9dc3;
  line-height: 1.7;
  position: relative;
}

.card-items li::before {
  content: '›';
  position: absolute;
  left: -12px;
  color: var(--card-accent);
}

.collapse-hint {
  display: block;
  text-align: center;
  color: var(--card-accent);
  font-size: 15px;
  cursor: pointer;
  margin-top: 6px;
}

.card-source {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 6px 14px 8px 48px;
  border-top: 1px solid #151a24;
}

.source-dot {
  width: 3px;
  height: 3px;
  border-radius: 50%;
  flex-shrink: 0;
  opacity: 0.5;
}

.source-text {
  font-size: 16px;
  color: #374151;
}
@media (max-width: 768px) {
  .card-header {
    padding: 10px 10px 4px;
  }
  .platform-badge-row {
    gap: 2px;
  }
  .expand-hint, .card-items {
    padding-left: 30px;
  }
}
</style>
