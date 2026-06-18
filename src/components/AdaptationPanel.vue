<script setup lang="ts">
import { ref } from 'vue';
import type { Adaptation } from '../types';

defineProps<{
  adaptations: Adaptation[];
}>();

const expandedIndex = ref<number | null>(null);

const platformColors: Record<string, string> = {
  android: '#3b82f6',
  harmonyos: '#10b981',
  ios: '#8b5cf6',
};
</script>

<template>
  <div v-if="adaptations.length" class="adaptation-panel">
    <div class="panel-header">
      <span>⚡ 开发者适配建议</span>
      <span class="count">{{ adaptations.length }} 条</span>
    </div>
    <div class="adaptation-list">
      <div
        v-for="(a, i) in adaptations"
        :key="i"
        class="adaptation-item"
        :class="{ open: expandedIndex === i }"
        @click="expandedIndex = expandedIndex === i ? null : i"
      >
        <div class="adaptation-summary">
          <span
            class="platform-dot"
            :style="{ background: platformColors[a.platform] || '#6b7280' }"
          ></span>
          <span class="issue">{{ a.issue }}</span>
          <span class="impact" :class="a.impact">{{ a.impact }}</span>
        </div>
        <div v-if="expandedIndex === i" class="adaptation-solution">
          <div class="solution-label">改造方案</div>
          <p>{{ a.solution }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.adaptation-panel {
  background: #1a1f2e;
  border: 1px solid #f59e0b20;
  border-radius: 5px;
  overflow: hidden;
}

.panel-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 12px;
  font-size: 10px;
  font-weight: 600;
  color: #f59e0b;
}

.count {
  color: #4a5568;
  font-size: 9px;
  font-weight: 400;
}

.adaptation-list {
  display: flex;
  flex-direction: column;
}

.adaptation-item {
  padding: 6px 12px;
  cursor: pointer;
  border-top: 1px solid #1e2130;
  transition: background 0.15s;
}

.adaptation-item:hover {
  background: #1e2332;
}

.adaptation-summary {
  display: flex;
  align-items: center;
  gap: 6px;
}

.platform-dot {
  display: block;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  flex-shrink: 0;
}

.issue {
  font-size: 10px;
  color: #e2e8f0;
  flex: 1;
}

.impact {
  font-size: 8px;
  padding: 1px 5px;
  border-radius: 3px;
  font-weight: 600;
  text-transform: uppercase;
}

.impact.high {
  color: #ef4444;
  background: #ef444410;
}

.impact.medium {
  color: #f59e0b;
  background: #f59e0b10;
}

.impact.low {
  color: #10b981;
  background: #10b98110;
}

.adaptation-solution {
  background: #11131a;
  border-radius: 4px;
  padding: 8px 10px;
  margin-top: 6px;
}

.solution-label {
  font-size: 9px;
  font-weight: 600;
  color: #f59e0b;
  margin-bottom: 4px;
}

.adaptation-solution p {
  font-size: 10px;
  color: #8b9dc3;
  line-height: 1.5;
  margin: 0;
}
</style>
