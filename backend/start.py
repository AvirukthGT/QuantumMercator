#!/usr/bin/env python3
"""
Startup script for Quantum Mercator Backend
"""
import uvicorn
import sys
import os

def main():
    print("🚀 Starting Quantum Mercator Backend...")
    print("📊 Stock data API with yfinance integration")
    print("🌐 Server will be available at: http://localhost:8000")
    print("📖 API docs available at: http://localhost:8000/docs")
    print("-" * 50)
    
    try:
        uvicorn.run(
            "main:app",
            host="0.0.0.0",
            port=8000,
            reload=True,  # Auto-reload on code changes
            log_level="info"
        )
    except KeyboardInterrupt:
        print("\n👋 Shutting down Quantum Mercator Backend...")
        sys.exit(0)
    except Exception as e:
        print(f"❌ Error starting server: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main()
