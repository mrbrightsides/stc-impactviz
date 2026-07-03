'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Separator } from '@/components/ui/separator'
import { 
  Activity, 
  RefreshCw, 
  TrendingUp,
  Zap,
  Link as LinkIcon,
  ExternalLink,
  AlertCircle,
  CheckCircle2,
  Clock
} from 'lucide-react'
import { Progress } from '@/components/ui/progress'
import { 
  fetchBlockchainData, 
  getNetworkStats,
  weiToEther,
  type BlockchainTransaction,
  type BlockchainStats
} from '@/lib/blockchain-api'

export const BlockchainLiveData: React.FC = () => {
  const [transactions, setTransactions] = useState<BlockchainTransaction[]>([])
  const [stats, setStats] = useState<BlockchainStats | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [autoRefresh, setAutoRefresh] = useState(true)
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null)

  useEffect(() => {
    loadBlockchainData()
  }, [])

  useEffect(() => {
    if (!autoRefresh) return

    const interval = setInterval(() => {
      loadBlockchainData()
    }, 30000) // Refresh every 30 seconds

    return () => clearInterval(interval)
  }, [autoRefresh])

  const loadBlockchainData = async () => {
    setLoading(true)
    setError(null)

    try {
      const data = await fetchBlockchainData(5) // Fetch last 5 blocks
      setTransactions(data.transactions)
      setStats(data.stats)
      setLastUpdate(new Date())
    } catch (err) {
      setError('Failed to fetch blockchain data. Please try again.')
      console.error('Blockchain fetch error:', err)
    } finally {
      setLoading(false)
    }
  }

  const formatTimestamp = (timestamp: number) => {
    const date = new Date(timestamp)
    return date.toLocaleString('id-ID', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      day: '2-digit',
      month: 'short'
    })
  }

  const shortenHash = (hash: string) => {
    if (!hash) return 'N/A'
    return `${hash.slice(0, 6)}...${hash.slice(-4)}`
  }

  const formatGas = (gas: string) => {
    const gasNum = parseInt(gas)
    if (isNaN(gasNum)) return '0'
    return (gasNum / 1000).toFixed(1) + 'K'
  }

  return (
    <div className="space-y-6">
      {/* Header with Stats */}
      <Card className="bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-950 dark:to-blue-950">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-6 w-6" />
                Live Blockchain Data - Sepolia Testnet
              </CardTitle>
              <CardDescription className="mt-2">
                Real-time data from Ethereum Sepolia via Infura API
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={loadBlockchainData}
                disabled={loading}
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
              <Button
                variant={autoRefresh ? 'default' : 'outline'}
                size="sm"
                onClick={() => setAutoRefresh(!autoRefresh)}
              >
                {autoRefresh ? 'Auto: ON' : 'Auto: OFF'}
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {stats && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-white/80 dark:bg-slate-900/80 p-4 rounded-lg">
                <div className="text-sm text-muted-foreground mb-1">Current Block</div>
                <div className="text-2xl font-bold text-blue-600">
                  {stats.currentBlock.toLocaleString()}
                </div>
              </div>

              <div className="bg-white/80 dark:bg-slate-900/80 p-4 rounded-lg">
                <div className="text-sm text-muted-foreground mb-1">Gas Price</div>
                <div className="text-2xl font-bold text-green-600">
                  {stats.gasPrice} Gwei
                </div>
              </div>

              <div className="bg-white/80 dark:bg-slate-900/80 p-4 rounded-lg">
                <div className="text-sm text-muted-foreground mb-1">Hash Rate</div>
                <div className="text-2xl font-bold text-purple-600">
                  {stats.networkHashRate}
                </div>
              </div>

              <div className="bg-white/80 dark:bg-slate-900/80 p-4 rounded-lg">
                <div className="text-sm text-muted-foreground mb-1">Transactions</div>
                <div className="text-2xl font-bold text-orange-600">
                  {transactions.length}
                </div>
              </div>
            </div>
          )}

          {lastUpdate && (
            <div className="flex items-center justify-center gap-2 mt-4 text-sm text-muted-foreground">
              <Clock className="h-4 w-4" />
              Last updated: {lastUpdate.toLocaleTimeString('id-ID')}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Transactions List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Recent Transactions
          </CardTitle>
          <CardDescription>
            Live transactions from the Sepolia network
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading && transactions.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12">
              <RefreshCw className="h-12 w-12 animate-spin text-primary mb-4" />
              <p className="text-muted-foreground">Loading blockchain data...</p>
              <Progress value={66} className="w-64 mt-4" />
            </div>
          ) : transactions.length === 0 ? (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                No transactions found. Click refresh to load data.
              </AlertDescription>
            </Alert>
          ) : (
            <div className="space-y-3">
              {transactions.slice(0, 20).map((tx, index) => (
                <div
                  key={tx.hash + index}
                  className="border rounded-lg p-4 hover:bg-accent/50 transition-colors"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge 
                          variant={tx.status === 'success' ? 'default' : 'destructive'}
                          className="text-xs"
                        >
                          {tx.status === 'success' ? (
                            <CheckCircle2 className="h-3 w-3 mr-1" />
                          ) : (
                            <AlertCircle className="h-3 w-3 mr-1" />
                          )}
                          {tx.status}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          Block #{tx.blockNumber.toLocaleString()}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {formatTimestamp(tx.timestamp)}
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-2 text-sm font-mono">
                        <LinkIcon className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">{shortenHash(tx.hash)}</span>
                        <a
                          href={`https://sepolia.etherscan.io/tx/${tx.hash}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800 dark:text-blue-400"
                        >
                          <ExternalLink className="h-4 w-4" />
                        </a>
                      </div>
                    </div>
                  </div>

                  <Separator className="my-2" />

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                    <div>
                      <div className="text-muted-foreground text-xs mb-1">From</div>
                      <div className="font-mono font-medium">{shortenHash(tx.from)}</div>
                    </div>
                    
                    <div>
                      <div className="text-muted-foreground text-xs mb-1">To</div>
                      <div className="font-mono font-medium">{shortenHash(tx.to)}</div>
                    </div>
                    
                    <div>
                      <div className="text-muted-foreground text-xs mb-1">Value</div>
                      <div className="font-bold text-green-600">
                        {weiToEther(tx.value)} ETH
                      </div>
                    </div>
                    
                    <div>
                      <div className="text-muted-foreground text-xs mb-1">Gas Used</div>
                      <div className="font-medium flex items-center gap-1">
                        <Zap className="h-3 w-3 text-orange-500" />
                        {formatGas(tx.gasUsed)}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Info Card */}
      <Alert>
        <LinkIcon className="h-4 w-4" />
        <AlertDescription>
          <strong>Connected to:</strong> Ethereum Sepolia Testnet via Infura API
          <br />
          <strong>Update Frequency:</strong> {autoRefresh ? '30 seconds (Auto)' : 'Manual'}
          <br />
          <strong>Data Source:</strong> Real-time blockchain data from {INFURA_DISPLAY}
        </AlertDescription>
      </Alert>
    </div>
  )
}

const INFURA_DISPLAY = 'https://sepolia.infura.io'
