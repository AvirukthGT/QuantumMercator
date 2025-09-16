<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import PriceChart from './PriceChart.vue'
import { stockDataService, type StockDataPoint, type StockInfo } from '../services/stockDataService'

interface CompanyData {
  symbol: string
  name: string
  price: number
  change: number
  changePercent: number
  volume: number
  marketCap: number
  pe: number
  high52: number
  low52: number
  open: number
  previousClose: number
}

interface Props {
  isOpen: boolean
  company: CompanyData | null
}

const props = defineProps<Props>()
const emit = defineEmits<{
  close: []
}>()

const chartData = ref<StockDataPoint[]>([])
const selectedTimeframe = ref('1D')
const isLoading = ref(false)
const isDetailedDataLoaded = ref(false)

const timeframes = [
  { value: '1D', label: '1 Day' },
  { value: '5D', label: '5 Days' },
  { value: '1M', label: '1 Month' },
  { value: '3M', label: '3 Months' },
  { value: '1Y', label: '1 Year' }
]

const formatPrice = (price: number) => {
  return price.toFixed(2)
}

const formatChange = (change: number) => {
  return change > 0 ? `+${change.toFixed(2)}` : change.toFixed(2)
}

const formatChangePercent = (changePercent: number) => {
  return changePercent > 0 ? `+${changePercent.toFixed(2)}%` : `${changePercent.toFixed(2)}%`
}

// Watch for company changes to reset detailed data loading state
watch(() => props.company, (newCompany) => {
  if (newCompany) {
    // Check if this is basic data (no volume, marketCap, etc.)
    isDetailedDataLoaded.value = newCompany.volume > 0 || newCompany.marketCap > 0
  }
}, { immediate: true })

const formatVolume = (volume: number) => {
  if (volume >= 1e9) return `${(volume / 1e9).toFixed(1)}B`
  if (volume >= 1e6) return `${(volume / 1e6).toFixed(1)}M`
  if (volume >= 1e3) return `${(volume / 1e3).toFixed(1)}K`
  return volume.toString()
}

const formatMarketCap = (marketCap: number) => {
  if (marketCap >= 1e12) return `$${(marketCap / 1e12).toFixed(1)}T`
  if (marketCap >= 1e9) return `$${(marketCap / 1e9).toFixed(1)}B`
  if (marketCap >= 1e6) return `$${(marketCap / 1e6).toFixed(1)}M`
  return `$${marketCap.toLocaleString()}`
}


const closeModal = () => {
  emit('close')
}

const handleBackdropClick = (event: MouseEvent) => {
  if (event.target === event.currentTarget) {
    closeModal()
  }
}

const handleEscape = (event: KeyboardEvent) => {
  if (event.key === 'Escape') {
    closeModal()
  }
}

const fetchChartData = async (timeframe: string) => {
  if (!props.company) {
    console.log('No company data available')
    return
  }

  console.log('Fetching real chart data for:', props.company.symbol, 'timeframe:', timeframe)
  isLoading.value = true

  try {
    // Fetch real stock data from Yahoo Finance
    const data = await stockDataService.getStockHistory(props.company.symbol, timeframe)

    if (data.length === 0) {
      console.warn('No data received for', props.company.symbol, timeframe)
      chartData.value = []
    } else {
      chartData.value = data
      console.log('Fetched real chart data:', data.length, 'points')
      console.log('Sample data:', data.slice(0, 3))
    }
  } catch (error) {
    console.error('Error fetching chart data:', error)
    chartData.value = []
  } finally {
    isLoading.value = false
  }
}

const changeTimeframe = (timeframe: string) => {
  selectedTimeframe.value = timeframe
  fetchChartData(timeframe)
}

onMounted(() => {
  document.addEventListener('keydown', handleEscape)
  if (props.company) {
    fetchChartData(selectedTimeframe.value)
  }
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleEscape)
})

// Watch for company changes
watch(() => props.company, (newCompany) => {
  if (newCompany) {
    fetchChartData(selectedTimeframe.value)
  }
}, { immediate: true })

onMounted(() => {
  if (props.company) {
    fetchChartData(selectedTimeframe.value)
  }
})
</script>

<template>
  <div
    v-if="isOpen"
    class="modal-overlay"
    @click="handleBackdropClick"
  >
    <div class="modal-content">
      <!-- Modal Header -->
      <div class="modal-header">
        <div class="company-info">
          <h2 class="company-symbol">{{ company?.symbol }}</h2>
          <p class="company-name">{{ company?.name }}</p>
        </div>
        <button class="close-button" @click="closeModal">
          <span class="close-icon">×</span>
        </button>
      </div>

      <!-- Price Section -->
      <div class="price-section">
        <div class="current-price">
          <span class="price-value">${{ formatPrice(company?.price || 0) }}</span>
          <span
            class="price-change"
            :class="{ 'positive': (company?.change || 0) > 0, 'negative': (company?.change || 0) < 0 }"
          >
            {{ formatChange(company?.change || 0) }} ({{ formatChangePercent(company?.changePercent || 0) }})
          </span>
        </div>
        <div class="price-details">
          <div class="price-item">
            <span class="label">Open:</span>
            <span class="value">
              <span v-if="!isDetailedDataLoaded" class="loading-placeholder">Loading...</span>
              <span v-else>${{ formatPrice(company?.open || 0) }}</span>
            </span>
          </div>
          <div class="price-item">
            <span class="label">Previous Close:</span>
            <span class="value">
              <span v-if="!isDetailedDataLoaded" class="loading-placeholder">Loading...</span>
              <span v-else>${{ formatPrice(company?.previousClose || 0) }}</span>
            </span>
          </div>
          <div class="price-item">
            <span class="label">52W High:</span>
            <span class="value">
              <span v-if="!isDetailedDataLoaded" class="loading-placeholder">Loading...</span>
              <span v-else>${{ formatPrice(company?.high52 || 0) }}</span>
            </span>
          </div>
          <div class="price-item">
            <span class="label">52W Low:</span>
            <span class="value">
              <span v-if="!isDetailedDataLoaded" class="loading-placeholder">Loading...</span>
              <span v-else>${{ formatPrice(company?.low52 || 0) }}</span>
            </span>
          </div>
        </div>
      </div>

      <!-- Chart Section -->
      <div class="chart-section">
        <div class="chart-header">
          <h3>Price Chart</h3>
          <div class="timeframe-selector">
            <button
              v-for="timeframe in timeframes"
              :key="timeframe.value"
              class="timeframe-btn"
              :class="{ 'active': selectedTimeframe === timeframe.value }"
              @click="changeTimeframe(timeframe.value)"
            >
              {{ timeframe.label }}
            </button>
          </div>
        </div>

        <PriceChart
          :data="chartData"
          :isLoading="isLoading"
          :selectedTimeframe="selectedTimeframe"
        />
      </div>

      <!-- Company Details -->
      <div class="details-section">
        <div class="details-grid">
          <div class="detail-item">
            <span class="detail-label">Volume</span>
            <span class="detail-value">
              <span v-if="!isDetailedDataLoaded" class="loading-placeholder">Loading...</span>
              <span v-else>{{ formatVolume(company?.volume || 0) }}</span>
            </span>
          </div>
          <div class="detail-item">
            <span class="detail-label">Market Cap</span>
            <span class="detail-value">
              <span v-if="!isDetailedDataLoaded" class="loading-placeholder">Loading...</span>
              <span v-else>{{ formatMarketCap(company?.marketCap || 0) }}</span>
            </span>
          </div>
          <div class="detail-item">
            <span class="detail-label">P/E Ratio</span>
            <span class="detail-value">
              <span v-if="!isDetailedDataLoaded" class="loading-placeholder">Loading...</span>
              <span v-else>{{ company?.pe?.toFixed(2) || 'N/A' }}</span>
            </span>
          </div>
          <div class="detail-item">
            <span class="detail-label">Sector</span>
            <span class="detail-value">Technology</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(10px);
  z-index: 10000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
}

.modal-content {
  background: linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 50%, #16213e 100%);
  border: 1px solid rgba(0, 212, 255, 0.3);
  border-radius: 8px;
  width: 100%;
  max-width: 900px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.5);
  position: relative;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 2rem 2rem 1rem 2rem;
  border-bottom: 1px solid rgba(0, 212, 255, 0.2);
}

.company-info h2 {
  font-family: 'Source Sans Pro', sans-serif;
  font-size: 2rem;
  font-weight: 700;
  color: #00d4ff;
  margin: 0;
  text-shadow: 0 0 10px rgba(0, 212, 255, 0.5);
}

.company-name {
  font-family: 'Source Sans Pro', sans-serif;
  font-size: 1rem;
  color: #e0e6ed;
  margin: 0.5rem 0 0 0;
  opacity: 0.8;
}

.close-button {
  background: rgba(0, 50, 100, 0.2);
  border: 1px solid rgba(0, 212, 255, 0.3);
  color: #00d4ff;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.close-button:hover {
  background: rgba(0, 212, 255, 0.2);
  border-color: #00d4ff;
}

.close-icon {
  font-size: 1.5rem;
  font-weight: bold;
}

.price-section {
  padding: 1.5rem 2rem;
  border-bottom: 1px solid rgba(0, 212, 255, 0.2);
}

.current-price {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
}

.price-value {
  font-family: 'IBM Plex Mono', monospace;
  font-size: 2.5rem;
  font-weight: 700;
  color: #ffffff;
  text-shadow: 0 0 10px rgba(255, 255, 255, 0.3);
}

.price-change {
  font-family: 'IBM Plex Mono', monospace;
  font-size: 1.2rem;
  font-weight: 600;
  padding: 0.5rem 1rem;
  border-radius: 4px;
}

.price-change.positive {
  color: #00ff88;
  background: rgba(0, 255, 136, 0.1);
  text-shadow: 0 0 5px rgba(0, 255, 136, 0.3);
}

.price-change.negative {
  color: #ff4444;
  background: rgba(255, 68, 68, 0.1);
  text-shadow: 0 0 5px rgba(255, 68, 68, 0.3);
}

.price-details {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
}

.price-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 0;
}

.label {
  font-family: 'Source Sans Pro', sans-serif;
  color: #00d4ff;
  font-weight: 500;
}

.value {
  font-family: 'IBM Plex Mono', monospace;
  color: #ffffff;
  font-weight: 600;
}

.chart-section {
  padding: 1.5rem 2rem;
  border-bottom: 1px solid rgba(0, 212, 255, 0.2);
  height: 400px;
}

.chart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.chart-header h3 {
  font-family: 'Source Sans Pro', sans-serif;
  font-size: 1.3rem;
  color: #00d4ff;
  margin: 0;
}

.timeframe-selector {
  display: flex;
  gap: 0.5rem;
}

.timeframe-btn {
  background: rgba(0, 50, 100, 0.2);
  border: 1px solid rgba(0, 212, 255, 0.3);
  color: #00d4ff;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  font-family: 'Source Sans Pro', sans-serif;
  font-size: 0.9rem;
  transition: all 0.3s ease;
}

.timeframe-btn:hover {
  background: rgba(0, 212, 255, 0.1);
  border-color: #00d4ff;
}

.timeframe-btn.active {
  background: linear-gradient(135deg, #00d4ff, #ffffff);
  color: #000000;
  border-color: #00d4ff;
}


.details-section {
  padding: 1.5rem 2rem;
}

.details-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
}

.detail-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background: rgba(0, 50, 100, 0.1);
  border: 1px solid rgba(0, 212, 255, 0.2);
  border-radius: 4px;
}

.detail-label {
  font-family: 'Source Sans Pro', sans-serif;
  color: #00d4ff;
  font-weight: 500;
}

.detail-value {
  font-family: 'IBM Plex Mono', monospace;
  color: #ffffff;
  font-weight: 600;
}

.loading-placeholder {
  color: #00d4ff;
  font-style: italic;
  animation: pulse 1.5s infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

/* Responsive Design */
@media (max-width: 768px) {
  .modal-overlay {
    padding: 1rem;
  }

  .modal-content {
    max-height: 95vh;
  }

  .modal-header {
    padding: 1.5rem 1.5rem 1rem 1.5rem;
  }

  .company-info h2 {
    font-size: 1.5rem;
  }

  .price-section,
  .chart-section,
  .details-section {
    padding: 1rem 1.5rem;
  }

  .price-details,
  .details-grid {
    grid-template-columns: 1fr;
  }

  .timeframe-selector {
    flex-wrap: wrap;
  }

  .chart-container {
    height: 250px;
  }
}
</style>
