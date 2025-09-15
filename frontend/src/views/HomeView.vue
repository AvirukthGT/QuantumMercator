<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'

// Interactive demo state
const marketShock = ref(0)
const currentPrice = ref(4500)
const forecastData = ref([
  { day: 0, price: 4500, actual: true },
  { day: 1, price: 4520, actual: true },
  { day: 2, price: 4510, actual: true },
  { day: 3, price: 4530, actual: true },
  { day: 4, price: 4525, actual: true },
  { day: 5, price: 0, actual: false },
  { day: 6, price: 0, actual: false },
  { day: 7, price: 0, actual: false },
  { day: 8, price: 0, actual: false },
  { day: 9, price: 0, actual: false }
])

const adjustedForecast = computed(() => {
  return forecastData.value.map((point, index) => {
    if (point.actual) return point
    const basePrice = 4525
    const shockEffect = (marketShock.value / 100) * basePrice
    const trend = (index - 4) * 5 // slight upward trend
    return {
      ...point,
      price: Math.round(basePrice + trend - shockEffect)
    }
  })
})

// Dashboard preview state
const activeModel = ref('ARIMA')
const models = ['ARIMA', 'LSTM', 'Ensemble']

const switchModel = () => {
  const currentIndex = models.indexOf(activeModel.value)
  activeModel.value = models[(currentIndex + 1) % models.length]
}

// Animated map nodes
const mapNodes = ref(Array.from({ length: 20 }, (_, i) => ({
  id: i,
  x: Math.random() * 100,
  y: Math.random() * 100,
  size: Math.random() * 8 + 4,
  delay: Math.random() * 3
})))

onMounted(() => {
  // Auto-switch models every 3 seconds
  setInterval(switchModel, 3000)
})
</script>

<template>
  <div class="home">
    <!-- Hero Section -->
    <section class="hero">
      <div class="hero-background">
        <!-- Renaissance Pattern -->
        <div class="renaissance-pattern"></div>

        <!-- Classical Decorative Elements -->
        <div class="classical-elements">
          <div class="corner-ornament top-left"></div>
          <div class="corner-ornament top-right"></div>
          <div class="corner-ornament bottom-left"></div>
          <div class="corner-ornament bottom-right"></div>
        </div>
      </div>

      <div class="container">
        <div class="hero-content">
          <div class="hero-text">
            <h1 class="hero-title">
              <span class="gradient-text">Quantum Mercator</span>
              <br>
              <span class="hero-tagline">Mapping the Future of Markets</span>
            </h1>
            <p class="hero-subtext">
              Explore, forecast, and simulate stock & index trends with AI-powered foresight.
            </p>
            <div class="hero-actions">
              <a href="#explore" class="btn-primary">Explore Forecasts</a>
              <a href="#simulation" class="btn-secondary">Run a Simulation</a>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Quick Interactive Demo -->
    <section class="demo-section">
      <div class="container">
        <div class="demo-content">
          <div class="demo-header">
            <h2 class="demo-title">See the Power in Action</h2>
            <p class="demo-subtitle">S&P 500 - 5 Day Forecast</p>
          </div>

          <div class="demo-chart glass-effect">
            <div class="chart-container">
              <div class="chart-line">
                <div
                  v-for="(point, index) in adjustedForecast"
                  :key="index"
                  class="chart-point"
                  :class="{ 'actual': point.actual, 'forecast': !point.actual }"
                  :style="{ left: `${(index / (adjustedForecast.length - 1)) * 100}%` }"
                >
                  <div class="point-value">{{ point.price || '---' }}</div>
                  <div class="point-dot"></div>
                </div>
              </div>
              <div class="chart-labels">
                <span>Today</span>
                <span>+5 Days</span>
              </div>
            </div>
          </div>

          <div class="demo-controls">
            <label class="control-label">
              What if the market drops <span class="shock-value">{{ marketShock }}%</span> tomorrow?
            </label>
            <input
              v-model="marketShock"
              type="range"
              min="0"
              max="10"
              step="0.5"
              class="shock-slider"
            />
            <div class="slider-labels">
              <span>0%</span>
              <span>10%</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Why Quantum Mercator? -->
    <section class="value-props-section">
      <div class="container">
        <div class="section-header text-center mb-8">
          <h2 class="section-title">Why Quantum Mercator?</h2>
        </div>

        <div class="value-props-grid grid grid-2">
          <div class="value-card glass-effect">
            <div class="value-icon">🔮</div>
            <h3 class="value-title">Predict</h3>
            <p class="value-description">
              ARIMA & LSTM models with error bands provide sophisticated time-series forecasting
              and confidence intervals for accurate predictions.
            </p>
          </div>

          <div class="value-card glass-effect">
            <div class="value-icon">🧭</div>
            <h3 class="value-title">Simulate</h3>
            <p class="value-description">
              Test what-if scenarios & market shocks to see how different conditions
              affect your forecasts instantly in our Scenario Lab.
            </p>
          </div>

          <div class="value-card glass-effect">
            <div class="value-icon">⚖️</div>
            <h3 class="value-title">Compare</h3>
            <p class="value-description">
              Model duels + ensemble insights help you choose the best approach
              with side-by-side performance metrics.
            </p>
          </div>

          <div class="value-card glass-effect">
            <div class="value-icon">📊</div>
            <h3 class="value-title">Backtest</h3>
            <p class="value-description">
              See strategy performance with equity curves using comprehensive
              backtesting tools and historical data validation.
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- Visual Sneak Peek -->
    <section class="dashboard-preview-section">
      <div class="container">
        <div class="preview-content">
          <div class="preview-header text-center mb-6">
            <h2 class="preview-title">Dashboard in Action</h2>
            <p class="preview-subtitle">See how our models work together</p>
          </div>

          <div class="dashboard-mockup glass-effect">
            <div class="mockup-header">
              <div class="mockup-tabs">
                <div
                  v-for="model in models"
                  :key="model"
                  class="mockup-tab"
                  :class="{ 'active': activeModel === model }"
                >
                  {{ model }}
                </div>
              </div>
              <div class="mockup-status">
                <div class="status-dot"></div>
                <span>Live</span>
              </div>
            </div>

            <div class="mockup-chart">
              <div class="candlestick-chart">
                <div class="chart-bars">
                  <div v-for="i in 20" :key="i" class="candlestick-bar"></div>
                </div>
                <div class="forecast-line"></div>
                <div class="confidence-bands">
                  <div class="band upper"></div>
                  <div class="band lower"></div>
                </div>
              </div>
            </div>

            <div class="mockup-metrics">
              <div class="metric">
                <div class="metric-label">Accuracy</div>
                <div class="metric-value">{{ activeModel === 'ARIMA' ? '94.2%' : activeModel === 'LSTM' ? '96.1%' : '97.3%' }}</div>
              </div>
              <div class="metric">
                <div class="metric-label">RMSE</div>
                <div class="metric-value">{{ activeModel === 'ARIMA' ? '12.4' : activeModel === 'LSTM' ? '8.7' : '6.2' }}</div>
              </div>
              <div class="metric">
                <div class="metric-label">Confidence</div>
                <div class="metric-value">{{ activeModel === 'ARIMA' ? 'High' : activeModel === 'LSTM' ? 'Very High' : 'Highest' }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="cta-section">
      <div class="container">
        <div class="cta-content text-center">
          <h2 class="cta-title">Ready to Map Your Market Future?</h2>
          <p class="cta-description">
            Join thousands of traders using Quantum Mercator to navigate market uncertainty
            with AI-powered foresight.
          </p>
          <div class="cta-actions">
            <a href="#explore" class="btn-primary">Explore Forecasts</a>
            <a href="#simulation" class="btn-secondary">Try Scenario Lab</a>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.home {
  min-height: 100vh;
}

/* Hero Section */
.hero {
  position: relative;
  min-height: 100vh;
  display: flex;
  align-items: center;
  overflow: hidden;
}

.hero-background {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1;
}

/* Renaissance Background Elements */
.renaissance-pattern {
  position: absolute;
  width: 100%;
  height: 100%;
  opacity: 0.1;
}

.renaissance-pattern::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image:
    repeating-linear-gradient(45deg, transparent, transparent 98px, rgba(212, 175, 55, 0.1) 100px),
    repeating-linear-gradient(-45deg, transparent, transparent 98px, rgba(212, 175, 55, 0.1) 100px);
  background-size: 200px 200px;
}

.renaissance-pattern::after {
  content: '';
  position: absolute;
  top: 20%;
  left: 10%;
  right: 10%;
  bottom: 20%;
  border: 2px solid rgba(212, 175, 55, 0.2);
  border-radius: 0;
  background:
    radial-gradient(ellipse at center, rgba(139, 69, 19, 0.05) 0%, transparent 70%);
}

/* Classical Decorative Elements */
.classical-elements {
  position: absolute;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

.corner-ornament {
  position: absolute;
  width: 60px;
  height: 60px;
  border: 2px solid rgba(212, 175, 55, 0.3);
  border-radius: 0;
}

.corner-ornament.top-left {
  top: 20px;
  left: 20px;
  border-right: none;
  border-bottom: none;
}

.corner-ornament.top-right {
  top: 20px;
  right: 20px;
  border-left: none;
  border-bottom: none;
}

.corner-ornament.bottom-left {
  bottom: 20px;
  left: 20px;
  border-right: none;
  border-top: none;
}

.corner-ornament.bottom-right {
  bottom: 20px;
  right: 20px;
  border-left: none;
  border-top: none;
}

.corner-ornament::before {
  content: '◆';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 1.5rem;
  color: rgba(212, 175, 55, 0.4);
}

.hero-content {
  position: relative;
  z-index: 2;
  text-align: center;
  max-width: 900px;
  margin: 0 auto;
  padding: 0 2rem;
}

.hero-title {
  font-family: 'Cinzel', serif;
  font-size: 4.5rem;
  font-weight: 700;
  line-height: 1.1;
  margin-bottom: 2rem;
  text-shadow:
    0 0 20px rgba(212, 175, 55, 0.4),
    0 0 40px rgba(212, 175, 55, 0.2),
    0 4px 20px rgba(0, 0, 0, 0.5);
  letter-spacing: 3px;
  position: relative;
}

.hero-title::before {
  content: '⚜';
  position: absolute;
  left: -60px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 2rem;
  color: #d4af37;
  opacity: 0.7;
}

.hero-title::after {
  content: '⚜';
  position: absolute;
  right: -60px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 2rem;
  color: #d4af37;
  opacity: 0.7;
}

.hero-tagline {
  font-family: 'Playfair Display', serif;
  font-size: 2.5rem;
  font-weight: 400;
  font-style: italic;
  color: #d4af37;
  margin-bottom: 2rem;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
  letter-spacing: 1px;
  position: relative;
}

.hero-tagline::before {
  content: '';
  position: absolute;
  top: -20px;
  left: 50%;
  transform: translateX(-50%);
  width: 120px;
  height: 2px;
  background: linear-gradient(90deg, transparent, #d4af37, transparent);
}

.hero-tagline::after {
  content: '';
  position: absolute;
  bottom: -20px;
  left: 50%;
  transform: translateX(-50%);
  width: 120px;
  height: 2px;
  background: linear-gradient(90deg, transparent, #d4af37, transparent);
}

.hero-subtext {
  font-family: 'Crimson Text', serif;
  font-size: 1.5rem;
  line-height: 1.6;
  color: #f4f1e8;
  margin-bottom: 4rem;
  max-width: 700px;
  margin-left: auto;
  margin-right: auto;
  font-weight: 400;
  text-shadow: 0 1px 5px rgba(0, 0, 0, 0.3);
  text-align: center;
}

.hero-actions {
  display: flex;
  gap: 2rem;
  justify-content: center;
  flex-wrap: wrap;
  margin-top: 3rem;
}

/* Demo Section */
.demo-section {
  padding: 6rem 0;
  background: rgba(255, 255, 255, 0.02);
}

.demo-content {
  max-width: 800px;
  margin: 0 auto;
}

.demo-header {
  text-align: center;
  margin-bottom: 3rem;
}

.demo-title {
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
}

.demo-subtitle {
  font-size: 1.25rem;
  color: #b0b0b0;
}

.demo-chart {
  padding: 2.5rem;
  margin-bottom: 2rem;
  position: relative;
  overflow: hidden;
}

.demo-chart::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background:
    radial-gradient(circle at 20% 20%, rgba(0, 212, 255, 0.1) 0%, transparent 50%),
    radial-gradient(circle at 80% 80%, rgba(0, 153, 204, 0.08) 0%, transparent 50%);
  border-radius: 12px;
  z-index: -1;
}

.chart-container {
  height: 250px;
  position: relative;
  background:
    linear-gradient(135deg, rgba(139, 69, 19, 0.1) 0%, rgba(160, 82, 45, 0.05) 100%),
    linear-gradient(45deg, transparent 30%, rgba(212, 175, 55, 0.02) 50%, transparent 70%);
  border-radius: 0;
  padding: 1.5rem;
  border: 2px solid rgba(212, 175, 55, 0.3);
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.1),
    0 8px 32px rgba(0, 0, 0, 0.2);
  backdrop-filter: blur(10px);
}

.chart-line {
  position: relative;
  height: 100%;
  display: flex;
  align-items: center;
}

.chart-point {
  position: absolute;
  display: flex;
  flex-direction: column;
  align-items: center;
  transform: translateX(-50%);
}

.point-value {
  font-size: 0.9rem;
  color: #d4af37;
  margin-bottom: 0.8rem;
  font-weight: 700;
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.5);
  background: rgba(139, 69, 19, 0.3);
  padding: 0.2rem 0.5rem;
  border-radius: 0;
  backdrop-filter: blur(5px);
  border: 1px solid rgba(212, 175, 55, 0.2);
}

.point-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: #00d4ff;
  box-shadow:
    0 0 15px rgba(0, 212, 255, 0.6),
    0 0 30px rgba(0, 212, 255, 0.3),
    inset 0 1px 0 rgba(255, 255, 255, 0.3);
  position: relative;
  animation: pointPulse 2s ease-in-out infinite;
}

.point-dot::before {
  content: '';
  position: absolute;
  top: -3px;
  left: -3px;
  right: -3px;
  bottom: -3px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(0, 212, 255, 0.3), transparent);
  animation: pointRipple 2s ease-in-out infinite;
}

@keyframes pointPulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.2); }
}

@keyframes pointRipple {
  0% { transform: scale(0.8); opacity: 0.8; }
  100% { transform: scale(2); opacity: 0; }
}

.chart-point.actual .point-dot {
  background: linear-gradient(135deg, #d4af37, #f4d03f);
  box-shadow:
    0 0 15px rgba(212, 175, 55, 0.6),
    0 0 30px rgba(212, 175, 55, 0.3),
    inset 0 1px 0 rgba(255, 255, 255, 0.3);
}

.chart-point.forecast .point-dot {
  background: linear-gradient(135deg, #cd853f, #daa520);
  box-shadow:
    0 0 15px rgba(205, 133, 63, 0.6),
    0 0 30px rgba(205, 133, 63, 0.3),
    inset 0 1px 0 rgba(255, 255, 255, 0.3);
}

.chart-point.forecast .point-dot::before {
  background: radial-gradient(circle, rgba(205, 133, 63, 0.3), transparent);
}

.chart-labels {
  display: flex;
  justify-content: space-between;
  margin-top: 1rem;
  font-size: 0.9rem;
  color: #b0b0b0;
}

.demo-controls {
  text-align: center;
}

.control-label {
  display: block;
  font-size: 1.1rem;
  margin-bottom: 1rem;
  color: #ffffff;
}

.shock-value {
  color: #d4af37;
  font-weight: 700;
}

.shock-slider {
  width: 100%;
  max-width: 500px;
  height: 12px;
  background:
    linear-gradient(90deg, rgba(139, 69, 19, 0.3) 0%, rgba(160, 82, 45, 0.2) 100%),
    rgba(26, 15, 10, 0.1);
  border-radius: 0;
  outline: none;
  margin-bottom: 0.8rem;
  position: relative;
  box-shadow:
    inset 0 2px 4px rgba(0, 0, 0, 0.3),
    0 1px 3px rgba(0, 0, 0, 0.2);
  border: 2px solid rgba(212, 175, 55, 0.4);
}

.shock-slider::-webkit-slider-thumb {
  appearance: none;
  width: 28px;
  height: 28px;
  background: linear-gradient(135deg, #d4af37 0%, #f4d03f 50%, #daa520 100%);
  border-radius: 0;
  cursor: pointer;
  box-shadow:
    0 0 20px rgba(212, 175, 55, 0.6),
    0 0 40px rgba(212, 175, 55, 0.3),
    0 4px 12px rgba(0, 0, 0, 0.4),
    inset 0 1px 0 rgba(255, 255, 255, 0.3);
  border: 2px solid rgba(139, 69, 19, 0.5);
  transition: all 0.3s ease;
  position: relative;
}

.shock-slider::-webkit-slider-thumb:hover {
  transform: scale(1.1);
  box-shadow:
    0 0 25px rgba(212, 175, 55, 0.8),
    0 0 50px rgba(212, 175, 55, 0.4),
    0 6px 16px rgba(0, 0, 0, 0.5),
    inset 0 1px 0 rgba(255, 255, 255, 0.4);
}

.shock-slider::-webkit-slider-thumb:active {
  transform: scale(1.05);
}

.shock-slider::-webkit-slider-track {
  background: transparent;
  height: 12px;
  border-radius: 6px;
}

.slider-labels {
  display: flex;
  justify-content: space-between;
  max-width: 400px;
  margin: 0 auto;
  font-size: 0.9rem;
  color: #b0b0b0;
}

/* Value Props Section */
.value-props-section {
  padding: 6rem 0;
}

.section-title {
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 1rem;
}

.value-props-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
}

.value-card {
  padding: 3rem;
  text-align: center;
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  cursor: pointer;
  position: relative;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.value-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(0, 212, 255, 0.1), transparent);
  transition: left 0.6s ease;
}

.value-card:hover::before {
  left: 100%;
}

.value-card:hover {
  transform: translateY(-15px) scale(1.02);
  background: rgba(255, 255, 255, 0.12);
  border-color: rgba(0, 212, 255, 0.3);
  box-shadow:
    0 20px 40px rgba(0, 212, 255, 0.15),
    0 10px 20px rgba(0, 0, 0, 0.2),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
}

.value-icon {
  font-size: 5rem;
  margin-bottom: 2rem;
  display: inline-block;
  transition: all 0.3s ease;
  filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.3));
}

.value-card:hover .value-icon {
  transform: scale(1.1) rotate(5deg);
  filter: drop-shadow(0 6px 12px rgba(0, 212, 255, 0.3));
}

.value-title {
  font-size: 2rem;
  font-weight: 800;
  margin-bottom: 1.5rem;
  color: #ffffff;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  letter-spacing: -0.01em;
}

.value-description {
  color: #c0c0c0;
  line-height: 1.7;
  font-size: 1.2rem;
  font-weight: 300;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
}

/* Dashboard Preview Section */
.dashboard-preview-section {
  padding: 6rem 0;
  background: rgba(255, 255, 255, 0.02);
}

.preview-title {
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
}

.preview-subtitle {
  font-size: 1.25rem;
  color: #b0b0b0;
}

.dashboard-mockup {
  max-width: 900px;
  margin: 0 auto;
  padding: 2rem;
}

.mockup-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.mockup-tabs {
  display: flex;
  gap: 1rem;
}

.mockup-tab {
  padding: 0.5rem 1rem;
  border-radius: 6px;
  background: rgba(255, 255, 255, 0.05);
  color: #b0b0b0;
  cursor: pointer;
  transition: all 0.3s ease;
}

.mockup-tab.active {
  background: linear-gradient(45deg, #00d4ff, #0099cc);
  color: white;
}

.mockup-status {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #00d4ff;
  font-size: 0.9rem;
}

.status-dot {
  width: 8px;
  height: 8px;
  background: #00d4ff;
  border-radius: 50%;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

.mockup-chart {
  height: 300px;
  background: linear-gradient(135deg, rgba(0, 212, 255, 0.05), rgba(0, 153, 204, 0.05));
  border-radius: 12px;
  padding: 1rem;
  margin-bottom: 2rem;
  position: relative;
  overflow: hidden;
}

.candlestick-chart {
  height: 100%;
  position: relative;
}

.chart-bars {
  display: flex;
  height: 100%;
  align-items: end;
  gap: 2px;
}

.candlestick-bar {
  flex: 1;
  background: linear-gradient(to top, #00d4ff 0%, #0099cc 50%, #0066cc 100%);
  border-radius: 3px;
  height: 60%;
  animation: barGrow 3s ease-in-out infinite;
  position: relative;
  box-shadow:
    0 2px 4px rgba(0, 0, 0, 0.2),
    inset 0 1px 0 rgba(255, 255, 255, 0.2);
  border: 1px solid rgba(0, 212, 255, 0.3);
}

.candlestick-bar::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent);
  border-radius: 3px 3px 0 0;
}

.candlestick-bar::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(0, 0, 0, 0.3), transparent);
  border-radius: 0 0 3px 3px;
}

@keyframes barGrow {
  0%, 100% {
    height: 60%;
    transform: scaleY(1);
    box-shadow:
      0 2px 4px rgba(0, 0, 0, 0.2),
      inset 0 1px 0 rgba(255, 255, 255, 0.2);
  }
  25% {
    height: 75%;
    transform: scaleY(1.05);
    box-shadow:
      0 4px 8px rgba(0, 212, 255, 0.3),
      inset 0 1px 0 rgba(255, 255, 255, 0.3);
  }
  50% {
    height: 85%;
    transform: scaleY(1.1);
    box-shadow:
      0 6px 12px rgba(0, 212, 255, 0.4),
      inset 0 1px 0 rgba(255, 255, 255, 0.4);
  }
  75% {
    height: 70%;
    transform: scaleY(1.05);
    box-shadow:
      0 4px 8px rgba(0, 212, 255, 0.3),
      inset 0 1px 0 rgba(255, 255, 255, 0.3);
  }
}

.forecast-line {
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  height: 2px;
  background: linear-gradient(90deg, #ff6b6b, #ff8e8e);
  animation: forecastGrow 3s ease-in-out infinite;
}

@keyframes forecastGrow {
  0% { transform: scaleX(0); }
  50% { transform: scaleX(1); }
  100% { transform: scaleX(1); }
}

.confidence-bands {
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  height: 40px;
}

.band {
  position: absolute;
  left: 0;
  right: 0;
  height: 20px;
  background: rgba(0, 212, 255, 0.1);
  border-radius: 10px;
}

.band.upper {
  top: 0;
}

.band.lower {
  bottom: 0;
}

.mockup-metrics {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
}

.metric {
  text-align: center;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
}

.metric-label {
  font-size: 0.9rem;
  color: #b0b0b0;
  margin-bottom: 0.5rem;
}

.metric-value {
  font-size: 1.5rem;
  font-weight: 700;
  color: #00d4ff;
}

/* CTA Section */
.cta-section {
  padding: 6rem 0;
  background: linear-gradient(135deg, rgba(0, 212, 255, 0.1), rgba(0, 153, 204, 0.1));
}

.cta-title {
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 1rem;
}

.cta-description {
  font-size: 1.25rem;
  color: #b0b0b0;
  margin-bottom: 2rem;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
}

.cta-actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
}

/* Responsive Design */
@media (max-width: 768px) {
  .hero-title {
    font-size: 3rem;
  }

  .hero-tagline {
    font-size: 2rem;
  }

  .hero-subtext {
    font-size: 1.3rem;
  }

  .hero-actions {
    flex-direction: column;
    align-items: center;
    gap: 1rem;
  }

  .section-title {
    font-size: 2.2rem;
  }

  .cta-title {
    font-size: 2.2rem;
  }

  .value-props-grid {
    grid-template-columns: 1fr;
  }

  .mockup-metrics {
    grid-template-columns: 1fr;
  }

  .mockup-tabs {
    flex-wrap: wrap;
    gap: 0.5rem;
  }

  .value-card {
    padding: 2rem;
  }

  .value-icon {
    font-size: 4rem;
  }

  .value-title {
    font-size: 1.5rem;
  }

  .value-description {
    font-size: 1.1rem;
  }

  .demo-chart {
    padding: 1.5rem;
  }

  .chart-container {
    height: 200px;
    padding: 1rem;
  }
}

@media (max-width: 480px) {
  .hero-title {
    font-size: 2.5rem;
  }

  .hero-tagline {
    font-size: 1.5rem;
  }

  .hero-subtext {
    font-size: 1.1rem;
  }

  .btn-primary,
  .btn-secondary {
    padding: 0.8rem 1.5rem;
    font-size: 1rem;
  }
}
</style>
