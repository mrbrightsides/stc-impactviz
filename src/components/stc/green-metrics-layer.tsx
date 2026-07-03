'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { Progress } from '@/components/ui/progress'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { 
  Leaf, 
  Zap, 
  TrendingUp, 
  TrendingDown, 
  Activity, 
  Server, 
  Globe, 
  Lightbulb,
  AlertTriangle,
  CheckCircle,
  Info,
  BarChart3
} from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, Area, AreaChart } from 'recharts'
import { toast } from 'sonner'
import { useCurrency } from '@/hooks/use-currency'
import { formatCurrency } from '@/lib/currency'

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
  environmental: {
    totalEnergyConsumption: number
    co2Equivalent: number
    efficiencyScore: number
    renewableEnergyPercent: number
  }
}

interface GreenMetricsLayerProps {
  data: STCData
}

interface BlockchainNetwork {
  name: string
  symbol: string
  consensus: string
  energyPerTx: number // kWh per transaction
  co2PerTx: number // grams CO2 per transaction
  renewablePercent: number
  tps: number // transactions per second
  validators: number
  marketCap: number // in billions USD
  color: string
  description: string
}

interface ValidatorMetrics {
  id: string
  name: string
  network: string
  energyEfficiency: number // 0-100
  uptime: number // percentage
  co2Footprint: number // tons per year
  renewableEnergy: number // percentage
  location: string
  stakingAPY: number
}

const blockchainNetworks: BlockchainNetwork[] = [
  {
    name: 'Ethereum',
    symbol: 'ETH',
    consensus: 'Proof of Stake',
    energyPerTx: 0.0026, // kWh after PoS transition
    co2PerTx: 1.4, // grams
    renewablePercent: 25,
    tps: 15,
    validators: 500000,
    marketCap: 200,
    color: '#627EEA',
    description: 'Leading smart contract platform with PoS consensus'
  },
  {
    name: 'Polygon',
    symbol: 'MATIC',
    consensus: 'Proof of Stake',
    energyPerTx: 0.00013,
    co2PerTx: 0.07,
    renewablePercent: 60,
    tps: 7000,
    validators: 100,
    marketCap: 8,
    color: '#8247E5',
    description: 'Layer 2 scaling solution with carbon negative approach'
  },
  {
    name: 'Solana',
    symbol: 'SOL',
    consensus: 'Proof of History',
    energyPerTx: 0.00051,
    co2PerTx: 0.27,
    renewablePercent: 45,
    tps: 65000,
    validators: 1350,
    marketCap: 35,
    color: '#14F195',
    description: 'High-performance blockchain with innovative consensus'
  },
  {
    name: 'Cardano',
    symbol: 'ADA',
    consensus: 'Proof of Stake',
    energyPerTx: 0.0017,
    co2PerTx: 0.9,
    renewablePercent: 70,
    tps: 250,
    validators: 3200,
    marketCap: 15,
    color: '#0033AD',
    description: 'Research-driven blockchain with sustainability focus'
  },
  {
    name: 'Tezos',
    symbol: 'XTZ',
    consensus: 'Proof of Stake',
    energyPerTx: 0.0003,
    co2PerTx: 0.16,
    renewablePercent: 80,
    tps: 40,
    validators: 400,
    marketCap: 1,
    color: '#2C7DF7',
    description: 'Self-amending blockchain with minimal energy footprint'
  },
  {
    name: 'SmartTourismChain',
    symbol: 'STC',
    consensus: 'Delegated PoS',
    energyPerTx: 0.0001,
    co2PerTx: 0.05,
    renewablePercent: 90,
    tps: 10000,
    validators: 21,
    marketCap: 0.1,
    color: '#10B981',
    description: 'Tourism-focused blockchain with 90% renewable energy'
  }
]

const sampleValidators: ValidatorMetrics[] = [
  {
    id: 'val-001',
    name: 'GreenStake Validator',
    network: 'SmartTourismChain',
    energyEfficiency: 98,
    uptime: 99.9,
    co2Footprint: 0.5,
    renewableEnergy: 100,
    location: 'Iceland',
    stakingAPY: 12.5
  },
  {
    id: 'val-002',
    name: 'EcoNode Solutions',
    network: 'SmartTourismChain',
    energyEfficiency: 95,
    uptime: 99.7,
    co2Footprint: 0.8,
    renewableEnergy: 85,
    location: 'Norway',
    stakingAPY: 11.8
  },
  {
    id: 'val-003',
    name: 'SolarPower Validator',
    network: 'Ethereum',
    energyEfficiency: 88,
    uptime: 99.5,
    co2Footprint: 2.1,
    renewableEnergy: 75,
    location: 'Germany',
    stakingAPY: 4.2
  },
  {
    id: 'val-004',
    name: 'HydroStake',
    network: 'Polygon',
    energyEfficiency: 92,
    uptime: 99.8,
    co2Footprint: 0.3,
    renewableEnergy: 95,
    location: 'Canada',
    stakingAPY: 8.7
  }
]

export function GreenMetricsLayer({ data }: GreenMetricsLayerProps): JSX.Element {
  const { currency } = useCurrency()
  const [selectedNetwork, setSelectedNetwork] = useState('SmartTourismChain')
  const [compareMode, setCompareMode] = useState(false)
  const [selectedNetworks, setSelectedNetworks] = useState<string[]>(['SmartTourismChain', 'Ethereum', 'Polygon'])
  const [liveTracking, setLiveTracking] = useState(false)
  const [refreshing, setRefreshing] = useState(false)

  // Calculate greener percentage for current network vs others
  const currentNetwork = blockchainNetworks.find(n => n.name === selectedNetwork)!
  const avgEnergyOthers = blockchainNetworks
    .filter(n => n.name !== selectedNetwork)
    .reduce((sum, n) => sum + n.energyPerTx, 0) / (blockchainNetworks.length - 1)
  
  const greenerPercentage = Math.round(((avgEnergyOthers - currentNetwork.energyPerTx) / avgEnergyOthers) * 100)

  // Prepare comparison data
  const comparisonData = blockchainNetworks
    .filter(n => selectedNetworks.includes(n.name))
    .map(network => ({
      name: network.symbol,
      fullName: network.name,
      energy: network.energyPerTx * 1000, // Convert to Wh for better visualization
      co2: network.co2PerTx,
      renewable: network.renewablePercent,
      tps: network.tps,
      efficiency: 100 - (network.energyPerTx * 10000), // Efficiency score
      color: network.color
    }))

  const handleRefresh = async (): Promise<void> => {
    setRefreshing(true)
    await new Promise(resolve => setTimeout(resolve, 1500))
    setRefreshing(false)
    toast.success('Green metrics updated successfully')
  }

  const handleNetworkToggle = (networkName: string): void => {
    if (selectedNetworks.includes(networkName)) {
      if (selectedNetworks.length > 1) {
        setSelectedNetworks(prev => prev.filter(n => n !== networkName))
      }
    } else {
      setSelectedNetworks(prev => [...prev, networkName])
    }
  }

  const pieData = [
    { name: 'Renewable Energy', value: currentNetwork.renewablePercent, color: '#10B981' },
    { name: 'Non-renewable', value: 100 - currentNetwork.renewablePercent, color: '#EF4444' }
  ]

  const validatorData = sampleValidators
    .filter(v => selectedNetworks.includes(v.network))
    .map(v => ({
      name: v.name.split(' ')[0],
      efficiency: v.energyEfficiency,
      renewable: v.renewableEnergy,
      uptime: v.uptime,
      co2: v.co2Footprint
    }))

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="border-dashed border-2 border-green-200 dark:border-green-800">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Leaf className="h-5 w-5 text-green-500" />
            <span>Green Metrics Layer</span>
            {liveTracking && (
              <Badge variant="outline" className="ml-2 text-green-600 border-green-600">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse mr-1"></div>
                Live Tracking
              </Badge>
            )}
          </CardTitle>
          <CardDescription>
            Benchmark blockchain energy efficiency and environmental impact across networks
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <span className="text-sm">Compare Networks</span>
                <Switch 
                  checked={compareMode} 
                  onCheckedChange={setCompareMode}
                />
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm">Live Tracking</span>
                <Switch 
                  checked={liveTracking} 
                  onCheckedChange={setLiveTracking}
                />
              </div>
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleRefresh}
              disabled={refreshing}
            >
              <Activity className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
              {refreshing ? 'Refreshing...' : 'Refresh Data'}
            </Button>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="networks" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="networks">Network Comparison</TabsTrigger>
          <TabsTrigger value="validators">Validator Tracking</TabsTrigger>
          <TabsTrigger value="insights">Green Insights</TabsTrigger>
        </TabsList>

        <TabsContent value="networks" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Network Selection */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Blockchain Networks</CardTitle>
                <CardDescription>Select networks for analysis and comparison</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {blockchainNetworks.map(network => {
                  const isSelected = compareMode ? selectedNetworks.includes(network.name) : selectedNetwork === network.name
                  const isCurrent = selectedNetwork === network.name
                  
                  return (
                    <div
                      key={network.name}
                      className={`p-3 rounded-lg border-2 cursor-pointer transition-all ${
                        isSelected 
                          ? 'border-green-500 bg-green-50 dark:bg-green-950/20' 
                          : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
                      }`}
                      onClick={() => {
                        if (compareMode) {
                          handleNetworkToggle(network.name)
                        } else {
                          setSelectedNetwork(network.name)
                        }
                      }}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-3">
                          <div 
                            className="w-3 h-3 rounded-full mt-1" 
                            style={{ backgroundColor: network.color }}
                          />
                          <div>
                            <h4 className="font-medium text-sm">{network.name}</h4>
                            <p className="text-xs text-gray-500 mt-1">{network.description}</p>
                            <div className="flex items-center space-x-3 mt-2">
                              <Badge variant="outline" className="text-xs">
                                {network.energyPerTx * 1000} Wh/tx
                              </Badge>
                              <Badge 
                                variant={network.renewablePercent >= 70 ? 'default' : 
                                        network.renewablePercent >= 40 ? 'secondary' : 'destructive'}
                                className="text-xs"
                              >
                                {network.renewablePercent}% Green
                              </Badge>
                            </div>
                          </div>
                        </div>
                        {isCurrent && !compareMode && (
                          <CheckCircle className="h-4 w-4 text-green-500" />
                        )}
                      </div>
                    </div>
                  )
                })}
              </CardContent>
            </Card>

            {/* Current Network Details */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>{currentNetwork.name} Metrics</span>
                  <Badge 
                    variant={greenerPercentage > 80 ? 'default' : 
                            greenerPercentage > 50 ? 'secondary' : 'destructive'}
                    className="font-bold"
                  >
                    {greenerPercentage > 0 ? '+' : ''}{greenerPercentage}% Greener
                  </Badge>
                </CardTitle>
                <CardDescription>{currentNetwork.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Energy Efficiency */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <Zap className="h-4 w-4 text-yellow-500" />
                      <span className="text-sm font-medium">Energy per Transaction</span>
                    </div>
                    <span className="text-sm text-gray-500">{currentNetwork.energyPerTx * 1000} Wh</span>
                  </div>
                  <Progress value={Math.max(5, 100 - (currentNetwork.energyPerTx * 10000))} className="h-2" />
                </div>

                {/* CO2 Emissions */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <Activity className="h-4 w-4 text-red-500" />
                      <span className="text-sm font-medium">CO₂ Emissions</span>
                    </div>
                    <span className="text-sm text-gray-500">{currentNetwork.co2PerTx} g/tx</span>
                  </div>
                  <Progress value={Math.max(5, 100 - (currentNetwork.co2PerTx * 20))} className="h-2" />
                </div>

                {/* Renewable Energy */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <Leaf className="h-4 w-4 text-green-500" />
                      <span className="text-sm font-medium">Renewable Energy</span>
                    </div>
                    <span className="text-sm text-gray-500">{currentNetwork.renewablePercent}%</span>
                  </div>
                  <Progress value={currentNetwork.renewablePercent} className="h-2" />
                </div>

                <Separator />

                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <p className="text-2xl font-bold text-green-600">{currentNetwork.tps.toLocaleString()}</p>
                    <p className="text-xs text-gray-500">TPS</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-blue-600">{currentNetwork.validators.toLocaleString()}</p>
                    <p className="text-xs text-gray-500">Validators</p>
                  </div>
                </div>

                <Separator />

                {/* Pie Chart - Energy Mix */}
                <div className="text-center">
                  <h4 className="text-sm font-medium mb-3">Energy Mix</h4>
                  <div className="h-32 flex items-center justify-center">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={pieData}
                          cx="50%"
                          cy="50%"
                          innerRadius={25}
                          outerRadius={50}
                          paddingAngle={5}
                          dataKey="value"
                        >
                          {pieData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="flex justify-center space-x-4 mt-2">
                    {pieData.map(entry => (
                      <div key={entry.name} className="flex items-center space-x-1">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: entry.color }} />
                        <span className="text-xs">{entry.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Comparison Chart */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Network Comparison</CardTitle>
                <CardDescription>
                  {compareMode ? `Comparing ${selectedNetworks.length} networks` : 'Enable compare mode to see all networks'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {compareMode ? (
                  <div className="space-y-6">
                    {/* Energy Efficiency Comparison */}
                    <div>
                      <h4 className="text-sm font-medium mb-3">Energy per Transaction (Wh)</h4>
                      <ResponsiveContainer width="100%" height={120}>
                        <BarChart data={comparisonData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" />
                          <YAxis />
                          <Bar dataKey="energy" fill="#10B981" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>

                    {/* Renewable Energy Comparison */}
                    <div>
                      <h4 className="text-sm font-medium mb-3">Renewable Energy %</h4>
                      <ResponsiveContainer width="100%" height={120}>
                        <BarChart data={comparisonData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" />
                          <YAxis />
                          <Bar dataKey="renewable" fill="#059669" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>

                    <div className="text-xs text-gray-500">
                      * Lower energy per transaction = more efficient
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-sm text-gray-500">Enable compare mode to see network comparisons</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="validators" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Validator List */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center space-x-2">
                  <Server className="h-5 w-5" />
                  <span>Green Validators</span>
                </CardTitle>
                <CardDescription>Track and compare validator environmental performance</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {sampleValidators.map(validator => (
                  <Card key={validator.id} className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className="font-medium text-sm">{validator.name}</h4>
                        <p className="text-xs text-gray-500">{validator.network} • {validator.location}</p>
                      </div>
                      <div className="text-right">
                        <Badge 
                          variant={validator.renewableEnergy >= 90 ? 'default' : 
                                  validator.renewableEnergy >= 70 ? 'secondary' : 'destructive'}
                          className="text-xs"
                        >
                          {validator.renewableEnergy}% Green
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs">Energy Efficiency</span>
                        <span className="text-xs font-medium">{validator.energyEfficiency}%</span>
                      </div>
                      <Progress value={validator.energyEfficiency} className="h-1.5" />
                      
                      <div className="flex items-center justify-between">
                        <span className="text-xs">Uptime</span>
                        <span className="text-xs font-medium">{validator.uptime}%</span>
                      </div>
                      <Progress value={validator.uptime} className="h-1.5" />
                      
                      <div className="grid grid-cols-2 gap-4 pt-2 text-center">
                        <div>
                          <p className="text-lg font-bold text-red-500">{validator.co2Footprint}</p>
                          <p className="text-xs text-gray-500">tCO₂/year</p>
                        </div>
                        <div>
                          <p className="text-lg font-bold text-green-500">{validator.stakingAPY}%</p>
                          <p className="text-xs text-gray-500">APY</p>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </CardContent>
            </Card>

            {/* Validator Metrics Chart */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Validator Performance</CardTitle>
                <CardDescription>Efficiency and renewable energy metrics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={validatorData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Area 
                        type="monotone" 
                        dataKey="efficiency" 
                        stackId="1" 
                        stroke="#10B981" 
                        fill="#10B981" 
                        fillOpacity={0.6}
                      />
                      <Area 
                        type="monotone" 
                        dataKey="renewable" 
                        stackId="2" 
                        stroke="#059669" 
                        fill="#059669" 
                        fillOpacity={0.4}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex justify-center space-x-6 mt-4">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 rounded-full bg-green-500" />
                    <span className="text-xs">Energy Efficiency</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 rounded-full bg-green-600" />
                    <span className="text-xs">Renewable Energy</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="insights" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Green Score Card */}
            <Card className="border-green-200 dark:border-green-800">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Lightbulb className="h-5 w-5 text-yellow-500" />
                  <span>Green Intelligence</span>
                </CardTitle>
                <CardDescription>AI-powered sustainability insights and recommendations</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center p-6 bg-green-50 dark:bg-green-950/20 rounded-lg">
                  <h3 className="text-3xl font-bold text-green-600 mb-2">
                    {Math.round((currentNetwork.renewablePercent + (100 - currentNetwork.co2PerTx * 10)) / 2)}
                  </h3>
                  <p className="text-sm font-medium text-green-700 dark:text-green-300">Overall Green Score</p>
                  <p className="text-xs text-gray-500 mt-1">Based on renewable energy % and low emissions</p>
                </div>

                <div className="space-y-3">
                  <div className="flex items-start space-x-3 p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
                    <CheckCircle className="h-4 w-4 text-blue-500 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium">Low Energy Consumption</p>
                      <p className="text-xs text-gray-600">
                        {currentNetwork.name} uses {currentNetwork.energyPerTx * 1000} Wh per transaction, 
                        {greenerPercentage}% more efficient than average
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3 p-3 bg-green-50 dark:bg-green-950/20 rounded-lg">
                    <Leaf className="h-4 w-4 text-green-500 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium">High Renewable Energy</p>
                      <p className="text-xs text-gray-600">
                        {currentNetwork.renewablePercent}% of network energy comes from renewable sources
                      </p>
                    </div>
                  </div>

                  {currentNetwork.co2PerTx > 1 && (
                    <div className="flex items-start space-x-3 p-3 bg-orange-50 dark:bg-orange-950/20 rounded-lg">
                      <AlertTriangle className="h-4 w-4 text-orange-500 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium">Improvement Opportunity</p>
                        <p className="text-xs text-gray-600">
                          Consider validator selection to reduce CO₂ footprint by ~{Math.round((1 - 0.5/currentNetwork.co2PerTx) * 100)}%
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Cost Savings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <TrendingUp className="h-5 w-5 text-green-500" />
                  <span>Green Economics</span>
                </CardTitle>
                <CardDescription>Environmental cost savings and green incentives</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Energy Cost Savings */}
                <div className="p-4 bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-950/20 dark:to-blue-950/20 rounded-lg">
                  <h4 className="font-medium text-sm mb-2">Annual Energy Savings</h4>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-green-600">
                      {formatCurrency((avgEnergyOthers - currentNetwork.energyPerTx) * data.onChain.transactions.length * 0.12, currency)}
                    </span>
                    <div className="text-right">
                      <p className="text-xs text-gray-500">vs Average Network</p>
                      <p className="text-xs font-medium text-green-600">
                        -{Math.round((avgEnergyOthers - currentNetwork.energyPerTx) * data.onChain.transactions.length * 1000)} kWh
                      </p>
                    </div>
                  </div>
                </div>

                {/* Carbon Credit Potential */}
                <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 rounded-lg">
                  <h4 className="font-medium text-sm mb-2">Carbon Credit Potential</h4>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-blue-600">
                      {((avgEnergyOthers - currentNetwork.energyPerTx) * data.onChain.transactions.length * 0.5).toFixed(1)} tCO₂
                    </span>
                    <div className="text-right">
                      <p className="text-xs text-gray-500">Avoided Emissions</p>
                      <p className="text-xs font-medium text-blue-600">
                        ≈ {formatCurrency(((avgEnergyOthers - currentNetwork.energyPerTx) * data.onChain.transactions.length * 0.5) * 50, currency)} in credits
                      </p>
                    </div>
                  </div>
                </div>

                {/* Future Projections */}
                <Separator />
                
                <div className="space-y-3">
                  <h4 className="font-medium text-sm">5-Year Projections</h4>
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div>
                      <p className="text-lg font-bold text-green-600">
                        {formatCurrency((avgEnergyOthers - currentNetwork.energyPerTx) * data.onChain.transactions.length * 0.12 * 5, currency)}
                      </p>
                      <p className="text-xs text-gray-500">Energy Savings</p>
                    </div>
                    <div>
                      <p className="text-lg font-bold text-blue-600">
                        {((avgEnergyOthers - currentNetwork.energyPerTx) * data.onChain.transactions.length * 0.5 * 5).toFixed(1)}t
                      </p>
                      <p className="text-xs text-gray-500">CO₂ Avoided</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recommendations */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Sustainability Recommendations</CardTitle>
              <CardDescription>Actionable steps to improve environmental impact</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="p-4 border rounded-lg">
                  <div className="flex items-center space-x-2 mb-3">
                    <Server className="h-4 w-4 text-blue-500" />
                    <h4 className="font-medium text-sm">Optimize Validators</h4>
                  </div>
                  <p className="text-xs text-gray-600 mb-3">
                    Choose validators with 90%+ renewable energy to reduce network carbon footprint
                  </p>
                  <Badge variant="outline" className="text-xs">High Impact</Badge>
                </div>

                <div className="p-4 border rounded-lg">
                  <div className="flex items-center space-x-2 mb-3">
                    <Zap className="h-4 w-4 text-yellow-500" />
                    <h4 className="font-medium text-sm">Batch Transactions</h4>
                  </div>
                  <p className="text-xs text-gray-600 mb-3">
                    Group multiple operations to reduce per-transaction energy overhead
                  </p>
                  <Badge variant="outline" className="text-xs">Medium Impact</Badge>
                </div>

                <div className="p-4 border rounded-lg">
                  <div className="flex items-center space-x-2 mb-3">
                    <Globe className="h-4 w-4 text-green-500" />
                    <h4 className="font-medium text-sm">Carbon Offset</h4>
                  </div>
                  <p className="text-xs text-gray-600 mb-3">
                    Offset remaining emissions through verified carbon credits
                  </p>
                  <Badge variant="outline" className="text-xs">Complete Solution</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}