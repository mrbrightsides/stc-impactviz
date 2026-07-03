'use client'

import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Separator } from '@/components/ui/separator'
import { Leaf, Zap, Droplets, Recycle, Wind, TreePine, BarChart3, TrendingDown, TrendingUp, Target } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, AreaChart, Area, RadialBarChart, RadialBar } from 'recharts'
import { useCurrency } from '@/hooks/use-currency'
import { formatCurrency, CARBON_OFFSET_PRICING } from '@/lib/currency'

interface EnvironmentalDashboardProps {
  data: {
    environmental: {
      totalEnergyConsumption: number
      co2Equivalent: number
      efficiencyScore: number
      renewableEnergyPercent: number
    }
    onChain: {
      transactions: Array<{
        gasUsed: number
        timestamp: number
      }>
      avgGasFee: number
    }
  }
  carbonLayerEnabled: boolean
}

const EFFICIENCY_COLORS = {
  excellent: '#10b981',
  good: '#84cc16',
  fair: '#eab308',
  poor: '#ef4444'
}

const ECO_METRICS_COLORS = ['#10b981', '#06b6d4', '#3b82f6', '#8b5cf6', '#ec4899']

export const EnvironmentalDashboard: React.FC<EnvironmentalDashboardProps> = ({ data, carbonLayerEnabled }) => {
  const { currency } = useCurrency()
  const energyAnalysis = calculateEnergyAnalysis(data)
  const carbonFootprint = calculateCarbonFootprint(data)
  const efficiencyTrends = calculateEfficiencyTrends(data)
  const renewableBreakdown = calculateRenewableBreakdown(data.environmental)
  const sustainabilityGoals = calculateSustainabilityGoals(data)
  const environmentalImpact = calculateEnvironmentalImpact(data)

  const getEfficiencyColor = (score: number) => {
    if (score >= 90) return EFFICIENCY_COLORS.excellent
    if (score >= 75) return EFFICIENCY_COLORS.good
    if (score >= 60) return EFFICIENCY_COLORS.fair
    return EFFICIENCY_COLORS.poor
  }

  const getEfficiencyLabel = (score: number) => {
    if (score >= 90) return 'Excellent'
    if (score >= 75) return 'Good'
    if (score >= 60) return 'Fair'
    return 'Needs Improvement'
  }

  return (
    <div className="space-y-6">
      {/* Key Environmental Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Energy Consumption</CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{(data.environmental.totalEnergyConsumption / 1000).toFixed(1)}k</div>
            <p className="text-xs text-muted-foreground">
              kWh total usage
            </p>
            <div className="mt-2">
              <Badge variant={data.environmental.renewableEnergyPercent > 50 ? "default" : "secondary"} className="text-xs">
                {data.environmental.renewableEnergyPercent.toFixed(0)}% renewable
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Carbon Footprint</CardTitle>
            <TreePine className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{(data.environmental.co2Equivalent / 1000).toFixed(1)}t</div>
            <p className="text-xs text-muted-foreground">
              CO₂ equivalent
            </p>
            <div className="mt-2">
              <Badge variant={carbonFootprint.trend < 0 ? "default" : "destructive"} className="text-xs">
                {carbonFootprint.trend < 0 ? <TrendingDown className="h-3 w-3 mr-1" /> : <TrendingUp className="h-3 w-3 mr-1" />}
                {Math.abs(carbonFootprint.trend).toFixed(1)}%
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Efficiency Score</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <div className="text-2xl font-bold">{data.environmental.efficiencyScore}</div>
              <div className="text-xs text-muted-foreground">/100</div>
            </div>
            <div className="mt-2">
              <Badge 
                style={{ backgroundColor: getEfficiencyColor(data.environmental.efficiencyScore) }}
                className="text-xs text-white"
              >
                {getEfficiencyLabel(data.environmental.efficiencyScore)}
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Gas Efficiency</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{energyAnalysis.gasEfficiency.toFixed(0)}</div>
            <p className="text-xs text-muted-foreground">
              Transactions per kWh
            </p>
            <div className="mt-2">
              <Badge variant="outline" className="text-xs">
                {energyAnalysis.avgGasPerTransaction.toFixed(0)} gwei/tx
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Energy Sources Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Wind className="h-5 w-5" />
              <span>Energy Sources</span>
            </CardTitle>
            <CardDescription>
              Breakdown of energy sources powering blockchain operations
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={renewableBreakdown}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {renewableBreakdown.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={ECO_METRICS_COLORS[index % ECO_METRICS_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Renewable Energy Goal</span>
                <span className="text-sm font-medium">75%</span>
              </div>
              <Progress value={data.environmental.renewableEnergyPercent} max={75} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Recycle className="h-5 w-5" />
              <span>Efficiency Metrics</span>
            </CardTitle>
            <CardDescription>
              Environmental efficiency across different metrics
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <RadialBarChart cx="50%" cy="50%" innerRadius="20%" outerRadius="80%" data={[
                { name: 'Energy Efficiency', value: data.environmental.efficiencyScore, fill: '#10b981' },
                { name: 'Carbon Reduction', value: 100 - (carbonFootprint.intensity * 10), fill: '#06b6d4' },
                { name: 'Renewable Usage', value: data.environmental.renewableEnergyPercent, fill: '#3b82f6' },
                { name: 'Gas Optimization', value: Math.min((energyAnalysis.gasEfficiency / 100) * 100, 100), fill: '#8b5cf6' },
              ]}>
                <RadialBar dataKey="value" cornerRadius={10} fill="#8884d8" />
                <Tooltip />
              </RadialBarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Efficiency Trends */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <TrendingUp className="h-5 w-5" />
            <span>Environmental Performance Trends</span>
          </CardTitle>
          <CardDescription>
            Daily tracking of energy consumption and efficiency metrics
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={efficiencyTrends}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip />
              <Legend />
              <Area yAxisId="left" type="monotone" dataKey="energyConsumption" stackId="1" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.7} name="Energy (kWh)" />
              <Area yAxisId="left" type="monotone" dataKey="renewableEnergy" stackId="1" stroke="#10b981" fill="#10b981" fillOpacity={0.7} name="Renewable (kWh)" />
              <Line yAxisId="right" type="monotone" dataKey="efficiencyScore" stroke="#ef4444" strokeWidth={2} name="Efficiency Score" />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Carbon Layer (Optional) */}
      {carbonLayerEnabled && (
        <Card className="border-2 border-dashed border-green-300 dark:border-green-700">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TreePine className="h-5 w-5 text-green-600" />
              <span>Carbon Layer Analysis</span>
              <Badge variant="secondary">Optional</Badge>
            </CardTitle>
            <CardDescription>
              Advanced carbon footprint analysis and offset recommendations
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <h4 className="text-sm font-medium">Carbon Intensity</h4>
                <div className="text-2xl font-bold text-green-600">{carbonFootprint.intensity.toFixed(2)}</div>
                <p className="text-xs text-muted-foreground">kg CO₂/transaction</p>
              </div>
              
              <div className="space-y-2">
                <h4 className="text-sm font-medium">Offset Required</h4>
                <div className="text-2xl font-bold text-blue-600">{carbonFootprint.offsetRequired.toFixed(1)}t</div>
                <p className="text-xs text-muted-foreground">CO₂ to neutralize</p>
              </div>
              
              <div className="space-y-2">
                <h4 className="text-sm font-medium">Estimated Cost</h4>
                <div className="text-2xl font-bold text-purple-600">{formatCurrency(carbonFootprint.offsetCost, currency)}</div>
                <p className="text-xs text-muted-foreground">For carbon neutrality</p>
              </div>
            </div>
            
            <Separator />
            
            <div className="space-y-3">
              <h4 className="text-sm font-medium">Carbon Reduction Recommendations</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="p-3 bg-green-50 dark:bg-green-950/20 rounded-lg">
                  <div className="flex items-center space-x-2 mb-1">
                    <Wind className="h-4 w-4 text-green-600" />
                    <span className="text-sm font-medium">Renewable Energy</span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Increase renewable energy to 85% to reduce CO₂ by 1.2t annually
                  </p>
                </div>
                
                <div className="p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
                  <div className="flex items-center space-x-2 mb-1">
                    <Zap className="h-4 w-4 text-blue-600" />
                    <span className="text-sm font-medium">Gas Optimization</span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Optimize smart contracts to reduce gas usage by 15-20%
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Sustainability Goals */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Target className="h-5 w-5" />
            <span>Sustainability Goals</span>
          </CardTitle>
          <CardDescription>
            Progress towards environmental sustainability targets
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {sustainabilityGoals.map((goal, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <goal.icon className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">{goal.name}</span>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-bold">{goal.progress.toFixed(1)}%</div>
                    <div className="text-xs text-muted-foreground">Target: {goal.target}</div>
                  </div>
                </div>
                <Progress value={goal.progress} className="w-full" />
                <p className="text-xs text-muted-foreground">{goal.description}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Environmental Impact Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Environmental Impact Summary</CardTitle>
          <CardDescription>
            Key environmental indicators and sustainability metrics
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-3">
              <h4 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground">Carbon Intensity</h4>
              <div className="text-2xl font-bold">{carbonFootprint.intensity.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground">kg CO₂ per transaction</p>
            </div>
            
            <div className="space-y-3">
              <h4 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground">Green Energy Usage</h4>
              <div className="text-2xl font-bold">{data.environmental.renewableEnergyPercent.toFixed(0)}%</div>
              <p className="text-xs text-muted-foreground">Renewable energy share</p>
            </div>
            
            <div className="space-y-3">
              <h4 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground">Efficiency Rating</h4>
              <div className="text-2xl font-bold">{getEfficiencyLabel(data.environmental.efficiencyScore)}</div>
              <p className="text-xs text-muted-foreground">{data.environmental.efficiencyScore}/100 score</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function calculateEnergyAnalysis(data: any) {
  const totalTransactions = data.onChain.transactions.length
  const totalEnergy = data.environmental.totalEnergyConsumption
  const gasEfficiency = totalTransactions / (totalEnergy / 1000) // transactions per kWh
  const avgGasPerTransaction = data.onChain.avgGasFee

  return {
    gasEfficiency,
    avgGasPerTransaction,
    energyPerTransaction: totalEnergy / totalTransactions
  }
}

function calculateCarbonFootprint(data: any) {
  const totalCO2 = data.environmental.co2Equivalent
  const totalTransactions = data.onChain.transactions.length
  const intensity = totalCO2 / totalTransactions // kg CO2 per transaction
  
  // Mock trend calculation
  const trend = Math.random() * 20 - 10 // -10% to +10%
  
  // Calculate offset requirements using standard carbon pricing
  const offsetRequired = totalCO2 / 1000 // tons
  const offsetCost = offsetRequired * CARBON_OFFSET_PRICING.STANDARD_RATE
  
  return {
    intensity,
    trend,
    offsetRequired,
    offsetCost
  }
}

function calculateEfficiencyTrends(data: any) {
  // Generate daily efficiency data for the past 14 days
  const trends = []
  const baseDate = new Date()
  
  for (let i = 13; i >= 0; i--) {
    const date = new Date(baseDate)
    date.setDate(date.getDate() - i)
    
    const energyConsumption = data.environmental.totalEnergyConsumption / 14 + (Math.random() - 0.5) * 200
    const renewablePercent = data.environmental.renewableEnergyPercent + (Math.random() - 0.5) * 10
    const renewableEnergy = energyConsumption * (renewablePercent / 100)
    const efficiencyScore = data.environmental.efficiencyScore + (Math.random() - 0.5) * 10
    
    trends.push({
      date: date.toISOString().split('T')[0],
      energyConsumption: Math.round(energyConsumption),
      renewableEnergy: Math.round(renewableEnergy),
      efficiencyScore: Math.round(Math.max(0, Math.min(100, efficiencyScore)))
    })
  }
  
  return trends
}

function calculateRenewableBreakdown(environmentalData: any) {
  const renewable = environmentalData.renewableEnergyPercent
  const nonRenewable = 100 - renewable
  
  // Break down renewable sources
  const solarPercent = renewable * 0.4
  const windPercent = renewable * 0.35
  const hydroPercent = renewable * 0.2
  const otherRenewablePercent = renewable * 0.05
  
  return [
    { name: 'Solar', value: solarPercent },
    { name: 'Wind', value: windPercent },
    { name: 'Hydro', value: hydroPercent },
    { name: 'Other Renewable', value: otherRenewablePercent },
    { name: 'Non-Renewable', value: nonRenewable }
  ].filter(item => item.value > 0)
}

function calculateSustainabilityGoals(data: any) {
  return [
    {
      name: 'Carbon Neutrality',
      progress: Math.max(0, 100 - (data.environmental.co2Equivalent / 3000) * 100),
      target: '< 3t CO₂/year',
      description: 'Reduce total carbon emissions to achieve carbon neutrality',
      icon: TreePine
    },
    {
      name: 'Renewable Energy',
      progress: (data.environmental.renewableEnergyPercent / 85) * 100,
      target: '85% renewable',
      description: 'Increase renewable energy usage in blockchain operations',
      icon: Wind
    },
    {
      name: 'Energy Efficiency',
      progress: data.environmental.efficiencyScore,
      target: '90+ efficiency',
      description: 'Optimize energy consumption per transaction',
      icon: Zap
    },
    {
      name: 'Gas Optimization',
      progress: Math.min(100, (calculateEnergyAnalysis(data).gasEfficiency / 50) * 100),
      target: '50+ tx/kWh',
      description: 'Improve transaction throughput per unit of energy',
      icon: BarChart3
    }
  ]
}

function calculateEnvironmentalImpact(data: any) {
  const carbonIntensity = data.environmental.co2Equivalent / data.onChain.transactions.length
  const renewableUsage = data.environmental.renewableEnergyPercent
  const efficiencyRating = data.environmental.efficiencyScore
  
  // Calculate overall environmental score
  const environmentalScore = (
    (100 - Math.min(carbonIntensity * 20, 100)) * 0.4 +
    renewableUsage * 0.3 +
    efficiencyRating * 0.3
  )
  
  return {
    score: Math.round(environmentalScore),
    carbonIntensity,
    renewableUsage,
    efficiencyRating
  }
}