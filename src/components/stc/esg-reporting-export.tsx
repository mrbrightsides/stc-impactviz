'use client'

import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Progress } from '@/components/ui/progress'
import { Separator } from '@/components/ui/separator'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { AlertCircle, Download, FileText, Globe, Target, TreePine, CheckCircle, Clock, FileSpreadsheet, FileImage } from 'lucide-react'
import { toast } from 'sonner'
import * as XLSX from 'xlsx'
import jsPDF from 'jspdf'
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

interface ESGReportingExportProps {
  data: STCData
}

type ESGStandard = 'GRI' | 'SDG' | 'GHG'

interface ESGMetric {
  id: string
  name: string
  description: string
  value: string | number
  unit: string
  category: 'Economic' | 'Social' | 'Environmental'
  compliance: number
}

export function ESGReportingExport({ data }: ESGReportingExportProps): JSX.Element {
  const { currency } = useCurrency()
  const [selectedStandard, setSelectedStandard] = useState<ESGStandard>('GRI')
  const [exportFormat, setExportFormat] = useState<'xlsx' | 'pdf' | 'json'>('xlsx')
  const [isExporting, setIsExporting] = useState(false)
  const [exportProgress, setExportProgress] = useState(0)

  const esgStandards = {
    GRI: {
      name: 'Global Reporting Initiative',
      description: 'Comprehensive sustainability reporting framework',
      icon: Globe,
      color: 'bg-blue-500',
      metrics: generateGRIMetrics(data, currency)
    },
    SDG: {
      name: 'Sustainable Development Goals',
      description: 'UN SDGs alignment and contribution tracking',
      icon: Target,
      color: 'bg-green-500',
      metrics: generateSDGMetrics(data, currency)
    },
    GHG: {
      name: 'Greenhouse Gas Protocol',
      description: 'Carbon accounting and emissions reporting',
      icon: TreePine,
      color: 'bg-emerald-500',
      metrics: generateGHGMetrics(data, currency)
    }
  }

  const handleExport = async (): Promise<void> => {
    setIsExporting(true)
    setExportProgress(0)
    
    try {
      const standard = esgStandards[selectedStandard]
      const reportData = {
        standard: selectedStandard,
        generatedAt: new Date().toISOString(),
        currency,
        organizationName: 'SmartTourismChain Platform',
        reportingPeriod: '2024',
        metrics: standard.metrics,
        summary: {
          totalMetrics: standard.metrics.length,
          overallCompliance: Math.round(
            standard.metrics.reduce((sum, m) => sum + m.compliance, 0) / standard.metrics.length
          ),
          categories: {
            Economic: standard.metrics.filter(m => m.category === 'Economic').length,
            Social: standard.metrics.filter(m => m.category === 'Social').length,
            Environmental: standard.metrics.filter(m => m.category === 'Environmental').length
          }
        }
      }

      // Simulate export progress
      const progressIntervals = [20, 40, 60, 80, 95]
      for (const progress of progressIntervals) {
        await new Promise(resolve => setTimeout(resolve, 200))
        setExportProgress(progress)
      }

      switch (exportFormat) {
        case 'xlsx':
          await exportToExcel(reportData)
          break
        case 'pdf':
          await exportToPDF(reportData)
          break
        case 'json':
          exportToJSON(reportData)
          break
      }

      setExportProgress(100)
      toast.success(`ESG report exported successfully as ${exportFormat.toUpperCase()}`)
      
    } catch (error) {
      console.error('Export failed:', error)
      toast.error('Export failed. Please try again.')
    } finally {
      setTimeout(() => {
        setIsExporting(false)
        setExportProgress(0)
      }, 1000)
    }
  }

  const exportToExcel = async (reportData: any): Promise<void> => {
    const wb = XLSX.utils.book_new()
    
    // Summary sheet
    const summaryData = [
      ['ESG Report Summary'],
      ['Standard', reportData.standard],
      ['Generated At', reportData.generatedAt],
      ['Currency', reportData.currency],
      ['Organization', reportData.organizationName],
      ['Reporting Period', reportData.reportingPeriod],
      [''],
      ['Overall Compliance Score', `${reportData.summary.overallCompliance}%`],
      ['Total Metrics', reportData.summary.totalMetrics],
      [''],
      ['Category Breakdown'],
      ['Economic Metrics', reportData.summary.categories.Economic],
      ['Social Metrics', reportData.summary.categories.Social],
      ['Environmental Metrics', reportData.summary.categories.Environmental]
    ]
    
    const summaryWS = XLSX.utils.aoa_to_sheet(summaryData)
    XLSX.utils.book_append_sheet(wb, summaryWS, 'Summary')
    
    // Metrics sheet
    const metricsData = [
      ['Metric ID', 'Name', 'Description', 'Value', 'Unit', 'Category', 'Compliance %']
    ]
    
    reportData.metrics.forEach((metric: ESGMetric) => {
      metricsData.push([
        metric.id,
        metric.name,
        metric.description,
        metric.value.toString(),
        metric.unit,
        metric.category,
        metric.compliance
      ])
    })
    
    const metricsWS = XLSX.utils.aoa_to_sheet(metricsData)
    XLSX.utils.book_append_sheet(wb, metricsWS, 'Metrics')
    
    // Download
    XLSX.writeFile(wb, `ESG_Report_${reportData.standard}_${Date.now()}.xlsx`)
  }

  const exportToPDF = async (reportData: any): Promise<void> => {
    const pdf = new jsPDF()
    
    // Header
    pdf.setFontSize(20)
    pdf.text('ESG Sustainability Report', 20, 30)
    
    pdf.setFontSize(12)
    pdf.text(`Standard: ${reportData.standard} - ${esgStandards[selectedStandard].name}`, 20, 45)
    pdf.text(`Generated: ${new Date(reportData.generatedAt).toLocaleDateString()}`, 20, 55)
    pdf.text(`Currency: ${reportData.currency}`, 20, 65)
    
    // Summary
    pdf.setFontSize(16)
    pdf.text('Executive Summary', 20, 85)
    
    pdf.setFontSize(12)
    pdf.text(`Overall Compliance Score: ${reportData.summary.overallCompliance}%`, 20, 100)
    pdf.text(`Total Metrics Assessed: ${reportData.summary.totalMetrics}`, 20, 110)
    
    // Category breakdown
    let yPos = 130
    pdf.text('Category Breakdown:', 20, yPos)
    yPos += 15
    pdf.text(`• Economic Metrics: ${reportData.summary.categories.Economic}`, 30, yPos)
    yPos += 10
    pdf.text(`• Social Metrics: ${reportData.summary.categories.Social}`, 30, yPos)
    yPos += 10
    pdf.text(`• Environmental Metrics: ${reportData.summary.categories.Environmental}`, 30, yPos)
    
    // Add new page for metrics
    pdf.addPage()
    pdf.setFontSize(16)
    pdf.text('Detailed Metrics', 20, 30)
    
    yPos = 50
    pdf.setFontSize(10)
    
    reportData.metrics.slice(0, 15).forEach((metric: ESGMetric) => {
      if (yPos > 270) {
        pdf.addPage()
        yPos = 30
      }
      
      pdf.text(`${metric.name} (${metric.compliance}%)`, 20, yPos)
      yPos += 8
      pdf.text(`${metric.value} ${metric.unit}`, 25, yPos)
      yPos += 12
    })
    
    pdf.save(`ESG_Report_${reportData.standard}_${Date.now()}.pdf`)
  }

  const exportToJSON = (reportData: any): void => {
    const dataStr = JSON.stringify(reportData, null, 2)
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr)
    
    const exportFileDefaultName = `ESG_Report_${reportData.standard}_${Date.now()}.json`
    
    const linkElement = document.createElement('a')
    linkElement.setAttribute('href', dataUri)
    linkElement.setAttribute('download', exportFileDefaultName)
    linkElement.click()
  }

  const currentStandard = esgStandards[selectedStandard]
  const overallCompliance = Math.round(
    currentStandard.metrics.reduce((sum, m) => sum + m.compliance, 0) / currentStandard.metrics.length
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="border-dashed border-2">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <FileText className="h-5 w-5 text-blue-500" />
            <span>ESG Reporting & Export</span>
          </CardTitle>
          <CardDescription>
            Generate compliance reports benchmarked against major ESG standards (GRI, SDGs, GHG Protocol)
          </CardDescription>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Standard Selection */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Reporting Standard</CardTitle>
            <CardDescription>Choose your ESG compliance framework</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Select value={selectedStandard} onValueChange={(value) => setSelectedStandard(value as ESGStandard)}>
              <SelectTrigger>
                <SelectValue placeholder="Select standard" />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(esgStandards).map(([key, standard]) => {
                  const Icon = standard.icon
                  return (
                    <SelectItem key={key} value={key}>
                      <div className="flex items-center space-x-2">
                        <Icon className="h-4 w-4" />
                        <span>{standard.name}</span>
                      </div>
                    </SelectItem>
                  )
                })}
              </SelectContent>
            </Select>

            <div className="space-y-3">
              {Object.entries(esgStandards).map(([key, standard]) => {
                const Icon = standard.icon
                const isSelected = selectedStandard === key
                return (
                  <div
                    key={key}
                    className={`p-3 rounded-lg border-2 cursor-pointer transition-all ${
                      isSelected 
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/20' 
                        : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
                    }`}
                    onClick={() => setSelectedStandard(key as ESGStandard)}
                  >
                    <div className="flex items-start space-x-3">
                      <div className={`p-2 rounded-full ${standard.color} text-white`}>
                        <Icon className="h-4 w-4" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-sm">{standard.name}</h4>
                        <p className="text-xs text-gray-500 mt-1">{standard.description}</p>
                        {isSelected && (
                          <Badge variant="outline" className="mt-2 text-xs">
                            {standard.metrics.length} metrics available
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>

        {/* Current Standard Overview */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>{currentStandard.name}</span>
              <Badge 
                variant={overallCompliance >= 80 ? 'default' : overallCompliance >= 60 ? 'secondary' : 'destructive'}
                className="font-bold"
              >
                {overallCompliance}% Compliance
              </Badge>
            </CardTitle>
            <CardDescription>{currentStandard.description}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Overall Compliance</span>
                <span className="text-sm text-gray-500">{overallCompliance}%</span>
              </div>
              <Progress value={overallCompliance} className="h-2" />
            </div>

            <Separator />

            <div className="space-y-3">
              {['Economic', 'Social', 'Environmental'].map(category => {
                const categoryMetrics = currentStandard.metrics.filter(m => m.category === category)
                const categoryCompliance = Math.round(
                  categoryMetrics.reduce((sum, m) => sum + m.compliance, 0) / categoryMetrics.length
                )
                
                return (
                  <div key={category} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">{category}</span>
                      <span className="text-xs text-gray-500">
                        {categoryMetrics.length} metrics • {categoryCompliance}%
                      </span>
                    </div>
                    <Progress value={categoryCompliance} className="h-1.5" />
                  </div>
                )
              })}
            </div>

            <Separator />

            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="w-full">
                  <AlertCircle className="h-4 w-4 mr-2" />
                  View Detailed Metrics
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>{currentStandard.name} - Detailed Metrics</DialogTitle>
                  <DialogDescription>
                    Comprehensive breakdown of all {currentStandard.metrics.length} metrics
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 mt-4">
                  {currentStandard.metrics.map((metric, index) => (
                    <Card key={metric.id}>
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between">
                          <div>
                            <CardTitle className="text-sm">{metric.name}</CardTitle>
                            <CardDescription className="text-xs mt-1">
                              {metric.description}
                            </CardDescription>
                          </div>
                          <div className="text-right">
                            <Badge 
                              variant={metric.compliance >= 80 ? 'default' : 
                                     metric.compliance >= 60 ? 'secondary' : 'destructive'}
                              className="text-xs"
                            >
                              {metric.compliance}%
                            </Badge>
                            <p className="text-xs text-gray-500 mt-1">{metric.category}</p>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <div className="flex items-center justify-between">
                          <span className="font-mono text-sm">
                            {metric.value} {metric.unit}
                          </span>
                          <Progress value={metric.compliance} className="w-24 h-1.5" />
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </DialogContent>
            </Dialog>
          </CardContent>
        </Card>

        {/* Export Configuration */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Export Configuration</CardTitle>
            <CardDescription>Choose format and generate your ESG report</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-3 block">Export Format</label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { value: 'xlsx', label: 'Excel', icon: FileSpreadsheet, desc: 'Spreadsheet format' },
                  { value: 'pdf', label: 'PDF', icon: FileText, desc: 'Document format' },
                  { value: 'json', label: 'JSON', icon: FileImage, desc: 'Data format' }
                ].map(format => {
                  const Icon = format.icon
                  return (
                    <div
                      key={format.value}
                      className={`p-3 rounded-lg border-2 cursor-pointer transition-all text-center ${
                        exportFormat === format.value 
                          ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/20' 
                          : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
                      }`}
                      onClick={() => setExportFormat(format.value as any)}
                    >
                      <Icon className="h-6 w-6 mx-auto mb-2 text-gray-600" />
                      <p className="font-medium text-sm">{format.label}</p>
                      <p className="text-xs text-gray-500 mt-1">{format.desc}</p>
                    </div>
                  )
                })}
              </div>
            </div>

            <Separator />

            <div className="space-y-3">
              <h4 className="font-medium text-sm">Report Preview</h4>
              <div className="bg-gray-50 dark:bg-gray-900 p-3 rounded-lg space-y-2 text-xs">
                <div className="flex justify-between">
                  <span>Standard:</span>
                  <span className="font-medium">{selectedStandard}</span>
                </div>
                <div className="flex justify-between">
                  <span>Metrics:</span>
                  <span className="font-medium">{currentStandard.metrics.length}</span>
                </div>
                <div className="flex justify-between">
                  <span>Format:</span>
                  <span className="font-medium">{exportFormat.toUpperCase()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Currency:</span>
                  <span className="font-medium">{currency}</span>
                </div>
              </div>
            </div>

            <Separator />

            {isExporting && (
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4 text-blue-500" />
                  <span className="text-sm">Generating report...</span>
                </div>
                <Progress value={exportProgress} className="h-2" />
              </div>
            )}

            <Button 
              onClick={handleExport}
              disabled={isExporting}
              className="w-full"
              size="lg"
            >
              {isExporting ? (
                <>
                  <Clock className="h-4 w-4 mr-2 animate-spin" />
                  Exporting... {exportProgress}%
                </>
              ) : (
                <>
                  <Download className="h-4 w-4 mr-2" />
                  Generate ESG Report
                </>
              )}
            </Button>

            <p className="text-xs text-gray-500">
              Report will include all {currentStandard.metrics.length} metrics with compliance scores, 
              currency-adjusted values, and benchmark comparisons.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

// Helper functions to generate metrics for different standards
function generateGRIMetrics(data: STCData, currency: string): ESGMetric[] {
  return [
    {
      id: 'GRI-201-1',
      name: 'Economic Value Generated',
      description: 'Direct economic value generated and distributed',
      value: formatCurrency(data.onChain.totalVolume, currency),
      unit: currency,
      category: 'Economic',
      compliance: Math.min(95, Math.round((data.onChain.totalVolume / 1000000) * 40))
    },
    {
      id: 'GRI-201-2',
      name: 'Financial Implications of Climate Change',
      description: 'Climate-related financial implications and risks',
      value: formatCurrency(data.environmental.co2Equivalent * 25, currency),
      unit: currency,
      category: 'Economic',
      compliance: Math.round(data.environmental.efficiencyScore * 0.8)
    },
    {
      id: 'GRI-205-1',
      name: 'Anti-corruption Assessment',
      description: 'Operations assessed for corruption-related risks',
      value: '100',
      unit: '%',
      category: 'Economic',
      compliance: 100
    },
    {
      id: 'GRI-401-1',
      name: 'Employee Turnover',
      description: 'New employee hires and employee turnover',
      value: data.social.sentimentDistribution.positive,
      unit: 'persons',
      category: 'Social',
      compliance: Math.round(data.social.avgRating * 18)
    },
    {
      id: 'GRI-413-1',
      name: 'Community Engagement',
      description: 'Operations with local community engagement',
      value: data.offChain.popularLocations.length,
      unit: 'locations',
      category: 'Social',
      compliance: Math.min(100, data.offChain.popularLocations.length * 20)
    },
    {
      id: 'GRI-302-1',
      name: 'Energy Consumption',
      description: 'Energy consumption within organization',
      value: data.environmental.totalEnergyConsumption.toFixed(2),
      unit: 'kWh',
      category: 'Environmental',
      compliance: Math.round(data.environmental.efficiencyScore)
    },
    {
      id: 'GRI-305-1',
      name: 'GHG Emissions Scope 1',
      description: 'Direct greenhouse gas emissions',
      value: data.environmental.co2Equivalent.toFixed(2),
      unit: 'tCO2e',
      category: 'Environmental',
      compliance: Math.max(20, 100 - Math.round(data.environmental.co2Equivalent / 10))
    },
    {
      id: 'GRI-302-4',
      name: 'Energy Intensity',
      description: 'Reduction of energy consumption',
      value: data.environmental.renewableEnergyPercent.toFixed(1),
      unit: '%',
      category: 'Environmental',
      compliance: Math.round(data.environmental.renewableEnergyPercent)
    }
  ]
}

function generateSDGMetrics(data: STCData, currency: string): ESGMetric[] {
  return [
    {
      id: 'SDG-8.1',
      name: 'Economic Growth (SDG 8)',
      description: 'Sustainable economic growth through tourism',
      value: formatCurrency(data.onChain.totalVolume, currency),
      unit: currency,
      category: 'Economic',
      compliance: Math.min(100, Math.round((data.offChain.totalBookings / 100) * 25))
    },
    {
      id: 'SDG-8.9',
      name: 'Sustainable Tourism (SDG 8)',
      description: 'Tourism that creates jobs and promotes local culture',
      value: data.offChain.totalBookings,
      unit: 'bookings',
      category: 'Economic',
      compliance: Math.min(100, Math.round(data.social.avgRating * 18))
    },
    {
      id: 'SDG-10.2',
      name: 'Social Inclusion (SDG 10)',
      description: 'Promote social, economic and political inclusion',
      value: data.social.sentimentDistribution.positive,
      unit: 'positive reviews',
      category: 'Social',
      compliance: Math.round((data.social.sentimentDistribution.positive / data.social.totalReviews) * 100)
    },
    {
      id: 'SDG-11.4',
      name: 'Cultural Heritage (SDG 11)',
      description: 'Protect and safeguard cultural and natural heritage',
      value: data.offChain.popularLocations.length,
      unit: 'locations',
      category: 'Social',
      compliance: Math.min(100, data.offChain.popularLocations.length * 15)
    },
    {
      id: 'SDG-13.1',
      name: 'Climate Action (SDG 13)',
      description: 'Strengthen resilience to climate-related hazards',
      value: data.environmental.co2Equivalent.toFixed(2),
      unit: 'tCO2e',
      category: 'Environmental',
      compliance: Math.max(30, 100 - Math.round(data.environmental.co2Equivalent / 8))
    },
    {
      id: 'SDG-7.2',
      name: 'Renewable Energy (SDG 7)',
      description: 'Increase share of renewable energy',
      value: data.environmental.renewableEnergyPercent.toFixed(1),
      unit: '%',
      category: 'Environmental',
      compliance: Math.round(data.environmental.renewableEnergyPercent)
    },
    {
      id: 'SDG-12.2',
      name: 'Resource Efficiency (SDG 12)',
      description: 'Sustainable management and efficient use of resources',
      value: data.environmental.efficiencyScore,
      unit: 'score',
      category: 'Environmental',
      compliance: Math.round(data.environmental.efficiencyScore * 0.9)
    },
    {
      id: 'SDG-16.6',
      name: 'Transparent Institutions (SDG 16)',
      description: 'Develop effective, accountable and transparent institutions',
      value: '100',
      unit: '%',
      category: 'Social',
      compliance: 95
    }
  ]
}

function generateGHGMetrics(data: STCData, currency: string): ESGMetric[] {
  return [
    {
      id: 'GHG-Scope1',
      name: 'Scope 1 Emissions',
      description: 'Direct emissions from owned or controlled sources',
      value: (data.environmental.co2Equivalent * 0.3).toFixed(2),
      unit: 'tCO2e',
      category: 'Environmental',
      compliance: Math.max(40, 100 - Math.round(data.environmental.co2Equivalent / 12))
    },
    {
      id: 'GHG-Scope2',
      name: 'Scope 2 Emissions',
      description: 'Indirect emissions from purchased energy',
      value: (data.environmental.co2Equivalent * 0.6).toFixed(2),
      unit: 'tCO2e',
      category: 'Environmental',
      compliance: Math.round(data.environmental.renewableEnergyPercent * 0.8)
    },
    {
      id: 'GHG-Scope3',
      name: 'Scope 3 Emissions',
      description: 'Other indirect emissions in value chain',
      value: (data.environmental.co2Equivalent * 0.1).toFixed(2),
      unit: 'tCO2e',
      category: 'Environmental',
      compliance: Math.max(30, 80 - Math.round(data.offChain.totalBookings / 50))
    },
    {
      id: 'GHG-Intensity',
      name: 'Emissions Intensity',
      description: 'GHG emissions per unit of economic activity',
      value: (data.environmental.co2Equivalent / data.onChain.totalVolume * 1000000).toFixed(4),
      unit: 'tCO2e/USD',
      category: 'Environmental',
      compliance: Math.round(data.environmental.efficiencyScore * 0.75)
    },
    {
      id: 'GHG-Reduction',
      name: 'Emission Reductions',
      description: 'Verified emission reductions achieved',
      value: ((100 - data.environmental.renewableEnergyPercent) * data.environmental.co2Equivalent / 100).toFixed(2),
      unit: 'tCO2e',
      category: 'Environmental',
      compliance: Math.round(data.environmental.renewableEnergyPercent * 0.9)
    },
    {
      id: 'GHG-Offset',
      name: 'Carbon Offsets',
      description: 'Verified carbon offsets purchased or generated',
      value: formatCurrency(data.environmental.co2Equivalent * 45, currency),
      unit: currency,
      category: 'Economic',
      compliance: Math.round(data.environmental.efficiencyScore * 0.6)
    },
    {
      id: 'GHG-Renewable',
      name: 'Renewable Energy Usage',
      description: 'Percentage of energy from renewable sources',
      value: data.environmental.renewableEnergyPercent.toFixed(1),
      unit: '%',
      category: 'Environmental',
      compliance: Math.round(data.environmental.renewableEnergyPercent)
    }
  ]
}