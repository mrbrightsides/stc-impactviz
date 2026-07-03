# API Documentation

## STC ImpactViz Blockchain & Data APIs

This document provides comprehensive API documentation for STC ImpactViz's blockchain integration, data management, and export utilities.

---

## Table of Contents

- [Blockchain API](#blockchain-api)
- [Data Management API](#data-management-api)
- [Export Utilities](#export-utilities)
- [Currency Utilities](#currency-utilities)
- [Type Definitions](#type-definitions)

---

## Blockchain API

### Overview

The Blockchain API provides real-time integration with Ethereum Sepolia testnet via Infura. It supports transaction monitoring, network statistics, and address tracking.

**Base Endpoint:**
```
https://sepolia.infura.io/v3/f8d248f838ec4f12b0f01efd2b238206
```

**Location:** `src/lib/blockchain-api.ts`

---

### Functions

#### `fetchBlockchainData(blockCount?: number)`

Fetch real-time blockchain data from Sepolia network.

**Parameters:**
- `blockCount` (optional): Number of recent blocks to fetch. Default: `10`

**Returns:** `Promise<{ transactions: BlockchainTransaction[], stats: BlockchainStats }>`

**Example:**
```typescript
import { fetchBlockchainData } from '@/lib/blockchain-api'

const { transactions, stats } = await fetchBlockchainData(10)

console.log(`Current block: ${stats.currentBlock}`)
console.log(`Gas price: ${stats.gasPrice} Gwei`)
console.log(`Transactions: ${transactions.length}`)
```

**Response Structure:**
```typescript
{
  transactions: [
    {
      hash: "0x...",
      from: "0x...",
      to: "0x...",
      value: "1000000000000000000", // Wei
      gasUsed: "21000",
      gasPrice: "30000000000", // Wei
      blockNumber: 5000000,
      timestamp: 1704067200000,
      status: "success" | "failed"
    }
  ],
  stats: {
    currentBlock: 5000000,
    gasPrice: "30.00", // Gwei
    networkHashRate: "1.23 TH/s",
    difficulty: "1.23e+12",
    totalTransactions: 50
  }
}
```

---

#### `getTransaction(txHash: string)`

Get specific transaction details by hash.

**Parameters:**
- `txHash`: Transaction hash (0x...)

**Returns:** `Promise<BlockchainTransaction | null>`

**Example:**
```typescript
import { getTransaction } from '@/lib/blockchain-api'

const tx = await getTransaction('0x1234...')

if (tx) {
  console.log(`From: ${tx.from}`)
  console.log(`To: ${tx.to}`)
  console.log(`Value: ${weiToEther(tx.value)} ETH`)
  console.log(`Status: ${tx.status}`)
}
```

---

#### `monitorAddress(address: string, fromBlock?: number)`

Monitor specific Ethereum address for transactions.

**Parameters:**
- `address`: Ethereum address to monitor (0x...)
- `fromBlock` (optional): Starting block number. Default: `0`

**Returns:** `Promise<BlockchainTransaction[]>`

**Example:**
```typescript
import { monitorAddress } from '@/lib/blockchain-api'

const address = '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb'
const transactions = await monitorAddress(address)

console.log(`Found ${transactions.length} transactions`)
transactions.forEach(tx => {
  console.log(`${tx.hash}: ${weiToEther(tx.value)} ETH`)
})
```

**Note:** Scans up to 100 recent blocks for performance.

---

#### `getNetworkStats()`

Get current Ethereum Sepolia network statistics.

**Parameters:** None

**Returns:** `Promise<BlockchainStats>`

**Example:**
```typescript
import { getNetworkStats } from '@/lib/blockchain-api'

const stats = await getNetworkStats()

console.log(`Current Block: ${stats.currentBlock}`)
console.log(`Gas Price: ${stats.gasPrice} Gwei`)
console.log(`Hash Rate: ${stats.networkHashRate}`)
console.log(`Difficulty: ${stats.difficulty}`)
```

---

### Utility Functions

#### `weiToEther(wei: string)`

Convert Wei to Ether.

**Parameters:**
- `wei`: Amount in Wei (string)

**Returns:** `string` - Amount in Ether (formatted to 6 decimals)

**Example:**
```typescript
import { weiToEther } from '@/lib/blockchain-api'

const wei = '1000000000000000000' // 1 ETH
const ether = weiToEther(wei)
console.log(ether) // "1.000000"
```

---

#### `gweiToWei(gwei: string)`

Convert Gwei to Wei.

**Parameters:**
- `gwei`: Amount in Gwei (string)

**Returns:** `string` - Amount in Wei

**Example:**
```typescript
import { gweiToWei } from '@/lib/blockchain-api'

const gwei = '30' // 30 Gwei
const wei = gweiToWei(gwei)
console.log(wei) // "30000000000"
```

---

### JSON-RPC Methods

The following JSON-RPC methods are used internally:

| Method | Description |
|--------|-------------|
| `eth_blockNumber` | Get current block number |
| `eth_gasPrice` | Get current gas price |
| `eth_getBlockByNumber` | Get block data with transactions |
| `eth_getTransactionByHash` | Get specific transaction |
| `eth_getTransactionReceipt` | Get transaction receipt |

---

## Data Management API

### Overview

Data Management API handles data persistence, CSV parsing, and sample data generation.

**Location:** `src/lib/sample-data.ts`

---

### Functions

#### `generateSampleData()`

Generate realistic sample tourism data for Bali.

**Parameters:** None

**Returns:** `STCData`

**Example:**
```typescript
import { generateSampleData } from '@/lib/sample-data'

const sampleData = generateSampleData()

console.log(`Transactions: ${sampleData.onChain.transactions.length}`)
console.log(`Bookings: ${sampleData.offChain.bookings.length}`)
console.log(`Reviews: ${sampleData.social.reviews.length}`)
console.log(`Sustainability Score: ${calculateScore(sampleData)}`)
```

**Generated Data:**
- 50 blockchain transactions
- 100 booking records
- 80 customer reviews
- Complete environmental metrics
- 8 Bali locations (Ubud, Seminyak, Canggu, etc.)

---

#### `saveDataToStorage(data: STCData | null)`

Save data to localStorage for persistence.

**Parameters:**
- `data`: STCData object or null to clear

**Returns:** `void`

**Example:**
```typescript
import { saveDataToStorage } from '@/lib/sample-data'

// Save data
saveDataToStorage(myData)

// Clear data
saveDataToStorage(null)
```

**Storage Key:** `stc-impactviz-data`

---

#### `loadDataFromStorage()`

Load data from localStorage.

**Parameters:** None

**Returns:** `STCData | null`

**Example:**
```typescript
import { loadDataFromStorage } from '@/lib/sample-data'

const savedData = loadDataFromStorage()

if (savedData) {
  console.log('Data loaded successfully')
  setData(savedData)
} else {
  console.log('No saved data found')
}
```

---

#### `parseCSVData(csvText: string)`

Parse CSV data into STCData format.

**Parameters:**
- `csvText`: CSV string with format `location, cost, duration, category`

**Returns:** `Partial<STCData> | null`

**Example:**
```typescript
import { parseCSVData } from '@/lib/sample-data'

const csv = `location, cost, duration, category
Ubud, 500000, 3, Hotel
Seminyak, 750000, 5, Resort
Canggu, 300000, 2, Hostel`

const parsedData = parseCSVData(csv)

if (parsedData) {
  console.log(`Parsed ${parsedData.offChain?.bookings.length} bookings`)
}
```

**CSV Format:**
```
location, cost, duration, category
Ubud, 500000, 3, Hotel
Seminyak, 750000, 5, Resort
```

---

## Export Utilities

### Overview

Export utilities provide chart and data export functionality in multiple formats.

**Location:** `src/lib/chart-export.ts`

---

### Functions

#### `exportChartAsImage(elementRef, options)`

Export a single chart/component as image.

**Parameters:**
- `elementRef`: React ref to DOM element
- `options`:
  - `filename`: Output filename (without extension)
  - `format`: 'png' | 'svg' | 'pdf'
  - `quality`: 0.0 to 1.0 (default: 0.95)
  - `scale`: Image scale factor (default: 2)

**Returns:** `Promise<void>`

**Example:**
```typescript
import { exportChartAsImage } from '@/lib/chart-export'

const chartRef = useRef<HTMLDivElement>(null)

const handleExport = async () => {
  await exportChartAsImage(chartRef, {
    filename: 'sustainability-chart',
    format: 'png',
    quality: 0.95,
    scale: 2
  })
}

return <div ref={chartRef}>Chart content</div>
```

---

#### `exportChartsAsPDF(elementRefs, options)`

Export multiple charts as single PDF.

**Parameters:**
- `elementRefs`: Array of React refs
- `options`:
  - `filename`: Output filename (without .pdf)
  - `title`: PDF document title
  - `scale`: Image scale factor (default: 2)

**Returns:** `Promise<void>`

**Example:**
```typescript
import { exportChartsAsPDF } from '@/lib/chart-export'

const chart1Ref = useRef<HTMLDivElement>(null)
const chart2Ref = useRef<HTMLDivElement>(null)
const chart3Ref = useRef<HTMLDivElement>(null)

const handleExportAll = async () => {
  await exportChartsAsPDF(
    [chart1Ref, chart2Ref, chart3Ref],
    {
      filename: 'quarterly-report',
      title: 'Q1 2024 Sustainability Report'
    }
  )
}
```

**PDF Features:**
- A4 page size
- Auto-pagination
- High-quality images (scale 2x)
- Professional formatting

---

## Currency Utilities

### Overview

Currency utilities handle multi-currency support and formatting.

**Location:** `src/lib/currency.ts`

---

### Functions

#### `formatCurrency(amount: number, currency: Currency)`

Format number as currency string.

**Parameters:**
- `amount`: Numeric amount
- `currency`: 'USD' | 'IDR'

**Returns:** `string`

**Example:**
```typescript
import { formatCurrency } from '@/lib/currency'

console.log(formatCurrency(1500, 'USD')) // "$1,500.00"
console.log(formatCurrency(1500000, 'IDR')) // "Rp1.500.000"
```

---

#### `convertCurrency(amount: number, from: Currency, to: Currency)`

Convert between currencies.

**Parameters:**
- `amount`: Amount to convert
- `from`: Source currency
- `to`: Target currency

**Returns:** `number`

**Example:**
```typescript
import { convertCurrency } from '@/lib/currency'

const usd = 100
const idr = convertCurrency(usd, 'USD', 'IDR')
console.log(idr) // 1575000

const backToUsd = convertCurrency(idr, 'IDR', 'USD')
console.log(backToUsd) // 100
```

**Exchange Rates:**
- USD: 1.0 (base)
- IDR: 15,750 (1 USD = 15,750 IDR)

---

## Type Definitions

### STCData

```typescript
interface STCData {
  onChain: {
    transactions: Array<{
      hash: string
      gasUsed: number
      tokenAmount: number
      timestamp: number
      blockNumber: number
    }>
    totalVolume: number
    avgGasFee: number
    uniqueAddresses: number
  }
  offChain: {
    bookings: Array<{
      id: string
      location: string
      duration: number
      cost: number
      timestamp: number
      category: string
    }>
    totalBookings: number
    avgSpending: number
    popularLocations: Array<{ name: string; count: number }>
  }
  social: {
    reviews: Array<{
      id: string
      rating: number
      sentiment: 'positive' | 'negative' | 'neutral'
      timestamp: number
      location: string
      comment: string
    }>
    avgRating: number
    totalReviews: number
    sentimentDistribution: {
      positive: number
      negative: number
      neutral: number
    }
  }
  environmental: {
    totalEnergyConsumption: number // kWh
    co2Equivalent: number // kg CO2
    efficiencyScore: number // 0-100
    renewableEnergyPercent: number // 0-100
  }
}
```

### BlockchainTransaction

```typescript
interface BlockchainTransaction {
  hash: string
  from: string
  to: string
  value: string // Wei
  gasUsed: string
  gasPrice: string // Wei
  blockNumber: number
  timestamp: number // Unix timestamp
  status: 'success' | 'failed'
}
```

### BlockchainStats

```typescript
interface BlockchainStats {
  currentBlock: number
  gasPrice: string // Gwei
  networkHashRate: string
  difficulty: string
  totalTransactions: number
}
```

---

## Error Handling

All API functions use try-catch blocks and return appropriate error messages:

```typescript
try {
  const data = await fetchBlockchainData()
  // Success handling
} catch (error) {
  console.error('Failed to fetch blockchain data:', error)
  // Error handling
}
```

**Common Errors:**
- Network timeout
- Invalid transaction hash
- RPC endpoint unavailable
- Insufficient data

---

## Rate Limiting

**Infura Free Tier:**
- 100,000 requests per day
- 10 requests per second
- No credit card required

**Recommendations:**
- Implement caching for repeated requests
- Use auto-refresh sparingly (30s intervals)
- Batch requests when possible

---

## Security Considerations

1. **API Key Exposure:** Current implementation uses public Infura endpoint. For production, use environment variables.

2. **Data Validation:** Always validate API responses before processing.

3. **Error Messages:** Don't expose sensitive information in error messages.

4. **Rate Limiting:** Implement client-side rate limiting to avoid API throttling.

---

## Support

For API support and questions:
- GitHub Issues: [Report Issue](https://github.com/yourusername/stc-impactviz/issues)
- Email: api-support@stc-impactviz.com
- Documentation: [Full Docs](https://docs.stc-impactviz.com)

---

**Last Updated:** 2024
**Version:** 1.0.0
