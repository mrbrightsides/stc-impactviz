'use client'

import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { Lightbulb, TrendingUp, FileText, Globe, Download, Activity, Zap } from 'lucide-react'

export function QuickStartGuide(): JSX.Element {
  return (
    <Card className="border-2 border-amber-200 dark:border-amber-800 bg-amber-50/50 dark:bg-amber-950/20">
      <CardHeader>
        <div className="flex items-center space-x-2">
          <Lightbulb className="h-5 w-5 text-amber-600 dark:text-amber-400" />
          <CardTitle className="text-lg">Panduan Cepat</CardTitle>
        </div>
        <CardDescription>
          Langkah-langkah untuk memaksimalkan analisis sustainability Anda
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Step 1 */}
        <div className="flex items-start space-x-3">
          <Badge className="bg-amber-500 hover:bg-amber-600 mt-1 min-w-[24px] justify-center">
            1
          </Badge>
          <div className="flex-1">
            <h3 className="font-semibold text-sm mb-1 flex items-center space-x-2">
              <Zap className="h-4 w-4 text-amber-600" />
              <span>Muat Data (Quick Start)</span>
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Klik <strong>"Muat Data Demo"</strong> untuk langsung explore dengan data sample Bali tourism, atau upload CSV Anda sendiri.
            </p>
          </div>
        </div>

        {/* Step 2 */}
        <div className="flex items-start space-x-3">
          <Badge className="bg-amber-500 hover:bg-amber-600 mt-1 min-w-[24px] justify-center">
            2
          </Badge>
          <div className="flex-1">
            <h3 className="font-semibold text-sm mb-1 flex items-center space-x-2">
              <TrendingUp className="h-4 w-4 text-blue-600" />
              <span>Explore Dashboard</span>
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Lihat <strong>Triple Bottom Line</strong> (Economic, Social, Environmental) dan <strong>Sustainability Score</strong> Anda.
            </p>
          </div>
        </div>

        {/* Step 3 */}
        <div className="flex items-start space-x-3">
          <Badge className="bg-amber-500 hover:bg-amber-600 mt-1 min-w-[24px] justify-center">
            3
          </Badge>
          <div className="flex-1">
            <h3 className="font-semibold text-sm mb-1 flex items-center space-x-2">
              <Globe className="h-4 w-4 text-green-600" />
              <span>Analisis Geographic & Green Metrics</span>
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Navigasi ke tab <strong>Geographic</strong> untuk melihat peta interaktif dan <strong>Green Metrics</strong> untuk analisis lingkungan detail.
            </p>
          </div>
        </div>

        {/* Step 4 */}
        <div className="flex items-start space-x-3">
          <Badge className="bg-amber-500 hover:bg-amber-600 mt-1 min-w-[24px] justify-center">
            4
          </Badge>
          <div className="flex-1">
            <h3 className="font-semibold text-sm mb-1 flex items-center space-x-2">
              <Activity className="h-4 w-4 text-purple-600" />
              <span>AI Analytics & Live Simulation</span>
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Gunakan tab <strong>AI Analytics</strong> untuk predictive insights dan <strong>Live</strong> untuk real-time simulation.
            </p>
          </div>
        </div>

        {/* Step 5 */}
        <div className="flex items-start space-x-3">
          <Badge className="bg-amber-500 hover:bg-amber-600 mt-1 min-w-[24px] justify-center">
            5
          </Badge>
          <div className="flex-1">
            <h3 className="font-semibold text-sm mb-1 flex items-center space-x-2">
              <FileText className="h-4 w-4 text-indigo-600" />
              <span>Generate ESG Reports</span>
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Tab <strong>ESG Reports</strong> untuk report compliance dengan standar GRI, SDGs, dan GHG Protocol.
            </p>
          </div>
        </div>

        {/* Step 6 */}
        <div className="flex items-start space-x-3">
          <Badge className="bg-amber-500 hover:bg-amber-600 mt-1 min-w-[24px] justify-center">
            6
          </Badge>
          <div className="flex-1">
            <h3 className="font-semibold text-sm mb-1 flex items-center space-x-2">
              <Download className="h-4 w-4 text-red-600" />
              <span>Export Data</span>
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Tab <strong>Export</strong> untuk download analytics dalam format XLSX, PDF, atau JSON.
            </p>
          </div>
        </div>

        {/* Pro Tips */}
        <Alert className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 border-blue-200 dark:border-blue-800">
          <Lightbulb className="h-4 w-4 text-blue-600" />
          <AlertDescription className="text-sm">
            <strong>Pro Tips:</strong>
            <ul className="list-disc list-inside mt-2 space-y-1 text-slate-600 dark:text-slate-400">
              <li>Aktifkan <strong>Carbon Layer</strong> toggle di header untuk analisis CO₂</li>
              <li>Toggle <strong>USD/IDR</strong> untuk melihat data dalam currency berbeda</li>
              <li>Data Anda <strong>otomatis tersimpan</strong> - aman untuk refresh page!</li>
              <li>Gunakan <strong>Reset button</strong> untuk kembali ke clean slate</li>
            </ul>
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  )
}
