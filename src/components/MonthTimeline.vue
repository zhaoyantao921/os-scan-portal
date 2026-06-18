<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{
  currentMonth: string;
  availableMonths: string[];
}>();

const emit = defineEmits<{
  select: [month: string];
}>();

interface MonthEntry {
  key: string;
  label: string;
  isScanned: boolean;
  isCurrent: boolean;
  isFuture: boolean;
}

const realNow = new Date();
const realYear = realNow.getFullYear();
const realMonth = realNow.getMonth() + 1;

const months = computed<MonthEntry[]>(() => {
  const [year] = props.currentMonth.split('-');
  const selectedNum = parseInt(props.currentMonth.split("-")[1] ?? "1", 10);
  const available = new Set(props.availableMonths);

  return Array.from({ length: 12 }, (_, i) => {
    const num = i + 1;
    const padded = String(num).padStart(2, '0');
    const key = `${year}-${padded}`;
    const isCurrent = num === selectedNum;
    const isFuture = num > realMonth;
    const isScanned = available.has(key);

    return {
      key,
      label: `${num}月`,
      isScanned,
      isCurrent,
      isFuture,
    };
  });
});

const lineGradient = computed(() => {
  const stopPercent = (realMonth / 12) * 100;
  return `linear-gradient(to bottom, #1e2130 ${stopPercent}%, transparent ${stopPercent}%)`;
});
</script>

<template>
  <nav class="timeline">
    <div class="timeline-accent"></div>
    <div class="timeline-track">
        <div class="timeline-year">{{ realYear }}</div>
      <div class="timeline-line" :style="{ background: lineGradient }"></div>
      <button
        v-for="m in months"
        :key="m.key"
        class="timeline-dot"
        :class="{
          scanned: m.isScanned && !m.isCurrent,
          current: m.isCurrent,
          future: m.isFuture,
        }"
        :disabled="m.isFuture"
        :title="m.isScanned && !m.isCurrent ? '点击查看扫描结果' : ''"
        @click="!m.isFuture && emit('select', m.key)"
      >
        <span class="dot"></span>
        <span class="label">{{ m.label }}</span>
      </button>
    </div>
  </nav>
</template>

<style scoped>
.timeline {
  width: 64px;
  flex-shrink: 0;
  background: #0a0e14;
  border-left: 1px solid #1e2130;
  overflow-y: auto;
  padding: 8px 0;
  position: relative;
}

.timeline-accent {
  position: absolute;
  top: 0;
  left: -1px;
  width: 1px;
  height: 60px;
  background: linear-gradient(to bottom, #3b82f6, transparent);
  opacity: 0.5;
}

.timeline-track {
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  gap: 0;
}

.timeline-year {
  font-size: 9px;
  color: #3b82f6;
  font-weight: 500;
  margin-bottom: 6px;
  letter-spacing: 0.5px;
  opacity: 0.6;
}

.timeline-line {
  position: absolute;
  top: 12px;
  bottom: 12px;
  left: 50%;
  width: 1px;
  transform: translateX(-50%);
  pointer-events: none;
}

.timeline-dot {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  background: none;
  border: none;
  cursor: pointer;
  padding: 8px 4px;
  width: 100%;
  position: relative;
  z-index: 1;
  transition: opacity 0.2s;
  -webkit-appearance: none;
  appearance: none;
}

.timeline-dot:disabled {
  cursor: default;
  opacity: 0.35;
}

.timeline-dot .dot {
  display: block;
  border-radius: 50%;
  transition: background-color 0.2s, box-shadow 0.3s;
  flex-shrink: 0;
}

.timeline-dot.scanned .dot {
  width: 7px;
  height: 7px;
  background: rgba(148, 163, 184, 0.7);
  border: 1px solid rgba(148, 163, 184, 0.3);
}

.timeline-dot.scanned:hover .dot {
  background: #3b82f6;
  border-color: #3b82f6;
  box-shadow: 0 0 10px rgba(59, 130, 246, 0.5);
}

.timeline-dot.scanned .label {
  font-size: 10px;
  color: #64748b;
  transition: color 0.2s;
}

.timeline-dot.scanned:hover .label {
  color: #60a5fa;
}

.timeline-dot.current .dot {
  width: 10px;
  height: 10px;
  background: #3b82f6;
  border: 1px solid rgba(59, 130, 246, 0.5);
  box-shadow: 0 0 12px rgba(59, 130, 246, 0.6), 0 0 24px rgba(59, 130, 246, 0.2);
  animation: glow-pulse 3s ease-in-out infinite;
}

@keyframes glow-pulse {
  0%, 100% { box-shadow: 0 0 12px rgba(59, 130, 246, 0.6), 0 0 24px rgba(59, 130, 246, 0.2); }
  50% { box-shadow: 0 0 18px rgba(59, 130, 246, 0.8), 0 0 32px rgba(59, 130, 246, 0.3); }
}

.timeline-dot.current .label {
  font-size: 11px;
  font-weight: 600;
  color: #60a5fa;
  text-shadow: 0 0 10px rgba(96, 165, 250, 0.3);
}

.timeline-dot.future .dot {
  width: 5px;
  height: 5px;
  background: #0d1117;
  border: 1px solid #151a24;
}

.timeline-dot.future .label {
  font-size: 9px;
  color: #151a24;
}
</style>
