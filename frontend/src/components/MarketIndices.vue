<template>
  <div class="market-indices">
    <h2 class="section-title">Market Indices</h2>
    <div class="indices-grid">
      <div
        v-for="index in indices"
        :key="index.symbol"
        class="index-card glass-effect"
        :class="{ 'positive': index.change >= 0, 'negative': index.change < 0 }"
      >
        <div class="index-header">
          <h3 class="index-name">{{ getIndexName(index.symbol) }}</h3>
          <span class="index-symbol">{{ index.symbol }}</span>
        </div>
        <div class="index-price">
          <span class="price">${{ index.price.toFixed(2) }}</span>
          <span class="change">
            {{ index.change >= 0 ? '+' : '' }}${{ index.change.toFixed(2) }}
            ({{ index.change >= 0 ? '+' : '' }}{{ index.changePercent.toFixed(2) }}%)
          </span>
        </div>
        <div class="index-volume">
          <span class="volume-label">Volume:</span>
          <span class="volume-value">{{ formatNumber(index.volume) }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { StockQuote } from '../services/stockService'

interface Props {
  indices: StockQuote[]
}

defineProps<Props>()

const getIndexName = (symbol: string): string => {
  const indexNames: Record<string, string> = {
    '^GSPC': 'S&P 500',
    '^DJI': 'Dow Jones',
    '^IXIC': 'NASDAQ',
    '^RUT': 'Russell 2000',
    '^VIX': 'Volatility Index'
  }
  return indexNames[symbol] || symbol
}

const formatNumber = (num: number): string => {
  if (num >= 1e9) return (num / 1e9).toFixed(1) + 'B'
  if (num >= 1e6) return (num / 1e6).toFixed(1) + 'M'
  if (num >= 1e3) return (num / 1e3).toFixed(1) + 'K'
  return num.toString()
}
</script>

<style scoped>
.market-indices {
  margin: 2rem 0;
}

.section-title {
  font-family: 'Cinzel', serif;
  font-size: 2rem;
  font-weight: 600;
  color: #d4af37;
  text-align: center;
  margin-bottom: 2rem;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
}

.indices-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
}

.index-card {
  padding: 1.5rem;
  border: 2px solid rgba(212, 175, 55, 0.2);
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.index-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: linear-gradient(90deg, transparent, #d4af37, transparent);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.index-card.positive::before {
  background: linear-gradient(90deg, transparent, #10b981, transparent);
}

.index-card.negative::before {
  background: linear-gradient(90deg, transparent, #ef4444, transparent);
}

.index-card:hover::before {
  opacity: 1;
}

.index-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
  border-color: rgba(212, 175, 55, 0.4);
}

.index-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.index-name {
  font-family: 'Cinzel', serif;
  font-size: 1.2rem;
  font-weight: 600;
  color: #f4f1e8;
  margin: 0;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.3);
}

.index-symbol {
  font-family: 'Crimson Text', serif;
  font-size: 0.9rem;
  color: #d4af37;
  font-weight: 600;
  background: rgba(212, 175, 55, 0.1);
  padding: 0.25rem 0.5rem;
  border: 1px solid rgba(212, 175, 55, 0.3);
}

.index-price {
  margin-bottom: 1rem;
}

.price {
  display: block;
  font-family: 'Cinzel', serif;
  font-size: 1.8rem;
  font-weight: 700;
  color: #f4f1e8;
  margin-bottom: 0.25rem;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
}

.change {
  display: block;
  font-family: 'Crimson Text', serif;
  font-size: 1rem;
  font-weight: 600;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.3);
}

.index-card.positive .change {
  color: #10b981;
}

.index-card.negative .change {
  color: #ef4444;
}

.index-volume {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 1rem;
  border-top: 1px solid rgba(212, 175, 55, 0.2);
}

.volume-label {
  font-family: 'Crimson Text', serif;
  font-size: 0.9rem;
  color: #d4af37;
  font-weight: 600;
}

.volume-value {
  font-family: 'Cinzel', serif;
  font-size: 0.9rem;
  color: #f4f1e8;
  font-weight: 500;
}

/* Responsive Design */
@media (max-width: 768px) {
  .indices-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
  }

  .index-card {
    padding: 1.25rem;
  }

  .price {
    font-size: 1.5rem;
  }

  .index-name {
    font-size: 1.1rem;
  }
}
</style>
