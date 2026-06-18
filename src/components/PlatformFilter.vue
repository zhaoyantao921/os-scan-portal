<script setup lang="ts">
defineProps<{ modelValue: string }>();
defineEmits<{ 'update:modelValue': [value: string] }>();
const filters = [
  { key: 'all', label: '全部' },
  { key: 'android', label: 'Android' },
  { key: 'harmonyos', label: 'HarmonyOS' },
  { key: 'ios', label: 'iOS' },
];
</script>
<template>
  <div class="filter-bar">
    <button
      v-for="f in filters"
      :key="f.key"
      class="filter-pill"
      :class="{ active: modelValue === f.key }"
      @click="$emit('update:modelValue', f.key)"
    >
      {{ f.label }}
    </button>
  </div>
</template>

<style scoped>
.filter-bar {
  display: flex;
  gap: 5px;
}

.filter-pill {
  padding: 2px 10px;
  border-radius: 10px;
  font-size: 10px;
  border: none;
  cursor: pointer;
  background: #1e2130;
  color: #6b7280;
  transition: background 0.15s, color 0.15s;
}

.filter-pill:hover {
  background: #252b3b;
  color: #8b9dc3;
}

.filter-pill.active {
  background: #3b82f6;
  color: #fff;
}
</style>
