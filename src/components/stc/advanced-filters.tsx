'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { CalendarDays, MapPin, Filter, X, Search, TrendingUp } from 'lucide-react'
import { toast } from 'sonner'

interface AdvancedFiltersProps {
  data: any
  onFilteredDataUpdate: (filteredData: any) => void
  originalData: any
}

export const AdvancedFilters: React.FC<AdvancedFiltersProps> = ({ 
  data, 
  onFilteredDataUpdate, 
  originalData 
}) => {
  const [isFiltering, setIsFiltering] = useState(false)
  const [filters, setFilters] = useState({
    dateFrom: '',
    dateTo: '',
    location: '',
    minAmount: '',
    maxAmount: '',
    category: '',
    sentiment: ''
  })
  const [activeFilters, setActiveFilters] = useState<string[]>([])

  const locations = originalData ? Array.from(new Set(originalData.offChain.bookings.map((b: any) => b.location))) : []
  const categories = originalData ? Array.from(new Set(originalData.offChain.bookings.map((b: any) => b.category))) : []
  const sentiments = ['positive', 'negative', 'neutral']

  useEffect(() => {
    if (isFiltering) {
      applyFilters()
    }
  }, [filters, isFiltering])

  const applyFilters = () => {
    if (!originalData) return

    let filteredData = { ...originalData }
    const appliedFilters: string[] = []

    // Date range filter
    if (filters.dateFrom || filters.dateTo) {
      const fromDate = filters.dateFrom ? new Date(filters.dateFrom).getTime() : 0
      const toDate = filters.dateTo ? new Date(filters.dateTo).getTime() : Date.now()
      
      filteredData.onChain.transactions = filteredData.onChain.transactions.filter((tx: any) => 
        tx.timestamp >= fromDate && tx.timestamp <= toDate
      )
      
      filteredData.offChain.bookings = filteredData.offChain.bookings.filter((booking: any) => 
        booking.timestamp >= fromDate && booking.timestamp <= toDate
      )
      
      filteredData.social.reviews = filteredData.social.reviews.filter((review: any) => 
        review.timestamp >= fromDate && review.timestamp <= toDate
      )
      
      appliedFilters.push(`Date: ${filters.dateFrom || 'start'} to ${filters.dateTo || 'end'}`);
    }

    // Location filter
    if (filters.location) {
      filteredData.offChain.bookings = filteredData.offChain.bookings.filter((booking: any) =>
        booking.location.toLowerCase().includes(filters.location.toLowerCase())
      )
      
      filteredData.social.reviews = filteredData.social.reviews.filter((review: any) =>
        review.location.toLowerCase().includes(filters.location.toLowerCase())
      )
      
      appliedFilters.push(`Location: ${filters.location}`)
    }

    // Amount range filter
    if (filters.minAmount || filters.maxAmount) {
      const minAmount = filters.minAmount ? parseFloat(filters.minAmount) : 0
      const maxAmount = filters.maxAmount ? parseFloat(filters.maxAmount) : Infinity
      
      filteredData.offChain.bookings = filteredData.offChain.bookings.filter((booking: any) =>
        booking.cost >= minAmount && booking.cost <= maxAmount
      )
      
      filteredData.onChain.transactions = filteredData.onChain.transactions.filter((tx: any) =>
        tx.tokenAmount >= minAmount && tx.tokenAmount <= maxAmount
      )
      
      appliedFilters.push(`Amount: $${minAmount} - $${maxAmount === Infinity ? '∞' : maxAmount}`)
    }

    // Category filter
    if (filters.category) {
      filteredData.offChain.bookings = filteredData.offChain.bookings.filter((booking: any) =>
        booking.category.toLowerCase().includes(filters.category.toLowerCase())
      )
      
      appliedFilters.push(`Category: ${filters.category}`)
    }

    // Sentiment filter
    if (filters.sentiment) {
      filteredData.social.reviews = filteredData.social.reviews.filter((review: any) =>
        review.sentiment === filters.sentiment
      )
      
      appliedFilters.push(`Sentiment: ${filters.sentiment}`)
    }

    // Recalculate derived metrics
    filteredData.onChain.totalVolume = filteredData.onChain.transactions.reduce((sum: number, tx: any) => sum + tx.tokenAmount, 0)
    filteredData.onChain.avgGasFee = filteredData.onChain.transactions.length > 0 
      ? filteredData.onChain.transactions.reduce((sum: number, tx: any) => sum + tx.gasUsed, 0) / filteredData.onChain.transactions.length 
      : 0

    filteredData.offChain.totalBookings = filteredData.offChain.bookings.length
    filteredData.offChain.avgSpending = filteredData.offChain.bookings.length > 0
      ? filteredData.offChain.bookings.reduce((sum: number, b: any) => sum + b.cost, 0) / filteredData.offChain.bookings.length
      : 0

    const popularLocations = locations.map(name => ({
      name,
      count: filteredData.offChain.bookings.filter((b: any) => b.location === name).length,
    })).filter(loc => loc.count > 0).sort((a, b) => b.count - a.count)

    filteredData.offChain.popularLocations = popularLocations

    filteredData.social.totalReviews = filteredData.social.reviews.length
    filteredData.social.avgRating = filteredData.social.reviews.length > 0
      ? filteredData.social.reviews.reduce((sum: number, r: any) => sum + r.rating, 0) / filteredData.social.reviews.length
      : 0

    const sentimentDistribution = {
      positive: filteredData.social.reviews.filter((r: any) => r.sentiment === 'positive').length,
      negative: filteredData.social.reviews.filter((r: any) => r.sentiment === 'negative').length,
      neutral: filteredData.social.reviews.filter((r: any) => r.sentiment === 'neutral').length,
    }

    filteredData.social.sentimentDistribution = sentimentDistribution

    setActiveFilters(appliedFilters)
    onFilteredDataUpdate(filteredData)
  }

  const clearFilters = () => {
    setFilters({
      dateFrom: '',
      dateTo: '',
      location: '',
      minAmount: '',
      maxAmount: '',
      category: '',
      sentiment: ''
    })
    setActiveFilters([])
    setIsFiltering(false)
    onFilteredDataUpdate(originalData)
    toast.success('All filters cleared')
  }

  const enableFiltering = () => {
    setIsFiltering(true)
    applyFilters()
    toast.success('Advanced filtering enabled')
  }

  if (!data) {
    return null
  }

  return (
    <Card className="border-l-4 border-l-green-500">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Filter className="h-5 w-5 text-green-500" />
          <span>Advanced Filters</span>
          {isFiltering && activeFilters.length > 0 && (
            <Badge variant="default" className="ml-auto">
              {activeFilters.length} Active
            </Badge>
          )}
        </CardTitle>
        <CardDescription>
          Filter and analyze specific segments of your SmartTourismChain data
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Quick Actions */}
        <div className="flex items-center justify-between">
          <Button 
            onClick={enableFiltering} 
            disabled={isFiltering}
            className="flex items-center space-x-2"
          >
            <TrendingUp className="h-4 w-4" />
            <span>{isFiltering ? 'Filtering Active' : 'Enable Filtering'}</span>
          </Button>
          
          {isFiltering && (
            <Button onClick={clearFilters} variant="outline" size="sm">
              <X className="h-4 w-4 mr-1" />
              Clear All
            </Button>
          )}
        </div>

        {/* Active Filters Display */}
        {activeFilters.length > 0 && (
          <div className="space-y-2">
            <Label className="text-sm font-medium">Active Filters:</Label>
            <div className="flex flex-wrap gap-2">
              {activeFilters.map((filter, index) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  {filter}
                </Badge>
              ))}
            </div>
          </div>
        )}

        <Separator />

        {/* Filter Controls */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Date Range */}
          <div className="space-y-3">
            <Label className="flex items-center space-x-2">
              <CalendarDays className="h-4 w-4" />
              <span>Date Range</span>
            </Label>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label htmlFor="dateFrom" className="text-xs">From</Label>
                <Input
                  id="dateFrom"
                  type="date"
                  value={filters.dateFrom}
                  onChange={(e) => setFilters(prev => ({ ...prev, dateFrom: e.target.value }))}
                  className="text-sm"
                />
              </div>
              <div>
                <Label htmlFor="dateTo" className="text-xs">To</Label>
                <Input
                  id="dateTo"
                  type="date"
                  value={filters.dateTo}
                  onChange={(e) => setFilters(prev => ({ ...prev, dateTo: e.target.value }))}
                  className="text-sm"
                />
              </div>
            </div>
          </div>

          {/* Location */}
          <div className="space-y-3">
            <Label className="flex items-center space-x-2">
              <MapPin className="h-4 w-4" />
              <span>Location</span>
            </Label>
            <div className="space-y-2">
              <Input
                placeholder="Search locations..."
                value={filters.location}
                onChange={(e) => setFilters(prev => ({ ...prev, location: e.target.value }))}
                className="text-sm"
              />
              <div className="flex flex-wrap gap-1">
                {locations.slice(0, 5).map((location: string) => (
                  <Button
                    key={location}
                    onClick={() => setFilters(prev => ({ ...prev, location }))}
                    variant="outline"
                    size="sm"
                    className="text-xs px-2 py-1 h-6"
                  >
                    {location}
                  </Button>
                ))}
              </div>
            </div>
          </div>

          {/* Amount Range */}
          <div className="space-y-3">
            <Label>Amount Range ($)</Label>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label htmlFor="minAmount" className="text-xs">Min</Label>
                <Input
                  id="minAmount"
                  type="number"
                  placeholder="0"
                  value={filters.minAmount}
                  onChange={(e) => setFilters(prev => ({ ...prev, minAmount: e.target.value }))}
                  className="text-sm"
                />
              </div>
              <div>
                <Label htmlFor="maxAmount" className="text-xs">Max</Label>
                <Input
                  id="maxAmount"
                  type="number"
                  placeholder="∞"
                  value={filters.maxAmount}
                  onChange={(e) => setFilters(prev => ({ ...prev, maxAmount: e.target.value }))}
                  className="text-sm"
                />
              </div>
            </div>
          </div>

          {/* Category & Sentiment */}
          <div className="space-y-3">
            <Label>Category & Sentiment</Label>
            <div className="space-y-2">
              <div>
                <Label htmlFor="category" className="text-xs">Category</Label>
                <Input
                  id="category"
                  placeholder="e.g. Beach Resort"
                  value={filters.category}
                  onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value }))}
                  className="text-sm"
                />
              </div>
              <div>
                <Label htmlFor="sentiment" className="text-xs">Sentiment</Label>
                <div className="flex gap-1">
                  {sentiments.map((sentiment) => (
                    <Button
                      key={sentiment}
                      onClick={() => setFilters(prev => ({ 
                        ...prev, 
                        sentiment: prev.sentiment === sentiment ? '' : sentiment 
                      }))}
                      variant={filters.sentiment === sentiment ? "default" : "outline"}
                      size="sm"
                      className="text-xs px-2 py-1 h-6 capitalize"
                    >
                      {sentiment}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Results Summary */}
        {isFiltering && (
          <div className="bg-green-50 dark:bg-green-950 rounded-lg p-3">
            <div className="text-sm space-y-1">
              <div className="flex items-center space-x-2">
                <Search className="h-4 w-4 text-green-500" />
                <span className="font-medium text-green-700 dark:text-green-300">
                  Filter Results:
                </span>
              </div>
              <div className="text-green-600 dark:text-green-400 text-xs space-y-1">
                <div>• {data.onChain.transactions.length} transactions</div>
                <div>• {data.offChain.bookings.length} bookings</div>
                <div>• {data.social.reviews.length} reviews</div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}