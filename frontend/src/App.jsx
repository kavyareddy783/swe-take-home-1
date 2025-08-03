import { useEffect, useState } from 'react';
import Filters from './components/Filters';
import ChartContainer from './components/ChartContainer';
import QualityIndicator from './components/QualityIndicator';
import TrendAnalysis from './components/TrendAnalysis';
import {
  getClimateData,
  getLocations,
  getMetrics,
  getClimateSummary,
  getTrendData
} from './api';

function App() {
  const [locations, setLocations] = useState([]);
  const [metrics, setMetrics] = useState([]);
  const [filters, setFilters] = useState({
    location: '',
    metric: '',
    startDate: '',
    endDate: '',
    qualityThreshold: '',
    analysisType: 'climate' // 'climate' | 'weighted' | 'trends'
  });

  const [climateData, setClimateData] = useState([]);
  const [summaryData, setSummaryData] = useState(null);
  const [trendData, setTrendData] = useState(null);
  const [loading, setLoading] = useState(false);

  // Load locations and metrics on initial mount
  useEffect(() => {
    async function loadInitialData() {
      try {
        const [locRes, metRes] = await Promise.all([
          getLocations(),
          getMetrics()
        ]);
        setLocations(locRes);
        setMetrics(metRes);
      } catch (err) {
        console.error('Error loading initial data:', err);
      }
    }
    loadInitialData();
  }, []);

  const handleFilterChange = (updatedFilters) => {
    setFilters(prev => ({ ...prev, ...updatedFilters }));
  };

  const handleApplyFilters = async () => {
    setLoading(true);
    setClimateData([]);
    setSummaryData(null);
    setTrendData(null);

    try {
      const filterParams = {
        location: filters.location,
        metric: filters.metric,
        start_date: filters.startDate,
        end_date: filters.endDate,
        quality_threshold: filters.qualityThreshold
      };

      if (filters.analysisType === 'climate') {
        const data = await getClimateData(filterParams);
        setClimateData(data);
      } else if (filters.analysisType === 'weighted') {
        const data = await getClimateSummary(filterParams);
        setSummaryData(data);
      } else if (filters.analysisType === 'trends') {
        const data = await getTrendData(filterParams);
        setTrendData(data);
      }
    } catch (err) {
      console.error('Failed to fetch analysis data:', err);
    } finally {
      setLoading(false);
    }
  };

  // Build chartData depending on analysis type
  let chartData = [];
  if (filters.analysisType === 'climate') {
    chartData = climateData;
  } else if (filters.analysisType === 'trends' && trendData) {
    chartData = Object.entries(trendData).flatMap(([metric, analysis]) =>
      analysis.anomalies.map(anomaly => ({
        date: anomaly.date,
        value: anomaly.value,
        deviation: anomaly.deviation,
        location_name: metric,
        quality: anomaly.quality || 'unknown',
        unit: 'Value'
      }))
    );
  } else if (filters.analysisType === 'weighted' && summaryData) {
    chartData = Object.entries(summaryData).map(([metric, stats]) => ({
      date: 'Summary',
      value: stats.avg,
      location_name: metric,
      quality: stats.quality_distribution
        ? Object.entries(stats.quality_distribution).sort((a, b) => b[1] - a[1])[0][0]
        : 'unknown',
      unit: stats.unit
    }));
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        <Filters
          locations={locations}
          metrics={metrics}
          filters={filters}
          onFilterChange={handleFilterChange}
          onApplyFilters={handleApplyFilters}
        />

        <ChartContainer
          title="Climate Data Visualization"
          loading={loading}
          chartType="line"
          data={chartData}
          showQuality={filters.analysisType === 'climate'}
        />

        {filters.analysisType === 'climate' && (
          <QualityIndicator data={climateData} />
        )}

        {filters.analysisType === 'trends' && trendData && (
          <TrendAnalysis data={trendData} loading={loading} />
        )}
      </div>
    </div>
  );
}

export default App;
