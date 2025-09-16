<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useStockStore } from '../stores/stockStore'
import StockCard from '../components/StockCard.vue'

// Stock store
const stockStore = useStockStore()

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

const getIndexName = (symbol: string): string => {
  const indexNames: Record<string, string> = {
    '^GSPC': 'S&P 500',
    '^DJI': 'Dow Jones',
    '^IXIC': 'NASDAQ',
    '^RUT': 'Russell 2000',
    '^VIX': 'VIX',
    '^TNX': '10Y Treasury'
  }
  return indexNames[symbol] || symbol
}

// Fetch data on mount
onMounted(() => {
  stockStore.fetchMarketIndices()
  stockStore.fetchPopularStocks()
})
</script>

<template>
  <div class="home">
    <!-- Hero Section -->
    <section class="hero">
      <div class="hero-background">
        <!-- Wall Street Pattern -->
        <div class="wall-street-pattern"></div>

        <!-- Wall Street Decorative Elements -->
        <div class="wall-street-elements"></div>
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
  </div>
</template>

<style scoped>
.home {
  height: calc(100vh - 100px); /* Fixed height to prevent scrolling */
  background:
    radial-gradient(circle at 20% 80%, rgba(0, 50, 100, 0.1) 0%, transparent 50%),
    radial-gradient(circle at 80% 20%, rgba(0, 100, 200, 0.1) 0%, transparent 50%),
    linear-gradient(135deg, #000000 0%, #0a0a0a 25%, #1a1a2e 50%, #16213e 75%, #0f0f23 100%);
  color: #e0e6ed;
  overflow: hidden;
  padding-top: 0;
}

/* Hero Section */
.hero {
  position: relative;
  height: 100%;
  display: flex;
  align-items: center;
  padding: 1rem 0;
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

/* Wall Street Background Elements */
.wall-street-pattern {
  position: absolute;
  width: 100%;
  height: 100%;
  opacity: 0.1;
}

.wall-street-pattern::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image:
    repeating-linear-gradient(90deg, transparent, transparent 98px, rgba(0, 212, 255, 0.1) 100px),
    repeating-linear-gradient(0deg, transparent, transparent 98px, rgba(0, 212, 255, 0.1) 100px);
  background-size: 200px 200px;
}

/* Wall Street Decorative Elements */
.wall-street-elements {
  position: absolute;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

.hero-content {
  position: relative;
  z-index: 2;
  width: 100%;
}

.hero-text {
  text-align: center;
  max-width: 800px;
  margin: 0 auto;
}

.hero-title {
  font-family: 'Source Sans Pro', sans-serif;
  font-size: 3.5rem;
  font-weight: 700;
  line-height: 1.1;
  margin: 0 0 1rem 0;
  text-shadow: 0 0 20px rgba(0, 212, 255, 0.5);
  letter-spacing: 1px;
}

.hero-tagline {
  font-family: 'Source Sans Pro', sans-serif;
  font-size: 1.5rem;
  font-weight: 300;
  color: #00d4ff;
  margin: 0;
  text-shadow: 0 0 10px rgba(0, 212, 255, 0.5);
  position: relative;
  letter-spacing: 0.5px;
}

.hero-subtext {
  font-family: 'Source Sans Pro', sans-serif;
  font-size: 1.1rem;
  color: #e0e6ed;
  margin: 1.5rem 0;
  line-height: 1.6;
  opacity: 0.9;
  font-weight: 300;
}

.hero-actions {
  display: flex;
  gap: 1.5rem;
  justify-content: center;
  margin-top: 2.5rem;
}

/* Responsive Design */
@media (max-width: 1024px) {
  .hero-title {
    font-size: 3rem;
  }

  .hero-tagline {
    font-size: 1.3rem;
  }

  .hero-actions {
    flex-direction: column;
    align-items: center;
    gap: 1rem;
  }
}

@media (max-width: 768px) {
  .hero-title {
    font-size: 2.5rem;
  }

  .hero-tagline {
    font-size: 1.1rem;
  }

  .hero-subtext {
    font-size: 1rem;
  }

  .hero-actions {
    margin-top: 2rem;
  }
}

@media (max-width: 480px) {
  .hero-title {
    font-size: 2rem;
  }

  .hero-tagline {
    font-size: 1rem;
  }

  .hero-subtext {
    font-size: 0.9rem;
  }
}
</style>
