<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch, nextTick } from 'vue'
import { Chart, registerables } from 'chart.js'

Chart.register(...registerables)

interface ChartData {
  date: string
  price: number
}

interface Props {
  data: ChartData[]
  isLoading: boolean
  selectedTimeframe: string
}

const props = defineProps<Props>()

const chartRef = ref<HTMLCanvasElement>()
const chartInstance = ref<Chart | null>(null)
const isCreatingChart = ref(false)
const chartCreationTimeout = ref<NodeJS.Timeout | null>(null)

const createChart = () => {
  console.log('createChart called - chartRef:', !!chartRef.value, 'isCreating:', isCreatingChart.value, 'hasInstance:', !!chartInstance.value)

  if (!chartRef.value || isCreatingChart.value) {
    console.log('Skipping chart creation - missing ref or creating')
    return
  }

  if (chartInstance.value) {
    console.log('Chart already exists, destroying first')
    destroyChart()
    return
  }

  console.log('Creating chart with data:', props.data.length, 'points')
  console.log('Canvas element:', chartRef.value)
  console.log('Canvas dimensions:', chartRef.value?.width, 'x', chartRef.value?.height)
  console.log('Canvas client dimensions:', chartRef.value?.clientWidth, 'x', chartRef.value?.clientHeight)

  isCreatingChart.value = true

  // Destroy existing chart if any
  if (chartInstance.value) {
    chartInstance.value.destroy()
    chartInstance.value = null
  }

  try {
    // Ensure canvas has proper dimensions
    if (chartRef.value) {
      // Check for existing chart on this canvas and destroy it
      const existingChart = Chart.getChart(chartRef.value)
      if (existingChart) {
        console.log('Found existing chart on canvas, destroying it first')
        existingChart.destroy()
      }

      chartRef.value.width = chartRef.value.clientWidth
      chartRef.value.height = chartRef.value.clientHeight
      console.log('Set canvas dimensions to:', chartRef.value.width, 'x', chartRef.value.height)

      // Clear any existing chart data from canvas
      const ctx = chartRef.value.getContext('2d')
      if (ctx) {
        ctx.clearRect(0, 0, chartRef.value.width, chartRef.value.height)
      }
    }

    const labels = props.data.map(d => {
      const date = new Date(d.date)
      if (props.selectedTimeframe === '1D') {
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', hour12: false })
      } else {
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
      }
    })

    const prices = props.data.map(d => d.price)
    const minPrice = Math.min(...prices)
    const maxPrice = Math.max(...prices)
    const padding = (maxPrice - minPrice) * 0.1

    console.log('Chart data:', { labels: labels.length, prices: prices.length, minPrice, maxPrice })

    chartInstance.value = new Chart(chartRef.value, {
      type: 'line',
      data: {
        labels,
        datasets: [{
          label: 'Price',
          data: prices,
          borderColor: '#00d4ff',
          backgroundColor: 'rgba(0, 212, 255, 0.1)',
          borderWidth: 2,
          fill: true,
          tension: 0.1,
          pointBackgroundColor: '#00d4ff',
          pointBorderColor: '#ffffff',
          pointRadius: 3,
          pointHoverRadius: 5,
          pointBorderWidth: 2,
          pointHoverBackgroundColor: '#ffffff',
          pointHoverBorderColor: '#00d4ff',
          pointHoverBorderWidth: 2,
          spanGaps: false,
          showLine: true
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false
          },
          tooltip: {
            backgroundColor: 'rgba(0, 0, 0, 0.9)',
            titleColor: '#00d4ff',
            bodyColor: '#ffffff',
            borderColor: '#00d4ff',
            borderWidth: 1,
            cornerRadius: 6,
            displayColors: false,
            callbacks: {
              label: (context) => `$${context.parsed.y.toFixed(2)}`
            }
          }
        },
        scales: {
          x: {
            display: true,
            grid: {
              color: 'rgba(0, 212, 255, 0.1)',
              drawBorder: false
            },
            ticks: {
              color: '#00d4ff',
              font: {
                family: 'IBM Plex Mono',
                size: 10
              },
              maxTicksLimit: 8,
              maxRotation: 45,
              minRotation: 0
            }
          },
          y: {
            display: true,
            grid: {
              color: 'rgba(0, 212, 255, 0.1)',
              drawBorder: false
            },
            ticks: {
              color: '#00d4ff',
              font: {
                family: 'IBM Plex Mono',
                size: 11
              },
              callback: (value) => `$${Number(value).toFixed(2)}`
            },
            min: minPrice - padding,
            max: maxPrice + padding,
            beginAtZero: false
          }
        },
        interaction: {
          intersect: false,
          mode: 'index'
        },
        elements: {
          point: {
            hoverBackgroundColor: '#ffffff'
          }
        }
      }
    })

    console.log('Chart created successfully:', !!chartInstance.value)

    // Force chart to render
    if (chartInstance.value) {
      chartInstance.value.update('none')
      console.log('Chart update called after creation')

      // Try to resize and update again after a short delay
      setTimeout(() => {
        if (chartInstance.value) {
          chartInstance.value.resize()
          chartInstance.value.update('none')
          console.log('Chart resize and update called')
        }
      }, 100)
    }
  } catch (error) {
    console.error('Error creating chart:', error)
    chartInstance.value = null
  } finally {
    isCreatingChart.value = false
  }
}

const destroyChart = () => {
  if (chartInstance.value) {
    console.log('Destroying chart with ID:', chartInstance.value.id)
    try {
      // Properly destroy the chart and clear from Chart.js registry
      chartInstance.value.destroy()
    } catch (error) {
      console.error('Error destroying chart:', error)
    }
    chartInstance.value = null
  }

  // Also check for any chart on the canvas and destroy it
  if (chartRef.value) {
    const existingChart = Chart.getChart(chartRef.value)
    if (existingChart) {
      console.log('Found additional chart on canvas, destroying it')
      try {
        existingChart.destroy()
      } catch (error) {
        console.error('Error destroying additional chart:', error)
      }
    }

    // Clear the canvas context completely
    const ctx = chartRef.value.getContext('2d')
    if (ctx) {
      ctx.clearRect(0, 0, chartRef.value.width, chartRef.value.height)
    }
  }
}

// Simple chart creation with proper cleanup
const createChartSafely = () => {
  if (chartCreationTimeout.value) {
    clearTimeout(chartCreationTimeout.value)
  }

  chartCreationTimeout.value = setTimeout(() => {
    if (props.data.length > 0 && !isCreatingChart.value) {
      // Always destroy existing chart first
      if (chartInstance.value) {
        console.log('Destroying existing chart before creating new one')
        destroyChart()
      }

      // Wait a bit for destruction to complete, then create
      setTimeout(() => {
        if (!isCreatingChart.value) {
          createChart()
        }
      }, 150)
    }
  }, 200)
}

// Simple watcher - only create chart when data changes and we don't have one
watch(() => props.data, (newData) => {
  console.log('Data watcher triggered - data length:', newData.length, 'hasChart:', !!chartInstance.value, 'isCreating:', isCreatingChart.value)

  if (newData.length > 0) {
    createChartSafely()
  }
}, { immediate: true })

// Watch for loading state
watch(() => props.isLoading, (isLoading) => {
  if (!isLoading && props.data.length > 0 && !chartInstance.value && !isCreatingChart.value) {
    nextTick(() => {
      createChart()
    })
  }
})

onMounted(() => {
  console.log('PriceChart mounted, data length:', props.data.length, 'hasChart:', !!chartInstance.value, 'isCreating:', isCreatingChart.value)
  if (props.data.length > 0) {
    createChartSafely()
  }
})

onUnmounted(() => {
  if (chartCreationTimeout.value) {
    clearTimeout(chartCreationTimeout.value)
  }
  destroyChart()
})
</script>

<template>
  <div class="chart-container">
    <div v-if="isLoading" class="loading-state">
      <div class="loading-spinner"></div>
      <p>Loading chart data...</p>
    </div>
    <div v-else-if="!data.length" class="no-data">
      <p>No data available</p>
    </div>
    <div v-else class="chart-wrapper">
      <canvas ref="chartRef"></canvas>
      <div class="chart-debug">Chart Container ({{ data.length }} points)</div>
    </div>
  </div>
</template>

<style scoped>
.chart-container {
  width: 100%;
  height: 100%;
  position: relative;
}

.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 300px;
  color: #00d4ff;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 3px solid rgba(0, 212, 255, 0.3);
  border-top: 3px solid #00d4ff;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 1rem;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.no-data {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 300px;
  color: #666;
  font-style: italic;
}

.chart-wrapper {
  width: 100%;
  height: 350px;
  position: relative;
}

canvas {
  width: 100% !important;
  height: 100% !important;
}

.chart-debug {
  position: absolute;
  top: 10px;
  left: 10px;
  background: rgba(0, 212, 255, 0.2);
  color: #00d4ff;
  padding: 5px 10px;
  border-radius: 4px;
  font-size: 12px;
  font-family: 'IBM Plex Mono', monospace;
  z-index: 10;
}
</style>
