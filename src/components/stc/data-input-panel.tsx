'use client'

import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Upload, Database, MessageSquare, Zap, FileText, TrendingUp } from 'lucide-react'
import { Progress } from '@/components/ui/progress'
import { toast } from 'sonner'

const onChainSchema = z.object({
  transactionData: z.string().min(10, 'Please provide transaction data'),
  contractAddress: z.string().min(10, 'Please provide contract address'),
  startBlock: z.string().optional(),
  endBlock: z.string().optional(),
})

const offChainSchema = z.object({
  bookingData: z.string().min(10, 'Please provide booking data'),
  locationData: z.string().optional(),
  costAnalysis: z.string().optional(),
})

const socialSchema = z.object({
  reviewData: z.string().min(5, 'Please provide review data'),
  sentimentData: z.string().optional(),
  ratingData: z.string().optional(),
})

interface DataInputPanelProps {
  onDataUpdate: (data: any) => void
}

export const DataInputPanel: React.FC<DataInputPanelProps> = ({ onDataUpdate }) => {
  const [activeTab, setActiveTab] = useState('onchain')
  const [progress, setProgress] = useState(0)
  const [processing, setProcessing] = useState(false)

  const onChainForm = useForm<z.infer<typeof onChainSchema>>({
    resolver: zodResolver(onChainSchema),
    defaultValues: {
      transactionData: '',
      contractAddress: '',
      startBlock: '',
      endBlock: '',
    },
  })

  const offChainForm = useForm<z.infer<typeof offChainSchema>>({
    resolver: zodResolver(offChainSchema),
    defaultValues: {
      bookingData: '',
      locationData: '',
      costAnalysis: '',
    },
  })

  const socialForm = useForm<z.infer<typeof socialSchema>>({
    resolver: zodResolver(socialSchema),
    defaultValues: {
      reviewData: '',
      sentimentData: '',
      ratingData: '',
    },
  })

  const processData = async (formData: any, type: string) => {
    setProcessing(true)
    setProgress(0)

    try {
      // Simulate data processing with progress updates
      const progressSteps = [10, 25, 50, 75, 90, 100]
      for (const step of progressSteps) {
        await new Promise(resolve => setTimeout(resolve, 300))
        setProgress(step)
      }

      // Generate mock processed data based on input type
      let processedData
      
      if (type === 'onchain') {
        processedData = generateMockOnChainData(formData)
      } else if (type === 'offchain') {
        processedData = generateMockOffChainData(formData)
      } else {
        processedData = generateMockSocialData(formData)
      }

      // Combine all data and send to parent
      const combinedData = {
        onChain: type === 'onchain' ? processedData : generateMockOnChainData({}),
        offChain: type === 'offchain' ? processedData : generateMockOffChainData({}),
        social: type === 'social' ? processedData : generateMockSocialData({}),
        environmental: generateMockEnvironmentalData(),
      }

      onDataUpdate(combinedData)
      toast.success(`${type} data processed successfully!`)
    } catch (error) {
      toast.error('Failed to process data')
    } finally {
      setProcessing(false)
      setProgress(0)
    }
  }

  const onSubmitOnChain = (values: z.infer<typeof onChainSchema>) => {
    processData(values, 'onchain')
  }

  const onSubmitOffChain = (values: z.infer<typeof offChainSchema>) => {
    processData(values, 'offchain')
  }

  const onSubmitSocial = (values: z.infer<typeof socialSchema>) => {
    processData(values, 'social')
  }

  const loadDemoData = () => {
    const demoData = {
      onChain: generateMockOnChainData({}),
      offChain: generateMockOffChainData({}),
      social: generateMockSocialData({}),
      environmental: generateMockEnvironmentalData(),
    }
    onDataUpdate(demoData)
    toast.success('Demo data loaded successfully!')
  }

  return (
    <div className="space-y-6">
      <div className="text-center space-y-4">
        <div className="flex justify-center space-x-2">
          <Button onClick={loadDemoData} variant="outline" className="flex items-center space-x-2">
            <TrendingUp className="h-4 w-4" />
            <span>Load Demo Data</span>
          </Button>
        </div>
        <div className="text-sm text-slate-500 dark:text-slate-400">
          Or manually input your data using the forms below
        </div>
      </div>

      {processing && (
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>Processing data...</span>
                <span>{progress}%</span>
              </div>
              <Progress value={progress} className="w-full" />
            </div>
          </CardContent>
        </Card>
      )}

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="onchain" className="flex items-center space-x-2">
            <Database className="h-4 w-4" />
            <span>On-Chain</span>
          </TabsTrigger>
          <TabsTrigger value="offchain" className="flex items-center space-x-2">
            <FileText className="h-4 w-4" />
            <span>Off-Chain</span>
          </TabsTrigger>
          <TabsTrigger value="social" className="flex items-center space-x-2">
            <MessageSquare className="h-4 w-4" />
            <span>Social</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="onchain">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Database className="h-5 w-5" />
                <span>On-Chain Data Input</span>
              </CardTitle>
              <CardDescription>
                Input SmartTourismChain transaction data including hashes, gas fees, and token movements
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...onChainForm}>
                <form onSubmit={onChainForm.handleSubmit(onSubmitOnChain)} className="space-y-6">
                  <FormField
                    control={onChainForm.control}
                    name="transactionData"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Transaction Data</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Paste transaction hashes, one per line or JSON format&#10;0x1234...&#10;0x5678...&#10;&#10;Or JSON: { &quot;transactions&quot;: [...] }"
                            {...field}
                            rows={6}
                          />
                        </FormControl>
                        <FormDescription>
                          Transaction hashes from SmartTourismChain or raw JSON data
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={onChainForm.control}
                      name="contractAddress"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Contract Address</FormLabel>
                          <FormControl>
                            <Input placeholder="0x..." {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <div className="grid grid-cols-2 gap-2">
                      <FormField
                        control={onChainForm.control}
                        name="startBlock"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Start Block</FormLabel>
                            <FormControl>
                              <Input placeholder="Block #" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={onChainForm.control}
                        name="endBlock"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>End Block</FormLabel>
                            <FormControl>
                              <Input placeholder="Block #" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>

                  <Button type="submit" className="w-full" disabled={processing}>
                    <Upload className="mr-2 h-4 w-4" />
                    Process On-Chain Data
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="offchain">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <FileText className="h-5 w-5" />
                <span>Off-Chain Data Input</span>
              </CardTitle>
              <CardDescription>
                Input tourism booking data, locations, and cost analysis
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...offChainForm}>
                <form onSubmit={offChainForm.handleSubmit(onSubmitOffChain)} className="space-y-6">
                  <FormField
                    control={offChainForm.control}
                    name="bookingData"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Booking Data</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Booking information in CSV or JSON format&#10;booking_id,location,cost,duration,date&#10;B001,Bali,500,3,2024-01-15&#10;B002,Jakarta,300,2,2024-01-16"
                            {...field}
                            rows={6}
                          />
                        </FormControl>
                        <FormDescription>
                          Booking records with locations, costs, and durations
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={offChainForm.control}
                    name="locationData"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Location Data (Optional)</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Additional location metadata&#10;{ &quot;Bali&quot;: { &quot;category&quot;: &quot;Beach Resort&quot;, &quot;capacity&quot;: 100 } }"
                            {...field}
                            rows={4}
                          />
                        </FormControl>
                        <FormDescription>
                          Location categories, capacities, and metadata
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={offChainForm.control}
                    name="costAnalysis"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Cost Analysis (Optional)</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Cost breakdown and analysis data"
                            {...field}
                            rows={3}
                          />
                        </FormControl>
                        <FormDescription>
                          Detailed cost breakdown and spending patterns
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button type="submit" className="w-full" disabled={processing}>
                    <Upload className="mr-2 h-4 w-4" />
                    Process Off-Chain Data
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="social">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <MessageSquare className="h-5 w-5" />
                <span>Social Feedback Data</span>
              </CardTitle>
              <CardDescription>
                Input tourist reviews, ratings, and sentiment data
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...socialForm}>
                <form onSubmit={socialForm.handleSubmit(onSubmitSocial)} className="space-y-6">
                  <FormField
                    control={socialForm.control}
                    name="reviewData"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Review Data</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Tourist reviews in CSV or JSON format&#10;review_id,rating,location,comment,date&#10;R001,5,Bali,Amazing experience!,2024-01-15&#10;R002,4,Jakarta,Good service,2024-01-16"
                            {...field}
                            rows={6}
                          />
                        </FormControl>
                        <FormDescription>
                          Tourist reviews with ratings and comments
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={socialForm.control}
                    name="sentimentData"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Sentiment Analysis (Optional)</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Pre-processed sentiment scores&#10;{ &quot;R001&quot;: { &quot;sentiment&quot;: &quot;positive&quot;, &quot;score&quot;: 0.8 } }"
                            {...field}
                            rows={4}
                          />
                        </FormControl>
                        <FormDescription>
                          Pre-analyzed sentiment scores and classifications
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={socialForm.control}
                    name="ratingData"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Additional Rating Data (Optional)</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Additional rating metrics and breakdowns"
                            {...field}
                            rows={3}
                          />
                        </FormControl>
                        <FormDescription>
                          Detailed rating breakdowns and metrics
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button type="submit" className="w-full" disabled={processing}>
                    <Upload className="mr-2 h-4 w-4" />
                    Process Social Data
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

// Mock data generators for demonstration
function generateMockOnChainData(inputData: any) {
  const transactions = Array.from({ length: 50 }, (_, i) => ({
    hash: `0x${Math.random().toString(16).substr(2, 40)}`,
    gasUsed: Math.floor(Math.random() * 100000) + 21000,
    tokenAmount: Math.floor(Math.random() * 1000) + 100,
    timestamp: Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000,
    blockNumber: 18000000 + i,
  }))

  return {
    transactions,
    totalVolume: transactions.reduce((sum, tx) => sum + tx.tokenAmount, 0),
    avgGasFee: transactions.reduce((sum, tx) => sum + tx.gasUsed, 0) / transactions.length,
    uniqueAddresses: Math.floor(Math.random() * 30) + 20,
  }
}

function generateMockOffChainData(inputData: any) {
  const locations = ['Bali', 'Jakarta', 'Yogyakarta', 'Bandung', 'Surabaya', 'Lombok']
  const categories = ['Beach Resort', 'City Hotel', 'Cultural Site', 'Adventure Tour', 'Culinary Experience']
  
  const bookings = Array.from({ length: 75 }, (_, i) => ({
    id: `B${String(i + 1).padStart(3, '0')}`,
    location: locations[Math.floor(Math.random() * locations.length)],
    duration: Math.floor(Math.random() * 7) + 1,
    cost: Math.floor(Math.random() * 500) + 100,
    timestamp: Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000,
    category: categories[Math.floor(Math.random() * categories.length)],
  }))

  const popularLocations = locations.map(name => ({
    name,
    count: bookings.filter(b => b.location === name).length,
  })).sort((a, b) => b.count - a.count)

  return {
    bookings,
    totalBookings: bookings.length,
    avgSpending: bookings.reduce((sum, b) => sum + b.cost, 0) / bookings.length,
    popularLocations,
  }
}

function generateMockSocialData(inputData: any) {
  const sentiments: Array<'positive' | 'negative' | 'neutral'> = ['positive', 'negative', 'neutral']
  const locations = ['Bali', 'Jakarta', 'Yogyakarta', 'Bandung', 'Surabaya', 'Lombok']
  const comments = [
    'Amazing experience!',
    'Great service and beautiful location',
    'Could be better',
    'Outstanding value for money',
    'Memorable trip',
    'Room for improvement',
    'Exceeded expectations',
    'Average experience',
  ]

  const reviews = Array.from({ length: 120 }, (_, i) => ({
    id: `R${String(i + 1).padStart(3, '0')}`,
    rating: Math.floor(Math.random() * 5) + 1,
    sentiment: sentiments[Math.floor(Math.random() * sentiments.length)],
    timestamp: Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000,
    location: locations[Math.floor(Math.random() * locations.length)],
    comment: comments[Math.floor(Math.random() * comments.length)],
  }))

  const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
  
  const sentimentDistribution = {
    positive: reviews.filter(r => r.sentiment === 'positive').length,
    negative: reviews.filter(r => r.sentiment === 'negative').length,
    neutral: reviews.filter(r => r.sentiment === 'neutral').length,
  }

  return {
    reviews,
    avgRating,
    totalReviews: reviews.length,
    sentimentDistribution,
  }
}

function generateMockEnvironmentalData() {
  return {
    totalEnergyConsumption: Math.floor(Math.random() * 10000) + 5000, // kWh
    co2Equivalent: Math.floor(Math.random() * 5000) + 2000, // kg CO2
    efficiencyScore: Math.floor(Math.random() * 40) + 60, // 60-100
    renewableEnergyPercent: Math.floor(Math.random() * 50) + 30, // 30-80%
  }
}