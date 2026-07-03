'use client'

import React, { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Separator } from '@/components/ui/separator'
import { Target, TrendingUp, TrendingDown, Award, AlertTriangle, CheckCircle, Activity, Zap } from 'lucide-react'

interface SustainabilityIndexProps {
  score: number
  data: {
    onChain: {
      totalVolume: number
      uniqueAddresses: number
      transactions: any[]
      avgGasFee: number
    }
    offChain: {
      totalBookings: number
      avgSpending: number
    }
    social: {
      avgRating: number
      totalReviews: number
      sentimentDistribution: any
    }
    environmental: {
      efficiencyScore: number
      renewableEnergyPercent: number
      co2Equivalent: number
    }
  }
}

interface IndexComponent {
  name: string
  weight: number
  score: number
  trend: number
  status: 'excellent' | 'good' | 'fair' | 'poor'
  description: string
  icon: React.ComponentType<any>
}

export const SustainabilityIndex: React.FC<SustainabilityIndexProps> = ({ score, data }) => {
  const [animatedScore, setAnimatedScore] = useState(0)
  const [components, setComponents] = useState<IndexComponent[]>([])

  useEffect(() => {
    // Animate score on mount
    const duration = 2000
    const startTime = Date.now()
    
    const animate = () => {
      const elapsed = Date.now() - startTime
      const progress = Math.min(elapsed / duration, 1)
      const easeOutQuart = 1 - Math.pow(1 - progress, 4)
      
      setAnimatedScore(Math.round(score * easeOutQuart))
      
      if (progress < 1) {
        requestAnimationFrame(animate)
      }
    }
    
    animate()
  }, [score])

  useEffect(() => {
    const indexComponents = calculateIndexComponents(data)
    setComponents(indexComponents)
  }, [data])

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600'
    if (score >= 65) return 'text-blue-600'
    if (score >= 50) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getScoreBackground = (score: number) => {
    if (score >= 80) return 'from-green-500 to-emerald-600'
    if (score >= 65) return 'from-blue-500 to-cyan-600'
    if (score >= 50) return 'from-yellow-500 to-orange-600'
    return 'from-red-500 to-pink-600'
  }

  const getScoreLabel = (score: number) => {
    if (score >= 80) return 'Excellent'
    if (score >= 65) return 'Good'
    if (score >= 50) return 'Fair'
    return 'Needs Improvement'
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'excellent': return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'good': return <TrendingUp className="h-4 w-4 text-blue-500" />
      case 'fair': return <Activity className="h-4 w-4 text-yellow-500" />
      case 'poor': return <AlertTriangle className="h-4 w-4 text-red-500" />
      default: return <Target className="h-4 w-4" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'excellent': return 'border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950'
      case 'good': return 'border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950'
      case 'fair': return 'border-yellow-200 bg-yellow-50 dark:border-yellow-800 dark:bg-yellow-950'
      case 'poor': return 'border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950'
      default: return 'border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-950'
    }
  }

  // Calculate recommendations based on weak areas
  const recommendations = generateRecommendations(components)
  const benchmarks = getBenchmarkComparisons(score)

  return (
    <div className="space-y-4">
      {/* Main STC Index Score */}
      <Card className="relative overflow-hidden">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center space-x-2">
            <Award className="h-5 w-5" />
            <span>STC Sustainability Index</span>
          </CardTitle>
          <CardDescription>
            Comprehensive sustainability score across all dimensions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center space-y-4">
            <div className="relative">
              <div className={`text-6xl font-bold bg-gradient-to-r ${getScoreBackground(animatedScore)} bg-clip-text text-transparent`}>
                {animatedScore}
              </div>
              <div className="text-sm text-muted-foreground">/100</div>
            </div>
            
            <Badge 
              variant={animatedScore >= 65 ? "default" : "secondary"}
              className="text-sm px-3 py-1"
            >
              {getScoreLabel(animatedScore)}
            </Badge>

            <div className="w-full bg-gray-200 dark:bg-gray-800 rounded-full h-3">
              <div 
                className={`bg-gradient-to-r ${getScoreBackground(animatedScore)} h-3 rounded-full transition-all duration-2000 ease-out`}
                style={{ width: `${animatedScore}%` }}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Index Components Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Index Components</CardTitle>
          <CardDescription>
            Detailed breakdown of sustainability factors
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {components.map((component, index) => (
            <div key={index} className={`p-3 rounded-lg border ${getStatusColor(component.status)}`}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <component.icon className="h-4 w-4" />
                  <span className="font-medium">{component.name}</span>
                  <span className="text-xs text-muted-foreground">({component.weight}% weight)</span>
                </div>
                <div className="flex items-center space-x-2">
                  {getStatusIcon(component.status)}
                  <span className="font-bold">{component.score.toFixed(1)}</span>
                  <Badge 
                    variant={component.trend > 0 ? "default" : component.trend < 0 ? "destructive" : "secondary"}
                    className="text-xs"
                  >
                    {component.trend > 0 ? <TrendingUp className="h-3 w-3 mr-1" /> : 
                     component.trend < 0 ? <TrendingDown className="h-3 w-3 mr-1" /> : 
                     <Activity className="h-3 w-3 mr-1" />}
                    {Math.abs(component.trend).toFixed(1)}%
                  </Badge>
                </div>
              </div>
              <Progress value={component.score} className="mb-2" />
              <p className="text-xs text-muted-foreground">{component.description}</p>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Benchmarks & Comparisons */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Industry Benchmarks</CardTitle>
          <CardDescription>
            How your sustainability performance compares
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {benchmarks.map((benchmark, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-900 rounded-lg">
              <div className="space-y-1">
                <div className="font-medium">{benchmark.category}</div>
                <div className="text-xs text-muted-foreground">{benchmark.description}</div>
              </div>
              <div className="text-right space-y-1">
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-muted-foreground">You:</span>
                  <span className="font-bold">{benchmark.yourScore}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-muted-foreground">Avg:</span>
                  <span className="text-sm">{benchmark.average}</span>
                </div>
                <Badge 
                  variant={benchmark.yourScore >= benchmark.average ? "default" : "secondary"}
                  className="text-xs"
                >
                  {benchmark.yourScore >= benchmark.average ? 'Above' : 'Below'} Average
                </Badge>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center space-x-2">
            <Target className="h-5 w-5" />
            <span>Improvement Recommendations</span>
          </CardTitle>
          <CardDescription>
            Actionable insights to boost your sustainability score
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {recommendations.map((rec, index) => (
            <div key={index} className="p-3 border rounded-lg">
              <div className="flex items-start space-x-3">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold ${
                  rec.priority === 'high' ? 'bg-red-500' : 
                  rec.priority === 'medium' ? 'bg-yellow-500' : 'bg-blue-500'
                }`}>
                  {index + 1}
                </div>
                <div className="flex-1 space-y-1">
                  <div className="font-medium">{rec.title}</div>
                  <div className="text-sm text-muted-foreground">{rec.description}</div>
                  <div className="flex items-center space-x-2">
                    <Badge variant="outline" className="text-xs">
                      +{rec.potentialImprovement} points
                    </Badge>
                    <Badge 
                      variant={rec.priority === 'high' ? 'destructive' : rec.priority === 'medium' ? 'secondary' : 'outline'}
                      className="text-xs"
                    >
                      {rec.priority} priority
                    </Badge>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}

function calculateIndexComponents(data: any): IndexComponent[] {
  const economicScore = calculateEconomicScore(data)
  const socialScore = calculateSocialScore(data)
  const environmentalScore = calculateEnvironmentalScore(data)
  const governanceScore = calculateGovernanceScore(data)

  return [
    {
      name: 'Economic Impact',
      weight: 35,
      score: economicScore,
      trend: Math.random() * 10 - 2, // Mock trend
      status: economicScore >= 75 ? 'excellent' : economicScore >= 60 ? 'good' : economicScore >= 45 ? 'fair' : 'poor',
      description: 'Revenue generation, transaction efficiency, and economic value creation',
      icon: TrendingUp
    },
    {
      name: 'Social Impact',
      weight: 30,
      score: socialScore,
      trend: Math.random() * 8 - 1,
      status: socialScore >= 75 ? 'excellent' : socialScore >= 60 ? 'good' : socialScore >= 45 ? 'fair' : 'poor',
      description: 'Community satisfaction, user engagement, and social value',
      icon: CheckCircle
    },
    {
      name: 'Environmental Impact',
      weight: 25,
      score: environmentalScore,
      trend: Math.random() * 6 - 3,
      status: environmentalScore >= 75 ? 'excellent' : environmentalScore >= 60 ? 'good' : environmentalScore >= 45 ? 'fair' : 'poor',
      description: 'Energy efficiency, carbon footprint, and environmental sustainability',
      icon: Zap
    },
    {
      name: 'Governance & Transparency',
      weight: 10,
      score: governanceScore,
      trend: Math.random() * 4,
      status: governanceScore >= 75 ? 'excellent' : governanceScore >= 60 ? 'good' : governanceScore >= 45 ? 'fair' : 'poor',
      description: 'Data transparency, blockchain governance, and accountability',
      icon: Target
    }
  ]
}

function calculateEconomicScore(data: any): number {
  const volumeScore = Math.min(100, (data.onChain.totalVolume / 1000000) * 40)
  const bookingScore = Math.min(100, (data.offChain.totalBookings / 100) * 35)
  const efficiencyScore = Math.min(100, (data.onChain.uniqueAddresses / data.offChain.totalBookings) * 100)
  return (volumeScore + bookingScore + efficiencyScore) / 3
}

function calculateSocialScore(data: any): number {
  const ratingScore = (data.social.avgRating / 5) * 100
  const sentimentScore = (data.social.sentimentDistribution.positive / data.social.totalReviews) * 100
  const engagementScore = Math.min(100, (data.social.totalReviews / data.offChain.totalBookings) * 100)
  return (ratingScore + sentimentScore + engagementScore) / 3
}

function calculateEnvironmentalScore(data: any): number {
  const efficiencyScore = data.environmental.efficiencyScore
  const renewableScore = data.environmental.renewableEnergyPercent
  const carbonScore = Math.max(0, 100 - (data.environmental.co2Equivalent / 5000) * 100)
  return (efficiencyScore + renewableScore + carbonScore) / 3
}

function calculateGovernanceScore(data: any): number {
  // Mock governance score based on blockchain transparency
  const transparencyScore = 85 // High transparency due to blockchain
  const accountabilityScore = Math.min(100, (data.onChain.transactions.length / 100) * 50 + 40)
  const complianceScore = 80 // Assume good compliance
  return (transparencyScore + accountabilityScore + complianceScore) / 3
}

function generateRecommendations(components: IndexComponent[]) {
  const recommendations = []
  
  // Sort components by score to identify weakest areas
  const sortedComponents = components.sort((a, b) => a.score - b.score)
  
  sortedComponents.forEach((component, index) => {
    if (component.score < 70) {
      let title, description, potentialImprovement, priority
      
      switch (component.name) {
        case 'Economic Impact':
          title = 'Optimize Revenue Streams'
          description = 'Focus on increasing transaction volume and improving booking conversion rates'
          potentialImprovement = Math.ceil((70 - component.score) * 0.7)
          priority = component.score < 50 ? 'high' : 'medium'
          break
        case 'Social Impact':
          title = 'Enhance User Experience'
          description = 'Improve customer satisfaction through better service quality and engagement'
          potentialImprovement = Math.ceil((70 - component.score) * 0.6)
          priority = component.score < 45 ? 'high' : 'medium'
          break
        case 'Environmental Impact':
          title = 'Green Energy Transition'
          description = 'Increase renewable energy usage and optimize blockchain energy consumption'
          potentialImprovement = Math.ceil((70 - component.score) * 0.8)
          priority = component.score < 40 ? 'high' : 'medium'
          break
        case 'Governance & Transparency':
          title = 'Strengthen Governance'
          description = 'Improve data transparency and stakeholder engagement processes'
          potentialImprovement = Math.ceil((70 - component.score) * 0.5)
          priority = 'low'
          break
        default:
          title = 'General Improvement'
          description = 'Focus on improving this sustainability dimension'
          potentialImprovement = 5
          priority = 'low'
      }
      
      recommendations.push({
        title,
        description,
        potentialImprovement,
        priority
      })
    }
  })
  
  // Add general recommendations if score is good
  if (recommendations.length === 0) {
    recommendations.push({
      title: 'Maintain Excellence',
      description: 'Continue current practices while exploring innovative sustainability initiatives',
      potentialImprovement: 3,
      priority: 'low'
    })
  }
  
  return recommendations.slice(0, 3) // Limit to top 3 recommendations
}

function getBenchmarkComparisons(score: number) {
  return [
    {
      category: 'Tourism Industry',
      description: 'Sustainable tourism platforms',
      yourScore: score.toFixed(0),
      average: Math.max(45, score - Math.random() * 15).toFixed(0)
    },
    {
      category: 'Blockchain Projects',
      description: 'Web3 sustainability initiatives',
      yourScore: score.toFixed(0),
      average: Math.max(40, score - Math.random() * 20).toFixed(0)
    },
    {
      category: 'Global ESG Standards',
      description: 'International sustainability benchmarks',
      yourScore: score.toFixed(0),
      average: (65).toFixed(0)
    }
  ]
}