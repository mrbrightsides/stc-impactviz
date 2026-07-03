'use client'

import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Star, ThumbsUp, ThumbsDown, MessageCircle, Users, Heart, TrendingUp, MapPin, Clock } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts'

interface SocialDashboardProps {
  data: {
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
    offChain: {
      bookings: Array<{
        location: string
        timestamp: number
      }>
    }
  }
}

const SENTIMENT_COLORS = {
  positive: '#10b981',
  negative: '#ef4444', 
  neutral: '#6b7280'
}

const RATING_COLORS = ['#ef4444', '#f97316', '#eab308', '#84cc16', '#10b981']

export const SocialDashboard: React.FC<SocialDashboardProps> = ({ data }) => {
  const ratingDistribution = calculateRatingDistribution(data.social.reviews)
  const locationSentiment = calculateLocationSentiment(data.social.reviews)
  const timelineAnalysis = calculateTimelineAnalysis(data.social.reviews)
  const sentimentTrends = calculateSentimentTrends(data.social.reviews)
  const topReviews = getTopReviews(data.social.reviews)
  const engagementMetrics = calculateEngagementMetrics(data.social, data.offChain)

  return (
    <div className="space-y-6">
      {/* Key Social Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Rating</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <div className="text-2xl font-bold">{data.social.avgRating.toFixed(1)}</div>
              <div className="flex">
                {Array.from({ length: 5 }, (_, i) => (
                  <Star 
                    key={i} 
                    className={`h-4 w-4 ${i < Math.floor(data.social.avgRating) ? 'text-yellow-500 fill-current' : 'text-gray-300'}`} 
                  />
                ))}
              </div>
            </div>
            <p className="text-xs text-muted-foreground">
              From {data.social.totalReviews} reviews
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Positive Sentiment</CardTitle>
            <ThumbsUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {((data.social.sentimentDistribution.positive / data.social.totalReviews) * 100).toFixed(1)}%
            </div>
            <p className="text-xs text-muted-foreground">
              {data.social.sentimentDistribution.positive} positive reviews
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Engagement Rate</CardTitle>
            <MessageCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{engagementMetrics.engagementRate.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground">
              Reviews per booking
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Review Velocity</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{engagementMetrics.reviewsPerDay.toFixed(1)}</div>
            <p className="text-xs text-muted-foreground">
              Reviews per day
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Sentiment Analysis Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Heart className="h-5 w-5" />
              <span>Sentiment Distribution</span>
            </CardTitle>
            <CardDescription>
              Overall sentiment breakdown across all reviews
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={[
                    { name: 'Positive', value: data.social.sentimentDistribution.positive, color: SENTIMENT_COLORS.positive },
                    { name: 'Neutral', value: data.social.sentimentDistribution.neutral, color: SENTIMENT_COLORS.neutral },
                    { name: 'Negative', value: data.social.sentimentDistribution.negative, color: SENTIMENT_COLORS.negative },
                  ]}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {[SENTIMENT_COLORS.positive, SENTIMENT_COLORS.neutral, SENTIMENT_COLORS.negative].map((color, index) => (
                    <Cell key={`cell-${index}`} fill={color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Rating Distribution</CardTitle>
            <CardDescription>
              Breakdown of ratings from 1 to 5 stars
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={ratingDistribution}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="rating" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Location Sentiment Analysis */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <MapPin className="h-5 w-5" />
            <span>Location Sentiment Analysis</span>
          </CardTitle>
          <CardDescription>
            Sentiment breakdown by tourist destinations
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {locationSentiment.map((location) => (
              <div key={location.name} className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Badge variant="outline">{location.avgRating.toFixed(1)}</Badge>
                    <span className="font-medium">{location.name}</span>
                    <span className="text-sm text-muted-foreground">({location.totalReviews} reviews)</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="flex">
                      {Array.from({ length: 5 }, (_, i) => (
                        <Star 
                          key={i} 
                          className={`h-3 w-3 ${i < Math.floor(location.avgRating) ? 'text-yellow-500 fill-current' : 'text-gray-300'}`} 
                        />
                      ))}
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-green-600">Positive</span>
                      <span>{location.sentiment.positive}</span>
                    </div>
                    <Progress value={(location.sentiment.positive / location.totalReviews) * 100} className="h-1" />
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-500">Neutral</span>
                      <span>{location.sentiment.neutral}</span>
                    </div>
                    <Progress value={(location.sentiment.neutral / location.totalReviews) * 100} className="h-1" />
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-red-600">Negative</span>
                      <span>{location.sentiment.negative}</span>
                    </div>
                    <Progress value={(location.sentiment.negative / location.totalReviews) * 100} className="h-1" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Sentiment Trends Over Time */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Clock className="h-5 w-5" />
            <span>Sentiment Trends</span>
          </CardTitle>
          <CardDescription>
            Daily sentiment analysis over the past month
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={sentimentTrends}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="positive" stroke={SENTIMENT_COLORS.positive} strokeWidth={2} name="Positive" />
              <Line type="monotone" dataKey="neutral" stroke={SENTIMENT_COLORS.neutral} strokeWidth={2} name="Neutral" />
              <Line type="monotone" dataKey="negative" stroke={SENTIMENT_COLORS.negative} strokeWidth={2} name="Negative" />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Recent Reviews */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <MessageCircle className="h-5 w-5" />
            <span>Recent Reviews</span>
          </CardTitle>
          <CardDescription>
            Latest tourist feedback and comments
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {topReviews.slice(0, 5).map((review) => (
              <div key={review.id} className="flex space-x-4 p-4 border rounded-lg">
                <Avatar>
                  <AvatarFallback>
                    {review.id.charAt(review.id.length - 1)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="flex">
                        {Array.from({ length: 5 }, (_, i) => (
                          <Star 
                            key={i} 
                            className={`h-4 w-4 ${i < review.rating ? 'text-yellow-500 fill-current' : 'text-gray-300'}`} 
                          />
                        ))}
                      </div>
                      <Badge 
                        variant={review.sentiment === 'positive' ? 'default' : review.sentiment === 'negative' ? 'destructive' : 'secondary'}
                        className="text-xs"
                      >
                        {review.sentiment}
                      </Badge>
                    </div>
                    <div className="text-sm text-muted-foreground flex items-center space-x-2">
                      <MapPin className="h-3 w-3" />
                      <span>{review.location}</span>
                    </div>
                  </div>
                  <p className="text-sm">{review.comment}</p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(review.timestamp).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Social Impact Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Social Impact Summary</CardTitle>
          <CardDescription>
            Key social indicators and community engagement metrics
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-3">
              <h4 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground">Community Satisfaction</h4>
              <div className="text-2xl font-bold">{(data.social.avgRating / 5 * 100).toFixed(0)}%</div>
              <p className="text-xs text-muted-foreground">Overall satisfaction score</p>
            </div>
            
            <div className="space-y-3">
              <h4 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground">Positive Impact</h4>
              <div className="text-2xl font-bold">{((data.social.sentimentDistribution.positive / data.social.totalReviews) * 100).toFixed(0)}%</div>
              <p className="text-xs text-muted-foreground">Positive sentiment ratio</p>
            </div>
            
            <div className="space-y-3">
              <h4 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground">Engagement Quality</h4>
              <div className="text-2xl font-bold">{((data.social.reviews.filter(r => r.comment.length > 50).length / data.social.totalReviews) * 100).toFixed(0)}%</div>
              <p className="text-xs text-muted-foreground">Detailed feedback rate</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function calculateRatingDistribution(reviews: any[]) {
  const distribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
  reviews.forEach(review => {
    distribution[review.rating as keyof typeof distribution]++
  })
  
  return Object.entries(distribution).map(([rating, count]) => ({
    rating: `${rating} Star${parseInt(rating) !== 1 ? 's' : ''}`,
    count
  }))
}

function calculateLocationSentiment(reviews: any[]) {
  const locationData = new Map<string, any>()
  
  reviews.forEach(review => {
    if (!locationData.has(review.location)) {
      locationData.set(review.location, {
        name: review.location,
        totalReviews: 0,
        totalRating: 0,
        sentiment: { positive: 0, neutral: 0, negative: 0 }
      })
    }
    
    const data = locationData.get(review.location)!
    data.totalReviews++
    data.totalRating += review.rating
    data.sentiment[review.sentiment]++
  })
  
  return Array.from(locationData.values())
    .map(data => ({
      ...data,
      avgRating: data.totalRating / data.totalReviews
    }))
    .sort((a, b) => b.avgRating - a.avgRating)
}

function calculateTimelineAnalysis(reviews: any[]) {
  const dailyData = new Map<string, any>()
  
  reviews.forEach(review => {
    const date = new Date(review.timestamp).toISOString().split('T')[0]
    if (!dailyData.has(date)) {
      dailyData.set(date, {
        date,
        totalReviews: 0,
        totalRating: 0,
        sentiment: { positive: 0, neutral: 0, negative: 0 }
      })
    }
    
    const data = dailyData.get(date)!
    data.totalReviews++
    data.totalRating += review.rating
    data.sentiment[review.sentiment]++
  })
  
  return Array.from(dailyData.values())
    .map(data => ({
      ...data,
      avgRating: data.totalRating / data.totalReviews
    }))
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
}

function calculateSentimentTrends(reviews: any[]) {
  const dailyData = new Map<string, any>()
  
  reviews.forEach(review => {
    const date = new Date(review.timestamp).toISOString().split('T')[0]
    if (!dailyData.has(date)) {
      dailyData.set(date, { date, positive: 0, neutral: 0, negative: 0 })
    }
    dailyData.get(date)![review.sentiment]++
  })
  
  return Array.from(dailyData.values())
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(-14) // Last 14 days
}

function getTopReviews(reviews: any[]) {
  return reviews
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, 10)
}

function calculateEngagementMetrics(socialData: any, offChainData: any) {
  const totalBookings = offChainData.bookings.length
  const totalReviews = socialData.totalReviews
  const engagementRate = (totalReviews / totalBookings) * 100
  
  // Calculate reviews per day over the last 30 days
  const thirtyDaysAgo = Date.now() - (30 * 24 * 60 * 60 * 1000)
  const recentReviews = socialData.reviews.filter((r: any) => r.timestamp > thirtyDaysAgo)
  const reviewsPerDay = recentReviews.length / 30
  
  return {
    engagementRate,
    reviewsPerDay
  }
}