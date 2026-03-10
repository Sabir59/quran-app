
import axios from "axios";

/**
 * Create a configured axios instance for a microservice.
 *
 * @param {Object} options
 * @param {string} options.baseURL
 * @param {Object} [options.defaultParams] - Query params applied to every request (can be overridden per request)
 * @returns {import("axios").AxiosInstance}
 */
export default function createApiClient({ baseURL, defaultParams }) {
  if (!baseURL) {
    console.error("createApiClient: baseURL is required but not provided. Please set the appropriate REACT_APP_BASE_URL_* environment variable.");
    throw new Error("createApiClient: baseURL is required");
  }

  const client = axios.create({
    baseURL,
    timeout: 30000,
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  });

  client.interceptors.request.use(
    (config) => {
      // Merge default params first, then allow per-request params to override.
      if (defaultParams) {
        config.params = { ...defaultParams, ...(config.params || {}) };
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  client.interceptors.response.use(
    (response) => response,
    (error) => Promise.reject(error?.response ?? error)
  );

  return client;
}
