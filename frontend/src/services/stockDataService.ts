// Backend API service for real stock data

export interface StockDataPoint {
  date: string
  price: number
  volume: number
  open: number
  high: number
  low: number
  close: number
}

export interface StockInfo {
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

class StockDataService {
  private cache = new Map<string, { data: StockDataPoint[], timestamp: number }>()
  private readonly CACHE_DURATION = 5 * 60 * 1000 // 5 minutes
  private readonly API_BASE_URL = 'http://localhost:8000/api'

  private getCacheKey(symbol: string, timeframe: string): string {
    return `${symbol}-${timeframe}`
  }

  private isCacheValid(timestamp: number): boolean {
    return Date.now() - timestamp < this.CACHE_DURATION
  }


  async getStockHistory(symbol: string, timeframe: string): Promise<StockDataPoint[]> {
    const cacheKey = this.getCacheKey(symbol, timeframe)
    const cached = this.cache.get(cacheKey)

    if (cached && this.isCacheValid(cached.timestamp)) {
      console.log('Using cached data for', symbol, timeframe)
      return cached.data
    }

    try {
      console.log('Fetching real data from backend for', symbol, timeframe)

      const response = await fetch(`${this.API_BASE_URL}/stocks/${symbol}/history?timeframe=${timeframe}`)

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()

      if (!data.data || data.data.length === 0) {
        console.warn('No chart data available for', symbol)
        return []
      }

      const stockData: StockDataPoint[] = data.data.map((item: any) => ({
        date: item.date,
        price: item.price,
        volume: item.volume,
        open: item.open,
        high: item.high,
        low: item.low,
        close: item.close
      }))

      // Cache the data
      this.cache.set(cacheKey, { data: stockData, timestamp: Date.now() })

      console.log('Fetched', stockData.length, 'data points for', symbol)
      return stockData

    } catch (error) {
      console.error('Error fetching stock data:', error)
      // Return empty array on error
      return []
    }
  }

  async getStockInfo(symbol: string): Promise<StockInfo | null> {
    try {
      console.log('Fetching stock info from backend for', symbol)

      const response = await fetch(`${this.API_BASE_URL}/stocks/${symbol}/info`)

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()

      console.log('Fetched stock info for', symbol, ':', data.name)
      return data

    } catch (error) {
      console.error('Error fetching stock info:', error)
      return null
    }
  }

  async getTickerStocks(): Promise<StockInfo[]> {
    try {
      console.log('Fetching ticker data from backend')

      // First check if backend is ready
      await this.waitForBackend()

      const response = await fetch(`${this.API_BASE_URL}/stocks/ticker`)

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()

      if (!data.stocks || data.stocks.length === 0) {
        console.warn('No ticker data received from backend')
        return []
      }

      console.log('Fetched', data.stocks.length, 'stocks from backend')
      return data.stocks

    } catch (error) {
      console.error('Error fetching ticker data:', error)
      return []
    }
  }

  async getTickerStocksFast(): Promise<StockInfo[]> {
    try {
      console.log('Fetching fast ticker data from backend')

      // First check if backend is ready
      await this.waitForBackend()

      const response = await fetch(`${this.API_BASE_URL}/stocks/ticker/fast`)

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()

      if (!data.stocks || data.stocks.length === 0) {
        console.warn('No fast ticker data received from backend')
        return []
      }

      console.log('Fetched', data.stocks.length, 'fast stocks from backend')
      return data.stocks

    } catch (error) {
      console.error('Error fetching fast ticker data:', error)
      return []
    }
  }

  private async waitForBackend(maxRetries: number = 10, delay: number = 1000): Promise<void> {
    for (let i = 0; i < maxRetries; i++) {
      try {
        const response = await fetch(`${this.API_BASE_URL.replace('/api', '')}/health`)
        if (response.ok) {
          console.log('Backend is ready!')
          return
        }
      } catch (error) {
        console.log(`Backend not ready, attempt ${i + 1}/${maxRetries}`)
      }

      if (i < maxRetries - 1) {
        await new Promise(resolve => setTimeout(resolve, delay))
      }
    }
    throw new Error('Backend not responding after maximum retries')
  }

  clearCache(): void {
    this.cache.clear()
    console.log('Stock data cache cleared')
  }

}

export const stockDataService = new StockDataService()
