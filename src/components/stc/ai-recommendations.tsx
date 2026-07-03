'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { 
  Brain, 
  Sparkles, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle2,
  Lightbulb,
  Target,
  Zap,
  RefreshCw
} from 'lucide-react'
import { Progress } from '@/components/ui/progress'
import type { STCData } from '@/lib/sample-data'

interface Recommendation {
  id: string
  category: 'economic' | 'social' | 'environmental' | 'overall'
  priority: 'high' | 'medium' | 'low'
  title: string
  description: string
  impact: string
  actionItems: string[]
  estimatedImprovement: number
  timeframe: string
}

interface AIRecommendationsProps {
  data: STCData
}

export const AIRecommendations: React.FC<AIRecommendationsProps> = ({ data }) => {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([])
  const [analyzing, setAnalyzing] = useState(false)
  const [overallHealth, setOverallHealth] = useState<number>(0)

  useEffect(() => {
    generateRecommendations()
  }, [data])

  const generateRecommendations = () => {
    setAnalyzing(true)
    
    // Simulate AI analysis
    setTimeout(() => {
      const recs = analyzeDataAndGenerateRecommendations(data)
      setRecommendations(recs)
      setOverallHealth(calculateOverallHealth(data))
      setAnalyzing(false)
    }, 1500)
  }

  const calculateOverallHealth = (data: STCData): number => {
    const economicHealth = Math.min(100, (data.onChain.totalVolume / 50000) * 30 + (data.offChain.totalBookings / 200) * 20)
    const socialHealth = (data.social.avgRating / 5) * 100
    const environmentalHealth = (data.environmental.efficiencyScore + data.environmental.renewableEnergyPercent) / 2
    
    return Math.round((economicHealth + socialHealth + environmentalHealth) / 3)
  }

  const analyzeDataAndGenerateRecommendations = (data: STCData): Recommendation[] => {
    const recs: Recommendation[] = []

    // Economic Analysis
    const avgGas = data.onChain.avgGasFee
    if (avgGas > 50000) {
      recs.push({
        id: 'rec-gas-optimization',
        category: 'economic',
        priority: 'high',
        title: 'Optimize Gas Fees for Cost Efficiency',
        description: `Rata-rata gas fee Anda saat ini ${avgGas.toFixed(0)} gwei, yang lebih tinggi dari standar industri. Ini meningkatkan biaya operasional transaksi blockchain.`,
        impact: 'Pengurangan biaya operasional hingga 30-40%',
        actionItems: [
          'Implementasikan batch processing untuk menggabungkan multiple transaksi',
          'Gunakan gas price oracle untuk timing transaksi optimal',
          'Pertimbangkan Layer 2 solutions seperti Polygon atau Arbitrum',
          'Optimize smart contract code untuk efisiensi gas'
        ],
        estimatedImprovement: 35,
        timeframe: '2-4 minggu'
      })
    }

    if (data.offChain.avgSpending < 300) {
      recs.push({
        id: 'rec-revenue-growth',
        category: 'economic',
        priority: 'high',
        title: 'Tingkatkan Average Revenue Per Booking',
        description: `Average spending per booking saat ini Rp ${data.offChain.avgSpending.toLocaleString()}. Ada potensi untuk meningkatkan revenue melalui upselling dan premium services.`,
        impact: 'Peningkatan revenue 25-35% tanpa menambah volume booking',
        actionItems: [
          'Tawarkan paket premium dengan value-added services',
          'Implementasikan dynamic pricing berdasarkan demand',
          'Create bundle packages untuk multiple destinations',
          'Launch loyalty program dengan exclusive benefits'
        ],
        estimatedImprovement: 30,
        timeframe: '1-2 bulan'
      })
    }

    // Social Analysis
    if (data.social.avgRating < 4.0) {
      recs.push({
        id: 'rec-customer-satisfaction',
        category: 'social',
        priority: 'high',
        title: 'Improve Customer Satisfaction Score',
        description: `Rating rata-rata ${data.social.avgRating.toFixed(2)}/5.0 menunjukkan ada ruang untuk peningkatan customer satisfaction. Rating tinggi directly berkorelasi dengan repeat bookings.`,
        impact: 'Peningkatan customer retention 20-30% dan positive word-of-mouth',
        actionItems: [
          'Implementasikan 24/7 customer support system',
          'Regular training untuk service staff',
          'Quick response system untuk customer complaints',
          'Personalized experience berdasarkan customer preferences'
        ],
        estimatedImprovement: 25,
        timeframe: '6-8 minggu'
      })
    }

    const negativePercent = (data.social.sentimentDistribution.negative / data.social.totalReviews) * 100
    if (negativePercent > 15) {
      recs.push({
        id: 'rec-sentiment-improvement',
        category: 'social',
        priority: 'medium',
        title: 'Address Negative Sentiment in Reviews',
        description: `${negativePercent.toFixed(1)}% reviews memiliki sentiment negatif. AI analysis menunjukkan pola complaint yang bisa diatasi secara sistematis.`,
        impact: 'Reduction negative reviews sebesar 40-50%',
        actionItems: [
          'Analisis detail dari negative reviews untuk identify common issues',
          'Implementasikan feedback loop dengan operational team',
          'Proactive outreach ke customers dengan potential issues',
          'Create standard operating procedures untuk issue resolution'
        ],
        estimatedImprovement: 20,
        timeframe: '4-6 minggu'
      })
    }

    // Environmental Analysis
    if (data.environmental.renewableEnergyPercent < 50) {
      recs.push({
        id: 'rec-renewable-energy',
        category: 'environmental',
        priority: 'high',
        title: 'Increase Renewable Energy Usage',
        description: `Saat ini hanya ${data.environmental.renewableEnergyPercent}% operasi menggunakan renewable energy. Meningkatkan persentase ini akan significantly improve sustainability score.`,
        impact: 'Environmental score improvement 30-40 points dan reduced carbon footprint',
        actionItems: [
          'Partner dengan green energy providers',
          'Install solar panels di facilities',
          'Offset carbon emissions melalui certified programs',
          'Migrate ke green hosting untuk digital infrastructure'
        ],
        estimatedImprovement: 35,
        timeframe: '3-6 bulan'
      })
    }

    if (data.environmental.co2Equivalent > 3000) {
      recs.push({
        id: 'rec-carbon-reduction',
        category: 'environmental',
        priority: 'high',
        title: 'Reduce Carbon Footprint',
        description: `CO₂ equivalent saat ini ${data.environmental.co2Equivalent.toLocaleString()} kg. Target industri adalah dibawah 2500 kg untuk sustainable tourism operations.`,
        impact: 'Carbon footprint reduction 35-45%',
        actionItems: [
          'Implement carbon accounting di semua operations',
          'Optimize transportation dan logistics routes',
          'Encourage eco-friendly tourist activities',
          'Partner dengan local conservation programs'
        ],
        estimatedImprovement: 40,
        timeframe: '4-8 bulan'
      })
    }

    if (data.environmental.efficiencyScore < 75) {
      recs.push({
        id: 'rec-operational-efficiency',
        category: 'environmental',
        priority: 'medium',
        title: 'Improve Operational Efficiency',
        description: `Efficiency score ${data.environmental.efficiencyScore}/100 menunjukkan ada waste di operations. Better efficiency = lower costs + better sustainability.`,
        impact: 'Cost reduction 15-20% dan efficiency improvement',
        actionItems: [
          'Conduct energy audit di semua facilities',
          'Implement IoT sensors untuk real-time monitoring',
          'Optimize resource allocation dengan AI/ML',
          'Regular maintenance untuk prevent energy waste'
        ],
        estimatedImprovement: 20,
        timeframe: '2-3 bulan'
      })
    }

    // Overall Strategic Recommendations
    const sustainabilityScore = calculateOverallHealth(data)
    if (sustainabilityScore < 70) {
      recs.push({
        id: 'rec-holistic-strategy',
        category: 'overall',
        priority: 'high',
        title: 'Develop Holistic Sustainability Strategy',
        description: `Overall sustainability score ${sustainabilityScore}/100 memerlukan comprehensive approach. Integrate economic, social, dan environmental initiatives untuk maximum impact.`,
        impact: 'Overall sustainability improvement 40-50 points dalam 12 bulan',
        actionItems: [
          'Create dedicated sustainability team dengan clear KPIs',
          'Implement ESG reporting framework (GRI Standards)',
          'Regular stakeholder engagement dan transparency',
          'Invest dalam sustainability training untuk semua staff',
          'Set ambitious but achievable sustainability targets'
        ],
        estimatedImprovement: 45,
        timeframe: '6-12 bulan'
      })
    }

    // Sort by priority
    return recs.sort((a, b) => {
      const priorityOrder = { high: 0, medium: 1, low: 2 }
      return priorityOrder[a.priority] - priorityOrder[b.priority]
    })
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'text-red-600 bg-red-50 border-red-200 dark:bg-red-950 dark:border-red-800'
      case 'medium':
        return 'text-orange-600 bg-orange-50 border-orange-200 dark:bg-orange-950 dark:border-orange-800'
      case 'low':
        return 'text-green-600 bg-green-50 border-green-200 dark:bg-green-950 dark:border-green-800'
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200'
    }
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'economic':
        return <TrendingUp className="h-5 w-5" />
      case 'social':
        return <CheckCircle2 className="h-5 w-5" />
      case 'environmental':
        return <Sparkles className="h-5 w-5" />
      case 'overall':
        return <Target className="h-5 w-5" />
      default:
        return <Lightbulb className="h-5 w-5" />
    }
  }

  const getHealthColor = (health: number) => {
    if (health >= 80) return 'text-green-600'
    if (health >= 60) return 'text-blue-600'
    if (health >= 40) return 'text-orange-600'
    return 'text-red-600'
  }

  const getHealthLabel = (health: number) => {
    if (health >= 80) return 'Excellent'
    if (health >= 60) return 'Good'
    if (health >= 40) return 'Fair'
    return 'Needs Improvement'
  }

  if (analyzing) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <Brain className="h-16 w-16 text-primary animate-pulse mb-4" />
          <p className="text-lg font-medium mb-2">AI sedang menganalisis data...</p>
          <p className="text-sm text-muted-foreground mb-4">Generating personalized recommendations</p>
          <Progress value={66} className="w-64" />
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Overall Health Score */}
      <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-6 w-6" />
            AI Sustainability Health Score
          </CardTitle>
          <CardDescription>
            Comprehensive analysis dari economic, social, dan environmental performance
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className={`text-6xl font-bold ${getHealthColor(overallHealth)}`}>
                {overallHealth}
                <span className="text-2xl">/100</span>
              </div>
              <div className="text-sm text-muted-foreground mt-2">
                Status: <span className="font-medium">{getHealthLabel(overallHealth)}</span>
              </div>
            </div>
            <div className="flex flex-col items-end gap-2">
              <Badge variant="outline" className="text-sm">
                <Sparkles className="h-3 w-3 mr-1" />
                {recommendations.length} Recommendations
              </Badge>
              <Button variant="outline" size="sm" onClick={generateRecommendations}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh Analysis
              </Button>
            </div>
          </div>
          <Progress value={overallHealth} className="h-3" />
        </CardContent>
      </Card>

      {/* Recommendations Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-red-600">
                  {recommendations.filter(r => r.priority === 'high').length}
                </div>
                <div className="text-sm text-muted-foreground">High Priority</div>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-orange-600">
                  {recommendations.filter(r => r.priority === 'medium').length}
                </div>
                <div className="text-sm text-muted-foreground">Medium Priority</div>
              </div>
              <Zap className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-green-600">
                  {recommendations.filter(r => r.priority === 'low').length}
                </div>
                <div className="text-sm text-muted-foreground">Low Priority</div>
              </div>
              <CheckCircle2 className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5" />
            AI-Generated Recommendations
          </CardTitle>
          <CardDescription>
            Actionable insights untuk improve sustainability performance
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {recommendations.map((rec) => (
            <Card key={rec.id} className={`border-2 ${getPriorityColor(rec.priority)}`}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3 flex-1">
                    {getCategoryIcon(rec.category)}
                    <div className="flex-1">
                      <CardTitle className="text-base flex items-center gap-2">
                        {rec.title}
                        <Badge 
                          variant={rec.priority === 'high' ? 'destructive' : rec.priority === 'medium' ? 'default' : 'secondary'}
                          className="text-xs"
                        >
                          {rec.priority.toUpperCase()}
                        </Badge>
                      </CardTitle>
                      <CardDescription className="mt-2">
                        {rec.description}
                      </CardDescription>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Alert>
                    <TrendingUp className="h-4 w-4" />
                    <AlertDescription>
                      <strong>Expected Impact:</strong><br />
                      {rec.impact}
                    </AlertDescription>
                  </Alert>
                  <Alert>
                    <Zap className="h-4 w-4" />
                    <AlertDescription>
                      <strong>Improvement:</strong><br />
                      +{rec.estimatedImprovement} points | {rec.timeframe}
                    </AlertDescription>
                  </Alert>
                </div>

                <Separator />

                <div>
                  <h4 className="font-medium mb-3 flex items-center gap-2">
                    <Target className="h-4 w-4" />
                    Action Items:
                  </h4>
                  <ul className="space-y-2">
                    {rec.actionItems.map((item, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm">
                        <CheckCircle2 className="h-4 w-4 mt-0.5 text-green-600 flex-shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
