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

const months = computed<MonthEntry[]>(() => {
  const [year] = props.currentMonth.split('-');
  const currentNum = parseInt(props.currentMonth.split('-')[1], 10);
  const available = new Set(props.availableMonths);

  return Array.from({ length: 12 }, (_, i) => {
    const num = i + 1;
    const padded = String(num).padStart(2, '0');
    const key = `${year}-${padded}`;
    const isCurrent = num === currentNum;
    const isFuture = num > currentNum;
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

// Gradient on the connecting line: fades to transparent after the current month
const lineGradient = computed(() => {
  const currentNum = parseInt(props.currentMonth.split('-')[1], 10);
  const stopPercent = (currentNum / 12) * 100;
  return `linear-gradient(to bottom, #1e2130 ${stopPercent}%, transparent ${stopPercent}%)`;
});
</script>

<template>
  <nav class="timeline">
    <div class="timeline-track">
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
  background: #11131a;
  border-left: 1px solid #1e2130;
  overflow-y: auto;
  padding: 8px 0;
}

.timeline-track {
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  gap: 0;
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
  opacity: 0.4;
}

.timeline-dot .dot {
  display: block;
  border-radius: 50%;
  transition: background-color 0.2s, box-shadow 0.2s;
  flex-shrink: 0;
}

/* Scanned (past months with data) */
.timeline-dot.scanned .dot {
  width: 8px;
  height: 8px;
  background: #4a5568;
}

.timeline-dot.scanned:hover .dot {
  background: #3b82f6;
}

.timeline-dot.scanned .label {
  font-size: 10px;
  color: #4a5568;
  transition: color 0.2s;
}

.timeline-dot.scanned:hover .label {
  color: #93c5fd;
}

/* Current month */
.timeline-dot.current .dot {
  width: 10px;
  height: 10px;
  background: #3b82f6;
  box-shadow: 0 0 8px rgba(59, 130, 246, 0.6);
}

.timeline-dot.current .label {
  font-size: 11px;
  font-weight: 600;
  color: #3b82f6;
}

/* Future months */
.timeline-dot.future .dot {
  width: 6px;
  height: 6px;
  background: #161822;
  border: 1px solid #1a1f2e;
}

.timeline-dot.future .label {
  font-size: 9px;
  color: #1c2130;
}
</style>
