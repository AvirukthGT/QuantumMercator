from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import yfinance as yf
import pandas as pd
from typing import List, Optional, Dict, Any
from datetime import datetime, timedelta
import logging
import asyncio

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(title="Quantum Mercator Stock API", version="1.0.0")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],  # Vue dev server
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Stock symbols for ticker - reduced for faster initial load
TICKER_SYMBOLS = [
    'AAPL', 'MSFT', 'GOOGL', 'AMZN', 'TSLA', 'META', 'NVDA', 'BRK-B',
    'JPM', 'JNJ', 'V', 'PG', 'UNH', 'HD', 'MA', 'DIS', 'NFLX', 'AMD',
    'INTC', 'PYPL', 'ADBE', 'CRM', 'NKE', 'CMCSA', 'PFE', 'TMO', 'ABT',
    'COST', 'ACN', 'DHR', '^GSPC', '^DJI', '^IXIC', '^RUT', '^VIX'
]

# Core symbols for fast initial load
CORE_SYMBOLS = [
    'AAPL', 'MSFT', 'GOOGL', 'AMZN', 'TSLA', 'META', 'NVDA', 'BRK-B',
    'JPM', 'JNJ', 'V', 'PG', 'UNH', 'HD', 'MA', 'DIS'
]

# Cache for ticker data
ticker_cache: Dict[str, Any] = {
    'data': [],
    'timestamp': 0,
    'expires_in': 120  # Cache for 2 minutes for better performance
}

# Cache for individual stock info
stock_info_cache: Dict[str, Dict[str, Any]] = {}

@app.on_event("startup")
async def startup_event():
    """Pre-load core ticker data on startup for faster first requests"""
    logger.info("🚀 Starting up Quantum Mercator Backend...")
    logger.info("📊 Pre-loading core ticker data...")
    
    try:
        # Pre-load core ticker data (faster)
        stocks = await fetch_core_ticker_data()
        ticker_cache['data'] = stocks
        ticker_cache['timestamp'] = datetime.now().timestamp()
        logger.info("✅ Pre-loaded %d core stocks for ticker", len(stocks))
    except Exception as e:
        logger.error("❌ Failed to pre-load ticker data: %s", str(e))
    
    # Start background refresh task
    asyncio.create_task(background_refresh())
    
    logger.info("🌐 Backend ready! API available at http://localhost:8000")

async def background_refresh():
    """Background task to refresh ticker data every 2 minutes"""
    while True:
        try:
            await asyncio.sleep(120)  # Wait 2 minutes
            logger.info("🔄 Background refresh: updating ticker data...")
            stocks = await fetch_ticker_data()
            ticker_cache['data'] = stocks
            ticker_cache['timestamp'] = datetime.now().timestamp()
            logger.info("✅ Background refresh completed: %d stocks updated", len(stocks))
        except Exception as e:
            logger.error("❌ Background refresh failed: %s", str(e))

@app.get("/")
async def root():
    return {"message": "Quantum Mercator Stock API is running!"}

@app.get("/health")
async def health_check():
    return {"status": "healthy", "timestamp": datetime.now().isoformat()}

def is_cache_valid(timestamp: int, expires_in: int) -> bool:
    """Check if cache is still valid"""
    return (datetime.now().timestamp() - timestamp) < expires_in

async def fetch_core_ticker_data() -> List[Dict[str, Any]]:
    """Fetch core ticker data from Yahoo Finance (faster initial load)"""
    try:
        logger.info("Fetching core ticker data for %d symbols", len(CORE_SYMBOLS))
        
        # Fetch data for core symbols only
        tickers = yf.Tickers(" ".join(CORE_SYMBOLS))
        stocks = []
        
        for symbol in CORE_SYMBOLS:
            try:
                ticker = tickers.tickers[symbol]
                info = ticker.info
                hist = ticker.history(period="1d")
                
                if not hist.empty:
                    current_price = hist['Close'].iloc[-1]
                    previous_close = info.get('previousClose', current_price)
                    change = current_price - previous_close
                    change_percent = (change / previous_close) * 100 if previous_close != 0 else 0
                else:
                    # Fallback to info data
                    current_price = info.get('currentPrice', info.get('regularMarketPrice', 0))
                    previous_close = info.get('previousClose', current_price)
                    change = info.get('regularMarketChange', 0)
                    change_percent = info.get('regularMarketChangePercent', 0) * 100
                
                stock_data = {
                    "symbol": symbol,
                    "name": info.get('longName', info.get('shortName', symbol)),
                    "price": round(current_price, 2),
                    "change": round(change, 2),
                    "changePercent": round(change_percent, 2),
                    "volume": info.get('volume', info.get('regularMarketVolume', 0)),
                    "marketCap": info.get('marketCap', 0),
                    "pe": info.get('trailingPE', 0),
                    "high52": info.get('fiftyTwoWeekHigh', 0),
                    "low52": info.get('fiftyTwoWeekLow', 0),
                    "open": info.get('open', info.get('regularMarketOpen', 0)),
                    "previousClose": previous_close
                }
                
                stocks.append(stock_data)
                logger.info("Successfully fetched core data for %s: $%.2f", symbol, current_price)
                
            except Exception as e:
                logger.warning("Failed to fetch core data for %s: %s", symbol, str(e))
                continue
        
        logger.info("Successfully fetched %d core stocks for ticker", len(stocks))
        return stocks
        
    except Exception as e:
        logger.error("Error fetching core ticker data: %s", str(e))
        raise e

async def fetch_ticker_data() -> List[Dict[str, Any]]:
    """Fetch fresh ticker data from Yahoo Finance"""
    try:
        logger.info("Fetching fresh ticker data for %d symbols", len(TICKER_SYMBOLS))
        
        # Fetch data for all symbols
        tickers = yf.Tickers(" ".join(TICKER_SYMBOLS))
        stocks = []
        
        for symbol in TICKER_SYMBOLS:
            try:
                ticker = tickers.tickers[symbol]
                info = ticker.info
                hist = ticker.history(period="1d")
                
                if not hist.empty:
                    current_price = hist['Close'].iloc[-1]
                    previous_close = info.get('previousClose', current_price)
                    change = current_price - previous_close
                    change_percent = (change / previous_close) * 100 if previous_close != 0 else 0
                else:
                    # Fallback to info data
                    current_price = info.get('currentPrice', info.get('regularMarketPrice', 0))
                    previous_close = info.get('previousClose', current_price)
                    change = info.get('regularMarketChange', 0)
                    change_percent = info.get('regularMarketChangePercent', 0) * 100
                
                stock_data = {
                    "symbol": symbol,
                    "name": info.get('longName', info.get('shortName', symbol)),
                    "price": round(current_price, 2),
                    "change": round(change, 2),
                    "changePercent": round(change_percent, 2),
                    "volume": info.get('volume', info.get('regularMarketVolume', 0)),
                    "marketCap": info.get('marketCap', 0),
                    "pe": info.get('trailingPE', 0),
                    "high52": info.get('fiftyTwoWeekHigh', 0),
                    "low52": info.get('fiftyTwoWeekLow', 0),
                    "open": info.get('open', info.get('regularMarketOpen', 0)),
                    "previousClose": previous_close
                }
                
                stocks.append(stock_data)
                logger.info("Successfully fetched data for %s: $%.2f", symbol, current_price)
                
            except Exception as e:
                logger.warning("Failed to fetch data for %s: %s", symbol, str(e))
                continue
        
        logger.info("Successfully fetched %d stocks for ticker", len(stocks))
        return stocks
        
    except Exception as e:
        logger.error("Error fetching ticker data: %s", str(e))
        raise e

@app.get("/api/stocks/ticker")
async def get_ticker_stocks():
    """Get current stock data for ticker display with caching"""
    try:
        # Check if cache is valid
        if is_cache_valid(ticker_cache['timestamp'], ticker_cache['expires_in']):
            logger.info("Returning cached ticker data (%d stocks)", len(ticker_cache['data']))
            return {"stocks": ticker_cache['data'], "count": len(ticker_cache['data']), "cached": True}
        
        # Fetch fresh data
        logger.info("Cache expired, fetching fresh ticker data")
        stocks = await fetch_ticker_data()
        
        # Update cache
        ticker_cache['data'] = stocks
        ticker_cache['timestamp'] = datetime.now().timestamp()
        
        logger.info("Updated cache with %d stocks", len(stocks))
        return {"stocks": stocks, "count": len(stocks), "cached": False}
        
    except Exception as e:
        logger.error("Error fetching ticker data: %s", str(e))
        # Return cached data if available, even if expired
        if ticker_cache['data']:
            logger.info("Returning stale cached data due to error")
            return {"stocks": ticker_cache['data'], "count": len(ticker_cache['data']), "cached": True, "stale": True}
        raise HTTPException(status_code=500, detail=f"Error fetching ticker data: {str(e)}")

@app.get("/api/stocks/ticker/fast")
async def get_ticker_stocks_fast():
    """Get core stock data for immediate display"""
    try:
        # Always return cached data for fast response
        if ticker_cache['data']:
            logger.info("Returning fast cached ticker data (%d stocks)", len(ticker_cache['data']))
            return {"stocks": ticker_cache['data'], "count": len(ticker_cache['data']), "cached": True, "fast": True}
        
        # If no cache, fetch core data quickly
        logger.info("No cache available, fetching core ticker data")
        stocks = await fetch_core_ticker_data()
        
        # Update cache
        ticker_cache['data'] = stocks
        ticker_cache['timestamp'] = datetime.now().timestamp()
        
        logger.info("Updated cache with %d core stocks", len(stocks))
        return {"stocks": stocks, "count": len(stocks), "cached": False, "fast": True}
        
    except Exception as e:
        logger.error("Error fetching fast ticker data: %s", str(e))
        raise HTTPException(status_code=500, detail=f"Error fetching fast ticker data: {str(e)}")

@app.get("/api/stocks/{symbol}/info")
async def get_stock_info(symbol: str):
    """Get detailed information for a specific stock with caching"""
    try:
        # Check cache first
        if symbol in stock_info_cache:
            cached_data = stock_info_cache[symbol]
            if is_cache_valid(cached_data['timestamp'], 60):  # Cache for 1 minute
                logger.info("Returning cached stock info for %s", symbol)
                return cached_data['data']
        
        logger.info("Fetching fresh detailed info for symbol: %s", symbol)
        
        ticker = yf.Ticker(symbol)
        info = ticker.info
        hist = ticker.history(period="1d")
        
        if not hist.empty:
            current_price = hist['Close'].iloc[-1]
            previous_close = info.get('previousClose', current_price)
            change = current_price - previous_close
            change_percent = (change / previous_close) * 100 if previous_close != 0 else 0
        else:
            current_price = info.get('currentPrice', info.get('regularMarketPrice', 0))
            previous_close = info.get('previousClose', current_price)
            change = info.get('regularMarketChange', 0)
            change_percent = info.get('regularMarketChangePercent', 0) * 100
        
        stock_data = {
            "symbol": symbol,
            "name": info.get('longName', info.get('shortName', symbol)),
            "price": round(current_price, 2),
            "change": round(change, 2),
            "changePercent": round(change_percent, 2),
            "volume": info.get('volume', info.get('regularMarketVolume', 0)),
            "marketCap": info.get('marketCap', 0),
            "pe": info.get('trailingPE', 0),
            "high52": info.get('fiftyTwoWeekHigh', 0),
            "low52": info.get('fiftyTwoWeekLow', 0),
            "open": info.get('open', info.get('regularMarketOpen', 0)),
            "previousClose": previous_close
        }
        
        # Cache the data
        stock_info_cache[symbol] = {
            'data': stock_data,
            'timestamp': datetime.now().timestamp()
        }
        
        logger.info("Successfully fetched and cached detailed info for %s", symbol)
        return stock_data
        
    except Exception as e:
        logger.error("Error fetching stock info for %s: %s", symbol, str(e))
        raise HTTPException(status_code=500, detail=f"Error fetching stock info: {str(e)}")

@app.get("/api/stocks/{symbol}/history")
async def get_stock_history(symbol: str, timeframe: str = "1M"):
    """Get historical data for a specific stock"""
    try:
        logger.info("Fetching historical data for %s, timeframe: %s", symbol, timeframe)
        
        # Map timeframe to yfinance period and interval
        period_map = {
            "1D": ("5d", "1h"),
            "5D": ("1mo", "1d"),
            "1M": ("3mo", "1d"),
            "3M": ("6mo", "1d"),
            "1Y": ("1y", "1wk")
        }
        
        if timeframe not in period_map:
            raise HTTPException(status_code=400, detail="Invalid timeframe. Use: 1D, 5D, 1M, 3M, 1Y")
        
        period, interval = period_map[timeframe]
        
        ticker = yf.Ticker(symbol)
        hist = ticker.history(period=period, interval=interval)
        
        if hist.empty:
            raise HTTPException(status_code=404, detail=f"No historical data found for {symbol}")
        
        # Convert to our format
        history_data = []
        for date, row in hist.iterrows():
            history_data.append({
                "date": date.strftime("%Y-%m-%d"),
                "price": round(row['Close'], 2),
                "volume": int(row['Volume']) if pd.notna(row['Volume']) else 0,
                "open": round(row['Open'], 2),
                "high": round(row['High'], 2),
                "low": round(row['Low'], 2),
                "close": round(row['Close'], 2)
            })
        
        logger.info("Successfully fetched %d data points for %s", len(history_data), symbol)
        return {"symbol": symbol, "timeframe": timeframe, "data": history_data}
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error("Error fetching historical data for %s: %s", symbol, str(e))
        raise HTTPException(status_code=500, detail=f"Error fetching historical data: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
