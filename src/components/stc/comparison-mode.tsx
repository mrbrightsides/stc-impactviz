'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { 
  GitCompare, 
  Save, 
  Trash2, 
  Plus, 
  TrendingUp, 
  TrendingDown,
  Minus,
  Calendar,
  Download
} from 'lucide-react'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { toast } from 'sonner'
import type { STCData } from '@/lib/sample-data'

interface SavedScenario {
  id: string
  name: string
  date: string
  data: STCData
  sustainabilityScore: number
}

interface ComparisonModeProps {
  currentData: STCData
  onExport?: (data: any) => void
}

export const ComparisonMode: React.FC<ComparisonModeProps> = ({ currentData, onExport }) => {
  const [savedScenarios, setSavedScenarios] = useState<SavedScenario[]>([])
  const [scenarioName, setScenarioName] = useState('')
  const [selectedScenario1, setSelectedScenario1] = useState<string>('current')
  const [selectedScenario2, setSelectedScenario2] = useState<string>('')
  const [comparisonData, setComparisonData] = useState<any>(null)

  // Load saved scenarios from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('stc-saved-scenarios')
    if (saved) {
      try {
        setSavedScenarios(JSON.parse(saved))
      } catch (error) {
        console.error('Failed to load saved scenarios:', error)
      }
    }
  }, [])

  // Save scenarios to localStorage whenever they change
  useEffect(() => {
    if (savedScenarios.length > 0) {
      localStorage.setItem('stc-saved-scenarios', JSON.stringify(savedScenarios))
    }
  }, [savedScenarios])

  const calculateSustainabilityScore = (data: STCData): number => {
    const economicScore = Math.min((data.onChain.totalVolume / 1000000) * 30 + (data.offChain.totalBookings / 100) * 10, 40)
    const socialScore = Math.min((data.social.avgRating / 5) * 20 + (data.social.sentimentDistribution.positive / data.social.totalReviews) * 10, 30)
    const environmentalScore = Math.min((data.environmental.efficiencyScore / 100) * 20 + (data.environmental.renewableEnergyPercent / 100) * 10, 30)
    return Math.round(economicScore + socialScore + environmentalScore)
  }

  const handleSaveScenario = () => {
    if (!scenarioName.trim()) {
      toast.error('Please enter a scenario name')
      return
    }

    const newScenario: SavedScenario = {
      id: `scenario-${Date.now()}`,
      name: scenarioName,
      date: new Date().toISOString(),
      data: currentData,
      sustainabilityScore: calculateSustainabilityScore(currentData)
    }

    setSavedScenarios([...savedScenarios, newScenario])
    setScenarioName('')
    toast.success(`Scenario "${scenarioName}" saved successfully!`)
  }

  const handleDeleteScenario = (id: string) => {
    setSavedScenarios(savedScenarios.filter(s => s.id !== id))
    toast.success('Scenario deleted')
  }

  const handleCompare = () => {
    if (!selectedScenario1 || !selectedScenario2) {
      toast.error('Please select two scenarios to compare')
      return
    }

    const data1 = selectedScenario1 === 'current' 
      ? currentData 
      : savedScenarios.find(s => s.id === selectedScenario1)?.data

    const data2 = selectedScenario2 === 'current'
      ? currentData
      : savedScenarios.find(s => s.id === selectedScenario2)?.data

    if (!data1 || !data2) {
      toast.error('Invalid scenario selection')
      return
    }

    const comparison = generateComparison(data1, data2)
    setComparisonData(comparison)
    toast.success('Comparison generated!')
  }

  const generateComparison = (data1: STCData, data2: STCData) => {
    return {
      economic: {
        totalVolume: {
          scenario1: data1.onChain.totalVolume,
          scenario2: data2.onChain.totalVolume,
          change: ((data2.onChain.totalVolume - data1.onChain.totalVolume) / data1.onChain.totalVolume) * 100,
          changeType: data2.onChain.totalVolume > data1.onChain.totalVolume ? 'increase' : 'decrease'
        },
        bookings: {
          scenario1: data1.offChain.totalBookings,
          scenario2: data2.offChain.totalBookings,
          change: ((data2.offChain.totalBookings - data1.offChain.totalBookings) / data1.offChain.totalBookings) * 100,
          changeType: data2.offChain.totalBookings > data1.offChain.totalBookings ? 'increase' : 'decrease'
        },
        avgSpending: {
          scenario1: data1.offChain.avgSpending,
          scenario2: data2.offChain.avgSpending,
          change: ((data2.offChain.avgSpending - data1.offChain.avgSpending) / data1.offChain.avgSpending) * 100,
          changeType: data2.offChain.avgSpending > data1.offChain.avgSpending ? 'increase' : 'decrease'
        }
      },
      social: {
        avgRating: {
          scenario1: data1.social.avgRating,
          scenario2: data2.social.avgRating,
          change: ((data2.social.avgRating - data1.social.avgRating) / data1.social.avgRating) * 100,
          changeType: data2.social.avgRating > data1.social.avgRating ? 'increase' : 'decrease'
        },
        totalReviews: {
          scenario1: data1.social.totalReviews,
          scenario2: data2.social.totalReviews,
          change: ((data2.social.totalReviews - data1.social.totalReviews) / data1.social.totalReviews) * 100,
          changeType: data2.social.totalReviews > data1.social.totalReviews ? 'increase' : 'decrease'
        },
        positivePercent: {
          scenario1: (data1.social.sentimentDistribution.positive / data1.social.totalReviews) * 100,
          scenario2: (data2.social.sentimentDistribution.positive / data2.social.totalReviews) * 100,
          change: 0,
          changeType: 'neutral' as const
        }
      },
      environmental: {
        efficiencyScore: {
          scenario1: data1.environmental.efficiencyScore,
          scenario2: data2.environmental.efficiencyScore,
          change: ((data2.environmental.efficiencyScore - data1.environmental.efficiencyScore) / data1.environmental.efficiencyScore) * 100,
          changeType: data2.environmental.efficiencyScore > data1.environmental.efficiencyScore ? 'increase' : 'decrease'
        },
        co2Equivalent: {
          scenario1: data1.environmental.co2Equivalent,
          scenario2: data2.environmental.co2Equivalent,
          change: ((data2.environmental.co2Equivalent - data1.environmental.co2Equivalent) / data1.environmental.co2Equivalent) * 100,
          changeType: data2.environmental.co2Equivalent < data1.environmental.co2Equivalent ? 'increase' : 'decrease' // Lower CO2 is better
        },
        renewablePercent: {
          scenario1: data1.environmental.renewableEnergyPercent,
          scenario2: data2.environmental.renewableEnergyPercent,
          change: ((data2.environmental.renewableEnergyPercent - data1.environmental.renewableEnergyPercent) / data1.environmental.renewableEnergyPercent) * 100,
          changeType: data2.environmental.renewableEnergyPercent > data1.environmental.renewableEnergyPercent ? 'increase' : 'decrease'
        }
      },
      sustainabilityScore: {
        scenario1: calculateSustainabilityScore(data1),
        scenario2: calculateSustainabilityScore(data2),
        change: 0,
        changeType: 'neutral' as const
      }
    }
  }

  const renderChangeIndicator = (change: number, changeType: string) => {
    if (changeType === 'neutral' || Math.abs(change) < 0.1) {
      return (
        <Badge variant="outline" className="flex items-center gap-1">
          <Minus className="h-3 w-3" />
          No Change
        </Badge>
      )
    }

    const isPositive = changeType === 'increase'
    return (
      <Badge 
        variant={isPositive ? 'default' : 'destructive'} 
        className="flex items-center gap-1"
      >
        {isPositive ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
        {Math.abs(change).toFixed(1)}%
      </Badge>
    )
  }

  return (
    <div className="space-y-6">
      {/* Save Current Scenario */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Save className="h-5 w-5" />
            Save Current Scenario
          </CardTitle>
          <CardDescription>
            Save the current data as a scenario for future comparison
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <div className="flex-1">
              <Label htmlFor="scenario-name">Scenario Name</Label>
              <Input
                id="scenario-name"
                placeholder="e.g., Q1 2024, Peak Season, After Campaign"
                value={scenarioName}
                onChange={(e) => setScenarioName(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    handleSaveScenario()
                  }
                }}
              />
            </div>
            <div className="flex items-end">
              <Button onClick={handleSaveScenario}>
                <Save className="h-4 w-4 mr-2" />
                Save Scenario
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Saved Scenarios List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Saved Scenarios ({savedScenarios.length})
          </CardTitle>
          <CardDescription>
            Manage your saved scenarios for comparison
          </CardDescription>
        </CardHeader>
        <CardContent>
          {savedScenarios.length === 0 ? (
            <Alert>
              <AlertDescription>
                No saved scenarios yet. Save your current data to start comparing!
              </AlertDescription>
            </Alert>
          ) : (
            <div className="space-y-3">
              {savedScenarios.map((scenario) => (
                <div 
                  key={scenario.id}
                  className="flex items-center justify-between p-3 border rounded-lg hover:bg-accent/50 transition-colors"
                >
                  <div className="flex-1">
                    <div className="font-medium">{scenario.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {new Date(scenario.date).toLocaleDateString('id-ID', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge variant="secondary">
                      Score: {scenario.sustainabilityScore}/100
                    </Badge>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteScenario(scenario.id)}
                    >
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Comparison Tool */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <GitCompare className="h-5 w-5" />
            Compare Scenarios
          </CardTitle>
          <CardDescription>
            Select two scenarios to compare their performance
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label>Scenario 1</Label>
              <Select value={selectedScenario1} onValueChange={setSelectedScenario1}>
                <SelectTrigger>
                  <SelectValue placeholder="Select scenario 1" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="current">Current Data</SelectItem>
                  {savedScenarios.map((scenario) => (
                    <SelectItem key={scenario.id} value={scenario.id}>
                      {scenario.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center justify-center">
              <GitCompare className="h-6 w-6 text-muted-foreground" />
            </div>

            <div>
              <Label>Scenario 2</Label>
              <Select value={selectedScenario2} onValueChange={setSelectedScenario2}>
                <SelectTrigger>
                  <SelectValue placeholder="Select scenario 2" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="current">Current Data</SelectItem>
                  {savedScenarios.map((scenario) => (
                    <SelectItem key={scenario.id} value={scenario.id}>
                      {scenario.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button 
            onClick={handleCompare} 
            className="w-full"
            disabled={!selectedScenario1 || !selectedScenario2 || selectedScenario1 === selectedScenario2}
          >
            <GitCompare className="h-4 w-4 mr-2" />
            Compare Scenarios
          </Button>

          {/* Comparison Results */}
          {comparisonData && (
            <div className="mt-6 space-y-6">
              <Separator />
              
              <div>
                <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Comparison Results
                </h3>

                {/* Economic Comparison */}
                <Card className="mb-4">
                  <CardHeader>
                    <CardTitle className="text-base">💰 Economic Metrics</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div className="text-sm text-muted-foreground">Total Volume</div>
                        <div className="text-lg font-bold">{comparisonData.economic.totalVolume.scenario1.toLocaleString()}</div>
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground">Total Volume</div>
                        <div className="text-lg font-bold">{comparisonData.economic.totalVolume.scenario2.toLocaleString()}</div>
                      </div>
                    </div>
                    <div className="flex justify-center">
                      {renderChangeIndicator(
                        comparisonData.economic.totalVolume.change,
                        comparisonData.economic.totalVolume.changeType
                      )}
                    </div>
                    
                    <Separator />
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div className="text-sm text-muted-foreground">Total Bookings</div>
                        <div className="text-lg font-bold">{comparisonData.economic.bookings.scenario1}</div>
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground">Total Bookings</div>
                        <div className="text-lg font-bold">{comparisonData.economic.bookings.scenario2}</div>
                      </div>
                    </div>
                    <div className="flex justify-center">
                      {renderChangeIndicator(
                        comparisonData.economic.bookings.change,
                        comparisonData.economic.bookings.changeType
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Social Comparison */}
                <Card className="mb-4">
                  <CardHeader>
                    <CardTitle className="text-base">👥 Social Metrics</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div className="text-sm text-muted-foreground">Average Rating</div>
                        <div className="text-lg font-bold">{comparisonData.social.avgRating.scenario1.toFixed(2)}/5</div>
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground">Average Rating</div>
                        <div className="text-lg font-bold">{comparisonData.social.avgRating.scenario2.toFixed(2)}/5</div>
                      </div>
                    </div>
                    <div className="flex justify-center">
                      {renderChangeIndicator(
                        comparisonData.social.avgRating.change,
                        comparisonData.social.avgRating.changeType
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Environmental Comparison */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">🌱 Environmental Metrics</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div className="text-sm text-muted-foreground">Efficiency Score</div>
                        <div className="text-lg font-bold">{comparisonData.environmental.efficiencyScore.scenario1}/100</div>
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground">Efficiency Score</div>
                        <div className="text-lg font-bold">{comparisonData.environmental.efficiencyScore.scenario2}/100</div>
                      </div>
                    </div>
                    <div className="flex justify-center">
                      {renderChangeIndicator(
                        comparisonData.environmental.efficiencyScore.change,
                        comparisonData.environmental.efficiencyScore.changeType
                      )}
                    </div>

                    <Separator />

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div className="text-sm text-muted-foreground">CO₂ Equivalent</div>
                        <div className="text-lg font-bold">{comparisonData.environmental.co2Equivalent.scenario1.toLocaleString()} kg</div>
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground">CO₂ Equivalent</div>
                        <div className="text-lg font-bold">{comparisonData.environmental.co2Equivalent.scenario2.toLocaleString()} kg</div>
                      </div>
                    </div>
                    <div className="flex justify-center">
                      {renderChangeIndicator(
                        comparisonData.environmental.co2Equivalent.change,
                        comparisonData.environmental.co2Equivalent.changeType
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {onExport && (
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => onExport(comparisonData)}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Export Comparison Report
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
