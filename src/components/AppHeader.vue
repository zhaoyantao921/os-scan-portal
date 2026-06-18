<script setup lang="ts">
defineProps<{ month: string }>();
defineEmits<{ scan: [] }>();
</script>

<template>
  <header class="app-header">
    <div class="header-accent"></div>
    <div class="header-left">
      <h1 class="header-title">
        <span class="title-icon">◈</span>
        OS 月度更新扫描
      </h1>
      <span class="header-month">{{ month.replace('-', '/') }}</span>
      <span class="header-year-tag">2026</span>
    </div>
    <button class="btn-scan" @click="$emit('scan')">
      <span class="scan-dot"></span>
      🔄 扫描
    </button>
  </header>
</template>

<style scoped>
.app-header {
  background: #0d1117;
  padding: 12px 20px;
  border-bottom: 1px solid #1e2130;
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: relative;
  overflow: hidden;
}

.header-accent {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 1px;
  background: linear-gradient(90deg, transparent, #3b82f6, #06b6d4, #3b82f6, transparent);
  opacity: 0.8;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 8px;
}

.title-icon {
  color: #3b82f6;
  margin-right: 2px;
  text-shadow: 0 0 10px rgba(59, 130, 246, 0.4);
}

.header-title {
  font-size: 14px;
  font-weight: 600;
  color: #e2e8f0;
  margin: 0;
  letter-spacing: 0.5px;
}

.header-month {
  color: #64748b;
  font-size: 10px;
  background: rgba(30, 33, 48, 0.8);
  border: 1px solid #1e2130;
  padding: 2px 8px;
  border-radius: 10px;
  letter-spacing: 0.3px;
}

.header-year-tag {
  font-size: 9px;
  color: #3b82f6;
  border: 1px solid rgba(59, 130, 246, 0.25);
  background: rgba(59, 130, 246, 0.08);
  padding: 1px 7px;
  border-radius: 3px;
  font-weight: 500;
  letter-spacing: 0.5px;
}

.btn-scan {
  display: flex;
  align-items: center;
  gap: 6px;
  background: rgba(6, 182, 212, 0.08);
  color: #22d3ee;
  padding: 5px 14px;
  border-radius: 4px;
  font-size: 11px;
  border: 1px solid rgba(6, 182, 212, 0.2);
  cursor: pointer;
  transition: all 0.25s;
  position: relative;
  overflow: hidden;
}

.btn-scan::after {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(90deg, transparent, rgba(6, 182, 212, 0.08), transparent);
  transform: translateX(-100%);
  animation: scan-pulse 2.5s ease-in-out infinite;
}

@keyframes scan-pulse {
  0%, 100% { transform: translateX(-100%); }
  50% { transform: translateX(100%); }
}

.btn-scan:hover {
  background: rgba(6, 182, 212, 0.15);
  border-color: rgba(6, 182, 212, 0.4);
  box-shadow: 0 0 16px rgba(6, 182, 212, 0.12);
}

.scan-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #22d3ee;
  box-shadow: 0 0 6px #22d3ee;
  animation: dot-pulse 2s ease-in-out infinite;
}

@keyframes dot-pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.3; }
}
</style>
