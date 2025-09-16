<template>
  <div class="scenario-lab-view">
    <div class="container">
      <h1 class="page-title">Scenario Lab</h1>
      <p class="page-subtitle">Simulate market conditions and test your strategies</p>

      <div class="scenario-controls">
        <div class="control-group">
          <label class="control-label">Market Shock Type</label>
          <select v-model="selectedShock" class="control-select">
            <option value="crash">Market Crash (-20%)</option>
            <option value="correction">Market Correction (-10%)</option>
            <option value="volatility">High Volatility</option>
            <option value="recovery">Recovery Rally (+15%)</option>
          </select>
        </div>

        <div class="control-group">
          <label class="control-label">Duration (Days)</label>
          <input
            v-model.number="duration"
            type="number"
            min="1"
            max="30"
            class="control-input"
          >
        </div>

        <button @click="runSimulation" class="btn-primary">
          Run Simulation
        </button>
      </div>

      <div class="simulation-results" v-if="simulationData">
        <h3>Simulation Results</h3>
        <div class="results-grid">
          <div class="result-card">
            <span class="result-label">Initial Price</span>
            <span class="result-value">${{ simulationData.initialPrice.toFixed(2) }}</span>
          </div>
          <div class="result-card">
            <span class="result-label">Final Price</span>
            <span class="result-value">${{ simulationData.finalPrice.toFixed(2) }}</span>
          </div>
          <div class="result-card">
            <span class="result-label">Total Change</span>
            <span class="result-value" :class="{ 'positive': simulationData.totalChange >= 0, 'negative': simulationData.totalChange < 0 }">
              {{ simulationData.totalChange >= 0 ? '+' : '' }}{{ simulationData.totalChange.toFixed(2) }}%
            </span>
          </div>
          <div class="result-card">
            <span class="result-label">Max Drawdown</span>
            <span class="result-value negative">{{ simulationData.maxDrawdown.toFixed(2) }}%</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const selectedShock = ref('correction')
const duration = ref(5)
const simulationData = ref(null)

const runSimulation = () => {
  // Generate mock simulation data
  const basePrice = 100
  let finalPrice = basePrice

  switch (selectedShock.value) {
    case 'crash':
      finalPrice = basePrice * 0.8
      break
    case 'correction':
      finalPrice = basePrice * 0.9
      break
    case 'volatility':
      finalPrice = basePrice * (0.95 + Math.random() * 0.1)
      break
    case 'recovery':
      finalPrice = basePrice * 1.15
      break
  }

  const totalChange = ((finalPrice - basePrice) / basePrice) * 100
  const maxDrawdown = Math.min(0, totalChange * 0.8)

  simulationData.value = {
    initialPrice: basePrice,
    finalPrice: finalPrice,
    totalChange: totalChange,
    maxDrawdown: maxDrawdown
  }
}
</script>

<style scoped>
.scenario-lab-view {
  min-height: 100vh;
  background:
    radial-gradient(circle at 20% 80%, rgba(0, 50, 100, 0.1) 0%, transparent 50%),
    radial-gradient(circle at 80% 20%, rgba(0, 100, 200, 0.1) 0%, transparent 50%),
    linear-gradient(135deg, #000000 0%, #0a0a0a 25%, #1a1a2e 50%, #16213e 75%, #0f0f23 100%);
  color: #e0e6ed;
  padding: 2rem 0;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
}

.page-title {
  font-family: 'Source Sans Pro', sans-serif;
  font-size: 2.5rem;
  font-weight: 700;
  text-align: center;
  margin-bottom: 0.5rem;
  background: linear-gradient(135deg, #e0e6ed 0%, #00d4ff 50%, #ffffff 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.page-subtitle {
  font-family: 'Source Sans Pro', sans-serif;
  font-size: 1.1rem;
  text-align: center;
  color: #00d4ff;
  margin-bottom: 3rem;
  opacity: 0.9;
}

.scenario-controls {
  background: rgba(0, 0, 0, 0.6);
  border: 1px solid rgba(0, 212, 255, 0.2);
  border-radius: 12px;
  padding: 2rem;
  margin-bottom: 2rem;
  backdrop-filter: blur(10px);
  display: flex;
  gap: 2rem;
  align-items: end;
  flex-wrap: wrap;
}

.control-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  min-width: 200px;
}

.control-label {
  font-family: 'Source Sans Pro', sans-serif;
  font-size: 0.9rem;
  color: #00d4ff;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.control-select,
.control-input {
  background: rgba(0, 0, 0, 0.8);
  border: 1px solid rgba(0, 212, 255, 0.3);
  border-radius: 6px;
  padding: 0.75rem;
  color: #e0e6ed;
  font-family: 'Source Sans Pro', sans-serif;
  font-size: 0.9rem;
  transition: all 0.3s ease;
}

.control-select:focus,
.control-input:focus {
  outline: none;
  border-color: #00d4ff;
  box-shadow: 0 0 10px rgba(0, 212, 255, 0.2);
}

.btn-primary {
  background: linear-gradient(135deg, #00d4ff 0%, #0099cc 100%);
  border: none;
  border-radius: 6px;
  padding: 0.75rem 1.5rem;
  color: #000000;
  font-family: 'Source Sans Pro', sans-serif;
  font-weight: 600;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.3s ease;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.btn-primary:hover {
  background: linear-gradient(135deg, #00b8e6 0%, #0088bb 100%);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 212, 255, 0.3);
}

.simulation-results {
  background: rgba(0, 0, 0, 0.6);
  border: 1px solid rgba(0, 212, 255, 0.2);
  border-radius: 12px;
  padding: 2rem;
  backdrop-filter: blur(10px);
}

.simulation-results h3 {
  font-family: 'Source Sans Pro', sans-serif;
  font-size: 1.5rem;
  color: #e0e6ed;
  margin-bottom: 1.5rem;
  text-align: center;
}

.results-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
}

.result-card {
  background: rgba(0, 0, 0, 0.4);
  border: 1px solid rgba(0, 212, 255, 0.1);
  border-radius: 8px;
  padding: 1.5rem;
  text-align: center;
  transition: all 0.3s ease;
}

.result-card:hover {
  border-color: rgba(0, 212, 255, 0.3);
  transform: translateY(-2px);
}

.result-label {
  display: block;
  font-family: 'Source Sans Pro', sans-serif;
  font-size: 0.8rem;
  color: #8a92a8;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 0.5rem;
}

.result-value {
  display: block;
  font-family: 'IBM Plex Mono', monospace;
  font-size: 1.5rem;
  font-weight: 600;
  color: #e0e6ed;
}

.result-value.positive {
  color: #00ff88;
}

.result-value.negative {
  color: #ff4444;
}

@media (max-width: 768px) {
  .scenario-controls {
    flex-direction: column;
    align-items: stretch;
  }

  .control-group {
    min-width: auto;
  }

  .results-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 480px) {
  .results-grid {
    grid-template-columns: 1fr;
  }
}
</style>
