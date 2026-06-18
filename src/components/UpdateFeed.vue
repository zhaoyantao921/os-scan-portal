<script setup lang="ts">
import { ref, computed } from 'vue';
import type { PlatformUpdate, Adaptation } from '../types';
import UpdateCard from './UpdateCard.vue';
import PlatformFilter from './PlatformFilter.vue';
import AdaptationPanel from './AdaptationPanel.vue';

const props = defineProps<{
  updates: PlatformUpdate[];
  adaptations: Adaptation[];
}>();

const platformFilter = ref('all');
const showAll = ref(false);

const filteredUpdates = computed(() => {
  if (platformFilter.value === 'all') return props.updates;
  return props.updates.filter((u) => u.platform === platformFilter.value);
});

const displayedUpdates = computed(() =>
  showAll.value ? filteredUpdates.value : filteredUpdates.value.slice(0, 3)
);

const hiddenCount = computed(() => Math.max(0, filteredUpdates.value.length - 3));
</script>

<template>
  <div class="feed-area">
    <PlatformFilter v-model="platformFilter" />
    <div class="feed-list">
      <UpdateCard
        v-for="update in displayedUpdates"
        :key="update.id"
        :update="update"
      />
    </div>
    <div v-if="!showAll && hiddenCount > 0" class="show-more">
      <button @click="showAll = true">展开全部 {{ filteredUpdates.length }} 条 →</button>
    </div>
    <AdaptationPanel :adaptations="adaptations" />
  </div>
</template>

<style scoped>
.feed-area {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.feed-list {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.show-more {
  text-align: center;
}

.show-more button {
  background: none;
  border: none;
  color: #3b82f6;
  font-size: 16px;
  cursor: pointer;
}

.show-more button:hover {
  text-decoration: underline;
}
</style>
