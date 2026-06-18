<script setup lang="ts">
import { ref } from 'vue';
import type { PlatformUpdate } from '../types';

const props = defineProps<{
  update: PlatformUpdate;
}>();

const expanded = ref(false);

const platformConfig = {
  android: { label: 'Android', color: '#3b82f6' },
  harmonyos: { label: 'HarmonyOS', color: '#10b981' },
  ios: { label: 'iOS', color: '#8b5cf6' },
};
</script>

<template>
  <div class="update-card" :class="{ expanded }">
    <div class="card-header" @click="expanded = !expanded">
      <span class="platform-badge" :style="{ background: platformConfig[update.platform].color }">
        {{ platformConfig[update.platform].label }}
      </span>
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
  </div>
</template>

<style scoped>
.update-card {
  background: #161822;
  border: 1px solid #1e2130;
  border-radius: 5px;
  transition: border-color 0.15s;
}

.update-card:hover {
  border-color: #2d3748;
}

.card-header {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  padding: 12px;
  cursor: pointer;
}

.platform-badge {
  flex-shrink: 0;
  padding: 1px 5px;
  border-radius: 2px;
  font-size: 8px;
  font-weight: 600;
  color: #fff;
  line-height: 1.6;
}

.card-info {
  flex: 1;
  min-width: 0;
}

.card-title-row {
  display: flex;
  align-items: baseline;
  gap: 8px;
}

.card-title {
  font-size: 12px;
  font-weight: 600;
  color: #e2e8f0;
}

.card-date {
  color: #4a5568;
  font-size: 9px;
  flex-shrink: 0;
}

.card-summary {
  color: #8b9dc3;
  font-size: 10px;
  margin: 4px 0 0;
}

.expand-hint {
  color: #4a5568;
  font-size: 9px;
  padding: 0 12px 8px 32px;
}

.card-items {
  background: #11131a;
  border-radius: 0 0 5px 5px;
  padding: 12px;
}

.card-items ul {
  margin: 0;
  padding-left: 16px;
  list-style: disc;
}

.card-items li {
  font-size: 10px;
  color: #8b9dc3;
  line-height: 1.7;
}

.collapse-hint {
  display: block;
  text-align: center;
  color: #3b82f6;
  font-size: 9px;
  cursor: pointer;
  margin-top: 8px;
}
</style>
