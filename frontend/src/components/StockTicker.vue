<template>
  <div class="stock-ticker">
    <div class="ticker-container">
      <!-- Skeleton Loading State -->
      <div v-if="isLoading && !hasData" class="skeleton-ticker">
        <div
          v-for="i in 15"
          :key="`skeleton-${i}`"
          class="skeleton-item"
        >
          <div class="skeleton-symbol"></div>
          <div class="skeleton-price"></div>
          <div class="skeleton-change"></div>
        </div>
      </div>

      <!-- Ticker Content -->
      <div v-else class="ticker-content" :style="{ animationDuration: `${animationDuration}s` }">
        <div
          v-for="(stock, index) in tickerStocks"
          :key="`${stock.symbol}-${index}`"
          class="ticker-item"
          :class="{ 'positive': stock.change >= 0, 'negative': stock.change < 0 }"
          @click="handleCompanyClick(stock)"
        >
          <span class="symbol">{{ stock.symbol }}</span>
          <span class="price">${{ stock.price.toFixed(2) }}</span>
          <span class="change" :class="{ 'positive': stock.change >= 0, 'negative': stock.change < 0 }">
            {{ stock.change >= 0 ? '+' : '' }}{{ stock.change.toFixed(2) }}
            ({{ stock.change >= 0 ? '+' : '' }}{{ stock.changePercent.toFixed(2) }}%)
          </span>
        </div>
      </div>

      <!-- Update Indicator -->
      <div v-if="lastUpdate && !isLoading" class="last-update">
        <span class="update-indicator" :class="{ 'updating': isUpdating }">
          {{ isUpdating ? '⟳' : '●' }}
        </span>
        <span class="update-text">
          {{ isUpdating ? 'Updating...' : `Updated ${formatTime(lastUpdate)}` }}
        </span>
      </div>
    </div>

    <!-- Company Modal -->
    <CompanyModal
      :isOpen="isModalOpen"
      :company="selectedCompany"
      @close="closeModal"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import CompanyModal from './CompanyModal.vue'
import { stockDataService, type StockInfo } from '../services/stockDataService'

interface TickerStock {
  symbol: string
  price: number
  change: number
  changePercent: number
}

// Use StockInfo from the service instead of local interface

const tickerStocks = ref<TickerStock[]>([])
const animationDuration = ref(30)
const isLoading = ref(false) // Start with false for instant display
const isUpdating = ref(false)
const lastUpdate = ref<Date | null>(null)
const hasData = ref(false)

// Modal state
const isModalOpen = ref(false)
const selectedCompany = ref<StockInfo | null>(null)

// Fetch real stock data for ticker
const fetchTickerData = async (isInitialLoad = false) => {
  try {
    console.log('Fetching real ticker data...')

    if (isInitialLoad) {
      // Show skeleton loading for initial load
      isLoading.value = true
    } else {
      isUpdating.value = true
    }

    // Use fast endpoint for initial load, regular for updates
    const stocks = isInitialLoad
      ? await stockDataService.getTickerStocksFast()
      : await stockDataService.getTickerStocks()

    if (stocks.length > 0) {
      tickerStocks.value = stocks.map(stock => ({
        symbol: stock.symbol,
        price: stock.price,
        change: stock.change,
        changePercent: stock.changePercent
      }))
      console.log('Fetched', tickerStocks.value.length, 'real stocks for ticker')
      lastUpdate.value = new Date()
      hasData.value = true
    } else {
      console.warn('No ticker data received, using fallback')
      generateFallbackStocks()
    }
  } catch (error) {
    console.error('Error fetching ticker data:', error)
    generateFallbackStocks()
  } finally {
    isLoading.value = false
    isUpdating.value = false
  }
}

// Fallback mock data if API fails
const generateFallbackStocks = (): TickerStock[] => {
  const symbols = [
    'AAPL', 'MSFT', 'GOOGL', 'AMZN', 'TSLA', 'META', 'NVDA', 'BRK-B',
    'UNH', 'JNJ', 'V', 'PG', 'JPM', 'HD', 'MA', 'DIS', 'PYPL', 'ADBE',
    'NFLX', 'CRM', 'INTC', 'CMCSA', 'PFE', 'T', 'ABT', 'KO', 'PEP',
    'WMT', 'MRK', 'VZ', 'ACN', 'TMO', 'COST', 'DHR', 'ABBV', 'NKE',
    'QCOM', 'TXN', 'CVX', 'NEE', 'LLY', 'UNP', 'PM', 'HON', 'IBM',
    'SPY', 'QQQ', 'IWM', 'VTI', 'VEA', 'VWO', 'BND', 'GLD', 'SLV'
  ]

  // Use more realistic base prices for major stocks
  const realisticPrices: Record<string, number> = {
    'AAPL': 180, 'MSFT': 350, 'GOOGL': 140, 'AMZN': 150, 'TSLA': 250,
    'META': 300, 'NVDA': 450, 'BRK-B': 350, 'JPM': 150, 'JNJ': 160,
    'V': 250, 'PG': 150, 'UNH': 500, 'HD': 300, 'MA': 400, 'DIS': 100,
    'NFLX': 400, 'AMD': 120, 'INTC': 30, 'PYPL': 60, 'ADBE': 500,
    'CRM': 200, 'NKE': 100, 'CMCSA': 40, 'PFE': 30, 'T': 15,
    'ABT': 100, 'KO': 60, 'PEP': 160, 'WMT': 150, 'MRK': 120,
    'VZ': 35, 'ACN': 300, 'TMO': 500, 'COST': 500, 'DHR': 250,
    'ABBV': 150, 'NKE': 100, 'QCOM': 120, 'TXN': 150, 'CVX': 150,
    'NEE': 60, 'LLY': 600, 'UNP': 200, 'PM': 100, 'HON': 200, 'IBM': 150,
    'SPY': 400, 'QQQ': 350, 'IWM': 200, 'VTI': 220, 'VEA': 50,
    'VWO': 40, 'BND': 80, 'GLD': 180, 'SLV': 25
  }

  return symbols.map(symbol => {
    const basePrice = realisticPrices[symbol] || (Math.random() * 200 + 50)
    const changePercent = (Math.random() - 0.5) * 4 // -2% to +2% for more realistic changes
    const change = (basePrice * changePercent) / 100

    return {
      symbol,
      price: Math.round(basePrice * 100) / 100,
      change: Math.round(change * 100) / 100,
      changePercent: Math.round(changePercent * 100) / 100
    }
  })
}

const updatePrices = async () => {
  // For real data, we'll refresh from API periodically
  // This prevents the random price changes that were happening before
  try {
    await fetchTickerData(false) // Not initial load
  } catch (error) {
    console.error('Error updating ticker prices:', error)
  }
}

// Handle company click
const handleCompanyClick = async (stock: TickerStock) => {
  // Open modal immediately with basic data
  selectedCompany.value = {
    symbol: stock.symbol,
    name: getCompanyName(stock.symbol),
    price: stock.price,
    change: stock.change,
    changePercent: stock.changePercent,
    volume: 0,
    marketCap: 0,
    pe: 0,
    high52: 0,
    low52: 0,
    open: 0,
    previousClose: 0
  }

  isModalOpen.value = true

  // Load detailed info in background
  try {
    console.log('Fetching detailed info for', stock.symbol)
    const detailedInfo = await stockDataService.getStockInfo(stock.symbol)

    if (detailedInfo) {
      selectedCompany.value = detailedInfo
      console.log('Fetched detailed info for', stock.symbol, ':', detailedInfo.name)
    } else {
      console.log('Using basic info for', stock.symbol)
    }
  } catch (error) {
    console.error('Error fetching detailed info for', stock.symbol, ':', error)
    console.log('Using basic info for', stock.symbol)
  }
}

// Get company name from symbol
const getCompanyName = (symbol: string): string => {
  const companyNames: Record<string, string> = {
    'AAPL': 'Apple Inc.',
    'MSFT': 'Microsoft Corporation',
    'GOOGL': 'Alphabet Inc.',
    'AMZN': 'Amazon.com Inc.',
    'TSLA': 'Tesla Inc.',
    'META': 'Meta Platforms Inc.',
    'NVDA': 'NVIDIA Corporation',
    'NFLX': 'Netflix Inc.',
    'AMD': 'Advanced Micro Devices Inc.',
    'INTC': 'Intel Corporation',
    'BRK-B': 'Berkshire Hathaway Inc.',
    'JPM': 'JPMorgan Chase & Co.',
    'JNJ': 'Johnson & Johnson',
    'V': 'Visa Inc.',
    'PG': 'Procter & Gamble Co.',
    'UNH': 'UnitedHealth Group Inc.',
    'HD': 'The Home Depot Inc.',
    'MA': 'Mastercard Inc.',
    'DIS': 'The Walt Disney Company',
    'PYPL': 'PayPal Holdings Inc.',
    'ADBE': 'Adobe Inc.',
    'CRM': 'Salesforce Inc.',
    'NKE': 'Nike Inc.',
    'CMCSA': 'Comcast Corporation',
    'PFE': 'Pfizer Inc.',
    'TMO': 'Thermo Fisher Scientific Inc.',
    'ABT': 'Abbott Laboratories',
    'COST': 'Costco Wholesale Corporation',
    'ACN': 'Accenture plc',
    'DHR': 'Danaher Corporation',
    '^GSPC': 'S&P 500 Index',
    '^DJI': 'Dow Jones Industrial Average',
    '^IXIC': 'NASDAQ Composite',
    '^RUT': 'Russell 2000 Index',
    '^VIX': 'CBOE Volatility Index'
  }
  return companyNames[symbol] || `${symbol} Corporation`
}

// Format time for display
const formatTime = (date: Date): string => {
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  const seconds = Math.floor(diff / 1000)

  if (seconds < 60) {
    return `${seconds}s ago`
  } else if (seconds < 3600) {
    const minutes = Math.floor(seconds / 60)
    return `${minutes}m ago`
  } else {
    return date.toLocaleTimeString()
  }
}

// Close modal
const closeModal = () => {
  isModalOpen.value = false
  selectedCompany.value = null
}

let updateInterval: NodeJS.Timeout

onMounted(() => {
  // Fetch real data on mount
  fetchTickerData(true) // Initial load
  // Update prices every 2 minutes (backend caches for 30 seconds, so this ensures fresh data)
  updateInterval = setInterval(updatePrices, 120000)
})

onUnmounted(() => {
  if (updateInterval) {
    clearInterval(updateInterval)
  }
})
</script>

<style scoped>
.stock-ticker {
  position: sticky;
  top: 60px; /* Position below navbar */
  left: 0;
  right: 0;
  height: 40px;
  background: #000000;
  z-index: 999;
  overflow: hidden;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.8);
}

.ticker-container {
  height: 100%;
  position: relative;
  overflow: hidden;
}

.ticker-content {
  display: flex;
  align-items: center;
  height: 100%;
  animation: scroll-left linear infinite;
  white-space: nowrap;
}

/* Skeleton Loading State */
.skeleton-ticker {
  display: flex;
  align-items: center;
  height: 100%;
  animation: scroll-left linear infinite;
  white-space: nowrap;
  gap: 2rem;
}

.skeleton-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 0 1rem;
  min-width: 200px;
}

.skeleton-symbol {
  width: 40px;
  height: 16px;
  background: linear-gradient(90deg, #333 25%, #555 50%, #333 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
  border-radius: 4px;
}

.skeleton-price {
  width: 60px;
  height: 16px;
  background: linear-gradient(90deg, #333 25%, #555 50%, #333 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
  border-radius: 4px;
}

.skeleton-change {
  width: 80px;
  height: 16px;
  background: linear-gradient(90deg, #333 25%, #555 50%, #333 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
  border-radius: 4px;
}

@keyframes shimmer {
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* Last Update Indicator */
.last-update {
  position: absolute;
  top: 50%;
  right: 1rem;
  transform: translateY(-50%);
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #00d4ff;
  font-size: 0.75rem;
  font-family: 'Source Sans Pro', sans-serif;
  z-index: 10;
  background: rgba(0, 0, 0, 0.8);
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  backdrop-filter: blur(5px);
}

.update-indicator {
  color: #00ff00;
  animation: pulse 2s infinite;
}

.update-indicator.updating {
  color: #00d4ff;
  animation: spin 1s linear infinite;
}

.update-text {
  text-shadow: 0 0 5px rgba(0, 212, 255, 0.5);
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

@keyframes scroll-left {
  0% {
    transform: translateX(100%);
  }
  100% {
    transform: translateX(-100%);
  }
}

.ticker-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 0 40px;
  height: 100%;
  font-family: 'IBM Plex Mono', monospace;
  font-size: 0.9rem;
  font-weight: 500;
  min-width: 320px;
  transition: all 0.3s ease;
  white-space: nowrap;
  cursor: pointer;
}

.ticker-item:hover {
  background: rgba(0, 212, 255, 0.1);
}

.symbol {
  color: #00d4ff;
  font-weight: 700;
  font-size: 0.95rem;
  text-shadow: 0 0 5px rgba(0, 212, 255, 0.5);
  margin-right: 8px;
}

.price {
  color: #ffffff;
  font-weight: 600;
  font-size: 0.9rem;
  margin-right: 8px;
}

.change {
  font-weight: 600;
  font-size: 0.85rem;
}

.change.positive {
  color: #00ff88;
  text-shadow: 0 0 3px rgba(0, 255, 136, 0.3);
}

.change.negative {
  color: #ff4444;
  text-shadow: 0 0 3px rgba(255, 68, 68, 0.3);
}


/* Responsive adjustments */
@media (max-width: 768px) {
  .ticker-item {
    min-width: 200px;
    padding: 0 25px;
    font-size: 0.8rem;
  }

  .symbol {
    font-size: 0.85rem;
  }

  .price {
    font-size: 0.8rem;
  }

  .change {
    font-size: 0.75rem;
  }
}

@media (max-width: 480px) {
  .ticker-item {
    min-width: 180px;
    padding: 0 20px;
    gap: 8px;
  }

  .ticker-item .change {
    display: none; /* Hide change on very small screens */
  }
}
</style>
