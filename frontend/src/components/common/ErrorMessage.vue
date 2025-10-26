<script setup lang="ts">
defineProps<{
  message: string
  type?: 'error' | 'warning' | 'info'
}>()
</script>

<template>
  <div 
    :class="[
      'message',
      `message-${type || 'error'}`
    ]" 
    data-test-id="error-message"
  >
    <span class="icon">{{ type === 'info' ? 'ℹ️' : '⚠️' }}</span>
    <p>{{ message }}</p>
  </div>
</template>

<style scoped>
.message {
  padding: 1rem;
  border-radius: 4px;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin: 1rem 0;
}

.message-error {
  background-color: var(--color-danger-bg);
  color: var(--color-danger);
}

.message-warning {
  background-color: #fff3cd;
  color: #856404;
}

.message-info {
  background-color: #cce5ff;
  color: #004085;
}

.icon {
  font-size: 1.25rem;
}
</style>