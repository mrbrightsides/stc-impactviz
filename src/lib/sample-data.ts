// Sample data for demo purposes
export interface STCData {
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
    sentimentDistribution: { positive: number; negative: number; neutral: number }
  }
  environmental: {
    totalEnergyConsumption: number
    co2Equivalent: number
    efficiencyScore: number
    renewableEnergyPercent: number
  }
}

// Generate realistic sample data for Bali tourism
export function generateSampleData(): STCData {
  const now = Date.now()
  const oneDay = 24 * 60 * 60 * 1000

  // Sample locations in Bali
  const locations = [
    'Ubud',
    'Seminyak', 
    'Canggu',
    'Nusa Dua',
    'Sanur',
    'Uluwatu',
    'Kuta',
    'Jimbaran'
  ]

  // Sample categories
  const categories = [
    'Hotel',
    'Restaurant',
    'Tour',
    'Spa',
    'Activity',
    'Transport'
  ]

  // Generate sample transactions (last 30 days)
  const transactions = Array.from({ length: 50 }, (_, i) => ({
    hash: `0x${Math.random().toString(16).substring(2, 42)}`,
    gasUsed: Math.floor(Math.random() * 100000) + 21000,
    tokenAmount: Math.floor(Math.random() * 10000) + 100,
    timestamp: now - Math.floor(Math.random() * 30 * oneDay),
    blockNumber: 15000000 + i
  }))

  // Generate sample bookings
  const bookings = Array.from({ length: 100 }, (_, i) => ({
    id: `BK${String(i + 1).padStart(5, '0')}`,
    location: locations[Math.floor(Math.random() * locations.length)],
    duration: Math.floor(Math.random() * 7) + 1,
    cost: Math.floor(Math.random() * 5000000) + 500000, // IDR
    timestamp: now - Math.floor(Math.random() * 30 * oneDay),
    category: categories[Math.floor(Math.random() * categories.length)]
  }))

  // Generate sample reviews
  const sentiments: Array<'positive' | 'negative' | 'neutral'> = ['positive', 'negative', 'neutral']
  const reviews = Array.from({ length: 80 }, (_, i) => {
    const sentiment = Math.random() > 0.7 ? 'positive' : Math.random() > 0.15 ? 'neutral' : 'negative'
    const rating = sentiment === 'positive' ? Math.floor(Math.random() * 2) + 4 : sentiment === 'neutral' ? 3 : Math.floor(Math.random() * 2) + 1
    
    return {
      id: `RV${String(i + 1).padStart(5, '0')}`,
      rating,
      sentiment,
      timestamp: now - Math.floor(Math.random() * 30 * oneDay),
      location: locations[Math.floor(Math.random() * locations.length)],
      comment: `Great experience in Bali! ${sentiment === 'positive' ? 'Highly recommended!' : sentiment === 'neutral' ? 'It was okay.' : 'Could be better.'}`
    }
  })

  // Calculate aggregated data
  const totalVolume = transactions.reduce((sum, tx) => sum + tx.tokenAmount, 0)
  const avgGasFee = transactions.reduce((sum, tx) => sum + tx.gasUsed, 0) / transactions.length
  const uniqueAddresses = Math.floor(transactions.length * 0.7)

  const totalBookings = bookings.length
  const avgSpending = bookings.reduce((sum, b) => sum + b.cost, 0) / bookings.length
  
  // Popular locations
  const locationCounts: Record<string, number> = {}
  bookings.forEach(b => {
    locationCounts[b.location] = (locationCounts[b.location] || 0) + 1
  })
  const popularLocations = Object.entries(locationCounts)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5)

  const totalReviews = reviews.length
  const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
  const sentimentDistribution = {
    positive: reviews.filter(r => r.sentiment === 'positive').length,
    negative: reviews.filter(r => r.sentiment === 'negative').length,
    neutral: reviews.filter(r => r.sentiment === 'neutral').length
  }

  // Environmental data (based on tourism activity)
  const totalEnergyConsumption = Math.floor(totalBookings * 150 + Math.random() * 5000) // kWh
  const co2Equivalent = Math.floor(totalEnergyConsumption * 0.5 + Math.random() * 1000) // kg
  const efficiencyScore = Math.floor(65 + Math.random() * 25) // 65-90
  const renewableEnergyPercent = Math.floor(25 + Math.random() * 35) // 25-60%

  return {
    onChain: {
      transactions,
      totalVolume,
      avgGasFee,
      uniqueAddresses
    },
    offChain: {
      bookings,
      totalBookings,
      avgSpending,
      popularLocations
    },
    social: {
      reviews,
      avgRating,
      totalReviews,
      sentimentDistribution
    },
    environmental: {
      totalEnergyConsumption,
      co2Equivalent,
      efficiencyScore,
      renewableEnergyPercent
    }
  }
}

// Storage key for localStorage
export const STORAGE_KEY = 'stc-impactviz-data'

// Save data to localStorage
export function saveDataToStorage(data: STCData | null): void {
  try {
    if (data) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
      console.log('Data saved to localStorage')
    } else {
      localStorage.removeItem(STORAGE_KEY)
      console.log('Data removed from localStorage')
    }
  } catch (error) {
    console.error('Failed to save data to localStorage:', error)
  }
}

// Load data from localStorage
export function loadDataFromStorage(): STCData | null {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      console.log('Data loaded from localStorage')
      return JSON.parse(stored) as STCData
    }
  } catch (error) {
    console.error('Failed to load data from localStorage:', error)
  }
  return null
}

// Parse CSV data
export function parseCSVData(csvText: string): Partial<STCData> | null {
  try {
    const lines = csvText.trim().split('\n')
    if (lines.length < 2) {
      throw new Error('CSV must have at least a header row and one data row')
    }

    const headers = lines[0].split(',').map(h => h.trim())
    const data: Partial<STCData> = {
      onChain: {
        transactions: [],
        totalVolume: 0,
        avgGasFee: 0,
        uniqueAddresses: 0
      },
      offChain: {
        bookings: [],
        totalBookings: 0,
        avgSpending: 0,
        popularLocations: []
      }
    }

    // Parse each data row
    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',').map(v => v.trim())
      
      // Simple parsing - assuming CSV has columns: location, cost, duration, category
      if (values.length >= 4) {
        const booking = {
          id: `BK${String(i).padStart(5, '0')}`,
          location: values[0] || 'Unknown',
          cost: parseFloat(values[1]) || 0,
          duration: parseInt(values[2]) || 1,
          timestamp: Date.now(),
          category: values[3] || 'Other'
        }
        data.offChain!.bookings.push(booking)
      }
    }

    // Calculate aggregates
    if (data.offChain!.bookings.length > 0) {
      data.offChain!.totalBookings = data.offChain!.bookings.length
      data.offChain!.avgSpending = data.offChain!.bookings.reduce((sum, b) => sum + b.cost, 0) / data.offChain!.bookings.length
      
      // Popular locations
      const locationCounts: Record<string, number> = {}
      data.offChain!.bookings.forEach(b => {
        locationCounts[b.location] = (locationCounts[b.location] || 0) + 1
      })
      data.offChain!.popularLocations = Object.entries(locationCounts)
        .map(([name, count]) => ({ name, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 5)
    }

    return data
  } catch (error) {
    console.error('Failed to parse CSV:', error)
    return null
  }
}
