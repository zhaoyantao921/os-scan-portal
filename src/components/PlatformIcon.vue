<script setup lang="ts">
defineProps<{ platform: 'android' | 'harmonyos' | 'ios'; size?: number }>();
</script>

<template>
  <svg
    v-if="platform === 'android'"
    :width="size ?? 14"
    :height="size ?? 14"
    viewBox="0 0 24 24"
    fill="none"
    class="platform-icon"
  >
    <path d="M6 9c0-1.1.9-2 2-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2V9z" fill="#3b82f6" opacity=".15"/>
    <path d="M6 9c0-1.1.9-2 2-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2V9z" stroke="#3b82f6" stroke-width="1.2"/>
    <circle cx="9" cy="11" r="1" fill="#3b82f6"/>
    <circle cx="15" cy="11" r="1" fill="#3b82f6"/>
    <path d="M8 5l-2-3" stroke="#3b82f6" stroke-width="1.2" stroke-linecap="round"/>
    <path d="M16 5l2-3" stroke="#3b82f6" stroke-width="1.2" stroke-linecap="round"/>
  </svg>

  <svg
    v-else-if="platform === 'harmonyos'"
    :width="size ?? 14"
    :height="size ?? 14"
    viewBox="0 0 24 24"
    fill="none"
    class="platform-icon"
  >
    <circle cx="12" cy="12" r="8" fill="#10b981" opacity=".15"/>
    <circle cx="12" cy="12" r="8" stroke="#10b981" stroke-width="1.2"/>
    <path d="M9 9h6M9 12h6M9 15h6" stroke="#10b981" stroke-width="1.2" stroke-linecap="round"/>
    <path d="M16 9v6" stroke="#10b981" stroke-width="1.2" stroke-linecap="round"/>
    <path d="M8 9v6" stroke="#10b981" stroke-width="1.2" stroke-linecap="round"/>
  </svg>

  <svg
    v-else-if="platform === 'ios'"
    :width="size ?? 14"
    :height="size ?? 14"
    viewBox="0 0 24 24"
    fill="none"
    class="platform-icon"
  >
    <path d="M16.3 3.5c.5-.6.9-1.5.8-2.3-.8 0-1.7.5-2.2 1.2-.5.6-1 1.5-.8 2.4.9.1 1.7-.4 2.2-1.3z" fill="#8b5cf6"/>
    <path d="M19.5 8.5c-1.1-1.4-2.6-2.2-4-2.2-1.9 0-2.7.9-4 .9-1.4 0-2.4-.9-4-.9-1.7 0-3.6 1.2-4.8 3.2-1.6 2.7-1.3 7.8 1.3 12.1.9 1.5 2.1 3.2 3.6 3.2 1.4 0 2-.9 3.9-.9s2.4.9 3.9.9c1.5 0 2.6-1.6 3.5-3.1.7-1.1.9-1.6 1.4-2.9-3.6-1.4-4.2-6.5-.7-8.5z" fill="#8b5cf6" opacity=".15" stroke="#8b5cf6" stroke-width="1.2"/>
  </svg>
</template>

<style scoped>
.platform-icon {
  display: block;
  flex-shrink: 0;
}
</style>
