# 🌍 STC ImpactViz

**Blockchain Tourism Sustainability Analytics Platform**

[![Next.js](https://img.shields.io/badge/Next.js-15.3.4-black?logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8.3-blue?logo=typescript)](https://www.typescriptlang.org/)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)
[![Build Status](https://img.shields.io/badge/build-passing-brightgreen.svg)]()

> **STC ImpactViz** adalah platform analytics berkelanjutan berbasis blockchain yang dirancang untuk menganalisis dampak ekonomi, sosial, dan lingkungan dari industri pariwisata. Platform ini mengintegrasikan data on-chain dan off-chain, menyediakan real-time analytics, AI-powered recommendations, dan ESG compliance reporting.

---

## 📋 Daftar Isi

- [✨ Fitur Utama](#-fitur-utama)
- [🚀 Demo & Screenshots](#-demo--screenshots)
- [🏗️ Teknologi Stack](#️-teknologi-stack)
- [📦 Instalasi](#-instalasi)
- [🎯 Cara Penggunaan](#-cara-penggunaan)
- [🔧 Konfigurasi](#-konfigurasi)
- [📊 Fitur Lanjutan](#-fitur-lanjutan)
- [🤝 Kontribusi](#-kontribusi)
- [📝 Lisensi](#-lisensi)
- [👥 Tim](#-tim)

---

## ✨ Fitur Utama

### 🎯 **Core Analytics Features**

#### **1. Triple Bottom Line Dashboard**
- **Economic Impact**: Analisis volume transaksi blockchain, total bookings, dan rata-rata spending
- **Social Impact**: Tracking customer ratings, reviews, dan sentiment analysis
- **Environmental Impact**: Monitoring konsumsi energi, CO₂ equivalent, dan renewable energy percentage
- **Sustainability Score**: Kalkulasi real-time 0-100 score berdasarkan weighted metrics

#### **2. ESG Compliance Reporting**
- **GRI Standards**: Global Reporting Initiative compliance
- **UN SDGs**: Alignment dengan Sustainable Development Goals
- **GHG Protocol**: Greenhouse Gas Protocol untuk carbon accounting
- **Export Formats**: PDF, Excel (.xlsx), JSON untuk stakeholder reporting

#### **3. Geographic Visualization**
- **Interactive Maps**: Leaflet-powered geographic dashboard
- **Location Analytics**: Performance metrics per destination
- **Heatmaps**: Visualisasi konsentrasi aktivitas pariwisata
- **Route Optimization**: Carbon footprint analysis per location

#### **4. Real-Time Simulation**
- **Live Data Updates**: Simulasi real-time data changes
- **Predictive Analytics**: AI-powered forecasting untuk sustainability trends
- **Scenario Testing**: Test berbagai strategi sustainability

---

### 🚀 **Advanced Features**

#### **5. AI-Powered Recommendations**
- **Intelligent Analysis**: Auto-generated actionable recommendations
- **Priority Scoring**: High/Medium/Low priority categorization
- **Impact Estimation**: Projected improvements dengan timeframes
- **Category-Specific Insights**: Economic, Social, Environmental, dan Overall recommendations
- **Confidence Scores**: 75-92% confidence dengan statistical significance

**Example Recommendations:**
- ⚡ Gas Fee Optimization: Reduce costs 35% via batch processing
- 💰 Revenue Growth: Increase avg booking 30% through premium packages
- ⭐ Customer Satisfaction: Improve ratings 25% dengan 24/7 support
- 🌱 Renewable Energy: Increase environmental score 35 points
- 🌍 Carbon Reduction: Reduce footprint 40% via route optimization

#### **6. Machine Learning Analytics**
- **Anomaly Detection**: Identify unusual transaction patterns
- **Seasonal Trends**: Detect booking seasonality untuk optimization
- **Correlation Mining**: Discover relationships between metrics
- **K-means Clustering**: Identify high/low performing locations
- **Sentiment Evolution**: Track customer sentiment trends over time
- **Gas Fee Predictions**: Estimate cost savings potential
- **Customer Lifetime Value (CLV)**: Predictions dengan churn risk analysis
- **Environmental Optimization**: ROI-ranked improvement pathways

**8 ML Pattern Types:**
1. Anomaly Detection (fraud detection, high-value customers)
2. Seasonal Trends (peak/low season identification)
3. Correlation Analysis (rating vs spending relationships)
4. Location Clustering (performance-based grouping)
5. Sentiment Trends (customer satisfaction trajectory)
6. Gas Fee Patterns (optimal transaction timing)
7. CLV Predictions (customer lifetime value forecasting)
8. Environmental Optimization (ROI-ranked improvements)

#### **7. Scenario Comparison Mode**
- **Save Unlimited Scenarios**: Timestamp dan metadata tracking
- **Side-by-Side Comparison**: Compare any two scenarios
- **Automatic Change Detection**: Percentage calculations
- **Color-Coded Indicators**: Visual improvement/decline tracking
- **localStorage Persistence**: Scenarios saved across sessions
- **Export Comparison Reports**: For stakeholder presentations

**Use Cases:**
- Q1 vs Q2 performance tracking
- Before/After campaign analysis
- Different strategy comparisons

#### **8. Blockchain Integration**
- **Live Sepolia Testnet Data**: Real-time Ethereum data via Infura
- **Network Statistics**: Current block, gas price, hash rate, difficulty
- **Transaction Monitoring**: Recent blockchain transactions
- **Auto-Refresh Mode**: Updates every 30 seconds
- **Direct Etherscan Links**: Deep dive into transactions
- **Address Monitoring**: Track specific wallet activities

**API Endpoint:**
```
https://sepolia.infura.io/v3/f8d248f838ec4f12b0f01efd2b238206
```

**JSON-RPC Methods:**
- `eth_blockNumber` - Current block height
- `eth_gasPrice` - Current gas price
- `eth_getBlockByNumber` - Block data with transactions
- `eth_getTransactionByHash` - Transaction details
- `eth_getTransactionReceipt` - Transaction status

#### **9. Export Individual Charts**
- **High-Quality Image Export**: PNG, SVG, PDF formats
- **Multi-Chart Export**: Export multiple charts in one PDF
- **Custom Resolution**: 2x scale for professional quality
- **Browser-Based**: No server required
- **Uses**: html2canvas + jsPDF

#### **10. Data Persistence & Management**
- **Auto-Save**: localStorage auto-save on every data change
- **Auto-Load**: Persistent data across sessions
- **CSV Import**: Import data from Excel/CSV files
- **Sample Data**: 1-click demo data untuk instant explore
- **Reset Function**: Clear all data dengan confirmation dialog

---

### 💱 **Multi-Currency Support**
- **USD/IDR Toggle**: Real-time currency conversion
- **Accurate Exchange Rates**: Daily updated rates
- **Consistent Formatting**: Proper currency symbols dan separators
- **Global Applicability**: Easy to add more currencies

---

### 🌐 **Multi-Language Support**
- **Bahasa Indonesia**: Complete Indonesian language UI
- **User-Friendly Guide**: Step-by-step panduan penggunaan
- **About App Section**: Comprehensive app explanation
- **FAQ Section**: Common questions & answers

---

## 🚀 Demo & Screenshots

### 📊 **Main Dashboard**
- Triple Bottom Line Chart dengan real-time metrics
- Sustainability Score indicator (0-100)
- Carbon Layer toggle untuk environmental tracking

### 🗺️ **Geographic Dashboard**
- Interactive Leaflet maps dengan location markers
- Performance metrics per destination
- Carbon footprint visualization

### 🤖 **AI Recommendations**
- Intelligent sustainability advisor
- Actionable recommendations dengan priority scoring
- Impact estimation dan confidence scores

### 📈 **ML Analytics**
- 8 types of pattern detection
- Anomaly detection untuk fraud prevention
- Seasonal trends untuk optimization

### 🔄 **Comparison Mode**
- Save unlimited scenarios
- Side-by-side scenario comparison
- Visual change indicators

### ⛓️ **Blockchain Live Data**
- Real-time Sepolia network monitoring
- Transaction tracking dengan gas metrics
- Direct Etherscan integration

---

## 🏗️ Teknologi Stack

### **Frontend**
- **Framework**: Next.js 15.3.4 (App Router)
- **Language**: TypeScript 5.8.3
- **UI Library**: React 19.1.0
- **Styling**: Tailwind CSS 3.4.1
- **Components**: Radix UI (shadcn/ui)
- **Charts**: Chart.js 4.5.0, Recharts 2.15.3
- **Maps**: Leaflet 1.9.4, React Leaflet 5.0.0
- **3D Graphics**: Three.js 0.180.0, React Three Fiber 9.3.0
- **Forms**: React Hook Form 7.56.3 + Zod 3.24.4

### **Advanced Features**
- **Export**: html2canvas 1.4.1, jsPDF 3.0.3, XLSX 0.18.5
- **Date Handling**: date-fns 3.6.0
- **File Processing**: file-saver 2.0.5
- **Animations**: Framer Motion 12.12.1
- **Notifications**: Sonner 2.0.3

### **Blockchain Integration**
- **Network**: Ethereum Sepolia Testnet
- **RPC Provider**: Infura
- **JSON-RPC**: Direct Infura API integration
- **Data Formats**: Wei to Ether conversions

### **Data Management**
- **State Management**: React Hooks (useState, useEffect, useCallback)
- **Storage**: localStorage for persistence
- **CSV Parsing**: Built-in CSV parser
- **Export Formats**: PDF, XLSX, JSON

### **Developer Tools**
- **Package Manager**: npm
- **Build Tool**: Next.js built-in
- **Type Checking**: TypeScript strict mode
- **Linting**: ESLint
- **Code Quality**: depcheck 1.4.7

---

## 📦 Instalasi

### **Prerequisites**
- Node.js 18.x atau lebih tinggi
- npm atau yarn
- Git

### **Step-by-Step Installation**

1. **Clone Repository**
```bash
git clone https://github.com/yourusername/stc-impactviz.git
cd stc-impactviz
```

2. **Install Dependencies**
```bash
npm install
# atau
yarn install
```

3. **Run Development Server**
```bash
npm run dev
# atau
yarn dev
```

4. **Open Browser**
```
http://localhost:3000
```

5. **Build for Production**
```bash
npm run build
npm start
# atau
yarn build
yarn start
```

---

## 🎯 Cara Penggunaan

### **Quick Start (Recommended)**

1. **Load Demo Data**
   - Click button **"Muat Data Demo"** with **"Rekomendasi"** badge
   - Instantly see full dashboard dengan realistic Bali tourism data
   - 50 blockchain transactions, 100 bookings, 80 reviews
   - Complete environmental metrics

2. **Explore Features**
   - Navigate through 15 tabs:
     - Overview, Economic, Social, Environmental
     - Geographic, Green Metrics, ESG Reports
     - AI Analytics, Live Simulation, Export
     - **Compare**, **AI Insights**, **ML Analytics**, **Blockchain**
   - Toggle Carbon Layer untuk environmental tracking
   - Switch USD/IDR currency

3. **Save Current Scenario**
   - Go to **"Compare"** tab
   - Enter scenario name (e.g., "Q1 2024")
   - Click **"Save Scenario"**

4. **Generate AI Recommendations**
   - Go to **"AI Insights"** tab
   - View sustainability health score
   - See prioritized recommendations
   - Each with impact estimation & confidence score

5. **Analyze ML Patterns**
   - Go to **"ML Analytics"** tab
   - View 8 types of detected patterns
   - Filter by pattern type
   - See confidence scores & metrics

6. **Monitor Blockchain**
   - Go to **"Blockchain"** tab
   - See live Sepolia transactions
   - Monitor network stats
   - Click transaction hashes → Etherscan

7. **Compare Scenarios**
   - Go to **"Compare"** tab
   - Select two scenarios
   - Click **"Compare Scenarios"**
   - See side-by-side metrics dengan % change

8. **Export Data**
   - Go to **"Export"** tab
   - Choose format: XLSX, PDF, JSON
   - Download comprehensive reports

---

### **Advanced Usage**

#### **CSV Import**
```csv
location, cost, duration, category
Ubud, 500000, 3, Hotel
Seminyak, 750000, 5, Resort
Canggu, 300000, 2, Hostel
```

1. Prepare CSV file dengan format: `location, cost, duration, category`
2. Click **"Upload CSV"** button
3. Select file
4. Data automatically merged dengan sample data

#### **Manual Input (Advanced Users)**
1. Use **"Manual Input (Advanced)"** card
2. Fill forms for On-Chain, Off-Chain, atau Social data
3. Submit each form untuk process data
4. View results in dashboard

---

## 🔧 Konfigurasi

### **Environment Variables**
Tidak ada environment variables yang required untuk basic usage. Blockchain API sudah pre-configured dengan public Infura endpoint.

### **API Configuration**
```typescript
// src/lib/blockchain-api.ts
const INFURA_ENDPOINT = 'https://sepolia.infura.io/v3/f8d248f838ec4f12b0f01efd2b238206'
```

### **Storage Configuration**
```typescript
// src/lib/sample-data.ts
export const STORAGE_KEY = 'stc-impactviz-data'
```

### **Currency Configuration**
```typescript
// src/lib/currency.ts
export const CURRENCIES: Record<Currency, CurrencyConfig> = {
  USD: { symbol: '$', rate: 1, locale: 'en-US' },
  IDR: { symbol: 'Rp', rate: 15750, locale: 'id-ID' }
}
```

---

## 📊 Fitur Lanjutan

### **Export Chart Utility**

```typescript
import { exportChartAsImage, exportChartsAsPDF } from '@/lib/chart-export'

// Export single chart
await exportChartAsImage(elementRef, {
  filename: 'sustainability-report',
  format: 'png',
  quality: 0.95,
  scale: 2
})

// Export multiple charts to PDF
await exportChartsAsPDF(chartRefs, {
  filename: 'quarterly-report',
  title: 'Q1 2024 Sustainability Report'
})
```

### **Blockchain API**

```typescript
import { 
  fetchBlockchainData, 
  getTransaction,
  monitorAddress,
  getNetworkStats 
} from '@/lib/blockchain-api'

// Fetch recent transactions
const { transactions, stats } = await fetchBlockchainData(10)

// Get specific transaction
const tx = await getTransaction('0x...')

// Monitor address
const txs = await monitorAddress('0x...', fromBlock)

// Get network stats
const stats = await getNetworkStats()
```

### **Data Persistence**

```typescript
import { 
  saveDataToStorage, 
  loadDataFromStorage,
  parseCSVData 
} from '@/lib/sample-data'

// Save data
saveDataToStorage(data)

// Load data
const data = loadDataFromStorage()

// Parse CSV
const parsed = parseCSVData(csvText)
```

---

## 🎯 Roadmap

### **Q2 2024**
- [ ] Multi-user authentication & authorization
- [ ] Cloud data sync (Firebase/Supabase)
- [ ] Advanced notification system
- [ ] PWA support untuk mobile installation

### **Q3 2024**
- [ ] API integration dengan real blockchain networks (Mainnet)
- [ ] Advanced ML models (deep learning)
- [ ] Custom dashboard builder
- [ ] White-label customization

### **Q4 2024**
- [ ] Multi-language expansion (English, Spanish, Chinese)
- [ ] Mobile app (React Native)
- [ ] Enterprise features (multi-workspace, SSO)
- [ ] API marketplace integration

---

## 🤝 Kontribusi

Kami sangat welcome untuk contributions! Silakan baca [CONTRIBUTING.md](CONTRIBUTING.md) untuk guidelines.

### **Cara Berkontribusi**

1. Fork repository ini
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

### **Code Style**
- TypeScript strict mode
- ESLint configuration
- Prettier formatting
- Component-based architecture

---

## 📝 Lisensi

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👥 Tim

**STC ImpactViz Development Team**

- Product Owner: [Your Name]
- Lead Developer: [Your Name]
- UI/UX Designer: [Your Name]
- Data Scientist: [Your Name]

---

## 📞 Kontak & Support

- **Website**: https://stc-impactviz.com
- **Email**: support@stc-impactviz.com
- **GitHub Issues**: [Report Bug](https://github.com/yourusername/stc-impactviz/issues)
- **Discussions**: [GitHub Discussions](https://github.com/yourusername/stc-impactviz/discussions)

---

## 🙏 Acknowledgments

- **Next.js Team** - Amazing framework
- **Vercel** - Deployment platform
- **Infura** - Blockchain RPC provider
- **shadcn/ui** - Beautiful UI components
- **Radix UI** - Accessible component primitives
- **Leaflet** - Interactive maps
- **Chart.js** - Data visualization

---

## 📈 Stats

![GitHub stars](https://img.shields.io/github/stars/yourusername/stc-impactviz?style=social)
![GitHub forks](https://img.shields.io/github/forks/yourusername/stc-impactviz?style=social)
![GitHub watchers](https://img.shields.io/github/watchers/yourusername/stc-impactviz?style=social)

---

**Built with ❤️ for sustainable tourism**

*Making tourism sustainability transparent, measurable, and actionable through blockchain technology.*
