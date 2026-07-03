'use client'

import React, { useEffect, useRef, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { RotateCcw, Maximize2, BarChart3, Info, Zap, Minimize2, HelpCircle } from 'lucide-react'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import * as THREE from 'three'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { OrbitControls, Text, Sphere, Html } from '@react-three/drei'

interface TripleBottomLineChartProps {
  data: {
    onChain: {
      totalVolume: number
      uniqueAddresses: number
      transactions: any[]
    }
    offChain: {
      totalBookings: number
      avgSpending: number
      popularLocations: any[]
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

interface DataPoint {
  id: string
  name: string
  economic: number
  social: number
  environmental: number
  size: number
  color: string
  category: string
}

const CATEGORY_COLORS = {
  'Transaction': '#3b82f6',
  'Location': '#10b981',
  'Review': '#f59e0b',
  'Energy': '#8b5cf6',
  'Overall': '#ef4444'
}

// Custom 3D Bubble component
function Bubble({ position, size, color, label, data, onClick }: any) {
  const meshRef = useRef<THREE.Mesh>(null)
  const [hovered, setHovered] = useState(false)
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += 0.005
      meshRef.current.rotation.y += 0.005
      if (hovered) {
        meshRef.current.scale.setScalar(1.1 + Math.sin(state.clock.elapsedTime * 3) * 0.05)
      } else {
        meshRef.current.scale.setScalar(1)
      }
    }
  })

  return (
    <group position={position}>
      <Sphere
        ref={meshRef}
        args={[size, 16, 16]}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        onClick={onClick}
      >
        <meshPhongMaterial color={color} transparent opacity={hovered ? 0.9 : 0.7} />
      </Sphere>
      {hovered && (
        <Html distanceFactor={4}>
          <div className="bg-black/95 text-white p-4 rounded-lg text-base whitespace-nowrap pointer-events-none shadow-2xl border border-gray-500 min-w-[200px]">
            <div className="font-bold text-xl mb-3 text-center text-yellow-400">{label}</div>
            <div className="space-y-2 text-base">
              <div className="flex justify-between gap-4">
                <span className="text-blue-300 font-semibold">Economic:</span>
                <span className="font-bold text-blue-200">{data.economic.toFixed(1)}</span>
              </div>
              <div className="flex justify-between gap-4">
                <span className="text-green-300 font-semibold">Social:</span>
                <span className="font-bold text-green-200">{data.social.toFixed(1)}</span>
              </div>
              <div className="flex justify-between gap-4">
                <span className="text-purple-300 font-semibold">Environmental:</span>
                <span className="font-bold text-purple-200">{data.environmental.toFixed(1)}</span>
              </div>
            </div>
            <div className="text-sm text-gray-300 mt-3 pt-2 border-t border-gray-600 text-center font-medium">
              🖱️ Click for detailed analysis
            </div>
          </div>
        </Html>
      )}
    </group>
  )
}

// Axis lines and labels
function AxisLines() {
  return (
    <group>
      {/* X-axis (Economic) */}
      <line>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={2}
            array={new Float32Array([-50, 0, 0, 50, 0, 0])}
            itemSize={3}
          />
        </bufferGeometry>
        <lineBasicMaterial color="#3b82f6" />
      </line>
      <Text
        position={[52, -2, 0]}
        fontSize={3}
        color="#3b82f6"
        anchorX="left"
        anchorY="middle"
      >
        Economic →
      </Text>

      {/* Y-axis (Social) */}
      <line>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={2}
            array={new Float32Array([0, -50, 0, 0, 50, 0])}
            itemSize={3}
          />
        </bufferGeometry>
        <lineBasicMaterial color="#10b981" />
      </line>
      <Text
        position={[2, 52, 0]}
        fontSize={3}
        color="#10b981"
        anchorX="left"
        anchorY="middle"
      >
        Social →
      </Text>

      {/* Z-axis (Environmental) */}
      <line>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={2}
            array={new Float32Array([0, 0, -50, 0, 0, 50])}
            itemSize={3}
          />
        </bufferGeometry>
        <lineBasicMaterial color="#8b5cf6" />
      </line>
      <Text
        position={[0, -2, 52]}
        fontSize={3}
        color="#8b5cf6"
        anchorX="center"
        anchorY="middle"
      >
        Environmental →
      </Text>
    </group>
  )
}

// Main 3D Scene
function ThreeScene({ dataPoints, onBubbleClick }: { dataPoints: DataPoint[], onBubbleClick: (point: DataPoint) => void }) {
  return (
    <>
      <ambientLight intensity={0.4} />
      <pointLight position={[10, 10, 10]} />
      <pointLight position={[-10, -10, -10]} />
      
      <AxisLines />
      
      {dataPoints.map((point, index) => (
        <Bubble
          key={point.id}
          position={[
            (point.economic - 50) * 0.8,
            (point.social - 50) * 0.8, 
            (point.environmental - 50) * 0.8
          ]}
          size={point.size}
          color={point.color}
          label={point.name}
          data={point}
          onClick={() => onBubbleClick(point)}
        />
      ))}
      
      <OrbitControls 
        enablePan={true} 
        enableZoom={true} 
        enableRotate={true}
        maxDistance={150}
        minDistance={30}
      />
    </>
  )
}

export const TripleBottomLineChart: React.FC<TripleBottomLineChartProps> = ({ data }) => {
  const [selectedPoint, setSelectedPoint] = useState<DataPoint | null>(null)
  const [dataPoints, setDataPoints] = useState<DataPoint[]>([])
  const [view, setView] = useState<'3d' | '2d'>('3d')
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [showMethodology, setShowMethodology] = useState(false)

  useEffect(() => {
    const points = generateDataPoints(data)
    setDataPoints(points)
  }, [data])

  const handleBubbleClick = (point: DataPoint) => {
    setSelectedPoint(point)
  }

  const resetView = React.useCallback(() => {
    console.log('Triple bottom line chart reset clicked')
    try {
      setSelectedPoint(null)
      console.log('Chart view reset completed')
    } catch (error) {
      console.error('Chart reset failed:', error)
    }
  }, [])

  // Calculate overall sustainability score
  const overallScore = calculateOverallSustainabilityScore(dataPoints)
  const sustainabilityLevel = getSustainabilityLevel(overallScore)

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen)
  }

  if (isFullscreen) {
    return (
      <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
        <Card className="w-full h-full max-w-7xl max-h-[95vh] bg-white dark:bg-gray-900">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center space-x-2">
                  <BarChart3 className="h-5 w-5" />
                  <span>Triple Bottom Line Analysis - Fullscreen</span>
                </CardTitle>
                <CardDescription>
                  Interactive 3D visualization of Economic, Social & Environmental impact
                </CardDescription>
              </div>
              <div className="flex items-center space-x-2">
                <Dialog open={showMethodology} onOpenChange={setShowMethodology}>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm">
                      <HelpCircle className="h-4 w-4" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle className="flex items-center gap-2">
                        <BarChart3 className="h-5 w-5" />
                        Triple Bottom Line Methodology
                      </DialogTitle>
                      <DialogDescription>
                        Understanding how we calculate the sustainability impact across three dimensions
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-6 pt-4">
                      <div>
                        <h4 className="font-semibold text-blue-600 mb-2 flex items-center gap-2">
                          💰 Economic Dimension
                        </h4>
                        <p className="text-sm text-muted-foreground mb-2">
                          Measures financial performance and economic value creation from SmartTourismChain transactions.
                        </p>
                        <ul className="text-sm space-y-1 ml-4">
                          <li>• <strong>Revenue Score:</strong> Transaction volume impact (30% weight)</li>
                          <li>• <strong>Booking Efficiency:</strong> Bookings per transaction ratio (40% weight)</li>
                          <li>• <strong>Address Utilization:</strong> Unique addresses to bookings ratio (30% weight)</li>
                        </ul>
                      </div>
                      
                      <div>
                        <h4 className="font-semibold text-green-600 mb-2 flex items-center gap-2">
                          👥 Social Dimension
                        </h4>
                        <p className="text-sm text-muted-foreground mb-2">
                          Evaluates community satisfaction and social value generated by tourism activities.
                        </p>
                        <ul className="text-sm space-y-1 ml-4">
                          <li>• <strong>Rating Score:</strong> Average tourist ratings (0-5 scale, 50% weight)</li>
                          <li>• <strong>Sentiment Analysis:</strong> Positive review percentage (50% weight)</li>
                          <li>• <strong>Community Engagement:</strong> Local participation metrics</li>
                        </ul>
                      </div>
                      
                      <div>
                        <h4 className="font-semibold text-purple-600 mb-2 flex items-center gap-2">
                          🌱 Environmental Dimension
                        </h4>
                        <p className="text-sm text-muted-foreground mb-2">
                          Tracks ecological impact and resource efficiency of blockchain tourism operations.
                        </p>
                        <ul className="text-sm space-y-1 ml-4">
                          <li>• <strong>Energy Efficiency:</strong> Gas optimization and processing efficiency (33% weight)</li>
                          <li>• <strong>Renewable Energy:</strong> Clean energy usage percentage (33% weight)</li>
                          <li>• <strong>Carbon Footprint:</strong> CO₂ equivalent emissions per transaction (33% weight)</li>
                        </ul>
                      </div>
                      
                      <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950 dark:to-purple-950 p-4 rounded-lg">
                        <h4 className="font-semibold mb-2 flex items-center gap-2">
                          <Zap className="h-4 w-4" />
                          STC Sustainability Index
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          Our composite index averages all three dimensions to provide a holistic sustainability score (0-100). 
                          Scores above 80 indicate excellent performance, while scores below 50 require urgent attention.
                        </p>
                      </div>
                      
                      <div className="text-xs text-muted-foreground border-t pt-4">
                        <p><strong>Data Sources:</strong> On-chain transaction data, booking systems, user reviews, energy consumption metrics</p>
                        <p><strong>Update Frequency:</strong> Real-time for transactions, daily for social metrics, weekly for environmental data</p>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
                
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button 
                        onClick={() => {
                          console.log('Chart reset button clicked - native')
                          resetView()
                        }}
                        className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 px-3 cursor-pointer"
                        type="button"
                      >
                        <RotateCcw className="h-4 w-4" />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Reset view and clear selection</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="outline" size="sm" onClick={toggleFullscreen}>
                        <Minimize2 className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Exit fullscreen mode</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </div>
          </CardHeader>
          <CardContent className="h-[calc(100vh-12rem)] p-0">
            <div className="flex h-full">
              {/* 3D Visualization */}
              <div className="flex-1 relative">
                <Canvas camera={{ position: [60, 60, 60], fov: 75 }}>
                  <ThreeScene dataPoints={dataPoints} onBubbleClick={handleBubbleClick} />
                </Canvas>
                
                {/* Overall Score Overlay */}
                <div className="absolute top-4 left-4 space-y-2">
                  <Badge 
                    variant={sustainabilityLevel.variant as any}
                    className="text-sm font-bold"
                  >
                    <Zap className="h-3 w-3 mr-1" />
                    STC Index: {overallScore.toFixed(0)}/100
                  </Badge>
                  <div className="text-xs text-muted-foreground bg-white/80 dark:bg-black/80 p-2 rounded">
                    {sustainabilityLevel.description}
                  </div>
                </div>

                {/* Legend */}
                <div className="absolute bottom-4 left-4 bg-white/90 dark:bg-black/90 p-3 rounded-lg space-y-2">
                  <div className="text-xs font-medium">Categories</div>
                  {Object.entries(CATEGORY_COLORS).map(([category, color]) => (
                    <div key={category} className="flex items-center space-x-2 text-xs">
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: color }}
                      />
                      <span>{category}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Details Panel */}
              {selectedPoint && (
                <div className="w-80 bg-slate-50 dark:bg-slate-900 p-4 border-l overflow-y-auto">
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-bold text-lg flex items-center space-x-2">
                        <div 
                          className="w-4 h-4 rounded-full"
                          style={{ backgroundColor: selectedPoint.color }}
                        />
                        <span>{selectedPoint.name}</span>
                      </h3>
                      <p className="text-sm text-muted-foreground">{selectedPoint.category}</p>
                    </div>

                    <Separator />

                    <div className="space-y-3">
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm font-medium text-blue-600">Economic Impact</span>
                          <span className="text-sm font-bold">{selectedPoint.economic.toFixed(1)}/100</span>
                        </div>
                        <div className="w-full bg-blue-200 dark:bg-blue-900 rounded-full h-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full" 
                            style={{ width: `${selectedPoint.economic}%` }}
                          />
                        </div>
                      </div>

                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm font-medium text-green-600">Social Impact</span>
                          <span className="text-sm font-bold">{selectedPoint.social.toFixed(1)}/100</span>
                        </div>
                        <div className="w-full bg-green-200 dark:bg-green-900 rounded-full h-2">
                          <div 
                            className="bg-green-600 h-2 rounded-full" 
                            style={{ width: `${selectedPoint.social}%` }}
                          />
                        </div>
                      </div>

                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm font-medium text-purple-600">Environmental Impact</span>
                          <span className="text-sm font-bold">{selectedPoint.environmental.toFixed(1)}/100</span>
                        </div>
                        <div className="w-full bg-purple-200 dark:bg-purple-900 rounded-full h-2">
                          <div 
                            className="bg-purple-600 h-2 rounded-full" 
                            style={{ width: `${selectedPoint.environmental}%` }}
                          />
                        </div>
                      </div>
                    </div>

                    <Separator />

                    <div className="space-y-2">
                      <h4 className="font-medium">Sustainability Score</h4>
                      <div className="text-2xl font-bold text-center p-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg">
                        {((selectedPoint.economic + selectedPoint.social + selectedPoint.environmental) / 3).toFixed(0)}/100
                      </div>
                    </div>

                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => setSelectedPoint(null)}
                      className="w-full"
                    >
                      Close Details
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <Card className="h-[600px]">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center space-x-2">
              <BarChart3 className="h-5 w-5" />
              <span>Triple Bottom Line Analysis</span>
            </CardTitle>
            <CardDescription>
              Interactive 3D visualization of Economic, Social & Environmental impact
            </CardDescription>
          </div>
          <div className="flex items-center space-x-2">
            <Dialog open={showMethodology} onOpenChange={setShowMethodology}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                  <HelpCircle className="h-4 w-4" />
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    Triple Bottom Line Methodology
                  </DialogTitle>
                  <DialogDescription>
                    Understanding how we calculate the sustainability impact across three dimensions
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-6 pt-4">
                  <div>
                    <h4 className="font-semibold text-blue-600 mb-2 flex items-center gap-2">
                      💰 Economic Dimension
                    </h4>
                    <p className="text-sm text-muted-foreground mb-2">
                      Measures financial performance and economic value creation from SmartTourismChain transactions.
                    </p>
                    <ul className="text-sm space-y-1 ml-4">
                      <li>• <strong>Revenue Score:</strong> Transaction volume impact (30% weight)</li>
                      <li>• <strong>Booking Efficiency:</strong> Bookings per transaction ratio (40% weight)</li>
                      <li>• <strong>Address Utilization:</strong> Unique addresses to bookings ratio (30% weight)</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-green-600 mb-2 flex items-center gap-2">
                      👥 Social Dimension
                    </h4>
                    <p className="text-sm text-muted-foreground mb-2">
                      Evaluates community satisfaction and social value generated by tourism activities.
                    </p>
                    <ul className="text-sm space-y-1 ml-4">
                      <li>• <strong>Rating Score:</strong> Average tourist ratings (0-5 scale, 50% weight)</li>
                      <li>• <strong>Sentiment Analysis:</strong> Positive review percentage (50% weight)</li>
                      <li>• <strong>Community Engagement:</strong> Local participation metrics</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-purple-600 mb-2 flex items-center gap-2">
                      🌱 Environmental Dimension
                    </h4>
                    <p className="text-sm text-muted-foreground mb-2">
                      Tracks ecological impact and resource efficiency of blockchain tourism operations.
                    </p>
                    <ul className="text-sm space-y-1 ml-4">
                      <li>• <strong>Energy Efficiency:</strong> Gas optimization and processing efficiency (33% weight)</li>
                      <li>• <strong>Renewable Energy:</strong> Clean energy usage percentage (33% weight)</li>
                      <li>• <strong>Carbon Footprint:</strong> CO₂ equivalent emissions per transaction (33% weight)</li>
                    </ul>
                  </div>
                  
                  <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950 dark:to-purple-950 p-4 rounded-lg">
                    <h4 className="font-semibold mb-2 flex items-center gap-2">
                      <Zap className="h-4 w-4" />
                      STC Sustainability Index
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      Our composite index averages all three dimensions to provide a holistic sustainability score (0-100). 
                      Scores above 80 indicate excellent performance, while scores below 50 require urgent attention.
                    </p>
                  </div>
                  
                  <div className="text-xs text-muted-foreground border-t pt-4">
                    <p><strong>Data Sources:</strong> On-chain transaction data, booking systems, user reviews, energy consumption metrics</p>
                    <p><strong>Update Frequency:</strong> Real-time for transactions, daily for social metrics, weekly for environmental data</p>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
            
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button 
                    onClick={() => {
                      console.log('Chart reset button clicked - native (normal view)')
                      resetView()
                    }}
                    className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 px-3 cursor-pointer"
                    type="button"
                  >
                    <RotateCcw className="h-4 w-4" />
                  </button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Reset view and clear selection</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" size="sm" onClick={toggleFullscreen}>
                    {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen mode'}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
      </CardHeader>
      <CardContent className="h-[500px] p-0">
        <div className="flex h-full">
          {/* 3D Visualization */}
          <div className="flex-1 relative">
            <Canvas camera={{ position: [60, 60, 60], fov: 75 }}>
              <ThreeScene dataPoints={dataPoints} onBubbleClick={handleBubbleClick} />
            </Canvas>
            
            {/* Overall Score Overlay */}
            <div className="absolute top-4 left-4 space-y-2">
              <Badge 
                variant={sustainabilityLevel.variant as any}
                className="text-sm font-bold"
              >
                <Zap className="h-3 w-3 mr-1" />
                STC Index: {overallScore.toFixed(0)}/100
              </Badge>
              <div className="text-xs text-muted-foreground bg-white/80 dark:bg-black/80 p-2 rounded">
                {sustainabilityLevel.description}
              </div>
            </div>

            {/* Legend */}
            <div className="absolute bottom-4 left-4 bg-white/90 dark:bg-black/90 p-3 rounded-lg space-y-2">
              <div className="text-xs font-medium">Categories</div>
              {Object.entries(CATEGORY_COLORS).map(([category, color]) => (
                <div key={category} className="flex items-center space-x-2 text-xs">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: color }}
                  />
                  <span>{category}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Details Panel */}
          {selectedPoint && (
            <div className="w-80 bg-slate-50 dark:bg-slate-900 p-4 border-l overflow-y-auto">
              <div className="space-y-4">
                <div>
                  <h3 className="font-bold text-lg flex items-center space-x-2">
                    <div 
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: selectedPoint.color }}
                    />
                    <span>{selectedPoint.name}</span>
                  </h3>
                  <p className="text-sm text-muted-foreground">{selectedPoint.category}</p>
                </div>

                <Separator />

                <div className="space-y-3">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-blue-600">Economic Impact</span>
                      <span className="text-sm font-bold">{selectedPoint.economic.toFixed(1)}/100</span>
                    </div>
                    <div className="w-full bg-blue-200 dark:bg-blue-900 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full" 
                        style={{ width: `${selectedPoint.economic}%` }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-green-600">Social Impact</span>
                      <span className="text-sm font-bold">{selectedPoint.social.toFixed(1)}/100</span>
                    </div>
                    <div className="w-full bg-green-200 dark:bg-green-900 rounded-full h-2">
                      <div 
                        className="bg-green-600 h-2 rounded-full" 
                        style={{ width: `${selectedPoint.social}%` }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-purple-600">Environmental Impact</span>
                      <span className="text-sm font-bold">{selectedPoint.environmental.toFixed(1)}/100</span>
                    </div>
                    <div className="w-full bg-purple-200 dark:bg-purple-900 rounded-full h-2">
                      <div 
                        className="bg-purple-600 h-2 rounded-full" 
                        style={{ width: `${selectedPoint.environmental}%` }}
                      />
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="space-y-2">
                  <h4 className="font-medium">Sustainability Score</h4>
                  <div className="text-2xl font-bold text-center p-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg">
                    {((selectedPoint.economic + selectedPoint.social + selectedPoint.environmental) / 3).toFixed(0)}/100
                  </div>
                </div>

                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setSelectedPoint(null)}
                  className="w-full"
                >
                  Close Details
                </Button>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

function generateDataPoints(data: any): DataPoint[] {
  const points: DataPoint[] = []

  // Overall impact point (largest bubble)
  points.push({
    id: 'overall',
    name: 'Overall Impact',
    economic: normalizeEconomicScore(data),
    social: normalizeSocialScore(data),
    environmental: normalizeEnvironmentalScore(data),
    size: 8,
    color: CATEGORY_COLORS.Overall,
    category: 'Overall'
  })

  // Transaction efficiency points
  const transactionCount = Math.min(data.onChain.transactions.length, 10)
  for (let i = 0; i < transactionCount; i++) {
    const tx = data.onChain.transactions[i]
    points.push({
      id: `tx-${i}`,
      name: `Transaction ${i + 1}`,
      economic: Math.min(100, (tx.tokenAmount / 100) * 20 + Math.random() * 30),
      social: Math.random() * 40 + 30,
      environmental: Math.max(10, 100 - (tx.gasUsed / 1000)),
      size: 2 + Math.random() * 2,
      color: CATEGORY_COLORS.Transaction,
      category: 'Transaction'
    })
  }

  // Location-based points
  data.offChain.popularLocations.slice(0, 5).forEach((location: any, index: number) => {
    points.push({
      id: `location-${index}`,
      name: location.name,
      economic: Math.min(100, (location.count / Math.max(...data.offChain.popularLocations.map((l: any) => l.count))) * 80 + 20),
      social: Math.random() * 30 + 60, // Assume popular locations have good social scores
      environmental: Math.random() * 50 + 40,
      size: 3 + (location.count / Math.max(...data.offChain.popularLocations.map((l: any) => l.count))) * 3,
      color: CATEGORY_COLORS.Location,
      category: 'Location'
    })
  })

  // Review sentiment points
  const sentimentData = data.social.sentimentDistribution
  if (sentimentData.positive > 0) {
    points.push({
      id: 'sentiment-positive',
      name: 'Positive Reviews',
      economic: Math.random() * 30 + 50,
      social: (sentimentData.positive / data.social.totalReviews) * 100,
      environmental: Math.random() * 40 + 40,
      size: 3 + (sentimentData.positive / data.social.totalReviews) * 4,
      color: CATEGORY_COLORS.Review,
      category: 'Review'
    })
  }

  // Energy efficiency point
  points.push({
    id: 'energy',
    name: 'Energy Efficiency',
    economic: Math.random() * 30 + 40,
    social: Math.random() * 30 + 30,
    environmental: data.environmental.efficiencyScore,
    size: 4 + (data.environmental.efficiencyScore / 100) * 3,
    color: CATEGORY_COLORS.Energy,
    category: 'Energy'
  })

  return points
}

function normalizeEconomicScore(data: any): number {
  const revenueScore = Math.min(100, (data.onChain.totalVolume / 10000) * 30)
  const bookingScore = Math.min(100, (data.offChain.totalBookings / 100) * 40)
  const efficiencyScore = Math.min(100, (data.onChain.uniqueAddresses / data.offChain.totalBookings) * 100)
  return (revenueScore + bookingScore + efficiencyScore) / 3
}

function normalizeSocialScore(data: any): number {
  const ratingScore = (data.social.avgRating / 5) * 100
  const sentimentScore = (data.social.sentimentDistribution.positive / data.social.totalReviews) * 100
  return (ratingScore + sentimentScore) / 2
}

function normalizeEnvironmentalScore(data: any): number {
  const efficiencyScore = data.environmental.efficiencyScore
  const renewableScore = data.environmental.renewableEnergyPercent
  const carbonScore = Math.max(0, 100 - (data.environmental.co2Equivalent / 5000) * 100)
  return (efficiencyScore + renewableScore + carbonScore) / 3
}

function calculateOverallSustainabilityScore(dataPoints: DataPoint[]): number {
  if (dataPoints.length === 0) return 0
  
  const overallPoint = dataPoints.find(p => p.id === 'overall')
  if (overallPoint) {
    return (overallPoint.economic + overallPoint.social + overallPoint.environmental) / 3
  }
  
  // Fallback calculation
  const avgEconomic = dataPoints.reduce((sum, p) => sum + p.economic, 0) / dataPoints.length
  const avgSocial = dataPoints.reduce((sum, p) => sum + p.social, 0) / dataPoints.length
  const avgEnvironmental = dataPoints.reduce((sum, p) => sum + p.environmental, 0) / dataPoints.length
  
  return (avgEconomic + avgSocial + avgEnvironmental) / 3
}

function getSustainabilityLevel(score: number) {
  if (score >= 80) {
    return {
      variant: 'default',
      description: 'Excellent sustainability performance across all dimensions'
    }
  } else if (score >= 65) {
    return {
      variant: 'secondary',
      description: 'Good sustainability with room for improvement'
    }
  } else if (score >= 50) {
    return {
      variant: 'outline',
      description: 'Moderate sustainability performance'
    }
  } else {
    return {
      variant: 'destructive',
      description: 'Low sustainability - requires urgent attention'
    }
  }
}