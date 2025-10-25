<script setup>
import { RouterView } from 'vue-router'
</script>

<template>
  <div class="app">
    <header>
      <h1>Region Management System</h1>
    </header>
    <main>
      <RouterView />
    </main>
  </div>
</template>

<style>
.app {
  max-width: 1280px;
  margin: 0 auto;
  padding: 2rem;
}

header {
  margin-bottom: 2rem;
  text-align: center;
}

header h1 {
  font-size: 2rem;
  color: var(--color-heading);
}

main {
  background: var(--color-background-soft);
  border-radius: 8px;
  padding: 2rem;
}
</style>
