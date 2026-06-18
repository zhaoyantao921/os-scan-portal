<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import AppHeader from './components/AppHeader.vue';
import MonthTimeline from './components/MonthTimeline.vue';
import UpdateFeed from './components/UpdateFeed.vue';
import DataSourceFooter from './components/DataSourceFooter.vue';
import { fetchMonthlyScan, getCurrentMonth, getAvailableMonths } from './data/scanService';
import type { MonthlyScan } from './types';

const currentMonth = ref(getCurrentMonth());
const availableMonths = ref(getAvailableMonths());
const scanData = ref<MonthlyScan | null>(null);
const loading = ref(false);

async function loadMonth(month: string) {
  loading.value = true;
  try {
    scanData.value = await fetchMonthlyScan(month);
    currentMonth.value = month;
  } catch {
    scanData.value = null;
  } finally {
    loading.value = false;
  }
}

async function handleScan() { await loadMonth(currentMonth.value); }
function handleMonthSelect(month: string) { loadMonth(month); }

const params = new URLSearchParams(window.location.search);
const urlMonth = params.get('month') || getCurrentMonth();
onMounted(() => loadMonth(urlMonth));
watch(currentMonth, (m) => {
  const url = new URL(window.location.href);
  url.searchParams.set('month', m);
  window.history.replaceState({}, '', url);
});
</script>

<template>
  <div class="app">
    <AppHeader :month="currentMonth" @scan="handleScan" />
    <div class="app-body">
      <main class="content">
        <div v-if="loading" class="scanning-overlay">
          <span class="spinner"></span>
          <span>正在扫描 {{ currentMonth }} 更新…</span>
        </div>
        <template v-if="!loading">
          <UpdateFeed
            v-if="scanData && scanData.updates.length > 0"
            :updates="scanData.updates"
            :adaptations="scanData.adaptations"
          />
          <div v-else class="empty">
            <div class="empty-icon">📭</div>
            <p>{{ scanData ? currentMonth + ' 暂无扫描数据' : '暂无扫描数据' }}</p>
            <p class="empty-hint">选择其他月份或点击「扫描」获取最新数据</p>
          </div>
          <DataSourceFooter v-if="scanData" :scanData="scanData" />
        </template>
      </main>
      <MonthTimeline :currentMonth="currentMonth" :availableMonths="availableMonths" @select="handleMonthSelect" />
    </div>
  </div>
</template>

<style scoped>
.app { height: 100vh; display: flex; flex-direction: column; background: #0a0c14; color: #e2e8f0; }
.app-body { flex: 1; display: flex; overflow: hidden; }
.content { flex: 1; padding: 16px 22px; overflow-y: auto; position: relative; }
.scanning-overlay {
  position: absolute; inset: 0; background: rgba(10,12,20,0.85); display: flex;
  flex-direction: column; align-items: center; justify-content: center;
  gap: 12px; font-size: 16px; color: #8b9dc3; z-index: 10;
}
.spinner { width: 20px; height: 20px; border: 2px solid #1e2130; border-top-color: #3b82f6; border-radius: 50%; animation: spin 0.6s linear infinite; }
@keyframes spin { to { transform: rotate(360deg); } }
.empty { text-align: center; padding: 60px 40px; color: #4a5568; font-size: 15px; }
.empty-icon { font-size: 40px; margin-bottom: 12px; }
.empty p { margin: 0; color: #6b7280; }
.empty .empty-hint { font-size: 16px; color: #4a5568; margin-top: 6px; }
@media (max-width: 768px) {
  .scanning-overlay {
    font-size: 13px;
  }
  .empty {
    padding: 40px 20px;
  }
}
</style>
