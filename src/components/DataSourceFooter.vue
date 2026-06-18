<script setup lang="ts">
import type { MonthlyScan } from '../types';

defineProps<{ scanData: MonthlyScan | null }>();

const sources = [
  { platform: 'Android', url: 'developer.android.com', color: '#3b82f6' },
  { platform: 'HarmonyOS', url: 'developer.huawei.com', color: '#10b981' },
  { platform: 'iOS', url: 'developer.apple.com', color: '#8b5cf6' },
];

function formatTime(iso: string | undefined): string {
  if (!iso) return '—';
  const d = new Date(iso);
  return d.toLocaleString('zh-CN', {
    month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit'
  });
}
</script>

<template>
  <footer class="data-source" v-if="scanData">
    <div class="source-divider"></div>
    <div class="source-body">
      <div class="source-row">
        <span class="source-label">数据来源</span>
        <div class="source-links">
          <a
            v-for="s in sources"
            :key="s.platform"
            class="source-link"
            :style="{ '--src-color': s.color }"
            :href="'https://' + s.url"
            target="_blank"
            rel="noopener"
          >
            <span class="source-dot" :style="{ background: s.color }"></span>
            {{ s.platform }} · {{ s.url }}
          </a>
        </div>
      </div>
      <div class="source-row source-meta">
        <span>扫描时间：{{ formatTime(scanData.scannedAt) }}</span>
        <span class="source-note">自动抓取官方更新日志 · 每日更新</span>
      </div>
    </div>
  </footer>
</template>

<style scoped>
.data-source {
  margin-top: 14px;
}

.source-divider {
  height: 1px;
  background: linear-gradient(90deg, transparent, #1e2130, transparent);
  margin-bottom: 10px;
}

.source-body {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 0 2px;
}

.source-row {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
}

.source-label {
  font-size: 15px;
  color: #4a5568;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  flex-shrink: 0;
}

.source-links {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.source-link {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 15px;
  color: #64748b;
  text-decoration: none;
  transition: color 0.2s;
  padding: 1px 0;
}

.source-link:hover {
  color: var(--src-color);
}

.source-dot {
  width: 4px;
  height: 4px;
  border-radius: 50%;
  flex-shrink: 0;
}

.source-meta {
  font-size: 15px;
  color: #4a5568;
}

.source-note {
  color: #374151;
}

.source-note::before {
  content: '·';
  margin: 0 6px;
  color: #2d3748;
}
@media (max-width: 768px) {
  .source-body {
    gap: 6px;
  }
  .source-row {
    flex-direction: column;
    align-items: flex-start;
    gap: 4px;
  }
  .source-links {
    flex-direction: column;
    gap: 2px;
  }
}
</style>
