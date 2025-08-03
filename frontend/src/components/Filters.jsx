import { useState } from 'react';

function Filters({ locations = [], metrics = [], filters, onFilterChange, onApplyFilters }) {
  const handleChange = (e) => {
    const { name, value } = e.target;
    onFilterChange({ [name]: value });
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold text-eco-primary mb-4">Filter Data</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Location Dropdown */}
        <div>
          <label className="block text-sm font-medium mb-1">Location</label>
          <select
            name="location"
            value={filters.location}
            onChange={handleChange}
            className="w-full border rounded p-2"
          >
            <option value="">All Locations</option>
            {Array.isArray(locations) && locations.map(loc => (
              <option key={loc.id} value={loc.id}>{loc.name}</option>
            ))}
          </select>
        </div>

        {/* Metric Dropdown */}
        <div>
          <label className="block text-sm font-medium mb-1">Metric</label>
          <select
            name="metric"
            value={filters.metric}
            onChange={handleChange}
            className="w-full border rounded p-2"
          >
            <option value="">All Metrics</option>
            {Array.isArray(metrics) && metrics.map(metric => (
              <option key={metric.id} value={metric.id}>{metric.name}</option>
            ))}
          </select>
        </div>

        {/* Quality Threshold */}
        <div>
          <label className="block text-sm font-medium mb-1">Quality Threshold</label>
          <input
            type="number"
            name="qualityThreshold"
            value={filters.qualityThreshold}
            onChange={handleChange}
            placeholder="e.g. 0.8"
            className="w-full border rounded p-2"
          />
        </div>

        {/* Start Date */}
        <div>
          <label className="block text-sm font-medium mb-1">Start Date</label>
          <input
            type="date"
            name="startDate"
            value={filters.startDate}
            onChange={handleChange}
            className="w-full border rounded p-2"
          />
        </div>

        {/* End Date */}
        <div>
          <label className="block text-sm font-medium mb-1">End Date</label>
          <input
            type="date"
            name="endDate"
            value={filters.endDate}
            onChange={handleChange}
            className="w-full border rounded p-2"
          />
        </div>

        {/* Analysis Type */}
        <div>
          <label className="block text-sm font-medium mb-1">Analysis Type</label>
          <select
            name="analysisType"
            value={filters.analysisType}
            onChange={handleChange}
            className="w-full border rounded p-2"
          >
            <option value="climate">Raw Climate</option>
            <option value="weighted">Weighted Summary</option>
            <option value="trends">Trend Analysis</option>
          </select>
        </div>
      </div>

      <div className="mt-4 text-right">
        <button
          onClick={onApplyFilters}
          className="bg-eco-primary text-white px-4 py-2 rounded hover:bg-eco-primary-dark"
        >
          Apply Filters
        </button>
      </div>
    </div>
  );
}

export default Filters;
