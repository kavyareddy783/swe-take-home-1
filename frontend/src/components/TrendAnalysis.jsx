// src/components/TrendAnalysis.jsx
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

// src/components/TrendAnalysis.jsx

import React from 'react';

// Single stat display
function TrendStat({ label, value, icon }) {
  return (
    <div className="flex justify-between items-center text-sm mb-2">
      <span className="text-gray-600">{label}:</span>
      <span className="font-medium flex items-center gap-1">
        {icon && <span>{icon}</span>}
        {value}
      </span>
    </div>
  );
}

// Icon for trend direction
function getTrendIcon(direction) {
  switch (direction?.toLowerCase()) {
    case 'increasing':
      return '↗️';
    case 'decreasing':
      return '↘️';
    case 'stable':
      return '➡️';
    default:
      return null;
  }
}

// Main component
function TrendAnalysis({ data, loading }) {
  if (loading) {
    return (
      <div className="bg-white p-4 rounded-lg shadow-md animate-pulse">
        <div className="h-64 bg-gray-200 rounded" />
      </div>
    );
  }

  if (!data || !data.trend) {
    return (
      <div className="bg-white p-4 rounded-lg shadow-md text-gray-500 italic">
        No trend data available.
      </div>
    );
  }

  const { trend, seasonality, anomalies } = data;

  return (
    <div className="space-y-6">
      {/* Trend Overview */}
      <div className="bg-white p-4 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold mb-4">Trend Overview</h3>
        <TrendStat
          label="Trend Direction"
          value={trend.direction}
          icon={getTrendIcon(trend.direction)}
        />
        <TrendStat
          label="Rate of Change"
          value={`${trend.rate} ${trend.unit}`}
        />
        <TrendStat
          label="Confidence"
          value={`${(trend.confidence * 100).toFixed(1)}%`}
        />
      </div>

      {/* Seasonality */}
      {seasonality?.detected && (
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-4">Seasonality</h3>
          <p className="text-sm mb-2">Period: {seasonality.period}</p>
          <p className="text-sm mb-4">
            Confidence: {(seasonality.confidence * 100).toFixed(1)}%
          </p>
          <div className="grid grid-cols-2 gap-4">
            {Object.entries(seasonality.pattern).map(([season, seasonData]) => (
              <div key={season} className="text-sm flex justify-between">
                <span className="capitalize">{season}</span>
                <span>
                  {seasonData.avg !== null
                    ? `${seasonData.avg.toFixed(1)} (${seasonData.trend})`
                    : `N/A (${seasonData.trend})`}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Anomalies */}
      {anomalies?.length > 0 && (
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-4">Detected Anomalies</h3>
          <div className="space-y-2">
            {anomalies.map((anomaly, index) => (
              <div key={index} className="flex justify-between text-sm">
                <span>{new Date(anomaly.date).toLocaleDateString()}</span>
                <span>{anomaly.value}</span>
                <span
                  className={`px-2 py-1 rounded text-xs ${
                    anomaly.deviation > 3
                      ? 'bg-red-100 text-red-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}
                >
                  {anomaly.deviation.toFixed(1)} σ
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default TrendAnalysis;
