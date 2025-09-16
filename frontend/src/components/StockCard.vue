<template>
  <div class="stock-card glass-effect">
    <div class="stock-header">
      <div class="stock-symbol">
        <h3>{{ stockData?.symbol || 'N/A' }}</h3>
        <p class="stock-name">{{ stockData?.name || 'Loading...' }}</p>
      </div>
      <div class="stock-price">
        <span class="price" :class="{ 'positive': isPositiveChange, 'negative': !isPositiveChange }">
          {{ formattedPrice }}
        </span>
        <span class="change" :class="{ 'positive': isPositiveChange, 'negative': !isPositiveChange }">
          {{ formattedChange }}
        </span>
      </div>
    </div>

    <div class="stock-details" v-if="stockData">
      <div class="detail-row">
        <span class="label">Volume:</span>
        <span class="value">{{ formatNumber(stockData.volume) }}</span>
      </div>
      <div class="detail-row" v-if="stockData.marketCap">
        <span class="label">Market Cap:</span>
        <span class="value">{{ formatMarketCap(stockData.marketCap) }}</span>
      </div>
      <div class="detail-row" v-if="stockData.pe">
        <span class="label">P/E Ratio:</span>
        <span class="value">{{ stockData.pe.toFixed(2) }}</span>
      </div>
      <div class="detail-row" v-if="stockData.high52Week">
        <span class="label">52W High:</span>
        <span class="value">${{ stockData.high52Week.toFixed(2) }}</span>
      </div>
      <div class="detail-row" v-if="stockData.low52Week">
        <span class="label">52W Low:</span>
        <span class="value">${{ stockData.low52Week.toFixed(2) }}</span>
      </div>
    </div>

    <div class="loading-spinner" v-if="loading">
      <div class="spinner"></div>
      <p>Loading stock data...</p>
    </div>

    <div class="error-message" v-if="error">
      <p>{{ error }}</p>
      <button @click="$emit('retry')" class="btn-secondary">Retry</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { StockData } from '../services/stockService'

interface Props {
  stockData: StockData | null
  loading: boolean
  error: string | null
}

const props = defineProps<Props>()

defineEmits<{
  retry: []
}>()

const isPositiveChange = computed(() => {
  return props.stockData ? props.stockData.change >= 0 : false
})

const formattedPrice = computed(() => {
  if (!props.stockData) return '$0.00'
  return `$${props.stockData.currentPrice.toFixed(2)}`
})

const formattedChange = computed(() => {
  if (!props.stockData) return '+$0.00 (0.00%)'
  const sign = props.stockData.change >= 0 ? '+' : ''
  return `${sign}$${props.stockData.change.toFixed(2)} (${sign}${props.stockData.changePercent.toFixed(2)}%)`
})

const formatNumber = (num: number): string => {
  if (num >= 1e9) return (num / 1e9).toFixed(1) + 'B'
  if (num >= 1e6) return (num / 1e6).toFixed(1) + 'M'
  if (num >= 1e3) return (num / 1e3).toFixed(1) + 'K'
  return num.toString()
}

const formatMarketCap = (marketCap: number): string => {
  if (marketCap >= 1e12) return '$' + (marketCap / 1e12).toFixed(1) + 'T'
  if (marketCap >= 1e9) return '$' + (marketCap / 1e9).toFixed(1) + 'B'
  if (marketCap >= 1e6) return '$' + (marketCap / 1e6).toFixed(1) + 'M'
  return '$' + marketCap.toString()
}
</script>

<style scoped>
.stock-card {
  padding: 2rem;
  margin: 1rem 0;
  border: 2px solid rgba(212, 175, 55, 0.2);
  position: relative;
  overflow: hidden;
}

.stock-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid rgba(212, 175, 55, 0.2);
}

.stock-symbol h3 {
  font-family: 'Cinzel', serif;
  font-size: 1.8rem;
  font-weight: 600;
  color: #d4af37;
  margin: 0 0 0.5rem 0;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.3);
}

.stock-name {
  font-family: 'Crimson Text', serif;
  font-size: 1rem;
  color: #f4f1e8;
  margin: 0;
  opacity: 0.8;
}

.stock-price {
  text-align: right;
}

.price {
  display: block;
  font-family: 'Cinzel', serif;
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 0.25rem;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
}

.price.positive {
  color: #10b981;
}

.price.negative {
  color: #ef4444;
}

.change {
  display: block;
  font-family: 'Crimson Text', serif;
  font-size: 1rem;
  font-weight: 600;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.3);
}

.change.positive {
  color: #10b981;
}

.change.negative {
  color: #ef4444;
}

.stock-details {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
}

.detail-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 0;
  border-bottom: 1px solid rgba(212, 175, 55, 0.1);
}

.detail-row:last-child {
  border-bottom: none;
}

.label {
  font-family: 'Crimson Text', serif;
  font-size: 0.9rem;
  color: #d4af37;
  font-weight: 600;
}

.value {
  font-family: 'Cinzel', serif;
  font-size: 0.9rem;
  color: #f4f1e8;
  font-weight: 500;
}

.loading-spinner {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  text-align: center;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 3px solid rgba(212, 175, 55, 0.3);
  border-top: 3px solid #d4af37;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 1rem;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.loading-spinner p {
  font-family: 'Crimson Text', serif;
  color: #f4f1e8;
  margin: 0;
}

.error-message {
  text-align: center;
  padding: 2rem;
}

.error-message p {
  font-family: 'Crimson Text', serif;
  color: #ef4444;
  margin-bottom: 1rem;
}

.error-message .btn-secondary {
  font-size: 0.9rem;
  padding: 0.75rem 1.5rem;
}

/* Responsive Design */
@media (max-width: 768px) {
  .stock-card {
    padding: 1.5rem;
  }

  .stock-header {
    flex-direction: column;
    gap: 1rem;
  }

  .stock-price {
    text-align: left;
  }

  .price {
    font-size: 1.5rem;
  }

  .stock-details {
    grid-template-columns: 1fr;
  }
}
</style>
