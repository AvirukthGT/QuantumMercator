// Mock data for demonstration - replace with actual yfinance integration
export interface StockData {
  symbol: string
  name: string
  currentPrice: number
  change: number
  changePercent: number
  volume: number
  marketCap?: number
  pe?: number
  high52Week?: number
  low52Week?: number
}

export interface HistoricalData {
  date: string
  open: number
  high: number
  low: number
  close: number
  volume: number
}

export interface StockQuote {
  symbol: string
  price: number
  change: number
  changePercent: number
  volume: number
  timestamp: string
}

// Mock data for demonstration
const mockStockData: Record<string, StockData> = {
  'AAPL': {
    symbol: 'AAPL',
    name: 'Apple Inc.',
    currentPrice: 189.25,
    change: 2.15,
    changePercent: 1.15,
    volume: 45678900,
    marketCap: 2950000000000,
    pe: 28.5,
    high52Week: 198.23,
    low52Week: 164.08
  },
  'MSFT': {
    symbol: 'MSFT',
    name: 'Microsoft Corporation',
    currentPrice: 378.85,
    change: -1.25,
    changePercent: -0.33,
    volume: 23456700,
    marketCap: 2810000000000,
    pe: 32.1,
    high52Week: 384.30,
    low52Week: 309.45
  },
  'GOOGL': {
    symbol: 'GOOGL',
    name: 'Alphabet Inc.',
    currentPrice: 142.50,
    change: 3.20,
    changePercent: 2.30,
    volume: 34567800,
    marketCap: 1780000000000,
    pe: 25.8,
    high52Week: 151.55,
    low52Week: 115.55
  },
  'AMZN': {
    symbol: 'AMZN',
    name: 'Amazon.com Inc.',
    currentPrice: 155.75,
    change: -0.85,
    changePercent: -0.54,
    volume: 28934500,
    marketCap: 1620000000000,
    pe: 45.2,
    high52Week: 170.83,
    low52Week: 101.15
  },
  'TSLA': {
    symbol: 'TSLA',
    name: 'Tesla Inc.',
    currentPrice: 248.50,
    change: 5.75,
    changePercent: 2.37,
    volume: 67890100,
    marketCap: 790000000000,
    pe: 65.3,
    high52Week: 299.29,
    low52Week: 138.80
  }
}

const mockIndices: Record<string, StockQuote> = {
  '^GSPC': {
    symbol: '^GSPC',
    price: 4567.18,
    change: 12.45,
    changePercent: 0.27,
    volume: 0,
    timestamp: new Date().toISOString()
  },
  '^DJI': {
    symbol: '^DJI',
    price: 34567.89,
    change: -45.23,
    changePercent: -0.13,
    volume: 0,
    timestamp: new Date().toISOString()
  },
  '^IXIC': {
    symbol: '^IXIC',
    price: 14234.56,
    change: 78.90,
    changePercent: 0.56,
    volume: 0,
    timestamp: new Date().toISOString()
  },
  '^RUT': {
    symbol: '^RUT',
    price: 1987.65,
    change: 15.32,
    changePercent: 0.78,
    volume: 0,
    timestamp: new Date().toISOString()
  },
  '^VIX': {
    symbol: '^VIX',
    price: 18.45,
    change: -1.25,
    changePercent: -6.35,
    volume: 0,
    timestamp: new Date().toISOString()
  }
}

export class StockService {
  /**
   * Get real-time stock quote for a single symbol
   */
  static async getQuote(symbol: string): Promise<StockQuote> {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500))

      const stockData = mockStockData[symbol.toUpperCase()]
      if (!stockData) {
        throw new Error(`Stock ${symbol} not found`)
      }

      return {
        symbol: stockData.symbol,
        price: stockData.currentPrice,
        change: stockData.change,
        changePercent: stockData.changePercent,
        volume: stockData.volume,
        timestamp: new Date().toISOString()
      }
    } catch (error) {
      console.error(`Error fetching quote for ${symbol}:`, error)
      throw new Error(`Failed to fetch quote for ${symbol}`)
    }
  }

  /**
   * Get detailed stock information
   */
  static async getStockData(symbol: string): Promise<StockData> {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 800))

      const stockData = mockStockData[symbol.toUpperCase()]
      if (!stockData) {
        throw new Error(`Stock ${symbol} not found`)
      }

      return { ...stockData }
    } catch (error) {
      console.error(`Error fetching stock data for ${symbol}:`, error)
      throw new Error(`Failed to fetch stock data for ${symbol}`)
    }
  }

  /**
   * Get historical data for a stock
   */
  static async getHistoricalData(
    symbol: string,
    period: string = '1y',
    interval: string = '1d'
  ): Promise<HistoricalData[]> {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000))

      // Generate mock historical data
      const days = period === '1y' ? 365 : period === '6mo' ? 180 : 30
      const data: HistoricalData[] = []
      const basePrice = mockStockData[symbol.toUpperCase()]?.currentPrice || 100

      for (let i = days; i >= 0; i--) {
        const date = new Date()
        date.setDate(date.getDate() - i)

        const volatility = 0.02
        const trend = 0.0001
        const randomChange = (Math.random() - 0.5) * volatility
        const price = basePrice * (1 + trend * (days - i) + randomChange)

        data.push({
          date: date.toISOString().split('T')[0],
          open: price * (1 + (Math.random() - 0.5) * 0.01),
          high: price * (1 + Math.random() * 0.02),
          low: price * (1 - Math.random() * 0.02),
          close: price,
          volume: Math.floor(Math.random() * 10000000) + 1000000
        })
      }

      return data
    } catch (error) {
      console.error(`Error fetching historical data for ${symbol}:`, error)
      throw new Error(`Failed to fetch historical data for ${symbol}`)
    }
  }

  /**
   * Get multiple stock quotes at once
   */
  static async getMultipleQuotes(symbols: string[]): Promise<StockQuote[]> {
    try {
      const promises = symbols.map(symbol => this.getQuote(symbol))
      return await Promise.all(promises)
    } catch (error) {
      console.error('Error fetching multiple quotes:', error)
      throw new Error('Failed to fetch multiple quotes')
    }
  }

  /**
   * Search for stocks by name or symbol
   */
  static async searchStocks(query: string): Promise<StockData[]> {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 300))

      const searchResults = Object.values(mockStockData)
        .filter(stock =>
          stock.symbol.toLowerCase().includes(query.toLowerCase()) ||
          stock.name.toLowerCase().includes(query.toLowerCase())
        )
        .slice(0, 10) // Limit to 10 results

      return searchResults
    } catch (error) {
      console.error('Error searching stocks:', error)
      throw new Error('Failed to search stocks')
    }
  }

  /**
   * Get market indices data
   */
  static async getMarketIndices(): Promise<StockQuote[]> {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 600))

      return Object.values(mockIndices)
    } catch (error) {
      console.error('Error fetching market indices:', error)
      throw new Error('Failed to fetch market indices')
    }
  }

  /**
   * Get popular stocks for dashboard
   */
  static async getPopularStocks(): Promise<StockQuote[]> {
    try {
      const popularSymbols = ['AAPL', 'MSFT', 'GOOGL', 'AMZN', 'TSLA']
      return await this.getMultipleQuotes(popularSymbols)
    } catch (error) {
      console.error('Error fetching popular stocks:', error)
      throw new Error('Failed to fetch popular stocks')
    }
  }
}

export default StockService
