/**
 * Blockchain API Integration
 * Real-time data from Ethereum Sepolia testnet via Infura
 */

const INFURA_ENDPOINT = 'https://sepolia.infura.io/v3/f8d248f838ec4f12b0f01efd2b238206'

export interface BlockchainTransaction {
  hash: string
  from: string
  to: string
  value: string
  gasUsed: string
  gasPrice: string
  blockNumber: number
  timestamp: number
  status: 'success' | 'failed'
}

export interface BlockchainStats {
  currentBlock: number
  gasPrice: string
  networkHashRate: string
  difficulty: string
  totalTransactions: number
}

/**
 * Fetch real-time blockchain data from Sepolia network
 */
export async function fetchBlockchainData(blockCount: number = 10): Promise<{
  transactions: BlockchainTransaction[]
  stats: BlockchainStats
}> {
  try {
    // Get current block number
    const currentBlockHex = await jsonRpcCall('eth_blockNumber', [])
    const currentBlock = parseInt(currentBlockHex, 16)

    // Get gas price
    const gasPriceHex = await jsonRpcCall('eth_gasPrice', [])
    const gasPrice = parseInt(gasPriceHex, 16)

    // Fetch recent blocks and their transactions
    const blocks = await Promise.all(
      Array.from({ length: blockCount }, (_, i) => {
        const blockNum = `0x${(currentBlock - i).toString(16)}`
        return jsonRpcCall('eth_getBlockByNumber', [blockNum, true])
      })
    )

    // Extract transactions from blocks
    const transactions: BlockchainTransaction[] = []
    
    for (const block of blocks) {
      if (!block || !block.transactions) continue
      
      const blockTimestamp = parseInt(block.timestamp, 16)
      const blockNumber = parseInt(block.number, 16)
      
      for (const tx of block.transactions.slice(0, 5)) { // Limit per block
        if (!tx) continue
        
        const receipt = await getTransactionReceipt(tx.hash)
        
        transactions.push({
          hash: tx.hash,
          from: tx.from || '0x0',
          to: tx.to || '0x0',
          value: parseInt(tx.value || '0x0', 16).toString(),
          gasUsed: receipt?.gasUsed ? parseInt(receipt.gasUsed, 16).toString() : '0',
          gasPrice: parseInt(tx.gasPrice || '0x0', 16).toString(),
          blockNumber,
          timestamp: blockTimestamp * 1000,
          status: receipt?.status === '0x1' ? 'success' : 'failed'
        })
      }
    }

    // Get network difficulty
    const latestBlock = blocks[0]
    const difficulty = latestBlock?.difficulty || '0x0'

    const stats: BlockchainStats = {
      currentBlock,
      gasPrice: (gasPrice / 1e9).toFixed(2), // Convert to Gwei
      networkHashRate: calculateHashRate(parseInt(difficulty, 16)),
      difficulty: parseInt(difficulty, 16).toExponential(2),
      totalTransactions: transactions.length
    }

    return { transactions, stats }
  } catch (error) {
    console.error('Failed to fetch blockchain data:', error)
    throw new Error('Blockchain API error')
  }
}

/**
 * Get specific transaction details
 */
export async function getTransaction(txHash: string): Promise<BlockchainTransaction | null> {
  try {
    const tx = await jsonRpcCall('eth_getTransactionByHash', [txHash])
    if (!tx) return null

    const receipt = await getTransactionReceipt(txHash)
    const block = await jsonRpcCall('eth_getBlockByNumber', [tx.blockNumber, false])
    
    return {
      hash: tx.hash,
      from: tx.from || '0x0',
      to: tx.to || '0x0',
      value: parseInt(tx.value || '0x0', 16).toString(),
      gasUsed: receipt?.gasUsed ? parseInt(receipt.gasUsed, 16).toString() : '0',
      gasPrice: parseInt(tx.gasPrice || '0x0', 16).toString(),
      blockNumber: parseInt(tx.blockNumber, 16),
      timestamp: block ? parseInt(block.timestamp, 16) * 1000 : Date.now(),
      status: receipt?.status === '0x1' ? 'success' : 'failed'
    }
  } catch (error) {
    console.error('Failed to get transaction:', error)
    return null
  }
}

/**
 * Get transaction receipt
 */
async function getTransactionReceipt(txHash: string): Promise<any> {
  try {
    return await jsonRpcCall('eth_getTransactionReceipt', [txHash])
  } catch (error) {
    return null
  }
}

/**
 * Monitor specific address for transactions
 */
export async function monitorAddress(
  address: string,
  fromBlock: number = 0
): Promise<BlockchainTransaction[]> {
  try {
    const currentBlock = await jsonRpcCall('eth_blockNumber', [])
    const currentBlockNum = parseInt(currentBlock, 16)
    
    const transactions: BlockchainTransaction[] = []
    const blocksToScan = Math.min(100, currentBlockNum - fromBlock)
    
    for (let i = 0; i < blocksToScan; i++) {
      const blockNum = `0x${(currentBlockNum - i).toString(16)}`
      const block = await jsonRpcCall('eth_getBlockByNumber', [blockNum, true])
      
      if (!block || !block.transactions) continue
      
      const blockTimestamp = parseInt(block.timestamp, 16)
      const blockNumber = parseInt(block.number, 16)
      
      for (const tx of block.transactions) {
        if (!tx) continue
        
        // Check if transaction involves the monitored address
        if (tx.from?.toLowerCase() === address.toLowerCase() || 
            tx.to?.toLowerCase() === address.toLowerCase()) {
          const receipt = await getTransactionReceipt(tx.hash)
          
          transactions.push({
            hash: tx.hash,
            from: tx.from || '0x0',
            to: tx.to || '0x0',
            value: parseInt(tx.value || '0x0', 16).toString(),
            gasUsed: receipt?.gasUsed ? parseInt(receipt.gasUsed, 16).toString() : '0',
            gasPrice: parseInt(tx.gasPrice || '0x0', 16).toString(),
            blockNumber,
            timestamp: blockTimestamp * 1000,
            status: receipt?.status === '0x1' ? 'success' : 'failed'
          })
        }
      }
    }
    
    return transactions
  } catch (error) {
    console.error('Failed to monitor address:', error)
    return []
  }
}

/**
 * Get network statistics
 */
export async function getNetworkStats(): Promise<BlockchainStats> {
  try {
    const [currentBlockHex, gasPriceHex, latestBlock] = await Promise.all([
      jsonRpcCall('eth_blockNumber', []),
      jsonRpcCall('eth_gasPrice', []),
      jsonRpcCall('eth_getBlockByNumber', ['latest', false])
    ])

    const currentBlock = parseInt(currentBlockHex, 16)
    const gasPrice = parseInt(gasPriceHex, 16)
    const difficulty = latestBlock?.difficulty || '0x0'

    return {
      currentBlock,
      gasPrice: (gasPrice / 1e9).toFixed(2),
      networkHashRate: calculateHashRate(parseInt(difficulty, 16)),
      difficulty: parseInt(difficulty, 16).toExponential(2),
      totalTransactions: 0
    }
  } catch (error) {
    console.error('Failed to get network stats:', error)
    throw new Error('Network stats error')
  }
}

/**
 * Generic JSON-RPC call to Infura
 */
async function jsonRpcCall(method: string, params: any[]): Promise<any> {
  try {
    const response = await fetch(INFURA_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        jsonrpc: '2.0',
        id: 1,
        method,
        params,
      }),
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    
    if (data.error) {
      throw new Error(data.error.message || 'JSON-RPC error')
    }

    return data.result
  } catch (error) {
    console.error(`JSON-RPC call failed (${method}):`, error)
    throw error
  }
}

/**
 * Calculate network hash rate from difficulty
 */
function calculateHashRate(difficulty: number): string {
  // Simplified hash rate calculation
  // Block time for Ethereum is ~12 seconds
  const hashRate = difficulty / 12
  
  if (hashRate > 1e12) {
    return `${(hashRate / 1e12).toFixed(2)} TH/s`
  } else if (hashRate > 1e9) {
    return `${(hashRate / 1e9).toFixed(2)} GH/s`
  } else if (hashRate > 1e6) {
    return `${(hashRate / 1e6).toFixed(2)} MH/s`
  } else {
    return `${(hashRate / 1e3).toFixed(2)} KH/s`
  }
}

/**
 * Convert Wei to Ether
 */
export function weiToEther(wei: string): string {
  const weiNum = BigInt(wei)
  const ether = Number(weiNum) / 1e18
  return ether.toFixed(6)
}

/**
 * Convert Gwei to Wei
 */
export function gweiToWei(gwei: string): string {
  const gweiNum = parseFloat(gwei)
  return (gweiNum * 1e9).toString()
}
