const API_BASE_URL = '/api/v1';

/**
 * Helper to build query string from filters object
 * @param {Object} filters
 * @returns {string}
 */
const buildQueryParams = (filters) => {
  const params = new URLSearchParams();

  Object.entries(filters).forEach(([key, value]) => {
    if (value !== '' && value !== null && value !== undefined) {
      // Convert camelCase to snake_case if needed (e.g. locationId -> location_id)
      const snakeKey = key.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
      params.append(snakeKey, value);
    }
  });

  return params.toString();
};

/**
 * Fetch climate data with optional filters
 * @param {Object} filters - Filter parameters
 * @returns {Promise<Object>}
 */
export const getClimateData = async (filters = {}) => {
  try {
    const queryString = buildQueryParams(filters);
    const res = await fetch(`${API_BASE_URL}/climate?${queryString}`);
    if (!res.ok) throw new Error(`Failed to fetch climate data: ${res.status}`);
    return await res.json();
  } catch (error) {
    console.error('API Error (getClimateData):', error);
    throw error;
  }
};

/**
 * Fetch all available locations
 * @returns {Promise<Object>}
 */
export const getLocations = async () => {
  try {
    const res = await fetch(`${API_BASE_URL}/locations`);
    if (!res.ok) throw new Error(`Failed to fetch locations: ${res.status}`);
    return await res.json();
  } catch (error) {
    console.error('API Error (getLocations):', error);
    throw error;
  }
};

/**
 * Fetch all available metrics
 * @returns {Promise<Object>}
 */
export const getMetrics = async () => {
  try {
    const res = await fetch(`${API_BASE_URL}/metrics`);
    if (!res.ok) throw new Error(`Failed to fetch metrics: ${res.status}`);
    return await res.json();
  } catch (error) {
    console.error('API Error (getMetrics):', error);
    throw error;
  }
};

/**
 * Fetch climate summary statistics with optional filters
 * @param {Object} filters - Filter parameters
 * @returns {Promise<Object>}
 */
export const getClimateSummary = async (filters = {}) => {
  try {
    const queryString = buildQueryParams(filters);
    const res = await fetch(`${API_BASE_URL}/summary?${queryString}`);
    if (!res.ok) throw new Error(`Failed to fetch climate summary: ${res.status}`);
    return await res.json();
  } catch (error) {
    console.error('API Error (getClimateSummary):', error);
    throw error;
  }
};

/**
 * Fetch trend data with optional filters
 * @param {Object} filters - Filter parameters
 * @returns {Promise<Object>}
 */
export const getTrendData = async (filters = {}) => {
  try {
    const queryString = buildQueryParams(filters);
    const res = await fetch(`${API_BASE_URL}/trends?${queryString}`);
    if (!res.ok) throw new Error(`Failed to fetch trend data: ${res.status}`);
    return await res.json();
  } catch (error) {
    console.error('API Error (getTrendData):', error);
    throw error;
  }
};
