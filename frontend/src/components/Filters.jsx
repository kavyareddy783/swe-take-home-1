import { useState } from 'react';

function Filters({ locations, metrics, filters, onFilterChange, onApplyFilters }) {
  // Update individual field
  const handleChange = (field, value) => {
    onFilterChange({ ...filters, [field]: value });
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <h2 className="text-xl font-semibold text-eco-primary col-span-full mb-2">Filter Data</h2>

      {/* Location Selector */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
        <select
          value={filters.locationId}
          onChange={(e) => handleChange('locationId', e.target.value)}
          className="w-full border-gray-300 rounded-md shadow-sm focus:ring-eco-primary focus:border-eco-primary"
        >
          <option value="">Select location</option>
          {locations.map(loc => (
            <option key={loc.id} value={loc.id}>{loc.name}, {loc.country}</option>
          ))}
        </select>
      </div>

      {/* Metric Selector */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Metric</label>
        <select
          value={filters.metric}
          onChange={(e) => handleChange('metric', e.target.value)}
          className="w-full border-gray-300 rounded-md shadow-sm focus:ring-eco-primary focus:border-eco-primary"
        >
          <option value="">Select metric</option>
          {metrics.map(m => (
            <option key={m.id} value={m.name}>{m.display_name}</option>
          ))}
        </select>
      </div>

      {/* Quality Threshold */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Quality Threshold</label>
        <select
          value={filters.qualityThreshold}
          onChange={(e) => handleChange('qualityThreshold', e.target.value)}
          className="w-full border-gray-300 rounded-md shadow-sm focus:ring-eco-primary focus:border-eco-primary"
        >
          <option value="">Any</option>
          <option value="excellent">Excellent</option>
          <option value="good">Good</option>
          <option value="poor">Poor</option>
          <option value="questionable">Questionable</option>
        </select>
      </div>

      {/* Start Date */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
        <input
          type="date"
          value={filters.startDate}
          onChange={(e) => handleChange('startDate', e.target.value)}
          className="w-full border-gray-300 rounded-md shadow-sm focus:ring-eco-primary focus:border-eco-primary"
        />
      </div>

      {/* End Date */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
        <input
          type="date"
          value={filters.endDate}
          onChange={(e) => handleChange('endDate', e.target.value)}
          className="w-full border-gray-300 rounded-md shadow-sm focus:ring-eco-primary focus:border-eco-primary"
        />
      </div>

      {/* Analysis Type */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Analysis Type</label>
        <select
          value={filters.analysisType}
          onChange={(e) => handleChange('analysisType', e.target.value)}
          className="w-full border-gray-300 rounded-md shadow-sm focus:ring-eco-primary focus:border-eco-primary"
        >
          <option value="raw">Raw Data</option>
          <option value="trends">Trends</option>
          <option value="weighted">Weighted Summary</option>
        </select>
      </div>

      {/* Apply Button */}
      <div className="col-span-full flex justify-end mt-4">
        <button
          onClick={onApplyFilters}
          className="bg-eco-primary hover:bg-eco-primary-dark text-white px-6 py-2 rounded-md shadow"
        >
          Apply Filters
        </button>
      </div>
    </div>
  );
}

export default Filters;
