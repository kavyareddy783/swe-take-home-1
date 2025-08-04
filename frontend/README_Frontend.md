# 🌱 EcoVision Frontend

Welcome to the frontend of **EcoVision**, a climate data visualizer that helps users explore environmental trends with ease.

Built with **React**, **Vite**, and **TailwindCSS**, this dashboard connects to the backend and turns raw climate data into beautiful, insightful charts.

---

## 🚀 Quick Start

```bash
npm install       # Install dependencies
npm run dev       # Start local dev server
App will run at: http://localhost:3000

📁 Folder Structure
frontend/
├── src/
│   ├── App.jsx               # Main logic & routing
│   ├── api.js                # API functions
│   ├── main.jsx              # Entry point
│   ├── index.css             # Tailwind styles
│   └── components/
│       ├── Filters.jsx            # Filter UI (metrics, location, etc.)
│       ├── ChartContainer.jsx     # Reusable chart component
│       ├── TrendAnalysis.jsx      # Anomaly/trend visualizer
│       └── QualityIndicator.jsx   # Quality breakdown
├── public/
├── index.html
├── package.json
└── vite.config.js
```

### Features

- Filter climate data by location, date, metric, and data quality
- Built-in loading states and responsive design

### 📊 Visualizations for:

 - Raw data trends (line/bar)
 - Summary stats (min, avg, max)
 - Quality distribution
 - Climate anomalies and seasonal patterns
  
### API Endpoints
- /api/v1/climate – raw time-series data
- /api/v1/summary – aggregated stats & quality summary
- /api/v1/trends – trends, seasonal patterns, anomalies
- /api/v1/locations and /api/v1/metrics – for dropdown filters

### Implementated steps
- Fully implemented Filters component from scratch
- Connected all visual components to live API responses
- Conditionally handled:
- Raw arrays (raw data)
- Summary objects (weighted view)
- Trend anomalies and seasonal patterns
- Added color-coded data quality indicators
