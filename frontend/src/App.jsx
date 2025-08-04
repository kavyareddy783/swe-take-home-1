import { useState, useEffect } from 'react';
import Filters from './components/Filters';
import ChartContainer from './components/ChartContainer';
import TrendAnalysis from './components/TrendAnalysis';
import QualityIndicator from './components/QualityIndicator';

import {
  getLocations,
  getMetrics,
  getClimateData,
  getTrendData,
  getClimateSummary
} from './api';

function App() {
  const [locations, setLocations] = useState([]);
  const [metrics, setMetrics] = useState([]);
  const [climateData, setClimateData] = useState([]);
  const [trendData, setTrendData] = useState(null);
  const [filters, setFilters] = useState({
    locationId: '',
    startDate: '',
    endDate: '',
    metric: '',
    qualityThreshold: '',
    analysisType: 'raw'
  });
  const [loading, setLoading] = useState(false);

  // Load available locations and metrics on mount
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const [locationsData, metricsData] = await Promise.all([
          getLocations(),
          getMetrics()
        ]);
        setLocations(locationsData);
        setMetrics(metricsData);
      } catch (error) {
        console.error('Failed to load initial data:', error);
      }
    };

    loadInitialData();
  }, []);

  // Fetch data based on current filters
  const fetchData = async () => {
    if (!filters.metric) {
      alert("Please select a metric before applying filters.");
      return; // metric is required
    }


    setLoading(true);
    try {
      if (filters.analysisType === 'trends') {
        const data = await getTrendData(filters.metric);
        console.log("Fetched trend data:", data);
        setTrendData(data);
        setClimateData([]); // Clear other data
      } else if (filters.analysisType === 'weighted') {
        const summary = await getClimateSummary(filters);
        const summaryMetricData = summary[filters.metric];
        console.log("Fetched trend data:", summaryMetricData);
        setClimateData(summaryMetricData || {});
        setTrendData(null);
      } else {
        const rawData = await getClimateData(filters);
        setClimateData(rawData || []);
        setTrendData(null);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <header className="mb-8 text-center">
        <h1 className="text-4xl font-bold text-eco-primary mb-2">
          EcoVision: Climate Visualizer
        </h1>
        <p className="text-gray-600 italic">
          Transforming climate data into actionable insights for a sustainable future
        </p>
      </header>

      <Filters
        locations={locations}
        metrics={metrics}
        filters={filters}
        onFilterChange={setFilters}
        onApplyFilters={fetchData}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
        {filters.analysisType === 'trends' ? (
          <TrendAnalysis
            data={trendData}
            loading={loading}
          />
        ) : (
          <>
            <ChartContainer
              title="Climate Trends"
              loading={loading}
              chartType="line"
              data={climateData}
              showQuality={true}
            />
            <ChartContainer
              title="Quality Distribution"
              loading={loading}
              chartType="bar"
              data={climateData}
              showQuality={true}
            />
          </>
        )}
      </div>

      <QualityIndicator
        data={
          filters.analysisType === 'weighted'
            ? climateData.quality_distribution
            : climateData
        }
        className="mt-6"
      />
    </div>
  );
}

export default App;
