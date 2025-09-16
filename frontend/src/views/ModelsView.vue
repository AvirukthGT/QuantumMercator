<template>
  <div class="models-view">
    <div class="container">
      <h1 class="page-title">AI Models</h1>
      <p class="page-subtitle">Advanced predictive models for market forecasting</p>

      <div class="models-grid">
        <div class="model-card">
          <div class="model-header">
            <h3>ARIMA</h3>
            <span class="model-status active">Active</span>
          </div>
          <p class="model-description">
            AutoRegressive Integrated Moving Average model for time series forecasting
          </p>
          <div class="model-metrics">
            <div class="metric">
              <span class="metric-label">Accuracy</span>
              <span class="metric-value">87.3%</span>
            </div>
            <div class="metric">
              <span class="metric-label">RMSE</span>
              <span class="metric-value">2.45</span>
            </div>
          </div>
        </div>

        <div class="model-card">
          <div class="model-header">
            <h3>LSTM</h3>
            <span class="model-status active">Active</span>
          </div>
          <p class="model-description">
            Long Short-Term Memory neural network for complex pattern recognition
          </p>
          <div class="model-metrics">
            <div class="metric">
              <span class="metric-label">Accuracy</span>
              <span class="metric-value">91.7%</span>
            </div>
            <div class="metric">
              <span class="metric-label">RMSE</span>
              <span class="metric-value">1.89</span>
            </div>
          </div>
        </div>

        <div class="model-card">
          <div class="model-header">
            <h3>Ensemble</h3>
            <span class="model-status active">Active</span>
          </div>
          <p class="model-description">
            Combined model leveraging multiple algorithms for optimal predictions
          </p>
          <div class="model-metrics">
            <div class="metric">
              <span class="metric-label">Accuracy</span>
              <span class="metric-value">94.2%</span>
            </div>
            <div class="metric">
              <span class="metric-label">RMSE</span>
              <span class="metric-value">1.52</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Models view component
</script>

<style scoped>
.models-view {
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

.models-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 2rem;
  margin-top: 2rem;
}

.model-card {
  background: rgba(0, 0, 0, 0.6);
  border: 1px solid rgba(0, 212, 255, 0.2);
  border-radius: 12px;
  padding: 2rem;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
}

.model-card:hover {
  border-color: rgba(0, 212, 255, 0.5);
  box-shadow: 0 8px 32px rgba(0, 212, 255, 0.1);
  transform: translateY(-2px);
}

.model-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.model-header h3 {
  font-family: 'Source Sans Pro', sans-serif;
  font-size: 1.5rem;
  font-weight: 600;
  color: #e0e6ed;
  margin: 0;
}

.model-status {
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.model-status.active {
  background: rgba(0, 255, 136, 0.2);
  color: #00ff88;
  border: 1px solid rgba(0, 255, 136, 0.3);
}

.model-description {
  font-family: 'Source Sans Pro', sans-serif;
  color: #b0b8c8;
  line-height: 1.6;
  margin-bottom: 1.5rem;
}

.model-metrics {
  display: flex;
  gap: 2rem;
}

.metric {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.metric-label {
  font-family: 'Source Sans Pro', sans-serif;
  font-size: 0.8rem;
  color: #8a92a8;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.metric-value {
  font-family: 'IBM Plex Mono', monospace;
  font-size: 1.2rem;
  font-weight: 600;
  color: #00d4ff;
}

@media (max-width: 768px) {
  .models-grid {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }

  .model-card {
    padding: 1.5rem;
  }

  .page-title {
    font-size: 2rem;
  }

  .model-metrics {
    flex-direction: column;
    gap: 1rem;
  }
}
</style>
