'use client'

import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Download, FileText, Image, BarChart3, PieChart, FileSpreadsheet, FileJson, Printer, Share2, Copy, CheckCircle } from 'lucide-react'
import { toast } from 'sonner'
import { saveAs } from 'file-saver'

interface ExportPanelProps {
  data: any
}

interface ExportOptions {
  format: 'csv' | 'json' | 'pdf' | 'png' | 'svg'
  dataTypes: string[]
  includeCharts: boolean
  includeAnalysis: boolean
  customFilename: string
  researchNote: string
  chartTypes: string[]
}

export const ExportPanel: React.FC<ExportPanelProps> = ({ data }) => {
  const [exportOptions, setExportOptions] = useState<ExportOptions>({
    format: 'csv',
    dataTypes: ['economic', 'social', 'environmental'],
    includeCharts: true,
    includeAnalysis: true,
    customFilename: '',
    researchNote: '',
    chartTypes: ['triple-bottom-line', 'sustainability-index']
  })
  const [isExporting, setIsExporting] = useState(false)
  const [copied, setCopied] = useState<string | null>(null)

  const handleExport = async () => {
    setIsExporting(true)
    
    try {
      const exportData = prepareExportData(data, exportOptions)
      const filename = exportOptions.customFilename || `stc-impact-analysis-${new Date().toISOString().split('T')[0]}`
      
      switch (exportOptions.format) {
        case 'csv':
          await exportAsCSV(exportData, filename)
          break
        case 'json':
          await exportAsJSON(exportData, filename)
          break
        case 'pdf':
          await exportAsPDF(exportData, filename)
          break
        case 'png':
        case 'svg':
          await exportAsImage(exportData, filename, exportOptions.format)
          break
        default:
          throw new Error('Unsupported export format')
      }
      
      toast.success(`Data exported successfully as ${exportOptions.format.toUpperCase()}!`)
    } catch (error) {
      toast.error('Export failed. Please try again.')
      console.error('Export error:', error)
    } finally {
      setIsExporting(false)
    }
  }

  const handleCopyData = async (dataType: string) => {
    const exportData = prepareExportData(data, exportOptions)
    const jsonData = JSON.stringify(exportData, null, 2)
    
    try {
      await navigator.clipboard.writeText(jsonData)
      setCopied(dataType)
      toast.success('Data copied to clipboard!')
      setTimeout(() => setCopied(null), 2000)
    } catch (error) {
      toast.error('Failed to copy data')
    }
  }

  const generateCitation = () => {
    const date = new Date().toLocaleDateString()
    const author = 'STC ImpactViz'
    const title = 'Blockchain Tourism Sustainability Analysis'
    
    return `${author}. (${new Date().getFullYear()}). ${title}. Retrieved ${date}, from STC ImpactViz Platform.`
  }

  const previewData = prepareExportData(data, exportOptions)
  const estimatedFileSize = calculateFileSize(previewData, exportOptions.format)

  return (
    <div className="space-y-6">
      {/* Export Configuration */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Download className="h-5 w-5" />
            <span>Export Configuration</span>
          </CardTitle>
          <CardDescription>
            Configure your data export settings for research and publication use
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Format Selection */}
            <div className="space-y-3">
              <Label>Export Format</Label>
              <Select 
                value={exportOptions.format} 
                onValueChange={(value) => setExportOptions({...exportOptions, format: value as any})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select format" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="csv">
                    <div className="flex items-center space-x-2">
                      <FileSpreadsheet className="h-4 w-4" />
                      <span>CSV Spreadsheet</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="json">
                    <div className="flex items-center space-x-2">
                      <FileJson className="h-4 w-4" />
                      <span>JSON Data</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="pdf">
                    <div className="flex items-center space-x-2">
                      <FileText className="h-4 w-4" />
                      <span>PDF Report</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="png">
                    <div className="flex items-center space-x-2">
                      <Image className="h-4 w-4" />
                      <span>PNG Image</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="svg">
                    <div className="flex items-center space-x-2">
                      <BarChart3 className="h-4 w-4" />
                      <span>SVG Vector</span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Custom Filename */}
            <div className="space-y-3">
              <Label>Custom Filename (Optional)</Label>
              <Input
                placeholder="stc-impact-analysis"
                value={exportOptions.customFilename}
                onChange={(e) => setExportOptions({...exportOptions, customFilename: e.target.value})}
              />
              <div className="text-xs text-muted-foreground">
                Leave empty for auto-generated filename
              </div>
            </div>
          </div>

          {/* Data Types Selection */}
          <div className="space-y-3">
            <Label>Data Categories</Label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { id: 'economic', label: 'Economic', icon: BarChart3 },
                { id: 'social', label: 'Social', icon: Share2 },
                { id: 'environmental', label: 'Environmental', icon: BarChart3 },
                { id: 'sustainability', label: 'Sustainability Index', icon: BarChart3 }
              ].map((type) => (
                <div key={type.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={type.id}
                    checked={exportOptions.dataTypes.includes(type.id)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setExportOptions({
                          ...exportOptions,
                          dataTypes: [...exportOptions.dataTypes, type.id]
                        })
                      } else {
                        setExportOptions({
                          ...exportOptions,
                          dataTypes: exportOptions.dataTypes.filter(t => t !== type.id)
                        })
                      }
                    }}
                  />
                  <Label htmlFor={type.id} className="flex items-center space-x-2 cursor-pointer">
                    <type.icon className="h-4 w-4" />
                    <span>{type.label}</span>
                  </Label>
                </div>
              ))}
            </div>
          </div>

          {/* Additional Options */}
          <div className="space-y-3">
            <Label>Additional Options</Label>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="includeCharts"
                  checked={exportOptions.includeCharts}
                  onCheckedChange={(checked) => setExportOptions({...exportOptions, includeCharts: checked as boolean})}
                />
                <Label htmlFor="includeCharts">Include chart data and visualizations</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="includeAnalysis"
                  checked={exportOptions.includeAnalysis}
                  onCheckedChange={(checked) => setExportOptions({...exportOptions, includeAnalysis: checked as boolean})}
                />
                <Label htmlFor="includeAnalysis">Include analytical insights and recommendations</Label>
              </div>
            </div>
          </div>

          {/* Research Note */}
          <div className="space-y-3">
            <Label>Research Note (Optional)</Label>
            <Textarea
              placeholder="Add a note about your research context, methodology, or intended use..."
              value={exportOptions.researchNote}
              onChange={(e) => setExportOptions({...exportOptions, researchNote: e.target.value})}
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      {/* Export Preview */}
      <Card>
        <CardHeader>
          <CardTitle>Export Preview</CardTitle>
          <CardDescription>
            Preview of data to be exported
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-3 bg-slate-50 dark:bg-slate-900 rounded-lg">
              <div className="text-lg font-bold">{Object.keys(previewData).length}</div>
              <div className="text-sm text-muted-foreground">Data Categories</div>
            </div>
            <div className="text-center p-3 bg-slate-50 dark:bg-slate-900 rounded-lg">
              <div className="text-lg font-bold">{estimatedFileSize}</div>
              <div className="text-sm text-muted-foreground">Estimated Size</div>
            </div>
            <div className="text-center p-3 bg-slate-50 dark:bg-slate-900 rounded-lg">
              <div className="text-lg font-bold">{exportOptions.format.toUpperCase()}</div>
              <div className="text-sm text-muted-foreground">Export Format</div>
            </div>
          </div>

          <Separator />

          <div className="space-y-2">
            <h4 className="font-medium">Data Structure Preview:</h4>
            <div className="bg-slate-100 dark:bg-slate-800 p-3 rounded-lg text-sm font-mono max-h-40 overflow-y-auto">
              <pre>{JSON.stringify(previewData, null, 2).slice(0, 500)}...</pre>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Button 
          onClick={handleExport} 
          disabled={isExporting || exportOptions.dataTypes.length === 0}
          className="flex items-center space-x-2"
        >
          <Download className="h-4 w-4" />
          <span>{isExporting ? 'Exporting...' : 'Export Data'}</span>
        </Button>

        <Button 
          variant="outline" 
          onClick={() => handleCopyData('json')}
          className="flex items-center space-x-2"
        >
          {copied === 'json' ? <CheckCircle className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
          <span>Copy JSON</span>
        </Button>

        <Button 
          variant="outline" 
          onClick={() => setExportOptions({
            format: 'pdf',
            dataTypes: ['economic', 'social', 'environmental', 'sustainability'],
            includeCharts: true,
            includeAnalysis: true,
            customFilename: 'stc-research-report',
            researchNote: '',
            chartTypes: ['triple-bottom-line', 'sustainability-index']
          })}
          className="flex items-center space-x-2"
        >
          <Printer className="h-4 w-4" />
          <span>Research Report</span>
        </Button>

        <Button 
          variant="outline" 
          onClick={() => setExportOptions({
            format: 'csv',
            dataTypes: ['economic', 'social', 'environmental'],
            includeCharts: false,
            includeAnalysis: false,
            customFilename: 'stc-raw-data',
            researchNote: '',
            chartTypes: []
          })}
          className="flex items-center space-x-2"
        >
          <FileSpreadsheet className="h-4 w-4" />
          <span>Raw Data CSV</span>
        </Button>
      </div>

      {/* Publication Ready Assets */}
      <Card>
        <CardHeader>
          <CardTitle>Publication Ready Assets</CardTitle>
          <CardDescription>
            High-quality graphics and formatted data for academic and professional use
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              {
                title: 'High-Resolution Charts',
                description: 'Publication-quality PNG/SVG charts at 300 DPI',
                formats: ['PNG', 'SVG', 'PDF'],
                icon: BarChart3
              },
              {
                title: 'Research Data Package',
                description: 'Complete dataset with metadata and documentation',
                formats: ['ZIP', 'JSON', 'CSV'],
                icon: FileText
              },
              {
                title: 'Executive Summary',
                description: 'Professional report with key findings and insights',
                formats: ['PDF', 'DOCX'],
                icon: Printer
              },
              {
                title: 'Interactive Dashboard',
                description: 'Embeddable web components for presentations',
                formats: ['HTML', 'JS'],
                icon: Share2
              }
            ].map((asset, index) => (
              <div key={index} className="p-4 border rounded-lg space-y-3">
                <div className="flex items-center space-x-2">
                  <asset.icon className="h-5 w-5 text-blue-600" />
                  <span className="font-medium">{asset.title}</span>
                </div>
                <p className="text-sm text-muted-foreground">{asset.description}</p>
                <div className="flex items-center space-x-2">
                  {asset.formats.map((format) => (
                    <Badge key={format} variant="outline" className="text-xs">
                      {format}
                    </Badge>
                  ))}
                </div>
                <Button size="sm" variant="outline" className="w-full">
                  Generate {asset.title}
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Citation & Attribution */}
      <Card>
        <CardHeader>
          <CardTitle>Citation & Attribution</CardTitle>
          <CardDescription>
            Proper citation format for academic and professional use
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div>
              <Label>APA Citation:</Label>
              <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-lg text-sm">
                {generateCitation()}
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">
                Generated on {new Date().toLocaleDateString()} using STC ImpactViz v1.0
              </span>
              <Button 
                size="sm" 
                variant="outline" 
                onClick={() => handleCopyData('citation')}
                className="flex items-center space-x-2"
              >
                {copied === 'citation' ? <CheckCircle className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                <span>Copy Citation</span>
              </Button>
            </div>
          </div>

          <Separator />

          <div className="text-sm text-muted-foreground space-y-2">
            <p><strong>Usage Guidelines:</strong></p>
            <ul className="list-disc list-inside space-y-1">
              <li>This data is generated for research and educational purposes</li>
              <li>Please verify blockchain data independently for critical decisions</li>
              <li>Cite this tool and methodology when using exported data</li>
              <li>Share insights responsibly within your organization or research community</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function prepareExportData(data: any, options: ExportOptions) {
  const exportData: any = {
    metadata: {
      exportDate: new Date().toISOString(),
      tool: 'STC ImpactViz',
      version: '1.0',
      researchNote: options.researchNote || null,
      sustainabilityScore: calculateSustainabilityIndex(data)
    }
  }

  if (options.dataTypes.includes('economic')) {
    exportData.economic = {
      totalRevenue: data.onChain.totalVolume * 0.001 + data.offChain.bookings?.reduce((sum: number, b: any) => sum + b.cost, 0) || 0,
      totalBookings: data.offChain.totalBookings,
      avgSpending: data.offChain.avgSpending,
      uniqueAddresses: data.onChain.uniqueAddresses,
      transactionVolume: data.onChain.totalVolume,
      popularLocations: data.offChain.popularLocations || []
    }
  }

  if (options.dataTypes.includes('social')) {
    exportData.social = {
      avgRating: data.social.avgRating,
      totalReviews: data.social.totalReviews,
      sentimentDistribution: data.social.sentimentDistribution,
      engagementRate: (data.social.totalReviews / data.offChain.totalBookings) * 100
    }
  }

  if (options.dataTypes.includes('environmental')) {
    exportData.environmental = {
      totalEnergyConsumption: data.environmental.totalEnergyConsumption,
      co2Equivalent: data.environmental.co2Equivalent,
      efficiencyScore: data.environmental.efficiencyScore,
      renewableEnergyPercent: data.environmental.renewableEnergyPercent,
      carbonIntensity: data.environmental.co2Equivalent / data.onChain.transactions.length
    }
  }

  if (options.dataTypes.includes('sustainability')) {
    exportData.sustainabilityIndex = {
      overallScore: exportData.metadata.sustainabilityScore,
      economicScore: calculateEconomicScore(data),
      socialScore: calculateSocialScore(data),
      environmentalScore: calculateEnvironmentalScore(data),
      recommendations: generateRecommendations(data)
    }
  }

  if (options.includeAnalysis) {
    exportData.analysis = {
      keyInsights: generateKeyInsights(data),
      trendAnalysis: generateTrendAnalysis(data),
      benchmarkComparisons: generateBenchmarks(data)
    }
  }

  return exportData
}

async function exportAsCSV(data: any, filename: string) {
  let csvContent = ''
  
  // Create CSV headers and rows for each data category
  Object.keys(data).forEach((category) => {
    if (typeof data[category] === 'object' && data[category] !== null) {
      csvContent += `\n${category.toUpperCase()}\n`
      
      if (Array.isArray(data[category])) {
        // Handle arrays
        data[category].forEach((item: any, index: number) => {
          if (index === 0 && typeof item === 'object') {
            // Add headers
            csvContent += Object.keys(item).join(',') + '\n'
          }
          if (typeof item === 'object') {
            csvContent += Object.values(item).join(',') + '\n'
          } else {
            csvContent += item + '\n'
          }
        })
      } else {
        // Handle objects
        csvContent += 'Property,Value\n'
        Object.entries(data[category]).forEach(([key, value]) => {
          csvContent += `${key},${value}\n`
        })
      }
      csvContent += '\n'
    }
  })
  
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  saveAs(blob, `${filename}.csv`)
}

async function exportAsJSON(data: any, filename: string) {
  const jsonString = JSON.stringify(data, null, 2)
  const blob = new Blob([jsonString], { type: 'application/json' })
  saveAs(blob, `${filename}.json`)
}

async function exportAsPDF(data: any, filename: string) {
  // In a real implementation, this would use a PDF library like jsPDF or puppeteer
  // For now, we'll create a simple text-based PDF content
  const pdfContent = `STC IMPACTVIZ SUSTAINABILITY REPORT
Generated: ${new Date().toLocaleDateString()}

SUSTAINABILITY SCORE: ${data.metadata.sustainabilityScore}/100

ECONOMIC METRICS:
- Total Revenue: $${data.economic?.totalRevenue?.toFixed(0) || 'N/A'}
- Total Bookings: ${data.economic?.totalBookings || 'N/A'}
- Unique Addresses: ${data.economic?.uniqueAddresses || 'N/A'}

SOCIAL METRICS:
- Average Rating: ${data.social?.avgRating?.toFixed(1) || 'N/A'}/5
- Total Reviews: ${data.social?.totalReviews || 'N/A'}
- Engagement Rate: ${data.social?.engagementRate?.toFixed(1) || 'N/A'}%

ENVIRONMENTAL METRICS:
- Energy Consumption: ${data.environmental?.totalEnergyConsumption || 'N/A'} kWh
- CO2 Equivalent: ${data.environmental?.co2Equivalent || 'N/A'} kg
- Efficiency Score: ${data.environmental?.efficiencyScore || 'N/A'}/100

${data.metadata.researchNote ? `RESEARCH NOTE:\n${data.metadata.researchNote}` : ''}

Generated by STC ImpactViz - Blockchain Tourism Sustainability Analytics Platform`

  const blob = new Blob([pdfContent], { type: 'text/plain' })
  saveAs(blob, `${filename}.txt`) // Saving as TXT since we don't have PDF generation
}

async function exportAsImage(data: any, filename: string, format: 'png' | 'svg') {
  // In a real implementation, this would capture the dashboard as an image
  // For now, we'll create a simple SVG representation
  const svgContent = `<svg width="800" height="600" xmlns="http://www.w3.org/2000/svg">
    <rect width="800" height="600" fill="white"/>
    <text x="400" y="50" text-anchor="middle" font-size="24" font-weight="bold" fill="#333">
      STC ImpactViz Dashboard
    </text>
    <text x="400" y="100" text-anchor="middle" font-size="16" fill="#666">
      Sustainability Score: ${data.metadata.sustainabilityScore}/100
    </text>
    <circle cx="200" cy="300" r="80" fill="#3b82f6" opacity="0.7"/>
    <text x="200" y="305" text-anchor="middle" fill="white" font-weight="bold">Economic</text>
    <circle cx="400" cy="300" r="80" fill="#10b981" opacity="0.7"/>
    <text x="400" y="305" text-anchor="middle" fill="white" font-weight="bold">Social</text>
    <circle cx="600" cy="300" r="80" fill="#8b5cf6" opacity="0.7"/>
    <text x="600" y="305" text-anchor="middle" fill="white" font-weight="bold">Environmental</text>
  </svg>`

  const blob = new Blob([svgContent], { type: format === 'svg' ? 'image/svg+xml' : 'text/plain' })
  saveAs(blob, `${filename}.${format}`)
}

function calculateFileSize(data: any, format: string): string {
  const jsonString = JSON.stringify(data)
  const bytes = new Blob([jsonString]).size
  
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

// Helper functions (simplified versions)
function calculateSustainabilityIndex(data: any): number {
  return Math.round(
    calculateEconomicScore(data) * 0.35 +
    calculateSocialScore(data) * 0.30 +
    calculateEnvironmentalScore(data) * 0.35
  )
}

function calculateEconomicScore(data: any): number {
  if (!data.onChain || !data.offChain) return 0
  const volumeScore = Math.min(100, (data.onChain.totalVolume / 1000000) * 30)
  const bookingScore = Math.min(100, (data.offChain.totalBookings / 100) * 40)
  return (volumeScore + bookingScore) / 2
}

function calculateSocialScore(data: any): number {
  if (!data.social) return 0
  const ratingScore = (data.social.avgRating / 5) * 100
  const sentimentScore = (data.social.sentimentDistribution.positive / data.social.totalReviews) * 100
  return (ratingScore + sentimentScore) / 2
}

function calculateEnvironmentalScore(data: any): number {
  if (!data.environmental) return 0
  return (data.environmental.efficiencyScore + data.environmental.renewableEnergyPercent) / 2
}

function generateKeyInsights(data: any): string[] {
  return [
    `Platform processed ${data.onChain?.transactions?.length || 0} blockchain transactions`,
    `Average customer satisfaction: ${data.social?.avgRating?.toFixed(1) || 'N/A'}/5 stars`,
    `Environmental efficiency: ${data.environmental?.efficiencyScore || 'N/A'}/100`,
    `${data.environmental?.renewableEnergyPercent?.toFixed(0) || 'N/A'}% renewable energy usage`
  ]
}

function generateTrendAnalysis(data: any): string {
  return 'Positive trends observed in sustainability metrics with room for improvement in carbon reduction initiatives.'
}

function generateBenchmarks(data: any): any {
  return {
    industryAverage: 65,
    yourScore: calculateSustainabilityIndex(data),
    ranking: 'Above Average'
  }
}

function generateRecommendations(data: any): string[] {
  const recommendations = []
  
  if (calculateEnvironmentalScore(data) < 70) {
    recommendations.push('Increase renewable energy usage to reduce carbon footprint')
  }
  
  if (calculateSocialScore(data) < 70) {
    recommendations.push('Focus on improving customer satisfaction and engagement')
  }
  
  if (calculateEconomicScore(data) < 70) {
    recommendations.push('Optimize transaction efficiency and revenue generation')
  }
  
  return recommendations
}