# Quantum Mercator Backend

Python FastAPI backend for fetching real stock data using yfinance.

## Setup

1. Install Python dependencies:
```bash
pip install -r requirements.txt
```

2. Run the server:
```bash
python main.py
```

The API will be available at `http://localhost:8000`

## API Endpoints

- `GET /` - Health check
- `GET /health` - Detailed health status
- `GET /api/stocks/ticker` - Get ticker data for all symbols
- `GET /api/stocks/{symbol}/info` - Get detailed info for a specific stock
- `GET /api/stocks/{symbol}/history?timeframe=1M` - Get historical data

## Timeframes

- `1D` - 5 days of hourly data
- `5D` - 1 month of daily data
- `1M` - 3 months of daily data
- `3M` - 6 months of daily data
- `1Y` - 1 year of weekly data

## CORS

Configured to allow requests from Vue dev server (`http://localhost:5173`)
