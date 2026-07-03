'use client'

import React, { useRef } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { Sparkles, Upload, FileText, Info } from 'lucide-react'
import { generateSampleData, parseCSVData, type STCData } from '@/lib/sample-data'

interface SampleDataLoaderProps {
  onDataLoad: (data: STCData) => void
}

export function SampleDataLoader({ onDataLoad }: SampleDataLoaderProps): JSX.Element {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [error, setError] = React.useState<string>('')
  const [loading, setLoading] = React.useState<boolean>(false)

  const handleLoadSampleData = React.useCallback(() => {
    setLoading(true)
    setError('')
    
    try {
      console.log('Generating sample data...')
      const sampleData = generateSampleData()
      
      // Small delay for UX
      setTimeout(() => {
        onDataLoad(sampleData)
        setLoading(false)
        console.log('Sample data loaded successfully')
      }, 500)
    } catch (err) {
      setError('Gagal memuat data sample. Silakan coba lagi.')
      setLoading(false)
      console.error('Failed to load sample data:', err)
    }
  }, [onDataLoad])

  const handleCSVUpload = React.useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setLoading(true)
    setError('')

    const reader = new FileReader()
    
    reader.onload = (e: ProgressEvent<FileReader>) => {
      try {
        const csvText = e.target?.result as string
        const parsedData = parseCSVData(csvText)
        
        if (parsedData && parsedData.offChain && parsedData.offChain.bookings.length > 0) {
          // Merge with generated data for complete dataset
          const fullData = generateSampleData()
          const mergedData: STCData = {
            ...fullData,
            offChain: {
              ...fullData.offChain,
              ...parsedData.offChain
            }
          }
          
          onDataLoad(mergedData)
          console.log('CSV data imported successfully')
        } else {
          setError('Format CSV tidak valid. Pastikan file memiliki kolom: location, cost, duration, category')
        }
      } catch (err) {
        setError('Gagal membaca file CSV. Pastikan format file benar.')
        console.error('CSV parsing error:', err)
      } finally {
        setLoading(false)
        // Reset file input
        if (fileInputRef.current) {
          fileInputRef.current.value = ''
        }
      }
    }

    reader.onerror = () => {
      setError('Gagal membaca file. Silakan coba lagi.')
      setLoading(false)
    }

    reader.readAsText(file)
  }, [onDataLoad])

  const handleUploadClick = React.useCallback(() => {
    fileInputRef.current?.click()
  }, [])

  return (
    <div className="space-y-4">
      <Card className="border-2 border-dashed border-blue-200 dark:border-blue-800 bg-blue-50/50 dark:bg-blue-950/20">
        <CardHeader>
          <div className="flex items-center space-x-2">
            <Sparkles className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            <CardTitle className="text-lg">Quick Start - Muat Data</CardTitle>
          </div>
          <CardDescription>
            Pilih cara tercepat untuk memulai analisis sustainability Anda
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Sample Data Option */}
          <div className="space-y-3">
            <div className="flex items-start space-x-3">
              <Badge variant="secondary" className="mt-1">
                Rekomendasi
              </Badge>
              <div className="flex-1">
                <h3 className="font-semibold text-sm mb-1">Gunakan Data Demo</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">
                  Muat data sample pariwisata Bali untuk langsung explore semua fitur analytics platform tanpa perlu input manual.
                </p>
                <Button
                  onClick={handleLoadSampleData}
                  disabled={loading}
                  className="w-full sm:w-auto bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700"
                >
                  <Sparkles className="h-4 w-4 mr-2" />
                  {loading ? 'Memuat Data...' : 'Muat Data Demo'}
                </Button>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-slate-200 dark:border-slate-700" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-blue-50 dark:bg-blue-950/20 px-2 text-slate-500 dark:text-slate-400">
                atau
              </span>
            </div>
          </div>

          {/* CSV Import Option */}
          <div className="space-y-3">
            <div className="flex items-start space-x-3">
              <FileText className="h-5 w-5 text-slate-400 mt-1" />
              <div className="flex-1">
                <h3 className="font-semibold text-sm mb-1">Import dari CSV</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">
                  Upload file CSV dengan kolom: <code className="text-xs bg-slate-200 dark:bg-slate-800 px-1 py-0.5 rounded">location, cost, duration, category</code>
                </p>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".csv"
                  onChange={handleCSVUpload}
                  className="hidden"
                />
                <Button
                  onClick={handleUploadClick}
                  disabled={loading}
                  variant="outline"
                  className="w-full sm:w-auto"
                >
                  <Upload className="h-4 w-4 mr-2" />
                  {loading ? 'Mengupload...' : 'Upload CSV'}
                </Button>
              </div>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Info Box */}
          <Alert className="bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800">
            <Info className="h-4 w-4" />
            <AlertDescription className="text-sm">
              <strong>Tips:</strong> Gunakan data demo untuk pertama kali agar bisa langsung explore fitur ESG analytics, predictive insights, dan interactive dashboards!
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    </div>
  )
}
