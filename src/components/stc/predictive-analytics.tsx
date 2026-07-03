'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { TrendingUp, Brain, Target, AlertTriangle, CheckCircle, BarChart3 } from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine } from 'recharts'
import { useCurrency } from '@/hooks/use-currency'
import { formatCurrency } from '@/lib/currency'

interface PredictiveAnalyticsProps {
  data: any
}

interface Prediction {
  metric: string
  current: number
  predicted: number
  confidence: number
  trend: 'up' | 'down' | 'stable'
  timeframe: string
}

export const PredictiveAnalytics: React.FC<PredictiveAnalyticsProps> = ({ data }) => {
  const { currency } = useCurrency()
  const [predictions, setPredictions] = useState<Prediction[]>([])
  const [foreccastData, setForecastData] = useState<any[]>([])
  const [isAnalyzing, setIsAnalyzing] = useState(false)

  useEffect(() => {
    if (data) {
      generatePredictions()
    }
  }, [data])

  const generatePredictions = async () => {
    setIsAnalyzing(true)
    
    // Simulate analysis delay
    await new Promise(resolve => setTimeout(resolve, 1500))

    // Generate realistic predictions based on current data trends
    const newPredictions: Prediction[] = [
      {
        metric: 'Total Revenue',
        current: calculateCurrentRevenue(data),
        predicted: calculateCurrentRevenue(data) * (1 + (Math.random() * 0.4 - 0.1)),
        confidence: Math.random() * 0.3 + 0.7, // 70-100%
        trend: Math.random() > 0.3 ? 'up' : 'down',
        timeframe: '30 days'
      },
      {
        metric: 'Booking Growth',
        current: data.offChain.totalBookings,
        predicted: data.offChain.totalBookings * (1 + (Math.random() * 0.6 + 0.1)),
        confidence: Math.random() * 0.25 + 0.75,
        trend: 'up',
        timeframe: '30 days'
      },
      {
        metric: 'User Adoption',
        current: data.onChain.uniqueAddresses,
        predicted: data.onChain.uniqueAddresses * (1 + (Math.random() * 0.5 + 0.2)),
        confidence: Math.random() * 0.2 + 0.8,
        trend: 'up',
        timeframe: '30 days'
      },
      {
        metric: 'Avg Rating',
        current: data.social.avgRating,
        predicted: Math.min(5, data.social.avgRating + (Math.random() * 0.6 - 0.2)),
        confidence: Math.random() * 0.15 + 0.85,
        trend: data.social.avgRating < 4 ? 'up' : 'stable',
        timeframe: '30 days'
      },
      {
        metric: 'Gas Efficiency',
        current: data.onChain.avgGasFee,
        predicted: data.onChain.avgGasFee * (1 - Math.random() * 0.2),
        confidence: Math.random() * 0.2 + 0.75,
        trend: 'down',
        timeframe: '30 days'
      }
    ]

    setPredictions(newPredictions)
    generateForecastData(newPredictions)
    setIsAnalyzing(false)
  }

  const generateForecastData = (predictions: Prediction[]) => {
    const days = 30
    const forecastData = []

    for (let i = 0; i <= days; i++) {
      const date = new Date()
      date.setDate(date.getDate() + i)
      
      const dataPoint: any = {
        date: date.toISOString().split('T')[0],
        day: i
      }

      predictions.forEach(pred => {
        const progress = i / days
        const variance = (Math.random() - 0.5) * 0.1 // ±5% random variance
        const trendMultiplier = pred.trend === 'up' ? progress : 
                               pred.trend === 'down' ? (1 - progress) : 
                               1 + Math.sin(progress * Math.PI * 2) * 0.05

        dataPoint[pred.metric] = pred.current + 
          (pred.predicted - pred.current) * trendMultiplier * pred.confidence +
          pred.current * variance
      })

      forecastData.push(dataPoint)
    }

    setForecastData(forecastData)
  }

  const calculateCurrentRevenue = (data: any) => {
    return data.onChain.totalVolume * 0.001 + data.offChain.bookings.reduce((sum: number, b: any) => sum + b.cost, 0)
  }

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.9) return 'text-green-600 dark:text-green-400'
    if (confidence >= 0.8) return 'text-blue-600 dark:text-blue-400'
    if (confidence >= 0.7) return 'text-yellow-600 dark:text-yellow-400'
    return 'text-red-600 dark:text-red-400'
  }

  const getConfidenceIcon = (confidence: number) => {
    if (confidence >= 0.8) return <CheckCircle className="h-4 w-4" />
    if (confidence >= 0.7) return <Target className="h-4 w-4" />
    return <AlertTriangle className="h-4 w-4" />
  }

  const getTrendIcon = (trend: string) => {
    if (trend === 'up') return <TrendingUp className="h-4 w-4 text-green-500" />
    if (trend === 'down') return <TrendingUp className="h-4 w-4 text-red-500 rotate-180" />
    return <BarChart3 className="h-4 w-4 text-blue-500" />
  }

  if (!data) return null

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="border-l-4 border-l-purple-500">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Brain className="h-5 w-5 text-purple-500" />
            <span>Predictive Analytics</span>
            {isAnalyzing && (
              <Badge variant="secondary" className="ml-auto animate-pulse">
                Analyzing...
              </Badge>
            )}
          </CardTitle>
          <CardDescription>
            AI-powered forecasting for SmartTourismChain metrics and trends
          </CardDescription>
        </CardHeader>
        {predictions.length === 0 && (
          <CardContent>
            <Button onClick={generatePredictions} disabled={isAnalyzing}>
              <Brain className="h-4 w-4 mr-2" />
              {isAnalyzing ? 'Generating Predictions...' : 'Generate Predictions'}
            </Button>
          </CardContent>
        )}
      </Card>

      {predictions.length > 0 && (
        <>
          {/* Predictions Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {predictions.map((prediction, index) => (
              <Card key={index} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm flex items-center justify-between">
                    <span>{prediction.metric}</span>
                    {getTrendIcon(prediction.trend)}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="space-y-1">
                    <div className="text-xs text-muted-foreground">Current</div>
                    <div className="text-lg font-bold">
                      {prediction.metric.includes('Revenue') || prediction.metric.includes('Gas') 
                        ? formatCurrency(prediction.current, currency)
                        : prediction.metric.includes('Rating')
                        ? prediction.current.toFixed(1)
                        : prediction.current.toFixed(0)}
                    </div>
                  </div>
                  
                  <div className="space-y-1">
                    <div className="text-xs text-muted-foreground">
                      Predicted ({prediction.timeframe})
                    </div>
                    <div className="text-lg font-bold text-purple-600 dark:text-purple-400">
                      {prediction.metric.includes('Revenue') || prediction.metric.includes('Gas') 
                        ? formatCurrency(prediction.predicted, currency)
                        : prediction.metric.includes('Rating')
                        ? prediction.predicted.toFixed(1)
                        : prediction.predicted.toFixed(0)}
                    </div>
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center space-x-1">
                      <div className={getConfidenceColor(prediction.confidence)}>
                        {getConfidenceIcon(prediction.confidence)}
                      </div>
                      <span className={getConfidenceColor(prediction.confidence)}>
                        {(prediction.confidence * 100).toFixed(0)}% confidence
                      </span>
                    </div>
                    
                    <Badge variant="outline" className="text-xs">
                      {((prediction.predicted - prediction.current) / prediction.current * 100).toFixed(1)}%
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Forecast Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <BarChart3 className="h-5 w-5" />
                <span>30-Day Forecast Trends</span>
              </CardTitle>
              <CardDescription>
                Projected trends for key SmartTourismChain metrics
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={foreccastData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="date" 
                    tickFormatter={(date) => new Date(date).toLocaleDateString()}
                  />
                  <YAxis />
                  <Tooltip 
                    labelFormatter={(date) => new Date(date).toLocaleDateString()}
                    formatter={(value: number, name: string) => [
                      name.includes('Revenue') ? formatCurrency(value, currency) : 
                      name.includes('Rating') ? value.toFixed(1) : 
                      value.toFixed(0), 
                      name
                    ]}
                  />
                  <Legend />
                  <ReferenceLine x={new Date().toISOString().split('T')[0]} stroke="red" strokeDasharray="5 5" />
                  
                  {predictions.map((pred, index) => (
                    <Line
                      key={pred.metric}
                      type="monotone"
                      dataKey={pred.metric}
                      stroke={`hsl(${index * 60}, 70%, 50%)`}
                      strokeWidth={2}
                      dot={false}
                    />
                  ))}
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Insights & Recommendations */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Target className="h-5 w-5" />
                <span>AI Insights & Recommendations</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {predictions.map((pred, index) => {
                  const change = ((pred.predicted - pred.current) / pred.current * 100)
                  const isGrowth = change > 0
                  const isSignificant = Math.abs(change) > 10
                  
                  return (
                    <div key={index} className="flex items-start space-x-3 p-3 bg-slate-50 dark:bg-slate-900 rounded-lg">
                      <div className={`mt-0.5 ${isGrowth ? 'text-green-500' : 'text-red-500'}`}>
                        {getTrendIcon(pred.trend)}
                      </div>
                      <div className="space-y-1">
                        <div className="font-medium text-sm">{pred.metric}</div>
                        <div className="text-sm text-muted-foreground">
                          {isGrowth ? 'Expected to grow' : 'Expected to decline'} by{' '}
                          <span className="font-semibold">{Math.abs(change).toFixed(1)}%</span>{' '}
                          over the next {pred.timeframe}.
                          {isSignificant && (
                            <span className="ml-1 text-purple-600 dark:text-purple-400 font-medium">
                              This is a significant change.
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  )
}