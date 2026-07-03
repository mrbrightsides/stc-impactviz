'use client'

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { 
  Activity, BarChart3, TreePine, Users, Globe, Brain, FileText, 
  TrendingUp, Leaf, CheckCircle, ArrowRight, Info, HelpCircle,
  Target, Lightbulb, Settings, Download, Upload, Eye, Zap,
  Shield, Coins, MapPin, Calendar, Star, AlertCircle
} from 'lucide-react'

const AboutApp: React.FC = () => {
  const features = [
    {
      icon: <BarChart3 className="h-5 w-5" />,
      title: "Dashboard Triple Bottom Line",
      description: "Analisis komprehensif aspek ekonomi, sosial, dan lingkungan dalam satu tampilan terpadu"
    },
    {
      icon: <TreePine className="h-5 w-5" />,
      title: "Carbon Layer & Green Metrics",
      description: "Pelacakan jejak karbon dan metrik keberlanjutan lingkungan secara real-time"
    },
    {
      icon: <Globe className="h-5 w-5" />,
      title: "Geographic Analytics",
      description: "Visualisasi data geografis interaktif untuk analisis dampak regional"
    },
    {
      icon: <Brain className="h-5 w-5" />,
      title: "AI Predictive Analytics",
      description: "Analisis prediktif berbasis AI untuk perencanaan strategis sustainability"
    },
    {
      icon: <FileText className="h-5 w-5" />,
      title: "ESG Reporting",
      description: "Laporan ESG otomatis sesuai standar GRI, SDGs, dan GHG Protocol"
    },
    {
      icon: <Activity className="h-5 w-5" />,
      title: "Real-time Simulation",
      description: "Simulasi data real-time untuk testing dan analisis skenario"
    }
  ]

  const stepByStepGuide = [
    {
      step: 1,
      icon: <Upload className="h-5 w-5" />,
      title: "Input Data",
      description: "Masukkan data transaksi SmartTourismChain Anda melalui panel input data"
    },
    {
      step: 2,
      icon: <Eye className="h-5 w-5" />,
      title: "Lihat Overview", 
      description: "Mulai dengan tab 'Overview' untuk melihat ringkasan sustainability score"
    },
    {
      step: 3,
      icon: <BarChart3 className="h-5 w-5" />,
      title: "Explore Dashboard",
      description: "Jelajahi tab Economic, Social, dan Environmental untuk analisis mendalam"
    },
    {
      step: 4,
      icon: <Settings className="h-5 w-5" />,
      title: "Aktifkan Carbon Layer",
      description: "Toggle Carbon Layer untuk melihat estimasi emisi CO₂ dari aktivitas pariwisata"
    },
    {
      step: 5,
      icon: <Brain className="h-5 w-5" />,
      title: "Gunakan AI Analytics",
      description: "Manfaatkan tab 'AI Analytics' untuk prediksi dan insight mendalam"
    },
    {
      step: 6,
      icon: <Download className="h-5 w-5" />,
      title: "Export Laporan",
      description: "Download laporan dalam format Excel, PDF, atau JSON di tab 'Export'"
    }
  ]

  const faqItems = [
    {
      question: "Apa itu STC ImpactViz?",
      answer: "STC ImpactViz adalah platform analitik sustainability pariwisata berbasis blockchain yang membantu mengukur dampak ekonomi, sosial, dan lingkungan dari aktivitas pariwisata menggunakan data SmartTourismChain."
    },
    {
      question: "Apa itu ESG?",
      answer: "ESG stands for Environmental, Social, and Governance (Lingkungan, Sosial, dan Tata Kelola). Ini adalah kriteria yang digunakan investor dan perusahaan untuk mengevaluasi sustainability dan impact perusahaan."
    },
    {
      question: "Bagaimana cara kerja Carbon Layer?",
      answer: "Carbon Layer menghitung estimasi emisi CO₂ berdasarkan data aktivitas pariwisata Anda, termasuk transportasi, akomodasi, dan konsumsi energi, kemudian menampilkannya dalam visualisasi yang mudah dipahami."
    },
    {
      question: "Format export apa saja yang didukung?",
      answer: "Platform mendukung export dalam format Excel (.xlsx), PDF, dan JSON. Setiap format memberikan tingkat detail yang berbeda sesuai kebutuhan pelaporan Anda."
    },
    {
      question: "Apakah data saya aman?",
      answer: "Ya, semua data diproses secara lokal di browser Anda. Platform tidak menyimpan data pribadi atau sensitive di server, memastikan privasi dan keamanan data Anda."
    }
  ]

  return (
    <div className="space-y-6">
      {/* Main Introduction */}
      <Card className="border-blue-200 dark:border-blue-800 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950">
        <CardHeader>
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center">
              <Activity className="h-5 w-5 text-white" />
            </div>
            <div>
              <CardTitle className="text-2xl">Tentang STC ImpactViz</CardTitle>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                Platform Analitik Sustainability Pariwisata Berbasis Blockchain
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center space-x-2">
              <Badge variant="secondary" className="bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300">
                <Leaf className="h-3 w-3 mr-1" />
                Sustainability Focus
              </Badge>
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant="secondary" className="bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300">
                <Shield className="h-3 w-3 mr-1" />
                Blockchain-Based
              </Badge>
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant="secondary" className="bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300">
                <FileText className="h-3 w-3 mr-1" />
                ESG Compliant
              </Badge>
            </div>
          </div>
          
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
            <strong>STC ImpactViz</strong> adalah platform analitik sustainability yang dirancang khusus untuk industri pariwisata. 
            Menggunakan teknologi blockchain SmartTourismChain, platform ini membantu stakeholder pariwisata mengukur, 
            menganalisis, dan melaporkan dampak ekonomi, sosial, dan lingkungan dari aktivitas pariwisata mereka.
          </p>

          <div className="bg-white/50 dark:bg-slate-900/50 rounded-lg p-4 border border-slate-200 dark:border-slate-700">
            <div className="flex items-start space-x-3">
              <Target className="h-5 w-5 text-blue-600 mt-0.5" />
              <div>
                <h4 className="font-semibold text-slate-900 dark:text-slate-100">Tujuan Utama</h4>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                  Mendukung pariwisata berkelanjutan dengan memberikan insight data-driven untuk pengambilan 
                  keputusan yang bertanggung jawab terhadap lingkungan dan masyarakat.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Key Features */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Zap className="h-5 w-5 text-orange-500" />
            <span>Fitur Utama</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {features.map((feature, index) => (
              <div key={index} className="bg-slate-50 dark:bg-slate-800 rounded-lg p-4 border border-slate-200 dark:border-slate-700">
                <div className="flex items-start space-x-3">
                  <div className="text-blue-600 dark:text-blue-400 mt-1">
                    {feature.icon}
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-900 dark:text-slate-100 text-sm">
                      {feature.title}
                    </h4>
                    <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* How to Use */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Lightbulb className="h-5 w-5 text-yellow-500" />
            <span>Cara Penggunaan</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {stepByStepGuide.map((step, index) => (
              <div key={index} className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                    <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">{step.step}</span>
                  </div>
                </div>
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <div className="text-blue-600 dark:text-blue-400">
                      {step.icon}
                    </div>
                    <h4 className="font-semibold text-slate-900 dark:text-slate-100">{step.title}</h4>
                  </div>
                  <p className="text-sm text-slate-600 dark:text-slate-400">{step.description}</p>
                </div>
                {index < stepByStepGuide.length - 1 && (
                  <ArrowRight className="h-4 w-4 text-slate-400 mt-2" />
                )}
              </div>
            ))}
          </div>

          <Separator className="my-6" />

          <div className="bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <Info className="h-5 w-5 text-amber-600 dark:text-amber-400 mt-0.5" />
              <div>
                <h4 className="font-semibold text-amber-900 dark:text-amber-100">Tips Penggunaan</h4>
                <ul className="text-sm text-amber-700 dark:text-amber-300 mt-2 space-y-1 list-disc list-inside">
                  <li>Mulai dengan data sample kecil untuk memahami cara kerja platform</li>
                  <li>Aktifkan Carbon Layer untuk melihat estimasi dampak lingkungan</li>
                  <li>Gunakan Real-time Simulation untuk testing sebelum input data asli</li>
                  <li>Export regular reports untuk tracking progress sustainability</li>
                  <li>Manfaatkan AI Analytics untuk insight strategis jangka panjang</li>
                </ul>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Understanding Data Types */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <BarChart3 className="h-5 w-5 text-green-500" />
            <span>Jenis Data yang Dianalisis</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-green-50 dark:bg-green-950 rounded-lg border border-green-200 dark:border-green-800">
              <TrendingUp className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <h4 className="font-semibold text-green-900 dark:text-green-100">Data Ekonomi</h4>
              <p className="text-xs text-green-700 dark:text-green-300 mt-1">
                Volume transaksi, pendapatan, spending patterns, ROI pariwisata
              </p>
            </div>
            
            <div className="text-center p-4 bg-blue-50 dark:bg-blue-950 rounded-lg border border-blue-200 dark:border-blue-800">
              <Users className="h-8 w-8 text-blue-600 mx-auto mb-2" />
              <h4 className="font-semibold text-blue-900 dark:text-blue-100">Data Sosial</h4>
              <p className="text-xs text-blue-700 dark:text-blue-300 mt-1">
                Reviews, rating, sentiment analysis, community impact
              </p>
            </div>
            
            <div className="text-center p-4 bg-emerald-50 dark:bg-emerald-950 rounded-lg border border-emerald-200 dark:border-emerald-800">
              <Leaf className="h-8 w-8 text-emerald-600 mx-auto mb-2" />
              <h4 className="font-semibold text-emerald-900 dark:text-emerald-100">Data Lingkungan</h4>
              <p className="text-xs text-emerald-700 dark:text-emerald-300 mt-1">
                Konsumsi energi, emisi CO₂, efisiensi resource, renewable energy
              </p>
            </div>
            
            <div className="text-center p-4 bg-purple-50 dark:bg-purple-950 rounded-lg border border-purple-200 dark:border-purple-800">
              <Coins className="h-8 w-8 text-purple-600 mx-auto mb-2" />
              <h4 className="font-semibold text-purple-900 dark:text-purple-100">Data Blockchain</h4>
              <p className="text-xs text-purple-700 dark:text-purple-300 mt-1">
                Smart contract interactions, gas fees, wallet addresses, transactions
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* FAQ */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <HelpCircle className="h-5 w-5 text-indigo-500" />
            <span>Frequently Asked Questions (FAQ)</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {faqItems.map((faq, index) => (
              <div key={index} className="border-l-4 border-blue-200 dark:border-blue-800 pl-4">
                <h4 className="font-semibold text-slate-900 dark:text-slate-100 mb-1">
                  {faq.question}
                </h4>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Standards & Compliance */}
      <Card className="border-green-200 dark:border-green-800">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Shield className="h-5 w-5 text-green-500" />
            <span>Standar & Compliance</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-green-50 dark:bg-green-950 rounded-lg">
              <CheckCircle className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <h4 className="font-semibold text-green-900 dark:text-green-100">GRI Standards</h4>
              <p className="text-xs text-green-700 dark:text-green-300 mt-1">
                Global Reporting Initiative untuk sustainability reporting
              </p>
            </div>
            
            <div className="text-center p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
              <Target className="h-8 w-8 text-blue-600 mx-auto mb-2" />
              <h4 className="font-semibold text-blue-900 dark:text-blue-100">UN SDGs</h4>
              <p className="text-xs text-blue-700 dark:text-blue-300 mt-1">
                United Nations Sustainable Development Goals alignment
              </p>
            </div>
            
            <div className="text-center p-4 bg-purple-50 dark:bg-purple-950 rounded-lg">
              <TreePine className="h-8 w-8 text-purple-600 mx-auto mb-2" />
              <h4 className="font-semibold text-purple-900 dark:text-purple-100">GHG Protocol</h4>
              <p className="text-xs text-purple-700 dark:text-purple-300 mt-1">
                Greenhouse Gas Protocol untuk carbon accounting
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Contact & Support Info */}
      <Card className="border-slate-200 dark:border-slate-700">
        <CardContent className="pt-6">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-2 mb-2">
              <Activity className="h-5 w-5 text-blue-600" />
              <span className="font-semibold text-slate-900 dark:text-slate-100">STC ImpactViz</span>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Platform Analitik Sustainability Pariwisata Berbasis Blockchain
            </p>
            <div className="flex items-center justify-center space-x-4 mt-4 text-xs text-slate-500 dark:text-slate-400">
              <span>Version 1.0</span>
              <span>•</span>
              <span>Built with Next.js & TypeScript</span>
              <span>•</span>
              <span>ESG Compliant</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default AboutApp