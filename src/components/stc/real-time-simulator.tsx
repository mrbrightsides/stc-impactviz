'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { Progress } from '@/components/ui/progress'
import { Play, Pause, RotateCcw, Zap, TrendingUp, Activity, ArrowRight, Eye, BarChart3, DollarSign, Users, Star, Leaf } from 'lucide-react'
import { toast } from 'sonner'
import { formatCurrency, formatCurrencyCompact } from '@/lib/currency'
import { useCurrency } from '@/hooks/use-currency'

interface RealTimeSimulatorProps {
  onDataUpdate: (data: any) => void
  currentData: any
}

export const RealTimeSimulator: React.FC<RealTimeSimulatorProps> = ({ 
  onDataUpdate, 
  currentData 
}) => {
  const [isSimulating, setIsSimulating] = useState(false)
  const [simulationSpeed, setSimulationSpeed] = useState(1)
  const [totalUpdates, setTotalUpdates] = useState(0)
  const [recentUpdates, setRecentUpdates] = useState<any[]>([])
  const [liveMetrics, setLiveMetrics] = useState({
    revenue: 0,
    transactions: 0,
    bookings: 0,
    avgRating: 0
  })
  const { currency } = useCurrency()

  useEffect(() => {
    let interval: NodeJS.Timeout

    if (isSimulating && currentData) {
      interval = setInterval(() => {
        simulateDataUpdate()
      }, 2000 / simulationSpeed)
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isSimulating, simulationSpeed, currentData])

  const simulateDataUpdate = () => {
    if (!currentData) return

    // Create realistic incremental updates
    const updatedData = {
      ...currentData,
      onChain: {
        ...currentData.onChain,
        transactions: [
          ...currentData.onChain.transactions,
          {
            hash: `0x${Math.random().toString(16).substr(2, 40)}`,
            gasUsed: Math.floor(Math.random() * 100000) + 21000,
            tokenAmount: Math.floor(Math.random() * 1000) + 100,
            timestamp: Date.now(),
            blockNumber: currentData.onChain.transactions.length + 18000000,
          }
        ],
        totalVolume: currentData.onChain.totalVolume + Math.floor(Math.random() * 500) + 100,
        uniqueAddresses: currentData.onChain.uniqueAddresses + (Math.random() > 0.7 ? 1 : 0),
      },
      offChain: {
        ...currentData.offChain,
        bookings: [
          ...currentData.offChain.bookings,
          {
            id: `B${String(currentData.offChain.bookings.length + 1).padStart(3, '0')}`,
            location: ['Bali', 'Jakarta', 'Yogyakarta', 'Bandung', 'Surabaya'][Math.floor(Math.random() * 5)],
            duration: Math.floor(Math.random() * 7) + 1,
            cost: Math.floor(Math.random() * 500) + 100,
            timestamp: Date.now(),
            category: ['Beach Resort', 'City Hotel', 'Cultural Site'][Math.floor(Math.random() * 3)],
          }
        ],
        totalBookings: currentData.offChain.totalBookings + 1,
      },
      social: {
        ...currentData.social,
        reviews: [
          ...currentData.social.reviews,
          {
            id: `R${String(currentData.social.reviews.length + 1).padStart(3, '0')}`,
            rating: Math.floor(Math.random() * 5) + 1,
            sentiment: ['positive', 'negative', 'neutral'][Math.floor(Math.random() * 3)] as 'positive' | 'negative' | 'neutral',
            timestamp: Date.now(),
            location: ['Bali', 'Jakarta', 'Yogyakarta'][Math.floor(Math.random() * 3)],
            comment: ['Great experience!', 'Amazing service', 'Could be better'][Math.floor(Math.random() * 3)],
          }
        ],
        totalReviews: currentData.social.totalReviews + 1,
      }
    }

    // Recalculate derived metrics
    updatedData.offChain.avgSpending = updatedData.offChain.bookings.reduce((sum: number, b: any) => sum + b.cost, 0) / updatedData.offChain.bookings.length
    updatedData.social.avgRating = updatedData.social.reviews.reduce((sum: number, r: any) => sum + r.rating, 0) / updatedData.social.reviews.length
    
    onDataUpdate(updatedData)
    setTotalUpdates(prev => prev + 1)
    
    // Add to recent updates feed
    const newUpdate = {
      id: Date.now(),
      type: Math.random() > 0.5 ? 'transaction' : 'booking',
      timestamp: Date.now(),
      data: Math.random() > 0.5 ? 
        `New transaction: ${formatCurrency(Math.floor(Math.random() * 1000) + 100, currency)}` :
        `New booking: ${['Bali', 'Jakarta', 'Yogyakarta'][Math.floor(Math.random() * 3)]}`
    }
    
    setRecentUpdates(prev => [newUpdate, ...prev.slice(0, 4)])
    
    // Update live metrics
    setLiveMetrics({
      revenue: updatedData.offChain.bookings.reduce((sum: number, b: any) => sum + b.cost, 0),
      transactions: updatedData.onChain.transactions.length,
      bookings: updatedData.offChain.bookings.length,
      avgRating: updatedData.social.avgRating
    })
  }

  const startSimulation = () => {
    setIsSimulating(true)
    toast.success('Real-time simulation started')
  }

  const stopSimulation = () => {
    setIsSimulating(false)
    toast.info('Real-time simulation stopped')
  }

  const resetSimulation = React.useCallback(() => {
    console.log('Real-time simulator reset clicked')
    try {
      setIsSimulating(false)
      setTotalUpdates(0)
      setRecentUpdates([])
      setLiveMetrics({
        revenue: currentData?.offChain?.bookings?.reduce((sum: number, b: any) => sum + b.cost, 0) || 0,
        transactions: currentData?.onChain?.transactions?.length || 0,
        bookings: currentData?.offChain?.bookings?.length || 0,
        avgRating: currentData?.social?.avgRating || 0
      })
      toast.info('Simulation reset successfully')
      console.log('Simulation reset completed')
    } catch (error) {
      console.error('Simulation reset failed:', error)
      toast.error('Failed to reset simulation')
    }
  }, [currentData])
  
  // Initialize live metrics when currentData changes
  useEffect(() => {
    if (currentData) {
      setLiveMetrics({
        revenue: currentData.offChain?.bookings?.reduce((sum: number, b: any) => sum + b.cost, 0) || 0,
        transactions: currentData.onChain?.transactions?.length || 0,
        bookings: currentData.offChain?.bookings?.length || 0,
        avgRating: currentData.social?.avgRating || 0
      })
    }
  }, [currentData])

  if (!currentData) {
    return null
  }

  return (
    <Card className="border-dashed border-2 border-blue-200 dark:border-blue-800">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Activity className="h-5 w-5 text-blue-500" />
          <span>Real-Time Data Simulator</span>
          {isSimulating && (
            <Badge variant="default" className="ml-auto animate-pulse">
              LIVE
            </Badge>
          )}
        </CardTitle>
        <CardDescription>
          Simulate live data updates to see how metrics change in real-time
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Button
              onClick={isSimulating ? stopSimulation : startSimulation}
              variant={isSimulating ? "destructive" : "default"}
              size="sm"
            >
              {isSimulating ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
              {isSimulating ? 'Stop' : 'Start'} Simulation
            </Button>
            
            <button 
              onClick={() => {
                console.log('Simulator reset button clicked - native')
                resetSimulation()
              }}
              className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 px-3 cursor-pointer"
              type="button"
            >
              <RotateCcw className="h-4 w-4" />
              Reset
            </button>
          </div>

          <div className="flex items-center space-x-4">
            <div className="text-sm">
              <span className="text-muted-foreground">Updates: </span>
              <span className="font-semibold">{totalUpdates}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-sm text-muted-foreground">Speed:</span>
            <div className="flex items-center space-x-1">
              {[0.5, 1, 2, 3].map(speed => (
                <Button
                  key={speed}
                  onClick={() => setSimulationSpeed(speed)}
                  variant={simulationSpeed === speed ? "default" : "outline"}
                  size="sm"
                  className="text-xs px-2 py-1"
                >
                  {speed}x
                </Button>
              ))}
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Zap className="h-4 w-4 text-yellow-500" />
            <span className="text-sm text-muted-foreground">
              {isSimulating ? 'Generating updates...' : 'Simulation paused'}
            </span>
          </div>
        </div>

        {isSimulating && (
          <div className="bg-blue-50 dark:bg-blue-950 rounded-lg p-3">
            <div className="flex items-center space-x-2 text-sm">
              <TrendingUp className="h-4 w-4 text-blue-500" />
              <span className="text-blue-700 dark:text-blue-300">
                Simulating live SmartTourismChain transactions and tourism bookings
              </span>
            </div>
          </div>
        )}
        
        {/* Live Metrics Preview */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="p-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Total Revenue</p>
                <p className="text-lg font-bold text-green-600">
                  {formatCurrencyCompact(liveMetrics.revenue, currency)}
                </p>
              </div>
              <DollarSign className="h-5 w-5 text-green-500" />
            </div>
            {isSimulating && <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse mt-1" />}
          </Card>
          
          <Card className="p-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Transactions</p>
                <p className="text-lg font-bold text-blue-600">
                  {liveMetrics.transactions.toLocaleString()}
                </p>
              </div>
              <BarChart3 className="h-5 w-5 text-blue-500" />
            </div>
            {isSimulating && <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse mt-1" />}
          </Card>
          
          <Card className="p-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Bookings</p>
                <p className="text-lg font-bold text-purple-600">
                  {liveMetrics.bookings.toLocaleString()}
                </p>
              </div>
              <Users className="h-5 w-5 text-purple-500" />
            </div>
            {isSimulating && <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse mt-1" />}
          </Card>
          
          <Card className="p-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Avg Rating</p>
                <p className="text-lg font-bold text-yellow-600">
                  {liveMetrics.avgRating.toFixed(1)}
                </p>
              </div>
              <Star className="h-5 w-5 text-yellow-500" />
            </div>
            {isSimulating && <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse mt-1" />}
          </Card>
        </div>
        
        {/* Recent Updates Activity Feed */}
        {recentUpdates.length > 0 && (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center space-x-2">
                <Activity className="h-4 w-4" />
                <span>Recent Updates</span>
                <Badge variant="secondary" className="text-xs">
                  {recentUpdates.length}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {recentUpdates.map((update, index) => (
                <div 
                  key={update.id}
                  className={`flex items-center justify-between p-2 rounded-lg transition-all duration-500 ${
                    index === 0 ? 'bg-green-50 dark:bg-green-950 border-l-2 border-green-500' : 'bg-gray-50 dark:bg-gray-800'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <div className={`w-2 h-2 rounded-full ${
                      update.type === 'transaction' ? 'bg-blue-500' : 'bg-purple-500'
                    } ${index === 0 ? 'animate-pulse' : ''}`} />
                    <span className="text-sm">{update.data}</span>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {new Date(update.timestamp).toLocaleTimeString()}
                  </span>
                </div>
              ))}
            </CardContent>
          </Card>
        )}
        
        {/* Navigation Hints */}
        <Card className="border-dashed">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center space-x-2">
              <Eye className="h-4 w-4" />
              <span>View Real-Time Changes</span>
            </CardTitle>
            <CardDescription className="text-xs">
              See the live simulation effects in other dashboard sections
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <Button variant="outline" size="sm" className="justify-start h-auto p-3">
                <div className="flex items-center space-x-3 w-full">
                  <DollarSign className="h-4 w-4 text-green-500 flex-shrink-0" />
                  <div className="text-left flex-1">
                    <div className="text-sm font-medium">Economic Dashboard</div>
                    <div className="text-xs text-muted-foreground">Revenue & transaction trends</div>
                  </div>
                  <ArrowRight className="h-3 w-3 text-muted-foreground flex-shrink-0" />
                </div>
              </Button>
              
              <Button variant="outline" size="sm" className="justify-start h-auto p-3">
                <div className="flex items-center space-x-3 w-full">
                  <Users className="h-4 w-4 text-purple-500 flex-shrink-0" />
                  <div className="text-left flex-1">
                    <div className="text-sm font-medium">Social Impact</div>
                    <div className="text-xs text-muted-foreground">Reviews & satisfaction</div>
                  </div>
                  <ArrowRight className="h-3 w-3 text-muted-foreground flex-shrink-0" />
                </div>
              </Button>
              
              <Button variant="outline" size="sm" className="justify-start h-auto p-3">
                <div className="flex items-center space-x-3 w-full">
                  <Leaf className="h-4 w-4 text-green-500 flex-shrink-0" />
                  <div className="text-left flex-1">
                    <div className="text-sm font-medium">Environmental</div>
                    <div className="text-xs text-muted-foreground">Carbon & energy metrics</div>
                  </div>
                  <ArrowRight className="h-3 w-3 text-muted-foreground flex-shrink-0" />
                </div>
              </Button>
              
              <Button variant="outline" size="sm" className="justify-start h-auto p-3">
                <div className="flex items-center space-x-3 w-full">
                  <BarChart3 className="h-4 w-4 text-blue-500 flex-shrink-0" />
                  <div className="text-left flex-1">
                    <div className="text-sm font-medium">Triple Bottom Line</div>
                    <div className="text-xs text-muted-foreground">3D bubble chart analysis</div>
                  </div>
                  <ArrowRight className="h-3 w-3 text-muted-foreground flex-shrink-0" />
                </div>
              </Button>
            </div>
            
            <div className="mt-3 p-3 bg-blue-50 dark:bg-blue-950 rounded-lg">
              <div className="flex items-start space-x-2">
                <Zap className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
                <div className="text-xs text-blue-700 dark:text-blue-300">
                  <strong>Pro Tip:</strong> Start the simulation above, then navigate to other tabs to see live updates in charts, metrics, and visualizations.
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </CardContent>
    </Card>
  )
}