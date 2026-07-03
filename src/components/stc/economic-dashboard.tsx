'use client'

import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Separator } from '@/components/ui/separator'
import { TrendingUp, TrendingDown, DollarSign, CreditCard, MapPin, Users, Zap, Activity } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, Area, AreaChart } from 'recharts'
import { useCurrency } from '@/hooks/use-currency'
import { formatCurrency, formatCurrencyCompact } from '@/lib/currency'

interface EconomicDashboardProps {
  data: {
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
  }
}

const COLORS = ['#3b82f6', '#06b6d4', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#84cc16']

export const EconomicDashboard: React.FC<EconomicDashboardProps> = ({ data }) => {
  const { currency } = useCurrency()
  
  // Calculate derived metrics
  const totalRevenue = data.onChain.totalVolume * 0.001 + data.offChain.bookings.reduce((sum, b) => sum + b.cost, 0)
  const avgTransactionValue = data.onChain.totalVolume / data.onChain.transactions.length
  const revenueTrend = calculateRevenueTrend(data)
  const locationAnalytics = calculateLocationAnalytics(data.offChain)
  const categoryDistribution = calculateCategoryDistribution(data.offChain)
  const temporalAnalysis = calculateTemporalAnalysis(data)

  return (
    <div className="space-y-6">
      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrencyCompact(totalRevenue, currency)}</div>
            <p className="text-xs text-muted-foreground">
              <Badge variant={revenueTrend > 0 ? "default" : "destructive"} className="text-xs">
                {revenueTrend > 0 ? <TrendingUp className="h-3 w-3 mr-1" /> : <TrendingDown className="h-3 w-3 mr-1" />}
                {Math.abs(revenueTrend).toFixed(1)}%
              </Badge>
              from last period
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.offChain.totalBookings}</div>
            <p className="text-xs text-muted-foreground">
              Avg spending: {formatCurrency(data.offChain.avgSpending, currency)}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Unique Addresses</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.onChain.uniqueAddresses}</div>
            <p className="text-xs text-muted-foreground">
              Active on SmartTourismChain
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Transaction Value</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{avgTransactionValue.toFixed(0)} STC</div>
            <p className="text-xs text-muted-foreground">
              Gas: {data.onChain.avgGasFee.toFixed(0)} gwei
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Revenue Trends */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <TrendingUp className="h-5 w-5" />
            <span>Revenue Trends Over Time</span>
          </CardTitle>
          <CardDescription>
            Daily revenue breakdown from on-chain transactions and off-chain bookings
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={temporalAnalysis}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Area type="monotone" dataKey="onChainRevenue" stackId="1" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.8} />
              <Area type="monotone" dataKey="offChainRevenue" stackId="1" stroke="#10b981" fill="#10b981" fillOpacity={0.8} />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Location Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <MapPin className="h-5 w-5" />
              <span>Popular Destinations</span>
            </CardTitle>
            <CardDescription>
              Booking distribution by location with revenue contribution
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {locationAnalytics.map((location, index) => (
                <div key={location.name} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline">{index + 1}</Badge>
                      <span className="font-medium">{location.name}</span>
                    </div>
                    <div className="text-right">
                      <div className="font-bold">{formatCurrencyCompact(location.revenue, currency)}</div>
                      <div className="text-xs text-muted-foreground">{location.bookings} bookings</div>
                    </div>
                  </div>
                  <Progress value={(location.revenue / Math.max(...locationAnalytics.map(l => l.revenue))) * 100} />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Spending Distribution</CardTitle>
            <CardDescription>
              Revenue breakdown by tourism category
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={categoryDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {categoryDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Transaction Volume Analysis */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Zap className="h-5 w-5" />
            <span>Transaction Volume Analysis</span>
          </CardTitle>
          <CardDescription>
            Daily transaction volumes and gas fee trends
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={temporalAnalysis}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip />
              <Legend />
              <Bar yAxisId="left" dataKey="transactionCount" fill="#3b82f6" name="Transactions" />
              <Line yAxisId="right" type="monotone" dataKey="avgGas" stroke="#ef4444" strokeWidth={2} name="Avg Gas (gwei)" />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Economic Impact Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Economic Impact Summary</CardTitle>
          <CardDescription>
            Key economic indicators and growth metrics
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-3">
              <h4 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground">Transaction Efficiency</h4>
              <div className="text-2xl font-bold">{(avgTransactionValue / data.onChain.avgGasFee * 1000).toFixed(1)}</div>
              <p className="text-xs text-muted-foreground">Value per gas unit</p>
            </div>
            
            <div className="space-y-3">
              <h4 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground">Market Penetration</h4>
              <div className="text-2xl font-bold">{((data.onChain.uniqueAddresses / data.offChain.totalBookings) * 100).toFixed(1)}%</div>
              <p className="text-xs text-muted-foreground">Blockchain adoption rate</p>
            </div>
            
            <div className="space-y-3">
              <h4 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground">Revenue Per User</h4>
              <div className="text-2xl font-bold">{formatCurrency(totalRevenue / data.onChain.uniqueAddresses, currency)}</div>
              <p className="text-xs text-muted-foreground">Average user value</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function calculateRevenueTrend(data: any): number {
  // Mock trend calculation - in real implementation, this would compare with historical data
  return Math.random() * 20 - 5 // -5% to +15%
}

function calculateLocationAnalytics(offChainData: any) {
  const locationRevenue = new Map<string, { bookings: number; revenue: number }>()
  
  offChainData.bookings.forEach((booking: any) => {
    const current = locationRevenue.get(booking.location) || { bookings: 0, revenue: 0 }
    locationRevenue.set(booking.location, {
      bookings: current.bookings + 1,
      revenue: current.revenue + booking.cost
    })
  })
  
  return Array.from(locationRevenue.entries())
    .map(([name, data]) => ({ name, ...data }))
    .sort((a, b) => b.revenue - a.revenue)
}

function calculateCategoryDistribution(offChainData: any) {
  const categoryRevenue = new Map<string, number>()
  
  offChainData.bookings.forEach((booking: any) => {
    const current = categoryRevenue.get(booking.category) || 0
    categoryRevenue.set(booking.category, current + booking.cost)
  })
  
  return Array.from(categoryRevenue.entries())
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)
}

function calculateTemporalAnalysis(data: any) {
  // Group data by day
  const dailyData = new Map<string, any>()
  
  // Process transactions
  data.onChain.transactions.forEach((tx: any) => {
    const date = new Date(tx.timestamp).toISOString().split('T')[0]
    if (!dailyData.has(date)) {
      dailyData.set(date, {
        date,
        onChainRevenue: 0,
        offChainRevenue: 0,
        transactionCount: 0,
        totalGas: 0,
        gasCount: 0
      })
    }
    const day = dailyData.get(date)!
    day.onChainRevenue += tx.tokenAmount * 0.001
    day.transactionCount += 1
    day.totalGas += tx.gasUsed
    day.gasCount += 1
  })
  
  // Process bookings
  data.offChain.bookings.forEach((booking: any) => {
    const date = new Date(booking.timestamp).toISOString().split('T')[0]
    if (!dailyData.has(date)) {
      dailyData.set(date, {
        date,
        onChainRevenue: 0,
        offChainRevenue: 0,
        transactionCount: 0,
        totalGas: 0,
        gasCount: 0
      })
    }
    const day = dailyData.get(date)!
    day.offChainRevenue += booking.cost
  })
  
  // Calculate averages and sort by date
  return Array.from(dailyData.values())
    .map(day => ({
      ...day,
      avgGas: day.gasCount > 0 ? day.totalGas / day.gasCount : 0
    }))
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(-14) // Last 14 days
}