'use client'

import React, { useState, useEffect, useMemo } from 'react'
import dynamic from 'next/dynamic'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Slider } from '@/components/ui/slider'
import { Separator } from '@/components/ui/separator'
import { 
  Globe, 
  Map, 
  MapPin, 
  TrendingUp, 
  Users, 
  Leaf, 
  BarChart3, 
  Filter,
  Layers,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Download,
  Info
} from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts'
import { useCurrency } from '@/hooks/use-currency'
import { formatCurrency, formatCurrencyCompact } from '@/lib/currency'

// Dynamic import for Leaflet components (client-side only)
const MapContainer = dynamic(() => import('react-leaflet').then((mod) => mod.MapContainer), { 
  ssr: false, 
  loading: () => (
    <div className="h-full w-full flex items-center justify-center bg-gray-50 dark:bg-gray-900 rounded-lg">
      <div className="text-center">
        <Globe className="h-8 w-8 text-blue-500 mx-auto mb-2 animate-spin" />
        <p className="text-sm text-gray-600 dark:text-gray-400">Loading Interactive Map...</p>
      </div>
    </div>
  )
})
const TileLayer = dynamic(() => import('react-leaflet').then((mod) => mod.TileLayer), { ssr: false })
const Marker = dynamic(() => import('react-leaflet').then((mod) => mod.Marker), { ssr: false })
const Popup = dynamic(() => import('react-leaflet').then((mod) => mod.Popup), { ssr: false })
const CircleMarker = dynamic(() => import('react-leaflet').then((mod) => mod.CircleMarker), { ssr: false })
const ZoomControl = dynamic(() => import('react-leaflet').then((mod) => mod.ZoomControl), { ssr: false })
const ScaleControl = dynamic(() => import('react-leaflet').then((mod) => mod.ScaleControl), { ssr: false })

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
    sentimentDistribution: { positive: number; negative: number; neutral: number }
  }
  environmental: {
    totalEnergyConsumption: number
    co2Equivalent: number
    efficiencyScore: number
    renewableEnergyPercent: number
  }
}

interface InteractiveGeoDashboardProps {
  data: STCData
}

interface LocationData {
  id: string
  name: string
  country: string
  region: string
  lat: number
  lng: number
  bookings: number
  revenue: number
  avgRating: number
  co2Impact: number
  renewablePercent: number
  tourismType: string[]
  population: number
  gdpContribution: number
}

type ViewLevel = 'global' | 'regional' | 'local'
type MetricType = 'economic' | 'social' | 'environmental'

const locationDatabase: LocationData[] = [
  {
    id: 'bali-indonesia',
    name: 'Bali',
    country: 'Indonesia',
    region: 'Southeast Asia',
    lat: -8.4095,
    lng: 115.1889,
    bookings: 1250,
    revenue: 2850000,
    avgRating: 4.6,
    co2Impact: 15.2,
    renewablePercent: 75,
    tourismType: ['Cultural', 'Beach', 'Eco-tourism'],
    population: 4336000,
    gdpContribution: 18.5
  },
  {
    id: 'kyoto-japan',
    name: 'Kyoto',
    country: 'Japan',
    region: 'East Asia',
    lat: 35.0116,
    lng: 135.7681,
    bookings: 890,
    revenue: 3200000,
    avgRating: 4.8,
    co2Impact: 8.7,
    renewablePercent: 85,
    tourismType: ['Cultural', 'Historical'],
    population: 1474000,
    gdpContribution: 22.3
  },
  {
    id: 'rome-italy',
    name: 'Rome',
    country: 'Italy',
    region: 'Europe',
    lat: 41.9028,
    lng: 12.4964,
    bookings: 1420,
    revenue: 4100000,
    avgRating: 4.5,
    co2Impact: 12.3,
    renewablePercent: 65,
    tourismType: ['Historical', 'Cultural', 'Urban'],
    population: 2873000,
    gdpContribution: 25.7
  },
  {
    id: 'reykjavik-iceland',
    name: 'Reykjavik',
    country: 'Iceland',
    region: 'Europe',
    lat: 64.1466,
    lng: -21.9426,
    bookings: 560,
    revenue: 1890000,
    avgRating: 4.7,
    co2Impact: 3.2,
    renewablePercent: 98,
    tourismType: ['Eco-tourism', 'Adventure'],
    population: 131136,
    gdpContribution: 42.1
  },
  {
    id: 'capetown-southafrica',
    name: 'Cape Town',
    country: 'South Africa',
    region: 'Africa',
    lat: -33.9249,
    lng: 18.4241,
    bookings: 780,
    revenue: 2250000,
    avgRating: 4.4,
    co2Impact: 18.9,
    renewablePercent: 45,
    tourismType: ['Adventure', 'Cultural', 'Wine'],
    population: 4617560,
    gdpContribution: 15.2
  },
  {
    id: 'cusco-peru',
    name: 'Cusco',
    country: 'Peru',
    region: 'South America',
    lat: -13.5319,
    lng: -71.9675,
    bookings: 650,
    revenue: 1750000,
    avgRating: 4.3,
    co2Impact: 14.5,
    renewablePercent: 55,
    tourismType: ['Cultural', 'Adventure', 'Historical'],
    population: 428450,
    gdpContribution: 35.8
  },
  {
    id: 'auckland-newzealand',
    name: 'Auckland',
    country: 'New Zealand',
    region: 'Oceania',
    lat: -36.8485,
    lng: 174.7633,
    bookings: 720,
    revenue: 2980000,
    avgRating: 4.6,
    co2Impact: 9.1,
    renewablePercent: 82,
    tourismType: ['Adventure', 'Eco-tourism', 'Urban'],
    population: 1717400,
    gdpContribution: 19.4
  },
  {
    id: 'bangkok-thailand',
    name: 'Bangkok',
    country: 'Thailand',
    region: 'Southeast Asia',
    lat: 13.7563,
    lng: 100.5018,
    bookings: 1680,
    revenue: 3750000,
    avgRating: 4.2,
    co2Impact: 21.4,
    renewablePercent: 38,
    tourismType: ['Urban', 'Cultural', 'Food'],
    population: 10539000,
    gdpContribution: 28.6
  }
]

export function InteractiveGeoDashboard({ data }: InteractiveGeoDashboardProps): JSX.Element {
  const { currency } = useCurrency()
  const [viewLevel, setViewLevel] = useState<ViewLevel>('global')
  const [selectedMetric, setSelectedMetric] = useState<MetricType>('economic')
  const [selectedLocation, setSelectedLocation] = useState<LocationData | null>(null)
  const [mapCenter, setMapCenter] = useState<[number, number]>([20, 0])
  const [mapZoom, setMapZoom] = useState(2)
  const [yearRange, setYearRange] = useState([2023, 2024])
  const [tourismFilter, setTourismFilter] = useState<string>('all')
  const [isClient, setIsClient] = useState(false)
  const [mapLoaded, setMapLoaded] = useState(false)
  const [fullscreenMap, setFullscreenMap] = useState(false)

  useEffect(() => {
    setIsClient(true)
    // Preload Leaflet CSS for better performance
    if (typeof window !== 'undefined') {
      const link = document.createElement('link')
      link.rel = 'stylesheet'
      link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css'
      document.head.appendChild(link)
    }
  }, [])

  // Enhanced location data with calculations
  const enrichedLocations = useMemo(() => {
    return locationDatabase.map(location => {
      // Calculate relative metrics based on data
      const relativeBookings = Math.floor((location.bookings / 1680) * data.offChain.totalBookings)
      const relativeRevenue = Math.floor((location.revenue / 4100000) * data.onChain.totalVolume)
      const sustainability = (location.renewablePercent + (100 - location.co2Impact * 3)) / 2

      return {
        ...location,
        bookings: relativeBookings,
        revenue: relativeRevenue,
        sustainabilityScore: Math.round(sustainability),
        impact: selectedMetric === 'economic' ? relativeRevenue : 
                selectedMetric === 'social' ? location.avgRating * 20 :
                sustainability
      }
    })
  }, [data, selectedMetric])

  // Filter locations based on tourism type
  const filteredLocations = useMemo(() => {
    if (tourismFilter === 'all') return enrichedLocations
    return enrichedLocations.filter(loc => loc.tourismType.includes(tourismFilter))
  }, [enrichedLocations, tourismFilter])

  // Regional aggregation for regional view
  const regionalData = useMemo(() => {
    const regions = filteredLocations.reduce((acc, location) => {
      if (!acc[location.region]) {
        acc[location.region] = {
          name: location.region,
          locations: [],
          totalBookings: 0,
          totalRevenue: 0,
          avgRating: 0,
          avgCO2: 0,
          avgRenewable: 0
        }
      }
      acc[location.region].locations.push(location)
      acc[location.region].totalBookings += location.bookings
      acc[location.region].totalRevenue += location.revenue
      return acc
    }, {} as Record<string, any>)

    return Object.values(regions).map((region: any) => ({
      ...region,
      avgRating: region.locations.reduce((sum: number, loc: LocationData) => sum + loc.avgRating, 0) / region.locations.length,
      avgCO2: region.locations.reduce((sum: number, loc: LocationData) => sum + loc.co2Impact, 0) / region.locations.length,
      avgRenewable: region.locations.reduce((sum: number, loc: LocationData) => sum + loc.renewablePercent, 0) / region.locations.length
    }))
  }, [filteredLocations])

  // Chart data preparation
  const chartData = useMemo(() => {
    const baseData = viewLevel === 'regional' ? regionalData : filteredLocations.slice(0, 8)
    
    return baseData.map(item => ({
      name: viewLevel === 'regional' ? item.name : item.name,
      economic: viewLevel === 'regional' ? item.totalRevenue : item.revenue,
      social: viewLevel === 'regional' ? item.avgRating * 20 : item.avgRating * 20,
      environmental: viewLevel === 'regional' ? item.avgRenewable : item.renewablePercent,
      bookings: viewLevel === 'regional' ? item.totalBookings : item.bookings,
      co2: viewLevel === 'regional' ? item.avgCO2 : item.co2Impact
    }))
  }, [viewLevel, regionalData, filteredLocations])

  const handleLocationClick = (location: LocationData): void => {
    setSelectedLocation(location)
    setMapCenter([location.lat, location.lng])
    setMapZoom(8)
    setViewLevel('local')
  }

  const handleZoomReset = React.useCallback((): void => {
    console.log('Interactive geo dashboard reset clicked')
    try {
      setMapCenter([20, 0])
      setMapZoom(2)
      setViewLevel('global')
      setSelectedLocation(null)
      console.log('Geo dashboard reset completed')
    } catch (error) {
      console.error('Geo dashboard reset failed:', error)
    }
  }, [])

  const getMarkerSize = (location: LocationData): number => {
    const maxImpact = Math.max(...filteredLocations.map(l => l.impact))
    const minSize = fullscreenMap ? 15 : 12
    const maxSize = fullscreenMap ? 40 : 28
    return minSize + ((location.impact / maxImpact) * (maxSize - minSize))
  }

  const getMarkerColor = (location: LocationData): string => {
    switch (selectedMetric) {
      case 'economic':
        return location.revenue > 2500000 ? '#059669' : location.revenue > 1500000 ? '#D97706' : '#DC2626'
      case 'social':
        return location.avgRating >= 4.5 ? '#059669' : location.avgRating >= 4.0 ? '#D97706' : '#DC2626'
      case 'environmental':
        return location.sustainabilityScore >= 80 ? '#059669' : location.sustainabilityScore >= 60 ? '#D97706' : '#DC2626'
      default:
        return '#6B7280'
    }
  }

  const handleExportMap = async (): Promise<void> => {
    // Simple implementation - can be enhanced with actual map export
    const mapData = {
      viewLevel,
      selectedMetric,
      tourismFilter,
      locations: filteredLocations.map(loc => ({
        name: loc.name,
        country: loc.country,
        coordinates: [loc.lat, loc.lng],
        metrics: {
          bookings: loc.bookings,
          revenue: loc.revenue,
          rating: loc.avgRating,
          sustainability: loc.sustainabilityScore,
          renewable: loc.renewablePercent
        }
      }))
    }
    
    const dataStr = JSON.stringify(mapData, null, 2)
    const dataBlob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(dataBlob)
    
    const link = document.createElement('a')
    link.href = url
    link.download = `sustainability-map-${selectedMetric}-${new Date().toISOString().split('T')[0]}.json`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  if (!isClient) {
    return (
      <div className="space-y-6">
        <Card>
          <CardContent className="flex items-center justify-center h-96">
            <div className="text-center">
              <Globe className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">Loading Interactive Geographic Dashboard...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Globe className="h-5 w-5 text-blue-500" />
            <span>Interactive Geographic Dashboard</span>
            <Badge variant="outline" className="ml-2">
              {viewLevel.charAt(0).toUpperCase() + viewLevel.slice(1)} View
            </Badge>
          </CardTitle>
          <CardDescription>
            Navigate through different geographical levels to explore sustainability impact across regions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center space-x-2">
              <Layers className="h-4 w-4" />
              <Select value={viewLevel} onValueChange={(value) => setViewLevel(value as ViewLevel)}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="global">Global</SelectItem>
                  <SelectItem value="regional">Regional</SelectItem>
                  <SelectItem value="local">Local</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center space-x-2">
              <BarChart3 className="h-4 w-4" />
              <Select value={selectedMetric} onValueChange={(value) => setSelectedMetric(value as MetricType)}>
                <SelectTrigger className="w-36">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="economic">Economic</SelectItem>
                  <SelectItem value="social">Social</SelectItem>
                  <SelectItem value="environmental">Environmental</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center space-x-2">
              <Filter className="h-4 w-4" />
              <Select value={tourismFilter} onValueChange={setTourismFilter}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="Cultural">Cultural</SelectItem>
                  <SelectItem value="Adventure">Adventure</SelectItem>
                  <SelectItem value="Eco-tourism">Eco-tourism</SelectItem>
                  <SelectItem value="Historical">Historical</SelectItem>
                  <SelectItem value="Urban">Urban</SelectItem>
                  <SelectItem value="Beach">Beach</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Separator orientation="vertical" className="h-6" />

            <div className="flex items-center space-x-2">
              <button 
                onClick={() => {
                  console.log('Geo dashboard reset button clicked - native')
                  handleZoomReset()
                }}
                className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 px-3 cursor-pointer"
                type="button"
              >
                <RotateCcw className="h-4 w-4 mr-2" />
                Reset View
              </button>
              <Button variant="outline" size="sm" onClick={handleExportMap}>
                <Download className="h-4 w-4 mr-2" />
                Export Data
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setFullscreenMap(!fullscreenMap)}
              >
                {fullscreenMap ? (
                  <ZoomOut className="h-4 w-4 mr-2" />
                ) : (
                  <ZoomIn className="h-4 w-4 mr-2" />
                )}
                {fullscreenMap ? 'Exit Fullscreen' : 'Fullscreen'}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Interactive Map */}
        <Card className={`transition-all duration-300 ${fullscreenMap ? 'fixed inset-4 z-50 bg-white dark:bg-gray-950' : 'lg:col-span-2'}`}>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Sustainability Impact Map</span>
              <div className="flex items-center space-x-2">
                <Badge variant={selectedMetric === 'economic' ? 'default' : 'outline'} className="bg-blue-600">
                  💰 Economic
                </Badge>
                <Badge variant={selectedMetric === 'social' ? 'default' : 'outline'} className="bg-purple-600">
                  👥 Social
                </Badge>
                <Badge variant={selectedMetric === 'environmental' ? 'default' : 'outline'} className="bg-green-600">
                  🌱 Environmental
                </Badge>
              </div>
            </CardTitle>
            <CardDescription>
              🖱️ Click locations to explore • 📏 Size = Impact magnitude • 🎨 Color = Performance level
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className={`rounded-lg overflow-hidden border-2 border-gray-200 dark:border-gray-700 shadow-lg ${fullscreenMap ? 'h-[calc(100vh-12rem)]' : 'h-[28rem] md:h-[32rem]'}`}>
              {isClient ? (
                <MapContainer
                  center={mapCenter}
                  zoom={mapZoom}
                  style={{ height: '100%', width: '100%' }}
                  scrollWheelZoom={true}
                  zoomControl={false}
                  whenCreated={() => setMapLoaded(true)}
                >
                  <TileLayer
                    url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
                    maxZoom={18}
                  />
                  <ZoomControl position="topright" />
                  <ScaleControl position="bottomright" />
                
                  {filteredLocations.map((location) => (
                    <CircleMarker
                      key={location.id}
                      center={[location.lat, location.lng]}
                      radius={getMarkerSize(location)}
                      pathOptions={{
                        fillColor: getMarkerColor(location),
                        color: '#ffffff',
                        weight: 3,
                        opacity: 1,
                        fillOpacity: 0.8
                      }}
                      eventHandlers={{
                        click: () => handleLocationClick(location),
                        mouseover: (e) => {
                          e.target.setStyle({
                            weight: 5,
                            opacity: 1,
                            fillOpacity: 1
                          })
                        },
                        mouseout: (e) => {
                          e.target.setStyle({
                            weight: 3,
                            opacity: 1,
                            fillOpacity: 0.8
                          })
                        }
                      }}
                    >
                      <Popup className="custom-popup">
                        <div className="p-3 min-w-[240px] bg-white dark:bg-gray-800 rounded-lg shadow-lg">
                          <div className="flex items-center space-x-2 mb-3">
                            <MapPin className="h-4 w-4 text-blue-500" />
                            <h4 className="font-bold text-base text-gray-900 dark:text-gray-100">
                              {location.name}, {location.country}
                            </h4>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-3 mb-3">
                            <div className="text-center p-2 bg-blue-50 dark:bg-blue-950/20 rounded">
                              <p className="text-lg font-bold text-blue-600">{location.bookings.toLocaleString()}</p>
                              <p className="text-xs text-gray-500">Bookings</p>
                            </div>
                            <div className="text-center p-2 bg-green-50 dark:bg-green-950/20 rounded">
                              <p className="text-lg font-bold text-green-600">{formatCurrencyCompact(location.revenue, currency)}</p>
                              <p className="text-xs text-gray-500">Revenue</p>
                            </div>
                          </div>

                          <div className="space-y-2 mb-3">
                            <div className="flex justify-between items-center">
                              <span className="text-sm text-gray-600 dark:text-gray-400">Rating:</span>
                              <div className="flex items-center space-x-1">
                                <span className="text-yellow-500">⭐</span>
                                <span className="font-semibold text-gray-900 dark:text-gray-100">{location.avgRating}/5</span>
                              </div>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-sm text-gray-600 dark:text-gray-400">Sustainability:</span>
                              <span className="font-semibold text-green-600">{location.sustainabilityScore}%</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-sm text-gray-600 dark:text-gray-400">Renewable:</span>
                              <span className="font-semibold text-green-600">{location.renewablePercent}%</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-sm text-gray-600 dark:text-gray-400">CO₂ Impact:</span>
                              <span className="font-semibold text-orange-600">{location.co2Impact} tCO₂e</span>
                            </div>
                          </div>

                          <div className="border-t pt-2">
                            <p className="text-xs text-gray-500 mb-1">Tourism Types:</p>
                            <div className="flex flex-wrap gap-1">
                              {location.tourismType.map(type => (
                                <Badge key={type} variant="outline" className="text-xs py-0">
                                  {type}
                                </Badge>
                              ))}
                            </div>
                          </div>

                          <div className="mt-2 pt-2 border-t text-center">
                            <p className="text-xs text-blue-600 font-medium cursor-pointer hover:underline">
                              🖱️ Click to explore detailed analytics
                            </p>
                          </div>
                        </div>
                      </Popup>
                    </CircleMarker>
                  ))}
                </MapContainer>
              ) : (
                <div className="h-full w-full flex items-center justify-center bg-gray-50 dark:bg-gray-900">
                  <div className="text-center">
                    <Globe className="h-12 w-12 text-blue-500 mx-auto mb-4 animate-pulse" />
                    <p className="text-gray-600 dark:text-gray-400 text-lg font-medium">Loading Sustainability Map...</p>
                    <p className="text-gray-500 dark:text-gray-500 text-sm mt-1">Preparing geographic data visualization</p>
                  </div>
                </div>
              )}
            </div>

            {/* Enhanced Map Legend */}
            <div className="mt-4 p-4 bg-gradient-to-r from-gray-50 to-blue-50 dark:from-gray-900 dark:to-blue-950/20 rounded-lg border">
              <div className="flex items-center justify-between mb-3">
                <h5 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                  📊 Map Legend - {selectedMetric.charAt(0).toUpperCase() + selectedMetric.slice(1)} Performance
                </h5>
                <div className="flex items-center space-x-1">
                  <Info className="h-4 w-4 text-blue-500" />
                  <span className="text-xs text-gray-500">Interactive Guide</span>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="flex items-center space-x-3 p-2 bg-white dark:bg-gray-800 rounded border">
                    <div className="w-4 h-4 rounded-full bg-emerald-600 border-2 border-white shadow" />
                    <div>
                      <p className="text-xs font-medium text-gray-900 dark:text-gray-100">High Performance</p>
                      <p className="text-xs text-gray-500">
                        {selectedMetric === 'economic' ? '>$2.5M Revenue' : 
                         selectedMetric === 'social' ? '≥4.5 Rating' : 
                         '≥80% Sustainability'}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3 p-2 bg-white dark:bg-gray-800 rounded border">
                    <div className="w-4 h-4 rounded-full bg-amber-600 border-2 border-white shadow" />
                    <div>
                      <p className="text-xs font-medium text-gray-900 dark:text-gray-100">Medium Performance</p>
                      <p className="text-xs text-gray-500">
                        {selectedMetric === 'economic' ? '$1.5M-$2.5M' : 
                         selectedMetric === 'social' ? '4.0-4.5 Rating' : 
                         '60-80% Sustainability'}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3 p-2 bg-white dark:bg-gray-800 rounded border">
                    <div className="w-4 h-4 rounded-full bg-red-600 border-2 border-white shadow" />
                    <div>
                      <p className="text-xs font-medium text-gray-900 dark:text-gray-100">Low Performance</p>
                      <p className="text-xs text-gray-500">
                        {selectedMetric === 'economic' ? '<$1.5M Revenue' : 
                         selectedMetric === 'social' ? '<4.0 Rating' : 
                         '<60% Sustainability'}
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center justify-center space-x-6 pt-2 border-t">
                  <div className="flex items-center space-x-2">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 rounded-full bg-blue-500" />
                      <div className="w-3 h-3 rounded-full bg-blue-500" />
                      <div className="w-4 h-4 rounded-full bg-blue-500" />
                    </div>
                    <span className="text-xs font-medium text-gray-700 dark:text-gray-300">Circle Size = Impact Magnitude</span>
                  </div>
                  <div className="text-xs text-gray-500">
                    🖱️ Click • 🔍 Zoom • 📱 Touch to explore
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Location Details & Metrics */}
        <div className="space-y-6">
          {/* Selected Location Details */}
          {selectedLocation ? (
            <Card className="border-blue-200 dark:border-blue-800">
              <CardHeader>
                <CardTitle className="text-lg flex items-center space-x-2">
                  <MapPin className="h-4 w-4 text-blue-500" />
                  <span>{selectedLocation.name}</span>
                </CardTitle>
                <CardDescription>{selectedLocation.country} • {selectedLocation.region}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
                    <p className="text-lg font-bold text-blue-600">
                      {selectedLocation.bookings.toLocaleString()}
                    </p>
                    <p className="text-xs text-gray-500">Bookings</p>
                  </div>
                  <div className="text-center p-3 bg-green-50 dark:bg-green-950/20 rounded-lg">
                    <p className="text-lg font-bold text-green-600">
                      {formatCurrencyCompact(selectedLocation.revenue, currency)}
                    </p>
                    <p className="text-xs text-gray-500">Revenue</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm">Tourist Rating</span>
                      <span className="text-sm font-medium">⭐ {selectedLocation.avgRating}/5</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-yellow-500 h-2 rounded-full" 
                        style={{ width: `${(selectedLocation.avgRating / 5) * 100}%` }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm">Renewable Energy</span>
                      <span className="text-sm font-medium">{selectedLocation.renewablePercent}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-green-500 h-2 rounded-full" 
                        style={{ width: `${selectedLocation.renewablePercent}%` }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm">CO₂ Impact</span>
                      <span className="text-sm font-medium">{selectedLocation.co2Impact} tCO₂e</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-red-500 h-2 rounded-full" 
                        style={{ width: `${Math.min(selectedLocation.co2Impact * 4, 100)}%` }}
                      />
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="space-y-2">
                  <h5 className="text-sm font-medium">Tourism Categories</h5>
                  <div className="flex flex-wrap gap-1">
                    {selectedLocation.tourismType.map(type => (
                      <Badge key={type} variant="outline" className="text-xs">
                        {type}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-2 text-center text-xs">
                  <div>
                    <p className="font-bold text-gray-800 dark:text-gray-200">
                      {(selectedLocation.population / 1000000).toFixed(1)}M
                    </p>
                    <p className="text-gray-500">Population</p>
                  </div>
                  <div>
                    <p className="font-bold text-gray-800 dark:text-gray-200">
                      {selectedLocation.gdpContribution}%
                    </p>
                    <p className="text-gray-500">GDP from Tourism</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="text-center py-8">
                <MapPin className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-500">Click on a location to view details</p>
              </CardContent>
            </Card>
          )}

          {/* Quick Statistics */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Global Overview</CardTitle>
              <CardDescription>
                {viewLevel === 'global' ? 'Worldwide' : viewLevel === 'regional' ? 'Regional' : 'Local'} sustainability metrics
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center p-4 bg-gradient-to-r from-blue-50 to-green-50 dark:from-blue-950/20 dark:to-green-950/20 rounded-lg">
                <p className="text-2xl font-bold text-green-600">
                  {Math.round(filteredLocations.reduce((sum, loc) => sum + loc.sustainabilityScore, 0) / filteredLocations.length)}%
                </p>
                <p className="text-sm font-medium">Avg Sustainability Score</p>
              </div>

              <div className="grid grid-cols-3 gap-3 text-center">
                <div>
                  <p className="text-lg font-bold text-blue-600">
                    {filteredLocations.reduce((sum, loc) => sum + loc.bookings, 0).toLocaleString()}
                  </p>
                  <p className="text-xs text-gray-500">Total Bookings</p>
                </div>
                <div>
                  <p className="text-lg font-bold text-green-600">
                    {Math.round(filteredLocations.reduce((sum, loc) => sum + loc.renewablePercent, 0) / filteredLocations.length)}%
                  </p>
                  <p className="text-xs text-gray-500">Avg Renewable</p>
                </div>
                <div>
                  <p className="text-lg font-bold text-yellow-600">
                    {(filteredLocations.reduce((sum, loc) => sum + loc.avgRating, 0) / filteredLocations.length).toFixed(1)}
                  </p>
                  <p className="text-xs text-gray-500">Avg Rating</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Comparative Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Performance Comparison</CardTitle>
            <CardDescription>
              Top destinations by {selectedMetric} performance
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="name" 
                    tick={{ fontSize: 10 }}
                    angle={-45}
                    textAnchor="end"
                    height={60}
                  />
                  <YAxis />
                  <Bar 
                    dataKey={selectedMetric} 
                    fill={selectedMetric === 'economic' ? '#10B981' : 
                         selectedMetric === 'social' ? '#F59E0B' : '#059669'} 
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Sustainability Distribution</CardTitle>
            <CardDescription>Breakdown by environmental performance levels</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={[
                      { 
                        name: 'High Sustainability', 
                        value: filteredLocations.filter(l => l.sustainabilityScore >= 80).length,
                        color: '#10B981'
                      },
                      { 
                        name: 'Medium Sustainability', 
                        value: filteredLocations.filter(l => l.sustainabilityScore >= 60 && l.sustainabilityScore < 80).length,
                        color: '#F59E0B'
                      },
                      { 
                        name: 'Low Sustainability', 
                        value: filteredLocations.filter(l => l.sustainabilityScore < 60).length,
                        color: '#EF4444'
                      }
                    ]}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, value }) => `${name}: ${value}`}
                  >
                    {[{ color: '#10B981' }, { color: '#F59E0B' }, { color: '#EF4444' }].map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}