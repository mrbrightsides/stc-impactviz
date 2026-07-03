'use client'

import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { TreePine, Leaf, Factory, Zap, DollarSign, TrendingDown, TrendingUp, Calculator, Info, Wind, X, ExternalLink, BookOpen, Target } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { useCurrency } from '@/hooks/use-currency'
import { formatCurrency, formatCurrencyCompact, CARBON_OFFSET_PRICING, REDUCTION_COSTS } from '@/lib/currency'

interface CarbonLayerProps {
  data: {
    onChain: {
      transactions: Array<{
        gasUsed: number
        timestamp: number
        blockNumber: number
      }>
      avgGasFee: number
      totalVolume: number
    }
    environmental: {
      totalEnergyConsumption: number
      co2Equivalent: number
      renewableEnergyPercent: number
    }
    offChain: {
      totalBookings: number
      bookings: Array<{
        location: string
        duration: number
        cost: number
      }>
    }
  }
}

const CARBON_COLORS = ['#ef4444', '#f97316', '#eab308', '#84cc16', '#10b981']

export const CarbonLayer: React.FC<CarbonLayerProps> = ({ data }) => {
  const { currency } = useCurrency()
  const [activeTab, setActiveTab] = useState('footprint')
  const [showCalculator, setShowCalculator] = useState(false)
  const [showMethodology, setShowMethodology] = useState(false)
  const [showOffsetModal, setShowOffsetModal] = useState(false)
  
  const carbonAnalysis = calculateCarbonFootprint(data)
  const offsetOptions = calculateOffsetOptions(carbonAnalysis)
  const emissionSources = calculateEmissionSources(data)
  const reductionPotential = calculateReductionPotential(data)
  const trendData = generateCarbonTrends(data)
  
  return (
    <Card className="border-2 border-dashed border-green-200 dark:border-green-800 bg-green-50/50 dark:bg-green-950/20">
      <CardHeader className="space-y-2">
        <CardTitle className="flex items-center space-x-2">
          <TreePine className="h-5 w-5 text-green-600" />
          <span>Carbon Layer Analysis</span>
          <Badge variant="secondary" className="text-xs">Optional Module</Badge>
        </CardTitle>
        <CardDescription>
          Advanced carbon footprint tracking and offset recommendations for blockchain tourism operations
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Key Carbon Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-4 bg-white dark:bg-slate-900 rounded-lg border">
            <TreePine className="h-8 w-8 text-green-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-green-600">{carbonAnalysis.totalEmissions.toFixed(1)}t</div>
            <div className="text-sm text-muted-foreground">Total CO₂ Emissions</div>
            <Badge 
              variant={carbonAnalysis.trend < 0 ? "default" : "destructive"}
              className="mt-2 text-xs"
            >
              {carbonAnalysis.trend < 0 ? <TrendingDown className="h-3 w-3 mr-1" /> : <TrendingUp className="h-3 w-3 mr-1" />}
              {Math.abs(carbonAnalysis.trend).toFixed(1)}%
            </Badge>
          </div>
          
          <div className="text-center p-4 bg-white dark:bg-slate-900 rounded-lg border">
            <Calculator className="h-8 w-8 text-blue-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-blue-600">{carbonAnalysis.intensityPerTransaction.toFixed(3)}</div>
            <div className="text-sm text-muted-foreground">kg CO₂ per Transaction</div>
            <div className="text-xs text-muted-foreground mt-1">
              {carbonAnalysis.intensityPerBooking.toFixed(2)} kg per booking
            </div>
          </div>
          
          <div className="text-center p-4 bg-white dark:bg-slate-900 rounded-lg border">
            <DollarSign className="h-8 w-8 text-purple-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-purple-600">{formatCurrency(carbonAnalysis.offsetCost, currency)}</div>
            <div className="text-sm text-muted-foreground">Neutrality Cost</div>
            <div className="text-xs text-muted-foreground mt-1">
              @ {formatCurrency(CARBON_OFFSET_PRICING.STANDARD_RATE, currency)}/ton CO₂
            </div>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="footprint">Footprint</TabsTrigger>
            <TabsTrigger value="sources">Sources</TabsTrigger>
            <TabsTrigger value="reduction">Reduction</TabsTrigger>
            <TabsTrigger value="offset">Offset</TabsTrigger>
          </TabsList>

          <TabsContent value="footprint" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Carbon Footprint Trends</CardTitle>
                <CardDescription>
                  Daily CO₂ emissions from blockchain operations
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={trendData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="emissions" 
                      stroke="#ef4444" 
                      strokeWidth={2} 
                      name="Daily CO₂ (kg)" 
                    />
                    <Line 
                      type="monotone" 
                      dataKey="renewableOffset" 
                      stroke="#10b981" 
                      strokeWidth={2} 
                      name="Renewable Offset (kg)" 
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Carbon Intensity Benchmarks</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { name: 'Your Platform', value: carbonAnalysis.intensityPerTransaction, color: '#ef4444' },
                    { name: 'Traditional Tourism', value: 2.5, color: '#f97316' },
                    { name: 'Other Blockchains', value: 1.8, color: '#eab308' },
                    { name: 'Industry Best', value: 0.5, color: '#10b981' }
                  ].map((benchmark, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <div 
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: benchmark.color }}
                      />
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">{benchmark.name}</span>
                          <span className="text-sm font-bold">{benchmark.value.toFixed(3)} kg CO₂/tx</span>
                        </div>
                        <Progress value={(benchmark.value / 3) * 100} className="mt-1" />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="sources" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Emission Sources</CardTitle>
                  <CardDescription>
                    Breakdown of CO₂ emissions by source
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={200}>
                    <PieChart>
                      <Pie
                        data={emissionSources}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {emissionSources.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={CARBON_COLORS[index % CARBON_COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Energy Mix Impact</CardTitle>
                  <CardDescription>
                    CO₂ emissions by energy source
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {[
                      { source: 'Renewable Energy', emissions: carbonAnalysis.renewableEmissions, percent: data.environmental.renewableEnergyPercent, color: 'text-green-600' },
                      { source: 'Fossil Fuels', emissions: carbonAnalysis.fossilEmissions, percent: 100 - data.environmental.renewableEnergyPercent, color: 'text-red-600' }
                    ].map((source, index) => (
                      <div key={index} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className={`text-sm font-medium ${source.color}`}>{source.source}</span>
                          <span className="text-sm font-bold">{source.emissions.toFixed(2)}t CO₂</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Progress value={source.percent} className="flex-1" />
                          <span className="text-xs text-muted-foreground">{source.percent.toFixed(0)}%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Detailed Emission Breakdown</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[
                    {
                      category: 'Blockchain Operations',
                      emissions: carbonAnalysis.blockchainEmissions,
                      description: 'Smart contract execution, transaction processing',
                      icon: Zap
                    },
                    {
                      category: 'Data Infrastructure',
                      emissions: carbonAnalysis.infrastructureEmissions,
                      description: 'Servers, databases, network infrastructure',
                      icon: Factory
                    },
                    {
                      category: 'User Activities',
                      emissions: carbonAnalysis.userEmissions,
                      description: 'Device usage, internet connectivity',
                      icon: Leaf
                    }
                  ].map((category, index) => (
                    <div key={index} className="p-3 border rounded-lg space-y-2">
                      <div className="flex items-center space-x-2">
                        <category.icon className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm font-medium">{category.category}</span>
                      </div>
                      <div className="text-lg font-bold">{category.emissions.toFixed(2)}t CO₂</div>
                      <div className="text-xs text-muted-foreground">{category.description}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reduction" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Reduction Opportunities</CardTitle>
                <CardDescription>
                  Potential CO₂ reduction strategies and their impact
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {reductionPotential.map((strategy, index) => (
                    <div key={index} className="p-4 border rounded-lg space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <strategy.icon className="h-5 w-5 text-green-600" />
                          <span className="font-medium">{strategy.name}</span>
                        </div>
                        <Badge variant="outline">
                          -{strategy.reduction.toFixed(1)}t CO₂/year
                        </Badge>
                      </div>
                      <div className="text-sm text-muted-foreground">{strategy.description}</div>
                      <div className="grid grid-cols-3 gap-4 text-center">
                        <div>
                          <div className="text-sm font-bold text-green-600">{strategy.reduction.toFixed(1)}t</div>
                          <div className="text-xs text-muted-foreground">CO₂ Saved</div>
                        </div>
                        <div>
                          <div className="text-sm font-bold text-blue-600">{formatCurrency(strategy.cost, currency)}</div>
                          <div className="text-xs text-muted-foreground">Implementation</div>
                        </div>
                        <div>
                          <div className="text-sm font-bold text-purple-600">{strategy.timeframe}</div>
                          <div className="text-xs text-muted-foreground">Timeline</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="offset" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Carbon Offset Options</CardTitle>
                <CardDescription>
                  Available carbon offset programs and pricing
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {offsetOptions.map((option, index) => (
                    <div key={index} className="p-4 border rounded-lg space-y-3">
                      <div className="flex items-center space-x-2">
                        <option.icon className="h-5 w-5 text-green-600" />
                        <span className="font-medium">{option.name}</span>
                      </div>
                      <div className="space-y-2">
                        <div className="text-2xl font-bold text-green-600">{formatCurrency(option.cost, currency)}</div>
                        <div className="text-sm text-muted-foreground">{option.description}</div>
                        <div className="flex items-center justify-between text-xs">
                          <span>Price per ton:</span>
                          <span className="font-medium">{formatCurrency(option.pricePerTon, currency)}/t CO₂</span>
                        </div>
                        <div className="flex items-center justify-between text-xs">
                          <span>Coverage:</span>
                          <span className="font-medium">{option.coverage.toFixed(1)}t CO₂</span>
                        </div>
                      </div>
                      <Button size="sm" variant="outline" className="w-full">
                        Learn More
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Offset Calculator</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-lg space-y-3">
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div>
                      <div className="text-lg font-bold">{carbonAnalysis.totalEmissions.toFixed(1)}t</div>
                      <div className="text-sm text-muted-foreground">Total Emissions</div>
                    </div>
                    <div>
                      <div className="text-lg font-bold text-green-600">{formatCurrency(carbonAnalysis.offsetCost, currency)}</div>
                      <div className="text-sm text-muted-foreground">Offset Cost</div>
                    </div>
                  </div>
                  <Separator />
                  <div className="text-center">
                    <div className="text-sm text-muted-foreground mb-2">Monthly offset cost:</div>
                    <div className="text-xl font-bold text-blue-600">{formatCurrency(carbonAnalysis.offsetCost / 12, currency)}/month</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Action Buttons */}
        <div className="flex items-center justify-between pt-4 border-t">
          <div className="text-sm text-muted-foreground">
            Carbon calculations based on Ethereum network averages and renewable energy mix
          </div>
          <div className="space-x-2">
            <Dialog open={showMethodology} onOpenChange={setShowMethodology}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                  <Info className="h-4 w-4 mr-2" />
                  Methodology
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle className="flex items-center space-x-2">
                    <BookOpen className="h-5 w-5 text-blue-600" />
                    <span>Carbon Calculation Methodology</span>
                  </DialogTitle>
                  <DialogDescription>
                    Detailed explanation of how we calculate carbon emissions for blockchain tourism
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Energy Consumption Model</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="text-sm space-y-2">
                        <p><strong>Transaction Energy:</strong> Each SmartTourismChain transaction consumes energy for smart contract execution, block validation, and network consensus.</p>
                        <p><strong>Base Calculation:</strong> Energy consumption = Gas Used × Average Energy per Gas Unit</p>
                        <div className="bg-slate-50 dark:bg-slate-900 p-3 rounded-lg">
                          <code className="text-sm">Energy (kWh) = Σ(Transaction Gas) × 0.0001431 kWh/gas</code>
                        </div>
                        <p className="text-xs text-muted-foreground">* Based on Ethereum mainnet averages adjusted for SmartTourismChain optimization</p>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Carbon Intensity Factors</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="space-y-2">
                          <h4 className="font-medium text-green-600">Renewable Energy</h4>
                          <p>0.05 kg CO₂/kWh</p>
                          <p className="text-xs text-muted-foreground">Solar, wind, hydro, nuclear</p>
                        </div>
                        <div className="space-y-2">
                          <h4 className="font-medium text-red-600">Fossil Fuels</h4>
                          <p>0.85 kg CO₂/kWh</p>
                          <p className="text-xs text-muted-foreground">Coal, natural gas, oil</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Emission Categories</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3 text-sm">
                        <div className="flex justify-between">
                          <span><strong>Blockchain Operations:</strong></span>
                          <span>70% of total emissions</span>
                        </div>
                        <div className="flex justify-between">
                          <span><strong>Infrastructure:</strong></span>
                          <span>25% of total emissions</span>
                        </div>
                        <div className="flex justify-between">
                          <span><strong>User Activities:</strong></span>
                          <span>5% of total emissions</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Data Sources & Standards</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2 text-sm">
                        <p>• <strong>Energy Grid Mix:</strong> International Energy Agency (IEA)</p>
                        <p>• <strong>Carbon Factors:</strong> IPCC Guidelines for National GHG Inventories</p>
                        <p>• <strong>Blockchain Metrics:</strong> Cambridge Centre for Alternative Finance</p>
                        <p>• <strong>Standards:</strong> ISO 14064-1, GHG Protocol Scope 2</p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </DialogContent>
            </Dialog>

            <Dialog open={showOffsetModal} onOpenChange={setShowOffsetModal}>
              <DialogTrigger asChild>
                <Button size="sm" className="bg-green-600 hover:bg-green-700">
                  <TreePine className="h-4 w-4 mr-2" />
                  Start Offsetting
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle className="flex items-center space-x-2">
                    <Target className="h-5 w-5 text-green-600" />
                    <span>Carbon Offset Program</span>
                  </DialogTitle>
                  <DialogDescription>
                    Choose from verified carbon offset projects to neutralize your SmartTourismChain emissions
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <Card className="border-green-200 dark:border-green-800 bg-green-50/50 dark:bg-green-950/20">
                    <CardHeader>
                      <CardTitle className="text-lg text-green-700 dark:text-green-400">Your Carbon Impact</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-3 gap-4 text-center">
                        <div>
                          <div className="text-2xl font-bold text-red-600">{carbonAnalysis.totalEmissions.toFixed(1)}t</div>
                          <div className="text-sm text-muted-foreground">Total CO₂ Emissions</div>
                        </div>
                        <div>
                          <div className="text-2xl font-bold text-blue-600">{data.onChain.transactions.length}</div>
                          <div className="text-sm text-muted-foreground">Transactions</div>
                        </div>
                        <div>
                          <div className="text-2xl font-bold text-purple-600">{formatCurrency(carbonAnalysis.offsetCost, currency)}</div>
                          <div className="text-sm text-muted-foreground">Offset Cost</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {offsetOptions.map((option, index) => (
                      <Card key={index} className="hover:shadow-md transition-shadow cursor-pointer border-2 hover:border-green-300">
                        <CardContent className="p-4">
                          <div className="space-y-3">
                            <div className="flex items-center space-x-2">
                              <option.icon className="h-5 w-5 text-green-600" />
                              <span className="font-medium">{option.name}</span>
                            </div>
                            <div className="text-2xl font-bold text-green-600">{formatCurrency(option.cost, currency)}</div>
                            <div className="text-sm text-muted-foreground">{option.description}</div>
                            <div className="space-y-1 text-xs">
                              <div className="flex justify-between">
                                <span>Price per ton:</span>
                                <span className="font-medium">{formatCurrency(option.pricePerTon, currency)}</span>
                              </div>
                              <div className="flex justify-between">
                                <span>Coverage:</span>
                                <span className="font-medium">{option.coverage.toFixed(1)}t CO₂</span>
                              </div>
                            </div>
                            <Button size="sm" className="w-full bg-green-600 hover:bg-green-700">
                              Select & Offset
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Automatic Offsetting</CardTitle>
                      <CardDescription>
                        Set up automatic carbon offsetting for future transactions
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between p-3 border rounded-lg">
                          <div className="space-y-1">
                            <div className="font-medium">Monthly Auto-Offset</div>
                            <div className="text-sm text-muted-foreground">Automatically offset emissions monthly</div>
                          </div>
                          <div className="text-right">
                            <div className="font-bold">{formatCurrency(carbonAnalysis.offsetCost / 12, currency)}/month</div>
                            <Button size="sm" variant="outline">Enable</Button>
                          </div>
                        </div>
                        <div className="flex items-center justify-between p-3 border rounded-lg">
                          <div className="space-y-1">
                            <div className="font-medium">Per-Transaction Offset</div>
                            <div className="text-sm text-muted-foreground">Add small fee to each transaction</div>
                          </div>
                          <div className="text-right">
                            <div className="font-bold">+{formatCurrency(carbonAnalysis.offsetCost / data.onChain.transactions.length, currency)}/tx</div>
                            <Button size="sm" variant="outline">Enable</Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <div className="text-center text-sm text-muted-foreground">
                    <p>All offset projects are verified by <strong>Gold Standard</strong> and <strong>Verified Carbon Standard (VCS)</strong></p>
                    <Button variant="link" size="sm" className="p-0 h-auto">
                      <ExternalLink className="h-3 w-3 mr-1" />
                      View Certification Details
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function calculateCarbonFootprint(data: any) {
  const totalTransactions = data.onChain.transactions.length
  const totalEnergy = data.environmental.totalEnergyConsumption // kWh
  const renewablePercent = data.environmental.renewableEnergyPercent
  
  // Carbon intensity factors (kg CO2 per kWh)
  const renewableIntensity = 0.05 // kg CO2/kWh for renewable energy
  const fossilIntensity = 0.85 // kg CO2/kWh for fossil fuel mix
  
  const renewableEnergy = totalEnergy * (renewablePercent / 100)
  const fossilEnergy = totalEnergy - renewableEnergy
  
  const renewableEmissions = (renewableEnergy * renewableIntensity) / 1000 // tons
  const fossilEmissions = (fossilEnergy * fossilIntensity) / 1000 // tons
  const totalEmissions = renewableEmissions + fossilEmissions
  
  // Calculate emissions by category
  const blockchainEmissions = totalEmissions * 0.7 // 70% from blockchain operations
  const infrastructureEmissions = totalEmissions * 0.25 // 25% from infrastructure
  const userEmissions = totalEmissions * 0.05 // 5% from user activities
  
  const intensityPerTransaction = totalEmissions * 1000 / totalTransactions // kg CO2 per transaction
  const intensityPerBooking = totalEmissions * 1000 / data.offChain.totalBookings // kg CO2 per booking
  
  const offsetCost = totalEmissions * CARBON_OFFSET_PRICING.STANDARD_RATE // Standard rate per ton CO2
  const trend = Math.random() * 20 - 10 // Mock trend
  
  return {
    totalEmissions,
    renewableEmissions,
    fossilEmissions,
    blockchainEmissions,
    infrastructureEmissions,
    userEmissions,
    intensityPerTransaction,
    intensityPerBooking,
    offsetCost,
    trend
  }
}

function calculateOffsetOptions(carbonAnalysis: any) {
  return [
    {
      name: 'Reforestation Projects',
      description: 'Plant trees in deforested areas to absorb CO₂',
      pricePerTon: CARBON_OFFSET_PRICING.REFORESTATION,
      cost: carbonAnalysis.totalEmissions * CARBON_OFFSET_PRICING.REFORESTATION,
      coverage: carbonAnalysis.totalEmissions,
      icon: TreePine
    },
    {
      name: 'Renewable Energy',
      description: 'Fund solar and wind energy projects',
      pricePerTon: CARBON_OFFSET_PRICING.RENEWABLE_ENERGY,
      cost: carbonAnalysis.totalEmissions * CARBON_OFFSET_PRICING.RENEWABLE_ENERGY,
      coverage: carbonAnalysis.totalEmissions,
      icon: Wind
    },
    {
      name: 'Direct Air Capture',
      description: 'Advanced technology to remove CO₂ from atmosphere',
      pricePerTon: CARBON_OFFSET_PRICING.DIRECT_AIR_CAPTURE,
      cost: carbonAnalysis.totalEmissions * CARBON_OFFSET_PRICING.DIRECT_AIR_CAPTURE,
      coverage: carbonAnalysis.totalEmissions,
      icon: Factory
    }
  ]
}

function calculateEmissionSources(data: any) {
  const analysis = calculateCarbonFootprint(data)
  return [
    { name: 'Blockchain Ops', value: analysis.blockchainEmissions },
    { name: 'Infrastructure', value: analysis.infrastructureEmissions },
    { name: 'User Activities', value: analysis.userEmissions }
  ]
}

function calculateReductionPotential(data: any) {
  const analysis = calculateCarbonFootprint(data)
  return [
    {
      name: 'Increase Renewable Energy',
      description: 'Transition to 85% renewable energy sources',
      reduction: analysis.fossilEmissions * 0.6,
      cost: REDUCTION_COSTS.RENEWABLE_ENERGY,
      timeframe: '6 months',
      icon: Wind
    },
    {
      name: 'Optimize Smart Contracts',
      description: 'Reduce gas consumption through code optimization',
      reduction: analysis.blockchainEmissions * 0.2,
      cost: REDUCTION_COSTS.GAS_OPTIMIZATION,
      timeframe: '2 months',
      icon: Zap
    },
    {
      name: 'Energy Efficiency',
      description: 'Upgrade to energy-efficient infrastructure',
      reduction: analysis.infrastructureEmissions * 0.3,
      cost: REDUCTION_COSTS.ENERGY_EFFICIENCY,
      timeframe: '12 months',
      icon: Factory
    }
  ]
}

function generateCarbonTrends(data: any) {
  const trends = []
  const baseDate = new Date()
  const analysis = calculateCarbonFootprint(data)
  const dailyEmissions = analysis.totalEmissions * 1000 / 30 // kg per day
  
  for (let i = 29; i >= 0; i--) {
    const date = new Date(baseDate)
    date.setDate(date.getDate() - i)
    
    const emissions = dailyEmissions + (Math.random() - 0.5) * dailyEmissions * 0.3
    const renewableOffset = emissions * (data.environmental.renewableEnergyPercent / 100) * 0.95
    
    trends.push({
      date: date.toISOString().split('T')[0],
      emissions: Math.round(emissions * 10) / 10,
      renewableOffset: Math.round(renewableOffset * 10) / 10
    })
  }
  
  return trends
}