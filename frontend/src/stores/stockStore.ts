import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import StockService, { type StockData, type StockQuote, type HistoricalData } from '../services/stockService'

export const useStockStore = defineStore('stock', () => {
  // State
  const selectedSymbol = ref<string>('AAPL')
  const stockData = ref<StockData | null>(null)
  const historicalData = ref<HistoricalData[]>([])
  const popularStocks = ref<StockQuote[]>([])
  const marketIndices = ref<StockQuote[]>([])
  const loading = ref<boolean>(false)
  const error = ref<string | null>(null)
  const lastUpdated = ref<Date | null>(null)

  // Getters
  const isPositiveChange = computed(() => {
    return stockData.value ? stockData.value.change >= 0 : false
  })

  const changeColor = computed(() => {
    return isPositiveChange.value ? '#10b981' : '#ef4444' // green or red
  })

  const formattedPrice = computed(() => {
    if (!stockData.value) return '$0.00'
    return `$${stockData.value.currentPrice.toFixed(2)}`
  })

  const formattedChange = computed(() => {
    if (!stockData.value) return '+$0.00 (0.00%)'
    const sign = stockData.value.change >= 0 ? '+' : ''
    return `${sign}$${stockData.value.change.toFixed(2)} (${sign}${stockData.value.changePercent.toFixed(2)}%)`
  })

  const chartData = computed(() => {
    return historicalData.value.map(item => ({
      date: item.date,
      value: item.close,
      open: item.open,
      high: item.high,
      low: item.low,
      volume: item.volume
    }))
  })

  // Actions
  const setSelectedSymbol = (symbol: string) => {
    selectedSymbol.value = symbol.toUpperCase()
  }

  const fetchStockData = async (symbol: string) => {
    loading.value = true
    error.value = null

    try {
      const data = await StockService.getStockData(symbol)
      stockData.value = data
      lastUpdated.value = new Date()
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to fetch stock data'
      console.error('Error fetching stock data:', err)
    } finally {
      loading.value = false
    }
  }

  const fetchHistoricalData = async (symbol: string, period: string = '1y') => {
    try {
      const data = await StockService.getHistoricalData(symbol, period)
      historicalData.value = data
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to fetch historical data'
      console.error('Error fetching historical data:', err)
    }
  }

  const fetchPopularStocks = async () => {
    try {
      const data = await StockService.getPopularStocks()
      popularStocks.value = data
    } catch (err) {
      console.error('Error fetching popular stocks:', err)
    }
  }

  const fetchMarketIndices = async () => {
    try {
      const data = await StockService.getMarketIndices()
      marketIndices.value = data
    } catch (err) {
      console.error('Error fetching market indices:', err)
    }
  }

  const searchStocks = async (query: string) => {
    if (!query.trim()) return []

    try {
      return await StockService.searchStocks(query)
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to search stocks'
      console.error('Error searching stocks:', err)
      return []
    }
  }

  const refreshData = async () => {
    if (selectedSymbol.value) {
      await Promise.all([
        fetchStockData(selectedSymbol.value),
        fetchHistoricalData(selectedSymbol.value)
      ])
    }
  }

  const clearError = () => {
    error.value = null
  }

  // Initialize with default data
  const initialize = async () => {
    loading.value = true
    try {
      await Promise.all([
        fetchStockData(selectedSymbol.value),
        fetchHistoricalData(selectedSymbol.value),
        fetchPopularStocks(),
        fetchMarketIndices()
      ])
    } finally {
      loading.value = false
    }
  }

  return {
    // State
    selectedSymbol,
    stockData,
    historicalData,
    popularStocks,
    marketIndices,
    loading,
    error,
    lastUpdated,

    // Getters
    isPositiveChange,
    changeColor,
    formattedPrice,
    formattedChange,
    chartData,

    // Actions
    setSelectedSymbol,
    fetchStockData,
    fetchHistoricalData,
    fetchPopularStocks,
    fetchMarketIndices,
    searchStocks,
    refreshData,
    clearError,
    initialize
  }
})
