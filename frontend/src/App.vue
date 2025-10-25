<script setup>
import { RouterView } from 'vue-router'
</script>

<template>
  <div class="app">
    <header class="app-header">
      <div class="header-content">
        <h1>Region Management System</h1>
        <div class="environment-badge">
          Development
        </div>
      </div>
    </header>
    <main class="app-main">
      <RouterView />
    </main>
    <footer class="app-footer">
      <p>&copy; 2025 Region Management System. All rights reserved.</p>
    </footer>
  </div>
</template>

<style>
.app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.app-header {
  background: var(--color-background);
  border-bottom: 1px solid var(--color-border);
  padding: 1.5rem 0;
  margin-bottom: 2rem;
}

.header-content {
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header-content h1 {
  font-size: 1.75rem;
  color: var(--color-heading);
  font-weight: 600;
  margin: 0;
}

.environment-badge {
  background-color: var(--color-primary);
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 999px;
  font-size: 0.875rem;
  font-weight: 500;
}

.app-main {
  flex: 1;
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 2rem;
  width: 100%;
}

.app-footer {
  background: var(--color-background);
  border-top: 1px solid var(--color-border);
  padding: 1.5rem 0;
  margin-top: 2rem;
  text-align: center;
  font-size: 0.875rem;
  color: var(--color-text-light);
}
</style>
