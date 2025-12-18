// API configuration and utilities

// Simulated network delay range (ms)
const MIN_DELAY = 300;
const MAX_DELAY = 800;

// Error simulation flag - can be toggled via URL param ?simulateError=true
// or programmatically for demo purposes
let simulateErrors = false;

export const setSimulateErrors = (value: boolean) => {
  simulateErrors = value;
};

export const getSimulateErrors = () => simulateErrors;

// Check URL params on load
if (typeof window !== "undefined") {
  const params = new URLSearchParams(window.location.search);
  simulateErrors = params.get("simulateError") === "true";
}

/**
 * Simulates network delay to make the mock API feel realistic
 */
export const simulateDelay = (): Promise<void> => {
  const delay = Math.random() * (MAX_DELAY - MIN_DELAY) + MIN_DELAY;
  return new Promise((resolve) => setTimeout(resolve, delay));
};

/**
 * Simulates a potential API error based on error rate
 * @param errorRate - Probability of error (0-1), default 0 unless errors enabled
 */
export const maybeThrowError = (errorRate = 0.3): void => {
  if (simulateErrors && Math.random() < errorRate) {
    const errors = [
      "Network connection failed",
      "Server timeout - please try again",
      "Unable to reach server",
      "Service temporarily unavailable",
    ];
    throw new Error(errors[Math.floor(Math.random() * errors.length)]);
  }
};

/**
 * Wraps an API call with delay and potential error simulation
 */
export const withNetworkSimulation = async <T>(
  fn: () => T,
  errorRate = 0.5
): Promise<T> => {
  await simulateDelay();
  maybeThrowError(errorRate);
  return fn();
};
