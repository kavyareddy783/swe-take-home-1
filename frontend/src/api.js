/**
 * API service module for making requests to the backend
 */

const API_BASE_URL = '/api/v1';

/**
 * Utility: Build query string from filters
 */
const buildQueryParams = (filters = {}) => {
  return new URLSearchParams({
    ...(filters.locationId && { location_id: filters.locationId }),
    ...(filters.metric && { metric: filters.metric }),
    ...(filters.startDate && { start_date: filters.startDate }),
    ...(filters.endDate && { end_date: filters.endDate }),
    ...(filters.qualityThreshold && { quality_threshold: filters.qualityThreshold })
  });
};

/**
 * Get climate data (time-series) with optional filters
 * @param {Object} filters - Filtering parameters
 * @returns {Promise<Array>} - Climate data array
 */
export const getClimateData = async (filters = {}) => {
  try {
    const params = buildQueryParams(filters);
    const res = await fetch(`${API_BASE_URL}/climate?${params}`);
    const json = await res.json();
    return json.data;
  } catch (error) {
    console.error('API Error (getClimateData):', error);
    throw error;
  }
};

/**
 * Get all available locations
 * @returns {Promise<Array>} - List of locations
 */
export const getLocations = async () => {
  try {
    const res = await fetch(`${API_BASE_URL}/locations`);
    const json = await res.json();
    return json.data;
  } catch (error) {
    console.error('API Error (getLocations):', error);
    throw error;
  }
};

/**
 * Get all available metrics
 * @returns {Promise<Array>} - List of metrics
 */
export const getMetrics = async () => {
  try {
    const res = await fetch(`${API_BASE_URL}/metrics`);
    const json = await res.json();
    return json.data;
  } catch (error) {
    console.error('API Error (getMetrics):', error);
    throw error;
  }
};

/**
 * Get climate summary statistics (min, max, avg, quality breakdown)
 * @param {Object} filters - Optional filter parameters
 * @returns {Promise<Object>} - Summary keyed by metric
 */
export const getClimateSummary = async (filters = {}) => {
  try {
    const params = buildQueryParams(filters);
    const res = await fetch(`${API_BASE_URL}/summary?${params}`);
    const json = await res.json();
    return json.data;
  } catch (error) {
    console.error('API Error (getClimateSummary):', error);
    throw error;
  }
};

/**
 * Get trend analysis data for a specific metric
 * @param {string} metric - Metric name (e.g., 'temperature')
 * @returns {Promise<Object>} - Trend data
 */
export const getTrendData = async (metric) => {
  try {
    const res = await fetch(`${API_BASE_URL}/trends?metric=${metric}`);
    const data = await res.json();
    return data[metric];
  } catch (error) {
    console.error('API Error (getTrendData):', error);
    throw error;
  }
};
