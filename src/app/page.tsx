'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { ConfirmationDialog } from '@/components/ui/confirmation-dialog'
import { Moon, Sun, TrendingUp, Users, Leaf, Zap, Download, Upload, BarChart3, PieChart, TrendingDown, Activity, FileText, Globe, TreePine, Brain, RotateCcw, AlertTriangle, Info, GitCompare, Sparkles, Link as LinkIcon } from 'lucide-react'
import { useTheme } from 'next-themes'

// Import custom components
import { DataInputPanel } from '@/components/stc/data-input-panel'
import { EconomicDashboard } from '@/components/stc/economic-dashboard'
import { SocialDashboard } from '@/components/stc/social-dashboard'
import { EnvironmentalDashboard } from '@/components/stc/environmental-dashboard'
import { TripleBottomLineChart } from '@/components/stc/triple-bottom-line-chart'
import { SustainabilityIndex } from '@/components/stc/sustainability-index'
import { CarbonLayer } from '@/components/stc/carbon-layer'
import { ExportPanel } from '@/components/stc/export-panel'
import { RealTimeSimulator } from '@/components/stc/real-time-simulator'
import { AdvancedFilters } from '@/components/stc/advanced-filters'
import { PredictiveAnalytics } from '@/components/stc/predictive-analytics'
import { EnhancedPredictiveAnalytics } from '@/components/stc/enhanced-predictive-analytics'
import { ESGReportingExport } from '@/components/stc/esg-reporting-export'
import { GreenMetricsLayer } from '@/components/stc/green-metrics-layer'
import { InteractiveGeoDashboard } from '@/components/stc/interactive-geo-dashboard'
import AboutApp from '@/components/stc/about-app'
import { SampleDataLoader } from '@/components/stc/sample-data-loader'
import { QuickStartGuide } from '@/components/stc/quick-start-guide'
import { ComparisonMode } from '@/components/stc/comparison-mode'
import { AIRecommendations } from '@/components/stc/ai-recommendations'
import { AdvancedAnalyticsML } from '@/components/stc/advanced-analytics-ml'
import { BlockchainLiveData } from '@/components/stc/blockchain-live-data'
import { sdk } from "@farcaster/miniapp-sdk";
import { saveDataToStorage, loadDataFromStorage, type STCData as STCDataImport } from '@/lib/sample-data'
import { CurrencyProvider } from '@/hooks/use-currency'
import { useCurrency } from '@/hooks/use-currency'
import { formatCurrency, type Currency, CURRENCIES } from '@/lib/currency'

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

const CurrencyToggle: React.FC = () => {
  const { currency, setCurrency } = useCurrency()
  
  return (
    <Button
      variant="outline"
      size="sm"
      onClick={() => setCurrency(currency === 'USD' ? 'IDR' : 'USD')}
      className="transition-colors min-w-[60px]"
    >
      <span className="text-xs font-medium">{currency}</span>
    </Button>
  )
}

const ThemeToggle: React.FC = () => {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
      className="transition-colors"
    >
      {theme === 'light' ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
    </Button>
  )
}

function STCImpactVizPageContent() {
    // Load data from localStorage on mount
    useEffect(() => {
      const savedData = loadDataFromStorage()
      if (savedData) {
        console.log('Loaded data from localStorage')
        setData(savedData)
        setOriginalData(savedData)
      }
    }, [])

    useEffect(() => {
      const initializeFarcaster = async () => {
        try {
          await new Promise(resolve => setTimeout(resolve, 100));
          if (document.readyState !== 'complete') {
            await new Promise(resolve => {
              if (document.readyState === 'complete') {
                resolve(void 0);
              } else {
                window.addEventListener('load', () => resolve(void 0), { once: true });
              }

            });
          }

          await sdk.actions.ready();
          console.log("Farcaster SDK initialized successfully - app fully loaded");
        } catch (error) {
          console.error('Failed to initialize Farcaster SDK:', error);
          setTimeout(async () => {
            try {
              await sdk.actions.ready();
              console.log('Farcaster SDK initialized on retry');
            } catch (retryError) {
              console.error('Farcaster SDK retry failed:', retryError);
            }

          }, 1000);
        }

      };
      initializeFarcaster();
    }, []);
  const [data, setData] = useState<STCData | null>(null)
  const [originalData, setOriginalData] = useState<STCData | null>(null)
  const [carbonLayerEnabled, setCarbonLayerEnabled] = useState(false)
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState('overview')
  const [filtersEnabled, setFiltersEnabled] = useState(false)
  const [showResetDialog, setShowResetDialog] = useState(false)

  const handleDataUpdate = (newData: Partial<STCData>) => {
    const updatedData = {
      ...data,
      ...newData
    } as STCData
    setData(updatedData)
    if (!originalData) {
      setOriginalData(updatedData)
    }
    // Auto-save to localStorage
    saveDataToStorage(updatedData)
  }

  const handleDataLoad = React.useCallback((loadedData: STCData) => {
    console.log('Loading new data...')
    setData(loadedData)
    setOriginalData(loadedData)
    // Save to localStorage
    saveDataToStorage(loadedData)
  }, [])

  const handleFilteredDataUpdate = (filteredData: STCData) => {
    setData(filteredData)
  }

  const handleReset = React.useCallback(() => {
    console.log('Reset button clicked - opening dialog')
    setShowResetDialog(true)
  }, [])

  const handleConfirmReset = React.useCallback(() => {
    console.log('Reset confirmed - executing reset')
    try {
      setData(null)
      setOriginalData(null)
      setCarbonLayerEnabled(false)
      setActiveTab('overview')
      setFiltersEnabled(false)
      setLoading(false)
      // Clear localStorage
      saveDataToStorage(null)
      console.log('Reset completed successfully')
    } catch (error) {
      console.error('Reset failed:', error)
    }
  }, [])

  const sustainabilityScore = data ? calculateSustainabilityIndex(data) : 0

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-950 dark:via-blue-950 dark:to-indigo-950 transition-colors duration-500">
        {/* Header */}
        <header className="border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm sticky top-0 z-50">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center">
                    <Activity className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                      STC ImpactViz
                    </h1>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      ESG-Compliant Sustainability Analytics Platform
                    </p>
                  </div>
                </div>
                {data && (
                  <Badge variant="outline" className="hidden sm:inline-flex">
                    Sustainability Score: {sustainabilityScore}/100
                  </Badge>
                )}
              </div>
              
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-slate-600 dark:text-slate-400">Carbon Layer</span>
                  <Switch
                    checked={carbonLayerEnabled}
                    onCheckedChange={setCarbonLayerEnabled}
                    className="scale-90"
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-slate-600 dark:text-slate-400">Currency</span>
                  <CurrencyToggle />
                </div>
                {data && (
                  <button
                    onClick={() => {
                      console.log('Main reset button clicked - native button')
                      handleReset()
                    }}
                    className="inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 border bg-background shadow-sm h-8 rounded-md px-3 text-xs text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950 border-red-200 dark:border-red-800 transition-colors cursor-pointer"
                    title="Reset all data and return to clean slate"
                    type="button"
                  >
                    <RotateCcw className="h-4 w-4 mr-1" />
                    <span className="hidden sm:inline text-xs">Reset</span>
                  </button>
                )}
                <ThemeToggle />
              </div>
            </div>
          </div>
        </header>

        <main className="container mx-auto px-4 py-6 space-y-6">
          {!data ? (
            /* Welcome Section with Tabs */
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
              <div className="overflow-x-auto">
                <TabsList className="grid w-full grid-cols-2 min-w-max">
                  <TabsTrigger value="overview" className="flex items-center space-x-2">
                    <Upload className="h-4 w-4" />
                    <span>Start Here</span>
                  </TabsTrigger>
                  <TabsTrigger value="about" className="flex items-center space-x-2">
                    <Info className="h-4 w-4" />
                    <span>Tentang App</span>
                  </TabsTrigger>
                </TabsList>
              </div>

              <TabsContent value="overview" className="space-y-4">
                {/* Sample Data Loader */}
                <SampleDataLoader onDataLoad={handleDataLoad} />
                
                {/* Quick Start Guide */}
                <QuickStartGuide />
                
                {/* Manual Data Input (Advanced) */}
                <Card className="border-dashed border-2 border-slate-300 dark:border-slate-700">
                  <CardHeader className="text-center">
                    <CardTitle className="flex items-center justify-center space-x-2">
                      <Upload className="h-5 w-5" />
                      <span>Manual Input (Advanced)</span>
                    </CardTitle>
                    <CardDescription>
                      Atau input data SmartTourismChain Anda secara manual untuk analisis custom
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <DataInputPanel onDataUpdate={handleDataUpdate} />
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="about">
                <AboutApp />
              </TabsContent>
            </Tabs>
          ) : (
            /* Main Dashboard */
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
              <div className="overflow-x-auto">
                <TabsList className="grid w-full grid-cols-6 lg:grid-cols-15 min-w-max lg:min-w-0">
                  <TabsTrigger value="overview" className="flex items-center space-x-1">
                    <BarChart3 className="h-4 w-4" />
                    <span className="hidden sm:inline">Overview</span>
                  </TabsTrigger>
                  <TabsTrigger value="economic" className="flex items-center space-x-1">
                    <TrendingUp className="h-4 w-4" />
                    <span className="hidden sm:inline">Economic</span>
                  </TabsTrigger>
                  <TabsTrigger value="social" className="flex items-center space-x-1">
                    <Users className="h-4 w-4" />
                    <span className="hidden sm:inline">Social</span>
                  </TabsTrigger>
                  <TabsTrigger value="environmental" className="flex items-center space-x-1">
                    <Leaf className="h-4 w-4" />
                    <span className="hidden sm:inline">Environmental</span>
                  </TabsTrigger>
                  <TabsTrigger value="geo" className="flex items-center space-x-1">
                    <Globe className="h-4 w-4" />
                    <span className="hidden sm:inline">Geographic</span>
                  </TabsTrigger>
                  <TabsTrigger value="green" className="flex items-center space-x-1">
                    <TreePine className="h-4 w-4" />
                    <span className="hidden sm:inline">Green Metrics</span>
                  </TabsTrigger>
                  <TabsTrigger value="esg" className="flex items-center space-x-1">
                    <FileText className="h-4 w-4" />
                    <span className="hidden sm:inline">ESG Reports</span>
                  </TabsTrigger>
                  <TabsTrigger value="ai" className="flex items-center space-x-1">
                    <Brain className="h-4 w-4" />
                    <span className="hidden sm:inline">AI Analytics</span>
                  </TabsTrigger>
                  <TabsTrigger value="realtime" className="flex items-center space-x-1">
                    <Activity className="h-4 w-4" />
                    <span className="hidden sm:inline">Live</span>
                  </TabsTrigger>
                  <TabsTrigger value="export" className="flex items-center space-x-1">
                    <Download className="h-4 w-4" />
                    <span className="hidden sm:inline">Export</span>
                  </TabsTrigger>
                  <TabsTrigger value="comparison" className="flex items-center space-x-1">
                    <GitCompare className="h-4 w-4" />
                    <span className="hidden sm:inline">Compare</span>
                  </TabsTrigger>
                  <TabsTrigger value="ai-rec" className="flex items-center space-x-1">
                    <Sparkles className="h-4 w-4" />
                    <span className="hidden sm:inline">AI Insights</span>
                  </TabsTrigger>
                  <TabsTrigger value="ml" className="flex items-center space-x-1">
                    <Brain className="h-4 w-4" />
                    <span className="hidden sm:inline">ML Analytics</span>
                  </TabsTrigger>
                  <TabsTrigger value="blockchain" className="flex items-center space-x-1">
                    <LinkIcon className="h-4 w-4" />
                    <span className="hidden sm:inline">Blockchain</span>
                  </TabsTrigger>
                  <TabsTrigger value="about" className="flex items-center space-x-1">
                    <Info className="h-4 w-4" />
                    <span className="hidden sm:inline">Tentang</span>
                  </TabsTrigger>
                </TabsList>
              </div>

              <TabsContent value="overview" className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-2">
                    <TripleBottomLineChart data={data} />
                  </div>
                  <div className="space-y-6">
                    <SustainabilityIndex score={sustainabilityScore} data={data} />
                    {carbonLayerEnabled && <CarbonLayer data={data} />}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="economic">
                <EconomicDashboard data={data} />
              </TabsContent>

              <TabsContent value="social">
                <SocialDashboard data={data} />
              </TabsContent>

              <TabsContent value="environmental">
                <EnvironmentalDashboard data={data} carbonLayerEnabled={carbonLayerEnabled} />
              </TabsContent>

              <TabsContent value="geo">
                <InteractiveGeoDashboard data={data} />
              </TabsContent>

              <TabsContent value="green">
                <GreenMetricsLayer data={data} />
              </TabsContent>

              <TabsContent value="esg">
                <ESGReportingExport data={data} />
              </TabsContent>

              <TabsContent value="ai">
                <EnhancedPredictiveAnalytics data={data} />
              </TabsContent>

              <TabsContent value="realtime">
                <RealTimeSimulator 
                  onDataUpdate={handleDataUpdate}
                  currentData={data}
                />
              </TabsContent>

              <TabsContent value="export">
                <ExportPanel data={data} />
              </TabsContent>

              <TabsContent value="comparison">
                <ComparisonMode currentData={data} />
              </TabsContent>

              <TabsContent value="ai-rec">
                <AIRecommendations data={data} />
              </TabsContent>

              <TabsContent value="ml">
                <AdvancedAnalyticsML data={data} />
              </TabsContent>

              <TabsContent value="blockchain">
                <BlockchainLiveData />
              </TabsContent>

              <TabsContent value="about">
                <AboutApp />
              </TabsContent>
            </Tabs>
          )}
        </main>

        {/* Reset Confirmation Dialog */}
        <ConfirmationDialog
          isOpen={showResetDialog}
          onClose={() => setShowResetDialog(false)}
          onConfirm={handleConfirmReset}
          title="Reset All Data"
          description="Are you sure you want to reset all data and return to a clean slate? This will permanently delete all your current analytics data, settings, and configurations. This action cannot be undone."
          confirmText="Yes, Reset All Data"
          cancelText="Cancel"
          type="danger"
        />
      </div>
  )
}

function calculateSustainabilityIndex(data: STCData): number {
  // Economic factor (40% weight)
  const economicScore = Math.min((data.onChain.totalVolume / 1000000) * 30 + (data.offChain.totalBookings / 100) * 10, 40)
  
  // Social factor (30% weight)
  const socialScore = Math.min((data.social.avgRating / 5) * 20 + (data.social.sentimentDistribution.positive / data.social.totalReviews) * 10, 30)
  
  // Environmental factor (30% weight)
  const environmentalScore = Math.min((data.environmental.efficiencyScore / 100) * 20 + (data.environmental.renewableEnergyPercent / 100) * 10, 30)
  
  return Math.round(economicScore + socialScore + environmentalScore)
}

export default function STCImpactVizPage() {
  return (
    <CurrencyProvider>
      <STCImpactVizPageContent />
    </CurrencyProvider>
  )
}