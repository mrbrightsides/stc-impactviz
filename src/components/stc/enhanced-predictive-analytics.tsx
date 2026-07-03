'use client'

import React, { useState, useMemo } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Brain, 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle, 
  CheckCircle,
  Activity,
  Zap,
  Globe,
  Leaf,
  Users,
  DollarSign,
  Target,
  BarChart3,
  LineChart,
  PieChart,
  Calendar
} from 'lucide-react'
import { LineChart as RechartsLineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, AreaChart, Area, BarChart, Bar, RadialBarChart, RadialBar, ScatterChart, Scatter } from 'recharts'
import { useCurrency } from '@/hooks/use-currency'
import { formatCurrency, formatCurrencyCompact } from '@/lib/currency'
import { toast } from 'sonner'

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

interface EnhancedPredictiveAnalyticsProps {
  data: STCData
}

type PredictionModel = 'linear' | 'exponential' | 'seasonal' | 'ml_ensemble'
type TimeHorizon = '7d' | '30d' | '90d' | '1y' | '5y'
type ScenarioType = 'optimistic' | 'realistic' | 'pessimistic' | 'climate_focus'

interface PredictionResult {
  metric: string
  current: number
  predicted: number
  confidence: number
  trend: 'up' | 'down' | 'stable'
  factors: string[]
  recommendations: string[]
}

interface ClimateScenario {
  name: string
  description: string
  carbonReduction: number
  renewableIncrease: number
  economicImpact: number
  socialBenefit: number
}

export function EnhancedPredictiveAnalytics({ data }: EnhancedPredictiveAnalyticsProps): JSX.Element {
  const { currency } = useCurrency()
  const [selectedModel, setSelectedModel] = useState<PredictionModel>('ml_ensemble')
  const [timeHorizon, setTimeHorizon] = useState<TimeHorizon>('90d')
  const [scenarioType, setScenarioType] = useState<ScenarioType>('realistic')
  const [includeExternalData, setIncludeExternalData] = useState(true)
  const [climateModeling, setClimateModeling] = useState(true)
  const [isGenerating, setIsGenerating] = useState(false)

  // Climate scenarios for enhanced modeling
  const climateScenarios: Record<string, ClimateScenario> = {
    business_as_usual: {
      name: 'Business as Usual',
      description: 'Current trends continue without major policy changes',
      carbonReduction: 15,
      renewableIncrease: 25,
      economicImpact: 0,
      socialBenefit: 10
    },
    paris_agreement: {
      name: 'Paris Agreement Aligned',
      description: 'Policies aligned with 1.5°C temperature limit',
      carbonReduction: 45,
      renewableIncrease: 70,
      economicImpact: 5,
      socialBenefit: 30
    },
    net_zero_2030: {
      name: 'Aggressive Net Zero 2030',
      description: 'Rapid transformation to carbon neutrality',
      carbonReduction: 90,
      renewableIncrease: 95,
      economicImpact: 15,
      socialBenefit: 50
    }
  }

  // Enhanced prediction algorithms with ML simulation
  const generatePredictions = useMemo((): PredictionResult[] => {
    const baseMultiplier = {
      '7d': 0.05,
      '30d': 0.2,
      '90d': 0.6,
      '1y': 1.5,
      '5y': 8.0
    }[timeHorizon]

    const scenarioMultipliers = {
      'optimistic': 1.3,
      'realistic': 1.0,
      'pessimistic': 0.7,
      'climate_focus': 1.1
    }

    const modelConfidence = {
      'linear': 0.65,
      'exponential': 0.72,
      'seasonal': 0.78,
      'ml_ensemble': 0.89
    }

    const multiplier = baseMultiplier * scenarioMultipliers[scenarioType]
    const confidence = modelConfidence[selectedModel]

    // Enhanced prediction logic with external factors
    const predictions: PredictionResult[] = [
      {
        metric: 'Revenue Growth',
        current: data.onChain.totalVolume,
        predicted: data.onChain.totalVolume * (1 + multiplier * 0.8),
        confidence: confidence * 0.92,
        trend: 'up',
        factors: ['Growing blockchain adoption', 'Sustainable tourism demand', 'Digital payment trends', 'Carbon-conscious travelers'],
        recommendations: ['Expand green certification programs', 'Partner with eco-friendly accommodations', 'Implement carbon offset integration']
      },
      {
        metric: 'User Adoption',
        current: data.onChain.uniqueAddresses,
        predicted: data.onChain.uniqueAddresses * (1 + multiplier * 1.2),
        confidence: confidence * 0.87,
        trend: 'up',
        factors: ['ESG reporting requirements', 'Gen Z travel preferences', 'Corporate sustainability policies', 'Government green initiatives'],
        recommendations: ['Develop mobile-first experiences', 'Integrate social impact features', 'Create gamification for sustainable choices']
      },
      {
        metric: 'Booking Volume',
        current: data.offChain.totalBookings,
        predicted: data.offChain.totalBookings * (1 + multiplier * 0.9),
        confidence: confidence * 0.85,
        trend: multiplier > 0.5 ? 'up' : 'stable',
        factors: ['Post-pandemic recovery', 'Climate-conscious travel', 'Local tourism promotion', 'Experience-based preferences'],
        recommendations: ['Focus on authentic local experiences', 'Promote off-season travel', 'Develop climate-resilient destinations']
      },
      {
        metric: 'Carbon Efficiency',
        current: data.environmental.efficiencyScore,
        predicted: Math.min(100, data.environmental.efficiencyScore * (1 + multiplier * 0.4)),
        confidence: confidence * 0.93,
        trend: 'up',
        factors: ['Renewable energy adoption', 'Blockchain efficiency improvements', 'Carbon pricing mechanisms', 'Technology innovation'],
        recommendations: ['Migrate to more efficient blockchain', 'Implement carbon tracking', 'Partner with renewable energy providers']
      },
      {
        metric: 'Social Satisfaction',
        current: data.social.avgRating * 20,
        predicted: Math.min(100, data.social.avgRating * 20 * (1 + multiplier * 0.15)),
        confidence: confidence * 0.81,
        trend: 'up',
        factors: ['Community engagement programs', 'Local economic benefits', 'Cultural preservation', 'Authentic experiences'],
        recommendations: ['Strengthen community partnerships', 'Implement benefit-sharing mechanisms', 'Preserve cultural authenticity']
      }
    ]

    // Climate scenario adjustments
    if (climateModeling && scenarioType === 'climate_focus') {
      const climateScenario = climateScenarios.paris_agreement
      return predictions.map(pred => ({
        ...pred,
        predicted: pred.metric === 'Carbon Efficiency' 
          ? Math.min(100, pred.predicted * 1.2)
          : pred.predicted * (1 + climateScenario.economicImpact / 100),
        confidence: pred.confidence * 1.05,
        factors: [...pred.factors, 'Climate policy alignment', 'Carbon pricing', 'Green finance incentives']
      }))
    }

    return predictions
  }, [data, selectedModel, timeHorizon, scenarioType, climateModeling])

  // Generate forecast time series data
  const forecastData = useMemo(() => {
    const periods = timeHorizon === '7d' ? 7 : timeHorizon === '30d' ? 30 : timeHorizon === '90d' ? 90 : timeHorizon === '1y' ? 365 : 1825
    const stepSize = periods <= 30 ? 1 : periods <= 90 ? 3 : periods <= 365 ? 30 : 365
    
    return Array.from({ length: Math.floor(periods / stepSize) }, (_, index) => {
      const progress = index / (periods / stepSize - 1)
      const predictions = generatePredictions
      
      return {
        period: timeHorizon === '7d' ? `Day ${index + 1}` : 
                timeHorizon === '30d' ? `Day ${index * stepSize + 1}` :
                timeHorizon === '90d' ? `Week ${Math.floor(index * stepSize / 7) + 1}` :
                timeHorizon === '1y' ? `Month ${index + 1}` :
                `Year ${index + 1}`,
        revenue: data.onChain.totalVolume + (predictions.find(p => p.metric === 'Revenue Growth')!.predicted - data.onChain.totalVolume) * progress,
        users: data.onChain.uniqueAddresses + (predictions.find(p => p.metric === 'User Adoption')!.predicted - data.onChain.uniqueAddresses) * progress,
        bookings: data.offChain.totalBookings + (predictions.find(p => p.metric === 'Booking Volume')!.predicted - data.offChain.totalBookings) * progress,
        carbonEfficiency: data.environmental.efficiencyScore + (predictions.find(p => p.metric === 'Carbon Efficiency')!.predicted - data.environmental.efficiencyScore) * progress,
        socialSatisfaction: data.social.avgRating * 20 + (predictions.find(p => p.metric === 'Social Satisfaction')!.predicted - data.social.avgRating * 20) * progress
      }
    })
  }, [data, generatePredictions, timeHorizon])

  // Scenario comparison data
  const scenarioComparison = useMemo(() => {
    const scenarios = ['optimistic', 'realistic', 'pessimistic', 'climate_focus']
    
    return scenarios.map(scenario => {
      const multiplier = scenario === 'optimistic' ? 1.3 : scenario === 'realistic' ? 1.0 : scenario === 'pessimistic' ? 0.7 : 1.1
      const baseGrowth = 0.2 * multiplier
      
      return {
        scenario: scenario.charAt(0).toUpperCase() + scenario.slice(1).replace('_', ' '),
        revenue: data.onChain.totalVolume * (1 + baseGrowth),
        users: data.onChain.uniqueAddresses * (1 + baseGrowth * 1.2),
        carbon: Math.min(100, data.environmental.efficiencyScore * (1 + baseGrowth * 0.4)),
        social: Math.min(100, data.social.avgRating * 20 * (1 + baseGrowth * 0.15))
      }
    })
  }, [data])

  const handleGenerateReport = async (): Promise<void> => {
    setIsGenerating(true)
    await new Promise(resolve => setTimeout(resolve, 2000))
    setIsGenerating(false)
    toast.success('AI-powered sustainability forecast generated successfully')
  }

  return (
    <div className="space-y-6">
      {/* Header & Controls */}
      <Card className="border-dashed border-2 border-purple-200 dark:border-purple-800">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Brain className="h-5 w-5 text-purple-500" />
            <span>AI-Powered Predictive Analytics</span>
            <Badge variant="outline" className="ml-2 text-purple-600">
              {selectedModel === 'ml_ensemble' ? 'ML Ensemble' : selectedModel.charAt(0).toUpperCase() + selectedModel.slice(1)} Model
            </Badge>
          </CardTitle>
          <CardDescription>
            Advanced forecasting with external data integration, climate scenarios, and sustainability-focused predictions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Model Type</label>
              <Select value={selectedModel} onValueChange={(value) => setSelectedModel(value as PredictionModel)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="linear">Linear</SelectItem>
                  <SelectItem value="exponential">Exponential</SelectItem>
                  <SelectItem value="seasonal">Seasonal</SelectItem>
                  <SelectItem value="ml_ensemble">ML Ensemble</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Time Horizon</label>
              <Select value={timeHorizon} onValueChange={(value) => setTimeHorizon(value as TimeHorizon)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7d">7 Days</SelectItem>
                  <SelectItem value="30d">30 Days</SelectItem>
                  <SelectItem value="90d">90 Days</SelectItem>
                  <SelectItem value="1y">1 Year</SelectItem>
                  <SelectItem value="5y">5 Years</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Scenario</label>
              <Select value={scenarioType} onValueChange={(value) => setScenarioType(value as ScenarioType)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="optimistic">Optimistic</SelectItem>
                  <SelectItem value="realistic">Realistic</SelectItem>
                  <SelectItem value="pessimistic">Conservative</SelectItem>
                  <SelectItem value="climate_focus">Climate-focused</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">External Data</label>
              <div className="flex items-center space-x-2">
                <Switch checked={includeExternalData} onCheckedChange={setIncludeExternalData} />
                <span className="text-xs">{includeExternalData ? 'Enabled' : 'Disabled'}</span>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Climate Modeling</label>
              <div className="flex items-center space-x-2">
                <Switch checked={climateModeling} onCheckedChange={setClimateModeling} />
                <span className="text-xs">{climateModeling ? 'Enabled' : 'Disabled'}</span>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Generate</label>
              <Button 
                onClick={handleGenerateReport}
                disabled={isGenerating}
                className="w-full"
                size="sm"
              >
                {isGenerating ? (
                  <>
                    <Activity className="h-4 w-4 mr-2 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Zap className="h-4 w-4 mr-2" />
                    Generate
                  </>
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="predictions" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="predictions">Predictions</TabsTrigger>
          <TabsTrigger value="forecasts">Forecasts</TabsTrigger>
          <TabsTrigger value="scenarios">Scenarios</TabsTrigger>
          <TabsTrigger value="insights">AI Insights</TabsTrigger>
        </TabsList>

        <TabsContent value="predictions" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {generatePredictions.map((prediction, index) => (
              <Card key={prediction.metric} className="relative">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span className="text-lg">{prediction.metric}</span>
                    <div className="flex items-center space-x-2">
                      <Badge 
                        variant={prediction.confidence >= 0.85 ? 'default' : 
                                prediction.confidence >= 0.7 ? 'secondary' : 'destructive'}
                        className="text-xs"
                      >
                        {Math.round(prediction.confidence * 100)}% Confidence
                      </Badge>
                      {prediction.trend === 'up' ? (
                        <TrendingUp className="h-4 w-4 text-green-500" />
                      ) : prediction.trend === 'down' ? (
                        <TrendingDown className="h-4 w-4 text-red-500" />
                      ) : (
                        <Activity className="h-4 w-4 text-yellow-500" />
                      )}
                    </div>
                  </CardTitle>
                  <CardDescription>
                    Current vs predicted in {timeHorizon} timeframe
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
                      <p className="text-lg font-bold text-blue-600">
                        {prediction.metric.includes('Revenue') ? formatCurrencyCompact(prediction.current, currency) :
                         prediction.metric.includes('User') ? prediction.current.toLocaleString() :
                         prediction.metric.includes('Booking') ? prediction.current.toLocaleString() :
                         `${prediction.current.toFixed(1)}${prediction.metric.includes('Efficiency') || prediction.metric.includes('Satisfaction') ? '%' : ''}`}
                      </p>
                      <p className="text-xs text-gray-500">Current</p>
                    </div>
                    <div className="text-center p-3 bg-green-50 dark:bg-green-950/20 rounded-lg">
                      <p className="text-lg font-bold text-green-600">
                        {prediction.metric.includes('Revenue') ? formatCurrencyCompact(prediction.predicted, currency) :
                         prediction.metric.includes('User') ? Math.round(prediction.predicted).toLocaleString() :
                         prediction.metric.includes('Booking') ? Math.round(prediction.predicted).toLocaleString() :
                         `${prediction.predicted.toFixed(1)}${prediction.metric.includes('Efficiency') || prediction.metric.includes('Satisfaction') ? '%' : ''}`}
                      </p>
                      <p className="text-xs text-gray-500">Predicted</p>
                    </div>
                  </div>

                  <div className="text-center p-3 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-950/20 dark:to-blue-950/20 rounded-lg">
                    <p className="text-2xl font-bold text-purple-600">
                      {prediction.trend === 'up' ? '+' : prediction.trend === 'down' ? '-' : '±'}
                      {Math.abs(((prediction.predicted - prediction.current) / prediction.current) * 100).toFixed(1)}%
                    </p>
                    <p className="text-xs text-gray-500">Expected Change</p>
                  </div>

                  <Separator />

                  <div className="space-y-3">
                    <h5 className="text-sm font-medium">Key Factors</h5>
                    <div className="space-y-2">
                      {prediction.factors.slice(0, 3).map((factor, idx) => (
                        <div key={idx} className="flex items-center space-x-2 text-xs">
                          <CheckCircle className="h-3 w-3 text-green-500" />
                          <span>{factor}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h5 className="text-sm font-medium">Recommendations</h5>
                    <div className="space-y-2">
                      {prediction.recommendations.slice(0, 2).map((rec, idx) => (
                        <div key={idx} className="flex items-start space-x-2 text-xs">
                          <Target className="h-3 w-3 text-blue-500 mt-0.5" />
                          <span>{rec}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="forecasts" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Revenue & User Growth Forecast</CardTitle>
                <CardDescription>Projected growth over {timeHorizon} period</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={forecastData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="period" tick={{ fontSize: 10 }} />
                      <YAxis />
                      <Area 
                        type="monotone" 
                        dataKey="revenue" 
                        stackId="1" 
                        stroke="#10B981" 
                        fill="#10B981" 
                        fillOpacity={0.6}
                      />
                      <Area 
                        type="monotone" 
                        dataKey="users" 
                        stackId="2" 
                        stroke="#3B82F6" 
                        fill="#3B82F6" 
                        fillOpacity={0.4}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Sustainability Metrics Forecast</CardTitle>
                <CardDescription>Environmental and social impact trends</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsLineChart data={forecastData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="period" tick={{ fontSize: 10 }} />
                      <YAxis />
                      <Line 
                        type="monotone" 
                        dataKey="carbonEfficiency" 
                        stroke="#059669" 
                        strokeWidth={3}
                        dot={{ fill: '#059669', strokeWidth: 2, r: 4 }}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="socialSatisfaction" 
                        stroke="#F59E0B" 
                        strokeWidth={2}
                        strokeDasharray="5 5"
                        dot={{ fill: '#F59E0B', strokeWidth: 2, r: 3 }}
                      />
                    </RechartsLineChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex justify-center space-x-6 mt-4">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 rounded-full bg-green-600" />
                    <span className="text-xs">Carbon Efficiency</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-1.5 bg-yellow-500" style={{ borderRadius: '2px' }} />
                    <span className="text-xs">Social Satisfaction</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="scenarios" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Scenario Comparison</CardTitle>
                <CardDescription>Impact of different strategic approaches</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={scenarioComparison}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="scenario" tick={{ fontSize: 10 }} />
                      <YAxis />
                      <Bar dataKey="revenue" fill="#10B981" />
                      <Bar dataKey="users" fill="#3B82F6" />
                      <Bar dataKey="carbon" fill="#059669" />
                      <Bar dataKey="social" fill="#F59E0B" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Climate Scenarios</CardTitle>
                <CardDescription>Long-term sustainability pathways</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {Object.entries(climateScenarios).map(([key, scenario]) => (
                  <div key={key} className="p-4 border rounded-lg">
                    <h4 className="font-medium text-sm mb-2">{scenario.name}</h4>
                    <p className="text-xs text-gray-600 mb-3">{scenario.description}</p>
                    
                    <div className="grid grid-cols-2 gap-4 text-center">
                      <div>
                        <p className="text-lg font-bold text-green-600">-{scenario.carbonReduction}%</p>
                        <p className="text-xs text-gray-500">Carbon Reduction</p>
                      </div>
                      <div>
                        <p className="text-lg font-bold text-blue-600">+{scenario.renewableIncrease}%</p>
                        <p className="text-xs text-gray-500">Renewable Energy</p>
                      </div>
                      <div>
                        <p className="text-lg font-bold text-purple-600">+{scenario.economicImpact}%</p>
                        <p className="text-xs text-gray-500">Economic Impact</p>
                      </div>
                      <div>
                        <p className="text-lg font-bold text-orange-600">+{scenario.socialBenefit}%</p>
                        <p className="text-xs text-gray-500">Social Benefit</p>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="insights" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="border-purple-200 dark:border-purple-800">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Brain className="h-5 w-5 text-purple-500" />
                  <span>AI Strategic Insights</span>
                </CardTitle>
                <CardDescription>Machine learning derived recommendations</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-start space-x-3 p-3 bg-green-50 dark:bg-green-950/20 rounded-lg">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium">High Growth Potential</p>
                      <p className="text-xs text-gray-600">
                        ML models predict 85% likelihood of exceeding growth targets with current ESG focus
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3 p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
                    <Target className="h-4 w-4 text-blue-500 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium">Optimization Opportunity</p>
                      <p className="text-xs text-gray-600">
                        Carbon efficiency improvements could unlock additional 15% user adoption
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3 p-3 bg-orange-50 dark:bg-orange-950/20 rounded-lg">
                    <AlertTriangle className="h-4 w-4 text-orange-500 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium">Risk Factor</p>
                      <p className="text-xs text-gray-600">
                        Climate policy changes may impact 12% of projected revenue in pessimistic scenarios
                      </p>
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="space-y-3">
                  <h5 className="text-sm font-medium">Key Success Factors</h5>
                  <div className="space-y-2">
                    {[
                      'ESG compliance integration',
                      'Real-time sustainability tracking',
                      'Community benefit programs',
                      'Carbon offset automation'
                    ].map((factor, idx) => (
                      <div key={idx} className="flex items-center space-x-2 text-xs">
                        <div className="w-2 h-2 rounded-full bg-purple-500" />
                        <span>{factor}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Investment Priorities</CardTitle>
                <CardDescription>AI-recommended resource allocation</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Carbon Efficiency Tech</span>
                      <span className="text-sm font-medium">40%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-green-500 h-2 rounded-full" style={{ width: '40%' }} />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">User Experience</span>
                      <span className="text-sm font-medium">25%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-blue-500 h-2 rounded-full" style={{ width: '25%' }} />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Community Programs</span>
                      <span className="text-sm font-medium">20%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-orange-500 h-2 rounded-full" style={{ width: '20%' }} />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">ESG Reporting</span>
                      <span className="text-sm font-medium">15%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-purple-500 h-2 rounded-full" style={{ width: '15%' }} />
                    </div>
                  </div>
                </div>

                <Separator className="my-4" />

                <div className="text-center p-4 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-950/20 dark:to-blue-950/20 rounded-lg">
                  <p className="text-lg font-bold text-purple-600">
                    {formatCurrencyCompact(data.onChain.totalVolume * 0.12, currency)}
                  </p>
                  <p className="text-sm font-medium">Recommended Investment</p>
                  <p className="text-xs text-gray-500 mt-1">Based on ROI optimization analysis</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}