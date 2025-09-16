<script setup lang="ts">
import { RouterView } from 'vue-router'
import Navbar from './components/Navbar.vue'
import StockTicker from './components/StockTicker.vue'
</script>

<template>
  <div class="app">
    <Navbar />
    <StockTicker />

    <main class="main">
      <RouterView />
    </main>
  </div>
</template>

<style scoped>
.app {
  height: 100vh;
  background: linear-gradient(135deg, #000000 0%, #0a0a0a 25%, #1a1a2e 50%, #16213e 75%, #0f0f23 100%);
  color: #e0e6ed;
  overflow: hidden;
}

.main {
  height: calc(100vh - 100px); /* Account for navbar + ticker */
  overflow: hidden;
}
</style>
